export const metadata = {
  title: 'Zinitek Admin Studio',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Đảm bảo Studio hiển thị đúng trên di động và không bị tràn layout */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}