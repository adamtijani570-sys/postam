"use client";
import Sidebar from "../components/sidebar";

import { useMemo, useState } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  MoreVertical,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  X,
} from "lucide-react";

const initialUsers = [
  {
    id: 1,
    name: "John Adebayo",
    email: "john.adebayo@gmail.com",
    username: "@jadebayo",
    type: "Premium",
    score: 1460,
    points: 45230,
    status: "Active",
    joined: "2024-01-15",
    avatar: "J",
  },
  {
    id: 2,
    name: "Sarah Okonkwo",
    email: "sarah@gmail.com",
    username: "@sarah",
    type: "Verified",
    score: 2789,
    points: 28450,
    status: "Active",
    joined: "2024-02-20",
    avatar: "S",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@gmail.com",
    username: "@mchen",
    type: "Basic",
    score: 2890,
    points: 12890,
    status: "Active",
    joined: "2024-03-10",
    avatar: "M",
  },
  {
    id: 4,
    name: "Amina Ibrahim",
    email: "amina@gmail.com",
    username: "@aminai",
    type: "Basic",
    score: 5620,
    points: 5620,
    status: "Active",
    joined: "2024-04-05",
    avatar: "A",
  },
  {
    id: 5,
    name: "David Okafor",
    email: "david@gmail.com",
    username: "@daviddo",
    type: "Gold",
    score: 67340,
    points: 67340,
    status: "Suspended",
    joined: "2024-01-28",
    avatar: "D",
  },
  {
    id: 6,
    name: "Grace Mensah",
    email: "grace@gmail.com",
    username: "@gracem",
    type: "Silver",
    score: 38920,
    points: 38920,
    status: "Active",
    joined: "2024-02-14",
    avatar: "G",
  },
];

