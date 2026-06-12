import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
  experimental: {
    cpus: 1
  },
  turbopack: {
    root: fileURLToPath(new URL('../..', import.meta.url))
  }
};

export default nextConfig;
