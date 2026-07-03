import { DSAForm } from "@/components/dsa/DSAForm";

export default function NewDSAPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-headline-lg font-semibold text-on-surface">Add DSA Concept</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Capture a study session and mark your current mastery level.</p>
      </div>
      <DSAForm />
    </div>
  );
}
