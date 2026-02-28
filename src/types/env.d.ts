declare namespace NodeJS {
  interface ProcessEnv {
    readonly MICROCMS_SERVICE_DOMAIN: string;
    readonly MICROCMS_API_KEY: string;
    readonly MICROCMS_WEBHOOK_SECRET: string;
    readonly EXTERNAL_API_BASE_URL?: string;
    readonly EXTERNAL_API_KEY?: string;
    readonly SENTRY_DSN?: string;
    readonly NEXT_PUBLIC_SITE_URL?: string;
  }
}
