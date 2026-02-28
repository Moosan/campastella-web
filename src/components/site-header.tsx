import Link from "next/link";

import type { SiteSettings } from "@/lib/microcms";
import { cn } from "@/lib/utils";
import { Container } from "./container";

type HeaderProps = {
  settings: SiteSettings;
};

export function SiteHeader({ settings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-card-border bg-background/80 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {settings.title}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          {settings.primaryLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                className={cn("transition hover:text-foreground")}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn("transition hover:text-foreground")}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
        {settings.contactFormUrl ? (
          <Link
            href={settings.contactFormUrl}
            className="inline-flex items-center rounded-full border border-transparent bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent hover:text-background"
            target="_blank"
            rel="noreferrer"
          >
            参加・お問い合わせ
          </Link>
        ) : null}
      </Container>
    </header>
  );
}
