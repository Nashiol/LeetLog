"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CodingNotesModal } from "@/components/coding/CodingNotesModal";
import type { CodingQuestion } from "@/types";

export function CodingList({
  questions: initial,
}: {
  questions: CodingQuestion[];
}) {
  const [questions, setQuestions] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    question: "",
    repository_link: "",
    notes: "",
    date_created: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setForm({
      question: "",
      repository_link: "",
      notes: "",
      date_created: new Date().toISOString().split("T")[0],
    });
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

    const res = await fetch("/api/coding", {
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

    const created: CodingQuestion = await res.json();
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

    const res = await fetch(`/api/coding/${editingId}`, {
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

    const updated: CodingQuestion = await res.json();
    setQuestions((prev) =>
      prev.map((q) => (q.id === editingId ? updated : q))
    );
    setEditingId(null);
    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coding question?")) return;

    const res = await fetch(`/api/coding/${id}`, { method: "DELETE" });

    if (res.ok) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      if (viewingId === id) setViewingId(null);
      if (editingId === id) setEditingId(null);
    }
  }

  function startEdit(q: CodingQuestion) {
    setEditingId(q.id);
    setForm({
      question: q.question,
      repository_link: q.repository_link,
      notes: q.notes,
      date_created: q.date_created,
    });
    setShowAdd(false);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    resetForm();
  }

  const activeForm = showAdd || editingId !== null;
  const viewingQuestion = viewingId ? questions.find((q) => q.id === viewingId) ?? null : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">{questions.length} questions</p>
        <Button onClick={() => { setShowAdd(true); setEditingId(null); resetForm(); }}>
          Add Coding Question
        </Button>
      </div>

      {activeForm && (
        <form
          onSubmit={showAdd ? handleAdd : handleUpdate}
          className="hud-card space-y-4 rounded-xl p-5"
        >
          <h3 className="font-mono text-label-caps uppercase text-on-surface-variant">
            {showAdd ? "New Coding Question" : "Edit Coding Question"}
          </h3>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Question</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              placeholder="Build a URL shortener..."
            />
          </div>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
              Repository Link
            </label>
            <input
              type="url"
              value={form.repository_link}
              onChange={(e) => setForm((f) => ({ ...f, repository_link: e.target.value }))}
              className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Date Created</label>
              <input
                type="date"
                value={form.date_created}
                onChange={(e) => setForm((f) => ({ ...f, date_created: e.target.value }))}
                className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="field-dark mt-1 w-full px-3 py-2.5 text-sm"
              placeholder="Approach, lessons learned, improvements..."
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

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-lowest/50 text-left font-mono text-label-caps uppercase text-on-surface-variant">
              <th className="px-6 py-4">Question</th>
              <th className="px-6 py-4">Repository</th>
              <th className="px-6 py-4">Date Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                  No coding questions yet.
                </td>
              </tr>
            ) : (
              questions.map((q) =>
                editingId === q.id ? null : (
                  <tr
                    key={q.id}
                    className="transition-colors hover:bg-surface-container-highest"
                  >
                    <td className="px-6 py-4 font-semibold text-on-surface">
                      {q.question}
                    </td>
                    <td className="px-6 py-4">
                      {q.repository_link ? (
                        <a
                          href={q.repository_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-2 hover:text-primary-hover"
                        >
                          {q.repository_link}
                        </a>
                      ) : (
                        <span className="text-on-surface-variant">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-label-mono text-on-surface-variant">
                      {q.date_created}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingId(q.id)}
                          className="rounded-lg p-1.5 text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
                          title="View Notes"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                        <button
                          onClick={() => startEdit(q)}
                          className="rounded-lg p-1.5 text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="rounded-lg p-1.5 text-[#F87171] transition hover:bg-[#3A1818] hover:text-[#FCA5A5]"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {viewingQuestion && (
        <CodingNotesModal
          question={viewingQuestion}
          onClose={() => setViewingId(null)}
          onEdit={() => {
            const q = viewingQuestion;
            setViewingId(null);
            startEdit(q);
          }}
          onDelete={() => {
            const id = viewingQuestion.id;
            setViewingId(null);
            handleDelete(id);
          }}
        />
      )}
    </div>
  );
}
