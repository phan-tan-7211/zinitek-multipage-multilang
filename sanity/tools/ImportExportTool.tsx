"use client"

import React, { useRef, useState } from "react"
import { Box, Button, Card, Flex, Stack, Text, useToast } from "@sanity/ui"
import { useClient } from "sanity"
import JSZip from "jszip"

const PACK_FORMAT = "company-data-pack"
const PACK_VERSION = 1
const API_VERSION = "2024-01-01"

type BackupManifest = {
  format: string
  version: number
  exportedAt: string
  source: { projectId?: string; dataset?: string }
  counts: { documents: number; assets: number }
  documentTypes: Record<string, number>
  assetIndex: Array<{
    oldId: string
    type: "image" | "file"
    path: string
    originalFilename?: string
    mimeType?: string
  }>
}

const SYSTEM_FIELDS = new Set(["_rev", "_createdAt", "_updatedAt"])

function sanitizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_")
}

function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = href
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(href)
}

function stripSystemFields(value: any): any {
  if (Array.isArray(value)) return value.map(stripSystemFields)
  if (!value || typeof value !== "object") return value
  const output: Record<string, any> = {}
  for (const [key, child] of Object.entries(value)) {
    if (!SYSTEM_FIELDS.has(key)) output[key] = stripSystemFields(child)
  }
  return output
}

function rewriteAssetReferences(value: any, assetMap: Map<string, string>): any {
  if (Array.isArray(value)) return value.map((item) => rewriteAssetReferences(item, assetMap))
  if (!value || typeof value !== "object") return value
  const output: Record<string, any> = {}
  for (const [key, child] of Object.entries(value)) {
    output[key] = key === "_ref" && typeof child === "string" && assetMap.has(child)
      ? assetMap.get(child)
      : rewriteAssetReferences(child, assetMap)
  }
  return output
}

function weakenReferences(value: any): any {
  if (Array.isArray(value)) return value.map(weakenReferences)
  if (!value || typeof value !== "object") return value
  const output: Record<string, any> = {}
  for (const [key, child] of Object.entries(value)) output[key] = weakenReferences(child)
  if (output._type === "reference" && typeof output._ref === "string") output._weak = true
  return output
}

async function commitInBatches(client: any, documents: any[], batchSize = 40) {
  for (let offset = 0; offset < documents.length; offset += batchSize) {
    const transaction = client.transaction()
    documents.slice(offset, offset + batchSize).forEach((document) => transaction.createOrReplace(document))
    await transaction.commit({ autoGenerateArrayKeys: true })
  }
}

