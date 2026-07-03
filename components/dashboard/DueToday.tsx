"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { LeetCodeProblem } from "@/types";

const difficultyVariants = {
  easy: "green" as const,
  medium: "yellow" as const,
  hard: "red" as const,
};

export function DueToday({ problems }: { problems: LeetCodeProblem[] }) {
  if (problems.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
        <p className="text-lg font-medium text-zinc-500">
          Nothing due today
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          Add a LeetCode problem to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {problems.map((problem) => (
        <div
          key={problem.id}
          className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-zinc-400">
              #{problem.problem_number}
            </span>
            <div>
              <Link
                href={`/leetcode/${problem.id}`}
                className="font-medium text-zinc-900 hover:underline"
              >
                {problem.question}
              </Link>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={difficultyVariants[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
                <span className="text-xs text-zinc-400">
                  {problem.programming_language}
                </span>
              </div>
            </div>
          </div>
          <Link
            href={`/leetcode/${problem.id}`}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Review Now
          </Link>
        </div>
      ))}
    </div>
  );
}
