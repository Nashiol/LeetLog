"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReviewModal } from "@/components/leetcode/ReviewModal";
import type { LeetCodeProblem } from "@/types";

const MonacoEditor = dynamic(
  () => import("@/components/ui/MonacoEditor"),
  { ssr: false }
);

const difficultyVariants = {
  easy: "green" as const,
  medium: "yellow" as const,
  hard: "red" as const,
};

const statusVariants = {
  in_progress: "gray" as const,
  due_for_review: "orange" as const,
  mastered: "green" as const,
};

const statusLabels = {
  in_progress: "In Progress",
  due_for_review: "Due for Review",
  mastered: "Mastered",
};

export function ProblemDetail({
  problem,
}: {
  problem: LeetCodeProblem;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [formData, setFormData] = useState({ ...problem });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    const res = await fetch(`/api/leetcode/${problem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problem_number: formData.problem_number,
        question: formData.question,
        link: formData.link,
        difficulty: formData.difficulty,
        programming_language: formData.programming_language,
        code_snippet: formData.code_snippet,
        notes: formData.notes,
        date_solved: formData.date_solved,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to update.");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this problem?")) return;

    const res = await fetch(`/api/leetcode/${problem.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/leetcode");
      router.refresh();
    }
  }

  function handleReviewComplete() {
    setShowReview(false);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="max-w-2xl space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Problem Number</label>
            <input
              type="number"
              value={formData.problem_number}
              onChange={(e) => update("problem_number", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => update("difficulty", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Title</label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) => update("question", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">URL</label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => update("link", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Language</label>
            <select
              value={formData.programming_language}
              onChange={(e) => update("programming_language", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              <option>JavaScript</option>
              <option>TypeScript</option>
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
              <option>Go</option>
              <option>Rust</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Date Solved</label>
            <input
              type="date"
              value={formData.date_solved}
              onChange={(e) => update("date_solved", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Code</label>
          <div className="mt-1 overflow-hidden rounded-lg border border-zinc-300">
            <MonacoEditor
              language={formData.programming_language.toLowerCase()}
              value={formData.code_snippet}
              onChange={(val) => update("code_snippet", val ?? "")}
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
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-zinc-400">
              #{problem.problem_number}
            </span>
            <Badge variant={difficultyVariants[problem.difficulty]}>
              {problem.difficulty}
            </Badge>
            <Badge variant={statusVariants[problem.status]}>
              {statusLabels[problem.status]}
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900">
            {problem.question}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-xl border border-zinc-200 bg-white p-4">
        <div>
          <p className="text-xs font-medium uppercase text-zinc-400">Language</p>
          <p className="mt-1 text-sm text-zinc-900">
            {problem.programming_language}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-zinc-400">Date Solved</p>
          <p className="mt-1 text-sm text-zinc-900">{problem.date_solved}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-zinc-400">Next Review</p>
          <p className="mt-1 text-sm text-zinc-900">
            {problem.next_review_date}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase text-zinc-400">Link</p>
        <a
          href={problem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-sm text-zinc-900 underline underline-offset-2 hover:text-zinc-600"
        >
          {problem.link}
        </a>
      </div>

      {problem.code_snippet && (
        <div>
          <p className="text-xs font-medium uppercase text-zinc-400">Code Solution</p>
          <div className="mt-1 overflow-hidden rounded-lg border border-zinc-300">
            <MonacoEditor
              language={problem.programming_language.toLowerCase()}
              value={problem.code_snippet}
              options={{ readOnly: true }}
            />
          </div>
        </div>
      )}

      {problem.notes && (
        <div>
          <p className="text-xs font-medium uppercase text-zinc-400">Notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">
            {problem.notes}
          </p>
        </div>
      )}

      {problem.status === "due_for_review" && (
        <Button onClick={() => setShowReview(true)}>
          Review Now
        </Button>
      )}

      {showReview && (
        <ReviewModal
          problemId={problem.id}
          onClose={() => setShowReview(false)}
          onComplete={handleReviewComplete}
        />
      )}
    </div>
  );
}
