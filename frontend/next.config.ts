import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   reactCompiler: true,
   typedRoutes: true,
    experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
