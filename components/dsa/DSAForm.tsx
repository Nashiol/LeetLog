"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function DSAForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    topic: "",
    resource_used: "",
    notes: "",
    mastery_level: "not_started",
    date_studied: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      body: JSON.stringify(formData),
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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Topic</label>
        <input
          type="text"
          value={formData.topic}
          onChange={(e) => update("topic", e.target.value)}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="Binary Search"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Resource Used
        </label>
        <input
          type="text"
          value={formData.resource_used}
          onChange={(e) => update("resource_used", e.target.value)}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="NeetCode, YouTube, textbook..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Mastery Level
          </label>
          <select
            value={formData.mastery_level}
            onChange={(e) => update("mastery_level", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="not_started">Not Started</option>
            <option value="learning">Learning</option>
            <option value="comfortable">Comfortable</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Date Studied
          </label>
          <input
            type="date"
            value={formData.date_studied}
            onChange={(e) => update("date_studied", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="Key concepts, patterns, observations..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
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
