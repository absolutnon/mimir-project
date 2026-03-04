import Parser from "rss-parser";
import { NextResponse } from "next/server";
import type { NewsArticle, NewsSource } from "@/types";

export const revalidate = 300; // cache for 5 minutes

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "Mimir-Dashboard/1.0" },
});

const FEEDS: { source: NewsSource; url: string }[] = [
  { source: "BBC",        url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { source: "Sky News",   url: "https://feeds.skynews.com/feeds/rss/home.xml" },
  { source: "Fox News",   url: "https://moxie.foxnews.com/google-publisher/latest.xml" },
  { source: "CBS",        url: "https://www.cbsnews.com/latest/rss/main" },
  { source: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { source: "CNN",        url: "http://rss.cnn.com/rss/edition.rss" },
];

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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 300);
}

export async function GET() {
  const results = await Promise.allSettled(
    FEEDS.map(({ source, url }) => fetchFeed(source, url))
  );

  const articles: NewsArticle[] = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return NextResponse.json({ articles, fetchedAt: new Date().toISOString() });
}
