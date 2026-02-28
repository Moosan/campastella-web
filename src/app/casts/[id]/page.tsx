import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { buildMetadata } from "@/components/seo";
import { fetchCastBySlug, fetchCasts } from "@/lib/casts";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const casts = await fetchCasts();
  return casts.map((cast) => ({ id: cast.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const cast = await fetchCastBySlug(params.id);
  return buildMetadata({
    title: cast ? `${cast.name} | キャスト` : "キャスト詳細",
    description: cast?.introduction,
    path: `/casts/${params.id}`,
    image: cast?.thumbnail.url,
  });
}

export default async function CastDetailPage({ params }: PageProps) {
  const cast = await fetchCastBySlug(params.id);

  if (!cast) {
    notFound();
  }

  return (
    <>
      <Section
        title={cast.name}
        description={cast.introduction}
        eyebrow={cast.role ?? "Campastella Cast"}
        className="pb-0"
      >
        <div className="grid gap-10 md:grid-cols-[400px,1fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-card-border">
            <Image
              src={cast.thumbnail.url}
              alt={cast.thumbnail.alt ?? cast.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            {cast.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cast.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted/10 px-3 py-1 text-xs font-semibold text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            {cast.gallery.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {cast.gallery.map((image) => (
                  <div
                    key={image.url}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt ?? cast.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
            {cast.socials.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {cast.socials.map((social) => (
                  <Link
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-foreground transition hover:text-accent"
                  >
                    {social.label} ↗
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Section>
      <Container className="pb-24">
        <Link
          href="/casts"
          className="text-sm font-semibold text-foreground transition hover:text-accent"
        >
          ← キャスト一覧へ戻る
        </Link>
      </Container>
    </>
  );
}
