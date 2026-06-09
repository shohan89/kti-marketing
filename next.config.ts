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
  async redirects() {
    return [
      { source: '/case-studies', destination: '/portfolio', permanent: true },
      { source: '/case-studies/:slug', destination: '/portfolio/:slug', permanent: true },
    ]
  },
};

export default nextConfig;
