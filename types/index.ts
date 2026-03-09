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

// ── Mimir API ────────────────────────────────────────────────────────────────

export type MimirRegion = "mimir" | "apac" | "oceania" | "us";

export interface MimirConnection {
  region: MimirRegion;
  apiKey: string;
}

export interface MimirMetadataFormData {
  default_title?: string;
  default_description?: string;
  default_createdOn?: string;
  default_mediaCreatedOn?: string;
  [key: string]: unknown;
}

export interface MimirItem {
  id: string;
  originalFileName?: string;
  mediaType?: string;
  itemType?: "video" | "image" | "person" | "audio" | "file" | "clipList";
  thumbnail?: string;
  isArchived?: boolean;
  transcriptionEnabled?: boolean;
  languageCode?: string;
  labelDetectionEnabled?: boolean;
  celebrityDetectionEnabled?: boolean;
  personDetectionEnabled?: boolean;
  transcodingState?: string;
  itemState?: string;
  metadata?: {
    formId: string;
    formData: MimirMetadataFormData;
  };
}

export interface MimirMetadataDelta {
  metadataDelta: {
    formId: string;
    formData: Partial<MimirMetadataFormData>;
  };
}
