
"use client";

import React, { useState } from "react";
import Sidebar from "../components/sidebar";

import {
  Users,
  FileText,
  DollarSign,
  Video,
  ThumbsUp,
  Share2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const stats = [
  {
    title: "Daily Active Users",
    value: "24,853",
    change: "12%",
    positive: false,
    icon: Users,
  },
  {
    title: "Monthly Active Users",
    value: "187,234",
    change: "8.3%",
    positive: true,
    icon: Users,
  },
  {
    title: "Total Posts",
    value: "425,873",
    change: "5.3%",
    positive: true,
    icon: FileText,
  },
  {
    title: "Payout Volume",
    value: "$2.4M",
    change: "8.8%",
    positive: true,
    icon: DollarSign,
  },
  {
    title: "Posts Today",
    value: "4,832",
    icon: FileText,
  },
  {
    title: "Video Views",
    value: "892.3K",
    icon: Video,
  },
  {
    title: "Total Likes",
    value: "156.2K",
    icon: ThumbsUp,
  },
  {
    title: "Shares",
    value: "28.4K",
    icon: Share2,
  },
];

const engagementData = [
  { date: "1 Oct", images: 1700, text: 200 },
  { date: "3 Oct", images: 2600, text: 1200 },
  { date: "7 Oct", images: 1900, text: 1500 },
  { date: "10 Oct", images: 2700, text: 700 },
  { date: "14 Oct", images: 3800, text: 2800 },
  { date: "20 Oct", images: 1500, text: 3700 },
  { date: "23 Oct", images: 600, text: 2800 },
  { date: "27 Oct", images: 1800, text: 3500 },
  { date: "30 Oct", images: 3700, text: 2000 },
];

const payoutData = [
  { day: "MON", amount: 35 },
  { day: "TUE", amount: 15 },
  { day: "WED", amount: 37 },
  { day: "THU", amount: 21 },
  { day: "FRI", amount: 68 },
  { day: "SAT", amount: 12 },
  { day: "SUN", amount: 32 },
];

const contentData = [
  { name: "Images", value: 24, color: "#9333ff" },
  { name: "Text Posts", value: 26, color: "#d6b9ff" },
  { name: "Videos", value: 39, color: "#c5d2ff" },
  { name: "Livestreams", value: 11, color: "#4c45ff" },
];

function Panel({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 ${className}`}
    >
      {children}
    </section>
  );
}

function PanelTitle({ children, right }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <h2 className="text-[12px] font-semibold text-gray-800 sm:text-sm">
        {children}
      </h2>

      {right}
    </div>
  );
}

export default function DashboardPage() {
  const [period, setPeriod] = useState("Month");
  const [payoutPeriod, setPayoutPeriod] = useState("Last Week");

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Sidebar */}
      <Sidebar />

      {/* Dashboard content */}
      <main className="min-h-screen bg-[#f7f8fa] px-3 py-5 text-gray-900 sm:px-5 sm:py-7 lg:ml-[280px] lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          {/* Dashboard heading */}
          <header className="mb-5">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Dashboard Overview
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Manage all users, view profiles, and take administrative actions.
            </p>
          </header>

          {/* Statistics cards */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 transition-shadow hover:shadow-sm sm:p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                        <Icon size={16} className="text-violet-500" />
                      </span>

                      <span className="truncate text-[10px] text-gray-500 sm:text-xs">
                        {stat.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <p className="text-base font-bold tracking-tight sm:text-xl">
                      {stat.value}
                    </p>

                    {stat.change && (
                      <span
                        className={`flex items-center gap-0.5 text-[10px] font-medium ${
                          stat.positive
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      >
                        {stat.positive ? (
                          <TrendingUp size={12} />
                        ) : (
                          <TrendingDown size={12} />
                        )}

                        {stat.positive ? "+" : "-"}
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Engagement chart */}
          <Panel className="mb-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <PanelTitle>Engagement Trends</PanelTitle>

              <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-violet-600" />
                  Images
                </span>

                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-purple-300" />
                  Text Posts
                </span>

                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Videos
                </span>

                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-pink-400" />
                  Livestreams
                </span>
              </div>

              <div className="flex w-fit rounded-md border border-gray-100 bg-gray-50 p-0.5">
                {["Day", "Week", "Month", "Year"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPeriod(item)}
                    className={`rounded px-2 py-1 text-[10px] transition ${
                      period === item
                        ? "bg-white font-semibold text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 h-[230px] w-full sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={engagementData}
                  margin={{ top: 15, right: 5, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#edf0f5"
                    strokeDasharray="3 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#8585a0" }}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                  />

                  <YAxis
                    domain={[0, 4000]}
                    ticks={[0, 1000, 2000, 3000, 4000]}
                    tickFormatter={(value) =>
                      value === 0 ? "0" : `${value / 1000}k`
                    }
                    tick={{ fontSize: 10, fill: "#8585a0" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #eee",
                      fontSize: 12,
                    }}
                  />

                  <Line
                    type="linear"
                    dataKey="images"
                    stroke="#5546ff"
                    strokeWidth={1.5}
                    dot={{
                      r: 3,
                      fill: "#fff",
                      stroke: "#5546ff",
                      strokeWidth: 1.5,
                    }}
                    activeDot={{ r: 5 }}
                    name="Images"
                  />

                  <Line
                    type="linear"
                    dataKey="text"
                    stroke="#d49aff"
                    strokeWidth={1.5}
                    dot={{
                      r: 3,
                      fill: "#fff",
                      stroke: "#d49aff",
                      strokeWidth: 1.5,
                    }}
                    activeDot={{ r: 5 }}
                    name="Text Posts"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* Bottom charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Payout chart */}
            <Panel>
              <PanelTitle
                right={
                  <select
                    value={payoutPeriod}
                    onChange={(event) =>
                      setPayoutPeriod(event.target.value)
                    }
                    className="max-w-[125px] rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[10px] text-gray-600 outline-none focus:border-violet-400"
                  >
                    <option>Last Week</option>
                    <option>This Week</option>
                    <option>Last Month</option>
                  </select>
                }
              >
                Payout Trends
              </PanelTitle>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={payoutData}
                    margin={{ top: 8, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="#edf0f5"
                      strokeDasharray="3 4"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10, fill: "#8585a0" }}
                      axisLine={false}
                      tickLine={false}
                      dy={8}
                    />

                    <YAxis
                      domain={[0, 80]}
                      ticks={[0, 20, 40, 60, 80]}
                      tickFormatter={(value) =>
                        value === 0 ? "0" : `${value}k`
                      }
                      tick={{ fontSize: 10, fill: "#8585a0" }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      formatter={(value) => [`$${value}k`, "Payout"]}
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #eee",
                        fontSize: 12,
                      }}
                    />

                    <Bar
                      dataKey="amount"
                      name="Payout"
                      radius={[4, 4, 0, 0]}
                      barSize={16}
                    >
                      {payoutData.map((item) => (
                        <Cell
                          key={item.day}
                          fill={
                            item.day === "FRI" ? "#922cff" : "#eee2ff"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            {/* Content distribution */}
            <Panel>
              <PanelTitle>Content Distribution</PanelTitle>

              <div className="relative h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="54%"
                      outerRadius="79%"
                      paddingAngle={3}
                      stroke="none"
                      cornerRadius={7}
                      label={({ value }) => `${value}%`}
                      labelLine={false}
                    >
                      {contentData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value, name) => [`${value}%`, name]}
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #eee",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-[10px] text-gray-500">
                {contentData.map((item) => (
                  <span
                    key={item.name}
                    className="flex items-center gap-1"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />

                    {item.name}
                  </span>
                ))}
              </div>
            </Panel>
          </div>

          <footer className="py-5 text-center text-[10px] text-gray-400">
            Dashboard Analytics · All rights reserved
          </footer>
        </div>
      </main>
    </div>
  );
}
