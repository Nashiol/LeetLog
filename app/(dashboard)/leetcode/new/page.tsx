import { ProblemForm } from "@/components/leetcode/ProblemForm";

export default function NewLeetCodePage() {
  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-headline-lg font-semibold text-on-surface">Log New Submission</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Record your progress, optimal solution, and learnings.</p>
        </div>
        <div className="hidden rounded border border-outline-variant bg-surface-container-low px-3 py-1 font-mono text-label-mono text-on-surface-variant sm:block">
          Status: <span className="text-primary">Draft</span>
        </div>
      </div>
      <ProblemForm />
    </div>
  );
}
