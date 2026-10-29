"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import { 
  Megaphone, Eye, MousePointerClick, TrendingUp, 
  X, Play, Pause, AlertTriangle, CheckCircle, Plus, Calendar
} from "lucide-react";

// --- MOCK DATA ---
const activeCampaignsData = [
  { id: 1, name: "Summer Sale Promo", type: "Banner", impressions: "145,230", clicks: "4,567", ctr: "3.14%", budget: "N32,400", totalBudget: "N50,000", status: "Active" },
  { id: 2, name: "PAL Boost Campaign", type: "Sponsored", impressions: "89,234", clicks: "2,891", ctr: "3.24%", budget: "N18,900", totalBudget: "N30,000", status: "Active" },
  { id: 3, name: "Brand Partnership", type: "Video", impressions: "234,567", clicks: "8,921", ctr: "3.8%", budget: "N67,800", totalBudget: "N100,000", status: "Active" },
];

const pendingCampaignsData = [
  { id: 1, advertiser: "TechBrand Ltd", name: "Product Launch", type: "Banner", budget: "N75,000", duration: "7 days", submitted: "2025-10-17", audience: "All Users" },
  { id: 2, advertiser: "Fashion Store", name: "Holiday Collection", type: "Sponsored", budget: "N45,000", duration: "14 days", submitted: "2025-10-16", audience: "18-35, Urban" },
];

const internalPromotionsData = [
  { id: 1, title: "PAL Spotlight", desc: "Promoting top PAL creators this week", status: "Active" },
  { id: 2, title: "Feature Announcement", desc: "New content features launch", status: "Scheduled" },
];

const TABS = ["Active Campaigns", "Pending Approval", "Internal Promotions", "Create Campaign"];

