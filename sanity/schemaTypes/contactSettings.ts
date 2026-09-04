const localizedStringFields = [
  { name: 'vi', title: 'Tiếng Việt', type: 'string' },
  { name: 'en', title: 'English', type: 'string' },
  { name: 'jp', title: '日本語', type: 'string' },
  { name: 'kr', title: '한국어', type: 'string' },
  { name: 'cn', title: '中文', type: 'string' },
]

const localizedTextFields = [
  { name: 'vi', title: 'Tiếng Việt', type: 'text', rows: 3 },
  { name: 'en', title: 'English', type: 'text', rows: 3 },
  { name: 'jp', title: '日本語', type: 'text', rows: 3 },
  { name: 'kr', title: '한국어', type: 'text', rows: 3 },
  { name: 'cn', title: '中文', type: 'text', rows: 3 },
]

const localized = (name: string, title: string, text = false) => ({
  name,
  title,
  type: 'object',
  fields: text ? localizedTextFields : localizedStringFields,
})

const formFields = [
  { name: 'step', title: 'Nhãn bước', type: 'string' },
  { name: 'infoTitle', title: 'Tiêu đề bước 1', type: 'string' },
  { name: 'serviceTitle', title: 'Tiêu đề bước 2', type: 'string' },
  { name: 'fileTitle', title: 'Tiêu đề bước 3', type: 'string' },
  { name: 'nameLabel', title: 'Nhãn họ tên', type: 'string' },
  { name: 'companyLabel', title: 'Nhãn công ty', type: 'string' },
  { name: 'emailLabel', title: 'Nhãn email', type: 'string' },
  { name: 'phoneLabel', title: 'Nhãn điện thoại', type: 'string' },
  { name: 'serviceLabel', title: 'Nhãn dịch vụ', type: 'string' },
  { name: 'messageLabel', title: 'Nhãn mô tả', type: 'string' },
  { name: 'fileLabel', title: 'Nhãn file', type: 'string' },
  { name: 'namePlaceholder', title: 'Placeholder họ tên', type: 'string' },
  { name: 'companyPlaceholder', title: 'Placeholder công ty', type: 'string' },
  { name: 'emailPlaceholder', title: 'Placeholder email', type: 'string' },
  { name: 'phonePlaceholder', title: 'Placeholder điện thoại', type: 'string' },
  { name: 'servicePlaceholder', title: 'Placeholder dịch vụ', type: 'string' },
  { name: 'messagePlaceholder', title: 'Placeholder mô tả', type: 'string' },
  { name: 'fileHint', title: 'Hướng dẫn tải file', type: 'string' },
  { name: 'fileTypes', title: 'Định dạng file', type: 'string' },
  { name: 'next', title: 'Nút tiếp theo', type: 'string' },
  { name: 'prev', title: 'Nút quay lại', type: 'string' },
  { name: 'submit', title: 'Nút gửi', type: 'string' },
  { name: 'success', title: 'Thông báo thành công', type: 'string' },
  { name: 'required', title: 'Thông báo thiếu dữ liệu', type: 'string' },
  { name: 'error', title: 'Thông báo lỗi', type: 'string' },
  { name: 'services', title: 'Danh sách dịch vụ', type: 'array', of: [{ type: 'string' }] },
]

