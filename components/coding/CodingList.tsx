"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { CodingQuestion } from "@/types";

export function CodingList({
  questions: initial,
}: {
  questions: CodingQuestion[];
}) {
  const [questions, setQuestions] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{questions.length} questions</p>
        <Button onClick={() => { setShowAdd(true); setEditingId(null); resetForm(); }}>
          Add Coding Question
        </Button>
      </div>

      {activeForm && (
        <form
          onSubmit={showAdd ? handleAdd : handleUpdate}
          className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-zinc-700">
            {showAdd ? "New Coding Question" : "Edit Coding Question"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Question</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Build a URL shortener..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Repository Link
            </label>
            <input
              type="url"
              value={form.repository_link}
              onChange={(e) => setForm((f) => ({ ...f, repository_link: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700">Date Created</label>
              <input
                type="date"
                value={form.date_created}
                onChange={(e) => setForm((f) => ({ ...f, date_created: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Approach, lessons learned, improvements..."
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

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium uppercase text-zinc-500">
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Repository</th>
              <th className="px-4 py-3">Date Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-zinc-400">
                  No coding questions yet.
                </td>
              </tr>
            ) : (
              questions.map((q) =>
                editingId === q.id ? null : (
                  <tr
                    key={q.id}
                    className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {q.question}
                    </td>
                    <td className="px-4 py-3">
                      {q.repository_link ? (
                        <a
                          href={q.repository_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-600 underline underline-offset-2 hover:text-zinc-900"
                        >
                          {q.repository_link}
                        </a>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {q.date_created}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => startEdit(q)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(q.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
