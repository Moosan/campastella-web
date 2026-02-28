import "server-only";

import { cache } from "react";

import {
  CAMPANELLA_IMAGE_BASE_URL,
  DEFAULT_OG_IMAGE,
} from "@/lib/constants";
import { isExternalApiConfigured } from "@/lib/env";
import {
  castSchema,
  type Cast,
  type ImageField,
  type LinkItem,
} from "@/lib/microcms";
import {
  fetchCharacters,
  type ExternalCharacter,
  type ExternalImageObject,
} from "@/lib/external";

export type { Cast } from "@/lib/microcms";

const RAW_FALLBACK_CASTS = [
  {
    id: "arisa",
    slug: "arisa",
    name: "Arisa",
    role: "Creative Director",
    introduction:
      "都市と自然をつなぐ演出を得意とし、Campastella の全体監修を担当。ライフスタイルブランドや自治体と共同プロジェクトを展開。",
    tags: ["Direction", "Community"],
    thumbnail: {
      url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      width: 900,
      height: 1200,
      alt: "Arisa portrait",
    },
    gallery: [],
    socials: [
      { label: "Instagram", href: "https://instagram.com", external: true },
    ],
  },
  {
    id: "sota",
    slug: "sota",
    name: "Sota",
    role: "Technical Producer",
    introduction:
      "インタラクティブ演出と照明デザインを担当。海外フェスやアートイベントでの経験をベースに、没入感ある空間を実現する。",
    tags: ["Lighting", "Interactive"],
    thumbnail: {
      url: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80",
      width: 900,
      height: 1200,
      alt: "Sota portrait",
    },
    gallery: [],
    socials: [
      { label: "X", href: "https://x.com", external: true },
      {
        label: "Portfolio",
        href: "https://campastella.jp/sota",
        external: true,
      },
    ],
  },
  {
    id: "hina",
    slug: "hina",
    name: "Hina",
    role: "Community Host",
    introduction:
      "現地コミュニティのリサーチと番組編成を担当。都市カルチャーをテーマにしたツアー企画やライティングでメディアにも寄稿。",
    tags: ["Hospitality", "Editorial"],
    thumbnail: {
      url: "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=900&q=80",
      width: 900,
      height: 1200,
      alt: "Hina portrait",
    },
    gallery: [],
    socials: [
      { label: "note", href: "https://note.com", external: true },
      { label: "LinkedIn", href: "https://linkedin.com", external: true },
    ],
  },
];

const FALLBACK_CASTS: Cast[] = RAW_FALLBACK_CASTS.map((cast) =>
  castSchema.parse(cast),
);

function normalizeImage(
  image: ExternalImageObject | null | undefined,
  alt: string,
): ImageField | null {
  if (!image) {
    return null;
  }

  const variants = image.variants ?? {};
  const variantUrl = Object.values(variants)[0];
  const cdnUrl =
    typeof image.id === "number"
      ? `${CAMPANELLA_IMAGE_BASE_URL}${image.id}`
      : null;
  const firstVariant = variantUrl ?? cdnUrl ?? DEFAULT_OG_IMAGE;
  return {
    url: firstVariant,
    alt,
  };
}

function buildSocialLinks(character: ExternalCharacter): LinkItem[] {
  const socials: LinkItem[] = [];
  if (character.x_id) {
    socials.push({
      label: "X",
      href: `https://x.com/${character.x_id.replace(/^@/, "")}`,
      external: true,
    });
  }
  if (character.introduction_video_url) {
    socials.push({
      label: "Introduction Video",
      href: character.introduction_video_url,
      external: true,
    });
  }

  return socials;
}

function toSlug(character: ExternalCharacter) {
  const normalizedName = character.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalizedName ? `${character.id}-${normalizedName}` : String(character.id);
}

function isCharacterActive(character: ExternalCharacter) {
  const flag = character.activated;
  if (typeof flag === "boolean") {
    return flag;
  }
  if (typeof flag === "string") {
    const lowered = flag.toLowerCase();
    return lowered === "true" || lowered === "yes";
  }
  return false;
}

function mapCharacterToCast(character: ExternalCharacter): Cast {
  const thumbnail =
    normalizeImage(character.poster_image, character.name) ??
    normalizeImage(character.board_image, character.name) ?? {
      url: DEFAULT_OG_IMAGE,
      alt: character.name,
    };

  const gallery = [
    normalizeImage(character.board_image, character.name),
    normalizeImage(character.event_poster_image, character.name),
    normalizeImage(character.sign_image, character.name),
  ].filter((image): image is ImageField => Boolean(image));

  const tags = [
    character.type,
    character.personality ?? undefined,
    character.topic ?? undefined,
  ].filter((value): value is string => Boolean(value));

  return castSchema.parse({
    id: String(character.id),
    slug: toSlug(character),
    name: character.name,
    introduction: character.comment ?? undefined,
    tags,
    thumbnail,
    gallery,
    socials: buildSocialLinks(character),
  });
}

export const fetchCasts = cache(async (): Promise<Cast[]> => {
  if (!isExternalApiConfigured()) {
    return FALLBACK_CASTS;
  }

  const characters = await fetchCharacters();
  const filtered: Cast[] = characters
    .filter(
      (character) => isCharacterActive(character) && character.type === "cast",
    )
    .map(mapCharacterToCast);

  for (let i = filtered.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = filtered[i]!;
    filtered[i] = filtered[j]!;
    filtered[j] = temp;
  }

  return filtered;
});

export const fetchCastBySlug = cache(async (slug: string): Promise<Cast | null> => {
  const casts = await fetchCasts();
  const bySlug = casts.find((cast) => cast.slug === slug);
  if (bySlug) {
    return bySlug;
  }

  const slugId = slug.split("-")[0];
  return casts.find((cast) => cast.id === slug || cast.id === slugId) ?? null;
});
