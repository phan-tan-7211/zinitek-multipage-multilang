const localizedTextFields = [
  { name: 'vi', title: 'Tiếng Việt', type: 'string' },
  { name: 'en', title: 'English', type: 'string' },
  { name: 'jp', title: '日本語', type: 'string' },
  { name: 'kr', title: '한국어', type: 'string' },
  { name: 'cn', title: '中文', type: 'string' },
]

const localizedLongTextFields = [
  { name: 'vi', title: 'Tiếng Việt', type: 'text', rows: 4 },
  { name: 'en', title: 'English', type: 'text', rows: 4 },
  { name: 'jp', title: '日本語', type: 'text', rows: 4 },
  { name: 'kr', title: '한국어', type: 'text', rows: 4 },
  { name: 'cn', title: '中文', type: 'text', rows: 4 },
]

export default {
  name: 'googleReviewsSettings',
  title: 'Đánh giá Google hiển thị trên website',
  type: 'document',
  description: 'Quản lý toàn bộ Google Maps, điểm đánh giá, tổng số đánh giá, nội dung giao diện và bản dịch đánh giá trong một mục duy nhất.',
  initialValue: {
    enabled: true,
    badge: {
      vi: 'Khách hàng',
      en: 'Testimonials',
      jp: 'お客様の声',
      kr: '고객 후기',
      cn: '客户见证',
    },
    titlePart1: {
      vi: 'Đối tác',
      en: 'Trusted',
      jp: '信頼される',
      kr: '신뢰할 수 있는',
      cn: '可靠的',
    },
    titleHighlight: {
      vi: 'tin cậy',
      en: 'Partners',
      jp: 'パートナー',
      kr: '파트너',
      cn: '合作伙伴',
    },
    description: {
      vi: 'Những đánh giá từ các đối tác đã đồng hành cùng ZINITEK trong nhiều năm qua.',
      en: 'Feedback from partners who have accompanied ZINITEK over the years.',
      jp: '長年にわたりZINITEKと共に歩んできたパートナー様からの評価をご紹介します。',
      kr: '수년 동안 ZINITEK과 함께해온 파트너사들의 소중한 평가입니다.',
      cn: '多年来与 ZINITEK 携手同行的合作伙伴给出的评价。',
    },
    reviewsLabel: {
      vi: 'đánh giá trên Google',
      en: 'reviews on Google',
      jp: 'Google のクチコミ',
      kr: 'Google 리뷰',
      cn: 'Google 评价',
    },
    viewGoogleLabel: {
      vi: 'Xem trên Google',
      en: 'View on Google',
      jp: 'Googleで見る',
      kr: 'Google에서 보기',
      cn: '在 Google 上查看',
    },
    googleRating: 5,
    googleReviews: [
      {
        _key: 'tran-quoc-bao',
        author: 'Trần Quốc Bảo',
        rating: 5,
        content: {
          vi: 'Đã đặt gia công lô hàng chi tiết máy CNC và khuôn mẫu bên công ty. Sản phẩm hoàn thiện tốt, đúng như bản vẽ kỹ thuật. Thời gian giao hàng nhanh hơn dự kiến. Rất hài lòng.',
          en: 'We ordered a batch of CNC machined parts and molds from the company. The finished products were very good and matched the technical drawings accurately. Delivery was faster than expected. Very satisfied.',
          jp: 'CNC加工部品と金型のロットを依頼しました。仕上がりは非常に良く、技術図面どおりでした。納期も予定より早く、大変満足しています。',
          kr: 'CNC 가공 부품과 금형 제작을 의뢰했습니다. 완성 품질이 매우 좋았고 기술 도면과 정확히 일치했습니다. 납기도 예상보다 빨라 매우 만족합니다.',
          cn: '我们委托公司加工了一批 CNC 零件和模具。成品质量很好，与技术图纸完全一致，交货时间也比预期更快，非常满意。',
        },
      },
      {
        _key: 'nguyen-mai-anh',
        author: 'Nguyễn Mai Anh',
        rating: 5,
        content: {
          vi: 'Đội ngũ tư vấn nhiệt tình và hỗ trợ giải pháp kỹ thuật rất tối ưu, giúp bên mình tiết kiệm được khá nhiều chi phí vật liệu. Quy trình làm việc rõ ràng, tiến độ đảm bảo đúng cam kết. Sẽ tiếp tục hợp tác lâu dài trong các dự án tới.',
          en: 'The consulting team was enthusiastic and proposed highly optimized technical solutions, helping us save significantly on material costs. The workflow was clear and the schedule was delivered as committed. We look forward to continuing long-term cooperation on future projects.',
          jp: 'コンサルティングチームは非常に親身で、最適な技術提案により材料コストを大幅に削減できました。業務プロセスも明確で、納期も約束どおりでした。今後のプロジェクトでも長期的に協力していきたいです。',
          kr: '상담팀이 매우 친절했고 최적화된 기술 솔루션을 제안해 자재비를 크게 절감할 수 있었습니다. 업무 절차가 명확하고 일정도 약속대로 지켜졌습니다. 앞으로의 프로젝트에서도 장기적으로 협력하고 싶습니다.',
          cn: '顾问团队非常热情，并提供了高度优化的技术方案，帮助我们节省了不少材料成本。工作流程清晰，进度也完全按承诺执行。今后的项目中会继续长期合作。',
        },
      },
      {
        _key: 'david-le',
        author: 'David Le',
        rating: 5,
        content: {
          vi: 'Dịch vụ tuyệt vời! Sản phẩm chất lượng cao, đóng gói cẩn thận và giá cả rất hợp lý so với mặt bằng chung. 5 sao cho thái độ phục vụ và năng lực sản xuất của công ty.',
          en: 'Excellent service! The products are high quality, carefully packaged, and very reasonably priced compared with the market. Five stars for the company’s service attitude and manufacturing capability.',
          jp: '素晴らしいサービスです。製品は高品質で梱包も丁寧、価格も市場相場と比べて非常に良心的です。対応姿勢と生産能力の両方に5つ星です。',
          kr: '훌륭한 서비스입니다. 제품 품질이 높고 포장도 꼼꼼하며 시장 평균과 비교해 가격도 매우 합리적입니다. 서비스 태도와 생산 역량 모두 별 5개입니다.',
          cn: '服务非常出色！产品质量高、包装细致，与市场平均水平相比价格也非常合理。公司的服务态度和生产能力都值得五星好评。',
        },
      },
    ],
  },
  fields: [
    { name: 'enabled', title: 'Hiển thị khối Google Reviews', type: 'boolean', initialValue: true },
    { name: 'badge', title: 'Nhãn nhỏ · 5 ngôn ngữ', type: 'object', fields: localizedTextFields },
    { name: 'titlePart1', title: 'Tiêu đề phần 1 · 5 ngôn ngữ', type: 'object', fields: localizedTextFields },
    { name: 'titleHighlight', title: 'Tiêu đề nhấn mạnh · 5 ngôn ngữ', type: 'object', fields: localizedTextFields },
    { name: 'description', title: 'Mô tả · 5 ngôn ngữ', type: 'object', fields: localizedLongTextFields.map((field) => ({ ...field, rows: 2 })) },
    { name: 'reviewsLabel', title: 'Nhãn số lượng đánh giá · 5 ngôn ngữ', type: 'object', fields: localizedTextFields },
    { name: 'viewGoogleLabel', title: 'Nút xem trên Google · 5 ngôn ngữ', type: 'object', fields: localizedTextFields },
    {
      name: 'googleMapsUrl',
      title: 'Liên kết Google Maps',
      type: 'url',
      description: 'Dán link Share từ Google Maps. Người dùng bấm địa chỉ hoặc nút MAP sẽ mở link này.',
      validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'googleRating',
      title: 'Điểm đánh giá Google',
      type: 'number',
      description: 'Ví dụ: 5 hoặc 4.9. Chỉ dùng để hiển thị, không gọi Google API.',
      validation: (Rule: any) => Rule.min(0).max(5),
    },
    {
      name: 'googleReviewCount',
      title: 'Tổng số đánh giá Google',
      type: 'number',
      description: 'Ví dụ: 20. Cập nhật thủ công khi số lượng trên Google thay đổi.',
      validation: (Rule: any) => Rule.min(0).integer(),
    },
    {
      name: 'googleReviews',
      title: 'Đánh giá Google hiển thị trên website',
      type: 'array',
      description: 'Mỗi đánh giá nhập một lần và quản lý luôn 5 bản dịch Việt / Anh / Nhật / Hàn / Trung.',
      of: [
        {
          type: 'object',
          name: 'googleReview',
          title: 'Đánh giá Google',
          fields: [
            { name: 'author', title: 'Tên người đánh giá', type: 'string', validation: (Rule: any) => Rule.required().max(100) },
            { name: 'rating', title: 'Số sao', type: 'number', initialValue: 5, validation: (Rule: any) => Rule.min(1).max(5) },
            {
              name: 'content',
              title: 'Nội dung đánh giá · 5 ngôn ngữ',
              type: 'object',
              description: 'Tiếng Việt là nội dung gốc hiện tại; các ô còn lại là bản dịch hiển thị theo ngôn ngữ website.',
              fields: localizedLongTextFields,
              validation: (Rule: any) => Rule.required(),
            },
            { name: 'meta', title: 'Thông tin phụ', type: 'string', description: 'Ví dụ: Local Guide · 3 reviews' },
            { name: 'reviewUrl', title: 'Link đánh giá trên Google', type: 'url', validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }) },
          ],
          preview: {
            select: { title: 'author', subtitle: 'content.vi', rating: 'rating' },
            prepare({ title, subtitle, rating }: any) {
              return { title: `${title || 'Google user'} · ${rating || 5}★`, subtitle }
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: 'Đánh giá Google hiển thị trên website' }
    },
  },
}
