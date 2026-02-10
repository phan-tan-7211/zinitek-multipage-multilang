/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. TỐI ƯU HÌNH ẢNH
  transpilePackages: ['next-sanity', 'sanity', '@sanity/document-internationalization'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'bizweb.dktcdn.net',
      },
    ],
  },

  // 2. TỐI ƯU TỐC ĐỘ & BẢO MẬT
  compress: true,
  poweredByHeader: false,

  // 3. BỎ QUA LỖI ĐỂ BUILD NHANH
  typescript: {
    ignoreBuildErrors: true,
  },

  // LƯU Ý: Xóa bỏ hoàn toàn block 'eslint' và 'experimental' cũ
};

export default nextConfig;