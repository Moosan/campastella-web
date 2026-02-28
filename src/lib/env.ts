import { z } from "zod";

const REQUIRED_KEYS = [
  "MICROCMS_SERVICE_DOMAIN",
  "MICROCMS_API_KEY",
  "MICROCMS_WEBHOOK_SECRET",
] as const;

const serverEnvSchema = z.object({
  MICROCMS_SERVICE_DOMAIN: z.string().min(1).optional(),
  MICROCMS_API_KEY: z.string().min(1).optional(),
  MICROCMS_WEBHOOK_SECRET: z.string().min(1).optional(),
  EXTERNAL_API_BASE_URL: z.string().url().optional(),
  EXTERNAL_API_KEY: z.string().min(1).optional(),
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

const parsedEnv = serverEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`環境変数のパースに失敗しました: ${parsedEnv.error.message}`);
}

export type ServerEnv = z.infer<typeof serverEnvSchema>;

const envData: ServerEnv = parsedEnv.data;
let cachedEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (!cachedEnv) {
    cachedEnv = envData;
  }

  return cachedEnv;
}

export type StrictServerEnv = ServerEnv &
  Record<(typeof REQUIRED_KEYS)[number], string>;

export function getStrictServerEnv(): StrictServerEnv {
  const env = getServerEnv();
  const missing = REQUIRED_KEYS.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `必須の環境変数が未設定です: ${missing
        .map((key) => `process.env.${key}`)
        .join(", ")}`,
    );
  }

  return env as StrictServerEnv;
}

export function isMicrocmsConfigured() {
  const env = getServerEnv();
  return Boolean(env.MICROCMS_API_KEY && env.MICROCMS_SERVICE_DOMAIN);
}

export function isExternalApiConfigured() {
  const env = getServerEnv();
  return Boolean(env.EXTERNAL_API_BASE_URL && env.EXTERNAL_API_KEY);
}
