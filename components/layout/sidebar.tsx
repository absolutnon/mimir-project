import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  // Add more routes here as the project grows
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
      <div className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
        <span className="font-bold text-blue-600 text-xl">M</span>
        <span className="ml-1 font-semibold text-sm">imir</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