export default function AdManagement() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
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
          <h1 className="text-2xl font-bold text-gray-900">Ad Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage advertising campaigns, track performance, and approve new ads.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Megaphone size={16} className="text-purple-500"/> Active Campaigns</div>
            <div className="text-2xl font-bold text-gray-900">30</div>
            <div className="text-xs text-green-500 font-medium mt-1">Running now</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Eye size={16} className="text-blue-500"/> Total Impressions</div>
            <div className="text-2xl font-bold text-gray-900">469K</div>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><MousePointerClick size={16} className="text-green-500"/> Total Clicks</div>
            <div className="text-2xl font-bold text-gray-900">16.4K</div>
            <div className="text-xs text-green-600 font-medium mt-1">3.49% CTR</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><TrendingUp size={16} className="text-orange-500"/> Revenue</div>
            <div className="text-2xl font-bold text-gray-900">$30K</div>
            <div className="text-xs text-gray-500 mt-1">This month</div>
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
              {tab} {tab === "Pending Approval" && "(2)"}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT --- */}

        {/* 1. ACTIVE CAMPAIGNS */}
        {activeTab === "Active Campaigns" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Active Advertising Campaigns</h3>
              <p className="text-xs text-gray-500 mt-1">Currently running ad campaigns and their performance</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 font-medium">Campaign Name</th>
                    <th className="py-4 px-6 font-medium">Type</th>
                    <th className="py-4 px-6 font-medium">Impressions</th>
                    <th className="py-4 px-6 font-medium">Clicks</th>
                    <th className="py-4 px-6 font-medium">CTR</th>
                    <th className="py-4 px-6 font-medium">Budget / Spent</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeCampaignsData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6 font-medium text-gray-900">{item.name}</td>
                      <td className="py-4 px-6">
                        <span className="border border-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full bg-white">{item.type}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">{item.impressions}</td>
                      <td className="py-4 px-6 text-gray-500">{item.clicks}</td>
                      <td className="py-4 px-6 text-green-600 font-medium">{item.ctr}</td>
                      <td className="py-4 px-6">
                        <div className="text-gray-900 font-medium text-xs">{item.budget}</div>
                        <div className="text-gray-400 text-[10px]">of {item.totalBudget}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">Active</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-3 items-center">
                          <button onClick={() => openModal('campaignAnalytics', item)} className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 cursor-pointer">Analytics</button>
                          <button onClick={() => openModal('pauseCampaign', item)} className="text-xs font-medium text-orange-500 bg-white border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-50 cursor-pointer">Pause</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. PENDING APPROVAL */}
        {activeTab === "Pending Approval" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Campaigns awaiting Approval</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 font-medium">Advertiser</th>
                    <th className="py-4 px-6 font-medium">Campaign</th>
                    <th className="py-4 px-6 font-medium">Type</th>
                    <th className="py-4 px-6 font-medium">Budget</th>
                    <th className="py-4 px-6 font-medium">Duration</th>
                    <th className="py-4 px-6 font-medium">Submitted</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingCampaignsData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6 font-medium text-gray-900">{item.advertiser}</td>
                      <td className="py-4 px-6 text-gray-900">{item.name}</td>
                      <td className="py-4 px-6">
                        <span className="border border-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full bg-white">{item.type}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">{item.budget}</td>
                      <td className="py-4 px-6 text-gray-500">{item.duration}</td>
                      <td className="py-4 px-6 text-gray-500">{item.submitted}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <button onClick={() => openModal('reviewCampaign', item)} className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 cursor-pointer">Review</button>
                          <button onClick={() => openModal('approveCampaign', item)} className="text-xs font-medium text-green-600 bg-white border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-50 cursor-pointer">Approve</button>
                          <button onClick={() => openModal('rejectCampaign', item)} className="text-xs font-medium text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 cursor-pointer">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. INTERNAL PROMOTIONS */}
        {activeTab === "Internal Promotions" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Internal Promotions</h3>
              
              <div className="space-y-4">
                {internalPromotionsData.map((promo) => (
                  <div key={promo.id} className="border border-gray-100 rounded-lg p-5 bg-gray-50/30 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium text-gray-900">{promo.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          promo.status === 'Active' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'
                        }`}>{promo.status}</span>
                      </div>
                      <p className="text-xs text-gray-500">{promo.desc}</p>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => openModal('editPromotion', promo)} className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer">Edit</button>
                        {promo.status === 'Active' ? (
                          <button onClick={() => openModal('deactivatePromotion', promo)} className="text-xs font-medium text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 cursor-pointer">Deactivate</button>
                        ) : (
                          <button onClick={() => openModal('deactivatePromotion', promo)} className="text-xs font-medium text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 cursor-pointer">Cancel</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => openModal('createPromotion')} className="w-full mt-6 bg-[#6366f1] text-white text-sm font-medium py-3 rounded-lg hover:bg-[#4f46e5] transition-colors cursor-pointer">
                Create New Internal Promotion
              </button>
            </div>

            {/* Manually Boost Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Manually Boost Content</h3>
              <div className="space-y-4">
                <div>
                  <input type="text" placeholder="Enter Post ID to boost" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Boost Duration (hours)</label>
                    <input type="number" defaultValue={24} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Target Impressions</label>
                    <input type="number" defaultValue={10000} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <button onClick={() => openModal('boostContent')} className="w-full bg-[#4f46e5] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#4338ca] transition-colors cursor-pointer">
                  Boost Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. CREATE CAMPAIGN */}
        {activeTab === "Create Campaign" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl">
            <h3 className="font-semibold text-gray-900 mb-6">Create New Ad Campaign</h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Campaign Name</label>
                <input type="text" placeholder="Enter campaign name" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Campaign Type</label>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                  <option>Select type</option>
                  <option>Banner</option>
                  <option>Sponsored</option>
                  <option>Video</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Budget (₦)</label>
                  <input type="text" placeholder="Enter budget" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Duration (days)</label>
                  <input type="text" placeholder="Enter duration" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Target Audience</label>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                  <option>Select audience</option>
                  <option>All Users</option>
                  <option>18-35, Urban</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Ad Creative URL</label>
                <input type="text" placeholder="Enter image/video URL" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Destination URL</label>
                <input type="text" placeholder="Where should users go when they click?" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => openModal('saveDraft')} className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  Save as Draft
                </button>
                <button onClick={() => openModal('createCampaign')} className="flex-1 bg-[#4f46e5] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#4338ca] transition-colors cursor-pointer">
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- MODALS (Heavily Compacted) --- */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* 1. Campaign Analytics Modal */}
            {modalType === 'campaignAnalytics' && selectedItem && (
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-base font-bold text-gray-900">Campaign Analytics</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18}/></button>
                </div>

                {/* 4 Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white border border-gray-100 p-2.5 rounded-lg flex flex-col items-center justify-center shadow-sm">
                    <Eye size={16} className="text-blue-500 mb-1"/>
                    <span className="text-sm font-bold">{selectedItem.impressions}</span>
                    <span className="text-[10px] text-gray-500">Impressions</span>
                  </div>
                  <div className="bg-white border border-gray-100 p-2.5 rounded-lg flex flex-col items-center justify-center shadow-sm">
                    <MousePointerClick size={16} className="text-green-500 mb-1"/>
                    <span className="text-sm font-bold">{selectedItem.clicks}</span>
                    <span className="text-[10px] text-gray-500">Clicks</span>
                  </div>
                  <div className="bg-white border border-gray-100 p-2.5 rounded-lg flex flex-col items-center justify-center shadow-sm">
                    <TrendingUp size={16} className="text-purple-500 mb-1"/>
                    <span className="text-sm font-bold">{selectedItem.ctr}</span>
                    <span className="text-[10px] text-gray-500">CTR</span>
                  </div>
                  <div className="bg-white border border-gray-100 p-2.5 rounded-lg flex flex-col items-center justify-center shadow-sm">
                    <Megaphone size={16} className="text-orange-500 mb-1"/>
                    <span className="text-sm font-bold">{selectedItem.budget}</span>
                    <span className="text-[10px] text-gray-500">Spent</span>
                  </div>
                </div>

                {/* Budget Performance */}
                <div className="mb-4">
                  <h4 className="text-[11px] font-bold text-gray-900 mb-1.5">Budget Performance</h4>
                  <div className="flex justify-between text-[11px] mb-1 text-gray-600">
                    <span>Total Budget:</span>
                    <span className="font-medium text-gray-900">{selectedItem.totalBudget}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-1">
                    <div className="bg-[#8b5cf6] h-full rounded-full" style={{ width: '64.8%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-600">
                    <span>Spent:</span>
                    <span className="font-medium text-gray-900">{selectedItem.budget} (64.8%)</span>
                  </div>
                </div>

                {/* CPC / CPM Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white border border-gray-100 p-2.5 rounded-lg shadow-sm">
                    <p className="text-xs font-bold text-gray-900">$2.03</p>
                    <p className="text-[10px] text-gray-500">Cost per Click (CPC)</p>
                  </div>
                  <div className="bg-white border border-gray-100 p-2.5 rounded-lg shadow-sm">
                    <p className="text-xs font-bold text-gray-900">$200.00</p>
                    <p className="text-[10px] text-gray-500">Cost per 1000 Impressions (CPM)</p>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-[#eff6ff] border border-blue-100 p-3 rounded-lg mb-4">
                  <h4 className="text-[11px] font-bold text-gray-900 mb-0.5">Performance Summary</h4>
                  <p className="text-[10px] text-gray-600 leading-relaxed">This campaign has reached {selectedItem.impressions} users with a click-through rate of {selectedItem.ctr}, which is above the platform average of 2.8%.</p>
                </div>

                <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">Export Report</button>
                  <button onClick={closeModal} className="px-5 py-1.5 text-xs font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-md cursor-pointer">Close</button>
                </div>
              </div>
            )}

            {/* 2. Pause Campaign Modal */}
            {modalType === 'pauseCampaign' && (
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-gray-900">Pause Campaign</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18}/></button>
                </div>
                <p className="text-xs text-gray-600 mb-4">Pausing this campaign will stop it from being displayed to users. You can resume it at any time.</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Reason for Pausing</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                      <option>Select reason</option>
                      <option>Budget exhausted</option>
                      <option>Campaign finished</option>
                      <option>Performance issues</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Notes</label>
                    <textarea placeholder="Add any additional notes..." className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 h-12 resize-none"></textarea>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 mt-2">
                    <input type="checkbox" defaultChecked className="rounded text-orange-500" /> Notify advertiser
                  </label>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-white bg-[#f97316] hover:bg-[#ea580c] rounded-md flex items-center gap-1.5 cursor-pointer"><Pause size={12}/> Pause Campaign</button>
                </div>
              </div>
            )}

            {/* 3. Review Campaign Modal */}
            {modalType === 'reviewCampaign' && selectedItem && (
              <div className="p-0">
                <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                  <h3 className="text-base font-bold text-gray-900">Review Campaign</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18}/></button>
                </div>
                
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gray-100 p-2 rounded-lg">
                      <p className="text-[10px] text-gray-500 mb-0.5">Advertiser</p>
                      <p className="text-xs font-medium text-gray-900">{selectedItem.advertiser}</p>
                    </div>
                    <div className="border border-gray-100 p-2 rounded-lg">
                      <p className="text-[10px] text-gray-500 mb-0.5">Campaign Name</p>
                      <p className="text-xs font-medium text-gray-900">{selectedItem.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gray-100 p-2 rounded-lg">
                      <p className="text-[10px] text-gray-500 mb-0.5">Type</p>
                      <p className="text-xs font-medium text-gray-900">{selectedItem.type}</p>
                    </div>
                    <div className="border border-gray-100 p-2 rounded-lg">
                      <p className="text-[10px] text-gray-500 mb-0.5">Budget</p>
                      <p className="text-xs font-medium text-gray-900">{selectedItem.budget}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gray-100 p-2 rounded-lg">
                      <p className="text-[10px] text-gray-500 mb-0.5">Duration</p>
                      <p className="text-xs font-medium text-gray-900">{selectedItem.duration}</p>
                    </div>
                    <div className="border border-gray-100 p-2 rounded-lg">
                      <p className="text-[10px] text-gray-500 mb-0.5">Target Audience</p>
                      <p className="text-xs font-medium text-gray-900">{selectedItem.audience}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Ad Creative</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg h-20 flex items-center justify-center">
                       <span className="text-[10px] text-gray-400">Ad Preview: https://example.com/ad1.jpg</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">Close</button>
                  <button onClick={() => { closeModal(); setTimeout(() => openModal('rejectCampaign', selectedItem), 100); }} className="px-4 py-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-md cursor-pointer">Reject</button>
                  <button onClick={() => { closeModal(); setTimeout(() => openModal('approveCampaign', selectedItem), 100); }} className="px-4 py-1.5 text-xs font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-md cursor-pointer">Approve</button>
                </div>
              </div>
            )}

            {/* 4. Approve Campaign Modal */}
            {modalType === 'approveCampaign' && (
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-gray-900">Approve Campaign</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18}/></button>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-900 font-medium mb-0.5">This campaign will be activated immediately upon approval.</p>
                  <p className="text-[10px] text-gray-500">The advertiser will be notified and billing will begin.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Start Date</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option>Start immediately</option>
                      <option>Schedule for later</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Approval Notes</label>
                    <textarea placeholder="Optional notes for the advertiser..." className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-12 resize-none"></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-5 py-1.5 text-xs font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-md cursor-pointer">Approve Campaign</button>
                </div>
              </div>
            )}

            {/* 5. Reject Campaign Modal */}
            {modalType === 'rejectCampaign' && (
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-gray-900">Reject Campaign</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18}/></button>
                </div>
                <p className="text-xs text-gray-600 mb-3">Please provide a clear reason for rejecting this campaign. The advertiser will be notified.</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Rejection Reason</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                      <option>Select reason</option>
                      <option>Inappropriate content</option>
                      <option>Poor image quality</option>
                      <option>Violates guidelines</option>
                      <option>Destination URL broken</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Detailed Feedback</label>
                    <textarea placeholder="Explain why the campaign was rejected and what needs to be changed..." className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 h-12 resize-none"></textarea>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                      <input type="checkbox" defaultChecked className="rounded text-red-600 w-3 h-3" /> Allow resubmission
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                      <input type="checkbox" defaultChecked className="rounded text-red-600 w-3 h-3" /> Send feedback email
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-5 py-1.5 text-xs font-medium text-white bg-[#ef4444] hover:bg-[#dc2626] rounded-md cursor-pointer">Reject Campaign</button>
                </div>
              </div>
            )}

            {/* 6. Deactivate Promotion Modal */}
            {modalType === 'deactivatePromotion' && selectedItem && (
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-gray-900">Deactivate Promotion</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18}/></button>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Are you sure you want to deactivate "{selectedItem.title}"? This promotion will no longer be visible to users.
                </p>
                <div className="flex justify-end gap-2">
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-white bg-[#ef4444] hover:bg-[#dc2626] rounded-md flex items-center gap-1 cursor-pointer"><X size={14} /> Deactivate</button>
                </div>
              </div>
            )}

            {/* 7. Create/Edit Internal Promotion Modal */}
            {(modalType === 'createPromotion' || modalType === 'editPromotion') && (
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-gray-900">{modalType === 'createPromotion' ? 'Create Internal Promotion' : 'Edit Internal Promotion'}</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18}/></button>
                </div>
                
                <div className="space-y-2.5">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-0.5">Promotion Name</label>
                    <input type="text" defaultValue={selectedItem?.title || ''} placeholder="Feature Announcement" className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-0.5">Description</label>
                    <textarea defaultValue={selectedItem?.desc || ''} placeholder="Livestreaming is live..." className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-12 resize-none"></textarea>
                  </div>
                  
                  {/* Only show Type/Duration on Create */}
                  {modalType === 'createPromotion' && (
                    <>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-0.5">Promotion Type</label>
                        <select className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                          <option>Select type</option>
                          <option>Banner</option>
                          <option>Popup</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-0.5">Duration</label>
                        <select className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                          <option>Select duration</option>
                          <option>24 hours</option>
                          <option>7 days</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Only show Status on Edit */}
                  {modalType === 'editPromotion' && (
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-0.5">Status</label>
                      <select defaultValue={selectedItem?.status} className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                        <option>Active</option>
                        <option>Scheduled</option>
                        <option>Draft</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-5 py-1.5 text-xs font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-md cursor-pointer">Save Changes</button>
                </div>
              </div>
            )}

            {/* 8. Boost Content Modal */}
            {modalType === 'boostContent' && (
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-gray-900">Boost Content</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18}/></button>
                </div>
                
                <div className="bg-[#eff6ff] border border-blue-100 p-3 rounded-lg mb-3">
                  <p className="text-xs text-blue-800 mb-0.5">Duration: 24 hours</p>
                  <p className="text-xs text-blue-800 mb-0.5">Target Impressions: 10,000</p>
                  <p className="text-xs text-blue-800">Estimated Reach: ~8,500 unique users</p>
                </div>
                <p className="text-[10px] text-gray-500 mb-3">This content will be promoted in user feeds and given priority placement.</p>
                
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-5 py-1.5 text-xs font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-md flex items-center gap-1.5 cursor-pointer"><TrendingUp size={14}/> Boost Content</button>
                </div>
              </div>
            )}

            {/* 9. Save as Draft Modal */}
            {modalType === 'saveDraft' && (
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-gray-900">Save as Draft</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18}/></button>
                </div>
                <p className="text-xs text-gray-600 mb-4">The campaign will be saved as a draft and can be completed and published later.</p>
                <div className="flex justify-end gap-2">
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-5 py-1.5 text-xs font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-md cursor-pointer">Save Draft</button>
                </div>
              </div>
            )}

            {/* 10. Create Campaign Modal */}
            {modalType === 'createCampaign' && (
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-gray-900">Create Ad Campaign</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18}/></button>
                </div>
                <p className="text-xs text-gray-600 mb-3">The campaign will be created and set to active status immediately.</p>
                
                <div className="space-y-2 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                    <input type="checkbox" defaultChecked className="rounded text-[#6366f1] w-3 h-3" /> Start campaign immediately
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                    <input type="checkbox" defaultChecked className="rounded text-[#6366f1] w-3 h-3" /> Send confirmation email
                  </label>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={closeModal} className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-5 py-1.5 text-xs font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-md cursor-pointer">Create Campaign</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}