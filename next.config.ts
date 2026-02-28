import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.microcms-assets.io",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "campastella-static.imgix.net",
      },
      {
        protocol: "https",
        hostname: "*.campastella.jp",
      },
      {
        protocol: "https",
        hostname: "*.campanella.jp",
      },
    ],
  },
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ["clsx", "zod"],
  },
};

export default nextConfig;
