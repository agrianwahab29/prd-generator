import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Image optimization settings
  images: {
    unoptimized: false,
  },
  
  // Disable type checking during build (for faster builds)
  typescript: {
    ignoreBuildErrors: false,
  },
};

// Enable bundle analyzer when ANALYZE=true
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Sentry webpack plugin options
const sentryWebpackPluginOptions = {
  // Suppresses source map uploading logs
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

// Chain the wrappers: bundleAnalyzer first, then Sentry
const configWithBundleAnalyzer = bundleAnalyzer(nextConfig);

export default withSentryConfig(configWithBundleAnalyzer, sentryWebpackPluginOptions);
