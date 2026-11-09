import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow product imagery to be stored anywhere (Supabase Storage, CDN, Unsplash...).
  // Tighten this to your own hostnames before going to production.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
