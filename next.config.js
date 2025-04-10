// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'standalone',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   experimental: {
//     outputFileTracingRoot: process.cwd(),
//     outputStandalone: true,
//     // publicディレクトリを含める
//     outputFileTracingIncludes: {
//       '/**': ['public/**/*']
//     }
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
