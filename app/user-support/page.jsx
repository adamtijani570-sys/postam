
"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import {
  Clock3,
  CheckCircle2,
  Users,
  Timer,
  Search,
  UserPlus,
  X,
  MessageSquare,
  Send,
  Headphones,
  Wallet,
  ShieldCheck,
  FileText,
  CircleHelp,
  Eye,
  UserCheck,
} from "lucide-react";

const initialTickets = [
  {
    id: "TKT-1234",
    initials: "J",
    user: "John Adebayo",
    email: "john@gmail.com",
    subject: "Cannot withdraw funds",
    description:
      "I have been trying to withdraw my funds for 2 days but keep getting an error message.",
    category: "Wallet",
    priority: "High",
    created: "2025-10-17 09:30",
    agent: "Unassigned",
    status: "Open",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "TKT-1235",
    initials: "S",
    user: "Sarah Okonkwo",
    email: "sarah@gmail.com",
    subject: "Account verification issue",
    description:
      "I am having trouble completing account verification. Please help me review my account.",
    category: "Verification",
    priority: "Medium",
    created: "2025-10-17 08:15",
    agent: "Agent A",
    status: "In Progress",
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: "TKT-1236",
    initials: "M",
    user: "Michael Chen",
    email: "michael@gmail.com",
    subject: "PAL application status",
    description:
      "I would like an update on the status of my PAL application.",
    category: "PAL",
    priority: "Low",
    created: "2025-10-16 22:45",
    agent: "Unassigned",
    status: "Open",
    color: "bg-violet-100 text-violet-600",
  },
  {
    id: "TKT-1237",
    initials: "A",
    user: "Amina Ibrahim",
    email: "amina@gmail.com",
    subject: "Missing coins from post",
    description:
      "The coins from my recent post have not appeared in my wallet. Could you check this for me?",
    category: "Wallet",
    priority: "High",
    created: "2025-10-16 20:30",
    agent: "Agent B",
    status: "Open",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "TKT-1230",
    initials: "D",
    user: "David Okafor",
    email: "david@gmail.com",
    subject: "Password reset",
    description: "I need assistance resetting my account password.",
    category: "Account",
    priority: "Medium",
    created: "2025-10-16 14:20",
    agent: "Agent A",
    status: "Resolved",
    color: "bg-violet-100 text-violet-600",
    resolution: "Password reset link sent",
    resolvedBy: "Agent A",
  },
  {
    id: "TKT-1231",
    initials: "G",
    user: "Grace Mensah",
    email: "grace@gmail.com",
    subject: "Profile picture upload",
    description:
      "I was unable to upload a new profile picture to my account.",
    category: "Technical",
    priority: "Low",
    created: "2025-10-16 11:30",
    agent: "Agent C",
    status: "Resolved",
    color: "bg-pink-100 text-pink-600",
    resolution: "Technical issue fixed",
    resolvedBy: "Agent C",
  },
  {
    id: "TKT-1232",
    initials: "A",
    user: "Ahmed Bello",
    email: "ahmed@gmail.com",
    subject: "Referral bonus not received",
    description:
      "My referral bonus has not appeared in my wallet.",
    category: "Wallet",
    priority: "Medium",
    created: "2025-10-15 16:45",
    agent: "Agent B",
    status: "Resolved",
    color: "bg-purple-100 text-purple-600",
    resolution: "Bonus manually credited",
    resolvedBy: "Agent B",
  },
];

const agents = [
  {
    name: "Agent A",
    initials: "A",
    email: "agent.a@postam.com",
    role: "Customer Support",
    status: "Online",
    tickets: 8,
    resolved: 12,
    response: "15 min",
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Agent B",
    initials: "B",
    email: "agent.b@postam.com",
    role: "Wallet Support",
    status: "Online",
    tickets: 8,
    resolved: 12,
    response: "15 min",
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Agent C",
    initials: "C",
    email: "agent.c@postam.com",
    role: "Account Support",
    status: "Away",
    tickets: 8,
    resolved: 12,
    response: "15 min",
    color: "bg-purple-100 text-purple-700",
  },
];

