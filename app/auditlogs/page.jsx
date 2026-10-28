// app/audit-logs/page.jsx
"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar"; // Kept exactly as you provided
import {
  FileText,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Download,
  MoreHorizontal,
  Search,
  X,
  ChevronDown,
} from "lucide-react";

// --- Mock Data ---
const auditLogs = [
  { id: 1, timestamp: "2025-10-17 14:30:25", admin: "Admin User", initials: "A", action: "User Banned", target: "john.doe@email.com", ip: "192.168.1.1", severity: "High" },
  { id: 2, timestamp: "2025-10-17 14:15:10", admin: "Sarah Johnson", initials: "S", action: "Content Removed", target: "Post ID: 12345", ip: "192.168.1.2", severity: "Medium" },
  { id: 3, timestamp: "2025-10-17 13:45:33", admin: "Michael Okafor", initials: "M", action: "Payout Approved", target: "Transaction: TXN-001", ip: "192.168.1.3", severity: "Low" },
  { id: 4, timestamp: "2025-10-17 13:20:18", admin: "Grace Adebayo", initials: "G", action: "Config Changed", target: "Feature Toggles", ip: "192.168.1.4", severity: "High" },
  { id: 5, timestamp: "2025-10-17 12:55:47", admin: "Admin User", initials: "A", action: "Role Updated", target: "Content Moderator", ip: "192.168.1.1", severity: "Medium" },
  { id: 6, timestamp: "2025-10-17 12:30:29", admin: "David Chen", initials: "D", action: "Report Resolved", target: "Report ID: 789", ip: "192.168.1.5", severity: "Low" },
  { id: 7, timestamp: "2025-10-17 11:45:15", admin: "Sarah Johnson", initials: "S", action: "User Suspended", target: "sarah.user@email.com", ip: "192.168.1.2", severity: "High" },
  { id: 8, timestamp: "2025-10-17 11:20:03", admin: "Michael Okafor", initials: "M", action: "Ticket Resolved", target: "TKT-1234", ip: "192.168.1.3", severity: "Low" },
];

const topActions = [
  { action: "Content Removed", count: 45 },
  { action: "User Warned", count: 32 },
  { action: "Report Resolved", count: 28 },
  { action: "Payout Approved", count: 18 },
];

const activeAdmins = [
  { name: "Sarah Johnson", initials: "S", count: 78, color: "bg-purple-100 text-purple-700" },
  { name: "Admin User", initials: "A", count: 65, color: "bg-purple-100 text-purple-700" },
  { name: "Michael Okafor", initials: "M", count: 52, color: "bg-purple-100 text-purple-700" },
  { name: "David Chen", initials: "D", count: 38, color: "bg-purple-100 text-purple-700" },
];

const actionCategories = [
  { name: "Content Moderation", percentage: 42, color: "bg-[#7555ff]" },
  { name: "User Management", percentage: 28, color: "bg-[#9d82ff]" },
  { name: "Financial Operations", percentage: 18, color: "bg-[#c2b3ff]" },
  { name: "Configuration", percentage: 12, color: "bg-[#e0d9ff]" },
];

