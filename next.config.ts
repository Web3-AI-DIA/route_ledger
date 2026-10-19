import { withSentryConfig } from "@sentry/nextjs";
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // SECURITY: Prevent clickjacking attacks by disallowing framing
          { key: 'X-Frame-Options', value: 'DENY' },
          // SECURITY: Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // SECURITY: Control referrer information passed in requests
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // SECURITY: Enable XSS filter in older browsers
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // SECURITY: Restrict browser features and APIs
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // SECURITY: Enforce HTTPS connections
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "your-org",
  project: "your-project",
});
