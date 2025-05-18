/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/PathBench',
  assetPrefix: '/PathBench',
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

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   basePath: '/showcase/PathBench',
//   assetPrefix: '/showcase/PathBench',
//   images: {
//     unoptimized: true,
//   },

//   trailingSlash: true,
//   env: {
//     // Using fixed values to avoid hydration mismatches
//     // These will be overwritten by the build process script
//     NEXT_PUBLIC_BUILD_DATE: "2025-05-18",
//     NEXT_PUBLIC_BUILD_TIME: "05:30:05",
//     NEXT_PUBLIC_BUILD_TIMESTAMP: "2025-05-18 05:30:05"
//   }
// }

// module.exports = nextConfig