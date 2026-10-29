"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import { 
  Flag, AlertTriangle, CheckCircle, FileText, 
  X, ShieldAlert, CheckSquare, Square
} from "lucide-react";

// --- MOCK DATA ---
const unresolvedReports = [
  { id: 1, reporter: "User A", reportedUser: "John Doe", initial: "J", email: "john@email.com", content: "Inappropriate comment", category: "Harassment", priority: "High", date: "2025-10-17 09:30", status: "Unresolved" },
  { id: 2, reporter: "User B", reportedUser: "Jane Smith", initial: "J", email: "jane@email.com", content: "Spam post about...", category: "Spam", priority: "Medium", date: "2025-10-17 08:15", status: "Under Review" },
  { id: 3, reporter: "User C", reportedUser: "Mike Johnson", initial: "M", email: "mike@email.com", content: "Fake product listing", category: "Fraud", priority: "High", date: "2025-10-16 22:45", status: "Unresolved" },
  { id: 4, reporter: "User D", reportedUser: "Sarah Lee", initial: "S", email: "sarah@email.com", content: "Offensive image", category: "Inappropriate Content", priority: "Critical", date: "2025-10-16 20:30", status: "Unresolved" },
];

const autoFlaggedReports = [
  { id: 1, content: "Post with banned keywords", type: "Text Post", author: "User X", reason: "Prohibited keywords", confidence: 95, date: "2025-10-17 10:15" },
  { id: 2, content: "Image with inappropriate content", type: "Image", author: "User Y", reason: "Visual content violation", confidence: 88, date: "2025-10-17 09:45" },
  { id: 3, content: "Suspicious link detected", type: "Text Post", author: "User Z", reason: "Phishing attempt", confidence: 92, date: "2025-10-17 08:20" },
];

const resolvedReports = [
  { id: 1, reporter: "User E", reportedUser: "Test User", content: "Spam message", category: "Spam", action: "Content Removed", resolvedBy: "Admin A", date: "2025-10-16 14:20" },
  { id: 2, reporter: "User F", reportedUser: "Another User", content: "Copyright violation", category: "Copyright", action: "User Warned", resolvedBy: "Admin B", date: "2025-10-16 11:30" },
  { id: 3, reporter: "User G", reportedUser: "Bad Actor", content: "Hate speech", category: "Harassment", action: "User Banned", resolvedBy: "Admin A", date: "2025-10-15 16:45" },
];

const TABS = ["Unresolved", "Auto Flagged", "Resolved", "Flag Settings"];

