import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignorar o ESLint durante o build
  },
};

export default nextConfig;
