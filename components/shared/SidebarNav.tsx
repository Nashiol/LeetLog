"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "LeetCode", href: "/leetcode", icon: "code" },
  { label: "DSA", href: "/dsa", icon: "account_tree" },
  { label: "Interview Questions", href: "/interview", icon: "question_answer" },
  { label: "Coding Questions", href: "/coding", icon: "terminal" },
  { label: "System Design", href: "/system-design", icon: "schema" },
];

export function SidebarNav({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
              isActive
                ? "-ml-3 rounded-l-none border-l-[3px] border-primary bg-surface-container-high pl-[25px] font-bold text-on-surface"
                : "font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? "text-primary" : ""}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
