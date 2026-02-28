import Link from "next/link";

import { CastShowcase } from "@/components/cast-showcase";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { fetchCasts } from "@/lib/casts";
import { fetchSiteSettings } from "@/lib/microcms";

export default async function HomePage() {
  const [settings, casts] = await Promise.all([
    fetchSiteSettings(),
    fetchCasts(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-card-border bg-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/60 to-background-muted/60" />
        <Container className="relative z-10 py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr),minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                CAMP ASTELLA
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                {settings.heroMessage}
              </h1>
              <p className="mt-6 text-base text-muted lg:text-lg">
                {settings.heroSubMessage}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {settings.contactFormUrl ? (
                  <Link
                    href={settings.contactFormUrl}
                    className="inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent"
                    target="_blank"
                    rel="noreferrer"
                  >
                    参加エントリー
                  </Link>
                ) : null}
                <Link
                  href="/casts"
                  className="inline-flex items-center rounded-full border border-card-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground"
                >
                  キャスト一覧を見る
                </Link>
              </div>
            </div>
            <div className="rounded-[32px] border border-card-border bg-card p-8 shadow-card backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                CAST SNAPSHOT
              </p>
              <p className="mt-4 text-5xl font-semibold text-foreground">
                {casts.length}
              </p>
              <p className="text-sm text-muted">アクティブなキャスト</p>
              <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4">
                {casts.slice(0, 12).map((cast) => (
                  <div
                    key={cast.id}
                    className="rounded-2xl bg-background/40 px-3 py-4 text-center shadow-inner"
                  >
                    <p className="text-xs font-semibold text-accent">{cast.tags[0]}</p>
                    <p className="mt-2 truncate text-sm font-medium text-foreground">
                      {cast.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section
        id="casts"
        title="キャスト紹介"
        description="一覧からキャストを選択すると、詳細カードが右側に表示されます。"
        eyebrow="Casts"
        actions={
          <Link
            href="/casts"
            className="rounded-full border border-card-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-foreground"
          >
            すべて見る
          </Link>
        }
      >
        {casts.length > 0 ? (
          <CastShowcase casts={casts} />
        ) : (
          <p className="text-sm text-muted">キャスト情報を取得できませんでした。</p>
        )}
      </Section>
    </>
  );
}
