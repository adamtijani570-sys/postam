
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
<Sidebar/>


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
      ].some((value) => value.toLowerCase().includes(query));

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
    <main className="min-h-screen bg-[#f7f8fa] p-3 text-[#17202e] sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <header className="mb-5">
          <h1 className="text-xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage all users, view profiles, and take administrative actions.
          </p>
        </header>

        {/* Statistics */}
        <section className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-100 text-orange-500">
                  <Users size={15} />
                </span>
                <span className="text-xs text-gray-500">
                  {stat.title}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xl font-bold">{stat.value}</p>
                <span className={`text-[10px] ${stat.color}`}>
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
        <section className="relative mb-3 rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <h2 className="shrink-0 text-xs font-semibold">
              All users
            </h2>

            <div className="relative min-w-0 flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, or user ID..."
                className="w-full rounded-lg border border-gray-100 bg-gray-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-violet-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs hover:bg-gray-50"
              >
                <Filter size={13} />
                Filters
              </button>

              <button
                onClick={exportUsers}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs hover:bg-gray-50"
              >
                <Download size={13} />
                Export
              </button>

              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-[#7560e8] px-3 py-2 text-xs font-medium text-white hover:bg-[#624bd5]"
              >
                <Plus size={14} />
                Add user
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
              <label className="text-xs text-gray-500">
                Account status
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none"
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
                className="text-xs text-violet-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Users table */}
        <section className="overflow-visible rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-white">
                <tr className="border-b border-gray-200 text-[10px] uppercase text-gray-500">
                  <th className="px-4 py-3 font-semibold">Users</th>
                  <th className="px-3 py-3 font-semibold">Username</th>
                  <th className="px-3 py-3 font-semibold">Account type</th>
                  <th className="px-3 py-3 font-semibold">
                    Engagement score
                  </th>
                  <th className="px-3 py-3 font-semibold">Points</th>
                  <th className="px-3 py-3 font-semibold">Account status</th>
                  <th className="px-3 py-3 font-semibold">Join date</th>
                  <th className="px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-violet-600">
                          {user.avatar}
                        </div>

                        <div>
                          <p className="whitespace-nowrap text-xs font-medium text-gray-800">
                            {user.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-xs">{user.username}</td>

                    <td className="px-3 py-3">
                      <span
                        className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] ${
                          user.type === "Premium" || user.type === "Gold"
                            ? "border-amber-200 text-amber-700"
                            : user.type === "Verified"
                              ? "border-blue-200 text-blue-700"
                              : user.type === "Silver"
                                ? "border-gray-300 text-gray-600"
                                : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {user.type}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-xs">
                      {user.score.toLocaleString()}
                    </td>

                    <td className="px-3 py-3 text-xs">
                      <span className="text-amber-500">◉</span>{" "}
                      {user.points.toLocaleString()}
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] ${
                          user.status === "Suspended"
                            ? "bg-red-50 text-red-500"
                            : "bg-violet-50 text-violet-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-500">
                      {user.joined}
                    </td>

                    <td className="relative px-3 py-3">
                      <button
                        aria-label={`Actions for ${user.name}`}
                        onClick={() =>
                          setSelectedMenu(
                            selectedMenu === user.id ? null : user.id
                          )
                        }
                        className="rounded-md p-1.5 hover:bg-gray-100"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {selectedMenu === user.id && (
                        <div className="absolute right-8 top-7 z-20 w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                          <button
                            onClick={() =>
                              updateStatus(
                                user.id,
                                user.status === "Active"
                                  ? "Suspended"
                                  : "Active"
                              )
                            }
                            className="w-full rounded-md px-3 py-2 text-left text-xs hover:bg-gray-50"
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
                      className="px-4 py-12 text-center text-sm text-gray-400"
                    >
                      No users found. Try another search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <p>Page 1 of 1</p>
          </div>
        </section>

        {/* Add user modal */}
        {showAddUser && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowAddUser(false);
              }
            }}
          >
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Add new user</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the user's account details.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUser(false)}
                  aria-label="Close dialog"
                  className="rounded-lg p-2 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={addUser} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium">
                    Full name
                  </label>
                  <input
                    required
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium">
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium">
                    Username
                  </label>
                  <input
                    required
                    value={newUsername}
                    onChange={(event) => setNewUsername(event.target.value)}
                    placeholder="@username"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#7560e8] py-3 text-sm font-medium text-white hover:bg-[#624bd5]"
                >
                  Add user
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
