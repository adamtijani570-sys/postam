// app/payment/page.jsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar"; // Kept exactly as you provided
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Settings,
  X,
  Check,
  CreditCard,
} from "lucide-react";

// Real transactions are loaded from the Postam API.
// This endpoint returns transactions for the authenticated user, not an admin-wide payout queue.
const API_BASE_URL = "https://api.getpostam.com/api/v1";

function getAuthToken() {
  if (typeof window === "undefined") return "";

  // Match common token keys used by client-side auth implementations.
  const directKeys = ["token", "accessToken", "authToken", "postam_token", "userToken"];
  for (const key of directKeys) {
    const value = window.localStorage.getItem(key);
    if (value && value !== "undefined" && value !== "null") return value;
  }

  // Also check common persisted Zustand/auth storage objects.
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
      const nestedToken =
        parsed?.state?.token ||
        parsed?.state?.accessToken ||
        parsed?.token ||
        parsed?.accessToken;
      if (typeof nestedToken === "string" && nestedToken) return nestedToken;
    } catch {
      // Ignore localStorage values that are not JSON.
    }
  }

  return "";
}

function formatTransaction(tx) {
  const from = String(tx?.gatewayResponse?.from || "").toUpperCase();
  const to = String(tx?.gatewayResponse?.to || "").toUpperCase();
  const asset = tx?.assetType === "point" ? "PPNT" : tx?.assetType?.toUpperCase() || "asset";
  const status = String(tx?.status || "unknown").toLowerCase();
  const userId = String(tx?.user || "");
  const statusLabel =
    status === "success" || status === "completed"
      ? "Completed"
      : status === "pending"
        ? "Pending"
        : status === "processing"
          ? "Under Review"
          : status.charAt(0).toUpperCase() + status.slice(1);

  return {
    id: tx?._id || tx?.reference,
    user: userId ? `User …${userId.slice(-6)}` : "Unknown user",
    initials: "U",
    amount: `${tx?.amount ?? 0} ${asset}`,
    points:
      tx?.gatewayResponse?.receivedAmount != null
        ? `${tx.gatewayResponse.receivedAmount} ${to || "received"}`
        : "—",
    method: tx?.type === "exchange" ? `Exchange${from && to ? ` (${from} → ${to})` : ""}` : (tx?.type || "Transaction"),
    date: tx?.createdAt ? new Date(tx.createdAt).toLocaleString() : "—",
    status: statusLabel,
    color:
      statusLabel === "Completed"
        ? "bg-green-100 text-green-700"
        : statusLabel === "Pending"
          ? "bg-orange-100 text-orange-700"
          : statusLabel === "Failed" || statusLabel === "Rejected"
            ? "bg-red-100 text-red-700"
            : "bg-purple-100 text-purple-700",
    raw: tx,
  };
}

