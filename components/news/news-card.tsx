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
      className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded-full ${color}`}>
          {article.source}
        </span>
        <span className="text-xs text-gray-400 shrink-0">
          {formatDateTime(article.pubDate)}
        </span>
      </div>
      <p className="text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100 line-clamp-2">
        {article.title}
      </p>
      {article.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
          {article.description}
        </p>
      )}
    </a>
  );
}
