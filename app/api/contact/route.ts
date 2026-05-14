import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const service = formData.get('service') as string;
    const message = formData.get('message') as string;
    const file = formData.get('file') as File | null;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc (Tên, Email, SĐT)' },
        { status: 400 }
      );
    }

    // Cấu hình transporter (Lấy thông tin từ biến môi trường)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Chuẩn bị danh sách file đính kèm
    const attachments = [];
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    // Nội dung Email dạng HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f97316; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">YÊU CẦU LIÊN HỆ MỚI</h2>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0;">Từ hệ thống ZINITEK WEB</p>
        </div>
        
        <div style="padding: 20px; background-color: #f8fafc;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; width: 150px; font-weight: bold; color: #475569;">Họ và Tên:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Công ty:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${company || 'Không có'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #f97316;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Số điện thoại:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${phone}" style="color: #f97316;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Dịch vụ quan tâm:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: bold;">${service || 'Chưa chọn'}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: white; border: 1px solid #e2e8f0; border-radius: 6px;">
            <p style="margin-top: 0; font-weight: bold; color: #475569;">Lời nhắn:</p>
            <p style="color: #0f172a; white-space: pre-wrap; margin-bottom: 0;">${message || 'Không có lời nhắn.'}</p>
          </div>
          
          ${file && file.size > 0 ? `<p style="margin-top: 15px; color: #f97316; font-size: 14px;">📎 <b>Đã đính kèm tệp:</b> ${file.name}</p>` : ''}
        </div>
      </div>
    `;

    // Gửi email
    const info = await transporter.sendMail({
      from: `"ZINITEK WEB" <${process.env.EMAIL_USER}>`,
      to: 'phantan7211@gmail.com', // Nhận thư theo yêu cầu của bạn
      subject: `[ZINITEK] Liên hệ mới từ ${name}`,
      html: htmlContent,
      attachments: attachments,
    });

    console.log('Message sent: %s', info.messageId);

    return NextResponse.json(
      { message: 'Gửi thành công!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
