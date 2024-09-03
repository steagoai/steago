//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  transpilePackages: ['@steago/nexus', '@steago/ui'],
  webpack: (config) => {
    // Just an attempt at webpack caching to speed up builds, ignore...
    // config.cache = {
    //   type: 'filesystem',
    //   cacheDirectory: path.resolve('./.webpack_cache'),
    // };
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve('../../node_modules/react'),
      'react-dom': path.resolve('../../node_modules/react-dom'),
      '@tiptap/react': path.resolve('../../node_modules/@tiptap/react'),
      '@tiptap/pm': path.resolve('../../node_modules/@tiptap/pm'),
      '@tanstack/react-query': path.resolve(
        '../../node_modules/@tanstack/react-query'
      ),
      '@headlessui/react': path.resolve('../../node_modules/@headlessui/react'),
      '@steago/nexus': path.resolve('../../node_modules/@steago/nexus/src'),
      '@steago/ui': path.resolve('../../node_modules/@steago/ui/src'),
      // "..." // all shared deps in this array
    };
    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withBundleAnalyzer,
];

module.exports = composePlugins(...plugins)(nextConfig);
