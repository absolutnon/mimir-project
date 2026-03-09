"use client";

import type { MimirConnection, MimirRegion } from "@/types";

const REGIONS: { value: MimirRegion; label: string }[] = [
  { value: "mimir",   label: "EU (mimir.mjoll.no)" },
  { value: "apac",    label: "APAC (apac.mjoll.no)" },
  { value: "oceania", label: "Oceania (oceania.mjoll.no)" },
  { value: "us",      label: "US (us.mjoll.no)" },
];

interface Props {
  connection: MimirConnection;
  onChange: (c: MimirConnection) => void;
  connected: boolean;
}

export default function ConnectionPanel({ connection, onChange, connected }: Props) {
  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#999]">Connection</h2>
        {connected && (
          <span className="flex items-center gap-1.5 text-[11px] text-green-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Connected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-[#999]">Region</label>
          <select
            value={connection.region}
            onChange={(e) => onChange({ ...connection, region: e.target.value as MimirRegion })}
            className="w-full text-sm bg-[#f7f7f7] dark:bg-[#1a1a1a] border border-[#e8e8e8] dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-[#111] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#111] dark:focus:ring-white"
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-[#999]">API Key</label>
          <input
            type="password"
            placeholder="Paste your API key"
            value={connection.apiKey}
            onChange={(e) => onChange({ ...connection, apiKey: e.target.value })}
            className="w-full text-sm bg-[#f7f7f7] dark:bg-[#1a1a1a] border border-[#e8e8e8] dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-[#111] dark:text-white placeholder-[#bbb] focus:outline-none focus:ring-1 focus:ring-[#111] dark:focus:ring-white"
          />
        </div>
      </div>

      <p className="text-[11px] text-[#bbb]">
        API key is stored in session memory only and never persisted.
        Obtain yours from Mimir → Profile → User Settings → API Keys.
      </p>
    </div>
  );
}
