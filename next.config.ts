import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow wasm files for Stockfish engine */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  // Add empty turbopack config to silence the error
  // The webpack config handles the necessary fallbacks for Stockfish
  turbopack: {},
};

export default nextConfig;
