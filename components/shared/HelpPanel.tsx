"use client";

import { useRef, useEffect } from "react";

const helpSections = [
  {
    icon: "code",
    title: "LeetCode Problems",
    steps: [
      'Go to LeetCode tab and click "Add Problem".',
      "Fill in the problem number, title, link, difficulty, and your solution code.",
      "The Spaced Repetition System (SM-2) schedules your first review for the next day.",
      "When a problem is due, click \"Review Now\" and rate your confidence (Hard → Very Easy).",
      "After 4 successful reviews, the problem is marked as Mastered.",
    ],
  },
  {
    icon: "account_tree",
    title: "DSA Concepts",
    steps: [
      'Go to DSA tab and click "Add Concept".',
      "Enter the topic (e.g., Binary Search, Dynamic Programming) and the resource used.",
      'Set your current mastery level: Not Started → Learning → Comfortable → Mastered.',
      "Use the Notes field to capture key insights and patterns.",
    ],
  },
  {
    icon: "question_answer",
    title: "Interview Questions",
    steps: [
      'Go to Interview Questions tab and click "Add Question".',
      "Type the behavioral or technical question and your model answer.",
      'Use the STAR method (Situation, Task, Action, Result) for behavioral answers.',
      'Click on a question card to expand it and reveal the answer.',
    ],
  },
  {
    icon: "terminal",
    title: "Coding Questions",
    steps: [
      'Go to Coding Questions tab and click "Add Coding Question".',
      "Describe the challenge and link to your GitHub repository with the solution.",
      "Track lessons learned and improvements in the Notes field.",
    ],
  },
  {
    icon: "schema",
    title: "System Design",
    steps: [
      'Go to System Design tab and click "Add Question".',
      "Enter the design prompt and tag it with the company that asked it.",
      "Structure your answer around functional requirements, non-functional requirements, high-level design, and deep dive.",
      'Click on a question card to expand it and reveal the full answer.',
    ],
  },
];

export function HelpPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        ref={panelRef}
        className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-outline-variant bg-surface-container-low p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">help_outline</span>
            <h2 className="text-headline-lg font-semibold text-on-surface">Help & Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
            aria-label="Close help"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-6">
          {helpSections.map((section) => (
            <div key={section.title}>
              <div className="mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">{section.icon}</span>
                <h3 className="text-sm font-semibold text-on-surface">{section.title}</h3>
              </div>
              <ol className="ml-7 space-y-1.5 list-outside list-decimal">
                {section.steps.map((step, i) => (
                  <li key={i} className="text-sm leading-relaxed text-on-surface-variant">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-outline-variant pt-4">
          <p className="text-center text-xs text-on-surface-variant">
            LeetLog v1.0 — Built with Next.js + Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
