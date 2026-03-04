import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/news";

export const revalidate = 300;

export async function GET() {
  const data = await fetchAllNews();
  return NextResponse.json(data);
}
