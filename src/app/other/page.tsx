import { Section } from "@/components/section";
import { buildMetadata } from "@/components/seo";
import { fetchPageBySlug } from "@/lib/microcms";

export const metadata = buildMetadata({
  title: "その他のページ",
  path: "/other",
});

export default async function OtherPage() {
  const page = await fetchPageBySlug("other");

  return (
    <Section
      title={page?.title ?? "その他の情報"}
      description={page?.intro}
      eyebrow="Other"
    >
      <div className="space-y-6">
        {page?.sections.map((section) => (
          <article
            key={section.heading}
            className="rounded-3xl border border-card-border bg-card p-6 shadow-card"
          >
            <h3 className="text-lg font-semibold text-foreground">
              {section.heading}
            </h3>
            <p className="mt-3 text-sm text-muted">{section.body}</p>
          </article>
        )) ?? (
          <p className="text-sm text-muted">
            固定ページのコンテンツは microCMS で管理します。
          </p>
        )}
      </div>
    </Section>
  );
}
