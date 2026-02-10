// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Cog } from "lucide-react"
import { Button } from "@/components/ui/button"

// --- 1. BỘ TỪ ĐIỂN NỘI BỘ CHO TRANG LỖI ---
const danhSachNgonNguLoi = {
  vi: {
    badge: "Lỗi 404",
    title: "Trang không",
    titleHighlight: "tìm thấy",
    description: "Có vẻ như đường dẫn này đã bị hỏng giống như bánh răng kia. Hãy quay lại trang chủ để tiếp tục.",
    buttonHome: "Về trang chủ",
    buttonBack: "Quay lại",
    status: "TRẠNG THÁI: KHÔNG TÌM THẤY",
    gearStatus: "BÁNH RĂNG: BỊ HỎNG"
  },
  en: {
    badge: "Error 404",
    title: "Page",
    titleHighlight: "Not Found",
    description: "It seems this link is broken just like that gear. Please return to the home page to continue.",
    buttonHome: "Back to Home",
    buttonBack: "Go Back",
    status: "STATUS: NOT FOUND",
    gearStatus: "GEAR: BROKEN"
  },
  jp: {
    badge: "404 エラー",
    title: "ページが",
    titleHighlight: "見つかりません",
    description: "このリンクはあの歯車のように壊れているようです。ホームに戻って続行してください。",
    buttonHome: "ホームへ戻る",
    buttonBack: "戻る",
    status: "ステータス: 未検出",
    gearStatus: "ギア: 破損"
  },
  kr: {
    badge: "404 오류",
    title: "페이지를",
    titleHighlight: "찾을 수 없습니다",
    description: "이 링크는 저 톱니바퀴처럼 고장 난 것 같습니다. 계속하려면 홈 페이지로 돌아가십시오.",
    buttonHome: "홈으로 돌아가기",
    buttonBack: "뒤로 가기",
    status: "상태: 찾을 수 없음",
    gearStatus: "기어: 고장"
  },
  cn: {
    badge: "404 错误",
    title: "页面",
    titleHighlight: "未找到",
    description: "看来这个链接就像那个齿轮一样坏了。请返回首页继续。",
    buttonHome: "返回首页",
    buttonBack: "返回",
    status: "状态: 未找到",
    gearStatus: "齿轮: 损坏"
  }
};

function BrokenGear({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear", delay }}
    >
      <defs>
        <linearGradient id="gearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <rect
          key={angle}
          x="46"
          y="5"
          width="8"
          height="15"
          fill={i === 2 || i === 5 ? "#334155" : "url(#gearGradient)"}
          transform={`rotate(${angle} 50 50)`}
          opacity={i === 2 || i === 5 ? 0.3 : 1}
        />
      ))}
      <circle cx="50" cy="50" r="30" fill="url(#gearGradient)" />
      <circle cx="50" cy="50" r="12" fill="#020617" />
      <circle cx="50" cy="50" r="8" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.5" />
      <motion.path
        d="M 50 20 L 55 35 L 45 35 Z"
        fill="#f97316"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: [0, 80, 80], opacity: [1, 1, 0], rotate: [0, 45, 90] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.svg>
  )
}

function FloatingPart({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-4 h-4 bg-[#f97316]/20 rounded"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0.5],
        y: [0, -50, -100],
        rotate: [0, 180, 360]
      }}
      transition={{ duration: 3, delay, repeat: Infinity, repeatDelay: 2 }}
    />
  )
}

export default function NotFound() {
  // --- 2. LOGIC NHẬN DIỆN NGÔN NGỮ TỪ URL ---
  const duongDanHienTai = usePathname();
  
  // Tách chuỗi URL để lấy mã ngôn ngữ (ví dụ: /en/blog -> en)
  const cacPhanDuongDan = duongDanHienTai.split('/');
  const maNgonNgu = (cacPhanDuongDan[1] || 'vi') as keyof typeof danhSachNgonNguLoi;
  
  // Lấy dữ liệu ngôn ngữ tương ứng, mặc định là tiếng Việt nếu không tìm thấy
  const ngonNgu = danhSachNgonNguLoi[maNgonNgu] || danhSachNgonNguLoi.vi;

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#f97316 1px, transparent 1px),
            linear-gradient(90deg, #f97316 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <FloatingPart delay={0} x={20} y={30} />
      <FloatingPart delay={0.5} x={70} y={40} />
      <FloatingPart delay={1} x={30} y={60} />
      <FloatingPart delay={1.5} x={80} y={70} />
      <FloatingPart delay={2} x={15} y={50} />

      <BrokenGear className="absolute top-20 left-10 w-24 h-24 opacity-10" delay={0} />
      <BrokenGear className="absolute bottom-20 right-10 w-32 h-32 opacity-10" delay={2} />

      <div className="relative z-10 text-center px-4">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <BrokenGear className="w-full h-full" />
          <motion.div
            className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#f97316] rounded-full"
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="inline-block px-4 py-1.5 bg-[#f97316]/10 border border-[#f97316]/30 rounded-full text-[#f97316] text-sm font-medium">
            {ngonNgu.badge}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
        >
          {ngonNgu.title} <span className="text-[#f97316] italic">{ngonNgu.titleHighlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg mb-8 max-w-md mx-auto"
        >
          {ngonNgu.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            className="bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-[#020617] font-semibold px-6"
          >
            {/* Điều hướng về trang chủ đúng ngôn ngữ */}
            <Link href={`/${maNgonNgu}`}>
              <Home className="w-4 h-4 mr-2" />
              {ngonNgu.buttonHome}
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-[#334155] hover:border-[#f97316]/50 text-foreground bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {ngonNgu.buttonBack}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex justify-center gap-8 text-xs text-muted-foreground/50 font-mono"
        >
          <span>ERR_CODE: 404</span>
          <span>{ngonNgu.status}</span>
          <span>{ngonNgu.gearStatus}</span>
        </motion.div>
      </div>

      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[#334155]/30" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-[#334155]/30" />
    </div>
  )
}