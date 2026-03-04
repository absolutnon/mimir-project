// Shared types — extend as the project grows

export interface DataRecord {
  id: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: NewsSource;
}

export type NewsSource =
  | "BBC"
  | "Sky News"
  | "Fox News"
  | "CBS"
  | "Al Jazeera"
  | "CNN";
