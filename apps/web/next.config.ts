import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-fitplanner",
  transpilePackages: ["@fitplanner/shared"],
};

export default nextConfig;
