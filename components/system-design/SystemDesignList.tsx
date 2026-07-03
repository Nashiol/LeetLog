"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { SystemDesign } from "@/types";

export function SystemDesignList({
  entries: initial,
}: {
  entries: SystemDesign[];
}) {
  const [entries, setEntries] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    question: "",
    company: "",
    answer: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setForm({ question: "", company: "", answer: "", notes: "" });
    setError("");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.question) {
      setError("Question is required.");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/system-design", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to add question.");
      return;
    }

    const created: SystemDesign = await res.json();
    setEntries((prev) => [created, ...prev]);
    setShowAdd(false);
    resetForm();
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setError("");

    if (!form.question) {
      setError("Question is required.");
      return;
    }

    setSaving(true);

    const res = await fetch(`/api/system-design/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to update.");
      return;
    }

    const updated: SystemDesign = await res.json();
    setEntries((prev) =>
      prev.map((e) => (e.id === editingId ? updated : e))
    );
    setEditingId(null);
    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this system design question?")) return;

    const res = await fetch(`/api/system-design/${id}`, { method: "DELETE" });

    if (res.ok) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  }

  function startEdit(e: SystemDesign) {
    setEditingId(e.id);
    setForm({
      question: e.question,
      company: e.company,
      answer: e.answer,
      notes: e.notes,
    });
    setShowAdd(false);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    resetForm();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const activeForm = showAdd || editingId !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{entries.length} questions</p>
        <Button onClick={() => { setShowAdd(true); setEditingId(null); resetForm(); }}>
          Add Question
        </Button>
      </div>

      {activeForm && (
        <form
          onSubmit={showAdd ? handleAdd : handleUpdate}
          className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-zinc-700">
            {showAdd ? "New System Design Question" : "Edit Question"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Question</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Design Instagram..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Company</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Meta, Google, Amazon..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Answer</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              rows={5}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Functional requirements, non-functional requirements, high-level design, deep dive..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Feedback, improvements, alternative approaches..."
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : showAdd ? "Add" : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => { setShowAdd(false); cancelEdit(); }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {entries.length === 0 && !showAdd ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-lg font-medium text-zinc-500">
            No system design questions yet.
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Add common system design questions tagged by company.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) =>
            editingId === entry.id ? null : (
              <div
                key={entry.id}
                className="rounded-xl border border-zinc-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === entry.id ? null : entry.id)
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-zinc-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-medium text-zinc-900 truncate">
                      {entry.question}
                    </span>
                    {entry.company && (
                      <Badge variant="blue">{entry.company}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-zinc-400">
                      {formatDate(entry.created_at)}
                    </span>
                    <svg
                      className={`h-4 w-4 text-zinc-400 transition-transform ${
                        expandedId === entry.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {expandedId === entry.id && (
                  <div className="border-t border-zinc-100 px-5 py-4 space-y-4">
                    {entry.answer && (
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-400">
                          Answer
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">
                          {entry.answer}
                        </p>
                      </div>
                    )}
                    {entry.notes && (
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-400">
                          Notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-500">
                          {entry.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" onClick={() => startEdit(entry)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(entry.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
