"use client";

import { useMemo, useState } from "react";

import type { Cast } from "@/lib/casts";
import { cn } from "@/lib/utils";
import { CastCard } from "./cast-card";

type Props = {
  casts: Cast[];
};

export function CastShowcase({ casts }: Props) {
  const orderedCasts = useMemo(() => casts.filter(Boolean), [casts]);
  const [activeId, setActiveId] = useState<string | null>(
    orderedCasts[0]?.id ?? null,
  );
  const activeCast =
    orderedCasts.find((cast) => cast.id === activeId) ?? orderedCasts[0];

  if (!activeCast) {
    return <p className="text-sm text-muted">キャスト情報がまだありません。</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(220px,280px),1fr]">
      <div className="rounded-3xl border border-card-border bg-card p-4 shadow-card">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-accent">
          キャスト一覧
        </p>
        <ul className="space-y-2">
          {orderedCasts.map((cast) => (
            <li key={cast.id}>
              <button
                type="button"
                onClick={() => setActiveId(cast.id)}
                className={cn(
                  "w-full rounded-2xl px-4 py-3 text-left transition",
                  activeCast.id === cast.id
                    ? "bg-foreground text-background"
                    : "bg-transparent text-foreground hover:bg-muted/10",
                )}
              >
                <span className="block text-base font-semibold">{cast.name}</span>
                {cast.role ? (
                  <span
                    className={cn(
                      "text-xs font-medium",
                      activeCast.id === cast.id ? "text-background/90" : "text-muted",
                    )}
                  >
                    {cast.role}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <CastCard cast={activeCast} layout="horizontal" />
    </div>
  );
}
