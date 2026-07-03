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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Problem Number
          </label>
          <input
            type="number"
            value={formData.problem_number}
            onChange={(e) => update("problem_number", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Difficulty
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => update("difficulty", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Title
        </label>
        <input
          type="text"
          value={formData.question}
          onChange={(e) => update("question", e.target.value)}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="Two Sum"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          LeetCode URL
        </label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => update("link", e.target.value)}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="https://leetcode.com/problems/two-sum/"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Language
          </label>
          <select
            value={formData.programming_language}
            onChange={(e) => update("programming_language", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Date Solved
          </label>
          <input
            type="date"
            value={formData.date_solved}
            onChange={(e) => update("date_solved", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Code Solution
        </label>
        <div className="mt-1 overflow-hidden rounded-lg border border-zinc-300">
          <MonacoEditor
            language={languageToMonaco[formData.programming_language] ?? "javascript"}
            value={formData.code_snippet}
            onChange={(val) => update("code_snippet", val ?? "")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="Approach, observations, pitfalls..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
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
    </form>
  );
}
