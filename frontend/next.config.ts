import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   reactCompiler: true,
   typedRoutes: true,
    experimental: {
    viewTransition: true,
    serverActions:{
      bodySizeLimit:"20mb"
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
   
};

export default nextConfig;
