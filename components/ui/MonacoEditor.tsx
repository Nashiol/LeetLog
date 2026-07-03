"use client";

import dynamic from "next/dynamic";
import { type ComponentProps } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-lg border border-outline-variant bg-[#050505] font-mono text-label-mono text-on-surface-variant">
      Loading editor...
    </div>
  ),
});

type MonacoEditorProps = ComponentProps<typeof Editor>;

export default function MonacoEditor(props: MonacoEditorProps) {
  return (
    <Editor
      height="320px"
      defaultLanguage="javascript"
      theme="vs-dark"
      {...props}
    />
  );
}
