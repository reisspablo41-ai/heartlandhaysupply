import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next's own image optimizer is disabled. On Vercel, /_next/image is a
    // metered feature: once the plan's transformation quota is used up every
    // optimized request returns HTTP 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_
    // REQUIRED) and every image on the site goes blank. Serving the originals
    // keeps the site working with no quota at all — Supabase Storage and
    // /public are both already on a CDN.
    //
    // Trade-off: no automatic resizing or WebP/AVIF conversion, so browsers
    // download the full-size file. Keep uploads reasonably small.
    // Set this back to false (or delete it) if you move to a Vercel plan with
    // enough transformations, or switch to a custom `loader` that points at
    // Supabase's own render endpoint.
    unoptimized: true,

    // Only consulted when the optimizer is enabled, but kept accurate so
    // flipping `unoptimized` back off does not break the catalogue.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
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
