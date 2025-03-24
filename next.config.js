// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   // basePath: '/PathBench',
//   images: {
//     unoptimized: true,
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },

  // 自动根据环境设置prefix
  assetPrefix: '/PathBench/',
  basePath: '/PathBench',
}

module.exports = nextConfig