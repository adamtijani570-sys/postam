"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import { 
  Key, 
  Webhook, 
  Activity, 
  Clock, 
  Plus, 
  Copy, 
  RotateCcw, 
  Trash2, 
  X,
  AlertTriangle
} from "lucide-react";

// --- MOCK DATA ---
const initialApiKeys = [
  { id: 1, name: "Mobile App (iOS)", key: "pk_live_5f9h...k9yz", created: "2025-01-15", lastUsed: "2 hours ago", status: "Active" },
  { id: 2, name: "Mobile App (Android)", key: "pk_live_5f9h...abc1", created: "2025-01-15", lastUsed: "5 hours ago", status: "Active" },
  { id: 3, name: "Web Platform", key: "pk_live_5f9h...def2", created: "2025-02-20", lastUsed: "1 hour ago", status: "Active" },
  { id: 4, name: "Partner Integration", key: "pk_live_5f9h...gh3", created: "2025-03-10", lastUsed: "2 days ago", status: "Active" },
];

const initialWebhooks = [
  { id: 1, name: "User Registration", endpoint: "https://api.partner.com/user-registered", events: "user.created", lastTriggered: "5 min ago", status: "Active" },
  { id: 2, name: "Payment Events", endpoint: "https://api.partner.com/payment-webhook", events: "payment.success, payment.failed", lastTriggered: "1 hour ago", status: "Active" },
  { id: 3, name: "Content Moderation", endpoint: "https://api.partner.com/content-flagged", events: "content.flagged", lastTriggered: "3 days ago", status: "Active" },
];

const recentApiRequests = [
  { timestamp: "2025-10-17 10:30:15", endpoint: "/api/v1/users", method: "Get", status: 200, responseTime: "145ms", key: "Mobile App (iOS)" },
  { timestamp: "2025-10-17 10:29:45", endpoint: "/api/v1/posts/create", method: "POST", status: 201, responseTime: "234ms", key: "Mobile App (Android)" },
  { timestamp: "2025-10-17 10:28:30", endpoint: "/api/v1/wallet/balance", method: "Get", status: 200, responseTime: "98ms", key: "Web Platform" },
  { timestamp: "2025-10-17 10:27:12", endpoint: "/api/v1/posts", method: "Get", status: 200, responseTime: "167ms", key: "Mobile App (iOS)" },
  { timestamp: "2025-10-17 10:26:05", endpoint: "/api/v1/livestream/start", method: "POST", status: 500, responseTime: "2340ms", key: "Mobile App (Android)" },
];

