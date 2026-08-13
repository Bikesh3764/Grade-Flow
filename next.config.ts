import type { NextConfig } from "next";
import './scripts/generate-sitemaps.js';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  experimental: {
    cpus: 1, // Limit workers to prevent Cloudflare OOM
    memoryBasedWorkersCount: true,
    optimizePackageImports: ['lucide-react', 'mathjs']
  }
};

export default nextConfig;
