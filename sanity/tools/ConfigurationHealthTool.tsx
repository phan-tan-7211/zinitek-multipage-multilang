"use client"

import React, { useEffect, useState } from 'react'
import { Badge, Box, Card, Flex, Stack, Text } from '@sanity/ui'
import { useClient } from 'sanity'

const API_VERSION = '2024-01-01'

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
          "reviews": *[_id=="googleReviewsSettings"][0]{enabled,googleMapsUrl,googleRating},
          "trusted": *[_id=="trustedCompanies"][0]{enabled,companies},
          "seoCount": count(*[_type=="seoPageConfig"]),
          "pageContentCount": count(*[_type=="pageContent"]),
          "serviceCount": count(*[_type=="service"]),
          "bootstrap": *[_id=="frameworkBootstrap.companyData"][0]{version,completedAt}
        }`)
        const cfg = client.config()
        const locations = (data.locations?.locations || []).filter((x:any)=>x.enabled!==false && x.address)
        const next: Check[] = [
          { label: 'Sanity Project', ok: Boolean(cfg.projectId && cfg.dataset), detail: `${cfg.projectId || 'missing'} / ${cfg.dataset || 'missing'}` },
          { label: 'Tên thương hiệu', ok: Boolean(data.site?.logoWordmark?.primaryText), detail: data.site?.logoWordmark?.primaryText || 'Chưa cấu hình' },
          { label: 'Điện thoại', ok: Boolean(data.site?.phoneTel), detail: data.site?.phoneDisplay || 'Chưa cấu hình' },
          { label: 'Email liên hệ', ok: Boolean(data.site?.email), detail: data.site?.email || 'Chưa cấu hình' },
          { label: 'Thông tin doanh nghiệp SEO', ok: Boolean(data.organization?.countryCode), detail: data.organization?.countryCode || 'Thiếu mã quốc gia ISO' },
          { label: 'Địa điểm', ok: locations.length > 0, detail: `${locations.length} địa điểm hợp lệ` },
          { label: 'Liên hệ & báo giá', ok: Boolean(data.contact), detail: data.contact ? 'Đã cấu hình' : 'Chưa có document' },
          { label: 'SEO page configs', ok: data.seoCount > 0, detail: `${data.seoCount} cấu hình` },
          { label: 'Nội dung động pageContent', ok: data.pageContentCount > 0, detail: `${data.pageContentCount} document` },
          { label: 'Dịch vụ', ok: data.serviceCount > 0, detail: `${data.serviceCount} document` },
          { label: 'Migration legacy', ok: Boolean(data.bootstrap?.version), detail: data.bootstrap?.version ? `v${data.bootstrap.version}` : 'Chưa chạy / không áp dụng' },
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
    <Box><Text size={4} weight="bold">Configuration Health Check</Text><Text size={1} muted style={{marginTop:8}}>Kiểm tra nhanh dữ liệu cần thiết trước khi đưa website live hoặc clone cho khách hàng khác.</Text></Box>
    <Card padding={4} radius={3} tone={passed===checks.length && checks.length>0 ? 'positive':'caution'}><Text size={2} weight="semibold">{loading?'Đang kiểm tra…':`${passed}/${checks.length} mục đạt`}</Text></Card>
    <Stack space={3}>{checks.map(check=><Card key={check.label} padding={4} radius={3} border><Flex align="center" justify="space-between" gap={3}><Box><Text weight="semibold">{check.label}</Text><Text size={1} muted style={{marginTop:6}}>{check.detail}</Text></Box><Badge tone={check.ok?'positive':'critical'}>{check.ok?'OK':'THIẾU'}</Badge></Flex></Card>)}</Stack>
  </Stack></Card>
}