export default function AuditLogsPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const openModal = (modalName, log = null) => {
    setSelectedLog(log);
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedLog(null);
  };

  // Helper to get badge styling
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-orange-100 text-orange-600";
      case "Low":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Sidebar />
      
      <main className="ml-[280px] p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#24283b]">Audit Logs</h1>
        </div>

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#eeeeF4] bg-white p-5 shadow-sm border-l-4 border-l-[#7555ff]">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-[#7555ff]" />
              <span className="text-sm font-medium text-[#85899a]">Total Logs Today</span>
            </div>
            <div className="text-2xl font-bold text-[#24283b] mb-1">247</div>
            <div className="text-xs text-[#85899a]">All activities</div>
          </div>
          
          <div className="rounded-xl border border-[#eeeeF4] bg-white p-5 shadow-sm border-l-4 border-l-red-500">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-sm font-medium text-[#85899a]">High Severity</span>
            </div>
            <div className="text-2xl font-bold text-[#24283b] mb-1">12</div>
            <div className="text-xs text-red-500 font-medium">Requires attention</div>
          </div>

          <div className="rounded-xl border border-[#eeeeF4] bg-white p-5 shadow-sm border-l-4 border-l-orange-400">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-orange-400" />
              <span className="text-sm font-medium text-[#85899a]">Medium Severity</span>
            </div>
            <div className="text-2xl font-bold text-[#24283b] mb-1">45</div>
            <div className="text-xs text-[#85899a]">Routine changes</div>
          </div>

          <div className="rounded-xl border border-[#eeeeF4] bg-white p-5 shadow-sm border-l-4 border-l-green-500">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm font-medium text-[#85899a]">Low Severity</span>
            </div>
            <div className="text-2xl font-bold text-[#24283b] mb-1">190</div>
            <div className="text-xs text-green-500 font-medium">Standard operations</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-6 rounded-xl border border-[#eeeeF4] bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#85899a] mb-1">Date Range</span>
              <div className="relative">
                <select className="appearance-none rounded-lg border border-[#e7e7ef] bg-white py-1.5 pl-3 pr-8 text-sm text-[#24283b] outline-none focus:border-[#7555ff]">
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>Last 7 Days</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#85899a] pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#85899a] mb-1">Admin</span>
              <div className="relative">
                <select className="appearance-none rounded-lg border border-[#e7e7ef] bg-white py-1.5 pl-3 pr-8 text-sm text-[#24283b] outline-none focus:border-[#7555ff]">
                  <option>All Admins</option>
                  <option>Admin User</option>
                  <option>Sarah Johnson</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#85899a] pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#85899a] mb-1">Action Type</span>
              <div className="relative">
                <select className="appearance-none rounded-lg border border-[#e7e7ef] bg-white py-1.5 pl-3 pr-8 text-sm text-[#24283b] outline-none focus:border-[#7555ff]">
                  <option>All Actions</option>
                  <option>User Banned</option>
                  <option>Content Removed</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#85899a] pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#85899a] mb-1">Severity</span>
              <div className="relative">
                <select className="appearance-none rounded-lg border border-[#e7e7ef] bg-white py-1.5 pl-3 pr-8 text-sm text-[#24283b] outline-none focus:border-[#7555ff]">
                  <option>All Levels</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#85899a] pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => openModal("advancedFilters")}
              className="flex items-center gap-2 rounded-lg border border-[#e7e7ef] px-4 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]"
            >
              <Filter size={16} /> More
            </button>
            <button 
              onClick={() => openModal("export")}
              className="flex items-center gap-2 rounded-lg bg-[#7555ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6344e6]"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Activity Log Table */}
        <div className="mb-6 rounded-xl border border-[#eeeeF4] bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#eeeeF4]">
            <h3 className="text-base font-semibold text-[#24283b]">Activity Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8f9fa] text-xs text-[#85899a]">
                <tr>
                  <th className="px-6 py-3 font-medium">Timestamp</th>
                  <th className="px-6 py-3 font-medium">Admin</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium">Target</th>
                  <th className="px-6 py-3 font-medium">IP Address</th>
                  <th className="px-6 py-3 font-medium">Severity</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f5]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="px-6 py-3 text-[#85899a] whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${log.color || 'bg-purple-100 text-purple-700'}`}>
                          {log.initials}
                        </div>
                        <span className="font-medium text-[#24283b]">{log.admin}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-[#24283b]">{log.action}</td>
                    <td className="px-6 py-3 text-[#85899a]">{log.target}</td>
                    <td className="px-6 py-3 text-[#85899a]">{log.ip}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getSeverityBadge(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button 
                        onClick={() => openModal("details", log)}
                        className="rounded-md border border-[#e7e7ef] bg-white px-3 py-1 text-xs font-medium text-[#24283b] hover:bg-[#f8f9fa]"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Top Actions Today */}
          <div className="rounded-xl border border-[#eeeeF4] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#24283b] mb-4">Top Actions Today</h3>
            <div className="space-y-3">
              {topActions.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-[#85899a]">{item.action}</span>
                  <span className="font-medium text-[#24283b]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Most Active Admins */}
          <div className="rounded-xl border border-[#eeeeF4] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#24283b] mb-4">Most Active Admins</h3>
            <div className="space-y-3">
              {activeAdmins.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${item.color}`}>
                      {item.initials}
                    </div>
                    <span className="text-sm text-[#85899a]">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-[#24283b]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Categories */}
          <div className="rounded-xl border border-[#eeeeF4] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#24283b] mb-4">Action Categories</h3>
            <div className="space-y-4">
              {actionCategories.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-[#85899a]">{item.name}</span>
                    <span className="font-medium text-[#24283b]">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#f0f0f5] rounded-full h-1.5">
                    <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* =========================================
          MODALS
      ========================================= */}

      {/* 1. Advanced Filters Modal */}
      {activeModal === "advancedFilters" && (
        <ModalWrapper title="Advanced Filters" onClose={closeModal}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#85899a]">Start Date</label>
                <input type="date" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] text-[#85899a]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#85899a]">End Date</label>
                <input type="date" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] text-[#85899a]" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Search Keywords</label>
              <input type="text" placeholder="Search in action, target, or details..." className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] bg-[#f8f9fa]" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">IP Address Filter</label>
              <input type="text" placeholder="e.g., 192.168.1.1" className="w-full rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] bg-[#f8f9fa]" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#85899a]">Action Categories</label>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                {["User Management", "Content Moderation", "Financial Operations", "Configuration", "Security", "PAL Management", "Support", "API Actions"].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-[#24283b]">
                    <input type="checkbox" className="rounded border-[#e7e7ef] text-[#7555ff] focus:ring-[#7555ff]" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Results per Page</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] bg-[#f8f9fa]">
                  <option>50</option>
                  <option>100</option>
                  <option>200</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#85899a] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center pt-4">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Reset Filters</button>
            <button className="rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>Apply Filters</button>
          </div>
        </ModalWrapper>
      )}

      {/* 2. Export Audit Logs Modal */}
      {activeModal === "export" && (
        <ModalWrapper title="Export Audit Logs" onClose={closeModal}>
          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Export Format</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] bg-[#f8f9fa]">
                  <option>CSV (Comma-separated)</option>
                  <option>Excel (.xlsx)</option>
                  <option>PDF</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#85899a] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#85899a]">Date Range</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-[#e7e7ef] p-2.5 text-sm outline-none focus:border-[#7555ff] bg-[#f8f9fa]">
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>Last 7 Days</option>
                  <option>All Time</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#85899a] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#85899a]">Include Fields</label>
              <div className="space-y-2">
                {["Timestamp", "Administrator", "Action & Target", "IP Address", "Detailed Description"].map((field) => (
                  <label key={field} className="flex items-center gap-2 text-sm text-[#24283b]">
                    <input type="checkbox" className="rounded border-[#e7e7ef] text-[#7555ff] focus:ring-[#7555ff]" defaultChecked />
                    {field}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-[#f0f9ff] p-4 border border-[#bae6fd]">
              <p className="text-xs text-[#0284c7]">Estimated records: 247 logs • File size: ~125 KB</p>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center pt-4">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]" onClick={closeModal}>Cancel</button>
            <button className="flex items-center gap-2 rounded-lg bg-[#7555ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6344e6]" onClick={closeModal}>
              <Download size={16} /> Export Logs
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* 3. Audit Log Details Modal */}
      {activeModal === "details" && selectedLog && (
        <ModalWrapper title="Audit Log Details" onClose={closeModal}>
          <div className="space-y-4">
            
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 bg-[#f8f9fa] p-4 rounded-lg border border-[#e7e7ef]">
              <div>
                <p className="text-[10px] text-[#85899a] uppercase tracking-wider mb-1">Timestamp</p>
                <p className="text-sm font-medium text-[#24283b]">{selectedLog.timestamp}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#85899a] uppercase tracking-wider mb-1">Severity</p>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getSeverityBadge(selectedLog.severity)}`}>
                  {selectedLog.severity}
                </span>
              </div>
            </div>

            {/* Action Details */}
            <div>
              <h4 className="text-xs font-medium text-[#85899a] mb-2 uppercase tracking-wider">Action Details</h4>
              <div className="bg-white border border-[#e7e7ef] rounded-lg p-4 space-y-2 text-sm">
                <div className="grid grid-cols-[120px_1fr]">
                  <span className="text-[#85899a]">Administrator:</span>
                  <span className="font-medium text-[#24283b]">{selectedLog.admin}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr]">
                  <span className="text-[#85899a]">Action:</span>
                  <span className="font-medium text-[#24283b]">{selectedLog.action}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr]">
                  <span className="text-[#85899a]">Target:</span>
                  <span className="font-medium text-[#24283b]">{selectedLog.target}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr]">
                  <span className="text-[#85899a]">IP Address:</span>
                  <span className="font-medium text-[#24283b]">{selectedLog.ip}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg bg-[#f0f9ff] p-4 border border-[#bae6fd]">
              <p className="text-[10px] text-[#0284c7] uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-[#0284c7]">User banned for violating community guidelines</p>
            </div>

            {/* Additional Info */}
            <div className="text-xs text-[#85899a] space-y-1 pt-2">
              <p>User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)</p>
              <p>Session ID: sess_abc123xyz789</p>
              <p>Request ID: req_def456uvw012</p>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center pt-4">
            <button className="rounded-lg border border-[#e7e7ef] px-6 py-2 text-sm font-medium text-[#24283b] hover:bg-[#f8f9fa]">Export Details</button>
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

// Reusable Modal Wrapper
function ModalWrapper({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between border-b border-[#eeeeF4] p-5">
          <div>
            <h2 className="text-lg font-semibold text-[#24283b]">{title}</h2>
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