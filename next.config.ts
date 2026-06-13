import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1, // Limit workers to prevent Cloudflare OOM
    memoryBasedWorkersCount: true,
    optimizePackageImports: ['lucide-react', 'mathjs']
  }
};

export default nextConfig;
