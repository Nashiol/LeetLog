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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or number..."
            className="w-64 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
          <select
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(e.target.value as Difficulty | "all")
            }
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
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

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium uppercase text-zinc-500">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Language</th>
              <th className="px-4 py-3">Date Solved</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Next Review</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                  No problems found.
                </td>
              </tr>
            ) : (
              filtered.map((problem) => (
                <tr
                  key={problem.id}
                  onClick={() => router.push(`/leetcode/${problem.id}`)}
                  className="cursor-pointer border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                >
                  <td className="px-4 py-3 font-mono text-zinc-700">
                    {problem.problem_number}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {problem.question}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={difficultyVariants[problem.difficulty]}>
                      {problem.difficulty}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {problem.programming_language}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {problem.date_solved}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariants[problem.status]}>
                      {statusLabels[problem.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
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
