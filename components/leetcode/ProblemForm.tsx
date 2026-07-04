"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";

const MonacoEditor = dynamic(
  () => import("@/components/ui/MonacoEditor"),
  { ssr: false }
);

const languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "Ruby",
  "C#",
  "Swift",
  "Kotlin",
  "PHP",
  "Scala",
  "Dart",
];

const languageToMonaco: Record<string, string> = {
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  Java: "java",
  "C++": "cpp",
  Go: "go",
  Rust: "rust",
  Ruby: "ruby",
  "C#": "csharp",
  Swift: "swift",
  Kotlin: "kotlin",
  PHP: "php",
  Scala: "scala",
  Dart: "dart",
};

export function ProblemForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    problem_number: "",
    question: "",
    link: "",
    difficulty: "easy" as string,
    programming_language: "JavaScript",
    code_snippet: "",
    notes: "",
    date_solved: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!formData.problem_number || !formData.question || !formData.link) {
      setError("Problem number, title, and link are required.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/leetcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        problem_number: parseInt(formData.problem_number, 10),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create problem.");
      return;
    }

    router.push("/leetcode");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 items-start gap-card-gap xl:grid-cols-12">
      <div className="hud-card space-y-5 rounded-lg p-6 xl:col-span-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
            Problem Number
          </label>
          <input
            type="number"
            value={formData.problem_number}
            onChange={(e) => update("problem_number", e.target.value)}
            className="field-dark mt-1 px-3 py-2.5 font-mono text-label-mono"
            placeholder="1"
          />
        </div>
        <div>
          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
            Difficulty
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => update("difficulty", e.target.value)}
            className="field-dark mt-1 px-3 py-2.5 text-sm"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
          Title
        </label>
        <input
          type="text"
          value={formData.question}
          onChange={(e) => update("question", e.target.value)}
          className="field-dark mt-1 px-3 py-2.5 text-sm"
          placeholder="Two Sum"
        />
      </div>

      <div>
        <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
          LeetCode URL
        </label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => update("link", e.target.value)}
          className="field-dark mt-1 px-3 py-2.5 text-sm"
          placeholder="https://leetcode.com/problems/two-sum/"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
            Language
          </label>
          <select
            value={formData.programming_language}
            onChange={(e) => update("programming_language", e.target.value)}
            className="field-dark mt-1 px-3 py-2.5 text-sm"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
            Date Solved
          </label>
          <input
            type="date"
            value={formData.date_solved}
            onChange={(e) => update("date_solved", e.target.value)}
            className="field-dark mt-1 px-3 py-2.5 font-mono text-label-mono"
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-label-caps uppercase text-on-surface-variant">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={4}
          className="field-dark mt-1 px-3 py-2.5 text-sm"
          placeholder="Approach, observations, pitfalls..."
        />
      </div>

      {error && <p className="text-sm text-[#F87171]">{error}</p>}

      <div className="flex items-center gap-3 border-t border-outline-variant pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Problem"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-outline-variant bg-[#050505] xl:col-span-7">
        <div className="flex items-center justify-between border-b border-outline-variant bg-[#111111] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
            <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
            <span className="h-3 w-3 rounded-full bg-[#10B981]" />
          </div>
          <div className="rounded bg-surface-container-low px-3 py-1 font-mono text-xs text-on-surface-variant">
            solution.{languageToMonaco[formData.programming_language] ?? "js"}
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">code</span>
        </div>
        <MonacoEditor
          height="400px"
          className="md:min-h-[600px]"
          language={languageToMonaco[formData.programming_language] ?? "javascript"}
          value={formData.code_snippet}
          onChange={(val) => update("code_snippet", val ?? "")}
        />
      </div>
    </form>
  );
}
