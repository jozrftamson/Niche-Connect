
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Remove custom webpack config for Turbopack compatibility
};

export default nextConfig;
