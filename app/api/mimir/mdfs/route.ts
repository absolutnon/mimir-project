import { NextRequest, NextResponse } from "next/server";

// GET /api/mimir/mdfs → proxy to GET /api/v1/mdfs
export async function GET(req: NextRequest) {
  const region = req.headers.get("x-mimir-region") ?? "mimir";
  const apiKey = req.headers.get("x-mimir-api-key");

  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 401 });

  try {
    const res = await fetch(`https://${region}.mjoll.no/api/v1/mdfs`, {
      headers: {
        Accept: "application/json",
        "x-mimir-cognito-id-token": `Bearer ${apiKey}`,
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach Mimir API" }, { status: 502 });
  }
}
