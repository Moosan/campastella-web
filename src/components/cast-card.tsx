"use client";

import Image from "next/image";
import Link from "next/link";

import type { Cast } from "@/lib/casts";
import { cn } from "@/lib/utils";

type Props = {
  cast: Cast;
  layout?: "vertical" | "horizontal";
};

export function CastCard({ cast, layout = "vertical" }: Props) {
  const { thumbnail } = cast;

  return (
    <article
      className={cn(
        "group rounded-3xl border border-card-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-card-hover",
        layout === "horizontal"
          ? "flex flex-col gap-6 p-6 sm:flex-row sm:items-center"
          : "flex flex-col",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl",
          layout === "horizontal" ? "h-48 w-full sm:w-56" : "aspect-[4/5]",
        )}
      >
        <Image
          src={thumbnail.url}
          alt={thumbnail.alt ?? `${cast.name} portrait`}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-6 sm:px-0 sm:pb-0">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
          {cast.tags.slice(0, 2).join(" / ")}
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{cast.name}</h3>
          {cast.role ? (
            <p className="text-sm font-medium text-muted">{cast.role}</p>
          ) : null}
        </div>
        {cast.introduction ? (
          <p className="text-sm text-muted">{cast.introduction}</p>
        ) : null}
        <div className="mt-auto">
          <Link
            href={`/casts/${cast.slug}`}
            className="inline-flex items-center text-sm font-semibold text-foreground transition hover:text-accent"
          >
            詳細を見る
            <span aria-hidden className="ml-2">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