export default function ApiIntegrations() {
  const [activeTab, setActiveTab] = useState("API Keys");
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  
  // Modal State
  const [modalType, setModalType] = useState(null); 
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
  };

  const TABS = ["API Keys", "Webhooks", "Request Log", "Documentation"];

  return (
    <>
      <Sidebar />
      <main className="ml-[280px] min-h-screen bg-gray-50 p-8 font-sans">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">API & Integrations</h1>
          <p className="text-gray-500 text-sm mt-1">Manage API keys, webhooks, and monitor system integrations.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Key size={16} className="text-purple-500"/> Active API Keys</div>
            <div className="text-2xl font-bold text-gray-900">{apiKeys.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total keys</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Webhook size={16} className="text-blue-500"/> Active Webhooks</div>
            <div className="text-2xl font-bold text-gray-900">{webhooks.length}</div>
            <div className="text-xs text-gray-500 mt-1">Configured</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Activity size={16} className="text-green-500"/> API Requests Today</div>
            <div className="text-2xl font-bold text-gray-900">24.5K</div>
            <div className="text-xs text-green-500 font-medium mt-1">98.7% success</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Clock size={16} className="text-orange-500"/> Avg Response Time</div>
            <div className="text-2xl font-bold text-gray-900">156ms</div>
            <div className="text-xs text-gray-500 mt-1">Last hour</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg w-fit mb-6 border border-gray-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT --- */}

        {/* 1. API KEYS */}
        {activeTab === "API Keys" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">API Keys</h3>
                  <p className="text-xs text-gray-500 mt-1">Manage authentication keys for API access.</p>
                </div>
                <button onClick={() => openModal('createKey')} className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                  <Plus size={16} /> Create API key
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">API Key</th>
                      <th className="pb-3 font-medium">Created</th>
                      <th className="pb-3 font-medium">Last Used</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {apiKeys.map((key) => (
                      <tr key={key.id} className="hover:bg-gray-50">
                        <td className="py-4 font-medium text-gray-900">{key.name}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 font-mono w-fit">
                            {key.key}
                            <button className="hover:text-gray-900 cursor-pointer"><Copy size={12} /></button>
                          </div>
                        </td>
                        <td className="py-4 text-gray-500">{key.created}</td>
                        <td className="py-4 text-gray-500">{key.lastUsed}</td>
                        <td className="py-4">
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-medium">{key.status}</span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openModal('regenerateKey', key)} className="text-gray-400 hover:text-gray-900 cursor-pointer" title="Regenerate"><RotateCcw size={16} /></button>
                            <button onClick={() => openModal('revokeKey', key)} className="text-red-400 hover:text-red-600 cursor-pointer" title="Revoke"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">API Usage Guidelines</h3>
              <div className="space-y-3">
                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900">Rate Limits</h4>
                  <p className="text-xs text-gray-500 mt-1">1000 requests per hour per API key</p>
                </div>
                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900">Security</h4>
                  <p className="text-xs text-gray-500 mt-1">Always use HTTPS and never expose keys in client-side code</p>
                </div>
                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900">Authentication</h4>
                  <p className="text-xs text-gray-500 mt-1">Include API key in Authorization header: Bearer YOUR_API_KEY</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. WEBHOOKS */}
        {activeTab === "Webhooks" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Webhooks</h3>
                  <p className="text-xs text-gray-500 mt-1">Configure webhook endpoints for real-time events.</p>
                </div>
                <button onClick={() => openModal('addWebhook')} className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                  <Plus size={16} /> Add Webhook
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Endpoint</th>
                      <th className="pb-3 font-medium">Events</th>
                      <th className="pb-3 font-medium">Last Triggered</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {webhooks.map((hook) => (
                      <tr key={hook.id} className="hover:bg-gray-50">
                        <td className="py-4 font-medium text-gray-900">{hook.name}</td>
                        <td className="py-4 text-gray-500 text-xs">{hook.endpoint}</td>
                        <td className="py-4 text-gray-500 text-xs">{hook.events}</td>
                        <td className="py-4 text-gray-500 text-xs">{hook.lastTriggered}</td>
                        <td className="py-4">
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-medium">{hook.status}</span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-3 text-xs font-medium">
                            <button onClick={() => openModal('testWebhook', hook)} className="text-gray-600 hover:text-gray-900 cursor-pointer">Test</button>
                            <button onClick={() => openModal('editWebhook', hook)} className="text-blue-600 hover:text-blue-800 cursor-pointer">Edit</button>
                            <button onClick={() => openModal('deleteWebhook', hook)} className="text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Available Webhook Events */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Available Webhook Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">User Events</h4>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>user.created</li><li>user.updated</li><li>user.deleted</li><li>user.verified</li>
                  </ul>
                </div>
                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Content Events</h4>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>post.created</li><li>post.flagged</li><li>post.removed</li><li>livestream.started</li>
                  </ul>
                </div>
                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Financial Events</h4>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>payment.success</li><li>payment.failed</li><li>payout.completed</li><li>coins.earned</li>
                  </ul>
                </div>
                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Moderation Events</h4>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>report.created</li><li>report.resolved</li><li>user.banned</li><li>content.approved</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. REQUEST LOG */}
        {activeTab === "Request Log" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900">Recent API Requests</h3>
              <p className="text-xs text-gray-500 mt-1 mb-6">Monitor API activity and performance.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="pb-3 font-medium">Timestamp</th>
                      <th className="pb-3 font-medium">Endpoint</th>
                      <th className="pb-3 font-medium">Method</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Response Time</th>
                      <th className="pb-3 font-medium">API Key</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentApiRequests.map((req, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-4 text-gray-500 whitespace-nowrap">{req.timestamp}</td>
                        <td className="py-4 font-mono text-xs text-gray-900">{req.endpoint}</td>
                        <td className="py-4 text-gray-500 text-xs">{req.method}</td>
                        <td className="py-4">
                          <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                            req.status >= 200 && req.status < 300 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>{req.status}</span>
                        </td>
                        <td className="py-4 text-gray-500 text-xs">{req.responseTime}</td>
                        <td className="py-4 text-gray-500 text-xs">{req.key}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Top Endpoints</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500 font-mono">/api/v1/posts</span><span className="font-medium">8,234</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 font-mono">/api/v1/users</span><span className="font-medium">5,123</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 font-mono">/api/v1/wallet/balance</span><span className="font-medium">3,456</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Response Codes</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center"><span className="text-gray-500">HTTP 200</span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">24,000</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">HTTP 201</span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">320</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">HTTP 404</span><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">120</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">HTTP 500</span><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">45</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Performance</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Avg Response Time</span><span className="font-medium">156ms</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Success Rate</span><span className="text-green-600 font-medium">98.7%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Requests/Hour</span><span className="font-medium">1,024</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. DOCUMENTATION */}
        {activeTab === "Documentation" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Quick Start Guide</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">1. Get Your API Key</h4>
                  <p className="text-xs text-gray-500">Create an API key from the API Keys tab.</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">2. Make Your First Request</h4>
                  <div className="bg-[#0f172a] text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <code>curl -X GET https://api.postam.com/v1/users \</code><br/>
                    <code className="ml-4">-H "Authorization: Bearer YOUR_API_KEY"</code>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">3. Handle Response</h4>
                  <p className="text-xs text-gray-500 mb-4">All responses are in JSON format.</p>
                  <button className="w-full bg-gray-900 text-white text-sm py-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                    View Full Documentation
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-6">API Endpoints</h3>
              <div className="space-y-3">
                {[
                  { method: "GET", path: "/v1/users", desc: "List all users" },
                  { method: "POST", path: "/v1/posts", desc: "Create new post" },
                  { method: "GET", path: "/v1/wallet/balance", desc: "Get wallet balance" },
                  { method: "POST", path: "/v1/livestream", desc: "Start livestream" },
                  { method: "GET", path: "/v1/analytics", desc: "Get analytics data" },
                ].map((ep, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded w-12 text-center ${
                        ep.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>{ep.method}</span>
                      <span className="text-sm font-mono text-gray-900">{ep.path}</span>
                    </div>
                    <span className="text-xs text-gray-500">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- MODALS --- */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* 1. Create API Key Modal */}
            {modalType === 'createKey' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Create API Key</h3>
                    <p className="text-xs text-gray-500 mt-1">Create a new API key for authentication.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Key Name</label>
                    <input type="text" placeholder="e.g., Production Server" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Environment</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option>Production</option>
                      <option>Staging</option>
                      <option>Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Permissions</label>
                    <div className="space-y-2 text-sm text-gray-900">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" /> Read Access</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" /> Write Access</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" /> Delete Access</label>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg flex gap-3 mt-6">
                  <AlertTriangle className="text-yellow-600 shrink-0" size={18} />
                  <p className="text-xs text-yellow-800"><strong>Security Notice:</strong> Make sure to copy your API key now. You won't be able to see it again!</p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center gap-2 cursor-pointer"><Key size={14}/> Generate Key</button>
                </div>
              </div>
            )}

            {/* 2. Regenerate API Key Modal */}
            {modalType === 'regenerateKey' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Regenerate API Key</h3>
                    <p className="text-xs text-gray-500 mt-1">Create a new key for {selectedItem?.name}.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>

                <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex gap-3 mb-4">
                  <AlertTriangle className="text-red-500 shrink-0" size={18} />
                  <p className="text-xs text-red-800"><strong>Warning:</strong> Regenerating this key will immediately invalidate the old key. Any applications using the old key will stop working.</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Reason for Regeneration</label>
                  <textarea placeholder="Describe why the key is being regenerated..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"></textarea>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 cursor-pointer"><RotateCcw size={14}/> Regenerate Key</button>
                </div>
              </div>
            )}

            {/* 3. Revoke API Key Modal */}
            {modalType === 'revokeKey' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Revoke API Key</h3>
                    <p className="text-xs text-gray-500 mt-1">Permanently delete {selectedItem?.name}.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>

                <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex gap-3 mb-4">
                  <AlertTriangle className="text-red-500 shrink-0" size={18} />
                  <p className="text-xs text-red-800"><strong>Warning:</strong> This action cannot be undone. Any applications using this key will immediately lose access.</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">To confirm, type <strong>DELETE</strong> below:</label>
                  <input type="text" placeholder="Type DELETE to confirm" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 cursor-pointer"><Trash2 size={14}/> Revoke Key</button>
                </div>
              </div>
            )}

            {/* 4. Add Webhook Modal */}
            {modalType === 'addWebhook' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Add Webhook</h3>
                    <p className="text-xs text-gray-500 mt-1">Configure a new webhook endpoint.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Webhook Name</label>
                    <input type="text" placeholder="e.g., User Activity Tracker" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Endpoint URL</label>
                    <input type="text" placeholder="https://your-server.com/webhook" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p className="text-[10px] text-gray-400 mt-1">Must be a valid HTTPS URL.</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Subscribe to Events</label>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-900 border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600" /> user.created</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600" /> user.updated</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600" /> post.created</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600" /> post.flagged</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600" /> payment.success</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600" /> payment.failed</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center gap-2 cursor-pointer"><Plus size={14}/> Add Webhook</button>
                </div>
              </div>
            )}

            {/* 5. Test Webhook Modal */}
            {modalType === 'testWebhook' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Test Webhook</h3>
                    <p className="text-xs text-gray-500 mt-1">Send a test event to {selectedItem?.name}.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Event Type</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option>Select event to test</option>
                      <option>user.created</option>
                      <option>post.created</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Test Payload (JSON)</label>
                    <textarea 
                      className="w-full border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-900 bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-none" 
                      defaultValue={`{
  "event": "user.created",
  "timestamp": "2025-10-17T14:30:00Z",
  "data": {
    "user_id": "12345",
    "email": "test@example.com"
  }
}`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center gap-2 cursor-pointer"><Activity size={14}/> Send Test Event</button>
                </div>
              </div>
            )}

            {/* 6. Edit Webhook Modal */}
            {modalType === 'editWebhook' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Edit Webhook</h3>
                    <p className="text-xs text-gray-500 mt-1">Update {selectedItem?.name}.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Webhook Name</label>
                    <input type="text" defaultValue={selectedItem?.name} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Endpoint URL</label>
                    <input type="text" defaultValue={selectedItem?.endpoint} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Status</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg cursor-pointer">Save Changes</button>
                </div>
              </div>
            )}

            {/* 7. Delete Webhook Modal */}
            {modalType === 'deleteWebhook' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Webhook</h3>
                    <p className="text-xs text-gray-500 mt-1">Remove {selectedItem?.name}.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>

                <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this webhook? This action cannot be undone and events will no longer be sent to this endpoint.</p>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 cursor-pointer"><Trash2 size={14}/> Delete Webhook</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}