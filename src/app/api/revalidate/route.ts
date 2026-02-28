import crypto from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { cacheTags } from "@/lib/cache-tags";
import { getStrictServerEnv } from "@/lib/env";

const SIGNATURE_HEADER = "x-microcms-signature";

type WebhookPayload = {
  contentsId?: string;
  id?: string;
  api?: string;
  service?: string;
};

function verifySignature(body: string, signature: string | null, secret: string) {
  if (!signature) {
    return false;
  }

  const digest = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("hex");
  const digestBuffer = Buffer.from(digest);
  const signatureBuffer = Buffer.from(signature);

  if (digestBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
}

function deriveTags(payload: WebhookPayload) {
  const tags = new Set<string>();

  switch (payload.api) {
    case "site_settings":
      tags.add(cacheTags.siteSettings);
      break;
    case "casts":
      tags.add(cacheTags.casts);
      if (payload.contentsId) {
        tags.add(cacheTags.castDetail(payload.contentsId));
      }
      break;
    case "pages":
      tags.add(cacheTags.pages);
      break;
    case "links":
      tags.add(cacheTags.links);
      break;
    default:
      break;
  }

  return tags;
}

export async function POST(request: Request) {
  const env = getStrictServerEnv();
  const bodyText = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER);

  if (!verifySignature(bodyText, signature, env.MICROCMS_WEBHOOK_SECRET)) {
    return NextResponse.json(
      { ok: false, reason: "Invalid signature" },
      { status: 401 },
    );
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return NextResponse.json(
      { ok: false, reason: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const tags = deriveTags(payload);

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({
    ok: true,
    revalidated: Array.from(tags),
  });
}
