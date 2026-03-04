// Base fetch wrapper for internal API routes
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchData<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}
