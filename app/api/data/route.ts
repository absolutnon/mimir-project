import { NextResponse } from "next/server";

// GET /api/data
export async function GET() {
  // Replace with real data fetching logic
  const data = {
    records: 0,
    sources: [],
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(data);
}
