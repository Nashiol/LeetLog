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
      <div className="hud-card max-w-3xl space-y-5 rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Problem Number</label>
            <input
              type="number"
              value={formData.problem_number}
              onChange={(e) => update("problem_number", e.target.value)}
              className="field-dark mt-1 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => update("difficulty", e.target.value)}
              className="field-dark mt-1 px-3 py-2.5 text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Title</label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) => update("question", e.target.value)}
            className="field-dark mt-1 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">URL</label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => update("link", e.target.value)}
            className="field-dark mt-1 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Language</label>
            <select
              value={formData.programming_language}
              onChange={(e) => update("programming_language", e.target.value)}
              className="field-dark mt-1 px-3 py-2.5 text-sm"
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
            <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Date Solved</label>
            <input
              type="date"
              value={formData.date_solved}
              onChange={(e) => update("date_solved", e.target.value)}
              className="field-dark mt-1 px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Code</label>
          <div className="mt-1 overflow-hidden rounded-lg border border-outline-variant bg-[#050505]">
            <MonacoEditor
              language={formData.programming_language.toLowerCase()}
              value={formData.code_snippet}
              onChange={(val) => update("code_snippet", val ?? "")}
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={4}
            className="field-dark mt-1 px-3 py-2.5 text-sm"
          />
        </div>

        {error && <p className="text-sm text-[#F87171]">{error}</p>}

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
    <div className="grid grid-cols-1 gap-card-gap xl:grid-cols-12">
      <div className="space-y-6 xl:col-span-7">
      <div className="hud-card relative overflow-hidden rounded-lg p-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-label-mono text-on-surface-variant">
              #{problem.problem_number}
            </span>
            <Badge variant={difficultyVariants[problem.difficulty]}>
              {problem.difficulty}
            </Badge>
            <Badge variant={statusVariants[problem.status]}>
              {statusLabels[problem.status]}
            </Badge>
          </div>
          <h1 className="mt-3 text-headline-lg font-semibold text-on-surface">
            {problem.question}
          </h1>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="font-mono text-label-caps uppercase text-on-surface-variant">Language</p>
          <p className="mt-1 text-sm text-on-surface">
            {problem.programming_language}
          </p>
        </div>
        <div>
          <p className="font-mono text-label-caps uppercase text-on-surface-variant">Date Solved</p>
          <p className="mt-1 text-sm text-on-surface">{problem.date_solved}</p>
        </div>
        <div>
          <p className="font-mono text-label-caps uppercase text-on-surface-variant">Next Review</p>
          <p className="mt-1 text-sm text-on-surface">
            {problem.next_review_date}
          </p>
        </div>
      </div>

      <div className="hud-card rounded-lg p-5">
        <p className="font-mono text-label-caps uppercase text-on-surface-variant">Link</p>
        <a
          href={problem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block break-all font-mono text-label-mono text-tertiary-container underline underline-offset-2 hover:text-tertiary"
        >
          {problem.link}
        </a>
      </div>
      </div>

      {problem.code_snippet && (
        <div className="xl:col-span-5 xl:row-span-3">
          <p className="mb-2 font-mono text-label-caps uppercase text-on-surface-variant">Code Solution</p>
          <div className="overflow-hidden rounded-lg border border-outline-variant bg-[#050505]">
            <MonacoEditor
              height="600px"
              language={problem.programming_language.toLowerCase()}
              value={problem.code_snippet}
              options={{ readOnly: true }}
            />
          </div>
        </div>
      )}

      {problem.notes && (
        <div className="hud-card rounded-lg p-5">
          <p className="font-mono text-label-caps uppercase text-on-surface-variant">Notes</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-on-surface-variant">
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
