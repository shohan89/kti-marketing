import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Ensure pg-cloudflare's compiled dist files are included in the traced output
  // so OpenNext/esbuild can bundle them for Cloudflare Workers.
  outputFileTracingIncludes: {
    "/**": ["./node_modules/pg-cloudflare/**"],
  },
};

export default nextConfig;
