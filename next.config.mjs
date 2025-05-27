/** @type {import('next').NextConfig} */
// 修改这里的basePath来调整部署路径
export const basePath = '';

const nextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },

  trailingSlash: true,
  env: {
    // These values will be overwritten by the build process
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().split('T')[0],
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString().split('T')[1].substring(0, 8),
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().toISOString().replace('T', ' ').substring(0, 19),
    // Make basePath available to the client
    NEXT_PUBLIC_BASE_PATH: basePath
  }
}

export default nextConfig