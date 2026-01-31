import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },

  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore type errors during build
  },

  // Use webpack for better chunk control (Turbopack alternative in Next.js 16)
  // NOTE: We explicitly use --webpack flag in package.json scripts to force Webpack over Turbopack
  // This allows manual chunk splitting optimization for MapLibre and other heavy libraries
  // Turbopack handles code splitting automatically but doesn't support custom splitChunks config yet
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
        // Separate Turf.js (geospatial analysis library)
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
        // Separate TanStack Query
        tanstack: {
          test: /[\\/]node_modules[\\/]@tanstack/,
          name: 'tanstack',
          priority: 7,
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
