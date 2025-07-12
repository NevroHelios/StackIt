import { hostname } from "os";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
    serverComponentsExternalPackages: ["mongoose"],
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.devtunnels.ms",
        "49x4kqhf-3000.inc1.devtunnels.ms",
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      { protocol: "https", hostname: "*" },
    ],
  },
  // Handle forwarded headers for tunnels
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Forwarded-Proto",
            value: "https",
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
