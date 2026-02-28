import type { Metadata } from "next";

import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getServerEnv } from "@/lib/env";

type BuildMetadataOptions = {
  title?: string;
  description?: string | null | undefined;
  path?: string;
  image?: string | null | undefined;
};

export function buildMetadata({
  title,
  description,
  path,
  image,
}: BuildMetadataOptions = {}): Metadata {
  const env = getServerEnv();
  const baseUrl =
    env.NEXT_PUBLIC_SITE_URL ?? "https://campastella-web.vercel.app";
  const resolvedTitle = title ? `${title}｜${SITE_NAME}` : SITE_NAME;
  const resolvedDescription = description ?? SITE_DESCRIPTION;
  const absoluteImage = image ?? DEFAULT_OG_IMAGE;

  return {
    metadataBase: new URL(baseUrl),
    title: resolvedTitle,
    description: resolvedDescription,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: path ? `${baseUrl}${path}` : baseUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [absoluteImage],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [absoluteImage],
    },
  };
}
