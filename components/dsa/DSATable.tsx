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
          className="field-dark w-auto px-3 py-2 text-sm"
        >
          <option value="all">All Levels</option>
          <option value="not_started">Not Started</option>
          <option value="learning">Learning</option>
          <option value="comfortable">Comfortable</option>
          <option value="mastered">Mastered</option>
        </select>
        <Button onClick={() => router.push("/dsa/new")}>Add Concept</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-lowest/50 text-left font-mono text-label-caps uppercase text-on-surface-variant">
              <th className="px-6 py-4">Topic</th>
              <th className="px-6 py-4">Resource Used</th>
              <th className="px-6 py-4">Mastery Level</th>
              <th className="px-6 py-4">Date Studied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                  No DSA concepts found.
                </td>
              </tr>
            ) : (
              filtered.map((concept) => (
                <tr
                  key={concept.id}
                  className="transition-colors hover:bg-surface-container-highest"
                >
                  <td className="px-6 py-4 font-semibold text-on-surface">
                    {concept.topic}
                  </td>
                  <td className="px-6 py-4 font-mono text-label-mono text-on-surface-variant">
                    {concept.resource_used || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={masteryVariants[concept.mastery_level]}>
                      {masteryLabels[concept.mastery_level]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-mono text-label-mono text-on-surface-variant">
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
