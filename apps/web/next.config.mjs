/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@castquest/neo-ux-core'],
  
  // Next.js 15: serverExternalPackages (moved out of experimental)
  serverExternalPackages: [
    '@castquest/core-services',
    'bcrypt',
    '@mapbox/node-pre-gyp',
    '@prisma/client',
  ],

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.io',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare-ipfs.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Externalize bcrypt and node-gyp packages for server
    if (isServer) {
      config.externals.push('bcrypt', '@mapbox/node-pre-gyp');
    }
    
    // Fix for Node.js modules - exclude from client bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        bcrypt: false,
        '@mapbox/node-pre-gyp': false,
      };
      
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        child_process: false,
        'mock-aws-s3': false,
        'aws-sdk': false,
        nock: false,
      };
    }

    // WASM support for solc and other tools
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },

  // Logging configuration — only log full fetch URLs in non-production to avoid leaking tokens/PII
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV !== "production",
    },
  },
};

export default nextConfig;
