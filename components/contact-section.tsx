"use client"

import React from "react"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Upload, 
  ChevronRight,
  Facebook,
  Youtube,
  Linkedin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const offices = [
  {
    name: "Nhà máy chính",
    address: "Khu công nghiệp Mỹ Phước 3, Thị xã Bến Cát, Bình Dương",
    phone: "+84 274 123 456",
    email: "factory@zinitek.vn",
  },
  {
    name: "Văn phòng TP.HCM",
    address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    phone: "+84 28 1234 5678",
    email: "hcm@zinitek.vn",
  },
]

const serviceOptions = [
  "Gia công CNC chính xác",
  "Thiết kế khuôn mẫu",
  "Quét 3D & Phân tích ngược",
  "PLC & Tự động hóa",
  "Cuộn dây đồng",
  "Lắp ráp điện tử",
  "CNTT & Phần mềm CN",
  "Khác",
]

export function ContactSection() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    file: null as File | null,
  })
  
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
    alert("Cảm ơn bạn! Chúng tôi sẽ liên hệ trong 24 giờ.")
  }

  return (
    <section className="relative py-24 lg:py-32 bg-[#020617]">
      {/* Background */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#f97316]/3 blur-[150px] rounded-full pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#f97316]" />
            <span className="text-[#f97316] text-sm font-medium uppercase tracking-widest">
              Liên hệ
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#f97316]" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Yêu cầu <span className="italic text-[#f97316]">báo giá</span>
          </h2>
          
          <p className="text-muted-foreground text-base lg:text-lg">
            Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Office cards */}
            {offices.map((office, index) => (
              <div 
                key={office.name}
                className="p-6 bg-[#0f172a] rounded-xl border border-[#334155]/50 hover:border-[#f97316]/30 transition-colors"
              >
                <h3 className="font-serif font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#f97316]" />
                  {office.name}
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{office.address}</p>
                  <a href={`tel:${office.phone}`} className="flex items-center gap-2 text-foreground hover:text-[#f97316] transition-colors">
                    <Phone className="w-4 h-4" />
                    {office.phone}
                  </a>
                  <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-foreground hover:text-[#f97316] transition-colors">
                    <Mail className="w-4 h-4" />
                    {office.email}
                  </a>
                </div>
              </div>
            ))}

            {/* Working hours */}
            <div className="p-6 bg-[#0f172a] rounded-xl border border-[#334155]/50">
              <h3 className="font-serif font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#f97316]" />
                Giờ làm việc
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thứ 2 - Thứ 6</span>
                  <span className="text-foreground">7:30 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thứ 7</span>
                  <span className="text-foreground">7:30 - 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chủ nhật</span>
                  <span className="text-[#f97316]">Nghỉ</span>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Youtube, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0f172a] border border-[#334155]/50 text-muted-foreground hover:text-[#f97316] hover:border-[#f97316]/50 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="aspect-video bg-[#0f172a] rounded-xl border border-[#334155]/50 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#f97316]/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Bản đồ vị trí</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Multi-step Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-[#0f172a] rounded-2xl border border-[#334155]/50 p-6 lg:p-8">
              {/* Progress steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      step >= s 
                        ? "bg-[#f97316] text-[#020617]" 
                        : "bg-[#1e293b] text-muted-foreground"
                    }`}>
                      {s}
                    </div>
                    {s < 3 && (
                      <div className={`w-16 sm:w-24 h-0.5 mx-2 transition-colors ${
                        step > s ? "bg-[#f97316]" : "bg-[#1e293b]"
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <h3 className="font-serif text-xl font-bold text-foreground mb-6">
                      Thông tin liên hệ
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Nguyễn Văn A"
                          required
                          className="bg-[#1e293b] border-[#334155] focus:border-[#f97316]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Công ty</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Tên công ty"
                          className="bg-[#1e293b] border-[#334155] focus:border-[#f97316]"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="email@company.com"
                          required
                          className="bg-[#1e293b] border-[#334155] focus:border-[#f97316]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0912 345 678"
                          required
                          className="bg-[#1e293b] border-[#334155] focus:border-[#f97316]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-[#f97316] hover:bg-[#ea580c] text-[#020617]"
                      >
                        Tiếp theo
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Service Selection */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <h3 className="font-serif text-xl font-bold text-foreground mb-6">
                      Dịch vụ quan tâm
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="service">Chọn dịch vụ *</Label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 px-3 rounded-md bg-[#1e293b] border border-[#334155] text-foreground focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
                      >
                        <option value="">-- Chọn dịch vụ --</option>
                        {serviceOptions.map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mô tả yêu cầu</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Mô tả chi tiết về dự án hoặc yêu cầu của bạn..."
                        rows={4}
                        className="bg-[#1e293b] border-[#334155] focus:border-[#f97316] resize-none"
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="border-[#334155] hover:border-[#f97316]/50 bg-transparent"
                      >
                        Quay lại
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setStep(3)}
                        className="bg-[#f97316] hover:bg-[#ea580c] text-[#020617]"
                      >
                        Tiếp theo
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: File Upload & Submit */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <h3 className="font-serif text-xl font-bold text-foreground mb-6">
                      Đính kèm tài liệu
                    </h3>
                    
                    <div className="space-y-2">
                      <Label>Đính kèm bản vẽ CAD/3D (tùy chọn)</Label>
                      <div className="border-2 border-dashed border-[#334155] hover:border-[#f97316]/50 rounded-xl p-8 text-center transition-colors cursor-pointer">
                        <input
                          type="file"
                          id="file"
                          name="file"
                          onChange={handleFileChange}
                          accept=".dwg,.dxf,.step,.stp,.iges,.igs,.stl,.pdf,.zip,.rar"
                          className="hidden"
                        />
                        <label htmlFor="file" className="cursor-pointer">
                          <Upload className="w-10 h-10 text-[#f97316]/50 mx-auto mb-3" />
                          <p className="text-foreground font-medium mb-1">
                            {formData.file ? formData.file.name : "Kéo thả file hoặc click để chọn"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Hỗ trợ: DWG, DXF, STEP, IGES, STL, PDF (Max 50MB)
                          </p>
                        </label>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="p-4 bg-[#1e293b]/50 rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Tóm tắt</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Tên:</span> <span className="text-foreground">{formData.name || "-"}</span></p>
                        <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{formData.email || "-"}</span></p>
                        <p><span className="text-muted-foreground">Dịch vụ:</span> <span className="text-[#f97316]">{formData.service || "-"}</span></p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="border-[#334155] hover:border-[#f97316]/50 bg-transparent"
                      >
                        Quay lại
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-[#020617] shadow-lg shadow-[#f97316]/25"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Gửi yêu cầu
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
