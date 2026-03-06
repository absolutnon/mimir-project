"use client";

import { useState } from "react";
import type { NewsArticle, NewsSource } from "@/types";
import NewsCard from "./news-card";

const SOURCES: ("All" | NewsSource)[] = [
  "All", "BBC", "Sky News", "Fox News", "CBS", "Al Jazeera", "CNN",
];

export default function NewsFeed({ articles }: { articles: NewsArticle[] }) {
  const [active, setActive] = useState<"All" | NewsSource>("All");

  const filtered = active === "All"
    ? articles
    : articles.filter((a) => a.source === active);

  return (
    <div className="space-y-4">
      {/* Tab filter */}
      <div className="flex gap-0 border-b border-[#e8e8e8] dark:border-[#1f1f1f]">
        {SOURCES.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
              active === s
                ? "border-[#111] dark:border-white text-[#111] dark:text-white"
                : "border-transparent text-[#aaa] dark:text-[#555] hover:text-[#444] dark:hover:text-[#aaa]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[#aaa] py-12 text-center">No articles available.</p>
      ) : (
        <div className="flex flex-col bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] overflow-hidden divide-y divide-[#f3f3f3] dark:divide-[#1a1a1a]">
          {filtered.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
