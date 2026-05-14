import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-fitplanner-build",
  transpilePackages: ["@fitplanner/shared"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
