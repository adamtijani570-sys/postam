"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar"; // Kept exactly as you provided
import {
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// --- Recharts Imports ---
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Transactions are loaded from the Postam API through /api/postam/transactions.
// The API token stays server-side in POSTAM_API_TOKEN.

function formatApiTransaction(tx, index) {
  const amount = Number(tx?.amount ?? tx?.gatewayResponse?.amount ?? 0);
  const rawType = String(tx?.type ?? tx?.assetType ?? "transaction").toLowerCase();
  const isPositive = ["earn", "earning", "reward", "credit"].some((word) => rawType.includes(word));
  const dateValue = tx?.createdAt ?? tx?.updatedAt ?? tx?.date;
  const date = dateValue
    ? new Date(dateValue).toLocaleString()
    : "—";
  const from = tx?.gatewayResponse?.from;
  const to = tx?.gatewayResponse?.to;
  const source = from && to
    ? `${from} → ${to}`
    : tx?.source ?? tx?.reference ?? rawType;
  const userValue = tx?.user?.username ?? tx?.user?.name ?? tx?.user?.email ?? tx?.user ?? "API transaction";
  const user = typeof userValue === "string" ? userValue : "API transaction";

  return {
    id: tx?._id ?? tx?.id ?? tx?.reference ?? `transaction-${index}`,
    user,
    initials: user.charAt(0).toUpperCase() || "T",
    type: rawType.charAt(0).toUpperCase() + rawType.slice(1),
    amount: `${isPositive ? "+" : ""}${amount.toLocaleString()}`,
    source,
    date,
    status: String(tx?.status ?? "Unknown").replace(/^./, (char) => char.toUpperCase()),
    isPositive,
    color: "bg-purple-100 text-purple-700",
    searchText: [user, rawType, source, tx?.reference, tx?.status].filter(Boolean).join(" ").toLowerCase(),
  };
}

// --- Data for the Chart (Day, Week, Month, Year) ---
const chartDataSets = {
  Day: [
    { date: "12 AM", earned: 400, redeemed: 200 },
    { date: "4 AM", earned: 300, redeemed: 100 },
    { date: "8 AM", earned: 1200, redeemed: 500 },
    { date: "12 PM", earned: 2800, redeemed: 1500 },
    { date: "4 PM", earned: 2200, redeemed: 1800 },
    { date: "8 PM", earned: 1800, redeemed: 1200 },
    { date: "11 PM", earned: 900, redeemed: 600 },
  ],
  Week: [
    { date: "Mon", earned: 2000, redeemed: 1200 },
    { date: "Tue", earned: 3200, redeemed: 1800 },
    { date: "Wed", earned: 2800, redeemed: 2100 },
    { date: "Thu", earned: 4100, redeemed: 2400 },
    { date: "Fri", earned: 3800, redeemed: 3000 },
    { date: "Sat", earned: 2200, redeemed: 1500 },
    { date: "Sun", earned: 1800, redeemed: 900 },
  ],
  Month: [
    { date: "1 Oct", earned: 1800, redeemed: 700 },
    { date: "3 Oct", earned: 2600, redeemed: 1200 },
    { date: "7 Oct", earned: 2200, redeemed: 1500 },
    { date: "10 Oct", earned: 2900, redeemed: 1000 },
    { date: "14 Oct", earned: 3800, redeemed: 2800 },
    { date: "20 Oct", earned: 1800, redeemed: 2600 },
    { date: "23 Oct", earned: 500, redeemed: 3400 },
    { date: "27 Oct", earned: 1800, redeemed: 3500 },
    { date: "30 Oct", earned: 3800, redeemed: 1800 },
  ],
  Year: [
    { date: "Jan", earned: 12000, redeemed: 8000 },
    { date: "Feb", earned: 15000, redeemed: 10000 },
    { date: "Mar", earned: 14000, redeemed: 11000 },
    { date: "Apr", earned: 18000, redeemed: 12000 },
    { date: "May", earned: 22000, redeemed: 15000 },
    { date: "Jun", earned: 19000, redeemed: 14000 },
    { date: "Jul", earned: 24000, redeemed: 18000 },
    { date: "Aug", earned: 26000, redeemed: 19000 },
    { date: "Sep", earned: 21000, redeemed: 16000 },
    { date: "Oct", earned: 28000, redeemed: 20000 },
    { date: "Nov", earned: 30000, redeemed: 22000 },
    { date: "Dec", earned: 35000, redeemed: 25000 },
  ],
};

export default function Wallet() {
  const [activeModal, setActiveModal] = useState(null);
  const [chartTab, setChartTab] = useState("Month"); // Default to Month matching design
  const [tableTab, setTableTab] = useState("All Transactions");
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTransactions() {
      try {
        setTransactionsLoading(true);
        setTransactionsError("");
        const response = await fetch("/api/postam/transactions", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result?.message || "Unable to load Postam transactions.");
        }

        const rows = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.data?.data)
              ? result.data.data
              : Array.isArray(result?.transactions)
                ? result.transactions
                : Array.isArray(result?.results)
                  ? result.results
                  : [];

        setTransactions(rows.map(formatApiTransaction));
      } catch (error) {
        if (error.name !== "AbortError") {
          setTransactionsError(error.message || "Unable to load transactions.");
        }
      } finally {
        if (!controller.signal.aborted) setTransactionsLoading(false);
      }
    }

    loadTransactions();
    return () => controller.abort();
  }, []);

  const closeModal = () => setActiveModal(null);

  // Filter real API transactions based on the selected tab and search query.
  const filteredTransactions = transactions.filter((tx) => {
    const matchesTab =
      tableTab === "All Transactions" ||
      tx.type.toLowerCase() === tableTab.toLowerCase();
    const matchesSearch =
      !searchQuery || tx.searchText.includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const successfulTransactions = transactions.filter(
    (tx) => tx.status.toLowerCase() === "success" || tx.status.toLowerCase() === "completed"
  ).length;
  const failedTransactions = transactions.filter((tx) =>
    ["failed", "rejected", "error"].includes(tx.status.toLowerCase())
  ).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Kept exactly as requested */}
      <Sidebar />
      
      <main className="ml-[280px] p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#24283b]">Points & Wallet Management</h1>
          <p className="mt-1 text-sm text-[#85899a]">
            Track points transactions, manage conversions, and control platform economy.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column (Stats, Conversion, Chart, Table) */}
          <div className="col-span-9 flex flex-col gap-6">
            
            {/* Top Stats Row */}
            <div className="grid grid-cols-3 gap-6">
              <StatCard
                title="Transactions Loaded"
                value={transactionsLoading ? "…" : transactions.length.toLocaleString()}
                subtitle="From the configured API token"
                icon={<Coins className="text-[#d9a82c]" size={20} />}
              />
              <StatCard
                title="Successful Transactions"
                value={transactionsLoading ? "…" : successfulTransactions.toLocaleString()}
                subtitle="Success or completed status"
                icon={<TrendingUp className="text-[#26a65b]" size={20} />}
              />
              <StatCard
                title="Failed Transactions"
                value={transactionsLoading ? "…" : failedTransactions.toLocaleString()}
                subtitle="Failed, rejected or error status"
                icon={<TrendingDown className="text-[#e74c3c]" size={20} />}
              />
            </div>

            {/* Conversion Rates */}
            <div className="rounded-xl border border-[#eeeeF4] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-[#24283b]">Conversion Rates</h3>
              <div className="flex items-end gap-4">
                
                {/* Naira Rate Box */}
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-[#85899a]">Base Rate (Naira)</label>
                  <div className="flex items-center rounded-lg border border-[#e7e7ef] bg-[#f8f9fa] p-1">
                    <input type="text" defaultValue="100 coins" className="w-full bg-transparent px-3 py-1.5 text-sm text-[#24283b] outline-none" readOnly />
                    <span className="flex items-center px-3 text-sm text-[#85899a]">=</span>
                    <input type="text" defaultValue="₦1" className="w-full bg-transparent px-3 py-1.5 text-sm text-[#24283b] outline-none" readOnly />
                  </div>
                </div>

                {/* Dollar Rate Box */}
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-[#85899a]">Base Rate (Dollar)</label>
                  <div className="flex items-center rounded-lg border border-[#e7e7ef] bg-[#f8f9fa] p-1">
                    <input type="text" defaultValue="150 coins" className="w-full bg-transparent px-3 py-1.5 text-sm text-[#24283b] outline-none" readOnly />
                    <span className="flex items-center px-3 text-sm text-[#85899a]">=</span>
                    <input type="text" defaultValue="$1.20" className="w-full bg-transparent px-3 py-1.5 text-sm text-[#24283b] outline-none" readOnly />
                  </div>
                </div>

                <button 
                  onClick={() => setActiveModal("updateRates")}
                  className="rounded-lg bg-[#7555ff] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#6344e6] transition-colors"
                >
                  Update Rates
                </button>
              </div>
            </div>

            {/* Chart Section */}
            <div className="rounded-xl border border-[#eeeeF4] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#24283b]">Points Flow</h3>
                  <p className="mt-1 text-xs text-[#85899a]">Sample chart data — a platform analytics endpoint is needed for live totals.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-black"><span className="h-2 w-2 rounded-full bg-[#7555ff]"></span> Points Earned</div>
                    <div className="flex items-center gap-1.5 text-black"><span className="h-2 w-2 rounded-full bg-[#d4ccff]"></span> Points Redeemed</div>
                  </div>
                  
                  {/* Functional Chart Tabs */}
                  <div className="flex rounded-lg border border-[#e7e7ef] bg-[#f8f9fa] p-1">
                    {["Day", "Week", "Month", "Year"].map((tab) => (
                      <button 
                        key={tab} 
                        onClick={() => setChartTab(tab)}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                          chartTab === tab 
                            ? "bg-white text-[#24283b] shadow-sm" 
                            : "text-[#85899a] hover:text-[#24283b]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recharts Dynamic Chart Area */}
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartDataSets[chartTab]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f5" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#85899a', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#85899a', fontSize: 12 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f0f0f5', strokeWidth: 2 }} />
                    <Line 
                      type="monotone" 
                      dataKey="earned" 
                      stroke="#7555ff" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6, fill: '#7555ff', stroke: '#fff', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="redeemed" 
                      stroke="#d4ccff" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6, fill: '#d4ccff', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-xl border border-[#eeeeF4] bg-white shadow-sm overflow-hidden">
              {/* Functional Table Tabs */}
              <div className="flex border-b border-[#eeeeF4] px-6">
                {["All Transactions", "Exchange", "Withdrawal"].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setTableTab(tab)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      tableTab === tab 
                        ? "border-[#7555ff] text-[#7555ff]" 
                        : "border-transparent text-[#85899a] hover:text-[#24283b]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search & Filters */}
              <div className="flex items-center justify-between border-b border-[#eeeeF4] p-4">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85899a]" size={16} />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full rounded-lg border border-[#e7e7ef] bg-[#f8f9fa] py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7555ff] focus:bg-white text-black"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 rounded-lg border border-[#e7e7ef] px-4 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]">
                    <Filter size={16} /> Filters
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-[#e7e7ef] px-4 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]">
                    <Download size={16} /> Export
                  </button>
                </div>
              </div>

              {transactionsLoading && (
                <div className="flex items-center gap-2 border-b border-[#eeeeF4] px-6 py-4 text-sm text-[#85899a]">
                  <Loader2 size={16} className="animate-spin" /> Loading transactions from Postam API…
                </div>
              )}
              {!transactionsLoading && transactionsError && (
                <div className="flex items-start gap-2 border-b border-red-100 bg-red-50 px-6 py-4 text-sm text-red-700">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Could not load transactions</p>
                    <p className="mt-1">{transactionsError}</p>
                    <p className="mt-1 text-xs">Check POSTAM_API_TOKEN and the API response in your terminal.</p>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f8f9fa] text-xs text-[#85899a]">
                    <tr>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Source/Destination</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f5]">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${tx.color}`}>
                              {tx.initials}
                            </div>
                            <span className="font-medium text-[#24283b]">{tx.user}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#85899a]">{tx.type}</td>
                        <td className={`px-6 py-4 font-medium ${tx.isPositive ? "text-[#26a65b]" : "text-[#e74c3c]"}`}>
                          {tx.amount}
                        </td>
                        <td className="px-6 py-4 text-[#85899a]">{tx.source}</td>
                        <td className="px-6 py-4 text-[#85899a]">{tx.date}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-xs font-medium text-[#2e7d32]">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-[#85899a]">
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (Quick Actions) */}
          <div className="col-span-3">
            <div className="rounded-xl border border-[#eeeeF4] bg-white p-6 shadow-sm sticky top-8">
              <h3 className="mb-4 text-base font-semibold text-[#24283b]">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setActiveModal("airdrop")}
                  className="w-full rounded-lg bg-[#7555ff] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6344e6] transition-colors"
                >
                  Create Airdrop Campaign
                </button>
                <button 
                  onClick={() => setActiveModal("dailyRewards")}
                  className="w-full rounded-lg border border-[#e7e7ef] px-4 py-2.5 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa] transition-colors"
                >
                  Daily Reward Settings
                </button>
                <button 
                  onClick={() => setActiveModal("referralBonus")}
                  className="w-full rounded-lg border border-[#e7e7ef] px-4 py-2.5 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa] transition-colors"
                >
                  Referral Bonus Settings
                </button>
                <button 
                  onClick={() => setActiveModal("manualAdjustment")}
                  className="w-full rounded-lg border border-[#e7e7ef] px-4 py-2.5 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa] transition-colors"
                >
                  Manual Coin Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================
          MODALS
      ========================================= */}

      {/* 1. Update Conversion Rates Modal */}
      {activeModal === "updateRates" && (
        <ModalWrapper title="Update Conversion Rates" onClose={closeModal}>
          <p className="mb-4 text-sm text-[#85899a]">Configure coin exchange rates</p>
          
          <div className="mb-6 rounded-lg bg-[#fffbeb] p-4 border border-[#fef08a]">
            <div className="flex items-center gap-2 text-[#d97706] font-medium text-sm mb-1">
              <AlertTriangle size={16} /> Important Notice
            </div>
            <p className="text-xs text-[#b45309]">
              Changing conversion rates will affect all future transactions. Existing pending payouts will use the new rates.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-[#85899a]">Current Rate (₦)</label>
                <div className="flex rounded-lg border border-[#e7e7ef] overflow-hidden bg-[#f8f9fa]">
                  <input type="text" defaultValue="100 points" className="w-full bg-transparent px-3 py-2 text-sm text-[#24283b] outline-none" readOnly />
                  <span className="flex items-center px-3 text-sm text-[#85899a] border-l border-[#e7e7ef] bg-white">=</span>
                  <input type="text" defaultValue="₦1" className="w-full bg-transparent px-3 py-2 text-sm text-[#24283b] outline-none" readOnly />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-[#85899a]">New Rate (₦)</label>
                <div className="flex rounded-lg border border-[#e7e7ef] overflow-hidden bg-white">
                  <input type="text" defaultValue="150 points" className="w-full bg-transparent px-3 py-2 text-sm text-[#24283b] outline-none focus:border-[#7555ff]" />
                  <span className="flex items-center px-3 text-sm text-[#85899a] border-l border-[#e7e7ef] bg-[#f8f9fa]">=</span>
                  <input type="text" defaultValue="₦1" className="w-full bg-transparent px-3 py-2 text-sm text-[#24283b] outline-none focus:border-[#7555ff]" />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-[#85899a]">Current Rate ($)</label>
                <div className="flex rounded-lg border border-[#e7e7ef] overflow-hidden bg-[#f8f9fa]">
                  <input type="text" defaultValue="100 points" className="w-full bg-transparent px-3 py-2 text-sm text-[#24283b] outline-none" readOnly />
                  <span className="flex items-center px-3 text-sm text-[#85899a] border-l border-[#e7e7ef] bg-white">=</span>
                  <input type="text" defaultValue="$1" className="w-full bg-transparent px-3 py-2 text-sm text-[#24283b] outline-none" readOnly />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-[#85899a]">New Rate ($)</label>
                <div className="flex rounded-lg border border-[#e7e7ef] overflow-hidden bg-white">
                  <input type="text" defaultValue="150 points" className="w-full bg-transparent px-3 py-2 text-sm text-[#24283b] outline-none focus:border-[#7555ff]" />
                  <span className="flex items-center px-3 text-sm text-[#85899a] border-l border-[#e7e7ef] bg-[#f8f9fa]">=</span>
                  <input type="text" defaultValue="$1" className="w-full bg-transparent px-3 py-2 text-sm text-[#24283b] outline-none focus:border-[#7555ff]" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Reason for Change</label>
              <textarea 
                placeholder="Document why the conversion rate is being updated..."
                className="w-full rounded-lg border border-[#e7e7ef] p-3 text-sm outline-none focus:border-[#7555ff] h-20 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]">Reset</button>
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>Confirm Update</button>
          </div>
        </ModalWrapper>
      )}

      {/* 2. Create Airdrop Campaign Modal */}
      {activeModal === "airdrop" && (
        <ModalWrapper title="Create Airdrop Campaign" onClose={closeModal}>
          <p className="mb-4 text-sm text-[#85899a]">Distribute coins to multiple users</p>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Campaign Name</label>
              <input type="text" placeholder="e.g. New User Welcome Bonus" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff]" />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-[#85899a]">Points Per User</label>
                <input type="text" placeholder="500" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff]" />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-[#85899a]">Total Budget</label>
                <input type="text" placeholder="100000" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff]" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Target Audience</label>
              <select className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] bg-white text-[#85899a]">
                <option>Select target users</option>
                <option>All Users</option>
                <option>New Users</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Schedule</label>
              <select className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] bg-white">
                <option>Send immediately</option>
                <option>Schedule for later</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Message to Recipients</label>
              <textarea 
                placeholder="Optional message that users will see when they receive the airdrop..."
                className="w-full rounded-lg border border-[#e7e7ef] p-3 text-sm outline-none focus:border-[#7555ff] h-20 resize-none"
              ></textarea>
            </div>

            <div className="rounded-lg bg-[#f0f9ff] p-4 border border-[#bae6fd]">
              <p className="text-xs text-[#0284c7] mb-1">Estimated Recipients: 2,450 users</p>
              <p className="text-xs font-medium text-[#0284c7]">Total Coins to Distribute: 1,225,000 points</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Cancel</button>
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>Create Airdrop</button>
          </div>
        </ModalWrapper>
      )}

      {/* 3. Daily Reward Settings Modal */}
      {activeModal === "dailyRewards" && (
        <ModalWrapper title="Daily Reward Settings" onClose={closeModal}>
          <p className="mb-4 text-sm text-[#85899a]">Configure daily login rewards</p>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-[#24283b]">Enable Daily Rewards</h4>
                <p className="text-xs text-[#85899a]">Allow users to claim daily login bonuses</p>
              </div>
              <ToggleSwitch defaultChecked={true} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Base Reward (Coins)</label>
              <input type="text" defaultValue="50" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff]" />
              <p className="mt-1 text-[10px] text-[#85899a]">Coins users receive for daily login</p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Streak Bonus</label>
              <div className="flex items-center gap-2">
                <input type="text" defaultValue="3" className="w-20 rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] text-center" />
                <span className="text-sm text-[#85899a]">→</span>
                <input type="text" defaultValue="10" className="w-20 rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] text-center" />
                <span className="text-sm text-[#85899a]">coins</span>
              </div>
              <p className="mt-1 text-[10px] text-[#85899a]">Day 3 = +10 coins bonus</p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Maximum Streak Bonus</label>
              <input type="text" defaultValue="100" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff]" />
              <p className="mt-1 text-[10px] text-[#85899a]">Maximum bonus coins for consecutive logins</p>
            </div>

            <div className="rounded-lg bg-[#f0f9ff] p-4 border border-[#bae6fd] flex justify-between items-center">
              <div>
                <p className="text-xs text-[#0284c7]">Estimated daily distribution: <span className="font-bold">~9,375 coins</span></p>
                <p className="text-[10px] text-[#0284c7] mt-0.5">Based on 187,234 active users</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Cancel</button>
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>Save Settings</button>
          </div>
        </ModalWrapper>
      )}

      {/* 4. Referral Bonus Settings Modal */}
      {activeModal === "referralBonus" && (
        <ModalWrapper title="Referral Bonus Settings" onClose={closeModal}>
          <p className="mb-4 text-sm text-[#85899a]">Configure referral reward system</p>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-[#24283b]">Enable Referral Bonuses</h4>
                <p className="text-xs text-[#85899a]">Reward users for referring friends</p>
              </div>
              <ToggleSwitch defaultChecked={true} />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-[#85899a]">Referrer Reward</label>
                <input type="text" defaultValue="500" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff]" />
                <p className="mt-1 text-[10px] text-[#85899a]">Coins for person who refers</p>
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-[#85899a]">New User Reward</label>
                <input type="text" defaultValue="250" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff]" />
                <p className="mt-1 text-[10px] text-[#85899a]">Coins for new user</p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Minimum Activity Required</label>
              <select className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] bg-white text-[#24283b]">
                <option>3 posts or actions</option>
                <option>5 posts or actions</option>
                <option>No minimum</option>
              </select>
              <p className="mt-1 text-[10px] text-[#85899a]">Required activity before reward is granted</p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Maximum Referrals per User</label>
              <input type="text" defaultValue="50" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff]" />
              <p className="mt-1 text-[10px] text-[#85899a]">Limit referrals to prevent abuse</p>
            </div>

            <div className="space-y-2 mt-4">
              <label className="flex items-center gap-2 text-sm text-[#24283b]">
                <input type="checkbox" className="rounded border-[#e7e7ef] text-[#7555ff] focus:ring-[#7555ff]" defaultChecked />
                Bonus for verified referrals only
              </label>
              <label className="flex items-center gap-2 text-sm text-[#24283b]">
                <input type="checkbox" className="rounded border-[#e7e7ef] text-[#7555ff] focus:ring-[#7555ff]" />
                Additional bonus for Premium account type
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Cancel</button>
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>Save Settings</button>
          </div>
        </ModalWrapper>
      )}

      {/* 5. Confirm Points Adjustment Modal */}
      {activeModal === "confirmAdjustment" && (
        <ModalWrapper title="Confirm Points Adjustment" onClose={closeModal}>
          <p className="mb-4 text-sm text-[#85899a]">Review manual wallet adjustments</p>
          
          <div className="mb-6 rounded-lg border border-[#e7e7ef] bg-[#f8f9fa] p-4 text-sm">
            <div className="grid grid-cols-[100px_1fr] gap-y-3">
              <span className="text-[#85899a]">User:</span>
              <span className="font-medium text-[#24283b]">john.adebayo@email.com</span>
              
              <span className="text-[#85899a]">Current Balance:</span>
              <span className="font-medium text-[#24283b]">45,230 points</span>
              
              <span className="text-[#85899a]">Adjustment:</span>
              <span className="font-medium text-[#26a65b]">+1,000 points</span>
              
              <span className="text-[#85899a]">New Balance:</span>
              <span className="font-medium text-[#24283b]">46,230 points</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Reason</label>
              <textarea 
                defaultValue="Compensation for system error"
                className="w-full rounded-lg border border-[#e7e7ef] p-3 text-sm outline-none focus:border-[#7555ff] h-20 resize-none"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-[#24283b]">
                <input type="checkbox" className="rounded border-[#e7e7ef] text-[#7555ff] focus:ring-[#7555ff]" defaultChecked />
                Notify user of adjustment
              </label>
              <label className="flex items-center gap-2 text-sm text-[#24283b]">
                <input type="checkbox" className="rounded border-[#e7e7ef] text-[#7555ff] focus:ring-[#7555ff]" defaultChecked />
                Record in audit log
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Cancel</button>
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>Apply Adjustment</button>
          </div>
        </ModalWrapper>
      )}

      {/* 6. Manual Coin Adjustment Modal */}
      {activeModal === "manualAdjustment" && (
        <ModalWrapper title="Manual Coin Adjustment" onClose={closeModal}>
          <p className="mb-4 text-sm text-[#85899a]">Manually adjust coin balances for specific users.</p>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">User Email or ID</label>
              <input type="text" placeholder="Enter user email or ID" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff]" />
            </div>
            
            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Points Amount</label>
              <input type="text" placeholder="Enter amount (e.g. +100, -50)" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff]" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Reason for Adjustment (Optional)</label>
              <textarea 
                placeholder="Reason for adjustment"
                className="w-full rounded-lg border border-[#e7e7ef] p-3 text-sm outline-none focus:border-[#7555ff] h-20 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Cancel</button>
            <button 
              className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]"
              onClick={() => setActiveModal("confirmAdjustment")} 
            >
              Apply Adjustment
            </button>
          </div>
        </ModalWrapper>
      )}

    </div>
  );
}

/* =========================================
   HELPER COMPONENTS
========================================= */

function StatCard({ title, value, trend, trendUp, subtitle, icon }) {
  return (
    <div className="rounded-xl border border-[#eeeeF4] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-[#85899a]">{title}</span>
        <div className="rounded-full bg-[#f8f9fa] p-1.5">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-[#24283b]">{value}</div>
      {trend && (
        <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${trendUp ? "text-[#26a65b]" : "text-[#e74c3c]"}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      )}
      {subtitle && <div className="mt-1 text-xs text-[#85899a]">{subtitle}</div>}
    </div>
  );
}

// Custom Tooltip for Recharts to match your design exactly
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-[#1a1d27] px-3 py-2 text-xs font-medium text-white shadow-lg relative">
        <p className="mb-1 text-[#85899a]">{label}</p>
        <p className="text-white">{payload[0].value.toLocaleString()}</p>
        {/* Small arrow pointing down */}
        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#1a1d27]"></div>
      </div>
    );
  }
  return null;
}

// Reusable Modal Wrapper
function ModalWrapper({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-[#eeeeF4] p-5">
          <h2 className="text-lg font-semibold text-[#24283b]">{title}</h2>
          <button onClick={onClose} className="text-[#85899a] hover:text-[#24283b] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// Reusable Toggle Switch
function ToggleSwitch({ defaultChecked = false }) {
  const [isOn, setIsOn] = useState(defaultChecked);
  return (
    <button 
      type="button" 
      onClick={() => setIsOn(!isOn)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOn ? "bg-[#7555ff]" : "bg-[#e7e7ef]"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}