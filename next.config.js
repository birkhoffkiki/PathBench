/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/PathBench',
  images: {
    unoptimized: true,
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/static/js/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
