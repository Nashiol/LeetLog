"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TagBadge } from "@/components/shared/TagBadge";
import type { Tag } from "@/types";

interface TaggedItem {
  id: string;
  question?: string;
  topic?: string;
  problem_number?: number;
  company?: string;
  date_solved?: string;
  date_created?: string;
  difficulty?: string;
}

const sectionMeta: Record<string, { label: string; href: (id: string) => string; icon: string }> = {
  leetcode: { label: "LeetCode", href: (id) => `/leetcode/${id}`, icon: "code" },
  dsa: { label: "DSA", href: (id) => `/dsa`, icon: "account_tree" },
  interview: { label: "Interview", href: (id) => `/interview`, icon: "question_answer" },
  coding: { label: "Coding", href: (id) => `/coding`, icon: "terminal" },
  system_design: { label: "System Design", href: (id) => `/system-design`, icon: "schema" },
};

export default function TagDetailPage() {
  const params = useParams<{ id: string }>();
  const [tag, setTag] = useState<Tag | null>(null);
  const [items, setItems] = useState<{ type: string; data: TaggedItem }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/tags/${params.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setTag(data.tag);
          setItems(data.items);
        }
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="hud-card rounded-xl p-8 text-center">
        <p className="text-body-lg text-on-surface-variant">Tag not found.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-primary underline underline-offset-2">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const groupedItems: Record<string, TaggedItem[]> = {};
  for (const metaKey of Object.keys(sectionMeta)) {
    groupedItems[metaKey] = [];
  }
  for (const item of items) {
    if (!groupedItems[item.type]) groupedItems[item.type] = [];
    groupedItems[item.type].push(item.data);
  }

  const hasItems = Object.values(groupedItems).some((g) => g.length > 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-highest hover:text-on-surface"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <TagBadge tag={tag} />
            <span className="font-mono text-label-mono text-on-surface-variant">
              {items.length} item{items.length === 1 ? "" : "s"}
            </span>
          </div>
          <h1 className="text-display font-bold tracking-tight text-on-surface mt-2">
            {tag.name}
          </h1>
        </div>
      </div>

      {!hasItems && (
        <div className="hud-card rounded-xl p-8 text-center">
          <p className="text-body-lg text-on-surface-variant">
            No items tagged with &ldquo;{tag.name}&rdquo; yet.
          </p>
        </div>
      )}

      {Object.entries(groupedItems).map(([type, typeItems]) => {
        if (typeItems.length === 0) return null;
        const meta = sectionMeta[type];
        return (
          <section key={type}>
            <div className="mb-4 flex items-center gap-2 border-b border-outline-variant pb-3">
              <span className="material-symbols-outlined text-primary">{meta.icon}</span>
              <h2 className="text-headline-lg font-semibold text-on-surface">{meta.label}</h2>
              <span className="font-mono text-label-mono text-on-surface-variant">({typeItems.length})</span>
            </div>
            <div className="space-y-2">
              {typeItems.map((item) => (
                <Link
                  key={item.id}
                  href={meta.href(item.id)}
                  className="hud-card flex items-center justify-between rounded-lg px-5 py-4 transition hover:border-primary/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {type === "leetcode" && item.problem_number && (
                      <span className="font-mono text-label-mono text-on-surface-variant shrink-0">
                        #{item.problem_number}
                      </span>
                    )}
                    <span className="font-medium text-on-surface truncate">
                      {item.question ?? item.topic ?? "Untitled"}
                    </span>
                    {type === "system_design" && item.company && (
                      <span className="rounded bg-tertiary-container/30 px-2 py-0.5 font-mono text-label-mono text-tertiary-container shrink-0">
                        {item.company}
                      </span>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant shrink-0 ml-2">
                    chevron_right
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
