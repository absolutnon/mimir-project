// Merge class names (lightweight cn helper, no dependencies needed)
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Format a number with locale-aware separators
export function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n);
}

// Format an ISO date string to a readable locale date
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format an ISO date string to date + time (e.g. "Mar 2, 2026 · 14:30")
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}
