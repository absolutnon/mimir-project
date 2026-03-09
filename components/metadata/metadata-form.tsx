"use client";

import { useState } from "react";
import type { MimirItem, MimirConnection } from "@/types";

interface Props {
  item: MimirItem;
  connection: MimirConnection;
  onSaved: (updated: MimirItem) => void;
}

const ITEM_TYPE_LABELS: Record<string, string> = {
  video: "Video", image: "Image", audio: "Audio",
  file: "File", clipList: "Clip List", person: "Person",
};

export default function MetadataForm({ item, connection, onSaved }: Props) {
  const formData = item.metadata?.formData ?? {};

  const [title, setTitle]           = useState(formData.default_title ?? "");
  const [description, setDesc]      = useState(formData.default_description ?? "");
  const [mediaCreatedOn, setDate]   = useState(
    formData.default_mediaCreatedOn
      ? new Date(formData.default_mediaCreatedOn).toISOString().slice(0, 16)
      : ""
  );

  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const body = {
      metadataDelta: {
        formId: item.metadata?.formId ?? "default",
        formData: {
          default_title: title,
          default_description: description,
          ...(mediaCreatedOn ? { default_mediaCreatedOn: new Date(mediaCreatedOn).toISOString() } : {}),
        },
      },
    };

    try {
      const res = await fetch(`/api/mimir/item/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-mimir-region": connection.region,
          "x-mimir-api-key": connection.apiKey,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? err?.error ?? `HTTP ${res.status}`);
      }

      const result = await res.json();
      setSuccess(true);
      onSaved({ ...item, metadata: { formId: result.metadata?.formId ?? "default", formData: result.metadata?.formData ?? {} } });
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Item summary */}
      <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] overflow-hidden">
        <div className="flex items-start gap-4 p-5">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0 bg-[#f0f0f0]" />
          ) : (
            <div className="w-20 h-14 rounded-lg bg-[#f0f0f0] dark:bg-[#202020] shrink-0 flex items-center justify-center text-[#ccc] text-xs">
              No preview
            </div>
          )}
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium text-[#111] dark:text-white truncate">{title || "Untitled"}</p>
            <p className="text-xs text-[#999]">{item.originalFileName}</p>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {item.itemType && (
                <span className="text-[11px] bg-[#f0f0f0] dark:bg-[#202020] text-[#666] dark:text-[#aaa] px-2 py-0.5 rounded-full">
                  {ITEM_TYPE_LABELS[item.itemType] ?? item.itemType}
                </span>
              )}
              {item.isArchived && (
                <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Archived</span>
              )}
              {item.itemState && (
                <span className="text-[11px] text-[#bbb]">{item.itemState}</span>
              )}
            </div>
          </div>
          <p className="ml-auto text-[11px] text-[#bbb] shrink-0 font-mono">{item.id}</p>
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] divide-y divide-[#f3f3f3] dark:divide-[#1a1a1a]">
        <div className="p-5 flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#999]">Metadata</h3>
        </div>

        <Field label="Title">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </Field>

        <Field label="Media Created On">
          <input
            type="datetime-local"
            value={mediaCreatedOn}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="Created On (read-only)">
          <p className="text-sm text-[#999]">
            {formData.default_createdOn
              ? new Date(formData.default_createdOn as string).toLocaleString()
              : "—"}
          </p>
        </Field>
      </div>

      {/* Read-only flags */}
      <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] divide-y divide-[#f3f3f3] dark:divide-[#1a1a1a]">
        <div className="p-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#999]">Processing Flags</h3>
        </div>
        <Flag label="Transcription" value={item.transcriptionEnabled} lang={item.languageCode} />
        <Flag label="Label Detection" value={item.labelDetectionEnabled} />
        <Flag label="Celebrity Detection" value={item.celebrityDetectionEnabled} />
        <Flag label="Person Detection" value={item.personDetectionEnabled} />
      </div>

      {/* Save bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-[#111] dark:bg-white text-white dark:text-[#111] text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {success && <span className="text-sm text-green-600">Saved successfully</span>}
        {error   && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </div>
  );
}

const inputCls =
  "w-full text-sm bg-[#f7f7f7] dark:bg-[#1a1a1a] border border-[#e8e8e8] dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-[#111] dark:text-white placeholder-[#bbb] focus:outline-none focus:ring-1 focus:ring-[#111] dark:focus:ring-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 grid grid-cols-[10rem_1fr] gap-4 items-start">
      <label className="text-sm text-[#999] pt-2">{label}</label>
      <div>{children}</div>
    </div>
  );
}

function Flag({ label, value, lang }: { label: string; value?: boolean; lang?: string }) {
  return (
    <div className="px-5 py-3 flex items-center justify-between">
      <span className="text-sm text-[#555] dark:text-[#aaa]">
        {label}{lang ? ` (${lang})` : ""}
      </span>
      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
        value
          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          : "bg-[#f0f0f0] dark:bg-[#202020] text-[#aaa]"
      }`}>
        {value ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}
