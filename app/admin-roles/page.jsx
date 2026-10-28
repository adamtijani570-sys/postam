"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import {
  Activity,
  KeyRound,
  Webhook,
  Code2,
  Plus,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

const initialKeys = [
  {
    id: 1,
    name: "Mobile App (iOS)",
    key: "pk_live_51H...xyz",
    created: "2025-01-15",
    lastUsed: "2 hours ago",
    status: "Active",
  },
  {
    id: 2,
    name: "Mobile App (Android)",
    key: "pk_live_51H...abc",
    created: "2025-01-15",
    lastUsed: "5 hours ago",
    status: "Active",
  },
  {
    id: 3,
    name: "Web Platform",
    key: "pk_live_51H...def",
    created: "2025-02-20",
    lastUsed: "1 hour ago",
    status: "Active",
  },
  {
    id: 4,
    name: "Partner Integration",
    key: "pk_live_51H...ghi",
    created: "2025-03-10",
    lastUsed: "2 days ago",
    status: "Active",
  },
];

const tabs = ["API Keys", "Webhooks", "Request Logs", "Documentation"];

export default function AdminRolePage() {
  const [activeTab, setActiveTab] = useState("API Keys");
  const [keys, setKeys] = useState(initialKeys);
  const [visibleKeys, setVisibleKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");

  const stats = [
    {
      title: "Active API Keys",
      value: keys.length,
      footer: "Total keys",
      icon: KeyRound,
      color: "text-purple-600",
    },
    {
      title: "Active Webhooks",
      value: 2,
      footer: "Configured",
      icon: Webhook,
      color: "text-blue-600",
    },
    {
      title: "API Requests Today",
      value: "24.5K",
      footer: "98.7% success",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Avg Response Time",
      value: "156ms",
      footer: "Last hour",
      icon: Code2,
      color: "text-orange-500",
    },
  ];

  function toggleKey(id) {
    setVisibleKeys((current) =>
      current.includes(id)
        ? current.filter((keyId) => keyId !== id)
        : [...current, id]
    );
  }

  async function copyKey(key) {
    try {
      await navigator.clipboard.writeText(key);
      window.alert("API key copied!");
    } catch {
      window.alert("Unable to copy. Check your browser permissions.");
    }
  }

  function createKey(event) {
    event.preventDefault();

    if (!keyName.trim()) return;

    const newKey = {
      id: Date.now(),
      name: keyName.trim(),
      key: `pk_live_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`,
      created: new Date().toISOString().slice(0, 10),
      lastUsed: "Never",
      status: "Active",
    };

    setKeys((current) => [...current, newKey]);
    setVisibleKeys((current) => [...current, newKey.id]);
    setKeyName("");
    setModalOpen(false);
  }

  function regenerateKey(id) {
    if (!window.confirm("Regenerate this demo API key?")) return;

    setKeys((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              key: `pk_live_${crypto.randomUUID()
                .replaceAll("-", "")
                .slice(0, 12)}`,
              lastUsed: "Never",
            }
          : item
      )
    );

    setVisibleKeys((current) =>
      current.includes(id) ? current : [...current, id]
    );
  }

  function deleteKey(id) {
    if (!window.confirm("Delete this demo API key?")) return;

    setKeys((current) => current.filter((item) => item.id !== id));
    setVisibleKeys((current) =>
      current.filter((keyId) => keyId !== id)
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Existing Postam sidebar */}
      <Sidebar />

      {/* Main content: reserve space for the fixed sidebar */}
      <main className="min-h-screen min-w-0 bg-[#f7f8fa] px-4 py-5 sm:px-6 lg:px-7 md:ml-[250px]">
        <div className="mx-auto max-w-[1500px] space-y-4">
          {/* Page heading */}
          <header>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              API &amp; Integrations
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage API keys, webhooks, and monitor system integrations.
            </p>
          </header>

          {/* Statistics cards */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-lg border border-slate-200 bg-white p-3.5"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={stat.color} />
                    <span className="text-[11px] font-medium text-slate-600">
                      {stat.title}
                    </span>
                  </div>

                  <p className="mt-3 text-xl font-bold text-slate-900">
                    {stat.value}
                  </p>

                  <p
                    className={`mt-2 text-[10px] ${
                      stat.title === "API Requests Today"
                        ? "font-medium text-green-600"
                        : "text-slate-500"
                    }`}
                  >
                    {stat.footer}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Navigation tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-md px-3 py-2 text-[10px] font-medium transition ${
                  activeTab === tab
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* API Keys table */}
          {activeTab === "API Keys" && (
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xs font-semibold text-slate-900">
                    API Keys
                  </h2>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Manage authentication keys for API access
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-slate-950 px-3 py-2 text-[10px] font-medium text-white hover:bg-slate-800"
                >
                  <Plus size={12} />
                  Create API Key
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {[
                        "Name",
                        "API Key",
                        "Created",
                        "Last Used",
                        "Status",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-3 py-3 text-[10px] font-semibold text-slate-700 first:pl-4"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {keys.map((item) => {
                      const visible = visibleKeys.includes(item.id);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70">
                          <td className="whitespace-nowrap px-3 py-2.5 pl-4 text-[10px] text-slate-800">
                            {item.name}
                          </td>

                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <code className="max-w-32 truncate rounded bg-slate-100 px-2 py-1.5 text-[10px] text-slate-700">
                                {visible
                                  ? item.key
                                  : item.key.slice(0, 11) + "..."}
                              </code>

                              <button
                                type="button"
                                title={visible ? "Hide key" : "Show key"}
                                aria-label={visible ? "Hide API key" : "Show API key"}
                                onClick={() => toggleKey(item.id)}
                                className="text-slate-500 hover:text-slate-900"
                              >
                                {visible ? (
                                  <EyeOff size={12} />
                                ) : (
                                  <Eye size={12} />
                                )}
                              </button>

                              <button
                                type="button"
                                title="Copy API key"
                                aria-label="Copy API key"
                                onClick={() => copyKey(item.key)}
                                className="text-slate-500 hover:text-slate-900"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-3 py-2.5 text-[10px] text-slate-500">
                            {item.created}
                          </td>

                          <td className="whitespace-nowrap px-3 py-2.5 text-[10px] text-slate-500">
                            {item.lastUsed}
                          </td>

                          <td className="px-3 py-2.5">
                            <span className="rounded-md bg-green-500 px-2.5 py-1 text-[9px] font-medium text-white">
                              {item.status}
                            </span>
                          </td>

                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                title="Regenerate demo key"
                                onClick={() => regenerateKey(item.id)}
                                className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                              >
                                <RefreshCw size={12} />
                              </button>

                              <button
                                type="button"
                                title="Delete API key"
                                onClick={() => deleteKey(item.id)}
                                className="rounded-md border border-red-100 p-1.5 text-red-500 hover:bg-red-50"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {keys.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-xs text-slate-500"
                        >
                          No API keys yet. Create a key to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Webhooks */}
          {activeTab === "Webhooks" && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Webhook size={16} className="text-blue-600" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Webhooks
                </h2>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Configure webhook endpoints and subscribe to application events.
              </p>
              <div className="mt-4 rounded-md border border-dashed border-slate-200 p-6 text-center">
                <p className="text-xs font-medium text-slate-700">
                  No webhook management connected
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Connect your backend to manage real webhook endpoints.
                </p>
              </div>
            </section>
          )}

          {/* Request Logs */}
          {activeTab === "Request Logs" && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-green-600" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Request Logs
                </h2>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                View API request history, status codes, and response times.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[450px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Endpoint", "Method", "Status", "Response"].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="px-3 py-3 text-[10px] font-semibold text-slate-700"
                          >
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50">
                      <td className="px-3 py-3 text-xs text-slate-700">
                        /v1/forms
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500">GET</td>
                      <td className="px-3 py-3">
                        <span className="rounded bg-green-50 px-2 py-1 text-[10px] text-green-700">
                          200 OK
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500">156ms</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3 text-xs text-slate-700">
                        /v1/submissions
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500">POST</td>
                      <td className="px-3 py-3">
                        <span className="rounded bg-green-50 px-2 py-1 text-[10px] text-green-700">
                          201 Created
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500">184ms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[10px] text-slate-400">
                Example entries only; live logs require backend integration.
              </p>
            </section>
          )}

          {/* Documentation */}
          {activeTab === "Documentation" && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-purple-600" />
                <h2 className="text-sm font-semibold text-slate-900">
                  API Documentation
                </h2>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Authenticate using a Bearer token. Keep secret API keys on your
                server and never expose them in browser code.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-md bg-slate-950 p-4 text-xs leading-6 text-white">
{`Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </section>
          )}

          {/* Usage guidelines */}
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-xs font-semibold text-slate-900">
              API Usage Guidelines
            </h2>
            <div className="mt-4 space-y-2">
              {[
                {
                  title: "Rate Limits",
                  description: "1000 requests per hour per API key",
                },
                {
                  title: "Security",
                  description:
                    "Always use HTTPS and never expose keys in client-side code",
                },
                {
                  title: "Authentication",
                  description:
                    "Include API key in Authorization header: Bearer YOUR_API_KEY",
                },
              ].map((guideline) => (
                <div
                  key={guideline.title}
                  className="rounded-sm bg-[#edf4ff] px-3 py-2.5"
                >
                  <h3 className="text-[10px] font-medium text-slate-800">
                    {guideline.title}
                  </h3>
                  <p className="mt-1 text-[10px] text-slate-600">
                    {guideline.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Create API Key modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setModalOpen(false);
              }
            }}
          >
            <form
              onSubmit={createKey}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Create API Key
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter a name for your new integration.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => setModalOpen(false)}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              </div>

              <label
                htmlFor="api-key-name"
                className="mt-5 block text-xs font-medium text-slate-700"
              >
                Key name
              </label>
              <input
                id="api-key-name"
                value={keyName}
                onChange={(event) => setKeyName(event.target.value)}
                placeholder="e.g. Customer Portal"
                required
                autoFocus
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />

              <p className="mt-3 text-[11px] leading-5 text-amber-700">
                Demo only: a production API key must be generated securely by
                your backend.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setKeyName("");
                  }}
                  className="rounded-md border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-slate-950 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
                >
                  Create key
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
