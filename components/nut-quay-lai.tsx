"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

// Giao diện (interface) định nghĩa các thuộc tính truyền vào thành phần (Component props)
interface ThuocTinhNutQuayLai {
    /** Nhãn hiển thị cho nút (ví dụ: "Quay về Trang chủ", "Quay lại") */
    nhanHienThi: string;
    /** Mã ngôn ngữ hiện tại (ví dụ: "vi", "en") */
    ngonNgu: string;
}

export function NutQuayLai({ nhanHienThi, ngonNgu }: ThuocTinhNutQuayLai) {
    // Trình quản lý điều hướng của Next.js
    const boDinhTuyen = useRouter();

    // Biến trạng thái để kiểm tra quá trình gieo mã (hydration) đã hoàn tất chưa
    const [daTrangBiKetNoiKichBan, datTrangThaiTrangBi] = useState(false);

    // Sử dụng hiệu ứng phản ứng ngang (useEffect) để xác định phía máy khách (Client)
    useEffect(() => {
        datTrangThaiTrangBi(true);
    }, []);

    // Hàm xử lý logic khi người dùng nhấp (click) vào nút
    const xuLyNhanNutQuayLai = () => {
        // Sử dụng window.history.length > 1 làm điều kiện chính để quay lại trang trước
        // Điều kiện này bao quát cả các lệnh chuyển trang nội bộ qua Next.js router
        const coLichSuTrangTruoc = window.history.length > 1;

        if (coLichSuTrangTruoc) {
            // Nếu có lịch sử liên kết, quay lại trang trước đó
            boDinhTuyen.back();
        } else {
            // Nếu là liên kết trực tiếp (Direct Link), đẩy người dùng về trang chủ ngôn ngữ
            boDinhTuyen.push(`/${ngonNgu}`);
        }
    };

    // Để tránh lỗi Hydration (Gieo mã mâu thuẫn giữa Server và Client) 
    // Trả về một khối rỗng có cùng kích thước (hoặc nút vô hiệu) tới khi kết nối xong
    if (!daTrangBiKetNoiKichBan) {
        return (
            <button
                className="group inline-flex items-center gap-2 text-muted-foreground opacity-50 mb-10 cursor-default"
                type="button"
                aria-label={nhanHienThi}
                disabled
            >
                <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center bg-background/50">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest leading-none">
                    {nhanHienThi}
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={xuLyNhanNutQuayLai}
            className="group inline-flex items-center gap-2 text-muted-foreground hover:text-[#f97316] transition-colors mb-10"
            type="button"
            aria-label={nhanHienThi}
        >
            {/* Vòng tròn: ửng màu cam #f97316 khi di chuột chạm tới */}
            <div className="w-10 h-10 rounded-full border border-border bg-background/50 shadow-sm flex items-center justify-center group-hover:border-[#f97316] group-hover:bg-[#f97316]/10 transition-all duration-300">
                {/* Mũi tên: dịch chuyển nhẹ sang trái khi lướt chuột qua (group-hover:-translate-x-1) */}
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            </div>

            <span className="text-sm font-bold uppercase tracking-widest leading-none">
                {nhanHienThi}
            </span>
        </button>
    );
}