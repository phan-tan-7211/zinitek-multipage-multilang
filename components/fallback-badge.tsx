
// COMPONENT FALLBACK BADGE
// Mục đích: Hiển thị nhãn thông báo khi nội dung đang dùng bản dịch dự phòng
// Ví dụ: Đang xem trang JP nhưng không có bản JP → hiển thị "EN Version"

interface FallbackBadgeProps {
    /** Ngôn ngữ thực tế của tài liệu đang hiển thị */
    ngonNguThucTe: string;
    /** Ngôn ngữ mà người dùng đang chọn trên website */
    ngonNguNguoiDung: string;
}

/**
 * Ánh xạ mã ngôn ngữ sang tên hiển thị thân thiện
 */
const tenNgonNgu: Record<string, string> = {
    vi: 'VI',
    en: 'EN',
    cn: 'CN',
    jp: 'JP',
    kr: 'KR',
};

/**
 * Badge hiển thị phiên bản ngôn ngữ dự phòng.
 * Chỉ render khi ngôn ngữ tài liệu KHÁC ngôn ngữ người dùng.
 */
export function FallbackBadge({ ngonNguThucTe, ngonNguNguoiDung }: FallbackBadgeProps) {
    // Không hiển thị nếu đúng ngôn ngữ
    if (!ngonNguThucTe || ngonNguThucTe === ngonNguNguoiDung) return null;

    const nhanHienThi = tenNgonNgu[ngonNguThucTe] || ngonNguThucTe.toUpperCase();

    return (
        <div
            className="absolute top-0 right-0 bg-[#f97316] text-[#020617] text-[10px] px-2 py-1 font-bold uppercase tracking-tighter opacity-80 z-10"
            title={`Bản dịch ${nhanHienThi} đang được dùng làm dự phòng`}
            aria-label={`Nội dung hiển thị phiên bản ${nhanHienThi}`}
        >
            {nhanHienThi} Version
        </div>
    );
}