const initialValue = {
  enabled: true,
  badge: { vi: 'Liên hệ', en: 'Contact', jp: 'お問い合わせ', kr: '문의', cn: '联系我们' },
  title: { vi: 'Yêu cầu', en: 'Request a', jp: 'お見積り', kr: '요청', cn: '索取' },
  titleHighlight: { vi: 'báo giá', en: 'Quote', jp: '依頼', kr: '견적', cn: '报价' },
  description: {
    vi: 'Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn.',
    en: 'Contact us now for a free consultation and a detailed quote for your project.',
    jp: '無料相談およびお客様のプロジェクトの詳細な見積もりについては、今すぐお問い合わせください。',
    kr: '지금 바로 연락하여 무료 상담과 상세 견적을 받아보세요.',
    cn: '立即联系以获取免费咨询及您项目的详细报价。',
  },
  workingHoursTitle: { vi: 'Giờ làm việc', en: 'Working Hours', jp: '営業時間', kr: '근무 시간', cn: '工作时间' },
  workingHours: [
    { _key: 'weekday', enabled: true, label: { vi: 'Thứ 2 - Thứ 6', en: 'Monday - Friday', jp: '月曜日 - 金曜日', kr: '월요일 - 금요일', cn: '周一至周五' }, value: { common: '7:30 - 17:00' }, accent: false },
    { _key: 'saturday', enabled: true, label: { vi: 'Thứ 7', en: 'Saturday', jp: '土曜日', kr: '토요일', cn: '周六' }, value: { common: '7:30 - 12:00' }, accent: false },
    { _key: 'sunday', enabled: true, label: { vi: 'Chủ nhật', en: 'Sunday', jp: '日曜日', kr: '일요일', cn: '周日' }, value: { vi: 'Nghỉ', en: 'Closed', jp: '定休日', kr: '휴무', cn: '休息' }, accent: true },
  ],
  form: {
    vi: { step:'Bước', infoTitle:'Thông tin liên hệ', serviceTitle:'Dịch vụ quan tâm', fileTitle:'Đính kèm tài liệu', nameLabel:'Họ và tên *', companyLabel:'Công ty', emailLabel:'Email *', phoneLabel:'Số điện thoại *', serviceLabel:'Chọn dịch vụ *', messageLabel:'Mô tả yêu cầu', fileLabel:'Đính kèm bản vẽ CAD/3D (tùy chọn)', namePlaceholder:'Nguyễn Văn A', companyPlaceholder:'Tên công ty', emailPlaceholder:'email@company.com', phonePlaceholder:'0912 345 678', servicePlaceholder:'-- Chọn dịch vụ --', messagePlaceholder:'Mô tả chi tiết về dự án...', fileHint:'Kéo thả file hoặc click để chọn', fileTypes:'Hỗ trợ: DWG, DXF, STEP, IGES, STL, PDF (Max 50MB)', next:'Tiếp theo', prev:'Quay lại', submit:'Gửi yêu cầu', success:'Cảm ơn bạn! Chúng tôi sẽ liên hệ trong 24 giờ.', required:'Vui lòng điền đầy đủ các thông tin bắt buộc!', error:'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.', services:['Gia công CNC chính xác','Thiết kế khuôn mẫu','PLC & Tự động hóa','Lắp ráp điện tử','CNTT & Phần mềm CN','Khác'] },
    en: { step:'Step', infoTitle:'Contact Information', serviceTitle:'Service of Interest', fileTitle:'Document Attachment', nameLabel:'Full Name *', companyLabel:'Company', emailLabel:'Email *', phoneLabel:'Phone Number *', serviceLabel:'Select Service *', messageLabel:'Requirement Description', fileLabel:'Attach CAD/3D Drawings (Optional)', namePlaceholder:'John Doe', companyPlaceholder:'Company Name', emailPlaceholder:'email@company.com', phonePlaceholder:'0912 345 678', servicePlaceholder:'-- Select Service --', messagePlaceholder:'Detailed project description...', fileHint:'Drag & drop files or click to upload', fileTypes:'Supports: DWG, DXF, STEP, IGES, STL, PDF (Max 50MB)', next:'Next', prev:'Back', submit:'Submit Request', success:'Thank you! We will contact you within 24 hours.', required:'Please complete all required fields.', error:'Unable to connect to the server. Please try again later.', services:['Precision CNC Machining','Mold Design & Manufacturing','PLC & Automation','Electronic Assembly','IT & Industrial Software','Others'] },
    jp: { step:'ステップ', infoTitle:'連絡先情報', serviceTitle:'ご関心のあるサービス', fileTitle:'資料添付', nameLabel:'お名前 *', companyLabel:'貴社名', emailLabel:'メールアドレス *', phoneLabel:'電話番号 *', serviceLabel:'サービスを選択 *', messageLabel:'ご要望の詳細', fileLabel:'CAD/3D図面添付 (任意)', namePlaceholder:'例：山田 太郎', companyPlaceholder:'株式会社〇〇', emailPlaceholder:'email@company.com', phonePlaceholder:'090 1234 5678', servicePlaceholder:'-- サービスを選択 --', messagePlaceholder:'プロジェクトの詳細についてご記入ください...', fileHint:'ファイルをドラッグ＆ドロップ、またはクリックして選択', fileTypes:'対応フォーマット: DWG, DXF, STEP, IGES, STL, PDF (最大 50MB)', next:'次へ', prev:'戻る', submit:'送信する', success:'ありがとうございます。24時間以内に担当者よりご連絡いたします。', required:'必須項目をすべて入力してください。', error:'サーバーに接続できません。後でもう一度お試しください。', services:['精密CNC加工','金型設計・製作','PLC ＆ 自動化','電子機器組立','IT ＆ 産業用ソフトウェア','その他'] },
    kr: { step:'단계', infoTitle:'연락처 정보', serviceTitle:'관심 서비스', fileTitle:'자료 첨부', nameLabel:'성명 *', companyLabel:'회사명', emailLabel:'이메일 *', phoneLabel:'전화번호 *', serviceLabel:'서비스 선택 *', messageLabel:'요청 설명', fileLabel:'CAD/3D 도면 첨부 (선택 사항)', namePlaceholder:'김철수', companyPlaceholder:'회사명', emailPlaceholder:'email@company.com', phonePlaceholder:'010-1234-5678', servicePlaceholder:'-- 서비스 선택 --', messagePlaceholder:'프로젝트에 대한 상세 설명...', fileHint:'파일을 드래그하거나 클릭하여 선택', fileTypes:'지원 형식: DWG, DXF, STEP, IGES, STL, PDF (최대 50MB)', next:'다음', prev:'뒤로', submit:'요청 보내기', success:'감사합니다! 24시간 내에 연락드리겠습니다.', required:'필수 정보를 모두 입력해 주세요.', error:'서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.', services:['정밀 CNC 가공','금형 설계','PLC & 자동화','전자 조립','IT & 산업용 소프트웨어','기타'] },
    cn: { step:'步骤', infoTitle:'联系信息', serviceTitle:'感兴趣的服务', fileTitle:'附件材料', nameLabel:'姓名 *', companyLabel:'公司名称', emailLabel:'电子邮箱 *', phoneLabel:'电话号码 *', serviceLabel:'选择服务 *', messageLabel:'需求描述', fileLabel:'上传 CAD/3D 图纸 (可选)', namePlaceholder:'张三', companyPlaceholder:'您的公司名称', emailPlaceholder:'email@company.com', phonePlaceholder:'0912 345 678', servicePlaceholder:'-- 请选择服务 --', messagePlaceholder:'请详细描述您的项目需求...', fileHint:'拖拽文件或点击选择', fileTypes:'支持格式：DWG, DXF, STEP, IGES, STL, PDF (最大 50MB)', next:'下一步', prev:'返回', submit:'提交申请', success:'谢谢！我们将在 24 小时内与您联系。', required:'请填写所有必填信息。', error:'无法连接服务器，请稍后再试。', services:['精密 CNC 加工','模具设计与制造','PLC 与 自动化','电子组装','IT 与 工业软件','其他'] },
  },
}