const commonIssues = [
  {
    title: "Wallet & Withdrawals",
    count: 45,
    color: "bg-violet-500",
    icon: Wallet,
  },
  {
    title: "Verification Problems",
    count: 32,
    color: "bg-blue-500",
    icon: ShieldCheck,
  },
  {
    title: "Technical Issues",
    count: 28,
    color: "bg-emerald-500",
    icon: CircleHelp,
  },
  {
    title: "PAL Application",
    count: 18,
    color: "bg-orange-500",
    icon: FileText,
  },
  {
    title: "Account Access",
    count: 15,
    color: "bg-pink-500",
    icon: UserCheck,
  },
];

const tabs = [
  "Open Ticket",
  "Resolved",
  "Support Agents",
  "New Ticket",
];

const summaryCards = [
  {
    label: "Open Tickets",
    icon: Clock3,
    color: "text-orange-500",
    background: "bg-orange-50",
  },
  {
    label: "Resolved Today",
    icon: CheckCircle2,
    color: "text-emerald-500",
    background: "bg-emerald-50",
  },
  {
    label: "Active Agents",
    icon: Users,
    color: "text-blue-500",
    background: "bg-blue-50",
  },
  {
    label: "Avg Response Time",
    icon: Timer,
    color: "text-purple-500",
    background: "bg-purple-50",
  },
];

