"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

interface LeetCodeResult {
  id: string;
  problem_number: number;
  question: string;
  difficulty: string;
  status: string;
}

interface DSAResult {
  id: string;
  topic: string;
  mastery_level: string;
}

interface InterviewResult {
  id: string;
  question: string;
}

interface CodingResult {
  id: string;
  question: string;
  date_created: string;
}

interface SystemDesignResult {
  id: string;
  question: string;
  company: string;
}

interface SearchResults {
  leetcode: LeetCodeResult[];
  dsa: DSAResult[];
  interview: InterviewResult[];
  coding: CodingResult[];
  systemDesign: SystemDesignResult[];
}

const difficultyVariants: Record<string, "green" | "yellow" | "red"> = {
  easy: "green",
  medium: "yellow",
  hard: "red",
};

const categoryConfig = [
  { key: "leetcode", label: "LeetCode Problems", icon: "code", color: "text-primary" },
  { key: "dsa", label: "DSA Concepts", icon: "account_tree", color: "text-tertiary" },
  { key: "interview", label: "Interview Questions", icon: "question_answer", color: "text-primary" },
  { key: "coding", label: "Coding Questions", icon: "terminal", color: "text-tertiary" },
  { key: "systemDesign", label: "System Design", icon: "schema", color: "text-primary" },
] as const;

export function SearchDropdown() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 1) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length === 0) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

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

  const hasResults = results && Object.values(results).some((arr) => arr.length > 0);

  function handleSelect() {
    setOpen(false);
    setQuery("");
    setResults(null);
    inputRef.current?.blur();
  }

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
        search
      </span>
      <input
        ref={inputRef}
        type="search"
        placeholder="Search problems, notes..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim().length > 0) setOpen(true);
        }}
        className="field-dark h-10 w-72 pl-10 pr-4 font-mono text-label-mono"
      />

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[480px] rounded-xl border border-outline-variant bg-surface-container-low p-2 shadow-2xl">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <span className="material-symbols-outlined animate-spin text-on-surface-variant">
                sync
              </span>
              <span className="ml-2 text-sm text-on-surface-variant">Searching...</span>
            </div>
          )}

          {!loading && hasResults && (
            <div className="space-y-1">
              {categoryConfig.map((cat) => {
                const items = results[cat.key as keyof SearchResults];
                if (!items || items.length === 0) return null;

                return (
                  <div key={cat.key}>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span className={`material-symbols-outlined text-sm ${cat.color}`}>
                        {cat.icon}
                      </span>
                      <span className="font-mono text-label-caps uppercase text-on-surface-variant">
                        {cat.label}
                      </span>
                    </div>
                    {items.map((item: any) => (
                      <Link
                        key={item.id}
                        href={
                          cat.key === "leetcode"
                            ? `/leetcode/${item.id}`
                            : `/${cat.key === "systemDesign" ? "system-design" : cat.key}`
                        }
                        onClick={handleSelect}
                        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition hover:bg-surface-container-highest"
                      >
                        {cat.key === "leetcode" && (
                          <>
                            <span className="font-mono text-label-mono text-on-surface-variant">
                              #{item.problem_number}
                            </span>
                            <span className="flex-1 truncate text-on-surface">{item.question}</span>
                            <Badge variant={difficultyVariants[item.difficulty] ?? "gray"}>
                              {item.difficulty}
                            </Badge>
                          </>
                        )}
                        {cat.key === "dsa" && (
                          <>
                            <span className="flex-1 truncate text-on-surface">{item.topic}</span>
                            <span className="font-mono text-label-mono text-on-surface-variant">
                              {item.mastery_level}
                            </span>
                          </>
                        )}
                        {cat.key === "interview" && (
                          <span className="flex-1 truncate text-on-surface">{item.question}</span>
                        )}
                        {cat.key === "coding" && (
                          <>
                            <span className="flex-1 truncate text-on-surface">{item.question}</span>
                            <span className="font-mono text-label-mono text-on-surface-variant">
                              {item.date_created}
                            </span>
                          </>
                        )}
                        {cat.key === "systemDesign" && (
                          <>
                            <span className="flex-1 truncate text-on-surface">{item.question}</span>
                            {item.company && (
                              <span className="font-mono text-label-mono text-primary">
                                {item.company}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {!loading && !hasResults && query.trim().length > 0 && (
            <div className="py-8 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                search_off
              </span>
              <p className="mt-2 text-sm text-on-surface-variant">No results found for &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