export default function PayoutManagement() {
  const [activeTab, setActiveTab] = useState("History");
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const openModal = (modalName, tx = null) => {
    setSelectedTx(tx);
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTx(null);
  };

  useEffect(() => {
    let cancelled = false;

    async function loadTransactions() {
      setIsLoading(true);
      setApiError("");
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error(
            "No authentication token was found in localStorage. Connect this page to your app's auth store or confirm the token storage key."
          );
        }

        const params = new URLSearchParams({
          type: "",
          status: "",
          limit: "20",
          page: String(page),
        });
        const response = await fetch(
          `${API_BASE_URL}/transaction/all-transactions?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );
        const payload = await response.json();

        if (!response.ok || payload?.success === false) {
          throw new Error(payload?.message || `Request failed (${response.status})`);
        }

        if (!cancelled) {
          setTransactions(Array.isArray(payload?.data) ? payload.data.map(formatTransaction) : []);
          setHasMore(Boolean(payload?.hasMore));
        }
      } catch (error) {
        if (!cancelled) setApiError(error?.message || "Unable to load transactions.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadTransactions();
    return () => {
      cancelled = true;
    };
  }, [page]);

  // Only History can be populated safely from the confirmed transaction endpoint.
  // Pending/Approved/Rejected require a separate payout-request API.
  const currentData =
    activeTab === "History"
      ? transactions.filter((tx) => {
          const query = searchTerm.trim().toLowerCase();
          if (!query) return true;
          return [tx.user, tx.id, tx.amount, tx.points, tx.method, tx.status, tx.date]
            .some((value) => String(value || "").toLowerCase().includes(query));
        })
      : [];
  const isPendingTab = activeTab === "Pending";
  const successfulCount = transactions.filter((tx) => tx.status === "Completed").length;
  const failedCount = transactions.filter((tx) => ["Failed", "Rejected"].includes(tx.status)).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Sidebar />
      
      <main className="ml-[280px] p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#24283b]">Payout Management</h1>
          <p className="mt-1 text-sm text-[#85899a]">
            Transaction history is loaded from the Postam API. Admin payout approvals require separate backend endpoints.
          </p>
          {apiError && (
            <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {apiError}
            </div>
          )}
        </div>

        {/* Stats Row: based only on real transaction records returned by the API */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <StatCard
            title="Transactions Loaded"
            value={isLoading ? "…" : String(transactions.length)}
            subtitle="Current page"
            icon={<CreditCard className="text-[#7555ff]" size={20} />}
          />
          <StatCard
            title="Successful"
            value={isLoading ? "…" : String(successfulCount)}
            subtitle="Completed transactions"
            icon={<CheckCircle2 className="text-[#26a65b]" size={20} />}
            subtitleClass="text-[#26a65b]"
          />
          <StatCard
            title="Failed"
            value={isLoading ? "…" : String(failedCount)}
            subtitle="Failed or rejected"
            icon={<AlertTriangle className="text-[#d97706]" size={20} />}
            subtitleClass="text-[#d97706]"
          />
          <StatCard
            title="More Records"
            value={hasMore ? "Yes" : "No"}
            subtitle="API pagination"
            icon={<Clock className="text-[#d97706]" size={20} />}
          />
        </div>

        {/* Payout Configuration */}
        <div className="mb-6 rounded-xl border border-[#eeeeF4] bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-[#24283b]">Payout Configuration</h3><p className="mb-4 text-xs text-amber-700">These values are still UI placeholders; no settings API has been provided, so saving does not persist changes.</p>
          <div className="flex items-end gap-4 mb-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-black">Minimum Withdrawal ($)</label>
              <input type="text" defaultValue="200" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm text-black outline-none focus:border-[#7555ff]" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Maximum Withdrawal ($)</label>
              <input type="text" defaultValue="100,000" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm text-black outline-none focus:border-[#7555ff]" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Processing Fee (%)</label>
              <input type="text" defaultValue="2.5%" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm text-black outline-none focus:border-[#7555ff]" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button className="text-sm font-medium text-[#85899a] hover:text-[#24283b]">Reset to Default</button>
            <button 
              onClick={() => openModal("saveSettings")}
              className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6] transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="mb-6 rounded-xl border border-[#eeeeF4] bg-white shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#eeeeF4] px-6">
            {["Pending", "Approved", "Rejected", "History"].map((tab) => {
              const tabName = tab.split(" ")[0]; // Clean string for state
              const isActive = activeTab === tabName;
              
              return (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tabName)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-[#7555ff] text-[#7555ff]" 
                      : "border-transparent text-[#85899a] hover:text-[#24283b]"
                  }`}
                >
                  {tab === "History" ? `History (${transactions.length})` : tab}
                </button>
              );
            })}
          </div>

          {/* Search & Filters */}
          <div className="flex items-center justify-between border-b border-[#eeeeF4] p-4 ">
            <div className="relative w-96 ">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search transactions..."
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-xs text-[#85899a] border-b border-[#f0f0f5]">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Points</th>
                  <th className="px-6 py-4 font-medium">Method</th>
                  <th className="px-6 py-4 font-medium">{isPendingTab ? "Request Date" : "Processed Date"}</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f5]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#85899a]">
                      Loading transactions from Postam…
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#85899a]">
                      {apiError
                        ? "Transactions could not be loaded. Check authentication and try again."
                        : activeTab !== "History"
                          ? "This endpoint returns transaction history, not admin payout requests. A payout-request API is needed for this tab."
                          : searchTerm
                            ? "No transactions match your search."
                            : "No transactions returned by the API."}
                    </td>
                  </tr>
                ) : currentData.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${tx.color}`}>
                          {tx.initials}
                        </div>
                        <span className="font-medium text-[#24283b]">{tx.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#24283b]">{tx.amount}</td>
                    <td className="px-6 py-4 text-[#85899a]">{tx.points}</td>
                    <td className="px-6 py-4 text-[#85899a]">{tx.method}</td>
                    <td className="px-6 py-4 text-[#85899a]">{tx.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tx.status === "Pending" ? "bg-orange-50 text-orange-700" : 
                        tx.status === "Under Review" ? "bg-yellow-50 text-yellow-700" : 
                        tx.status === "Approved" ? "bg-blue-50 text-blue-700" :
                        tx.status === "Rejected" ? "bg-red-50 text-red-700" :
                        "bg-green-50 text-green-700" // Completed
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {isPendingTab ? (
                          <>
                            <button 
                              onClick={() => openModal("approve", tx)}
                              className="flex items-center gap-1 text-xs font-medium text-[#24283b] hover:text-[#7555ff]"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button 
                              onClick={() => openModal("deny", tx)}
                              className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
                            >
                              <X size={14} /> Deny
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => openModal("receipt", tx)}
                            className="rounded-lg border border-[#e7e7ef] px-3 py-1.5 text-xs font-medium text-[#24283b] hover:bg-[#f8f9fa]"
                          >
                            View Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Integration Cards */}
        <div className="grid grid-cols-2 gap-6">
          
          {/* Payment Gateways */}
          <div className="rounded-xl border border-[#eeeeF4] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-[#24283b]">Payment Gateway Integration</h3>
              <button 
                onClick={() => openModal("gateway")}
                className="flex items-center gap-1.5 rounded-lg border border-[#e7e7ef] px-3 py-1.5 text-xs font-medium text-[#24283b] hover:bg-[#f8f9fa]"
              >
                <Settings size={14} /> Manage
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#24283b]">Paystack</p>
                  <p className="text-xs text-[#85899a]">Status not verified by API</p>
                </div>
                <span className="rounded-full bg-[#26a65b] px-3 py-1 text-[10px] font-bold text-white uppercase">Unverified</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#24283b]">Flutterwave</p>
                  <p className="text-xs text-[#85899a]">Status not verified by API</p>
                </div>
                <span className="rounded-full bg-[#26a65b] px-3 py-1 text-[10px] font-bold text-white uppercase">Unverified</span>
              </div>
            </div>
          </div>

          {/* Fraud Detection Rules */}
          <div className="rounded-xl border border-[#eeeeF4] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-[#24283b]">Fraud Detection Rules</h3>
              <button 
                onClick={() => openModal("fraud")}
                className="flex items-center gap-1.5 rounded-lg border border-[#e7e7ef] px-3 py-1.5 text-xs font-medium text-[#24283b] hover:bg-[#f8f9fa]"
              >
                <Settings size={14} /> Configure
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#24283b]">Multiple withdrawal attempts</p>
                <span className="text-xs font-medium text-[#26a65b]">UI placeholder</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#24283b]">Unusual amount patterns</p>
                <span className="text-xs font-medium text-[#26a65b]">UI placeholder</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#24283b]">New account withdrawals</p>
                <span className="text-xs font-medium text-[#26a65b]">UI placeholder</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* =========================================
          MODALS
      ========================================= */}

      {/* 1. Save Payout Settings Modal */}
      {activeModal === "saveSettings" && (
        <ModalWrapper title="Save Payout Settings" subtitle="Confirm configuration changes" onClose={closeModal}>
          <div className="mb-6 rounded-lg bg-[#fffbeb] p-4 border border-[#fef08a]">
            <div className="flex items-center gap-2 text-[#d97706] font-medium text-sm mb-1">
              <AlertTriangle size={16} /> Settings Changes
            </div>
            <p className="text-xs text-[#b45309]">
              These changes will affect all future payout requests. Current pending requests will use the new settings.
            </p>
          </div>

          <div className="space-y-4 border border-[#e7e7ef] rounded-lg p-4 bg-[#f8f9fa]">
            <div className="flex justify-between items-center border-b border-[#e7e7ef] pb-3">
              <span className="text-sm text-[#85899a]">Minimum Withdrawal</span>
              <span className="text-sm font-medium text-[#24283b]">$200</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#e7e7ef] pb-3">
              <span className="text-sm text-[#85899a]">Maximum Daily Limit</span>
              <span className="text-sm font-medium text-[#24283b]">$100,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#85899a]">Processing Fee</span>
              <span className="text-sm font-medium text-[#24283b]">2.5%</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Cancel</button>
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>Save Changes</button>
          </div>
        </ModalWrapper>
      )}

      {/* 2. Approve Payout Request Modal */}
      {activeModal === "approve" && selectedTx && (
        <ModalWrapper title="Approve Payout Request" subtitle="Review and confirm payout details" onClose={closeModal}>
          <div className="space-y-4">
            <div className="border border-[#e7e7ef] rounded-lg p-4 bg-white">
              <h4 className="text-xs font-medium text-[#85899a] mb-3 uppercase tracking-wider">User Information</h4>
              <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
                <span className="text-[#85899a]">Name:</span>
                <span className="font-medium text-[#24283b]">{selectedTx.user}</span>
                <span className="text-[#85899a]">Email:</span>
                <span className="font-medium text-[#24283b]">Not provided by transaction API</span>
              </div>
            </div>

            <div className="border border-[#bae6fd] rounded-lg p-4 bg-[#f0f9ff]">
              <h4 className="text-xs font-medium text-[#0284c7] mb-3 uppercase tracking-wider">Payout Details</h4>
              <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                <span className="text-[#0284c7]">Amount:</span>
                <span className="font-medium text-[#24283b] text-right">{selectedTx.amount}</span>
                
                <span className="text-[#0284c7]">Coins Deducted:</span>
                <span className="font-medium text-[#24283b] text-right">{selectedTx.points} coins</span>
                
                <span className="text-[#0284c7]">Method:</span>
                <span className="font-medium text-[#24283b] text-right">{selectedTx.method}</span>
                
                <span className="text-[#0284c7]">Bank:</span>
                <span className="font-medium text-[#24283b] text-right">Not provided by transaction API</span>

                <span className="text-[#0284c7]">Account Number:</span>
                <span className="font-medium text-[#24283b] text-right">Not provided by transaction API</span>

                <div className="col-span-2 border-t border-[#bae6fd] my-1"></div>

                <span className="text-[#0284c7]">Processing Fee (2.5%):</span>
                <span className="font-medium text-[#24283b] text-right">$625.00</span>
                
                <span className="text-[#0284c7]">Net Payout:</span>
                <span className="font-bold text-[#24283b] text-right">$24,375</span>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Payment Gateway</label>
              <select className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] bg-white">
                <option>Paystack</option>
                <option>Flutterwave</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Processing Notes (Optional)</label>
              <textarea 
                placeholder="Add any notes about this transaction..."
                className="w-full rounded-lg border border-[#e7e7ef] p-3 text-sm outline-none focus:border-[#7555ff] h-20 resize-none bg-[#f8f9fa]"
              ></textarea>
            </div>

            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-2 text-sm text-[#24283b]">
                <input type="checkbox" className="rounded border-[#e7e7ef] text-[#7555ff] focus:ring-[#7555ff]" defaultChecked />
                Send confirmation email to user
              </label>
              <label className="flex items-center gap-2 text-sm text-[#24283b]">
                <input type="checkbox" className="rounded border-[#e7e7ef] text-[#7555ff] focus:ring-[#7555ff]" defaultChecked />
                Generate transaction receipt
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Cancel</button>
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={() => { closeModal(); setTimeout(() => openModal('receipt', selectedTx), 100); }}>Approve & Process</button>
          </div>
        </ModalWrapper>
      )}

      {/* 3. Deny Payout Request Modal */}
      {activeModal === "deny" && selectedTx && (
        <ModalWrapper title="Deny Payout Request" subtitle="Provide reason for denial" onClose={closeModal}>
          <div className="mb-6 rounded-lg bg-[#f0f9ff] p-4 border border-[#bae6fd]">
            <p className="text-xs text-[#0284c7]">
              The user will be notified of the denial and their coins will be refunded to their wallet.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Denial Reason</label>
              <select className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] bg-white text-[#85899a]">
                <option>Select reason</option>
                <option>Insufficient funds</option>
                <option>Suspicious activity</option>
                <option>Invalid account details</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Message to User</label>
              <textarea 
                placeholder="Explain to the user why their payout was denied and what they need to do..."
                className="w-full rounded-lg border border-[#e7e7ef] p-3 text-sm outline-none focus:border-[#7555ff] h-24 resize-none bg-[#f8f9fa]"
              ></textarea>
            </div>

            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-2 text-sm text-[#24283b]">
                <input type="checkbox" className="rounded border-[#e7e7ef] text-[#7555ff] focus:ring-[#7555ff]" defaultChecked />
                Refund coins to user's wallet
              </label>
              <label className="flex items-center gap-2 text-sm text-[#24283b]">
                <input type="checkbox" className="rounded border-[#e7e7ef] text-[#7555ff] focus:ring-[#7555ff]" defaultChecked />
                Send notification email
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Cancel</button>
            <button className="rounded-lg bg-[#dc2626] px-6 py-2 text-sm font-medium text-white hover:bg-red-700" onClick={closeModal}>Deny Request</button>
          </div>
        </ModalWrapper>
      )}

      {/* 4. Payment Gateway Integration Modal */}
      {activeModal === "gateway" && (
        <ModalWrapper title="Payment Gateway Integration" subtitle="Manage payment service providers" onClose={closeModal}>
          <div className="space-y-6">
            {/* Paystack */}
            <div className="border border-[#e7e7ef] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-[#24283b]">Paystack</span>
                <span className="rounded-full bg-[#26a65b] px-3 py-0.5 text-[10px] font-bold text-white uppercase">Connected</span>
              </div>
              <p className="text-xs text-[#85899a] mb-4">Nigerian payment gateway</p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#85899a]">Public Key</label>
                  <input type="text" defaultValue="pk_live_xxxxxxxxxxxxxxxxx" className="w-full rounded-lg border border-[#e7e7ef] p-2 text-sm outline-none bg-[#f8f9fa] text-[#85899a]" readOnly />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#85899a]">Secret Key</label>
                  <input type="password" defaultValue="sk_live_xxxxxxxxxxxxxxxxx" className="w-full rounded-lg border border-[#e7e7ef] p-2 text-sm outline-none bg-[#f8f9fa] text-[#85899a]" readOnly />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#85899a]">Test Connection</span>
                  <span className="text-red-500 font-medium flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>Disconnected</span>
                </div>
              </div>
            </div>

            {/* Flutterwave */}
            <div className="border border-[#e7e7ef] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-[#24283b]">Flutterwave</span>
                <span className="rounded-full bg-[#26a65b] px-3 py-0.5 text-[10px] font-bold text-white uppercase">Connected</span>
              </div>
              <p className="text-xs text-[#85899a] mb-4">African payment gateway</p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#85899a]">Public Key</label>
                  <input type="text" defaultValue="FLWPUBK-xxxxxxxxxxxxxxxxx" className="w-full rounded-lg border border-[#e7e7ef] p-2 text-sm outline-none bg-[#f8f9fa] text-[#85899a]" readOnly />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#85899a]">Secret Key</label>
                  <input type="password" defaultValue="FLWSECK-xxxxxxxxxxxxxxxxx" className="w-full rounded-lg border border-[#e7e7ef] p-2 text-sm outline-none bg-[#f8f9fa] text-[#85899a]" readOnly />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#85899a]">Test Connection</span>
                  <span className="text-red-500 font-medium flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>Disconnected</span>
                </div>
              </div>
            </div>

            <button className="w-full rounded-lg border border-dashed border-[#e7e7ef] py-3 text-sm font-medium text-[#85899a] hover:bg-[#f8f9fa] transition-colors">
              Add New Payment Provider
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>Close</button>
          </div>
        </ModalWrapper>
      )}

      {/* 5. Fraud Detection Configuration Modal */}
      {activeModal === "fraud" && (
        <ModalWrapper title="Fraud Detection Configuration" subtitle="Set up automated fraud prevention rules" onClose={closeModal}>
          <div className="space-y-6">
            
            <div className="flex items-start justify-between gap-4 border-b border-[#f0f0f5] pb-4">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#24283b]">Multiple Withdrawal Attempts</h4>
                <p className="text-xs text-[#85899a] mb-3">Flag users with multiple failed attempts</p>
                <div>
                  <label className="mb-1 block text-[10px] text-[#85899a]">Threshold (attempts in 24h)</label>
                  <input type="text" defaultValue="3" className="w-24 rounded-lg border border-[#e7e7ef] p-2 text-sm outline-none focus:border-[#7555ff]" />
                </div>
              </div>
              <ToggleSwitch defaultChecked={true} />
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-[#f0f0f5] pb-4">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#24283b]">Unusual Amount Patterns</h4>
                <p className="text-xs text-[#85899a] mb-3">Detect suspicious withdrawal amounts</p>
                <div>
                  <label className="mb-1 block text-[10px] text-[#85899a]">Flag amounts above</label>
                  <input type="text" defaultValue="50000" className="w-32 rounded-lg border border-[#e7e7ef] p-2 text-sm outline-none focus:border-[#7555ff]" />
                </div>
              </div>
              <ToggleSwitch defaultChecked={true} />
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-[#f0f0f5] pb-4">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#24283b]">New Account Withdrawals</h4>
                <p className="text-xs text-[#85899a] mb-3">Review payouts from recently created accounts</p>
                <div>
                  <label className="mb-1 block text-[10px] text-[#85899a]">Account age threshold (days)</label>
                  <input type="text" defaultValue="7" className="w-24 rounded-lg border border-[#e7e7ef] p-2 text-sm outline-none focus:border-[#7555ff]" />
                </div>
              </div>
              <ToggleSwitch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-[#24283b]">Velocity Checks</h4>
                <p className="text-xs text-[#85899a]">Monitor withdrawal frequency</p>
              </div>
              <ToggleSwitch defaultChecked={true} />
            </div>

          </div>

          <div className="mt-6 flex justify-between">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Cancel</button>
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>Save Rules</button>
          </div>
        </ModalWrapper>
      )}

      {/* 6. Transaction Receipt Modal */}
      {activeModal === "receipt" && selectedTx && (
        <ModalWrapper title="Transaction Receipt" subtitle="Payout confirmation details" onClose={closeModal}>
          
          {/* Success Banner */}
          <div className="mb-6 rounded-xl bg-[#f0fdf4] p-6 border border-[#bbf7d0] flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={40} className="text-[#22c55e] mb-3" />
            <h3 className="text-lg font-bold text-[#166534]">Transaction Details</h3>
            <p className="text-xs text-[#15803d] mt-1">Transaction ID: {selectedTx.id}</p>
          </div>

          {/* Recipient Details */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-[#85899a] mb-2 uppercase tracking-wider">Recipient Details</h4>
            <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm bg-[#f8f9fa] p-3 rounded-lg border border-[#e7e7ef]">
              <span className="text-[#85899a]">Name:</span>
              <span className="font-medium text-[#24283b] text-right">{selectedTx.user}</span>
              <span className="text-[#85899a]">Payment Method:</span>
              <span className="font-medium text-[#24283b] text-right">{selectedTx.method}</span>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-[#85899a] mb-2 uppercase tracking-wider">Transaction Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-[#f0f0f5]">
                <span className="text-[#85899a]">Gross Amount:</span>
                <span className="font-medium text-[#24283b]">{selectedTx.amount}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f0f0f5]">
                <span className="text-[#85899a]">Processing Fee:</span>
                <span className="font-medium text-[#24283b]">Not provided by API</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f0f0f5]">
                <span className="text-[#85899a]">Net Amount Paid:</span>
                <span className="font-bold text-[#24283b]">{selectedTx.points}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f0f0f5]">
                <span className="text-[#85899a]">Coins Converted:</span>
                <span className="font-medium text-[#24283b]">{selectedTx.raw?.amount} {selectedTx.raw?.assetType || ""}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f0f0f5]">
                <span className="text-[#85899a]">Date Processed:</span>
                <span className="font-medium text-[#24283b]">{selectedTx.date}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#85899a]">Status:</span>
                <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-medium text-[#166534]">{selectedTx.status}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#f0f9ff] p-3 border border-[#bae6fd] text-center mb-6">
            <p className="text-xs text-[#0284c7]">This is an official receipt from Postam. Keep this for your records.</p>
          </div>

          <div className="flex justify-center gap-3">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]">Download PDF</button>
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]">Email Receipt</button>
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>Close</button>
          </div>
        </ModalWrapper>
      )}

    </div>
  );
}

/* =========================================
   HELPER COMPONENTS
========================================= */

function StatCard({ title, value, subtitle, icon, subtitleClass = "text-[#85899a]" }) {
  return (
    <div className="rounded-xl border border-[#eeeeF4] bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-[#85899a]">{title}</span>
        <div className="rounded-full bg-[#f8f9fa] p-1.5">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-[#24283b] mb-1">{value}</div>
      <div className={`text-xs font-medium ${subtitleClass}`}>{subtitle}</div>
    </div>
  );
}

// Reusable Modal Wrapper
function ModalWrapper({ title, subtitle, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between border-b border-[#eeeeF4] p-5">
          <div>
            <h2 className="text-lg font-semibold text-[#24283b]">{title}</h2>
            {subtitle && <p className="text-sm text-[#85899a] mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-[#85899a] hover:text-[#24283b] transition-colors mt-1">
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${isOn ? "bg-[#7555ff]" : "bg-[#e7e7ef]"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}