const statistics = [
  {
    title: "Total Users",
    value: "187,234",
    change: "+1,234",
    color: "text-emerald-500",
  },
  {
    title: "Verified Users",
    value: "145,892",
    change: "77.9% of total",
    color: "text-emerald-500",
  },
  {
    title: "Premium Users",
    value: "25,818",
    change: "25% of total",
    color: "text-emerald-500",
  },
  {
    title: "Suspended Users",
    value: "25,818",
    change: "Active suspensions",
    color: "text-emerald-500",
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.toLowerCase();

      const matchesSearch = [
        user.name,
        user.email,
        user.username,
        user.type,
        user.id.toString(),
     ].some((value) =>
  String(value ?? "").toLowerCase().includes(query)
);

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  function addUser(event) {
    event.preventDefault();

    const name = newName.trim();
    const email = newEmail.trim();
    const username = newUsername.trim();

    if (!name || !email || !username) return;

    const user = {
      id: Date.now(),
      name,
      email,
      username: username.startsWith("@") ? username : `@${username}`,
      type: "Basic",
      score: 0,
      points: 0,
      status: "Active",
      joined: new Date().toISOString().slice(0, 10),
      avatar: name.charAt(0).toUpperCase(),
    };

    setUsers((previous) => [user, ...previous]);
    setNewName("");
    setNewEmail("");
    setNewUsername("");
    setShowAddUser(false);
  }

  function updateStatus(id, status) {
    setUsers((previous) =>
      previous.map((user) =>
        user.id === id ? { ...user, status } : user
      )
    );

    setSelectedMenu(null);
  }

  function exportUsers() {
    const headers = [
      "Name",
      "Email",
      "Username",
      "Account Type",
      "Engagement Score",
      "Points",
      "Status",
      "Join Date",
    ];

    const escapeCsv = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const rows = filteredUsers.map((user) =>
      [
        user.name,
        user.email,
        user.username,
        user.type,
        user.score,
        user.points,
        user.status,
        user.joined,
      ]
        .map(escapeCsv)
        .join(",")
    );

    const csv = [headers.map(escapeCsv).join(","), ...rows].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "users.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

 
return (
 
  <div className="flex min-h-screen w-full bg-[#f7f8fa]">
    <Sidebar />

    <main className="ml-64 min-w-0 flex-1  overflow-x-hidden p-4 text-[#17202e] sm:p-5 lg:p-8">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Page header */}
        <header className="mb-6 cursor-pointer">
          <h1 className="text-2xl font-bold tracking-tight text-[#101828]">
            User Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all users, view profiles, and take administrative actions.
          </p>
        </header>

        {/* Statistics cards */}
        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-[#e1e5ec] bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-100 bg-[#faf8ff] text-[#7957ff]">
                  <Users size={16} />
                </span>
                <span className="text-xs font-medium text-[#667085]">
                  {stat.title}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-2xl font-bold tracking-tight text-[#101828]">
                  {stat.value}
                </p>
                <span className={`text-[10px] font-medium ${stat.color}`}>
                  {stat.title === "Total Users" && (
                    <ArrowUpRight className="mr-0.5 inline" size={12} />
                  )}
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Search and actions */}
        <section className="relative cursor-pointer mb-4 rounded-xl border border-[#e1e5ec] bg-white p-3 sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="shrink-0">
              <h2 className="text-sm font-semibold text-[#101828]">
                All users
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {users.length} users in total
              </p>
            </div>

            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, username, or ID..."
                className="w-full rounded-lg border border-[#eaecf0] bg-[#f9fafb] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#7957ff] focus:bg-white focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition ${
                  showFilters
                    ? "border-purple-200 bg-purple-50 text-[#7957ff]"
                    : "border-[#e1e5ec] bg-white hover:bg-gray-50"
                }`}
              >
                <Filter size={14} />
                Filters
              </button>

              <button
                onClick={exportUsers}
                className="flex items-center gap-2 rounded-lg border border-[#e1e5ec] bg-white px-3 py-2.5 text-xs font-medium transition hover:bg-gray-50"
              >
                <Download size={14} />
                Export
              </button>

              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#7560e8] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#624bd5]"
              >
                <Plus size={15} />
                Add user
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
              <label className="text-xs font-medium text-gray-600">
                Account status
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-[#e1e5ec] bg-white px-3 py-2 text-xs outline-none focus:border-[#7957ff]"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="text-xs font-medium text-[#7957ff] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Users table */}
        <section className="overflow-hidden rounded-xl border border-[#e1e5ec] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 border-collapse text-left">
              <thead className="bg-[#fafbfc]">
                <tr className="border-b border-[#e1e5ec] text-[10px] uppercase tracking-wide text-[#667085]">
                  <th className="px-4 py-3.5 font-semibold">User</th>
                  <th className="px-3 py-3.5 font-semibold">Username</th>
                  <th className="px-3 py-3.5 font-semibold">Account type</th>
                  <th className="px-3 py-3.5 font-semibold">Engagement score</th>
                  <th className="px-3 py-3.5 font-semibold">Points</th>
                  <th className="px-3 py-3.5 font-semibold">Account status</th>
                  <th className="px-3 py-3.5 font-semibold">Join date</th>
                  <th className="px-3 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-[#fafaff]"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-[#7957ff]">
                          {user.avatar}
                        </div>

                        <div>
                          <p className="whitespace-nowrap text-xs font-semibold text-[#101828]">
                            {user.name}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3.5 text-xs font-medium text-[#344054]">
                      {user.username}
                    </td>

                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                          user.type === "Premium" || user.type === "Gold"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : user.type === "Verified"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : user.type === "Silver"
                                ? "border-gray-200 bg-gray-50 text-gray-600"
                                : "border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        {user.type}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 text-xs font-medium text-[#344054]">
                      {user.score.toLocaleString()}
                    </td>

                    <td className="px-3 py-3.5 text-xs font-medium text-[#344054]">
                      <span className="mr-1 text-amber-500">◉</span>
                      {user.points.toLocaleString()}
                    </td>

                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${
                          user.status === "Suspended"
                            ? "bg-red-50 text-red-600"
                            : "bg-violet-50 text-violet-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-xs text-[#667085]">
                      {user.joined}
                    </td>

                    <td className="relative px-3 py-3.5">
                      <button
                        aria-label={`Actions for ${user.name}`}
                        onClick={() =>
                          setSelectedMenu(
                            selectedMenu === user.id ? null : user.id
                          )
                        }
                        className="rounded-lg p-2 transition hover:bg-gray-100"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {selectedMenu === user.id && (
                        <div className="absolute right-8 top-8 z-20 w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                          <button
                            onClick={() =>
                              updateStatus(
                                user.id,
                                user.status === "Active"
                                  ? "Suspended"
                                  : "Active"
                              )
                            }
                            className="w-full rounded-md px-3 py-2 text-left text-xs text-gray-700 transition hover:bg-gray-50"
                          >
                            {user.status === "Active"
                              ? "Suspend user"
                              : "Activate user"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-14 text-center text-sm text-gray-400"
                    >
                      No users found. Try another search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-3.5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <p>Page 1 of 1</p>
          </div>
        </section>

        {/* Add user modal */}
        {showAddUser && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowAddUser(false);
              }
            }}
          >
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#101828]">
                    Add new user
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the user's account details.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddUser(false)}
                  aria-label="Close dialog"
                  className="rounded-lg p-2 transition hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={addUser} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    required
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#7957ff] focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#7957ff] focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    required
                    value={newUsername}
                    onChange={(event) => setNewUsername(event.target.value)}
                    placeholder="@username"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#7957ff] focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#7560e8] py-3 text-sm font-semibold text-white transition hover:bg-[#624bd5]"
                >
                  Add user
                </button>
                            </form>
            </div>
          </div>
        )}
           </div>
    </main>
  </div>
  );
}
