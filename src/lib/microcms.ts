import "server-only";

import { cache } from "react";
import { z } from "zod";

import { cacheTags } from "@/lib/cache-tags";
import { getServerEnv, isMicrocmsConfigured } from "@/lib/env";

const imageSchema = z.object({
  url: z.string().min(1),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
});

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
  external: z.boolean().default(false),
});

export const castSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  role: z.string().optional(),
  introduction: z.string().optional(),
  tags: z.array(z.string()).default([]),
  thumbnail: imageSchema,
  gallery: z.array(imageSchema).default([]),
  socials: z.array(linkSchema).default([]),
});

const listResponseSchema = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.object({
    contents: z.array(schema),
    totalCount: z.number(),
    limit: z.number(),
    offset: z.number(),
  });

const linkArraySchema = z
  .array(linkSchema)
  .nullish()
  .transform((value): z.infer<typeof linkSchema>[] => value ?? []);

const siteSettingsSchema = z.object({
  title: z.string(),
  description: z.string(),
  heroMessage: z.string(),
  heroSubMessage: z.string(),
  contactFormUrl: z.string().url().optional(),
  primaryLinks: linkArraySchema,
  socialLinks: linkArraySchema,
  footerNote: z.string().optional(),
});

const simplePageSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  intro: z.string().optional(),
  sections: z
    .array(
      z.object({
        heading: z.string(),
        body: z.string(),
      }),
    )
    .default([]),
});

const linksSchema = z.object({
  title: z.string(),
  links: z.array(linkSchema).default([]),
});

export type ImageField = z.infer<typeof imageSchema>;
export type LinkItem = z.infer<typeof linkSchema>;
export type Cast = z.infer<typeof castSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type SimplePage = z.infer<typeof simplePageSchema>;
export type LinkCollection = z.infer<typeof linksSchema>;

type FetchOptions = {
  searchParams?: Record<string, string | number>;
  tag?: string;
};

async function fetchFromMicrocms<TSchema extends z.ZodTypeAny>(
  endpoint: string,
  schema: TSchema,
  options?: FetchOptions,
) {
  const env = getServerEnv();
  const domain = env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = env.MICROCMS_API_KEY;

  if (!domain || !apiKey) {
    throw new Error("microCMS の接続情報が不足しています。");
  }

  const url = new URL(
    `https://${domain}.microcms.io/api/v1/${endpoint.replace(/^\//, "")}`,
  );

  Object.entries(options?.searchParams ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      "X-MICROCMS-API-KEY": apiKey,
    },
    next: options?.tag
      ? {
          tags: [options.tag],
        }
      : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `microCMS リクエストに失敗しました: ${response.status} ${message}`,
    );
  }

  const json = await response.json();
  return schema.parse(json);
}

export const fetchSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isMicrocmsConfigured()) {
    return FALLBACK_SITE_SETTINGS;
  }

  return fetchFromMicrocms(
    "site_settings",
    siteSettingsSchema,
    {
      tag: cacheTags.siteSettings,
    },
  );
});

export const fetchPageBySlug = cache(
  async (slug: string): Promise<SimplePage | null> => {
    if (!isMicrocmsConfigured()) {
      return FALLBACK_PAGES[slug] ?? null;
    }

    const result = await fetchFromMicrocms(
      "pages",
      listResponseSchema(simplePageSchema),
      {
        tag: cacheTags.pages,
        searchParams: {
          filters: `slug[equals]${slug}`,
          limit: 1,
        },
      },
    );

    return result.contents.at(0) ?? null;
  },
);

export const fetchLinkCollections = cache(
  async (): Promise<LinkCollection[]> => {
    if (!isMicrocmsConfigured()) {
      return FALLBACK_LINK_COLLECTIONS;
    }

    const result = await fetchFromMicrocms(
      "links",
      listResponseSchema(linksSchema),
      {
        tag: cacheTags.links,
        searchParams: {
          limit: 20,
        },
      },
    );

    return result.contents;
  },
);

const FALLBACK_SITE_SETTINGS: SiteSettings = {
  title: "Campastella",
  description:
    "Campastella（カムパステラ）は、カルチャーとテクノロジーの境界を越えて体験を届けるクリエイティブ・コレクティブです。",
  heroMessage: "境界を越えて、あなたの好奇心を灯す。",
  heroSubMessage:
    "多彩なキャストによるエンターテイメント / ワークショップ / コミュニティ運営を通じて、都市を舞台にした物語を描いています。",
  contactFormUrl: "https://forms.gle/sample",
  footerNote: "© Campastella",
  primaryLinks: [
    { label: "トップ", href: "/", external: false },
    { label: "キャスト一覧", href: "/casts", external: false },
    { label: "参加方法", href: "/about", external: false },
    { label: "その他", href: "/other", external: false },
  ],
  socialLinks: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/campastella",
      external: true,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@campastella",
      external: true,
    },
  ],
};

const FALLBACK_PAGES: Record<string, SimplePage> = {
  about: {
    id: "about",
    slug: "about",
    title: "Campastella への参加方法",
    intro:
      "コミュニティメンバー、サポーター企業、パートナーキャストの 3 つの窓口があります。",
    sections: [
      {
        heading: "コミュニティメンバー",
        body: "都内を中心に活動する少人数のチームにジョインし、番組制作やイベント運営に携わることができます。",
      },
      {
        heading: "サポーター / スポンサー",
        body: "ブランド / 行政 / 施設運営者の方向けに、体験設計やプログラム開発を共同で実施します。",
      },
      {
        heading: "キャスト応募",
        body: "得意なスキル・活動領域をベースにしたコラボレーションを常時募集しています。",
      },
    ],
  },
  other: {
    id: "other",
    slug: "other",
    title: "Campastella のその他の取り組み",
    intro:
      "教育機関向けワークショップやメディア連携など、サイト外で展開中のプロジェクトを紹介します。",
    sections: [
      {
        heading: "教育・研修プログラム",
        body: "大学ゼミや企業研修向けに、都市観察とストーリーテリングを掛け合わせた講座を提供しています。",
      },
      {
        heading: "メディア連携",
        body: "コミュニティレポートやキャストの連載を通じて、地域の魅力を継続的に発信しています。",
      },
    ],
  },
};

const FALLBACK_LINK_COLLECTIONS: LinkCollection[] = [
  {
    title: "最新情報",
    links: [
      { label: "イベント一覧", href: "/other", external: false },
      {
        label: "ニュースレター",
        href: "https://newsletter.com",
        external: true,
      },
    ],
  },
  {
    title: "公式アカウント",
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/campastella",
        external: true,
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@campastella",
        external: true,
      },
    ],
  },
];
