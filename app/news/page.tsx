import NewsFeed from "@/components/news/news-feed";
import { fetchAllNews } from "@/lib/news";

export const revalidate = 300;

export default async function NewsPage() {
  const { articles, fetchedAt } = await fetchAllNews();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Breaking News</h2>
          <p className="text-sm text-gray-500 mt-1">
            Aggregated from BBC, Sky News, Fox News, CBS, Al Jazeera &amp; CNN
          </p>
        </div>
        <span className="text-xs text-gray-400">
          Last fetched: {new Date(fetchedAt).toLocaleTimeString()}
        </span>
      </div>

      <NewsFeed articles={articles} />
    </div>
  );
}
