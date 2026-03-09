import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ mdfId: string }> };

function mimirHeaders(apiKey: string, withBody = false) {
  return {
    Accept: "application/json",
    ...(withBody ? { "Content-Type": "application/json" } : {}),
    "x-mimir-cognito-id-token": `Bearer ${apiKey}`,
  };
}

// GET /api/mimir/mdfs/[mdfId] → proxy to GET /api/v1/mdfs/{mdfId}
export async function GET(req: NextRequest, { params }: Params) {
  const { mdfId } = await params;
  const region = req.headers.get("x-mimir-region") ?? "mimir";
  const apiKey = req.headers.get("x-mimir-api-key");

  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 401 });

  try {
    const res = await fetch(`https://${region}.mjoll.no/api/v1/mdfs/${mdfId}`, {
      headers: mimirHeaders(apiKey),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach Mimir API" }, { status: 502 });
  }
}

// PUT /api/mimir/mdfs/[mdfId] → proxy to PUT /api/v1/mdfs/{mdfId}
// Body: full updateMdf.requestBody (fields array + optional label, active, etc.)
export async function PUT(req: NextRequest, { params }: Params) {
  const { mdfId } = await params;
  const region = req.headers.get("x-mimir-region") ?? "mimir";
  const apiKey = req.headers.get("x-mimir-api-key");

  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 401 });

  try {
    const body = await req.json();
    const res = await fetch(`https://${region}.mjoll.no/api/v1/mdfs/${mdfId}`, {
      method: "PUT",
      headers: mimirHeaders(apiKey, true),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach Mimir API" }, { status: 502 });
  }
}
