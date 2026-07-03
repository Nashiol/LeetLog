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
      <div className="hud-card rounded-xl p-8 text-center">
        <p className="text-headline-md font-semibold text-on-surface">
          Nothing due today
        </p>
        <p className="mt-1 text-sm text-on-surface-variant">
          Add a LeetCode problem to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <div
          key={problem.id}
          className="hud-card group flex flex-col gap-4 rounded-lg p-5 transition hover:border-primary/50 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-outline-variant bg-[#222222] font-mono text-label-mono text-on-surface-variant">
              #{problem.problem_number}
            </span>
            <div>
              <Link
                href={`/leetcode/${problem.id}`}
                className="text-headline-md font-semibold text-on-surface transition group-hover:text-primary"
              >
                {problem.question}
              </Link>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={difficultyVariants[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
                <span className="font-mono text-label-mono text-on-surface-variant">
                  {problem.programming_language}
                </span>
              </div>
            </div>
          </div>
          <Link
            href={`/leetcode/${problem.id}`}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-on-primary-container transition hover:brightness-110"
          >
            Review Now
          </Link>
        </div>
      ))}
    </div>
  );
}
