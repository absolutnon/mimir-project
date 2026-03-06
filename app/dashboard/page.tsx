import Card from "@/components/ui/card";
import NewsCard from "@/components/news/news-card";
import Link from "next/link";
import { fetchAllNews } from "@/lib/news";

export const revalidate = 300;

export default async function DashboardPage() {
  const { articles } = await fetchAllNews();
  const latestNews = articles.slice(0, 6);

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#999] mt-0.5">Overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Records" value="—" />
        <Card title="Active Sources" value="6" />
        <Card title="Last Updated" value="—" />
        <Card title="Alerts" value="—" />
      </div>

      {/* Chart area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] p-6 min-h-56 flex items-center justify-center text-[#ccc] dark:text-[#333] text-sm">
          Chart placeholder
        </div>
        <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] p-6 min-h-56 flex items-center justify-center text-[#ccc] dark:text-[#333] text-sm">
          Chart placeholder
        </div>
      </div>

      {/* Latest news */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#999]">Latest News</h2>
          <Link href="/news" className="text-xs text-[#999] hover:text-[#111] dark:hover:text-white transition-colors">
            View all →
          </Link>
        </div>
        {latestNews.length === 0 ? (
          <p className="text-sm text-[#aaa]">Could not load news.</p>
        ) : (
          <div className="flex flex-col bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] overflow-hidden divide-y divide-[#f3f3f3] dark:divide-[#1a1a1a]">
            {latestNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
