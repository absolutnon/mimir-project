import type { NewsArticle } from "@/types";
import { formatDateTime } from "@/lib/utils";

const SOURCE_COLORS: Record<string, string> = {
  BBC:          "bg-red-600",
  "Sky News":   "bg-sky-600",
  "Fox News":   "bg-blue-800",
  CBS:          "bg-yellow-600",
  "Al Jazeera": "bg-green-700",
  CNN:          "bg-red-700",
};

export default function NewsCard({ article }: { article: NewsArticle }) {
  const color = SOURCE_COLORS[article.source] ?? "bg-gray-600";

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-4 px-4 py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      {/* Source badge — fixed width so titles align */}
      <span className={`mt-0.5 shrink-0 text-xs font-semibold text-white px-2 py-0.5 rounded-full ${color}`}>
        {article.source}
      </span>

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug line-clamp-1">
          {article.title}
        </p>
        {article.description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {article.description}
          </p>
        )}
      </div>

      {/* Timestamp — right-aligned */}
      <span className="shrink-0 text-xs text-gray-400 mt-0.5 whitespace-nowrap">
        {formatDateTime(article.pubDate)}
      </span>
    </a>
  );
}
