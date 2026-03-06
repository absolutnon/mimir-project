import type { NewsArticle } from "@/types";
import { formatDateTime } from "@/lib/utils";

const SOURCE_COLORS: Record<string, string> = {
  BBC:          "text-red-600",
  "Sky News":   "text-sky-600",
  "Fox News":   "text-blue-900",
  CBS:          "text-amber-600",
  "Al Jazeera": "text-green-700",
  CNN:          "text-red-700",
};

export default function NewsCard({ article }: { article: NewsArticle }) {
  const color = SOURCE_COLORS[article.source] ?? "text-[#888]";

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-baseline gap-4 px-5 py-3.5 hover:bg-[#fafafa] dark:hover:bg-[#181818] transition-colors group"
    >
      <span className={`shrink-0 text-[11px] font-semibold uppercase tracking-wide w-[4.5rem] ${color}`}>
        {article.source}
      </span>

      <p className="flex-1 min-w-0 text-sm text-[#222] dark:text-[#ddd] leading-snug line-clamp-1 group-hover:text-[#000] dark:group-hover:text-white transition-colors">
        {article.title}
      </p>

      <span className="shrink-0 text-[11px] text-[#bbb] dark:text-[#444] whitespace-nowrap">
        {formatDateTime(article.pubDate)}
      </span>
    </a>
  );
}
