"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import type { InterviewQuestion, Tag } from "@/types";
import { TagBadge } from "@/components/shared/TagBadge";
import { TagPicker } from "@/components/shared/TagPicker";

export function InterviewList({
  questions: initial,
}: {
  questions: InterviewQuestion[];
}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [questions, setQuestions] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [form, setForm] = useState({ question: "", answer: "", notes: "", tag_id: null as string | null });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/tags").then((r) => r.ok ? r.json() : []).then(setTags);
  }, []);

  const tagMap = Object.fromEntries(tags.map((t) => [t.id, t]));

  function resetForm() {
    setForm({ question: "", answer: "", notes: "", tag_id: null });
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

    const res = await fetch("/api/interview", {
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

    const created: InterviewQuestion = await res.json();
    setQuestions((prev) => [created, ...prev]);
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

    const res = await fetch(`/api/interview/${editingId}`, {
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

    const updated: InterviewQuestion = await res.json();
    setQuestions((prev) =>
      prev.map((q) => (q.id === editingId ? updated : q))
    );
    setEditingId(null);
    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this question?")) return;

    const res = await fetch(`/api/interview/${id}`, { method: "DELETE" });

    if (res.ok) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  }

  function startEdit(q: InterviewQuestion) {
    setEditingId(q.id);
    setForm({ question: q.question, answer: q.answer, notes: q.notes, tag_id: q.tag_id });
    setShowAdd(false);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    resetForm();
  }

  const activeForm = showAdd || editingId !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">{questions.length} questions</p>
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
            {showAdd ? "New Question" : "Edit Question"}
          </h3>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Question</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              placeholder="Tell me about a time you..."
            />
          </div>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Answer</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              rows={4}
              className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              placeholder="Model answer using STAR method..."
            />
          </div>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              placeholder="Alternative approaches, feedback, improvements..."
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

      {questions.length === 0 && !showAdd ? (
        <div className="hud-card rounded-xl p-8 text-center">
          <p className="text-lg font-medium text-on-surface">
            No interview questions yet.
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Add common behavioral and technical questions to prepare.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) =>
            editingId === q.id ? null : (
              <div
                key={q.id}
                className="hud-card overflow-hidden rounded-xl"
              >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === q.id ? null : q.id)
                    }
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-container-highest"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-on-surface truncate">
                        {q.question}
                      </span>
                      {q.tag_id && tagMap[q.tag_id] && (
                        <TagBadge tag={tagMap[q.tag_id]} />
                      )}
                    </div>
                  <svg
                    className={`h-4 w-4 text-on-surface-variant transition-transform ${
                      expandedId === q.id ? "rotate-180" : ""
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
                </button>

                {expandedId === q.id && (
                  <div className="border-t border-outline-variant px-5 py-4 space-y-4">
                    {q.answer && (
                      <div>
                        <p className="font-mono text-label-caps uppercase text-on-surface-variant">
                          Answer
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-on-surface">
                          {q.answer}
                        </p>
                      </div>
                    )}
                    {q.notes && (
                      <div>
                        <p className="font-mono text-label-caps uppercase text-on-surface-variant">
                          Notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-on-surface-variant">
                          {q.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => startEdit(q)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(q.id)}
                      >
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
