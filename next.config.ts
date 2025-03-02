import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint checks during build
  },
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript checks during build
  },
};

export default nextConfig;