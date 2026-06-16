import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2026世界杯爆冷分析器',
  description: '结合Google新闻和AI模型，智能分析2026世界杯最容易爆冷的比赛',
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
