import Parser from "rss-parser";
import type { NewsArticle, NewsSource } from "@/types";

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "Mimir-Dashboard/1.0" },
});

const FEEDS: { source: NewsSource; url: string }[] = [
  { source: "BBC",        url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { source: "Sky News",   url: "https://feeds.skynews.com/feeds/rss/home.xml" },
  { source: "Fox News",   url: "https://moxie.foxnews.com/google-publisher/latest.xml" },
  { source: "CBS",        url: "https://www.cbsnews.com/latest/rss/main" },
  { source: "Al Jazeera", url: "https://www.ajplus.net/stories?format=rss" },
  { source: "CNN",        url: "http://rss.cnn.com/rss/edition.rss" },
];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 300);
}

async function fetchFeed(source: NewsSource, url: string): Promise<NewsArticle[]> {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.slice(0, 10).map((item, i) => ({
      id: `${source}-${i}-${item.guid ?? item.link ?? i}`,
      title: item.title ?? "No title",
      description: stripHtml(item.contentSnippet ?? item.content ?? item.summary ?? ""),
      link: item.link ?? "",
      pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
      source,
    }));
  } catch {
    return [];
  }
}

export async function fetchAllNews(): Promise<{ articles: NewsArticle[]; fetchedAt: string }> {
  const results = await Promise.allSettled(
    FEEDS.map(({ source, url }) => fetchFeed(source, url))
  );

  const articles = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return { articles, fetchedAt: new Date().toISOString() };
}
