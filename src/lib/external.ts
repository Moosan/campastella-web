import "server-only";

import { cache } from "react";
import { z } from "zod";

import { cacheTags } from "@/lib/cache-tags";
import { getServerEnv, isExternalApiConfigured } from "@/lib/env";

const imageVariantSchema = z.record(z.string().url());
const imageObjectSchema = z
  .object({
    id: z.number().nullable().optional(),
    variants: imageVariantSchema.optional(),
  })
  .nullish()
  .transform((value) => {
    if (!value) return null;
    return {
      id: typeof value.id === "number" ? value.id : undefined,
      variants: value.variants ?? {},
    };
  });

const staffSummarySchema = z.object({
  id: z.number(),
  discord_id: z.union([z.number(), z.string()]),
  discord_name: z.string().nullable(),
  vrc_display_names: z.array(z.string()).optional(),
  activated: z.union([z.string(), z.boolean()]).optional(),
  updated: z.string().optional(),
  created: z.string().optional(),
});

const characterSchema = z.object({
  id: z.number(),
  staff: staffSummarySchema,
  board_image: imageObjectSchema.optional(),
  poster_image: imageObjectSchema.optional(),
  event_poster_image: imageObjectSchema.optional(),
  sign_image: imageObjectSchema.optional(),
  name: z.string(),
  type: z.string(),
  comment: z.string().nullable(),
  personality: z.string().nullable(),
  topic: z.string().nullable(),
  x_id: z.string().nullable(),
  introduction_video_url: z.string().nullable(),
  birthday: z.string().nullable(),
  activated: z.union([z.string(), z.boolean()]).optional(),
  updated: z.string().optional(),
  created: z.string().optional(),
});

export type ExternalCharacter = z.infer<typeof characterSchema>;
export type ExternalImageObject = z.infer<typeof imageObjectSchema>;

type FetchOptions = {
  path: string;
  searchParams?: Record<string, string | number>;
  tag?: string;
};

async function fetchFromExternalApi<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  options: FetchOptions,
) {
  const env = getServerEnv();
  const baseUrl = env.EXTERNAL_API_BASE_URL;
  const apiKey = env.EXTERNAL_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("外部 API の設定が不足しています。");
  }

  const url = new URL(options.path, baseUrl);
  Object.entries(options.searchParams ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
    next: options.tag ? { tags: [options.tag] } : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `外部 API の呼び出しに失敗しました: ${response.status} ${message}`,
    );
  }

  const json = await response.json();
  const resolvedPayload =
    json && typeof json === "object"
      ? "response" in json && json.response
        ? json.response
        : json
      : json;
  return schema.parse(resolvedPayload);
}

const charactersResponseSchema = z
  .object({
    characters: z.array(characterSchema).nullish(),
    items: z.array(characterSchema).nullish(),
    data: z.array(characterSchema).nullish(),
  })
  .transform((payload) => {
    return (
      payload.characters ?? payload.items ?? payload.data ?? []
    );
  });

export const fetchCharacters = cache(
  async (): Promise<ExternalCharacter[]> => {
    if (!isExternalApiConfigured()) {
      return [];
    }

    const result = await fetchFromExternalApi(charactersResponseSchema, {
      path: "/v3/cms/character",
      tag: cacheTags.casts,
    });

    return result;
  },
);
