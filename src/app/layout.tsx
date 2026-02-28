import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildMetadata } from "@/components/seo";
import { fetchLinkCollections, fetchSiteSettings } from "@/lib/microcms";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = buildMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [settings, linkCollections] = await Promise.all([
    fetchSiteSettings(),
    fetchLinkCollections(),
  ]);

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background-muted">
          <SiteHeader settings={settings} />
          <main className="flex-1">{children}</main>
          <SiteFooter settings={settings} linkCollections={linkCollections} />
        </div>
      </body>
    </html>
  );
}
