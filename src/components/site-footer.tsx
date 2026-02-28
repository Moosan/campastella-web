import Link from "next/link";

import type { LinkCollection, SiteSettings } from "@/lib/microcms";
import { Container } from "./container";

type FooterProps = {
  settings: SiteSettings;
  linkCollections: LinkCollection[];
};

export function SiteFooter({ settings, linkCollections }: FooterProps) {
  return (
    <footer className="border-t border-card-border bg-muted/5 py-16 text-sm text-muted">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-foreground">
              {settings.title}
            </p>
            <p className="mt-4 max-w-sm text-sm">{settings.description}</p>
          </div>
          {linkCollections.map((collection) => (
            <div key={collection.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {collection.title}
              </p>
              <ul className="mt-3 space-y-2">
                {collection.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="transition hover:text-foreground"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="transition hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-card-border pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-4">
            {settings.socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-xs">
            {settings.footerNote ?? `© ${new Date().getFullYear()} Campastella`}
          </p>
        </div>
      </Container>
    </footer>
  );
}
