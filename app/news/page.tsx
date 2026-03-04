import NewsFeed from "@/components/news/news-feed";
import type { NewsArticle } from "@/types";

async function getNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api/news`,
      { next: { revalidate: 300 } }
    );
    const json = await res.json();
    return json.articles ?? [];
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const articles = await getNews();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Breaking News</h2>
          <p className="text-sm text-gray-500 mt-1">
            Aggregated from BBC, Sky News, Fox News, CBS, Al Jazeera &amp; CNN
          </p>
        </div>
        <span className="text-xs text-gray-400">Refreshes every 5 min</span>
      </div>

      <NewsFeed articles={articles} />
    </div>
  );
}
