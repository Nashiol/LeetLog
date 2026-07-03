"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ReviewRating } from "@/types";

const ratings: { value: ReviewRating; label: string; emoji: string }[] = [
  { value: "hard", label: "Hard", emoji: "😰" },
  { value: "medium", label: "Medium", emoji: "😐" },
  { value: "easy", label: "Easy", emoji: "😊" },
  { value: "very_easy", label: "Very Easy", emoji: "🚀" },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-zinc-900">
          Rate Your Recall
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          How well did you remember the solution?
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {ratings.map((r) => (
            <button
              key={r.value}
              onClick={() => handleRate(r.value)}
              disabled={loading}
              className="flex flex-col items-center gap-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium transition-colors hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-50"
            >
              <span className="text-xl">{r.emoji}</span>
              <span className="text-zinc-700">{r.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-zinc-400 underline underline-offset-2 hover:text-zinc-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
