"use client";

import { FileWarning, VideoOff } from "lucide-react";

const ICONS = {
  session: VideoOff,
  document: FileWarning,
};

export default function LiveRoutePlaceholder({
  title,
  description,
  routeId,
  kind = "document",
}) {
  const Icon = ICONS[kind] || FileWarning;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-[32px] border border-zinc-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-zinc-100 text-zinc-500">
          <Icon className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-zinc-900">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-500">{description}</p>
        <div className="mt-8 inline-flex rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700">
          Route ID: {routeId || "Unknown"}
        </div>
      </div>
    </div>
  );
}
