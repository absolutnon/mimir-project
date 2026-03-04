// Shared types — extend as the project grows

export interface DataRecord {
  id: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
