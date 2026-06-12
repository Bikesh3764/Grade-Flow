import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1, // Limit workers to prevent Cloudflare OOM
    memoryBasedWorkersCount: true
  }
};

export default nextConfig;
