'use client'

import championData from '@/data/champion-analysis.json'

interface TeamChampionData {
  team: string
  polymarketPct: number
  myEstimate: number
  valueJudgment: string
  wcPerformance: string
  strengths: string
  weaknesses: string
  pathToFinal: string
  keyFactor: string
  wildcardRisk: string
}

export default function ChampionView() {
  const data = championData as { teams: TeamChampionData[]; overallInsight: string; analysisDate: string }
  const teams = data.teams || []

  const valueColors: Record<string, string> = {
    '被高估': 'text-red-400 bg-red-500/10 border-red-500/30',
    '被低估': 'text-green-400 bg-green-500/10 border-green-500/30',
    '合理': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* 整体洞察 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
        <h3 className="text-lg font-bold text-yellow-400 mb-2">🏆 夺冠格局总览</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{data.overallInsight}</p>
        <p className="text-xs text-gray-500 mt-2">分析日期: {data.analysisDate} · Claude Opus 4.8 · 基于预测市场实时数据</p>
      </div>

      {/* 球队卡片 */}
      <div className="grid gap-4 sm:grid-cols-2">
        {teams.map((t, i) => (
          <div key={t.team} className="rounded-xl p-4 border border-white/10 bg-white/5 hover:bg-white/8 transition-all">
            {/* 头部 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">#{i + 1}</span>
                <span className="text-lg font-bold text-yellow-400">{t.team}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] border ${valueColors[t.valueJudgment] || 'text-gray-400'}`}>
                {t.valueJudgment}
              </span>
            </div>

            {/* 概率对比条 */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">市场概率 <b className="text-white">{t.polymarketPct}%</b></span>
                <span className="text-gray-400">AI估值 <b className="text-green-300">{t.myEstimate}%</b></span>
              </div>
              <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-indigo-500/60 rounded-full" style={{ width: `${t.polymarketPct * 2.5}%` }} />
                <div className="absolute top-0 left-0 h-full border-r-2 border-green-400" style={{ width: `${t.myEstimate * 2.5}%` }} />
              </div>
            </div>

            {/* 内容 */}
            <div className="space-y-2 text-xs">
              <div><span className="text-gray-500">📋 本届表现: </span><span className="text-gray-300">{t.wcPerformance}</span></div>
              <div><span className="text-gray-500">💪 优势: </span><span className="text-gray-300">{t.strengths}</span></div>
              <div><span className="text-gray-500">⚠️ 隐忧: </span><span className="text-gray-300">{t.weaknesses}</span></div>
              <div><span className="text-gray-500">🗺️ 路径: </span><span className="text-gray-300">{t.pathToFinal}</span></div>
              <div><span className="text-gray-500">🔑 关键: </span><span className="text-yellow-300/80">{t.keyFactor}</span></div>
              <div><span className="text-gray-500">⚡ 出局风险: </span><span className="text-red-300/80">{t.wildcardRisk}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
