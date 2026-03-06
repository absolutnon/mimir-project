import NewsFeed from "@/components/news/news-feed";
import { fetchAllNews } from "@/lib/news";

export const revalidate = 300;

export default async function NewsPage() {
  const { articles, fetchedAt } = await fetchAllNews();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Breaking News</h1>
          <p className="text-sm text-[#999] mt-0.5">BBC · Sky News · Fox News · CBS · Al Jazeera · CNN</p>
        </div>
        <span className="text-xs text-[#bbb]">
          Updated {new Date(fetchedAt).toLocaleTimeString()}
        </span>
      </div>

      <NewsFeed articles={articles} />
    </div>
  );
}
