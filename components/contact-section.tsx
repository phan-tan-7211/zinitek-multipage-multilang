"use client"

import React, { useRef, useState } from "react"
import { toast } from "sonner"
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion"
import { Clock, Mail, MapPin, Phone, Send, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useSiteSettings } from "@/components/site-settings-context"

export function ContactSection({ dict }: { dict: any; lang?: string }) {
  const t = dict?.contact_section || {}
  const { phoneDisplay, phoneTel, email } = useSiteSettings()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const reduceMotion = useReducedMotion()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", service: "", message: "", file: null as File | null })

  const update = (name: string, value: string) => setFormData((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error(t?.form?.required_msg || "Vui lòng điền đầy đủ các thông tin bắt buộc.")
      return
    }

    setIsSubmitting(true)
    const payload = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "file") {
        if (value instanceof File) payload.append(key, value)
      } else payload.append(key, String(value || ""))
    })

    try {
      const response = await fetch("/api/contact", { method: "POST", body: payload })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result?.error || "Submit failed")
      toast.success(t?.form?.success_msg || "Cảm ơn bạn! Yêu cầu đã được gửi thành công.")
      setStep(1)
      setFormData({ name: "", company: "", email: "", phone: "", service: "", message: "", file: null })
    } catch (error) {
      console.error("Submit Error:", error)
      toast.error(t?.form?.error_msg || "Không thể gửi yêu cầu. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const reveal = (x: number, delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, x },
    animate: isInView ? { opacity: 1, x: 0 } : {},
    transition: reduceMotion ? { duration: 0 } : { duration: 0.65, delay },
  })

  const fieldClass = "min-h-12 rounded-xl border-border bg-background/70 focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/[0.04] blur-3xl" aria-hidden="true" />
      <div ref={ref} className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...reveal(0)} className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-5 inline-flex min-h-10 items-center rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{t?.badge || "Contact"}</div>
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">{t?.title || "Talk to our team"} <span className="text-primary italic">{t?.title_highlight || "today"}</span></h2>
          <p className="mx-auto mt-5 max-w-[65ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{t?.description || "Share your project requirements and our team will respond with the right technical direction."}</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <motion.aside {...reveal(-36, 0.1)} className="space-y-5 lg:col-span-2">
            {(t?.offices || []).map((office: any, index: number) => (
              <div key={`${office.name}-${index}`} className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-soft transition-all lg:hover:-translate-y-1 lg:hover:border-primary/35 lg:hover:shadow-card">
                <h3 className="flex items-center gap-2 font-semibold text-foreground"><MapPin className="size-5 text-primary" aria-hidden="true" />{office.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{office.address}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-soft">
              <h3 className="flex items-center gap-2 font-semibold text-foreground"><Clock className="size-5 text-primary" aria-hidden="true" />{t?.working_hours?.title || "Working hours"}</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">{t?.working_hours?.monday_friday || "Mon - Fri"}</span><span className="font-medium text-foreground">7:30 - 17:00</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">{t?.working_hours?.saturday || "Saturday"}</span><span className="font-medium text-foreground">7:30 - 12:00</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">{t?.working_hours?.sunday || "Sunday"}</span><span className="font-medium text-primary">{t?.working_hours?.closed || "Closed"}</span></div>
              </div>
            </div>

            {(phoneDisplay || email) && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {phoneDisplay && phoneTel && (
                  <a href={`tel:${phoneTel}`} className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Phone className="size-4" aria-hidden="true" />{phoneDisplay}
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Mail className="size-4" aria-hidden="true" />{email}
                  </a>
                )}
              </div>
            )}
          </motion.aside>

          <motion.div {...reveal(36, 0.15)} className="lg:col-span-3">
            <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-7 lg:p-8">
              <div className="mb-8 flex items-center" aria-label={`Step ${step} of 3`}>
                {[1, 2, 3].map((item) => (
                  <React.Fragment key={item}>
                    <div className={`flex size-11 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${step >= item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary text-muted-foreground"}`}>{item}</div>
                    {item < 3 && <div className={`mx-2 h-0.5 flex-1 transition-colors ${step > item ? "bg-primary" : "bg-border"}`} />}
                  </React.Fragment>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait" initial={false}>
                  {step === 1 && (
                    <motion.div key="step-1" initial={reduceMotion ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: -16 }} className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2"><Label htmlFor="contact-name">{t?.form?.name || "Name"} *</Label><Input id="contact-name" name="name" autoComplete="name" value={formData.name} onChange={(e) => update("name", e.target.value)} className={fieldClass} required /></div>
                      <div className="space-y-2"><Label htmlFor="contact-company">{t?.form?.company || "Company"}</Label><Input id="contact-company" name="company" autoComplete="organization" value={formData.company} onChange={(e) => update("company", e.target.value)} className={fieldClass} /></div>
                      <div className="space-y-2"><Label htmlFor="contact-email">Email *</Label><Input id="contact-email" name="email" type="email" autoComplete="email" value={formData.email} onChange={(e) => update("email", e.target.value)} className={fieldClass} required /></div>
                      <div className="space-y-2"><Label htmlFor="contact-phone">{t?.form?.phone || "Phone"} *</Label><Input id="contact-phone" name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={(e) => update("phone", e.target.value)} className={fieldClass} required /></div>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="step-2" initial={reduceMotion ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: -16 }} className="space-y-5">
                      <div className="space-y-2"><Label htmlFor="contact-service">{t?.form?.service || "Service"}</Label><Input id="contact-service" name="service" value={formData.service} onChange={(e) => update("service", e.target.value)} className={fieldClass} /></div>
                      <div className="space-y-2"><Label htmlFor="contact-message">{t?.form?.message || "Project requirements"}</Label><Textarea id="contact-message" name="message" value={formData.message} onChange={(e) => update("message", e.target.value)} className="min-h-40 rounded-xl border-border bg-background/70 focus-visible:ring-2 focus-visible:ring-ring" /></div>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="step-3" initial={reduceMotion ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/[0.035] p-6 text-center">
                        <Upload className="mx-auto size-7 text-primary" aria-hidden="true" />
                        <Label htmlFor="contact-file" className="mt-3 block cursor-pointer font-medium text-foreground">{t?.form?.file || "Attach drawing or specification"}</Label>
                        <Input id="contact-file" name="file" type="file" onChange={(e) => setFormData((prev) => ({ ...prev, file: e.target.files?.[0] || null }))} className="mt-4 min-h-11 cursor-pointer" />
                        {formData.file && <p className="mt-2 text-xs text-muted-foreground">{formData.file.name}</p>}
                      </div>
                      <div className="rounded-2xl border border-border bg-secondary/30 p-5 text-sm leading-6 text-muted-foreground">{t?.form?.review || "Review the information above, then send your request. Our team will contact you using the details provided."}</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button type="button" variant="outline" className="min-h-12 rounded-xl" onClick={() => setStep((value) => Math.max(1, value - 1))} disabled={step === 1}>{t?.form?.back || "Back"}</Button>
                  {step < 3 ? (
                    <Button type="button" className="min-h-12 rounded-xl bg-primary px-6 text-primary-foreground transition-transform lg:hover:scale-[1.03]" onClick={() => setStep((value) => Math.min(3, value + 1))}>{t?.form?.next || "Next"}</Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting} className="min-h-12 rounded-xl bg-primary px-6 text-primary-foreground transition-transform lg:hover:scale-[1.03]"><Send className="mr-2 size-4" aria-hidden="true" />{isSubmitting ? (t?.form?.sending || "Sending...") : (t?.form?.submit || "Send request")}</Button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
