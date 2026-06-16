/** @type {import('next').NextConfig} */
// GitHub Pages 静态部署配置
// 项目站点地址形如 https://<用户名>.github.io/<仓库名>/，需要 basePath
const repoName = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  reactStrictMode: true,
  output: 'export', // 静态导出到 out/
  images: { unoptimized: true },
  basePath: repoName,
  assetPrefix: repoName,
  trailingSlash: true,
}

module.exports = nextConfig
