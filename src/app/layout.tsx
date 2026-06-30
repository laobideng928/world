import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2026世界杯爆冷分析器',
  description: '结合AI模型和市场数据，智能分析2026世界杯最容易爆冷的比赛',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#1a1a2e',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: '世界杯爆冷' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
