export default function LoadingState() {
  const tips = [
    '正在加载市场预测数据...',
    '正在读取多平台赔率...',
    '正在分析72场小组赛对阵与战术风格...',
    '正在评估各队身体素质与历史交锋...',
    'Gemini 3.1 Pro 深度推理计算爆冷概率...',
  ]

  return (
    <div className="text-center py-12">
      {/* 动画足球 */}
      <div className="text-6xl mb-6 animate-bounce">⚽</div>

      <h3 className="text-xl font-medium text-white mb-4">
        AI正在深度分析中...
      </h3>

      <div className="space-y-3 max-w-md mx-auto">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm text-gray-400 loading-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span>{tip}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-[loading_2s_ease-in-out_infinite]"
            style={{
              animation: 'loading 2s ease-in-out infinite',
            }}
          />
        </div>
        <style jsx>{`
          @keyframes loading {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 60%; margin-left: 20%; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Gemini 3.1 Pro 深度推理分析约需 1-3 分钟，请耐心等待
      </p>
    </div>
  )
}
