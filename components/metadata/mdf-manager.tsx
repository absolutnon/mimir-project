"use client";

import { useState, useCallback } from "react";
import type { MimirConnection, Mdf, MdfField, MdfFieldType, MdfSummary, MdfFieldAlternative } from "@/types";

const FIELD_TYPES: { value: MdfFieldType; label: string }[] = [
  { value: "text",          label: "Text" },
  { value: "checkbox",      label: "Checkbox" },
  { value: "date",          label: "Date" },
  { value: "number",        label: "Number" },
  { value: "choice",        label: "Choice (single)" },
  { value: "multiplechoice",label: "Choice (multiple)" },
  { value: "link",          label: "Link / URL" },
  { value: "user",          label: "User" },
  { value: "subtype",       label: "Subtype" },
];

interface Props {
  connection: MimirConnection;
}

const NEEDS_ALTERNATIVES: MdfFieldType[] = ["choice", "multiplechoice"];

// ── Helpers ──────────────────────────────────────────────────────────────────

function mimirHeaders(connection: MimirConnection, withBody = false) {
  return {
    "x-mimir-region":  connection.region,
    "x-mimir-api-key": connection.apiKey,
    ...(withBody ? { "Content-Type": "application/json" } : {}),
  };
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MdfManager({ connection }: Props) {
  const [mdfs, setMdfs]           = useState<MdfSummary[]>([]);
  const [selectedMdf, setSelectedMdf] = useState<Mdf | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingMdf, setLoadingMdf]   = useState(false);
  const [listError, setListError]     = useState<string | null>(null);
  const [mdfError, setMdfError]       = useState<string | null>(null);
  const [listFetched, setListFetched] = useState(false);

  // Fetch MDF list
  const fetchMdfs = useCallback(async () => {
    if (!connection.apiKey) return;
    setLoadingList(true);
    setListError(null);
    try {
      const res = await fetch("/api/mimir/mdfs", { headers: mimirHeaders(connection) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      const list: MdfSummary[] = data?._embedded?.collection ?? [];
      setMdfs(list);
      setListFetched(true);
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Failed to fetch MDF list");
    } finally {
      setLoadingList(false);
    }
  }, [connection]);

  // Select and load a single MDF
  async function selectMdf(id: string) {
    if (selectedMdf?.id === id) return;
    setLoadingMdf(true);
    setMdfError(null);
    setSelectedMdf(null);
    try {
      const res = await fetch(`/api/mimir/mdfs/${id}`, { headers: mimirHeaders(connection) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setSelectedMdf(data);
    } catch (e) {
      setMdfError(e instanceof Error ? e.message : "Failed to load MDF");
    } finally {
      setLoadingMdf(false);
    }
  }

  return (
    <div className="space-y-6">
      {!listFetched ? (
        <div className="flex gap-3">
          <button
            onClick={fetchMdfs}
            disabled={loadingList || !connection.apiKey}
            className="px-4 py-2.5 rounded-lg bg-[#111] dark:bg-white text-white dark:text-[#111] text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-30"
          >
            {loadingList ? "Loading…" : "Load MDF forms"}
          </button>
          {!connection.apiKey && (
            <p className="text-sm text-[#aaa] self-center">Enter an API key above first</p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#999]">{mdfs.length} form{mdfs.length !== 1 ? "s" : ""} found</p>
          <button onClick={fetchMdfs} className="text-xs text-[#999] hover:text-[#111] dark:hover:text-white transition-colors">
            Refresh
          </button>
        </div>
      )}

      {listError && <ErrorBox message={listError} />}

      {mdfs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-6 items-start">
          {/* MDF list */}
          <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] overflow-hidden divide-y divide-[#f3f3f3] dark:divide-[#1a1a1a]">
            {mdfs.map((m) => (
              <button
                key={m.id}
                onClick={() => selectMdf(m.id)}
                className={`w-full text-left px-4 py-3 transition-colors text-sm ${
                  selectedMdf?.id === m.id
                    ? "bg-[#f0f0f0] dark:bg-[#202020] font-medium text-[#111] dark:text-white"
                    : "text-[#555] dark:text-[#aaa] hover:bg-[#fafafa] dark:hover:bg-[#181818]"
                }`}
              >
                <span className="block truncate">{m.displayName ?? m.label}</span>
                <span className="text-[11px] text-[#bbb] font-mono">{m.id}</span>
              </button>
            ))}
          </div>

          {/* MDF detail */}
          <div>
            {loadingMdf && (
              <div className="py-12 text-center text-sm text-[#bbb]">Loading form…</div>
            )}
            {mdfError && <ErrorBox message={mdfError} />}
            {selectedMdf && !loadingMdf && (
              <MdfDetail
                mdf={selectedMdf}
                connection={connection}
                onUpdated={setSelectedMdf}
              />
            )}
            {!selectedMdf && !loadingMdf && !mdfError && (
              <div className="rounded-xl border border-dashed border-[#e0e0e0] dark:border-[#2a2a2a] py-16 flex items-center justify-center text-sm text-[#bbb]">
                Select a form to view its fields
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MDF Detail ────────────────────────────────────────────────────────────────

function MdfDetail({ mdf, connection, onUpdated }: {
  mdf: Mdf;
  connection: MimirConnection;
  onUpdated: (m: Mdf) => void;
}) {
  const [saving, setSaving]           = useState(false);
  const [saveError, setSaveError]     = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MdfField | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  async function putMdf(fields: MdfField[]) {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/mimir/mdfs/${mdf.id}`, {
        method: "PUT",
        headers: mimirHeaders(connection, true),
        body: JSON.stringify({ fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? data?.message ?? `HTTP ${res.status}`);
      onUpdated(data);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(field: MdfField) {
    const newFields = mdf.fields.filter((f) => f.id !== field.id);
    putMdf(newFields);
    setConfirmDelete(null);
  }

  function handleAdd(field: MdfField) {
    putMdf([...mdf.fields, field]);
    setShowAddForm(false);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#111] dark:text-white">
            {mdf.displayName ?? mdf.label}
          </h3>
          <p className="text-[11px] text-[#bbb] font-mono mt-0.5">{mdf.id}</p>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
          mdf.active
            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            : "bg-[#f0f0f0] dark:bg-[#202020] text-[#aaa]"
        }`}>
          {mdf.active ? "Active" : "Inactive"}
        </span>
      </div>

      {saveError && <ErrorBox message={saveError} />}

      {/* Fields table */}
      <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_7rem_5rem_2.5rem] px-4 py-2.5 border-b border-[#f0f0f0] dark:border-[#1f1f1f]">
          {["Field ID", "Type", "Required", ""].map((h) => (
            <span key={h} className="text-[11px] font-semibold uppercase tracking-widest text-[#999]">{h}</span>
          ))}
        </div>

        {mdf.fields.length === 0 ? (
          <p className="text-sm text-[#bbb] px-4 py-6 text-center">No fields defined</p>
        ) : (
          <div className="divide-y divide-[#f3f3f3] dark:divide-[#1a1a1a]">
            {mdf.fields.map((field) => (
              <div key={field.id} className="grid grid-cols-[1fr_7rem_5rem_2.5rem] px-4 py-3 items-center">
                <div>
                  <p className="text-sm font-medium text-[#111] dark:text-white font-mono">{field.fieldId}</p>
                  {field.alternatives && field.alternatives.length > 0 && (
                    <p className="text-[11px] text-[#bbb] mt-0.5">
                      {field.alternatives.map((a) => a.label).join(" · ")}
                    </p>
                  )}
                </div>
                <span className="text-xs text-[#666] dark:text-[#aaa] capitalize">{field.type}</span>
                <span className={`text-[11px] font-medium ${field.required ? "text-amber-600" : "text-[#bbb]"}`}>
                  {field.required ? "Required" : "Optional"}
                </span>
                <button
                  onClick={() => setConfirmDelete(field)}
                  disabled={saving}
                  className="text-[#ccc] hover:text-red-500 transition-colors text-lg leading-none disabled:opacity-30"
                  title="Delete field"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add field */}
        <div className="border-t border-[#f0f0f0] dark:border-[#1f1f1f]">
          {showAddForm ? (
            <AddFieldForm
              onAdd={handleAdd}
              onCancel={() => setShowAddForm(false)}
              saving={saving}
            />
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full text-left px-4 py-3 text-sm text-[#999] hover:text-[#111] dark:hover:text-white transition-colors"
            >
              + Add field
            </button>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <DeleteConfirm
          field={confirmDelete}
          saving={saving}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

// ── Add field form ────────────────────────────────────────────────────────────

function AddFieldForm({ onAdd, onCancel, saving }: {
  onAdd: (f: MdfField) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [fieldId, setFieldId]   = useState("");
  const [type, setType]         = useState<MdfFieldType>("text");
  const [required, setRequired] = useState(false);
  const [alternatives, setAlternatives] = useState<MdfFieldAlternative[]>([{ label: "", value: "" }]);
  const [fieldIdError, setFieldIdError] = useState("");

  function validate() {
    if (!fieldId.trim()) { setFieldIdError("Field ID is required"); return false; }
    if (!/^[a-z0-9_-]+$/.test(fieldId)) { setFieldIdError("Only lowercase letters, numbers, _ and - allowed"); return false; }
    setFieldIdError("");
    return true;
  }

  function handleSubmit() {
    if (!validate()) return;
    const newField: MdfField = {
      id: crypto.randomUUID(),
      fieldId: fieldId.trim(),
      type,
      required,
      ...(NEEDS_ALTERNATIVES.includes(type) && alternatives.some(a => a.label)
        ? { alternatives: alternatives.filter(a => a.label.trim()) }
        : {}),
    };
    onAdd(newField);
  }

  function updateAlt(i: number, key: keyof MdfFieldAlternative, val: string) {
    const next = [...alternatives];
    next[i] = { ...next[i], [key]: val };
    if (key === "label" && !next[i].value) next[i].value = val; // auto-fill value
    setAlternatives(next);
  }

  return (
    <div className="px-4 py-4 space-y-4 bg-[#fafafa] dark:bg-[#181818]">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#999]">New Field</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Field ID */}
        <div className="space-y-1">
          <label className="text-xs text-[#999]">Field ID <span className="text-red-400">*</span></label>
          <input
            type="text"
            placeholder="e.g. episode_number"
            value={fieldId}
            onChange={(e) => setFieldId(e.target.value.toLowerCase())}
            className={inputCls + (fieldIdError ? " ring-1 ring-red-400" : "")}
          />
          {fieldIdError && <p className="text-[11px] text-red-500">{fieldIdError}</p>}
        </div>

        {/* Type */}
        <div className="space-y-1">
          <label className="text-xs text-[#999]">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MdfFieldType)}
            className={inputCls}
          >
            {FIELD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Required */}
        <div className="space-y-1">
          <label className="text-xs text-[#999]">Required</label>
          <label className="flex items-center gap-2 h-[38px] cursor-pointer">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-[#555] dark:text-[#aaa]">Required field</span>
          </label>
        </div>
      </div>

      {/* Alternatives for choice types */}
      {NEEDS_ALTERNATIVES.includes(type) && (
        <div className="space-y-2">
          <p className="text-xs text-[#999]">Options</p>
          {alternatives.map((alt, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                placeholder="Label"
                value={alt.label}
                onChange={(e) => updateAlt(i, "label", e.target.value)}
                className={`${inputCls} flex-1`}
              />
              <input
                type="text"
                placeholder="Value"
                value={alt.value}
                onChange={(e) => updateAlt(i, "value", e.target.value)}
                className={`${inputCls} flex-1`}
              />
              {alternatives.length > 1 && (
                <button
                  onClick={() => setAlternatives(alternatives.filter((_, j) => j !== i))}
                  className="text-[#ccc] hover:text-red-500 transition-colors px-1 text-lg"
                >×</button>
              )}
            </div>
          ))}
          <button
            onClick={() => setAlternatives([...alternatives, { label: "", value: "" }])}
            className="text-xs text-[#999] hover:text-[#111] dark:hover:text-white transition-colors"
          >
            + Add option
          </button>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-[#111] dark:bg-white text-white dark:text-[#111] text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {saving ? "Saving…" : "Add field"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-[#999] hover:text-[#111] dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Delete confirmation ───────────────────────────────────────────────────────

function DeleteConfirm({ field, saving, onConfirm, onCancel }: {
  field: MdfField;
  saving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#e8e8e8] dark:border-[#2a2a2a] p-6 max-w-sm w-full mx-4 shadow-xl space-y-4">
        <h3 className="text-base font-semibold text-[#111] dark:text-white">Delete field?</h3>
        <p className="text-sm text-[#666] dark:text-[#aaa]">
          Are you sure you want to delete{" "}
          <span className="font-mono font-semibold text-[#111] dark:text-white">{field.fieldId}</span>?
          This will remove the field from the form and cannot be undone.
        </p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onConfirm}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-40"
          >
            {saving ? "Deleting…" : "Delete field"}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-[#999] hover:text-[#111] dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

const inputCls =
  "w-full text-sm bg-white dark:bg-[#141414] border border-[#e8e8e8] dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-[#111] dark:text-white placeholder-[#bbb] focus:outline-none focus:ring-1 focus:ring-[#111] dark:focus:ring-white";

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
      {message}
    </div>
  );
}
