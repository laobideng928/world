'use client'

import { useState, useMemo } from 'react'
import { groups } from '@/data/matches'
import analysisData from '@/data/analysis.json'
import knockoutData from '@/data/knockout-analysis.json'
import UpsetCard from '@/components/UpsetCard'
import SaveableCard from '@/components/SaveableCard'
import GroupView from '@/components/GroupView'
import BracketView from '@/components/BracketView'

interface UpsetResult {
  matchNo: number
  kickoff: string
  kickoffET: string
  group: string
  team1: string
  team2: string
  team1Rank: number
  team2Rank: number
  upsetProbability: number
  upsetTeam: string
  favoriteTeam: string
  upsetWinOdds?: number
  marketImplied?: string
  tacticalReason?: string
  physicalComparison?: string
  keyReason: string
  detailedAnalysis: string
  riskLevel: 'high' | 'medium' | 'low'
  realOdds?: Record<string, Record<string, number>> | null
  deepAnalysis?: Record<string, unknown> | null
  insights?: Record<string, unknown> | null
  latestNews?: string[] | null
  coachAnalysis?: Record<string, unknown> | null
  wcRecord?: Record<string, unknown> | null
}

type SortMode = 'upset' | 'time'
type RiskFilter = 'all' | 'high' | 'medium' | 'low'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'groups' | 'bracket'>('analysis')
  const [sortMode, setSortMode] = useState<SortMode>('upset')
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all')

  const allMatches = analysisData.matches as unknown as UpsetResult[]
  const koMatches = (knockoutData as { matches: unknown[] }).matches as unknown as UpsetResult[]
  const lastUpdated = (analysisData as { lastUpdated?: string }).lastUpdated || (knockoutData as { generatedAt?: string }).generatedAt
  const lastUpdatedText = lastUpdated
    ? new Date(lastUpdated).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null

  // 优先展示小组赛剩余，若为0则展示淘汰赛分析
  const upcoming = useMemo(() => {
    const now = Date.now()
    const groupUpcoming = allMatches.filter(m => m.kickoffET && new Date(m.kickoffET).getTime() > now)
    if (groupUpcoming.length > 0) return groupUpcoming
    // 小组赛已全部结束，展示淘汰赛
    return koMatches
  }, [allMatches, koMatches])

  const displayed = useMemo(() => {
    let list = [...upcoming]
    if (riskFilter !== 'all') list = list.filter(m => m.riskLevel === riskFilter)
    if (sortMode === 'upset') list.sort((a, b) => b.upsetProbability - a.upsetProbability)
    else list.sort((a, b) => new Date(a.kickoffET).getTime() - new Date(b.kickoffET).getTime())
    return list
  }, [upcoming, sortMode, riskFilter])

  const stats = useMemo(() => ({
    high: upcoming.filter(m => m.riskLevel === 'high').length,
    medium: upcoming.filter(m => m.riskLevel === 'medium').length,
    low: upcoming.filter(m => m.riskLevel === 'low').length,
  }), [upcoming])

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* 头部 */}
      <header className="text-center mb-8">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-3">
          ⚽ 2026世界杯爆冷分析器
        </h1>
        <p className="text-gray-300 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto px-2">
          Claude Opus 4.8 全维度客观分析 + Polymarket/Bet365/Pinnacle 真实赔率 + 全网优质观点汇总，逐场深度解析
        </p>
        <div className="mt-2 text-sm text-gray-500">
          🇺🇸🇨🇦🇲🇽 美国·加拿大·墨西哥 | 48支球队 · 12个小组 · 104场比赛
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-white/5 text-gray-400">🔬 全维度分析</span>
          <span className="px-2 py-1 rounded bg-white/5 text-gray-400">📊 真实赔率</span>
          <span className="px-2 py-1 rounded bg-white/5 text-gray-400">🗣️ 全网观点</span>
          <span className="px-2 py-1 rounded bg-white/5 text-gray-400">⚖️ 客观中立</span>
        </div>
      </header>

      {/* 选项卡 */}
      <div className="flex justify-start sm:justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto px-2 pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-all ${
            activeTab === 'analysis'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          🔥 爆冷分析
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-all ${
            activeTab === 'groups'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          📋 小组总览
        </button>
        <button
          onClick={() => setActiveTab('bracket')}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-all ${
            activeTab === 'bracket'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          🏆 淘汰赛对阵
        </button>
      </div>

      {activeTab === 'analysis' && (
        <div className="max-w-6xl mx-auto">
          {/* 统计概览 */}
          <div className="mb-4 sm:mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-white">{upcoming.length}</div>
              <div className="text-xs text-gray-400 mt-1">待赛比赛</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="text-2xl font-bold text-red-400">{stats.high}</div>
              <div className="text-xs text-gray-400 mt-1">高爆冷风险</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
              <div className="text-xs text-gray-400 mt-1">中等风险</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">{stats.low}</div>
              <div className="text-xs text-gray-400 mt-1">低风险</div>
            </div>
          </div>

          {/* 排序与筛选 */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <span className="text-sm text-gray-500 self-center">排序:</span>
              <button onClick={() => setSortMode('upset')} className={`px-3 py-1.5 rounded-lg text-sm ${sortMode === 'upset' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-400'}`}>按爆冷概率</button>
              <button onClick={() => setSortMode('time')} className={`px-3 py-1.5 rounded-lg text-sm ${sortMode === 'time' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-400'}`}>按比赛时间</button>
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500 self-center">风险:</span>
              {(['all', 'high', 'medium', 'low'] as RiskFilter[]).map(r => (
                <button key={r} onClick={() => setRiskFilter(r)} className={`px-3 py-1.5 rounded-lg text-sm ${riskFilter === r ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-gray-400'}`}>
                  {r === 'all' ? '全部' : r === 'high' ? '高' : r === 'medium' ? '中' : '低'}
                </button>
              ))}
            </div>
          </div>

          {/* 整体洞察 */}
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl text-center">
            <p className="text-sm text-gray-400">
              📊 已逐场全维度分析全部 <span className="text-white font-bold">{upcoming.length}</span> 场剩余比赛 ·
              数据由 Claude Opus 4.8 客观生成 ·
              {lastUpdatedText ? <>最近更新 <span className="text-green-300">{lastUpdatedText}</span> (北京时间) · 每4小时自动刷新</> : '所有用户看到相同结果'}
            </p>
          </div>

          {/* 全部赛程分析 */}
          {displayed.length === 0 ? (
            <div className="text-center p-10 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-5xl mb-4">🏁</div>
              <p className="text-gray-300">当前筛选条件下没有待赛比赛。</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayed.map((m) => (
                <SaveableCard key={m.matchNo} fileName={`爆冷分析_第${m.matchNo}场_${m.team1}vs${m.team2}`}>
                  <UpsetCard upset={{ ...m, rank: 0 }} />
                </SaveableCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupView key={group.name} group={group} />
          ))}
        </div>
      )}

      {activeTab === 'bracket' && <BracketView />}

      {/* 底部 */}
      <footer className="text-center mt-16 text-gray-500 text-sm">
        <p>数据来源: FIFA官方 · Polymarket · Bet365 · William Hill · Pinnacle · 全网媒体 · Claude Opus 4.8 全维度分析</p>
        <p className="mt-1">2026世界杯 · 美国·加拿大·墨西哥 联合举办</p>
      </footer>
    </main>
  )
}