export default function ReportsFlagged() {
  const [activeTab, setActiveTab] = useState("Unresolved");
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

  return (
    <>
      <Sidebar />
      <main className="ml-[280px] min-h-screen bg-gray-50 p-8 font-sans">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Flagged Content</h1>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Flag size={16} className="text-red-500"/> Unresolved Reports</div>
            <div className="text-2xl font-bold text-gray-900">4</div>
            <div className="text-xs text-red-500 font-medium mt-1">Requires attention</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><AlertTriangle size={16} className="text-orange-500"/> Auto-Flagged</div>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-xs text-orange-500 font-medium mt-1">System Detection</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><CheckCircle size={16} className="text-green-500"/> Resolved Today</div>
            <div className="text-2xl font-bold text-gray-900">23</div>
            <div className="text-xs text-green-500 font-medium mt-1">Successfully handled</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><FileText size={16} className="text-gray-400"/> Total This Week</div>
            <div className="text-2xl font-bold text-gray-900">147</div>
            <div className="text-xs text-gray-500 mt-1">All reports</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg w-fit mb-6 border border-gray-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab} {tab === "Unresolved" && "(4)"} {tab === "Auto Flagged" && "(3)"}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT --- */}

        {/* 1. UNRESOLVED TAB */}
        {activeTab === "Unresolved" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Unresolved User Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 font-medium">Reporter</th>
                    <th className="py-4 px-6 font-medium">Reported User</th>
                    <th className="py-4 px-6 font-medium">Content</th>
                    <th className="py-4 px-6 font-medium">Category</th>
                    <th className="py-4 px-6 font-medium">Priority</th>
                    <th className="py-4 px-6 font-medium">Date</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {unresolvedReports.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6 text-gray-500 text-xs">{item.reporter}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-purple-700 bg-purple-100">
                            {item.initial}
                          </div>
                          <span className="text-gray-900 font-medium">{item.reportedUser}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-500">{item.content}</td>
                      <td className="py-4 px-6 text-gray-500">{item.category}</td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                          item.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                          item.priority === 'High' ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-xs whitespace-nowrap">{item.date}</td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                          item.status === "Unresolved" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <button onClick={() => openModal('reviewUserReport', item)} className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer">Review</button>
                          <button onClick={() => openModal('resolveReport', item)} className="text-xs font-medium text-green-600 bg-white border border-green-200 px-3 py-1.5 rounded-md hover:bg-green-50 cursor-pointer">Resolve</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. AUTO FLAGGED TAB */}
        {activeTab === "Auto Flagged" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Auto-Flagged Content</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 font-medium">Content</th>
                    <th className="py-4 px-6 font-medium">Type</th>
                    <th className="py-4 px-6 font-medium">Author</th>
                    <th className="py-4 px-6 font-medium">Flag Reason</th>
                    <th className="py-4 px-6 font-medium">Confidence</th>
                    <th className="py-4 px-6 font-medium">Date</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {autoFlaggedReports.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6 text-gray-900 font-medium">{item.content}</td>
                      <td className="py-4 px-6 text-gray-500 text-xs">{item.type}</td>
                      <td className="py-4 px-6 text-gray-500 text-xs">{item.author}</td>
                      <td className="py-4 px-6 text-gray-500 text-xs">{item.reason}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.confidence > 90 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${item.confidence}%` }} />
                          </div>
                          <span className="text-xs font-medium">{item.confidence}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-xs whitespace-nowrap">{item.date}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <button onClick={() => openModal('reviewAutoFlag', item)} className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer">Review</button>
                          <button onClick={() => openModal('removeContent', item)} className="text-xs font-medium text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 cursor-pointer">Remove</button>
                          <button onClick={() => openModal('dismissFlag', item)} className="text-xs font-medium text-green-600 bg-white border border-green-200 px-3 py-1.5 rounded-md hover:bg-green-50 cursor-pointer">Dismiss</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. RESOLVED TAB */}
        {activeTab === "Resolved" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Resolved Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 font-medium">Reporter</th>
                    <th className="py-4 px-6 font-medium">Reported User</th>
                    <th className="py-4 px-6 font-medium">Content</th>
                    <th className="py-4 px-6 font-medium">Category</th>
                    <th className="py-4 px-6 font-medium">Action Taken</th>
                    <th className="py-4 px-6 font-medium">Resolved By</th>
                    <th className="py-4 px-6 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {resolvedReports.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6 text-gray-500 text-xs">{item.reporter}</td>
                      <td className="py-4 px-6 text-gray-900 font-medium">{item.reportedUser}</td>
                      <td className="py-4 px-6 text-gray-500 text-xs">{item.content}</td>
                      <td className="py-4 px-6 text-gray-500 text-xs">{item.category}</td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                          item.action === 'User Banned' ? 'bg-green-500 text-white' : 
                          item.action === 'Content Removed' ? 'bg-green-600 text-white' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.action}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-xs">{item.resolvedBy}</td>
                      <td className="py-4 px-6 text-gray-500 text-xs whitespace-nowrap">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. FLAG SETTINGS TAB */}
        {activeTab === "Flag Settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Auto-Flag Configuration */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Auto-Flag Configuration</h3>
                <div className="space-y-5">
                  {[
                    { title: "Keyword Detection", desc: "Flag posts containing prohibited words", checked: true },
                    { title: "Image Content Analysis", desc: "AI-powered inappropriate image detection", checked: true },
                    { title: "Spam Detection", desc: "Identify repetitive or spam content", checked: true },
                    { title: "Link Safety Check", desc: "Flag suspicious or phishing links", checked: true },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      {/* Custom Toggle Switch */}
                      <button className={`w-10 h-5 rounded-full relative flex items-center transition-colors ${item.checked ? 'bg-blue-500' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute transition-transform ${item.checked ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Confidence Threshold</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Minimum confidence level to auto-flag (%): <strong>80%</strong></span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="80" className="w-full accent-blue-500" />
                  <p className="text-[10px] text-gray-400 mt-2">Lower values = more sensitive (may flag more false positives)</p>
                </div>
              </div>
            </div>

            {/* Report Categories */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit">
              <h3 className="font-semibold text-gray-900 mb-6">Report Categories</h3>
              <div className="space-y-3">
                {[
                  "Harassment", "Spam", "Fraud", "Inappropriate Content", "Copyright", "Hate Speech", "Violence", "Self-Harm"
                ].map((category) => (
                  <div key={category} className="flex justify-between items-center p-3 bg-[#f8f9fa] rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{category}</span>
                    <button 
                      onClick={() => openModal('editPriority', category)} 
                      className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      Edit Priority
                    </button>
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
            
            {/* 1. Review User Report Modal */}
            {modalType === 'reviewUserReport' && selectedItem && (
              <div className="p-0">
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Review Report</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Reporter</p>
                      <p className="text-sm font-medium text-gray-900">{selectedItem.reporter}</p>
                      <p className="text-xs text-gray-500">{selectedItem.email.replace("john", "user")}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Reported User</p>
                      <p className="text-sm font-medium text-gray-900">{selectedItem.reportedUser}</p>
                      <p className="text-xs text-gray-500">{selectedItem.email}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Category</span>
                    <span className="text-sm font-medium text-gray-900">{selectedItem.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Priority</span>
                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                      selectedItem.priority === 'Critical' ? 'bg-red-500 text-white' :
                      selectedItem.priority === 'High' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>{selectedItem.priority}</span>
                  </div>

                  <div className="bg-red-50 border border-red-100 p-3 rounded-lg mt-4">
                    <p className="text-xs text-gray-500 mb-1">Reported Content:</p>
                    <p className="text-sm text-gray-800">This is an inappropriate comment that violates community guidelines...</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Report Date</p>
                      <p className="text-sm font-medium">{selectedItem.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Content Type</p>
                      <p className="text-sm font-medium">User Report</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Close</button>
                  <button onClick={() => { closeModal(); setTimeout(() => openModal('dismissFlag', selectedItem), 100); }} className="px-4 py-2 text-sm font-medium text-green-600 border border-green-200 hover:bg-green-50 rounded-lg cursor-pointer">Dismiss</button>
                  <button onClick={() => { closeModal(); setTimeout(() => openModal('resolveReport', selectedItem), 100); }} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">Take Action</button>
                </div>
              </div>
            )}

            {/* 2. Review Auto-Flag Modal */}
            {modalType === 'reviewAutoFlag' && selectedItem && (
              <div className="p-0">
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Review Report</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Reporter</p>
                      <p className="text-sm font-medium text-gray-900">Auto-Flagged</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Reported User</p>
                      <p className="text-sm font-medium text-gray-900">{selectedItem.author}</p>
                      <p className="text-xs text-gray-500">user@email.com</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Category</span>
                    <span className="text-sm font-medium text-gray-900">{selectedItem.reason}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">AI Confidence</span>
                    <span className="text-sm font-medium text-gray-900">{selectedItem.confidence}%</span>
                  </div>

                  <div className="bg-red-50 border border-red-100 p-3 rounded-lg mt-4">
                    <p className="text-xs text-gray-500 mb-1">Reported Content:</p>
                    <p className="text-sm text-gray-800">This post contains banned keywords that violate our content policy...</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Report Date</p>
                      <p className="text-sm text-black font-medium">{selectedItem.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Content Type</p>
                      <p className="text-sm text-black font-medium">{selectedItem.type}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Close</button>
                  <button onClick={() => { closeModal(); setTimeout(() => openModal('dismissFlag', selectedItem), 100); }} className="px-4 py-2 text-sm font-medium text-green-600 border border-green-200 hover:bg-green-50 rounded-lg cursor-pointer">Dismiss</button>
                  <button onClick={() => { closeModal(); setTimeout(() => openModal('resolveReport', selectedItem), 100); }} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">Take Action</button>
                </div>
              </div>
            )}

            {/* 3. Dismiss Flag Modal */}
            {modalType === 'dismissFlag' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Dismiss Flag</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Reason for Dismissal</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option>Select reason</option>
                      <option>Not a violation</option>
                      <option>False positive</option>
                      <option>Context misunderstood</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Notes</label>
                    <textarea placeholder="Add notes about why this was dismissed..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"></textarea>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                    <p className="text-xs text-blue-800">This feedback will be used to improve the system detection system.</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">Dismiss Flag</button>
                </div>
              </div>
            )}

            {/* 4. Resolve Report Modal */}
            {modalType === 'resolveReport' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Resolve Report</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Action to Take</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option>Select action</option>
                      <option>No Violation Found</option>
                      <option>Content Removed</option>
                      <option>User Warned</option>
                      <option>User Banned</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Resolution Notes</label>
                    <textarea placeholder="Explain the action taken and reasoning..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"></textarea>
                  </div>
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="checkbox" defaultChecked className="rounded text-purple-600" /> Notify reporter of resolution
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="checkbox" defaultChecked className="rounded text-purple-600" /> Notify reported user
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">Resolve Report</button>
                </div>
              </div>
            )}

            {/* 5. Remove Content Modal */}
            {modalType === 'removeContent' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Remove Flagged Content</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                <p className="text-sm text-gray-600 mb-6">Are you sure you want to remove this content? This action cannot be undone.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Removal Reason</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                      <option>Select reason</option>
                      <option>Violation of Terms</option>
                      <option>Spam</option>
                      <option>Inappropriate Content</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Additional Details</label>
                    <textarea placeholder="Add any additional context..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 h-20 resize-none"></textarea>
                  </div>
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="checkbox" defaultChecked className="rounded text-red-600" /> Warn user about policy violation
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="checkbox" className="rounded text-red-600" /> Add strike to user's account
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer">Remove Content</button>
                </div>
              </div>
            )}

            {/* 6. Edit Category Priority Modal */}
            {modalType === 'editPriority' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Edit Category Priority</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Default Priority Level</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option>Medium</option>
                      <option>Low</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Auto-escalate after</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option>24 hours</option>
                      <option>12 hours</option>
                      <option>48 hours</option>
                      <option>Never</option>
                    </select>
                  </div>
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="checkbox" defaultChecked className="rounded text-purple-600" /> Send notification to moderators
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="checkbox" defaultChecked className="rounded text-purple-600" /> Auto-remove if multiple reports
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">Save Changes</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}