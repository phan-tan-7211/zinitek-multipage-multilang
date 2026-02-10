"use client"

import React, { useState, useRef } from 'react'
import { Card, Stack, Button, Text, Box, Flex, useToast } from '@sanity/ui'
import { useClient } from 'sanity'
import * as XLSX from 'xlsx'

/**
 * Hàm tạo mã định danh ngẫu nhiên
 */
const generateRandomIdentifier = () => Math.random().toString(36).substring(2, 12)

/**
 * Tên cột ID đặc biệt dùng để cảnh báo người dùng trong Excel
 */
const ID_COLUMN_HEADER = "_id (CHỈ DÙNG ĐỂ CẬP NHẬT - ĐỂ TRỐNG NẾU TẠO MỚI)"

export function ImportExportTool() {
  const sanityClient = useClient({ apiVersion: '2024-01-01' })
  const uiToast = useToast()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const fileInputReference = useRef<HTMLInputElement>(null)

  /**
   * 1. HÀM XUẤT DỮ LIỆU (FINAL)
   */
  const handleExportData = async () => {
    setIsExporting(true)
    setIsProcessing(true)
    try {
      const rawSanityData = await sanityClient.fetch(`*[_type == "service"]{
        ...,
        "slug": slug.current,
        "_translationKey": coalesce(
          _translationKey, 
          *[_type == "translation.metadata" && references(^._id)][0]._id
        )
      }`)

      const processedDataForExcel = rawSanityData.map((item: any) => {
        const cleanSpecifications = (item.specs || []).map(({ _key, ...rest }: any) => rest)
        const cleanProcessSteps = (item.process || []).map(({ _key, ...rest }: any) => rest)
        
        let cleanIconName = ""
        if (item.icon) {
            const fullIconName = item.icon.icon || item.icon.name || (typeof item.icon === 'string' ? item.icon : "")
            cleanIconName = fullIconName.includes(':') ? fullIconName.split(':').pop() : fullIconName
        }

        const excelRow: any = {}
        excelRow[ID_COLUMN_HEADER] = item._id 
        excelRow["_translationKey"] = item._translationKey || ''
        excelRow["language"] = item.language || ''
        excelRow["icon"] = cleanIconName 
        excelRow["slug"] = item.slug || ''
        excelRow["title"] = item.title || ''
        excelRow["shortTitle"] = item.shortTitle || ''
        excelRow["description"] = item.description || ''
        excelRow["image"] = item.image || ''
        excelRow["tags"] = Array.isArray(item.tags) ? item.tags.join(', ') : ''
        excelRow["features"] = Array.isArray(item.features) ? item.features.join('| ') : ''
        excelRow["specs"] = cleanSpecifications.length > 0 ? JSON.stringify(cleanSpecifications) : ''
        excelRow["process"] = cleanProcessSteps.length > 0 ? JSON.stringify(cleanProcessSteps) : ''
        
        return excelRow
      })

      if (processedDataForExcel.length === 0) {
        const sampleRow: any = {}
        sampleRow[ID_COLUMN_HEADER] = ""
        sampleRow["_translationKey"] = "SAMPLE-KEY"
        sampleRow["language"] = "vi"
        sampleRow["title"] = "Bài Mẫu"
        sampleRow["icon"] = "cpu"
        processedDataForExcel.push(sampleRow)
      }

      const excelWorksheet = XLSX.utils.json_to_sheet(processedDataForExcel)
      const excelWorkbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(excelWorkbook, excelWorksheet, "Zinitek_Master_Data")
      XLSX.writeFile(excelWorkbook, "Zinitek_Master_Data_Final.xlsx")
      
      uiToast.push({ status: 'success', title: 'Xuất dữ liệu thành công!', description: 'Tên Icon và ID đã được tối ưu cho việc chỉnh sửa.' })
    } catch (error) {
      console.error("Lỗi xuất file:", error)
      uiToast.push({ status: 'error', title: 'Lỗi khi xuất file', description: 'Kiểm tra Console.' })
    } finally { 
      setIsExporting(false)
      setIsProcessing(false)
    }
  }

  /**
   * 2. HÀM NHẬP DỮ LIỆU (FINAL)
   */
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    setIsProcessing(true)

    const fileReader = new FileReader()
    fileReader.onload = async (fileLoadEvent) => {
      try {
        const binaryString = fileLoadEvent.target?.result
        const workbook = XLSX.read(binaryString, { type: 'binary' })
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
        
        const dataRows = sheetData as any[]
        if (dataRows.length === 0) {
          uiToast.push({ status: 'warning', title: 'File Excel không có dữ liệu!' })
          return
        }

        let updatedRecords = 0
        let createdRecords = 0
        const translationGroups = new Map<string, { language: string, documentId: string }[]>()
        const serviceTransaction = sanityClient.transaction()

        for (const row of dataRows) {
          const rawId = row[ID_COLUMN_HEADER] || row["_id"]
          const finalDocumentIdentifier = rawId || `service-${row.language || 'vi'}-${row.slug || generateRandomIdentifier()}`
          
          if (rawId) updatedRecords++
          else createdRecords++

          let parsedSpecifications = []
          let parsedProcessSteps = []
          try {
            if (row.specs) parsedSpecifications = JSON.parse(row.specs).map((s: any) => ({ ...s, _key: generateRandomIdentifier() }))
            if (row.process) parsedProcessSteps = JSON.parse(row.process).map((p: any) => ({ ...p, _key: generateRandomIdentifier() }))
          } catch (jsonError) { console.error("Lỗi JSON:", row.title) }
          
          let rawKey = row._translationKey;
          if (!rawKey) rawKey = generateRandomIdentifier();
          const translationKeyString = String(rawKey).trim(); 
          const metadataId = translationKeyString; 

          const currentGroup = translationGroups.get(metadataId) || []
          currentGroup.push({ language: row.language || 'vi', documentId: finalDocumentIdentifier })
          translationGroups.set(metadataId, currentGroup)

          const rawIconInput = row.icon ? String(row.icon).trim() : null
          let iconObject = null
          if (rawIconInput) {
            const cleanName = rawIconInput.includes(':') ? rawIconInput.split(':').pop() : rawIconInput
            iconObject = {
                _type: 'icon.manager',
                icon: `lucide:${cleanName}`, 
                metadata: {
                    collectionId: 'lucide', 
                    collectionName: 'Lucide',
                    iconName: cleanName,
                    url: `https://unpkg.com/lucide-static@latest/icons/${cleanName}.svg`,
                    flip: "horizontal", 
                    size: { width: 24, height: 24 },
                    rotate: 0,
                    hFlip: false,
                    vFlip: false
                }
            }
          }

          serviceTransaction.createOrReplace({
            _id: finalDocumentIdentifier, 
            _type: 'service',
            _translationKey: metadataId, 
            language: row.language || 'vi',
            title: row.title || '',
            shortTitle: row.shortTitle || '',
            slug: { _type: 'slug', current: row.slug || '' },
            description: row.description || '',
            icon: iconObject,
            image: row.image || '',
            tags: row.tags ? String(row.tags).split(',').map((t: string) => t.trim()) : [],
            features: row.features ? String(row.features).split('|').map((f: string) => f.trim()) : [],
            specs: parsedSpecifications,
            process: parsedProcessSteps
          })
        }

        await serviceTransaction.commit()

        const metadataTransaction = sanityClient.transaction()
        translationGroups.forEach((groupItems, metadataId) => {
            const metadataDocument = {
                _id: metadataId, 
                _type: 'translation.metadata',
                schemaTypes: ['service'],
                translations: groupItems.map(item => ({
                    _key: item.language,
                    value: {
                        _type: 'reference',
                        _ref: item.documentId
                    }
                }))
            }
            metadataTransaction.createOrReplace(metadataDocument)
        })
        await metadataTransaction.commit()

        uiToast.push({ 
          status: 'success', 
          title: 'Đồng bộ & Liên kết hoàn tất!', 
          description: `Đã xử lý ${updatedRecords + createdRecords} bài viết và ${translationGroups.size} nhóm ngôn ngữ.`
        })

      } catch (error) {
        console.error("Lỗi nhập file:", error)
        uiToast.push({ status: 'error', title: 'Lỗi Import!', description: 'Vui lòng kiểm tra Console.' })
      } finally {
        setIsProcessing(false)
        if (fileInputReference.current) fileInputReference.current.value = ''
      }
    }
    fileReader.readAsBinaryString(selectedFile)
  }

  return (
    <Card padding={4} style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#f8fafc' }}>
      <Stack space={5}>
        <Box style={{ borderBottom: '1px solid #334155' }} paddingBottom={4}>
          <Text size={4} weight="bold" style={{ color: '#ea580c' }}>
            ZINITEK DATA COMMAND CENTER (MASTER FINAL)
          </Text>
          <Text size={1} style={{ color: '#94a3b8', marginTop: '8px' }}>
            Hệ thống quản lý dữ liệu hợp nhất: An toàn, Đa ngôn ngữ, Tự động liên kết và Cập nhật hàng loạt.
          </Text>
        </Box>
        
        <Flex gap={4}>
          <Button 
            padding={4} 
            text={isExporting ? "Đang xuất..." : "1. XUẤT EXCEL (AN TOÀN)"} 
            tone="primary" 
            onClick={handleExportData} 
            disabled={isProcessing} 
          />
          <Button 
            padding={4} 
            text={isProcessing && !isExporting ? "Đang xử lý..." : "2. NHẬP DỮ LIỆU"} 
            tone="positive" 
            onClick={() => fileInputReference.current?.click()} 
            disabled={isProcessing} 
          />
          <input ref={fileInputReference} type="file" hidden accept=".xlsx, .xls" onChange={handleImportData} />
        </Flex>

        {/* --- KHU VỰC HƯỚNG DẪN TỔNG HỢP --- */}
        <Card padding={4} radius={3} style={{ background: '#0f172a', border: '1px solid #334155' }}>
          <Stack space={4}>
            <Text size={3} weight="bold" style={{ color: '#22c55e' }}>HƯỚNG DẪN VẬN HÀNH CHUẨN DÀNH CHO ADMIN:</Text>
            
            {/* Hướng dẫn Đa ngôn ngữ */}
            <Box>
              <Text weight="bold" size={2} style={{ color: '#f97316' }}>1. QUY TẮC ĐA NGÔN NGỮ (I18N):</Text>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '10px', fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6' }}>
                <li><b>Mã liên kết (<code>_translationKey</code>):</b> Dùng để nhóm các bản dịch. Bạn có thể dùng số (1, 2, 3...) hoặc chuỗi bất kỳ.</li>
                <li><b>Cách làm:</b> Copy cùng một mã vào cột <code>_translationKey</code> cho các dòng ngôn ngữ của nhau. Khi Import, hệ thống sẽ tự động cập nhật nhóm Metadata.</li>
                <li><b>Tự động Strong Link:</b> Hệ thống sẽ tự tạo Liên kết Mạnh (Strong Reference), loại bỏ hoàn toàn cảnh báo vàng trong Studio.</li>
              </ul>
            </Box>

            {/* Hướng dẫn Icon */}
            <Box style={{ borderTop: '1px dashed #334155', paddingTop: '16px' }}>
              <Text weight="bold" size={2} style={{ color: '#f97316' }}>2. QUY TẮC VỀ ICON:</Text>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '10px', fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6' }}>
                <li><b>Nguồn tìm kiếm:</b> Truy cập trang <a href="https://lucide.dev/icons" target="_blank" style={{color: '#ea580c', textDecoration: 'underline'}}>Lucide Icons</a>.</li>
                <li><b>Cách làm:</b> Tìm và copy tên icon (ví dụ: <code>cpu</code>, <code>circle-power</code>) và dán vào cột <code>icon</code> trong Excel.</li>
                <li><b>Tự động chuẩn hóa:</b> Hệ thống sẽ tự động chuyển đổi tên bạn nhập thành Icon chuẩn của Sanity (bộ Lucide). Tên trong Excel sẽ luôn được làm sạch (không có tiền tố).</li>
              </ul>
            </Box>

            {/* Hướng dẫn Cảnh báo ID */}
            <Box style={{ borderTop: '1px dashed #334155', paddingTop: '16px' }}>
                <Text weight="bold" size={2} style={{ color: '#f43f5e' }}>3. CẢNH BÁO CỰC KỲ QUAN TRỌNG VỀ ID:</Text>
                <Text as="p" size={1} style={{ color: '#fecaca', marginTop: '12px', background: '#450a0a', padding: '8px', borderRadius: '4px' }}>
                  <b>Hệ quả nếu làm sai:</b> Điền sai ID có thể gây <b>mất dữ liệu vĩnh viễn</b> (ghi đè) hoặc tạo ra các bản ghi "rác" khó quản lý.
                </Text>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '10px', fontSize: '14px', color: '#f8fafc', lineHeight: '1.6' }}>
                  <li><b>TẠO MỚI:</b> Thêm dòng mới vào cuối file và <b>ĐỂ TRỐNG</b> cột ID.</li>
                  <li><b>CẬP NHẬT:</b> Giữ nguyên giá trị cột ID của các dòng hiện có.</li>
                </ul>
            </Box>

             {/* Hướng dẫn Tính năng khác */}
             <Box style={{ borderTop: '1px dashed #334155', paddingTop: '16px' }}>
              <Text weight="bold" size={2} style={{ color: '#38bdf8' }}>4. CÁC TÍNH NĂNG THÔNG MINH KHÁC:</Text>
              <ul style={{ listStyle: 'circle', paddingLeft: '20px', marginTop: '10px', fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6' }}>
                <li><b>Chế độ Audit:</b> Tự động tìm kiếm mã liên kết ẩn sâu trong hệ thống để điền vào Excel cho bạn.</li>
                <li><b>Cơ chế Upsert:</b> Tự động nhận diện bản ghi dựa trên <code>_id</code> (Cập nhật hoặc Tạo mới).</li>
                <li><b>Xử lý JSON:</b> Hỗ trợ định dạng JSON cho các trường <code>Specs</code> và <code>Process</code>.</li>
              </ul>
            </Box>

          </Stack>
        </Card>

      </Stack>
    </Card>
  )
}