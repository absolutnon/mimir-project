import Card from "@/components/ui/card";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of your data</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Records" value="—" />
        <Card title="Active Sources" value="—" />
        <Card title="Last Updated" value="—" />
        <Card title="Alerts" value="—" />
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 min-h-64 flex items-center justify-center text-gray-400">
          Chart placeholder
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 min-h-64 flex items-center justify-center text-gray-400">
          Chart placeholder
        </div>
      </div>
    </div>
  );
}
