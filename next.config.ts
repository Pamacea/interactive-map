import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/avatars/**',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Allow file uploads up to 10MB
    },
    // Optimize package imports for heavy libraries
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@tanstack/react-query',
      'react-markdown',
      '@uiw/react-md-editor',
    ],
  },

  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore type errors during build
  },

  // SECURITY HEADERS - Prevent clickjacking, XSS, MIME-sniffing, etc.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.github.com https://*.discord.com https://fonts.googleapis.com https://fonts.gstatic.com",
              "frame-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Turbopack configuration (default in Next.js 16+)
  turbopack: {
    // Set root to prevent workspace inference warnings
    root: path.resolve(__dirname),

    // Fix Prisma 7 + pnpm + Turbopack module resolution
    // The browser client tries to import from '.prisma/client/index-browser'
    // which Turbopack can't resolve with pnpm's virtual store layout
    resolveAlias: (() => {
      try {
        const prismaClientPkg = require.resolve('@prisma/client/package.json');
        // With pnpm, go up 3 levels from package.json to reach node_modules root
        const pnpmNodeModulesDir = path.dirname(path.dirname(path.dirname(prismaClientPkg)));
        return {
          '.prisma/client': path.join(pnpmNodeModulesDir, '.prisma', 'client'),
        };
      } catch {
        // Fallback if resolution fails during config loading
        return {};
      }
    })(),
  },

  // Webpack configuration (for local builds with --webpack flag)
  // NOTE: Vercel uses Turbopack by default (faster builds ~3x)
  // Local development can use --webpack flag for custom chunk splitting
  webpack: (config, { isServer }) => {
    // Optimize chunk splitting
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        // Separate MapLibre GL into its own chunk (large library)
        maplibre: {
          test: /[\\/]node_modules[\\/]maplibre-gl/,
          name: 'maplibre',
          priority: 10,
          chunks: 'all',
          enforce: true,
        },
        // Separate Turf.js geospatial library (if used in future)
        turf: {
          test: /[\\/]node_modules[\\/]@turf/,
          name: 'turf',
          priority: 9,
          chunks: 'all',
          enforce: true,
        },
        // Separate Radix UI components
        radix: {
          test: /[\\/]node_modules[\\/]@radix-ui/,
          name: 'radix',
          priority: 8,
          chunks: 'all',
          enforce: true,
        },
        // Separate markdown libraries
        markdown: {
          test: /[\\/]node_modules[\\/](react-markdown|remark-gfm|rehype-sanitize|@uiw)/,
          name: 'markdown',
          priority: 7,
          chunks: 'all',
          enforce: true,
        },
        // Separate TanStack Query
        tanstack: {
          test: /[\\/]node_modules[\\/]@tanstack/,
          name: 'tanstack',
          priority: 6,
          chunks: 'all',
          enforce: true,
        },
        // Separate export libraries (html2canvas, jsPDF)
        export: {
          test: /[\\/]node_modules[\\/](html2canvas|jspdf)/,
          name: 'export',
          priority: 5,
          chunks: 'all',
          enforce: true,
        },
        // General vendor chunk
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 1,
          chunks: 'all',
          reuseExistingChunk: true,
        },
      },
    };

    // Fix Prisma 7 + pnpm + webpack module resolution
    // The browser client tries to import from '.prisma/client/index-browser'
    // which webpack can't resolve with pnpm's virtual store layout
    //
    // With pnpm, the structure is:
    // node_modules/.pnpm/@prisma+client@xxx/node_modules/
    //   @prisma/client/package.json  <- we start here
    //   .prisma/client/
    const path = require('path');
    const prismaClientPkg = require.resolve('@prisma/client/package.json');
    // Go up 3 levels from package.json:
    // 1. from package.json to client/
    // 2. from client/ to @prisma/
    // 3. from @prisma/ to node_modules/
    const pnpmNodeModulesDir = path.dirname(path.dirname(path.dirname(prismaClientPkg)));
    config.resolve.alias = {
      ...config.resolve.alias,
      '.prisma/client': path.join(pnpmNodeModulesDir, '.prisma', 'client'),
    };

    // Improve module resolution performance
    config.resolve = {
      ...config.resolve,
      // Reduce file system lookups
      symlinks: false,
    };

    return config;
  },

  // Optimize output
  compress: true,

  // Production source maps (disabled for smaller bundles, enable for debugging)
  productionBrowserSourceMaps: false,
};

// Bundle analyzer integration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
