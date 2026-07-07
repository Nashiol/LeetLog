"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { SystemDesign, Tag } from "@/types";
import { TagBadge } from "@/components/shared/TagBadge";
import { TagPicker } from "@/components/shared/TagPicker";

export function SystemDesignList({
  entries: initial,
}: {
  entries: SystemDesign[];
}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [entries, setEntries] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    question: "",
    company: "",
    answer: "",
    notes: "",
    tag_id: null as string | null,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/tags").then((r) => r.ok ? r.json() : []).then(setTags);
  }, []);

  const tagMap = Object.fromEntries(tags.map((t) => [t.id, t]));

  function resetForm() {
    setForm({ question: "", company: "", answer: "", notes: "", tag_id: null });
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
      tag_id: e.tag_id,
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
        <p className="text-sm text-on-surface-variant">{entries.length} questions</p>
        <Button onClick={() => { setShowAdd(true); setEditingId(null); resetForm(); }}>
          Add Question
        </Button>
      </div>

      {activeForm && (
        <form
          onSubmit={showAdd ? handleAdd : handleUpdate}
          className="hud-card space-y-4 rounded-xl p-5"
        >
          <h3 className="font-mono text-label-caps uppercase text-on-surface-variant">
            {showAdd ? "New System Design Question" : "Edit Question"}
          </h3>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Question</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              placeholder="Design Instagram..."
            />
          </div>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Company</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              placeholder="Meta, Google, Amazon..."
            />
          </div>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Answer</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              rows={5}
              className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              placeholder="Functional requirements, non-functional requirements, high-level design, deep dive..."
            />
          </div>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              placeholder="Feedback, improvements, alternative approaches..."
            />
          </div>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Tag</label>
            <TagPicker
              value={form.tag_id}
              onChange={(val) => setForm((f) => ({ ...f, tag_id: val }))}
              tags={tags}
              onTagsChange={() => fetch("/api/tags").then((r) => r.ok ? r.json() : []).then(setTags)}
            />
          </div>

          {error && <p className="text-sm text-[#F87171]">{error}</p>}

          <div className="flex items-center gap-3 border-t border-outline-variant pt-4">
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
        <div className="hud-card rounded-xl p-8 text-center">
          <p className="text-lg font-medium text-on-surface">
            No system design questions yet.
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Add common system design questions tagged by company.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) =>
            editingId === entry.id ? null : (
              <div
                key={entry.id}
                className="hud-card overflow-hidden rounded-xl"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === entry.id ? null : entry.id)
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-container-highest"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-on-surface truncate">
                      {entry.question}
                    </span>
                    {entry.company && (
                      <Badge variant="blue">{entry.company}</Badge>
                    )}
                    {entry.tag_id && tagMap[entry.tag_id] && (
                      <TagBadge tag={tagMap[entry.tag_id]} />
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-on-surface-variant">
                      {formatDate(entry.created_at)}
                    </span>
                    <svg
                      className={`h-4 w-4 text-on-surface-variant transition-transform ${
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
                  <div className="border-t border-outline-variant px-5 py-4 space-y-4">
                    {entry.answer && (
                      <div>
                        <p className="font-mono text-label-caps uppercase text-on-surface-variant">
                          Answer
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-on-surface">
                          {entry.answer}
                        </p>
                      </div>
                    )}
                    {entry.notes && (
                      <div>
                        <p className="font-mono text-label-caps uppercase text-on-surface-variant">
                          Notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-on-surface-variant">
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
