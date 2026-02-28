import Link from "next/link";

import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { buildMetadata } from "@/components/seo";
import { fetchPageBySlug } from "@/lib/microcms";

export const metadata = buildMetadata({
  title: "参加方法",
  path: "/about",
});

export default async function AboutPage() {
  const page = await fetchPageBySlug("about");

  return (
    <Section
      title={page?.title ?? "Campastella について"}
      description={page?.intro}
      eyebrow="About"
    >
      <div className="grid gap-8 md:grid-cols-3">
        {page?.sections.map((section) => (
          <article
            key={section.heading}
            className="rounded-3xl border border-card-border bg-card p-6 shadow-card"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {section.heading}
            </p>
            <p className="mt-4 text-sm text-muted">{section.body}</p>
          </article>
        )) ?? (
          <p className="text-sm text-muted">
            CMS との接続が完了すると、参加方法が自動的に表示されます。
          </p>
        )}
      </div>
      <Container className="mt-12">
        <Link
          href={page?.intro ? "/other" : "/casts"}
          className="text-sm font-semibold text-foreground transition hover:text-accent"
        >
          {page?.intro ? "その他の取り組みを見る" : "キャスト一覧へ"} →
        </Link>
      </Container>
    </Section>
  );
}
