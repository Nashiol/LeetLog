"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { InterviewQuestion } from "@/types";

export function InterviewList({
  questions: initial,
}: {
  questions: InterviewQuestion[];
}) {
  const [questions, setQuestions] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [form, setForm] = useState({ question: "", answer: "", notes: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setForm({ question: "", answer: "", notes: "" });
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
    setForm({ question: q.question, answer: q.answer, notes: q.notes });
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
        <p className="text-sm text-zinc-500">{questions.length} questions</p>
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
            {showAdd ? "New Question" : "Edit Question"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Question</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Tell me about a time you..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Answer</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              rows={4}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Model answer using STAR method..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Alternative approaches, feedback, improvements..."
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

      {questions.length === 0 && !showAdd ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-lg font-medium text-zinc-500">
            No interview questions yet.
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Add common behavioral and technical questions to prepare.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) =>
            editingId === q.id ? null : (
              <div
                key={q.id}
                className="rounded-xl border border-zinc-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === q.id ? null : q.id)
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-zinc-50"
                >
                  <span className="font-medium text-zinc-900">
                    {q.question}
                  </span>
                  <svg
                    className={`h-4 w-4 text-zinc-400 transition-transform ${
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
                  <div className="border-t border-zinc-100 px-5 py-4 space-y-4">
                    {q.answer && (
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-400">
                          Answer
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">
                          {q.answer}
                        </p>
                      </div>
                    )}
                    {q.notes && (
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-400">
                          Notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-500">
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
