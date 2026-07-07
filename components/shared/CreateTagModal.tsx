"use client";

import { useState, useRef, useEffect } from "react";
import type { Tag } from "@/types";
import { ColorPicker } from "./ColorPicker";
import { Button } from "@/components/ui/Button";

export function CreateTagModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (tag: Tag) => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#EAB308");
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), color }),
    });
    if (res.ok) {
      const tag = await res.json();
      onCreated(tag);
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
      <div
        ref={ref}
        className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-low p-6 shadow-2xl"
      >
        <h3 className="mb-4 text-sm font-bold text-on-surface">Create Tag</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tag name"
            className="field-dark w-full rounded-lg px-3 py-2 text-sm"
          />
          <ColorPicker value={color} onChange={setColor} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
