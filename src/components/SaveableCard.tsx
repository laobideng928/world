'use client'

import { useRef, useCallback } from 'react'
import QRCode from 'qrcode'

const SITE_URL = 'https://laobideng928.github.io/world/'

interface Props {
  children: React.ReactNode
  fileName: string
}

export default function SaveableCard({ children, fileName }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleSave = useCallback(async () => {
    if (!cardRef.current) return
    // 动态导入 html2canvas (减少首屏 bundle)
    const html2canvas = (await import('html2canvas-pro')).default

    // 生成二维码 data URL
    const qrDataUrl = await QRCode.toDataURL(SITE_URL, {
      width: 120, margin: 1, color: { dark: '#ffffff', light: '#00000000' }
    })

    // 截图卡片
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#1a1a2e',
      scale: 2,
      useCORS: true,
      logging: false,
    })

    // 在底部追加二维码和文字
    const finalCanvas = document.createElement('canvas')
    const pad = 20
    const qrSize = 100
    const footerH = qrSize + pad * 2
    finalCanvas.width = canvas.width
    finalCanvas.height = canvas.height + footerH
    const ctx = finalCanvas.getContext('2d')!
    // 背景
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)
    // 卡片内容
    ctx.drawImage(canvas, 0, 0)
    // 分隔线
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(pad, canvas.height + 10)
    ctx.lineTo(finalCanvas.width - pad, canvas.height + 10)
    ctx.stroke()
    // 二维码
    const qrImg = new Image()
    qrImg.src = qrDataUrl
    await new Promise(r => { qrImg.onload = r })
    const qrX = finalCanvas.width - qrSize - pad
    const qrY = canvas.height + pad
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
    // 文字
    ctx.fillStyle = '#9ca3af'
    ctx.font = `${12 * 2}px sans-serif`
    ctx.fillText('⚽ 2026世界杯爆冷分析器', pad, canvas.height + pad + 30)
    ctx.font = `${10 * 2}px sans-serif`
    ctx.fillStyle = '#6b7280'
    ctx.fillText('扫码访问完整分析 →', pad, canvas.height + pad + 60)
    ctx.fillText('Claude Opus 4.8 · 多平台赔率 · AI分析', pad, canvas.height + pad + 85)

    // 下载
    const link = document.createElement('a')
    link.download = `${fileName}.png`
    link.href = finalCanvas.toDataURL('image/png')
    link.click()
  }, [fileName])

  return (
    <div>
      <div ref={cardRef}>{children}</div>
      <button
        onClick={handleSave}
        className="mt-2 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 transition-all border border-white/10 flex items-center justify-center gap-1"
      >
        📷 保存为图片
      </button>
    </div>
  )
}
