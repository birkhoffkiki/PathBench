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
  assetPrefix: process.env.NODE_ENV === 'production' ? '/PathBench/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/PathBench' : '',
  
  // 添加环境变量
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === 'production' ? '/PathBench' : '',
  },
}

module.exports = nextConfig