"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DSANotesModal } from "@/components/dsa/DSANotesModal";
import type { DSAConcept, MasteryLevel } from "@/types";

const masteryVariants: Record<MasteryLevel, "gray" | "blue" | "yellow" | "green"> = {
  not_started: "gray",
  learning: "blue",
  comfortable: "yellow",
  mastered: "green",
};

const masteryLabels: Record<MasteryLevel, string> = {
  not_started: "Not Started",
  learning: "Learning",
  comfortable: "Comfortable",
  mastered: "Mastered",
};

export function DSATable({ concepts: initial }: { concepts: DSAConcept[] }) {
  const router = useRouter();
  const [concepts, setConcepts] = useState(initial);
  const [filter, setFilter] = useState<MasteryLevel | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [form, setForm] = useState({ topic: "", resource_used: "", notes: "", mastery_level: "not_started" as MasteryLevel, date_studied: "" });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return concepts;
    return concepts.filter((c) => c.mastery_level === filter);
  }, [concepts, filter]);

  const viewingConcept = viewingId ? concepts.find((c) => c.id === viewingId) ?? null : null;

  function startEdit(c: DSAConcept) {
    setEditingId(c.id);
    setForm({
      topic: c.topic,
      resource_used: c.resource_used,
      notes: c.notes,
      mastery_level: c.mastery_level,
      date_studied: c.date_studied,
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    if (!form.topic) return;

    setSaving(true);

    const res = await fetch(`/api/dsa/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) return;

    const updated: DSAConcept = await res.json();
    setConcepts((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this concept?")) return;

    const res = await fetch(`/api/dsa/${id}`, { method: "DELETE" });

    if (res.ok) {
      setConcepts((prev) => prev.filter((c) => c.id !== id));
      if (viewingId === id) setViewingId(null);
      if (editingId === id) setEditingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as MasteryLevel | "all")}
          className="field-dark w-auto px-3 py-2 text-sm"
        >
          <option value="all">All Levels</option>
          <option value="not_started">Not Started</option>
          <option value="learning">Learning</option>
          <option value="comfortable">Comfortable</option>
          <option value="mastered">Mastered</option>
        </select>
        <Button onClick={() => router.push("/dsa/new")}>Add Concept</Button>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 sm:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-6 py-12 text-center text-on-surface-variant">
            No DSA concepts found.
          </div>
        ) : (
          filtered.map((concept) =>
            editingId === concept.id ? (
              <div key={concept.id} className="hud-card rounded-xl p-4">
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Topic</label>
                    <input
                      type="text"
                      value={form.topic}
                      onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                      className="field-dark mt-1 w-full px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Resource Used</label>
                    <input
                      type="text"
                      value={form.resource_used}
                      onChange={(e) => setForm((f) => ({ ...f, resource_used: e.target.value }))}
                      className="field-dark mt-1 w-full px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Mastery Level</label>
                    <select
                      value={form.mastery_level}
                      onChange={(e) => setForm((f) => ({ ...f, mastery_level: e.target.value as MasteryLevel }))}
                      className="field-dark mt-1 w-full px-3 py-2 text-sm"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="learning">Learning</option>
                      <option value="comfortable">Comfortable</option>
                      <option value="mastered">Mastered</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Date Studied</label>
                    <input
                      type="date"
                      value={form.date_studied}
                      onChange={(e) => setForm((f) => ({ ...f, date_studied: e.target.value }))}
                      className="field-dark mt-1 w-full px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Notes</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      rows={3}
                      className="field-dark mt-1 w-full px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div
                key={concept.id}
                className="hud-card rounded-xl p-4 transition hover:border-primary/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {concept.topic}
                    </p>
                    <p className="mt-0.5 font-mono text-label-mono text-on-surface-variant truncate">
                      {concept.resource_used || "—"}
                    </p>
                  </div>
                  <Badge variant={masteryVariants[concept.mastery_level]}>
                    {masteryLabels[concept.mastery_level]}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-label-mono text-on-surface-variant">
                    {concept.date_studied}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingId(concept.id)}
                      className="rounded-lg p-1.5 text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
                      title="View Notes"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button
                      onClick={() => startEdit(concept)}
                      className="rounded-lg p-1.5 text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(concept.id)}
                      className="rounded-lg p-1.5 text-[#F87171] transition hover:bg-[#3A1818] hover:text-[#FCA5A5]"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-lowest/50 text-left font-mono text-label-caps uppercase text-on-surface-variant">
              <th className="px-6 py-4">Topic</th>
              <th className="px-6 py-4">Resource Used</th>
              <th className="px-6 py-4">Mastery Level</th>
              <th className="px-6 py-4">Date Studied</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                  No DSA concepts found.
                </td>
              </tr>
            ) : (
              filtered.map((concept) =>
                editingId === concept.id ? (
                  <tr key={concept.id}>
                    <td colSpan={5} className="px-6 py-4">
                      <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Topic</label>
                            <input
                              type="text"
                              value={form.topic}
                              onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                              className="field-dark mt-1 w-full px-3 py-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Resource Used</label>
                            <input
                              type="text"
                              value={form.resource_used}
                              onChange={(e) => setForm((f) => ({ ...f, resource_used: e.target.value }))}
                              className="field-dark mt-1 w-full px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Mastery Level</label>
                            <select
                              value={form.mastery_level}
                              onChange={(e) => setForm((f) => ({ ...f, mastery_level: e.target.value as MasteryLevel }))}
                              className="field-dark mt-1 w-full px-3 py-2 text-sm"
                            >
                              <option value="not_started">Not Started</option>
                              <option value="learning">Learning</option>
                              <option value="comfortable">Comfortable</option>
                              <option value="mastered">Mastered</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Date Studied</label>
                            <input
                              type="date"
                              value={form.date_studied}
                              onChange={(e) => setForm((f) => ({ ...f, date_studied: e.target.value }))}
                              className="field-dark mt-1 w-full px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Notes</label>
                          <textarea
                            value={form.notes}
                            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                            rows={3}
                            className="field-dark mt-1 w-full px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <Button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                          </Button>
                          <Button type="button" variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={concept.id}
                    className="transition-colors hover:bg-surface-container-highest"
                  >
                    <td className="px-6 py-4 font-semibold text-on-surface">
                      {concept.topic}
                    </td>
                    <td className="px-6 py-4 font-mono text-label-mono text-on-surface-variant">
                      {concept.resource_used || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={masteryVariants[concept.mastery_level]}>
                        {masteryLabels[concept.mastery_level]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-label-mono text-on-surface-variant">
                      {concept.date_studied}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingId(concept.id)}
                          className="rounded-lg p-1.5 text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
                          title="View Notes"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                        <button
                          onClick={() => startEdit(concept)}
                          className="rounded-lg p-1.5 text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(concept.id)}
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

      {viewingConcept && (
        <DSANotesModal
          concept={viewingConcept}
          onClose={() => setViewingId(null)}
          onEdit={() => {
            setViewingId(null);
            startEdit(viewingConcept);
          }}
          onDelete={() => {
            const id = viewingConcept.id;
            setViewingId(null);
            handleDelete(id);
          }}
        />
      )}
    </div>
  );
}
