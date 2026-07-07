"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { Tag } from "@/types";
import { TagPicker } from "@/components/shared/TagPicker";

export function DSAForm() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagId, setTagId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    topic: "",
    resource_used: "",
    notes: "",
    mastery_level: "not_started",
    date_studied: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/tags").then((r) => r.ok ? r.json() : []).then(setTags);
  }, []);

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!formData.topic) {
      setError("Topic is required.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/dsa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, tag_id: tagId }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create concept.");
      return;
    }

    router.push("/dsa");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="hud-card max-w-2xl space-y-5 rounded-lg p-6">
      <div>
        <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Topic</label>
        <input
          type="text"
          value={formData.topic}
          onChange={(e) => update("topic", e.target.value)}
          className="field-dark mt-1 px-3 py-2.5 text-sm"
          placeholder="Binary Search"
        />
      </div>

      <div>
        <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
          Resource Used
        </label>
        <input
          type="text"
          value={formData.resource_used}
          onChange={(e) => update("resource_used", e.target.value)}
          className="field-dark mt-1 px-3 py-2.5 text-sm"
          placeholder="NeetCode, YouTube, textbook..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
            Mastery Level
          </label>
          <select
            value={formData.mastery_level}
            onChange={(e) => update("mastery_level", e.target.value)}
            className="field-dark mt-1 px-3 py-2.5 text-sm"
          >
            <option value="not_started">Not Started</option>
            <option value="learning">Learning</option>
            <option value="comfortable">Comfortable</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>
        <div>
          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
            Date Studied
          </label>
          <input
            type="date"
            value={formData.date_studied}
            onChange={(e) => update("date_studied", e.target.value)}
            className="field-dark mt-1 px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Tag</label>
        <TagPicker
          value={tagId}
          onChange={setTagId}
          tags={tags}
          onTagsChange={() => fetch("/api/tags").then((r) => r.ok ? r.json() : []).then(setTags)}
        />
      </div>

      <div>
        <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={4}
          className="field-dark mt-1 px-3 py-2.5 text-sm"
          placeholder="Key concepts, patterns, observations..."
        />
      </div>

      {error && <p className="text-sm text-[#F87171]">{error}</p>}

      <div className="flex items-center gap-3 border-t border-outline-variant pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Concept"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
