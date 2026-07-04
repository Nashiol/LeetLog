"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { LeetCodeProblem, Difficulty, ProblemStatus } from "@/types";

const difficultyVariants: Record<Difficulty, "green" | "yellow" | "red"> = {
  easy: "green",
  medium: "yellow",
  hard: "red",
};

const statusVariants: Record<ProblemStatus, "gray" | "orange" | "green"> = {
  in_progress: "gray",
  due_for_review: "orange",
  mastered: "green",
};

const statusLabels: Record<ProblemStatus, string> = {
  in_progress: "In Progress",
  due_for_review: "Due for Review",
  mastered: "Mastered",
};

export function ProblemTable({
  problems,
}: {
  problems: LeetCodeProblem[];
}) {
  const router = useRouter();
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">(
    "all"
  );
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (difficultyFilter !== "all" && p.difficulty !== difficultyFilter) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.question.toLowerCase().includes(q) &&
          !String(p.problem_number).includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [problems, difficultyFilter, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or number..."
            className="field-dark h-10 w-full px-3 py-2 text-sm sm:w-72"
          />
          <select
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(e.target.value as Difficulty | "all")
            }
            className="field-dark h-10 px-3 py-2 text-sm"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <Button onClick={() => router.push("/leetcode/new")}>
          Add Problem
        </Button>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 sm:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-6 py-12 text-center text-on-surface-variant">
            No problems found.
          </div>
        ) : (
          filtered.map((problem) => (
            <button
              key={problem.id}
              onClick={() => router.push(`/leetcode/${problem.id}`)}
              className="hud-card w-full rounded-xl p-4 text-left transition hover:border-primary/50"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-label-mono text-on-surface-variant">
                  #{problem.problem_number}
                </span>
                <Badge variant={difficultyVariants[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-on-surface leading-snug">
                {problem.question}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-label-mono text-on-surface-variant">
                <span>{problem.programming_language}</span>
                <span>{problem.date_solved}</span>
                <Badge variant={statusVariants[problem.status]}>
                  {statusLabels[problem.status]}
                </Badge>
                <span>Review: {problem.next_review_date}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-lowest/50 font-mono text-label-caps uppercase text-on-surface-variant">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Language</th>
              <th className="px-6 py-4">Date Solved</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Next Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-mono text-label-mono">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                  No problems found.
                </td>
              </tr>
            ) : (
              filtered.map((problem) => (
                <tr
                  key={problem.id}
                  onClick={() => router.push(`/leetcode/${problem.id}`)}
                  className="group cursor-pointer transition-colors hover:bg-surface-container-highest"
                >
                  <td className="px-6 py-4 text-on-surface-variant">
                    {problem.problem_number}
                  </td>
                  <td className="px-6 py-4 font-sans text-sm font-semibold text-on-surface transition group-hover:text-primary">
                    {problem.question}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={difficultyVariants[problem.difficulty]}>
                      {problem.difficulty}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-on-surface">
                    {problem.programming_language}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    {problem.date_solved}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariants[problem.status]}>
                      {statusLabels[problem.status]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    {problem.next_review_date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
