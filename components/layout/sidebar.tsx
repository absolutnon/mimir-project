"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "News Feed",  href: "/news" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0 bg-white dark:bg-[#141414] border-r border-[#e8e8e8] dark:border-[#1f1f1f] flex flex-col">
      <div className="px-5 pt-7 pb-6">
        <span className="text-base font-semibold tracking-tight">Mimir</span>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#f0f0f0] dark:bg-[#202020] text-[#111] dark:text-white font-medium"
                  : "text-[#888] dark:text-[#555] hover:text-[#111] dark:hover:text-[#ccc] hover:bg-[#f7f7f7] dark:hover:bg-[#1a1a1a]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
