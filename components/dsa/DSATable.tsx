"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { DSAConcept, MasteryLevel } from "@/types";

const masteryVariants: Record<MasteryLevel, "gray" | "blue" | "yellow" | "green"> = {
  not_started: "gray",
  learning: "blue",
  comfortable: "yellow",
  mastered: "green",
};

const masteryLabels: Record<MasteryLevel, string> = {
  not_started: "Not Started",
  learning: "Learning",
  comfortable: "Comfortable",
  mastered: "Mastered",
};

export function DSATable({ concepts }: { concepts: DSAConcept[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<MasteryLevel | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return concepts;
    return concepts.filter((c) => c.mastery_level === filter);
  }, [concepts, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as MasteryLevel | "all")}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        >
          <option value="all">All Levels</option>
          <option value="not_started">Not Started</option>
          <option value="learning">Learning</option>
          <option value="comfortable">Comfortable</option>
          <option value="mastered">Mastered</option>
        </select>
        <Button onClick={() => router.push("/dsa/new")}>Add Concept</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium uppercase text-zinc-500">
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Resource Used</th>
              <th className="px-4 py-3">Mastery Level</th>
              <th className="px-4 py-3">Date Studied</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-zinc-400">
                  No DSA concepts found.
                </td>
              </tr>
            ) : (
              filtered.map((concept) => (
                <tr
                  key={concept.id}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {concept.topic}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {concept.resource_used || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={masteryVariants[concept.mastery_level]}>
                      {masteryLabels[concept.mastery_level]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {concept.date_studied}
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
