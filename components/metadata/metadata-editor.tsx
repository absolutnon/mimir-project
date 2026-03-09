"use client";

import { useState, useEffect } from "react";
import type { MimirConnection, MimirItem } from "@/types";
import ConnectionPanel from "./connection-panel";
import MetadataForm from "./metadata-form";

const SESSION_KEY = "mimir_connection";

export default function MetadataEditor() {
  const [connection, setConnection] = useState<MimirConnection>({ region: "mimir", apiKey: "" });
  const [itemId, setItemId]         = useState("");
  const [item, setItem]             = useState<MimirItem | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // Restore connection from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setConnection(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Persist connection to sessionStorage on change
  function handleConnectionChange(c: MimirConnection) {
    setConnection(c);
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(c)); } catch { /* ignore */ }
  }

  async function fetchItem() {
    if (!itemId.trim() || !connection.apiKey) return;
    setLoading(true);
    setError(null);
    setItem(null);

    try {
      const res = await fetch(`/api/mimir/item/${itemId.trim()}`, {
        headers: {
          "x-mimir-region":  connection.region,
          "x-mimir-api-key": connection.apiKey,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? data?.error ?? `HTTP ${res.status}`);
      setItem(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <ConnectionPanel
        connection={connection}
        onChange={handleConnectionChange}
        connected={!!item}
      />

      {/* Item lookup */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter item ID (e.g. 00112233-4455-6677-8899-aabbccddeeff)"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchItem()}
          className="flex-1 text-sm bg-white dark:bg-[#141414] border border-[#e8e8e8] dark:border-[#1f1f1f] rounded-lg px-4 py-2.5 text-[#111] dark:text-white placeholder-[#bbb] focus:outline-none focus:ring-1 focus:ring-[#111] dark:focus:ring-white"
        />
        <button
          onClick={fetchItem}
          disabled={loading || !itemId.trim() || !connection.apiKey}
          className="px-4 py-2.5 rounded-lg bg-[#111] dark:bg-white text-white dark:text-[#111] text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-30"
        >
          {loading ? "Fetching…" : "Fetch"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {item && (
        <MetadataForm
          item={item}
          connection={connection}
          onSaved={setItem}
        />
      )}

      {!item && !loading && !error && (
        <div className="rounded-xl border border-dashed border-[#e0e0e0] dark:border-[#2a2a2a] py-16 flex items-center justify-center text-sm text-[#bbb]">
          Enter an item ID above to load its metadata
        </div>
      )}
    </div>
  );
}