export function ImportExportTool() {
  const client = useClient({ apiVersion: API_VERSION })
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState("Sẵn sàng")

  const handleExport = async () => {
    setBusy(true)
    setStatus("Đang đọc toàn bộ dữ liệu công ty…")
    try {
      const [documents, assets] = await Promise.all([
        client.fetch(`*[!(_type in ["sanity.imageAsset", "sanity.fileAsset"]) && !(_type match "system.*")]`),
        client.fetch(`*[_type in ["sanity.imageAsset", "sanity.fileAsset"]]{_id,_type,url,originalFilename,mimeType,extension,size}`),
      ])
      const zip = new JSZip()
      const assetIndex: BackupManifest["assetIndex"] = []

      for (let index = 0; index < assets.length; index++) {
        const asset = assets[index]
        if (!asset?.url || !asset?._id) continue
        setStatus(`Đang đóng gói asset ${index + 1}/${assets.length}…`)
        const response = await fetch(asset.url)
        if (!response.ok) throw new Error(`Không tải được asset: ${asset._id}`)
        const blob = await response.blob()
        const fallbackExtension = asset._type === "sanity.imageAsset" ? "bin" : "file"
        const filename = sanitizeFilename(asset.originalFilename || `${asset._id}.${asset.extension || fallbackExtension}`)
        const path = `assets/${String(index + 1).padStart(4, "0")}-${filename}`
        zip.file(path, blob)
        assetIndex.push({
          oldId: asset._id,
          type: asset._type === "sanity.imageAsset" ? "image" : "file",
          path,
          originalFilename: asset.originalFilename,
          mimeType: asset.mimeType,
        })
      }

      const documentTypes = documents.reduce((acc: Record<string, number>, document: any) => {
        const type = document?._type || "unknown"
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {})
      const config = client.config()
      const manifest: BackupManifest = {
        format: PACK_FORMAT,
        version: PACK_VERSION,
        exportedAt: new Date().toISOString(),
        source: { projectId: config.projectId, dataset: config.dataset },
        counts: { documents: documents.length, assets: assetIndex.length },
        documentTypes,
        assetIndex,
      }

      zip.file("manifest.json", JSON.stringify(manifest, null, 2))
      zip.file("documents.json", JSON.stringify(documents, null, 2))
      zip.file("README.txt", [
        "COMPANY DATA PACK",
        "",
        "Chứa toàn bộ document nội dung, translation metadata và binary asset từ Sanity.",
        "Import sẽ upload asset trước, tự remap reference và restore document theo _id.",
        "Không chứa secret/ENV deployment, mật khẩu, API token, DNS hoặc user permissions.",
      ].join("\n"))

      setStatus("Đang tạo file ZIP…")
      const backupBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } })
      downloadBlob(backupBlob, `company-data-pack-${new Date().toISOString().slice(0, 10)}.zip`)
      setStatus(`Đã xuất ${documents.length} document và ${assetIndex.length} asset`)
      toast.push({ status: "success", title: "Backup toàn bộ công ty hoàn tất", description: `${documents.length} document · ${assetIndex.length} asset` })
    } catch (error) {
      console.error("Company export failed:", error)
      setStatus("Xuất dữ liệu thất bại")
      toast.push({ status: "error", title: "Không thể xuất Company Data Pack", description: String(error) })
    } finally {
      setBusy(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    setBusy(true)
    setStatus("Đang kiểm tra gói backup…")

    try {
      const zip = await JSZip.loadAsync(selectedFile)
      const manifestFile = zip.file("manifest.json")
      const documentsFile = zip.file("documents.json")
      if (!manifestFile || !documentsFile) throw new Error("ZIP không phải Company Data Pack hợp lệ")
      const manifest = JSON.parse(await manifestFile.async("string")) as BackupManifest
      if (manifest.format !== PACK_FORMAT) throw new Error("Sai định dạng backup")
      if (manifest.version > PACK_VERSION) throw new Error(`Backup version ${manifest.version} mới hơn tool hiện tại`)
      const documents = JSON.parse(await documentsFile.async("string")) as any[]
      if (!Array.isArray(documents)) throw new Error("documents.json không hợp lệ")

      const assetMap = new Map<string, string>()
      for (let index = 0; index < manifest.assetIndex.length; index++) {
        const asset = manifest.assetIndex[index]
        const zipAsset = zip.file(asset.path)
        if (!zipAsset) throw new Error(`Thiếu binary asset: ${asset.path}`)
        setStatus(`Đang upload asset ${index + 1}/${manifest.assetIndex.length}…`)
        const bytes = await zipAsset.async("uint8array")
        const blob = new Blob([bytes], asset.mimeType ? { type: asset.mimeType } : undefined)
        const uploaded = await client.assets.upload(asset.type, blob, { filename: asset.originalFilename || asset.path.split("/").pop() })
        assetMap.set(asset.oldId, uploaded._id)
      }

      const normalizedDocuments = documents
        .filter((document) => document?._id && document?._type)
        .map((document) => rewriteAssetReferences(stripSystemFields(document), assetMap))

      setStatus("Đang tạo document nền để bảo toàn mọi quan hệ…")
      await commitInBatches(client, normalizedDocuments.map(weakenReferences))
      setStatus("Đang khôi phục strong reference…")
      await commitInBatches(client, normalizedDocuments)

      setStatus(`Đã nhập ${normalizedDocuments.length} document và ${assetMap.size} asset`)
      toast.push({ status: "success", title: "Restore/Clone công ty hoàn tất", description: `${normalizedDocuments.length} document · ${assetMap.size} asset` })
    } catch (error) {
      console.error("Company import failed:", error)
      setStatus("Nhập dữ liệu thất bại")
      toast.push({ status: "error", title: "Không thể nhập Company Data Pack", description: String(error) })
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <Card padding={5} style={{ minHeight: "100vh" }}>
      <Stack space={5}>
        <Box>
          <Text size={4} weight="bold">Company Data Manager</Text>
          <Text size={1} muted style={{ marginTop: 8 }}>Backup, restore hoặc clone toàn bộ dữ liệu một công ty giữa các dataset/project Sanity.</Text>
        </Box>
        <Card padding={4} radius={3} tone="primary">
          <Stack space={3}>
            <Text size={2} weight="semibold">Phạm vi Company Data Pack</Text>
            <Text size={1}>Bao gồm Cấu hình website, nội dung 5 ngôn ngữ, Dịch vụ, Sản phẩm, Dự án, Blog, SEO, Pháp lý, Liên hệ & Báo giá, Địa điểm, Google Reviews, Doanh nghiệp tin tưởng, translation metadata và toàn bộ ảnh/file lưu trong Sanity.</Text>
            <Text size={1}>Không bao gồm secret/ENV hạ tầng như mật khẩu email, API token, DNS hoặc quyền user Sanity.</Text>
          </Stack>
        </Card>
        <Flex gap={3} wrap="wrap">
          <Button text={busy ? "ĐANG XỬ LÝ…" : "XUẤT COMPANY DATA PACK (.ZIP)"} tone="primary" padding={4} onClick={handleExport} disabled={busy} />
          <Button text={busy ? "ĐANG XỬ LÝ…" : "NHẬP / RESTORE COMPANY DATA PACK"} tone="positive" padding={4} onClick={() => inputRef.current?.click()} disabled={busy} />
          <input ref={inputRef} type="file" hidden accept=".zip,application/zip" onChange={handleImport} />
        </Flex>
        <Card padding={4} radius={3} border><Stack space={3}><Text size={2} weight="semibold">Trạng thái</Text><Text size={1}>{status}</Text></Stack></Card>
        <Card padding={4} radius={3} border>
          <Stack space={3}>
            <Text size={2} weight="semibold">Cách dùng chuẩn</Text>
            <Text size={1}>1. Khách hàng điền/chỉnh dữ liệu trực tiếp trong các mục Sanity Studio.</Text>
            <Text size={1}>2. Khi hoàn tất hoặc cần backup, xuất Company Data Pack.</Text>
            <Text size={1}>3. Muốn clone sang khách hàng/dataset khác, mở Studio đích rồi nhập file ZIP.</Text>
            <Text size={1}>4. Import ghi đè document trùng _id để restore đúng trạng thái backup. Nên xuất backup hiện trạng trước khi restore.</Text>
          </Stack>
        </Card>
      </Stack>
    </Card>
  )
}
