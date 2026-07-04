"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

interface DueProblem {
  id: string;
  problem_number: number;
  question: string;
  difficulty: string;
  programming_language: string;
  status: string;
}

const difficultyVariants: Record<string, "green" | "yellow" | "red"> = {
  easy: "green",
  medium: "yellow",
  hard: "red",
};

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [problems, setProblems] = useState<DueProblem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/due-today")
      .then((r) => r.json())
      .then((data) => {
        setProblems(data.problems ?? []);
        setCount(data.count ?? 0);
      })
      .catch(() => {
        setProblems([]);
        setCount(0);
      })
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary-container">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-4 right-4 top-16 z-50 mt-2 rounded-xl border border-outline-variant bg-surface-container-low p-4 shadow-2xl md:absolute md:left-auto md:right-0 md:top-full md:w-100 md:max-w-[calc(100vw-2rem)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-mono text-label-caps uppercase text-on-surface-variant">Due Today</h3>
            <span className="text-sm text-on-surface-variant">{count} problem{count !== 1 ? "s" : ""}</span>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <span className="material-symbols-outlined animate-spin text-on-surface-variant">
                sync
              </span>
            </div>
          )}

          {!loading && problems.length === 0 && (
            <div className="py-8 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                check_circle
              </span>
              <p className="mt-2 text-sm text-on-surface-variant">Nothing due today!</p>
            </div>
          )}

          {!loading && problems.length > 0 && (
            <div className="space-y-2">
              {problems.map((problem) => (
                <Link
                  key={problem.id}
                  href={`/leetcode/${problem.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-surface-container-highest"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-outline-variant bg-[#222] font-mono text-label-mono text-on-surface-variant">
                    #{problem.problem_number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-on-surface">{problem.question}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <Badge variant={difficultyVariants[problem.difficulty] ?? "gray"}>
                        {problem.difficulty}
                      </Badge>
                      {problem.programming_language && (
                        <span className="font-mono text-label-mono text-on-surface-variant">
                          {problem.programming_language}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    chevron_right
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