export default function UserSupport() {
  const [activeTab, setActiveTab] = useState("Open Ticket");
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assignedAgent, setAssignedAgent] = useState("Unassigned");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState({});
  const [newTicket, setNewTicket] = useState({
    user: "",
    subject: "",
    category: "Wallet",
  });

  const openTickets = tickets.filter(
    (ticket) => ticket.status !== "Resolved"
  );

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  );

  const filteredTickets = tickets.filter((ticket) => {
    const searchText = [
      ticket.id,
      ticket.user,
      ticket.subject,
      ticket.category,
      ticket.agent,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    if (activeTab === "Open Ticket") {
      return matchesSearch && ticket.status !== "Resolved";
    }

    if (activeTab === "Resolved") {
      return matchesSearch && ticket.status === "Resolved";
    }

    return false;
  });

  function openTicketDetails(ticket) {
    setSelectedTicket(ticket);
    setAssignedAgent(
      ticket.agent === "Unassigned" ? "Unassigned" : ticket.agent
    );
    setResponse("");
  }

  function saveAssignment() {
    if (!selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      agent: assignedAgent,
      status:
        assignedAgent !== "Unassigned" &&
        selectedTicket.status === "Open"
          ? "In Progress"
          : selectedTicket.status,
    };

    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );

    setHistory((current) => ({
      ...current,
      [updatedTicket.id]: [
        ...(current[updatedTicket.id] || []),
        {
          text: `Ticket assigned to ${assignedAgent}`,
          date: new Date().toLocaleString(),
        },
      ],
    }));

    setSelectedTicket(null);
  }

  function sendResponse() {
    if (!selectedTicket || !response.trim()) return;

    setHistory((current) => ({
      ...current,
      [selectedTicket.id]: [
        ...(current[selectedTicket.id] || []),
        {
          text: response.trim(),
          date: new Date().toLocaleString(),
        },
      ],
    }));

    setResponse("");
  }

  function resolveTicket() {
    if (!selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      status: "Resolved",
      resolvedBy:
        selectedTicket.agent === "Unassigned"
          ? "Admin"
          : selectedTicket.agent,
      resolution: "Ticket marked as resolved",
    };

    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );

    setHistory((current) => ({
      ...current,
      [updatedTicket.id]: [
        ...(current[updatedTicket.id] || []),
        {
          text: "Ticket marked as resolved",
          date: new Date().toLocaleString(),
        },
      ],
    }));

    setSelectedTicket(null);
  }

  function createTicket(event) {
    event.preventDefault();

    const user = newTicket.user.trim();
    const subject = newTicket.subject.trim();

    if (!user || !subject) return;

    const nextNumber =
      Math.max(
        ...tickets.map((ticket) => Number(ticket.id.replace("TKT-", ""))),
        1233
      ) + 1;

    const ticket = {
      id: `TKT-${nextNumber}`,
      initials: user.charAt(0).toUpperCase(),
      user,
      email: "",
      subject,
      description: `Support request submitted for ${subject}.`,
      category: newTicket.category,
      priority: "Medium",
      created: new Date().toLocaleString(),
      agent: "Unassigned",
      status: "Open",
      color: "bg-purple-100 text-purple-600",
    };

    setTickets((current) => [...current, ticket]);
    setNewTicket({
      user: "",
      subject: "",
      category: "Wallet",
    });
    setSearch("");
    setActiveTab("Open Ticket");
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800">
      <Sidebar />

      <main className="min-h-screen min-w-0 px-4 py-6 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          {/* PAGE HEADING */}
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              User Support &amp; Tickets
            </h1>
          </div>

          {/* SUMMARY CARDS */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              let value = "18 min";
              let note = "Under target";

              if (card.label === "Open Tickets") {
                value = openTickets.length;
                note = "Awaiting response";
              } else if (card.label === "Resolved Today") {
                value = resolvedTickets.length;
                note = "Successfully closed";
              } else if (card.label === "Active Agents") {
                value = agents.filter(
                  (agent) => agent.status === "Online"
                ).length;
                note = "Currently online";
              }

              return (
                <div
                  key={card.label}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${card.background} ${card.color}`}
                    >
                      <Icon size={17} />
                    </div>

                    <span className="text-xs text-slate-500">
                      {card.label}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-slate-900">
                    {value}
                  </p>

                  <p
                    className={`mt-1 text-[11px] ${
                      card.label === "Open Tickets"
                        ? "text-red-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {note}
                  </p>
                </div>
              );
            })}
          </div>

          {/* MAIN CONTENT */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* TABS AND SEARCH */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setSearch("");
                    }}
                    className={`rounded-md px-3 py-2 text-xs font-medium transition ${
                      activeTab === tab
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}

                    {tab === "Open Ticket" && (
                      <span className="ml-1.5 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] text-violet-700">
                        {openTickets.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {(activeTab === "Open Ticket" ||
                activeTab === "Resolved") && (
                <div className="relative w-full sm:max-w-xs">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search tickets..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              )}
            </div>

            {/* OPEN TICKETS TAB */}
            {activeTab === "Open Ticket" && (
              <div>
                <div className="px-4 py-4 sm:px-5">
                  <h2 className="text-sm font-semibold text-slate-800">
                    Open Support Tickets
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Review and manage incoming customer requests.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        {[
                          "Ticket ID",
                          "User",
                          "Subject",
                          "Category",
                          "Priority",
                          "Created",
                          "Assigned To",
                          "Status",
                          "Actions",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="whitespace-nowrap px-3 py-3 font-medium"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="transition hover:bg-violet-50/40"
                        >
                          <td className="whitespace-nowrap px-3 py-3 font-medium text-violet-700">
                            {ticket.id}
                          </td>

                          <td className="whitespace-nowrap px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${ticket.color}`}
                              >
                                {ticket.initials}
                              </span>
                              <span className="font-medium text-slate-700">
                                {ticket.user}
                              </span>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                            {ticket.subject}
                          </td>

                          <td className="px-3 py-3">
                            <span className="rounded-full border border-slate-200 px-2 py-1 text-slate-600">
                              {ticket.category}
                            </span>
                          </td>

                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-2 py-1 font-medium ${
                                ticket.priority === "High"
                                  ? "bg-red-50 text-red-600"
                                  : ticket.priority === "Medium"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {ticket.priority}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-slate-500">
                            {ticket.created}
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                            {ticket.agent}
                          </td>

                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-2 py-1 font-medium ${
                                ticket.status === "Open"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </td>

                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => openTicketDetails(ticket)}
                                className="flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1.5 text-[11px] text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                              >
                                <Eye size={12} />
                                View
                              </button>

                              <button
                                onClick={() => openTicketDetails(ticket)}
                                className="flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1.5 text-[11px] text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                              >
                                <UserCheck size={12} />
                                Assign
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredTickets.length === 0 && (
                        <tr>
                          <td
                            colSpan={9}
                            className="px-4 py-12 text-center text-sm text-slate-500"
                          >
                            No open tickets found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
                  <span>
                    Showing {filteredTickets.length} open tickets
                  </span>
                  <span>Support ticket management</span>
                </div>
              </div>
            )}

            {/* RESOLVED TAB */}
            {activeTab === "Resolved" && (
              <div>
                <div className="px-4 py-4 sm:px-5">
                  <h2 className="text-sm font-semibold text-slate-800">
                    Resolved Tickets
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Review previously resolved customer requests.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        {[
                          "Ticket ID",
                          "User",
                          "Subject",
                          "Category",
                          "Resolved By",
                          "Resolution",
                          "Date",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="whitespace-nowrap px-3 py-3 font-medium"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="cursor-pointer transition hover:bg-violet-50/40"
                          onClick={() => openTicketDetails(ticket)}
                        >
                          <td className="whitespace-nowrap px-3 py-3 font-medium text-violet-700">
                            {ticket.id}
                          </td>

                          <td className="whitespace-nowrap px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${ticket.color}`}
                              >
                                {ticket.initials}
                              </span>
                              {ticket.user}
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-3 py-3">
                            {ticket.subject}
                          </td>

                          <td className="px-3 py-3">{ticket.category}</td>

                          <td className="px-3 py-3">
                            {ticket.resolvedBy || ticket.agent}
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-slate-500">
                            {ticket.resolution || "Ticket resolved"}
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-slate-500">
                            {ticket.created}
                          </td>
                        </tr>
                      ))}

                      {filteredTickets.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-12 text-center text-sm text-slate-500"
                          >
                            No resolved tickets found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
                  Showing {filteredTickets.length} resolved tickets
                </div>
              </div>
            )}

            {/* SUPPORT AGENTS TAB */}
            {activeTab === "Support Agents" && (
              <div className="p-4 sm:p-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Support Agents
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Monitor your support team and agent performance.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700">
                    <Users size={15} />
                    {agents.length} team members
                  </div>
                </div>

                {/* AGENT CARDS */}
                <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.name}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-sm"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${agent.color}`}
                        >
                          {agent.initials}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {agent.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {agent.role}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                            agent.status === "Online"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>

                      <div className="space-y-3 border-t border-slate-100 pt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Active Tickets
                          </span>
                          <span className="font-semibold text-slate-800">
                            {agent.tickets}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Resolved Today
                          </span>
                          <span className="font-semibold text-slate-800">
                            {agent.resolved}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Avg Response
                          </span>
                          <span className="font-semibold text-slate-800">
                            {agent.response}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSearch(agent.name);
                          setActiveTab("Open Ticket");
                        }}
                        className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>

                {/* COMMON ISSUES */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="mb-4">
                    <h2 className="text-sm font-semibold text-slate-900">
                      Common Issues
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Frequently reported customer issues and ticket volume.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="space-y-5">
                      {commonIssues.map((issue) => {
                        const Icon = issue.icon;
                        const maxCount = Math.max(
                          ...commonIssues.map((item) => item.count)
                        );
                        const percentage = (issue.count / maxCount) * 100;

                        return (
                          <div key={issue.title}>
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <Icon
                                  size={14}
                                  className="text-slate-500"
                                />
                                <span className="text-xs font-medium text-slate-700">
                                  {issue.title}
                                </span>
                              </div>

                              <span className="whitespace-nowrap text-[11px] text-slate-500">
                                {issue.count} tickets
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${issue.color}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NEW TICKET TAB */}
            {activeTab === "New Ticket" && (
              <div className="mx-auto max-w-xl p-5 sm:p-8">
                <div className="mb-6">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <MessageSquare size={21} />
                  </div>

                  <h2 className="text-base font-semibold text-slate-900">
                    Create a Support Ticket
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter the customer details to create a new ticket.
                  </p>
                </div>

                <form onSubmit={createTicket} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                      Customer Name
                    </label>
                    <input
                      required
                      value={newTicket.user}
                      onChange={(event) =>
                        setNewTicket({
                          ...newTicket,
                          user: event.target.value,
                        })
                      }
                      placeholder="Enter customer name"
                      className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                      Ticket Subject
                    </label>
                    <input
                      required
                      value={newTicket.subject}
                      onChange={(event) =>
                        setNewTicket({
                          ...newTicket,
                          subject: event.target.value,
                        })
                      }
                      placeholder="Enter ticket subject"
                      className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                      Category
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(event) =>
                        setNewTicket({
                          ...newTicket,
                          category: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-violet-400"
                    >
                      <option>Wallet</option>
                      <option>Verification</option>
                      <option>PAL</option>
                      <option>Account</option>
                      <option>Technical</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
                  >
                    <UserPlus size={16} />
                    Create Ticket
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* TICKET DETAILS MODAL */}
      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-[2px]"
          onClick={() => setSelectedTicket(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-modal-title"
            className="my-auto w-full max-w-[520px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2
                  id="ticket-modal-title"
                  className="text-base font-semibold text-slate-900"
                >
                  Ticket Details
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {selectedTicket.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                aria-label="Close ticket details"
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={17} />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
              {/* USER DETAILS */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="mb-1 text-xs text-slate-500">User</p>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedTicket.user}
                  </p>
                  {selectedTicket.email && (
                    <p className="mt-1 break-all text-xs text-slate-400">
                      {selectedTicket.email}
                    </p>
                  )}
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="mb-1 text-xs text-slate-500">Ticket ID</p>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedTicket.id}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Created: {selectedTicket.created}
                  </p>
                </div>
              </div>

              {/* TICKET INFORMATION */}
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 px-2 py-1 text-[10px] text-slate-600">
                    {selectedTicket.category}
                  </span>

                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                      selectedTicket.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : selectedTicket.priority === "Medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {selectedTicket.priority}
                  </span>

                  <span
                    className={`rounded-full px-2 py-1 text-[10px] ${
                      selectedTicket.status === "Resolved"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-slate-900">
                  {selectedTicket.subject}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  {selectedTicket.description}
                </p>
              </div>

              {/* ASSIGN TICKET */}
              {selectedTicket.status !== "Resolved" && (
                <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3">
                  <label
                    htmlFor="assigned-agent"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Assign To
                  </label>

                  <select
                    id="assigned-agent"
                    value={assignedAgent}
                    onChange={(event) =>
                      setAssignedAgent(event.target.value)
                    }
                    className="w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent.name} value={agent.name}>
                        {agent.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={saveAssignment}
                    className="mt-3 w-full rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-violet-700"
                  >
                    Assign Ticket
                  </button>
                </div>
              )}

              {/* TICKET HISTORY */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-slate-800">
                  Ticket History
                </h3>

                <div className="space-y-2">
                  <div className="flex gap-3 rounded-lg bg-slate-50 p-3">
                    <MessageSquare
                      size={16}
                      className="mt-0.5 shrink-0 text-slate-500"
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-700">
                        Ticket created
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {selectedTicket.created}
                      </p>
                    </div>
                  </div>

                  {(history[selectedTicket.id] || []).map((item, index) => (
                    <div
                      key={`${selectedTicket.id}-${index}`}
                      className="flex gap-3 rounded-lg bg-violet-50/70 p-3"
                    >
                      <MessageSquare
                        size={16}
                        className="mt-0.5 shrink-0 text-violet-500"
                      />
                      <div>
                        <p className="whitespace-pre-wrap text-xs text-slate-700">
                          {item.text}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESPONSE */}
              {selectedTicket.status !== "Resolved" && (
                <div>
                  <label
                    htmlFor="ticket-response"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Add Response
                  </label>

                  <textarea
                    id="ticket-response"
                    value={response}
                    onChange={(event) => setResponse(event.target.value)}
                    placeholder="Type your response to the user..."
                    rows={3}
                    className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  />

                  <button
                    disabled={!response.trim()}
                    onClick={sendResponse}
                    className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={13} />
                    Send Response
                  </button>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              {selectedTicket.status !== "Resolved" && (
                <button
                  onClick={resolveTicket}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
