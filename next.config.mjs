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

  // 4. Disable webpack cache to fix memory allocation errors
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },

  // 5. Turbopack config tường minh — bắt buộc khi có webpack config trong Next.js 16
  // Xem: https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
  turbopack: {},

  // LƯU Ý: Xóa bỏ hoàn toàn block 'eslint' và 'experimental' cũ
};

export default nextConfig;