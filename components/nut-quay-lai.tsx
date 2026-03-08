"use client"

/**
 * MỤC ĐÍCH: Nút quay lại thông minh cho dự án Zinitek.
 * 1. Nếu có lịch sử trang trước: Quay lại trang đó (giữ đúng vị trí cũ của khách).
 * 2. Nếu truy cập trực tiếp (Direct Link): Tự động quay về Trang Chủ theo ngôn ngữ.
 */

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface NutQuayLaiProps {
    /** Nhãn hiển thị (ví dụ: "TRANG CHỦ" hoặc "HOME") - lấy từ Dictionary tại server component */
    nhanHienThi: string;
    /** Mã ngôn ngữ hiện tại (vi/en/jp) để điều hướng khi không có lịch sử */
    ngonNgu: string;
}

export function NutQuayLai({ nhanHienThi, ngonNgu }: NutQuayLaiProps) {
    const router = useRouter()

    const xuLyQuayLai = () => {
        // Kiểm tra xem trang trước đó có cùng thuộc website của mình không
        // Bổ sung thêm kiểm tra window.history.length > 1 để chắc chắn có trang để quay lại
        const coLichSuTrangTruoc = 
            typeof window !== 'undefined' && 
            document.referrer.includes(window.location.host) && 
            window.history.length > 1;

        if (coLichSuTrangTruoc) {
            // Nếu có lịch sử, quay lại trang vừa xem (ví dụ: trang Sản phẩm)
            router.back();
        } else {
            // Nếu dán link trực tiếp, đẩy về Trang chủ của ngôn ngữ đó
            // Đảm bảo đường dẫn luôn bắt đầu bằng dấu /
            router.push(`/${ngonNgu}`);
        }
    }

    return (
        <button
            onClick={xuLyQuayLai}
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-[#f97316] transition-colors mb-10"
            type="button"
            aria-label={nhanHienThi}
        >
            {/* Vòng tròn chứa icon mũi tên - Thiết kế chuẩn Zinitek */}
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#f97316]/50 group-hover:bg-[#f97316]/5 transition-all">
                <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            
            <span className="text-sm font-bold uppercase tracking-widest leading-none">
                {nhanHienThi}
            </span>
        </button>
    )
}