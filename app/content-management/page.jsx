"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import { 
  FileText, Image as ImageIcon, Video, Flag, 
  Search, SlidersHorizontal, Download, EyeOff, 
  MessageSquareOff, Trash2, X, AlertTriangle, 
  CheckCircle, Ban, FileQuestion, Check
} from "lucide-react";

// --- MOCK DATA ---
const initialContent = [
  { id: 1, type: "text", author: "John Adebayo", initial: "J", content: "Check out my new content...", likes: 234, shares: 45, flags: 0, status: "Published", date: "2025-10-17 09:30", reason: "-" },
  { id: 2, type: "image", author: "Sarah Okonkwo", initial: "S", content: "Beautiful sunset photo", likes: 892, shares: 156, flags: 2, status: "Flagged", date: "2025-10-17 08:15", reason: "Spam (8 reports)" },
  { id: 3, type: "video", author: "Michael Chen", initial: "M", content: "Tutorial: How to earn...", likes: 1245, shares: 234, flags: 0, status: "Published", date: "2025-10-16 22:45", reason: "-" },
  { id: 4, type: "text", author: "Amina Ibrahim", initial: "A", content: "Spam content here...", likes: 12, shares: 2, flags: 15, status: "Flagged", date: "2025-10-16 20:30", reason: "Spam (8 reports), Inappropriate content (7 reports)" },
  { id: 5, type: "video", author: "David Okafor", initial: "D", content: "Gaming livestream recap", likes: 567, shares: 89, flags: 0, status: "Published", date: "2025-10-16 18:20", reason: "-" },
];

