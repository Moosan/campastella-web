import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionProps = {
  id?: string;
  title: string;
  description?: string | null | undefined;
  eyebrow?: string | null | undefined;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  title,
  description,
  eyebrow,
  actions,
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-3 text-base text-muted lg:text-lg">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex gap-3 lg:min-w-[220px] lg:justify-end">{actions}</div>
          ) : null}
        </div>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
