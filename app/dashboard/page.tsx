import Card from "@/components/ui/card";
import NewsCard from "@/components/news/news-card";
import Link from "next/link";
import type { NewsArticle } from "@/types";

async function getLatestNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api/news`,
      { next: { revalidate: 300 } }
    );
    const json = await res.json();
    return (json.articles ?? []).slice(0, 6);
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const latestNews = await getLatestNews();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of your data</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Records" value="—" />
        <Card title="Active Sources" value="6" />
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

      {/* Latest news preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Latest News</h3>
          <Link href="/news" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        {latestNews.length === 0 ? (
          <p className="text-sm text-gray-400">Could not load news at this time.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {latestNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
