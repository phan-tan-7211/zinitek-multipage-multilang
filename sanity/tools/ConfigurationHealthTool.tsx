"use client"

import React, { useEffect, useState } from 'react'
import { Badge, Box, Card, Flex, Stack, Text } from '@sanity/ui'
import { useClient } from 'sanity'

const API_VERSION = '2024-01-01'
const REQUIRED_LANGUAGES = ['vi', 'en', 'jp', 'kr', 'cn'] as const

type Check = { label: string; ok: boolean; detail: string }

export function ConfigurationHealthTool() {
  const client = useClient({ apiVersion: API_VERSION })
  const [checks, setChecks] = useState<Check[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function run() {
      try {
        const data = await client.fetch(`{
          "site": *[_id=="siteSettings"][0]{logoWordmark,phoneDisplay,phoneTel,email},
          "organization": *[_id=="organizationSettings"][0]{legalName,countryCode,businessType},
          "locations": *[_id=="locationsSettings"][0]{locations[]{enabled,address}},
          "contact": *[_id=="contactSettings"][0]{enabled,form,workingHours},
          "seoCount": count(*[_type=="seoPageConfig"]),
          "serviceCount": count(*[_type=="service"]),
          "pageContentByLanguage": {
            "vi": count(*[_type=="pageContent" && language=="vi"]),
            "en": count(*[_type=="pageContent" && language=="en"]),
            "jp": count(*[_type=="pageContent" && language=="jp"]),
            "kr": count(*[_type=="pageContent" && language=="kr"]),
            "cn": count(*[_type=="pageContent" && language=="cn"])
          }
        }`)
        const cfg = client.config()
        const locations = (data.locations?.locations || []).filter((x:any)=>x.enabled!==false && x.address)
        const pageContentCounts = data.pageContentByLanguage || {}
        const missingLanguages = REQUIRED_LANGUAGES.filter((language) => !(pageContentCounts[language] > 0))
        const languageDetail = REQUIRED_LANGUAGES.map((language) => `${language}:${pageContentCounts[language] || 0}`).join(' · ')
        const next: Check[] = [
          { label: 'Sanity Project', ok: Boolean(cfg.projectId && cfg.dataset), detail: `${cfg.projectId || 'missing'} / ${cfg.dataset || 'missing'}` },
          { label: 'Tên thương hiệu', ok: Boolean(data.site?.logoWordmark?.primaryText), detail: data.site?.logoWordmark?.primaryText || 'Chưa cấu hình' },
          { label: 'Điện thoại', ok: Boolean(data.site?.phoneTel), detail: data.site?.phoneDisplay || 'Chưa cấu hình' },
          { label: 'Email liên hệ', ok: Boolean(data.site?.email), detail: data.site?.email || 'Chưa cấu hình' },
          { label: 'Thông tin doanh nghiệp SEO', ok: Boolean(data.organization?.countryCode), detail: data.organization?.countryCode || 'Thiếu mã quốc gia ISO' },
          { label: 'Địa điểm', ok: locations.length > 0, detail: `${locations.length} địa điểm hợp lệ` },
          { label: 'Liên hệ & báo giá', ok: Boolean(data.contact), detail: data.contact ? 'Đã cấu hình' : 'Chưa có document' },
          { label: 'SEO page configs', ok: data.seoCount > 0, detail: `${data.seoCount} cấu hình` },
          { label: 'Nội dung động 5 ngôn ngữ', ok: missingLanguages.length === 0, detail: missingLanguages.length ? `${languageDetail} · thiếu: ${missingLanguages.join(', ')}` : languageDetail },
          { label: 'Dịch vụ', ok: data.serviceCount > 0, detail: `${data.serviceCount} document` },
        ]
        if (active) setChecks(next)
      } catch (error) {
        if (active) setChecks([{ label: 'Health Check', ok: false, detail: String(error) }])
      } finally { if (active) setLoading(false) }
    }
    void run(); return () => { active = false }
  }, [client])

  const passed = checks.filter(c=>c.ok).length
  return <Card padding={5} style={{minHeight:'100vh'}}><Stack space={5}>
    <Box><Text size={4} weight="bold">Configuration Health Check</Text><Text size={1} muted style={{marginTop:8}}>Kiểm tra dữ liệu cần thiết trước khi đưa website live hoặc clone cho khách hàng khác. Công ty mới phải có nội dung động đủ 5 ngôn ngữ; migration dữ liệu cũ không phải điều kiện bắt buộc.</Text></Box>
    <Card padding={4} radius={3} tone={passed===checks.length && checks.length>0 ? 'positive':'caution'}><Text size={2} weight="semibold">{loading?'Đang kiểm tra…':`${passed}/${checks.length} mục đạt`}</Text></Card>
    <Stack space={3}>{checks.map(check=><Card key={check.label} padding={4} radius={3} border><Flex align="center" justify="space-between" gap={3}><Box><Text weight="semibold">{check.label}</Text><Text size={1} muted style={{marginTop:6}}>{check.detail}</Text></Box><Badge tone={check.ok?'positive':'critical'}>{check.ok?'OK':'THIẾU'}</Badge></Flex></Card>)}</Stack>
  </Stack></Card>
}
