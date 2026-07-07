"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { CodingQuestion, Tag } from "@/types";
import { TagBadge } from "@/components/shared/TagBadge";

export function CodingNotesModal({
  question,
  onClose,
  onEdit,
  onDelete,
}: {
  question: CodingQuestion;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/tags").then((r) => r.ok ? r.json() : []).then(setTags);
  }, []);

  const tagMap = Object.fromEntries(tags.map((t) => [t.id, t]));

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
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-headline-lg font-semibold text-on-surface truncate">
                {question.question}
              </h2>
              {question.tag_id && tagMap[question.tag_id] && (
                <TagBadge tag={tagMap[question.tag_id]} />
              )}
            </div>
            {question.repository_link && (
              <a
                href={question.repository_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm text-primary underline underline-offset-2 hover:text-primary-hover"
              >
                <span className="material-symbols-outlined text-base">link</span>
                {question.repository_link}
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-lg p-1 text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-mono text-label-caps uppercase text-on-surface-variant">Date Created</p>
            <p className="mt-1 text-sm text-on-surface">{question.date_created}</p>
          </div>

          {question.notes && (
            <div>
              <p className="font-mono text-label-caps uppercase text-on-surface-variant">Notes</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-on-surface">
                {question.notes}
              </p>
            </div>
          )}

          {!question.notes && (
            <div className="py-4 text-center">
              <p className="text-sm text-on-surface-variant">No notes for this question.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-outline-variant pt-4">
          <Button onClick={onEdit}>Edit</Button>
          <Button variant="danger" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
