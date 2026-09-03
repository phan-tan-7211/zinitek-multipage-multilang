export default {
  name: 'organizationSettings',
  title: 'Doanh nghiệp & SEO địa phương',
  type: 'document',
  description: 'Thông tin pháp lý và địa lý dùng cho Google, Schema.org và SEO địa phương. Không chứa dữ liệu thương hiệu hard-code trong framework.',
  fields: [
    { name: 'legalName', title: 'Tên pháp lý doanh nghiệp', type: 'string', description: 'Tên đăng ký pháp lý. Có thể khác tên thương hiệu hiển thị.' },
    { name: 'countryCode', title: 'Mã quốc gia ISO', type: 'string', description: 'Ví dụ: VN, JP, KR, US. Dùng cho Schema.org PostalAddress.', validation: (Rule: any) => Rule.regex(/^[A-Z]{2}$/, { name: 'ISO alpha-2' }) },
    { name: 'taxId', title: 'Mã số thuế / Tax ID', type: 'string' },
    { name: 'foundingDate', title: 'Ngày thành lập', type: 'date' },
    { name: 'priceRange', title: 'Khoảng giá Schema.org', type: 'string', description: 'Không bắt buộc. Ví dụ: $$ hoặc Liên hệ báo giá.' },
    {
      name: 'businessType',
      title: 'Loại doanh nghiệp Schema.org',
      type: 'string',
      initialValue: 'Organization',
      options: { list: [
        { title: 'Organization', value: 'Organization' },
        { title: 'LocalBusiness', value: 'LocalBusiness' },
        { title: 'ProfessionalService', value: 'ProfessionalService' },
        { title: 'Store', value: 'Store' },
      ] },
    },
  ],
  preview: { prepare() { return { title: 'Doanh nghiệp & SEO địa phương' } } },
}
