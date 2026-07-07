"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Tag } from "@/types";
import { CreateTagModal } from "./CreateTagModal";

export function TagSection({ onClick }: { onClick?: () => void }) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const pathname = usePathname();

  async function loadTags() {
    const res = await fetch("/api/tags");
    if (res.ok) {
      setTags(await res.json());
    }
  }

  useEffect(() => {
    loadTags();
  }, []);

  return (
    <div className="px-3 pb-2">
      <div className="mb-1 flex items-center justify-between px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Tags
        </span>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex h-5 w-5 items-center justify-center rounded text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
          aria-label="Create tag"
        >
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
      </div>
      {tags.map((tag) => {
        const isActive = pathname === `/tags/${tag.id}`;
        return (
          <Link
            key={tag.id}
            href={`/tags/${tag.id}`}
            onClick={onClick}
            className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors ${
              isActive
                ? "-ml-3 rounded-l-none border-l-[3px] border-primary bg-surface-container-high pl-[25px] font-bold text-on-surface"
                : "ml-0 font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
            }`}
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: tag.color }}
            />
            <span className="truncate">{tag.name}</span>
          </Link>
        );
      })}
      {tags.length === 0 && (
        <p className="px-4 py-2 text-xs text-on-surface-variant">
          No tags yet
        </p>
      )}
      {showCreate && (
        <CreateTagModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            loadTags();
          }}
        />
      )}
    </div>
  );
}