export default {
  name: 'contactSettings',
  title: 'Liên hệ & Form báo giá',
  type: 'document',
  description: 'Dữ liệu động cho Liên hệ, giờ làm việc và form báo giá. Giá trị mặc định lấy từ commit 7cca679.',
  initialValue,
  fields: [
    { name: 'enabled', title: 'Hiển thị khu vực Liên hệ', type: 'boolean', initialValue: true },
    localized('badge', 'Nhãn Liên hệ · 5 ngôn ngữ'),
    localized('title', 'Tiêu đề · 5 ngôn ngữ'),
    localized('titleHighlight', 'Tiêu đề nhấn mạnh · 5 ngôn ngữ'),
    localized('description', 'Mô tả · 5 ngôn ngữ', true),
    localized('workingHoursTitle', 'Tiêu đề Giờ làm việc · 5 ngôn ngữ'),
    { name: 'workingHours', title: 'Giờ làm việc', type: 'array', description: 'Thêm/xóa/đổi thứ tự tùy ý. Dòng tắt hoặc không có giá trị sẽ tự ẩn.', of: [{ type: 'object', name: 'workingHourRow', fields: [
      { name: 'enabled', title: 'Hiển thị', type: 'boolean', initialValue: true },
      localized('label', 'Tên ngày · 5 ngôn ngữ'),
      { name: 'value', title: 'Giờ / trạng thái', type: 'object', description: 'Giờ giống nhau thì nhập ô Chung. Trạng thái chữ như Nghỉ/Closed nhập theo 5 ngôn ngữ.', fields: [{ name: 'common', title: 'Chung cho mọi ngôn ngữ', type: 'string' }, ...localizedStringFields] },
      { name: 'accent', title: 'Nhấn màu cam', type: 'boolean', initialValue: false },
    ], preview: { select: { title: 'label.vi', common: 'value.common', vi: 'value.vi', enabled: 'enabled' }, prepare({ title, common, vi, enabled }: any) { return { title: title || 'Giờ làm việc', subtitle: `${enabled === false ? 'Ẩn · ' : ''}${common || vi || ''}` } } } }] },
    { name: 'form', title: 'Form báo giá · 5 ngôn ngữ', type: 'object', fields: [
      { name: 'vi', title: 'Tiếng Việt', type: 'object', fields: formFields },
      { name: 'en', title: 'English', type: 'object', fields: formFields },
      { name: 'jp', title: '日本語', type: 'object', fields: formFields },
      { name: 'kr', title: '한국어', type: 'object', fields: formFields },
      { name: 'cn', title: '中文', type: 'object', fields: formFields },
    ] },
  ],
  preview: { prepare() { return { title: 'Liên hệ & Form báo giá' } } },
}
