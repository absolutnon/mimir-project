import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ itemId: string }> };

function mimirBaseUrl(region: string) {
  return `https://${region}.mjoll.no`;
}

function mimirHeaders(apiKey: string) {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-mimir-cognito-id-token": `Bearer ${apiKey}`,
  };
}

// GET /api/mimir/item/[itemId] → proxy to GET /api/v1/items/{itemId}
export async function GET(req: NextRequest, { params }: Params) {
  const { itemId } = await params;
  const region = req.headers.get("x-mimir-region") ?? "mimir";
  const apiKey = req.headers.get("x-mimir-api-key");

  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 401 });

  try {
    const res = await fetch(
      `${mimirBaseUrl(region)}/api/v1/items/${itemId}?readableMetadataFields=true`,
      { headers: mimirHeaders(apiKey) }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach Mimir API" }, { status: 502 });
  }
}

// PATCH /api/mimir/item/[itemId] → proxy to PATCH /api/v1/itemMetadata/{itemId}
export async function PATCH(req: NextRequest, { params }: Params) {
  const { itemId } = await params;
  const region = req.headers.get("x-mimir-region") ?? "mimir";
  const apiKey = req.headers.get("x-mimir-api-key");

  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 401 });

  try {
    const body = await req.json();
    const res = await fetch(
      `${mimirBaseUrl(region)}/api/v1/itemMetadata/${itemId}?readableMetadataFields=true`,
      { method: "PATCH", headers: mimirHeaders(apiKey), body: JSON.stringify(body) }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach Mimir API" }, { status: 502 });
  }
}
