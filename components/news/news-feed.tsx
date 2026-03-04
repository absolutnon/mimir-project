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
      {/* Source filter */}
      <div className="flex flex-wrap gap-2">
        {SOURCES.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              active === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No articles available.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {filtered.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
