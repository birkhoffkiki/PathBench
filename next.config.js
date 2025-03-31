// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   images: {
//     unoptimized: true,
//   },

//   // 自动根据环境设置prefix
//   basePath: '/PathBench',
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/showcase/PathBench',
  assetPrefix: '/showcase/PathBench',
  images: {
    unoptimized: true,
  },

  trailingSlash: true,
  env: {
    // These values will be overwritten by the build process
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().split('T')[0],
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString().split('T')[1].substring(0, 8),
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().toISOString().replace('T', ' ').substring(0, 19)
  }
}

module.exports = nextConfig