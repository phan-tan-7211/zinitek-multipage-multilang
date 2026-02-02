export type ServiceIconName = "cog" | "box" | "scan-line" | "cpu" | "circle-dot" | "circuit-board" | "monitor"

export interface Service {
  slug: string
  icon: ServiceIconName
  title: string
  shortTitle: string
  description: string
  image: string
  tags: string[]
  features: string[]
  specs: { label: string; value: string }[]
  process: { step: number; title: string; description: string }[]
}

export const services: Service[] = [
  {
    slug: "cnc",
    icon: "cog",
    title: "Gia công CNC chính xác",
    shortTitle: "CNC",
    description: "Phay, Tiện, Cắt dây EDM với độ chính xác dưới 0.005mm. Đáp ứng tiêu chuẩn khắt khe của thị trường Nhật Bản.",
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
    tags: ["Phay CNC", "Tiện CNC", "EDM", "5-Axis"],
    features: [
      "Phay CNC 3, 4, 5 trục với độ chính xác cao",
      "Tiện CNC cho các chi tiết tròn xoay",
      "Cắt dây EDM cho các chi tiết phức tạp",
      "Gia công kim loại: thép, nhôm, đồng, titanium",
      "Kiểm tra chất lượng CMM 3D",
    ],
    specs: [
      { label: "Dung sai", value: "±0.005mm" },
      { label: "Kích thước tối đa", value: "1500 x 800 x 600mm" },
      { label: "Độ nhám bề mặt", value: "Ra 0.4" },
      { label: "Số máy CNC", value: "15+ máy" },
    ],
    process: [
      { step: 1, title: "Nhận bản vẽ", description: "Tiếp nhận file CAD/CAM từ khách hàng" },
      { step: 2, title: "Phân tích kỹ thuật", description: "Đánh giá độ khả thi và lập quy trình gia công" },
      { step: 3, title: "Lập trình CAM", description: "Tạo chương trình gia công tối ưu" },
      { step: 4, title: "Gia công", description: "Thực hiện gia công trên máy CNC" },
      { step: 5, title: "Kiểm tra QC", description: "Đo kiểm CMM và xuất báo cáo" },
    ],
  },
  {
    slug: "molds",
    icon: "box",
    title: "Thiết kế khuôn mẫu",
    shortTitle: "Khuôn mẫu",
    description: "Thiết kế và chế tạo khuôn dập nguội chính xác cho ngành công nghiệp ô tô, điện tử và thiết bị gia dụng.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    tags: ["Khuôn dập", "Khuôn ép", "CAD/CAM", "Progressive Die"],
    features: [
      "Thiết kế khuôn dập nguội progressive",
      "Khuôn ép nhựa chính xác",
      "Khuôn đúc áp lực",
      "Mô phỏng CAE để tối ưu thiết kế",
      "Sản xuất pilot run và mass production",
    ],
    specs: [
      { label: "Kích thước khuôn", value: "Đến 2000mm" },
      { label: "Độ cứng xử lý", value: "HRC 58-62" },
      { label: "Tuổi thọ khuôn", value: "1M+ shots" },
      { label: "Thời gian giao hàng", value: "4-8 tuần" },
    ],
    process: [
      { step: 1, title: "Thiết kế 3D", description: "Tạo mô hình 3D chi tiết bằng Solidworks/Creo" },
      { step: 2, title: "Mô phỏng CAE", description: "Phân tích dòng chảy và biến dạng" },
      { step: 3, title: "Gia công khuôn", description: "CNC, EDM, mài chính xác" },
      { step: 4, title: "Lắp ráp", description: "Lắp ráp và căn chỉnh khuôn" },
      { step: 5, title: "Thử khuôn", description: "Trial run và điều chỉnh" },
    ],
  },
  {
    slug: "3d-scan",
    icon: "scan-line",
    title: "Quét 3D & Phân tích ngược",
    shortTitle: "3D Scan",
    description: "Dịch vụ quét 3D và reverse engineering sử dụng Geomagic Design X, chuyển đổi mẫu vật thành bản vẽ CAD.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    tags: ["3D Scan", "Geomagic", "Reverse Engineering", "Point Cloud"],
    features: [
      "Quét 3D độ phân giải cao",
      "Xử lý point cloud chuyên nghiệp",
      "Chuyển đổi sang CAD parametric",
      "So sánh scan-to-CAD",
      "Kiểm tra độ biến dạng sản phẩm",
    ],
    specs: [
      { label: "Độ chính xác quét", value: "±0.02mm" },
      { label: "Độ phân giải", value: "0.05mm" },
      { label: "Phạm vi quét", value: "50mm - 3000mm" },
      { label: "Định dạng xuất", value: "STEP, IGES, STL" },
    ],
    process: [
      { step: 1, title: "Chuẩn bị mẫu", description: "Làm sạch và đánh dấu target" },
      { step: 2, title: "Quét 3D", description: "Thu thập dữ liệu point cloud" },
      { step: 3, title: "Xử lý dữ liệu", description: "Làm sạch và ghép nối mesh" },
      { step: 4, title: "Tạo CAD", description: "Chuyển đổi sang mô hình parametric" },
      { step: 5, title: "Kiểm tra", description: "So sánh và xuất báo cáo" },
    ],
  },
  {
    slug: "plc",
    icon: "cpu",
    title: "PLC & Tự động hóa",
    shortTitle: "PLC",
    description: "Lập trình và tích hợp hệ thống PLC Mitsubishi, Siemens. Giải pháp tự động hóa toàn diện cho nhà máy.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    tags: ["Mitsubishi", "Siemens", "HMI", "SCADA"],
    features: [
      "Lập trình PLC Mitsubishi, Siemens, Omron",
      "Thiết kế giao diện HMI/SCADA",
      "Tích hợp robot công nghiệp",
      "Hệ thống MES và IoT",
      "Bảo trì và nâng cấp hệ thống",
    ],
    specs: [
      { label: "Hãng PLC", value: "Mitsubishi, Siemens, Omron" },
      { label: "Số I/O tối đa", value: "10,000+" },
      { label: "Thời gian xử lý", value: "<1ms" },
      { label: "Uptime", value: "99.9%" },
    ],
    process: [
      { step: 1, title: "Khảo sát", description: "Đánh giá hiện trạng và yêu cầu" },
      { step: 2, title: "Thiết kế", description: "Lập sơ đồ điều khiển và logic" },
      { step: 3, title: "Lập trình", description: "Viết chương trình PLC và HMI" },
      { step: 4, title: "Thi công", description: "Lắp đặt và đấu nối thiết bị" },
      { step: 5, title: "Nghiệm thu", description: "Test và training vận hành" },
    ],
  },
  {
    slug: "coils",
    icon: "circle-dot",
    title: "Cuộn dây đồng",
    shortTitle: "Cuộn dây",
    description: "Sản xuất cuộn dây Toroidal, biến áp, cuộn cảm chất lượng cao cho ngành điện tử và năng lượng.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebb6122?w=800&q=80",
    tags: ["Toroidal", "Biến áp", "Cuộn cảm", "Inductor"],
    features: [
      "Cuộn dây Toroidal các loại",
      "Biến áp nguồn switching",
      "Cuộn cảm công suất lớn",
      "Choke filter EMI/EMC",
      "Cuộn dây theo yêu cầu đặc biệt",
    ],
    specs: [
      { label: "Đường kính dây", value: "0.05mm - 3mm" },
      { label: "Công suất", value: "1W - 10kW" },
      { label: "Tần số", value: "50Hz - 500kHz" },
      { label: "Tiêu chuẩn", value: "IEC, UL, CE" },
    ],
    process: [
      { step: 1, title: "Thiết kế", description: "Tính toán điện từ và chọn vật liệu" },
      { step: 2, title: "Chuẩn bị lõi", description: "Xử lý lõi ferrite/sắt silic" },
      { step: 3, title: "Quấn dây", description: "Quấn dây tự động/bán tự động" },
      { step: 4, title: "Hàn kết nối", description: "Hàn terminal và đầu dây" },
      { step: 5, title: "Test điện", description: "Kiểm tra thông số điện" },
    ],
  },
  {
    slug: "ems",
    icon: "circuit-board",
    title: "Lắp ráp điện tử (EMS)",
    shortTitle: "EMS",
    description: "Dịch vụ EMS lắp ráp PCB, SMT với kiểm soát chất lượng nghiêm ngặt. Hỗ trợ từ prototype đến sản xuất hàng loạt.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    tags: ["PCB", "SMT", "THT", "Box Build"],
    features: [
      "Lắp ráp SMT tốc độ cao",
      "Lắp ráp THT (xuyên lỗ)",
      "Box build và cable assembly",
      "AOI và X-ray inspection",
      "Burn-in và functional test",
    ],
    specs: [
      { label: "Chip nhỏ nhất", value: "01005 (0.4x0.2mm)" },
      { label: "Tốc độ SMT", value: "50,000 CPH" },
      { label: "Số layer PCB", value: "Đến 20 layers" },
      { label: "Tiêu chuẩn", value: "IPC-A-610 Class 3" },
    ],
    process: [
      { step: 1, title: "NPI", description: "Phân tích BOM và thiết kế stencil" },
      { step: 2, title: "In kem hàn", description: "In solder paste chính xác" },
      { step: 3, title: "Đặt linh kiện", description: "Pick & place tốc độ cao" },
      { step: 4, title: "Hàn reflow", description: "Hàn trong lò reflow" },
      { step: 5, title: "Kiểm tra", description: "AOI, ICT, functional test" },
    ],
  },
  {
    slug: "it-software",
    icon: "monitor",
    title: "CNTT & Phần mềm CN",
    shortTitle: "IT/Software",
    description: "Cài đặt, training Mastercam, Solidworks, Creo. Sửa chữa máy tính công nghiệp và hệ thống mạng nhà máy.",
    image: "https://images.unsplash.com/photo-1537432376149-e84978a29b5a?w=800&q=80",
    tags: ["Mastercam", "Solidworks", "Creo", "Industrial IT"],
    features: [
      "Cài đặt và bản quyền CAD/CAM",
      "Training Mastercam, Solidworks, Creo",
      "Sửa chữa máy tính công nghiệp",
      "Thiết kế hệ thống mạng nhà máy",
      "Tư vấn chuyển đổi số",
    ],
    specs: [
      { label: "Phần mềm CAD", value: "Solidworks, Creo, NX" },
      { label: "Phần mềm CAM", value: "Mastercam, PowerMill" },
      { label: "OS hỗ trợ", value: "Windows, Linux" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
    process: [
      { step: 1, title: "Khảo sát", description: "Đánh giá nhu cầu và hạ tầng" },
      { step: 2, title: "Tư vấn", description: "Đề xuất giải pháp phù hợp" },
      { step: 3, title: "Triển khai", description: "Cài đặt và cấu hình" },
      { step: 4, title: "Training", description: "Đào tạo sử dụng" },
      { step: 5, title: "Hỗ trợ", description: "Bảo hành và support" },
    ],
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

export function getServiceSlugs(): string[] {
  return services.map((s) => s.slug)
}
