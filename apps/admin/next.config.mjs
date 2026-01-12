/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@castquest/neo-ux-core'],
<<<<<<< HEAD
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
=======
>>>>>>> origin/copilot/add-resolution-doc-and-cleanup
  experimental: {
    serverComponentsExternalPackages: ['@castquest/core-services', 'bcrypt', '@mapbox/node-pre-gyp'],
  },
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
