export const cacheTags = {
  siteSettings: "site-settings",
  casts: "casts",
  castDetail: (slug: string) => `cast:${slug}`,
  pages: "pages",
  links: "links",
} as const;

export type CacheTag = keyof typeof cacheTags;
