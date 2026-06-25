import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.ktimarketing.agency' }],
        destination: 'https://ktimarketing.agency/:path*',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Only API routes need pg-cloudflare; restricting scope avoids copying it to page bundles.
  outputFileTracingIncludes: {
    "/api/**": ["./node_modules/pg-cloudflare/**"],
  },
  // Keep large packages out of the webpack server bundle so esbuild can optimise them directly.
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;
