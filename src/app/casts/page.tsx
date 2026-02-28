import { CastCard } from "@/components/cast-card";
import { Section } from "@/components/section";
import { buildMetadata } from "@/components/seo";
import { fetchCasts } from "@/lib/casts";

export const metadata = buildMetadata({
  title: "キャスト一覧",
  path: "/casts",
});

export default async function CastListPage() {
  const casts = await fetchCasts();

  return (
    <Section
      title="キャスト一覧"
      description="Campastella に参加しているキャストのプロフィールと担当領域です。"
      eyebrow="Casts"
      className="pb-24 pt-12"
    >
      <div className="overflow-x-auto">
        <div className="grid min-w-[900px] grid-cols-3 gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {casts.map((cast) => (
            <CastCard key={cast.id} cast={cast} />
          ))}
        </div>
      </div>
    </Section>
  );
}
