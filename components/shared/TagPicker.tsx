"use client";

import { useState, useRef, useEffect } from "react";
import type { Tag } from "@/types";
import { TagBadge } from "./TagBadge";
import { CreateTagModal } from "./CreateTagModal";

export function TagPicker({
  value,
  onChange,
  tags,
  onTagsChange,
}: {
  value: string | null;
  onChange: (tagId: string | null) => void;
  tags: Tag[];
  onTagsChange: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedTag = tags.find((t) => t.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="field-dark flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm"
      >
        {selectedTag ? (
          <TagBadge tag={selectedTag} />
        ) : (
          <span className="text-on-surface-variant">No tag</span>
        )}
        <span className="material-symbols-outlined ml-2 text-sm text-on-surface-variant">
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-outline-variant bg-surface-container-low p-2 shadow-2xl">
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface-container-highest ${
              value === null ? "text-primary font-bold" : "text-on-surface-variant"
            }`}
          >
            None
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => {
                onChange(tag.id);
                setOpen(false);
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface-container-highest ${
                value === tag.id ? "text-primary font-bold" : ""
              }`}
            >
              <TagBadge tag={tag} />
            </button>
          ))}
          <div className="mt-1 border-t border-outline-variant pt-1">
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Create tag
            </button>
          </div>
        </div>
      )}

      {showCreate && (
        <CreateTagModal
          onClose={() => setShowCreate(false)}
          onCreated={(tag) => {
            onChange(tag.id);
            setShowCreate(false);
            onTagsChange();
          }}
        />
      )}
    </div>
  );
}
