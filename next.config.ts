/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWR and ISR
  reactStrictMode: false, // Disable strict mode for production
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Compression
  compress: true,

  // Turbopack config (if using Turbopack)
  experimental: {
    optimizePackageImports: ["@components", "@hooks"],
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/learn",
        destination: "/subjects",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;