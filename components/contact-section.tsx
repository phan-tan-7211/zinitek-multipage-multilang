"use client"

import React, { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
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

export function ContactSection({ dict }: { dict: any }) {
  // Truy xuất dữ liệu từ dictionary theo cấu trúc file JSON đã cung cấp
  const t = dict?.contact_section;
  
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
    console.log(formData)
    alert(t?.form?.success_msg || "Cảm ơn bạn! Chúng tôi sẽ liên hệ trong 24 giờ.")
  }

  return (
    <section className="relative py-24 lg:py-32 bg-[#020617]">
      {/* Background Decor */}
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
              {t?.badge}
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#f97316]" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            {t?.title} <span className="italic text-[#f97316]">{t?.title_highlight}</span>
          </h2>
          
          <p className="text-slate-400 text-base lg:text-lg">
            {t?.description}
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
            {/* Office cards từ JSON */}
            {t?.offices?.map((office: any, index: number) => (
              <div 
                key={index}
                className="p-6 bg-[#0f172a] rounded-xl border border-[#334155]/50 hover:border-[#f97316]/30 transition-colors"
              >
                <h3 className="font-serif font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#f97316]" />
                  {office.name}
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="text-slate-400 leading-relaxed">{office.address}</p>
                  <a href={`tel:${dict?.common?.phone || "+84 274 123 456"}`} className="flex items-center gap-2 text-slate-200 hover:text-[#f97316] transition-colors">
                    <Phone className="w-4 h-4" />
                    {dict?.common?.phone || "+84 274 123 456"}
                  </a>
                  <a href={`mailto:${dict?.common?.email || "info@zinitek.vn"}`} className="flex items-center gap-2 text-slate-200 hover:text-[#f97316] transition-colors">
                    <Mail className="w-4 h-4" />
                    {dict?.common?.email || "info@zinitek.vn"}
                  </a>
                </div>
              </div>
            ))}

            {/* Working hours */}
            <div className="p-6 bg-[#0f172a] rounded-xl border border-[#334155]/50">
              <h3 className="font-serif font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#f97316]" />
                {t?.working_hours?.title}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t?.working_hours?.monday_friday}</span>
                  <span className="text-slate-200">7:30 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t?.working_hours?.saturday}</span>
                  <span className="text-slate-200">7:30 - 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t?.working_hours?.sunday}</span>
                  <span className="text-[#f97316]">{t?.working_hours?.closed}</span>
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
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0f172a] border border-[#334155]/50 text-slate-400 hover:text-[#f97316] hover:border-[#f97316]/50 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
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
                        : "bg-[#1e293b] text-slate-500"
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
                <AnimatePresence mode="wait">
                  {/* Step 1: Basic Info */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <h3 className="font-serif text-xl font-bold text-white mb-6">
                        {t?.form?.info_title}
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-slate-200">{t?.form?.labels?.name}</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={t?.form?.placeholders?.name}
                            required
                            className="bg-[#1e293b] border-[#334155] text-white focus:border-[#f97316] transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-slate-200">{t?.form?.labels?.company}</Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder={t?.form?.placeholders?.company}
                            className="bg-[#1e293b] border-[#334155] text-white focus:border-[#f97316] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-slate-200">{t?.form?.labels?.email}</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t?.form?.placeholders?.email}
                            required
                            className="bg-[#1e293b] border-[#334155] text-white focus:border-[#f97316] transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-slate-200">{t?.form?.labels?.phone}</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder={t?.form?.placeholders?.phone}
                            required
                            className="bg-[#1e293b] border-[#334155] text-white focus:border-[#f97316] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button 
                          type="button"
                          onClick={() => setStep(2)}
                          className="bg-[#f97316] hover:bg-[#ea580c] text-[#020617] font-semibold"
                        >
                          {t?.form?.buttons?.next}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Service Selection */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <h3 className="font-serif text-xl font-bold text-white mb-6">
                        {t?.form?.service_title}
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service" className="text-slate-200">{t?.form?.labels?.service}</Label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          required
                          className="w-full h-10 px-3 rounded-md bg-[#1e293b] border border-[#334155] text-white focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316] transition-colors"
                        >
                          <option value="">{t?.form?.placeholders?.service_default}</option>
                          {t?.services_list?.map((service: string) => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-slate-200">{t?.form?.labels?.message}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder={t?.form?.placeholders?.message}
                          rows={4}
                          className="bg-[#1e293b] border-[#334155] text-white focus:border-[#f97316] resize-none transition-colors"
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="border-[#334155] hover:border-[#f97316]/50 bg-transparent text-white"
                        >
                          {t?.form?.buttons?.prev}
                        </Button>
                        <Button 
                          type="button"
                          onClick={() => setStep(3)}
                          className="bg-[#f97316] hover:bg-[#ea580c] text-[#020617] font-semibold"
                        >
                          {t?.form?.buttons?.next}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: File Upload & Submit */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <h3 className="font-serif text-xl font-bold text-white mb-6">
                        {t?.form?.file_title}
                      </h3>
                      
                      <div className="space-y-2">
                        <Label className="text-slate-200">{t?.form?.labels?.file}</Label>
                        <div className="border-2 border-dashed border-[#334155] hover:border-[#f97316]/50 rounded-xl p-8 text-center transition-colors cursor-pointer relative group">
                          <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload className="w-10 h-10 text-[#f97316]/50 mx-auto mb-3 group-hover:text-[#f97316] transition-colors" />
                          <p className="text-slate-200 font-medium mb-1">
                            {formData.file ? formData.file.name : t?.form?.placeholders?.file_hint}
                          </p>
                          <p className="text-sm text-slate-500">
                            {t?.form?.placeholders?.file_types}
                          </p>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="p-4 bg-[#1e293b]/50 rounded-lg border border-[#334155]/30">
                        <h4 className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">{t?.form?.summary?.title}</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-slate-500">{t?.form?.summary?.name}:</span> <span className="text-slate-200">{formData.name || "-"}</span></p>
                          <p><span className="text-slate-500">{t?.form?.summary?.email}:</span> <span className="text-slate-200">{formData.email || "-"}</span></p>
                          <p><span className="text-slate-500">{t?.form?.summary?.service}:</span> <span className="text-[#f97316]">{formData.service || "-"}</span></p>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="border-[#334155] hover:border-[#f97316]/50 bg-transparent text-white"
                        >
                          {t?.form?.buttons?.prev}
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-[#020617] font-bold shadow-lg shadow-[#f97316]/25"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {t?.form?.buttons?.submit}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}