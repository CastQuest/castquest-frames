/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@castquest/neo-ux-core'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Next.js 15: serverExternalPackages (moved out of experimental)
  serverExternalPackages: ['@castquest/core-services', 'bcrypt', '@mapbox/node-pre-gyp', '@prisma/client'],
  webpack: (config, { isServer }) => {
    // Externalize bcrypt and node-gyp packages for server
    if (isServer) {
      config.externals.push('bcrypt', '@mapbox/node-pre-gyp');
    }
    
    // Fix for bcrypt and other Node.js modules - exclude from client bundle
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
    return config;
  },
};
export default nextConfig;
