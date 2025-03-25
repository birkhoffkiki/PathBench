/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },

  // 自动根据环境设置prefix
  basePath: '/PathBench',
}

module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   // 设置基本路径为 /showcase/PathBench
//   basePath: '/showcase/PathBench',
//   // 资源前缀也设置为相同路径
//   assetPrefix: '/showcase/PathBench',
//   // 确保图像和其他资源正确加载
//   images: {
//     unoptimized: true,
//   },
//   // 如果您的应用使用了 trailing slashes
//   trailingSlash: true,
// }

// module.exports = nextConfig