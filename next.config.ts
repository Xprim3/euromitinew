import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      /** Large enough for homepage services-band video uploads (see ADMIN_VIDEO_MAX_BYTES). */
      bodySizeLimit: "50mb",
    },
  },
  /* Prefer euromiti as Turbopack root when a lockfile exists in a parent directory. */
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/lokacionet",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/lokacionet/:slug",
        destination: "/locations/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