const TABS = ["All Content", "Flagged", "Trending", "Banned"];

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("All Content");
  const [contentData] = useState(initialContent);
  
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

  const getTypeIcon = (type) => {
    switch(type) {
      case 'text': return <FileText size={18} className="text-gray-500" />;
      case 'image': return <ImageIcon size={18} className="text-pink-500" />;
      case 'video': return <Video size={18} className="text-blue-500" />;
      default: return <FileText size={18} className="text-gray-500" />;
    }
  };

  // Define views
  const isReviewView = activeTab === "Flagged";
  const isTrendingView = activeTab === "Trending";

  return (
    <>
      <Sidebar />
      <main className="ml-[280px] min-h-screen bg-gray-50 p-8 font-sans">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor, moderate, and manage all platform content.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><FileText size={16} className="text-purple-500"/> Total Posts Today</div>
            <div className="text-2xl font-bold text-gray-900">4,832</div>
            <div className="text-xs text-green-500 font-medium mt-1">+8.4% from yesterday</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Flag size={16} className="text-red-500"/> Flagged Content</div>
            <div className="text-2xl font-bold text-gray-900">147</div>
            <div className="text-xs text-green-600 font-medium mt-1">Requires Review</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Video size={16} className="text-blue-500"/> Videos Uploaded</div>
            <div className="text-2xl font-bold text-gray-900">147</div>
            <div className="text-xs text-gray-500 mt-1">Last 24 hours</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><ImageIcon size={16} className="text-pink-500"/> Images Posted</div>
            <div className="text-2xl font-bold text-gray-900">2,341</div>
            <div className="text-xs text-gray-500 mt-1">Last 24 hours</div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 mb-6 flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or user ID..." 
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <button 
            onClick={() => openModal('filters')}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 cursor-pointer"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 border-l border-gray-100 cursor-pointer">
            Export
          </button>
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
              {tab}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT --- */}

        {/* BANNED TAB (Empty State) */}
        {activeTab === "Banned" ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center min-h-[400px]">
             <div className="relative text-gray-300 mb-4">
               <FileQuestion size={64} strokeWidth={1} />
             </div>
             <p className="text-gray-500 text-lg">No banned content at<br/>the moment</p>
          </div>
        ) : (
          /* MAIN TABLE */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 font-medium w-16">Type</th>
                    <th className="py-4 px-6 font-medium">Author</th>
                    <th className="py-4 px-6 font-medium">Content</th>
                    
                    {/* DYNAMIC COLUMNS BASED ON TAB */}
                    {isReviewView && (
                      <>
                        <th className="py-4 px-6 font-medium">Flags</th>
                        <th className="py-4 px-6 font-medium">Reason</th>
                      </>
                    )}

                    {!isReviewView && (
                      <th className="py-4 px-6 font-medium">Engagement</th>
                    )}

                    {!isReviewView && !isTrendingView && (
                      <>
                        <th className="py-4 px-6 font-medium">Flags</th>
                        <th className="py-4 px-6 font-medium">Status</th>
                      </>
                    )}

                    <th className="py-4 px-6 font-medium">Date</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {contentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6">{getTypeIcon(item.type)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-700 ${
                            item.initial === 'J' || item.initial === 'A' ? 'bg-purple-100' : 'bg-pink-100'
                          }`}>
                            {item.initial}
                          </div>
                          <span className="text-gray-900 font-medium">{item.author}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-500">{item.content}</td>
                      
                      {/* DYNAMIC CELLS BASED ON TAB */}
                      
                      {/* Flagged View Cells */}
                      {isReviewView && (
                        <>
                          <td className="py-4 px-6 text-xs">
                            {item.flags > 0 ? <span className="bg-red-100 text-red-600 px-2 py-1 rounded font-bold">{item.flags}</span> : "-"}
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Spam</span>
                          </td>
                        </>
                      )}

                      {/* Engagement Column (All & Trending) */}
                      {!isReviewView && (
                        <td className="py-4 px-6 text-xs text-gray-500">
                          {item.likes} likes <span className="mx-1">•</span> {item.shares} shares
                        </td>
                      )}

                      {/* Flags & Status Columns (All Content only) */}
                      {!isReviewView && !isTrendingView && (
                        <>
                          <td className="py-4 px-6 text-xs">
                            {item.flags > 0 ? <span className="bg-red-100 text-red-600 px-2 py-1 rounded font-bold">{item.flags}</span> : "-"}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                              item.status === "Published" ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-600"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}

                      <td className="py-4 px-6 text-gray-500 text-xs">{item.date}</td>
                      
                      {/* DYNAMIC ACTIONS BASED ON TAB */}
                      <td className="py-4 px-6 text-right">
                         
                         {/* Actions for Flagged Tab */}
                         {isReviewView && (
                           <div className="flex justify-end gap-2 items-center">
                              <button onClick={() => openModal('reviewFlagged', item)} className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer">Review</button>
                              <button onClick={() => openModal('removeContent', item)} className="text-xs font-medium text-white bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700 cursor-pointer">Remove</button>
                           </div>
                         )}

                         {/* Actions for Trending Tab */}
                         {isTrendingView && (
                            <button 
                              onClick={() => openModal('contentDetails', item)} 
                              className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-4 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer shadow-sm"
                            >
                              View Details
                            </button>
                         )}

                         {/* Actions for All Content Tab */}
                         {!isReviewView && !isTrendingView && (
                           <div className="flex justify-end gap-3 items-center">
                              <button onClick={() => openModal('hideContent', item)} className="text-gray-400 hover:text-gray-900 cursor-pointer" title="Hide Content"><EyeOff size={16} /></button>
                              <button onClick={() => openModal('restrictComments', item)} className="text-gray-400 hover:text-gray-900 cursor-pointer" title="Restrict Comments"><MessageSquareOff size={16} /></button>
                              <button onClick={() => openModal('removeContent', item)} className="text-red-400 hover:text-red-600 cursor-pointer" title="Remove Content"><Trash2 size={16} /></button>
                           </div>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* --- MODALS --- */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* 1. Advanced Filters Modal */}
            {modalType === 'filters' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
                    <p className="text-xs text-gray-500 mt-1">Filter content by multiple criteria.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Content Type</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option>All types</option>
                      <option>Text</option>
                      <option>Image</option>
                      <option>Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Status</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option>All statuses</option>
                      <option>Published</option>
                      <option>Flagged</option>
                      <option>Banned</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Date Range</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option>All time</option>
                      <option>Today</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Minimum Flags</label>
                    <input type="number" defaultValue={0} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Author Name/Email</label>
                    <input type="text" placeholder="Search by author..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>

                <div className="flex justify-between gap-3 mt-8">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Reset</button>
                  <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">Apply Filters</button>
                </div>
              </div>
            )}

            {/* 2. Hide Content Modal */}
            {modalType === 'hideContent' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Hide Content</h3>
                    <p className="text-xs text-gray-500 mt-1">Content will be hidden from public view</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                <p className="text-sm text-gray-600 mb-8">This content will be hidden from the platform but not permanently deleted. You can restore it later if needed.</p>
                <div className="flex justify-end gap-3">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">Hide Content</button>
                </div>
              </div>
            )}

            {/* 3. Restrict Comments Modal */}
            {modalType === 'restrictComments' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Restrict Comments</h3>
                    <p className="text-xs text-gray-500 mt-1">Disable commenting on this content.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                <p className="text-sm text-gray-600 mb-8">Comments will be disabled on this post. Existing comments will remain visible but users won't be able to add new ones.</p>
                <div className="flex justify-end gap-3">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">Restrict Comments</button>
                </div>
              </div>
            )}

            {/* 4. Remove Content Modal */}
            {modalType === 'removeContent' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Remove Content</h3>
                    <p className="text-xs text-gray-500 mt-1">This action cannot be undone.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                <p className="text-sm text-gray-600 mb-6">Are you sure you want to permanently remove this content? The user will be notified of this action.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Reason for removal</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                      <option>Select reason</option>
                      <option>Spam</option>
                      <option>Inappropriate Content</option>
                      <option>Harassment</option>
                      <option>Copyright Violation</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Additional notes</label>
                    <textarea placeholder="Explain why this content is being removed..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"></textarea>
                  </div>
                </div>
                <div className="flex justify-between gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Reset</button>
                  <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer">Apply Filters</button>
                </div>
              </div>
            )}

            {/* 5. Review Flagged Content Modal */}
            {modalType === 'reviewFlagged' && selectedItem && (
              <div className="p-0">
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Review Flagged Content</h3>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700">S</div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">{selectedItem.author}</p>
                           <p className="text-xs text-gray-500">@sarahok • 2025-10-17 08:15</p>
                        </div>
                     </div>
                     <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{selectedItem.flags} Flags</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                     <p className="text-sm text-gray-700 leading-relaxed">As the day draws to a close, the sky transforms into a breathtaking canvas of colors. A beautiful sunset is not just a sight; it's an experience that captivates the heart and soul. The vibrant hues of orange, pink,...</p>
                     <div className="flex gap-4 mt-3 text-xs text-gray-500">
                        <span>892 likes</span>
                        <span>156 shares</span>
                     </div>
                  </div>

                  <div>
                     <p className="text-xs font-medium text-gray-700 mb-2">Flag Reasons:</p>
                     <div className="flex gap-2">
                        <span className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-md border border-red-100">Spam (8 reports)</span>
                        <span className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-md border border-red-100">Inappropriate content (7 reports)</span>
                     </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Moderation Decision</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option>Select action</option>
                      <option>Approve Content</option>
                      <option>Hide Content</option>
                      <option>Remove Content</option>
                      <option>Ban User</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Notes (Optional)</label>
                    <textarea placeholder="Add internal notes about this decision..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"></textarea>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">Submit Decision</button>
                </div>
              </div>
            )}

            {/* 6. Content Details Modal (Triggered from Trending Tab) */}
            {modalType === 'contentDetails' && selectedItem && (
               <div className="p-6">
                 <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Content Details</h3>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20}/></button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-sm font-bold text-pink-700">
                     {selectedItem.initial}
                   </div>
                   <div>
                      <p className="text-sm font-bold text-gray-900">{selectedItem.author}</p>
                      <p className="text-xs text-gray-500">@sarahok • {selectedItem.date}</p>
                   </div>
                   {selectedItem.status === "Flagged" ? (
                     <span className="ml-auto bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full border border-red-100">Flagged</span>
                   ) : (
                     <span className="ml-auto bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1 rounded-full border border-gray-100">Published</span>
                   )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                   <p className="text-sm text-gray-700 leading-relaxed mb-3">
                     {selectedItem.content === "Beautiful sunset photo" 
                       ? "As the day draws to a close, the sky transforms into a breathtaking canvas of colors. A beautiful sunset is not just a sight; it's an experience that captivates the heart and soul. The vibrant hues of orange, pink,..." 
                       : selectedItem.content}
                   </p>
                   <div className="flex gap-4 text-xs text-gray-500">
                      <span>{selectedItem.likes} likes</span>
                      <span>{selectedItem.shares} shares</span>
                      <span>42 Comments</span>
                   </div>
                </div>

                <div>
                   <p className="text-xs font-medium text-gray-700 mb-2">Engagement Rate</p>
                   <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                     <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '66%' }}></div>
                   </div>
                   <p className="text-[10px] text-gray-500">66% engagement rate</p>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">Close</button>
                </div>
               </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}