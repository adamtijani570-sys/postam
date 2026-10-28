"use client";

import { useState } from "react";
import { 
  Users, Clock, TrendingUp, Globe, 
  MessageSquare, Heart, PlaySquare, Image as ImageIcon, FileText 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";

// --- IMPORT SIDEBAR (lowercase "s") ---
// Adjust the path if your sidebar.jsx is in a different folder.
import Sidebar from "../components/sidebar";

// --- MOCK DATA ---
const mockUserGrowth = [
  { name: "Apr", users: 12000 }, { name: "May", users: 15000 },
  { name: "Jun", users: 18000 }, { name: "Jul", users: 24000 },
  { name: "Aug", users: 29000 }, { name: "Sep", users: 34000 },
  { name: "Oct", users: 42000 },
];

const mockActivityHeatmap = [
  { time: "00:00", active: 4000 }, { time: "03:00", active: 2000 },
  { time: "06:00", active: 3500 }, { time: "09:00", active: 12000 },
  { time: "12:00", active: 19000 }, { time: "15:00", active: 16000 },
  { time: "18:00", active: 23000 }, { time: "21:00", active: 20000 },
];

const mockCountries = [
  { name: "Nigeria", value: 89234, color: "#8b5cf6" },
  { name: "Ghana", value: 34521, color: "#ec4899" },
  { name: "Kenya", value: 28934, color: "#3b82f6" },
  { name: "South Africa", value: 19823, color: "#10b981" },
  { name: "Others", value: 14722, color: "#f59e0b" },
];

const mockContentPerformance = [
  { name: "Videos", value: 12000, color: "#3b82f6" },
  { name: "Images", value: 8500, color: "#ec4899" },
  { name: "Text Posts", value: 6000, color: "#8b5cf6" },
];

const mockRetentionCurve = [
  { day: "Day 1", retention: 100 }, { day: "Day 3", retention: 65 },
  { day: "Day 7", retention: 45 }, { day: "Day 14", retention: 30 },
  { day: "Day 30", retention: 22 }, { day: "Day 60", retention: 18 },
  { day: "Day 90", retention: 15 },
];

const TABS = ["User Acquisition", "Engagement", "Geographic", "Content Performance", "Retention"];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content — offset by 280px because sidebar is fixed */}
      <main className="ml-[280px] min-h-screen bg-gray-50 p-8 font-sans">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-500 text-sm mt-1">Comprehensive platform metrics and user behavior analysis.</p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Users size={16} /> <span>Total Users</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">187,234</div>
            <div className="text-xs font-medium text-green-500">+8.2% this month</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock size={16} /> <span>Avg Session Time</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">18m 42s</div>
            <div className="text-xs font-medium text-green-500">+2.3% from last week</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <TrendingUp size={16} /> <span>Retention Rate (D7)</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">45%</div>
            <div className="text-xs font-medium text-gray-500">Above industry avg</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Globe size={16} /> <span>Active Countries</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <div className="text-xs font-medium text-gray-500">Across 5 continents</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg w-fit mb-6 border border-gray-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="space-y-6">
          
          {/* 1. USER ACQUISITION TAB */}
          {activeTab === "User Acquisition" && (
            <>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-6">User Growth (Last 7 Months)</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockUserGrowth}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={{r: 4, fill: '#6366f1'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Acquisition Channels</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Organic", val: 45, color: "bg-purple-500" },
                      { label: "Referrals", val: 32, color: "bg-pink-500" },
                      { label: "Social Media", val: 18, color: "bg-blue-500" },
                      { label: "Paid Ads", val: 5, color: "bg-green-500" }
                    ].map(item => (
                      <div key={item.label} className="flex items-center text-xs">
                        <span className="w-24 text-gray-600">{item.label}</span>
                        <div className="flex-1 bg-gray-100 h-2 rounded-full mx-2 overflow-hidden">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }} />
                        </div>
                        <span className="w-8 text-right font-medium text-gray-700">{item.val}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">New Users Today</h4>
                  <div className="text-3xl font-bold text-gray-900">1,247</div>
                  <div className="text-xs text-green-500 mb-6">+18.4% vs yesterday</div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Verification Rate</h4>
                  <div className="text-xl font-bold text-gray-900">87%</div>
                  <div className="text-xs text-gray-500">Of new users</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Churn Rate</h4>
                  <div className="text-3xl font-bold text-gray-900">4.2%</div>
                  <div className="text-xs text-red-500 mb-6">Monthly churn</div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">PAL Conversion</h4>
                  <div className="text-xl font-bold text-gray-900">0.67%</div>
                  <div className="text-xs text-gray-500">Users becoming PALs</div>
                </div>
              </div>
            </>
          )}

          {/* 2. ENGAGEMENT TAB */}
          {activeTab === "Engagement" && (
            <div className="space-y-4">
              
              {/* Top Bar Chart */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-8">User Activity Heatmap (24 Hours)</h3>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockActivityHeatmap}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9ca3af', fontSize: 11}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9ca3af', fontSize: 11}} 
                        tickFormatter={(value) => value.toLocaleString()}
                      />
                      <Tooltip cursor={{fill: '#f3f4f6'}} />
                      <Bar dataKey="active" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Engagement Metrics Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Engagement Metrics</h4>
                  
                  <div className="space-y-3">
                    {/* Posts per User */}
                    <div className="flex items-center gap-4 bg-[#f8f6fc] p-4 rounded-xl">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm text-purple-600">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Posts per User</p>
                        <p className="font-bold text-gray-900 text-sm">4.2</p>
                      </div>
                    </div>

                    {/* Avg Likes per Post */}
                    <div className="flex items-center gap-4 bg-[#f0f7ff] p-4 rounded-xl">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm text-blue-500">
                        <Heart size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Avg. Likes per Post</p>
                        <p className="font-bold text-gray-900 text-sm">32.5</p>
                      </div>
                    </div>

                    {/* Avg Comments */}
                    <div className="flex items-center gap-4 bg-[#fff0f5] p-4 rounded-xl">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm text-pink-500">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Avg. Comments</p>
                        <p className="font-bold text-gray-900 text-sm">8.7</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Peak Activity Times Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Peak Activity Times</h4>
                  
                  <div className="space-y-3 text-xs">
                    {/* Peak */}
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div>
                        <span className="font-semibold block text-sm text-gray-900 mb-0.5">6:00 PM - 8:00 PM</span>
                        <span className="text-gray-500">22,300 active users</span>
                      </div>
                      <span className="text-purple-600 font-semibold bg-transparent px-2 py-1">Peak</span>
                    </div>
                    
                    {/* High */}
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div>
                        <span className="font-semibold block text-sm text-gray-900 mb-0.5">12:00 PM - 2:00 PM</span>
                        <span className="text-gray-500">18,900 active users</span>
                      </div>
                      <span className="text-blue-600 font-semibold bg-transparent px-2 py-1">High</span>
                    </div>
                    
                    {/* Low */}
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div>
                        <span className="font-semibold block text-sm text-gray-900 mb-0.5">2:00 AM - 4:00 AM</span>
                        <span className="text-gray-500">2,100 active users</span>
                      </div>
                      <span className="text-gray-500 font-semibold bg-transparent px-2 py-1">Low</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 3. GEOGRAPHIC TAB */}
          {activeTab === "Geographic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-6">User Distribution by Country</h3>
                <div className="h-[300px] w-full flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={mockCountries} cx="50%" cy="50%" innerRadius={0} outerRadius={100} paddingAngle={2} dataKey="value">
                        {mockCountries.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Top Countries</h3>
                <div className="space-y-4">
                  {mockCountries.map((country) => (
                    <div key={country.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: country.color }} />
                        <span className="text-sm font-medium text-gray-700">{country.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{country.value.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">users</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. CONTENT PERFORMANCE TAB */}
          {activeTab === "Content Performance" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Content Type Performance</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockContentPerformance} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f3f4f6'}} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                        {mockContentPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Most Liked Content</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-blue-100 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-md text-blue-600"><PlaySquare size={20}/></div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Gaming Tutorial Video</h4>
                      <p className="text-xs text-gray-500 mt-1">12,456 likes • 2,340 shares</p>
                    </div>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-pink-100 transition-colors">
                    <div className="bg-pink-100 p-2 rounded-md text-pink-600"><ImageIcon size={20}/></div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Sunset Photography</h4>
                      <p className="text-xs text-gray-500 mt-1">9,823 likes • 1,567 shares</p>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-purple-100 transition-colors">
                    <div className="bg-purple-100 p-2 rounded-md text-purple-600"><FileText size={20}/></div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Motivational Quote</h4>
                      <p className="text-xs text-gray-500 mt-1">8,234 likes • 3,421 shares</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. RETENTION TAB */}
          {activeTab === "Retention" && (
            <>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-6">User Retention Curve</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockRetentionCurve}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip />
                      <Area type="monotone" dataKey="retention" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Day 1 Retention</h4>
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-xs text-gray-500">All new users</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Day 7 Retention</h4>
                    <div className="text-2xl font-bold text-gray-900">45%</div>
                    <div className="text-xs text-green-500">Above target (42%)</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Day 30 Retention</h4>
                    <div className="text-2xl font-bold text-gray-900">24%</div>
                    <div className="text-xs text-green-500">Healthy retention</div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </>
  );
}