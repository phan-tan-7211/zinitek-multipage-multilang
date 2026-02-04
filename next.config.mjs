/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Bỏ qua lỗi TypeScript khi build để xuất xưởng nhanh (Bạn đã có)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 2. TỐI ƯU HÌNH ẢNH TOÀN DIỆN
  images: {
    formats: ['image/avif', 'image/webp'], // Tự động nén ảnh sang định dạng xịn nhất hiện nay
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Cắt ảnh vừa khít với màn hình điện thoại/máy tính
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Cho phép tối ưu cả ảnh từ nguồn bên ngoài
      },
    ],
  },

  // 3. TỐI ƯU TỐC ĐỘ TRUYỀN TẢI
  compress: true, // Nén mọi dữ liệu truyền đi để web load nhanh hơn trên mạng 4G yếu
  powersByHeader: false, // Bảo mật: Ẩn thông tin kỹ thuật khỏi hacker
}

export default nextConfig