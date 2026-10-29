
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Network,
  ClipboardList,
  Radio,
  Wallet,
  CreditCard,
  Settings,
  ChartNoAxesColumnIncreasing,
  Megaphone,
  Flag,
  Headset,
  ClipboardCheck,
  Shield,
  CodeXml,
  ChevronDown,
} from "lucide-react";

import { useAuthStore } from "../src/store/authStore";

const menuGroups = [
  {
    title: null,
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutGrid }],
  },
  {
    title: "USER MANAGEMENT",
    items: [
      { label: "Users", href: "/users", icon: Users },
      { label: "Points System", href: "/points-system", icon: Network },
    ],
  },
  {
    title: "CONTENT MODERATION",
    items: [
      { label: "Content Management", href: "/content-management", icon: ClipboardList },
      { label: "Livestreams", href: "/livestreams", icon: Radio },
    ],
  },
  {
    title: "ECONOMY & WALLET",
    items: [
      { label: "Points & Wallet", href: "/wallet", icon: Wallet },
      { label: "Payout Management", href: "/payout-management", icon: CreditCard },
    ],
  },
  {
    title: "PLATFORM SETTINGS",
    items: [
      { label: "App Configuration", href: "/app-configuration", icon: Settings },
    ],
  },
  {
    title: "INSIGHTS & ANALYTICS",
    items: [
      { label: "Analytics", href: "/analytics", icon: ChartNoAxesColumnIncreasing },
    ],
  },
  {
    title: "ADS",
    items: [
      { label: "Ad Management", href: "/ad-management", icon: Megaphone },
    ],
  },
  {
    title: "SECURITY & SUPPORT",
    items: [
      { label: "Reports & Flagged", href: "/reports", icon: Flag },
      { label: "User Support", href: "/user-support", icon: Headset },
      { label: "Audit Logs", href: "/auditlogs", icon: ClipboardCheck },
    ],
  },
  {
    title: "TEAM & PERMISSIONS",
    items: [
      { label: "Admin Roles", href: "/admin-roles", icon: Shield },
    ],
  },
  {
    title: "DEVELOPER TOOLS",
    items: [
      { label: "API & Integrations", href: "/api-integrations", icon: CodeXml },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);

  const email = user?.email || "";
  const displayName =
    user?.name || email.split("@")[0] || "Admin User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-[280px] flex-col border-r border-[#eeeeF4] bg-white">
      {/* Logo */}
      <div className="flex h-[76px] shrink-0 items-center border-b border-[#f0f0f5] px-6">
        <Link href="/dashboard" aria-label="Postam home">
          <span className="text-2xl font-bold tracking-tight text-[#7555ff]">
            postam
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {menuGroups.map((group, groupIndex) => (
          <div
            key={group.title ?? "main"}
            className={groupIndex === 0 ? "mb-3" : "mb-4"}
          >
            {group.title && (
              <p className="mb-2 mt-3 px-3 text-[11px] font-semibold leading-5 tracking-wide text-[#72778a]">
                {group.title}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[42px] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-[#f3f0ff] font-semibold text-[#7657ff]"
                        : "text-[#27304a] hover:bg-[#f7f7fb]"
                    }`}
                  >
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className="shrink-0"
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin profile */}
      <div className="shrink-0 border-t border-[#f0f0f5] px-5 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 text-left"
          aria-label="Admin account"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e7e7ef] bg-[#f4edff] text-sm font-semibold text-[#7555ff]">
            {avatarLetter}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#24283b]">
              {displayName}
            </p>

            <p className="truncate text-xs text-[#85899a]">
              {email || "No email available"}
            </p>
          </div>

          <ChevronDown size={17} className="shrink-0 text-[#85899a]" />
        </button>
      </div>
    </aside>
  );
}
