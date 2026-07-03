"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ReviewRating } from "@/types";

const ratings: { value: ReviewRating; label: string; emoji: string; next: string; hover: string }[] = [
  { value: "hard", label: "Hard", emoji: "😰", next: "Review in 1 day", hover: "hover:border-[#F87171] hover:bg-[#F87171]/10" },
  { value: "medium", label: "Medium", emoji: "😐", next: "Review in 3 days", hover: "hover:border-[#FBBF24] hover:bg-[#FBBF24]/10" },
  { value: "easy", label: "Easy", emoji: "😊", next: "Review in 7 days", hover: "hover:border-[#4ADE80] hover:bg-[#4ADE80]/10" },
  { value: "very_easy", label: "Very Easy", emoji: "🚀", next: "Review in 14 days", hover: "hover:border-[#60C5FF] hover:bg-[#60C5FF]/10" },
];

export function ReviewModal({
  problemId,
  onClose,
  onComplete,
}: {
  problemId: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleRate(rating: ReviewRating) {
    setLoading(true);

    const res = await fetch(`/api/leetcode/${problemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });

    setLoading(false);

    if (res.ok) {
      onComplete();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <h3 className="text-headline-lg font-semibold text-on-surface">Log Confidence</h3>
          <button onClick={onClose} className="text-on-surface-variant transition hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">
        <p className="mb-6 text-center text-sm text-on-surface-variant">
          How difficult was this problem? This determines when you&apos;ll review it next.
        </p>

        <div className="flex flex-col gap-3">
          {ratings.map((r) => (
            <button
              key={r.value}
              onClick={() => handleRate(r.value)}
              disabled={loading}
              className={`flex w-full items-center justify-between rounded-lg border border-outline-variant p-4 text-left transition disabled:opacity-50 ${r.hover}`}
            >
              <span className="flex items-center gap-4">
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-headline-md font-semibold text-on-surface">{r.label}</span>
              </span>
              <span className="font-mono text-label-mono text-on-surface-variant">{r.next}</span>
            </button>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
