'use client'

import { useState } from 'react'

interface DeepAnalysis {
  winProbability?: Record<string, number>
  tacticalAnalysis?: string
  physicalAnalysis?: string
  formAnalysis?: string
  injuryImpact?: string
  h2hAnalysis?: string
  oddsAnalysis?: string
  externalFactors?: string
  psychologyAnalysis?: string
  consensusView?: string
  latestNewsSummary?: string
  objectiveConclusion?: string
  // 爆冷专项维度
  upsetTriggers?: string
  antiUpsetFactors?: string
  historicalUpsetPattern?: string
  valueAssessment?: string
  upsetScenario?: string
  qualificationAnalysis?: string
}

interface Insights {
  injuries?: string
  form?: string
  tactics?: string
  h2h?: string
  keyPlayers?: string
  xfactor?: string
  expertViews?: string[]
}

interface UpsetResult {
  rank?: number
  matchNo?: number
  kickoff?: string
  group: string
  team1: string
  team2: string
  upsetProbability: number
  upsetTeam: string
  favoriteTeam: string
  upsetWinOdds?: number
  keyReason: string
  detailedAnalysis: string
  riskLevel: 'high' | 'medium' | 'low'
  realOdds?: Record<string, Record<string, number>> | null
  deepAnalysis?: DeepAnalysis | null
  insights?: Insights | null
  latestNews?: string[] | null
  coachAnalysis?: {
    team1Coach?: { name?: string; style?: string; formation?: string; formationStrengths?: string; formationWeaknesses?: string }
    team2Coach?: { name?: string; style?: string; formation?: string; formationStrengths?: string; formationWeaknesses?: string }
    formationMatchup?: string
    coachTacticalBattle?: string
  } | null
}

// 根据 1X2 赔率计算去水位后的隐含概率
function impliedProb(o: Record<string, number>, t1: string, t2: string) {
  const h = o[t1], d = o.draw, a = o[t2]
  if (!h || !d || !a) return null
  const inv = [1 / h, 1 / d, 1 / a]
  const sum = inv[0] + inv[1] + inv[2]
  return { [t1]: Math.round((inv[0] / sum) * 100), draw: Math.round((inv[1] / sum) * 100), [t2]: Math.round((inv[2] / sum) * 100) }
}

const BOOK_LABELS: Record<string, string> = {
  polymarket: 'Polymarket', pinnacle: 'Pinnacle', bet365: 'Bet365',
  williamhill: 'William Hill', draftkings: 'DraftKings', fanduel: 'FanDuel', kalshi: 'Kalshi',
}

export default function UpsetCard({ upset }: { upset: UpsetResult }) {
  const [expanded, setExpanded] = useState(false)

  const riskColors = {
    high: { bg: 'border-red-500/40 bg-red-500/5', text: 'text-red-400', glow: 'glow-high', badge: 'bg-red-500/20 text-red-300' },
    medium: { bg: 'border-yellow-500/40 bg-yellow-500/5', text: 'text-yellow-400', glow: 'glow-medium', badge: 'bg-yellow-500/20 text-yellow-300' },
    low: { bg: 'border-green-500/40 bg-green-500/5', text: 'text-green-400', glow: 'glow-low', badge: 'bg-green-500/20 text-green-300' },
  }
  const colors = riskColors[upset.riskLevel]
  const riskLabels = { high: '高概率爆冷', medium: '中等概率', low: '低概率' }
  const da = upset.deepAnalysis
  const ins = upset.insights
  const wp = da?.winProbability
  // 市场隐含概率（优先 polymarket → pinnacle → bet365 → williamhill）
  const pmOdds = upset.realOdds?.polymarket
  const refOdds = pmOdds || upset.realOdds?.pinnacle || upset.realOdds?.bet365 || upset.realOdds?.williamhill
  const pmProb = refOdds ? impliedProb(refOdds, upset.team1, upset.team2) : null
  const pmLabel = pmOdds ? 'Polymarket' : upset.realOdds?.pinnacle ? 'Pinnacle(去水位)' : upset.realOdds?.bet365 ? 'Bet365(去水位)' : 'William Hill(去水位)'

  return (
    <div className={`rounded-xl p-5 border transition-all duration-300 ${colors.bg} ${colors.glow}`}>
      {/* 头部 */}
      <div className="flex justify-between items-start mb-3">
        {upset.matchNo ? (
          <span className="text-sm font-bold text-white/50">第{upset.matchNo}场</span>
        ) : (
          <span className="text-2xl font-bold text-white/80">#{upset.rank}</span>
        )}
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
          {riskLabels[upset.riskLevel]}
        </span>
      </div>

      {/* 对阵 */}
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-lg font-medium text-white">{upset.team1}</span>
          <span className="text-gray-500 text-sm">vs</span>
          <span className="text-lg font-medium text-white">{upset.team2}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-xs text-gray-500">第{upset.group}组</span>
        </div>
        {upset.kickoff && (
          <div className="mt-1 inline-flex items-center gap-1 text-xs text-blue-300/80">
            🕐 {upset.kickoff} <span className="text-gray-600">(美东ET)</span>
          </div>
        )}
      </div>

      {/* Polymarket/市场隐含概率 */}
      {pmProb && (
        <div className="mb-3 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <div className="flex items-center justify-between text-[10px] text-indigo-300/80 mb-1">
            <span>🔮 {pmLabel} 隐含概率</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white">{upset.team1} <b className="text-indigo-300">{pmProb[upset.team1]}%</b></span>
            <span className="text-gray-400">平 <b>{pmProb.draw}%</b></span>
            <span className="text-white">{upset.team2} <b className="text-indigo-300">{pmProb[upset.team2]}%</b></span>
          </div>
        </div>
      )}

      {/* 胜平负/胜负概率（Opus研判） */}
      {wp && (
        <div className="mb-3">
          <div className="text-[10px] text-gray-500 mb-1">
            {wp.draw ? '胜平负概率' : '胜负概率'} (Opus 4.8 去水位研判)
          </div>
          {wp.draw ? (
            <>
              <div className="flex w-full h-6 rounded-md overflow-hidden text-[10px] font-medium">
                <div className="bg-blue-500/70 flex items-center justify-center" style={{ width: `${wp[upset.team1] ?? 0}%` }}>
                  {(wp[upset.team1] ?? 0) >= 12 ? `${wp[upset.team1]}%` : ''}
                </div>
                <div className="bg-gray-500/60 flex items-center justify-center" style={{ width: `${wp.draw ?? 0}%` }}>
                  {(wp.draw ?? 0) >= 12 ? `${wp.draw}%` : ''}
                </div>
                <div className="bg-purple-500/70 flex items-center justify-center" style={{ width: `${wp[upset.team2] ?? 0}%` }}>
                  {(wp[upset.team2] ?? 0) >= 12 ? `${wp[upset.team2]}%` : ''}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                <span>{upset.team1}</span><span>平</span><span>{upset.team2}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex w-full h-6 rounded-md overflow-hidden text-[10px] font-medium">
                <div className="bg-blue-500/70 flex items-center justify-center" style={{ width: `${wp[upset.team1] ?? 0}%` }}>
                  {`${wp[upset.team1] ?? 0}%`}
                </div>
                <div className="bg-purple-500/70 flex items-center justify-center" style={{ width: `${wp[upset.team2] ?? 0}%` }}>
                  {`${wp[upset.team2] ?? 0}%`}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                <span>{upset.team1}</span><span>淘汰赛·无平局</span><span>{upset.team2}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* 爆冷概率条 */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">爆冷概率</span>
          <span className={`font-bold ${colors.text}`}>{upset.upsetProbability}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className={`h-2 rounded-full transition-all duration-500 ${upset.riskLevel === 'high' ? 'bg-red-500' : upset.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${upset.upsetProbability}%` }} />
        </div>
      </div>

      {/* 爆冷赔率 */}
      {upset.upsetWinOdds && (
        <div className="mb-3 flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/10">
          <span className="text-xs text-gray-400">💰 爆冷赢球参考赔率 ({upset.upsetTeam})</span>
          <span className="text-lg font-bold text-green-400">{upset.upsetWinOdds.toFixed(2)}</span>
        </div>
      )}

      {/* 真实赔率表 */}
      {upset.realOdds && Object.keys(upset.realOdds).length > 0 && (
        <div className="mb-3 p-2 rounded-lg bg-black/20 border border-white/10">
          <div className="text-xs text-gray-400 mb-1.5">🏦 各平台真实赔率 (主/平/客)</div>
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-1 text-[10px] text-gray-500">
              <span>平台</span><span className="text-center">{upset.team1}</span><span className="text-center">平</span><span className="text-center">{upset.team2}</span>
            </div>
            {Object.entries(upset.realOdds).map(([slug, o]) => (
              <div key={slug} className="grid grid-cols-4 gap-1 text-[11px]">
                <span className="text-gray-300 truncate">{BOOK_LABELS[slug] || slug}</span>
                <span className="text-center text-white">{o[upset.team1]?.toFixed(2) ?? '-'}</span>
                <span className="text-center text-gray-400">{o.draw?.toFixed(2) ?? '-'}</span>
                <span className="text-center text-white">{o[upset.team2]?.toFixed(2) ?? '-'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 客观结论 */}
      <div className="space-y-2">
        <div>
          <span className="text-xs text-gray-500">🎯 可能爆冷方: </span>
          <span className={`text-sm font-medium ${colors.text}`}>{upset.upsetTeam}</span>
        </div>
        <p className="text-xs text-gray-300 mt-2 leading-relaxed">
          {da?.objectiveConclusion || upset.detailedAnalysis}
        </p>
      </div>

      {/* 展开全维度分析 */}
      {(da || ins) && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-blue-300 transition-all border border-white/10"
          >
            {expanded ? '收起全维度分析 ▲' : '🔬 展开 Opus 4.8 全维度分析 ▼'}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 text-xs">
              {da?.tacticalAnalysis && <Dim icon="⚙️" label="战术体系与相克" text={da.tacticalAnalysis} />}

              {/* 主教练与阵型PK */}
              {upset.coachAnalysis && (
                <div className="p-2 rounded-lg bg-white/5 space-y-1.5">
                  <div className="text-gray-400 mb-1">👔 主教练 & 阵型 PK</div>
                  {upset.coachAnalysis.team1Coach && (
                    <div className="text-gray-300">
                      <span className="text-blue-300">{upset.team1}</span>：{upset.coachAnalysis.team1Coach.name} · <span className="text-white font-medium">{upset.coachAnalysis.team1Coach.formation}</span> · {upset.coachAnalysis.team1Coach.style}
                    </div>
                  )}
                  {upset.coachAnalysis.team2Coach && (
                    <div className="text-gray-300">
                      <span className="text-purple-300">{upset.team2}</span>：{upset.coachAnalysis.team2Coach.name} · <span className="text-white font-medium">{upset.coachAnalysis.team2Coach.formation}</span> · {upset.coachAnalysis.team2Coach.style}
                    </div>
                  )}
                  {upset.coachAnalysis.formationMatchup && (
                    <div className="text-gray-300 pt-1 border-t border-white/5">⚔️ 阵型PK：{upset.coachAnalysis.formationMatchup}</div>
                  )}
                  {upset.coachAnalysis.coachTacticalBattle && (
                    <div className="text-gray-300">🧩 教练博弈：{upset.coachAnalysis.coachTacticalBattle}</div>
                  )}
                </div>
              )}

              {da?.physicalAnalysis && <Dim icon="💪" label="身体素质对比" text={da.physicalAnalysis} />}
              {da?.formAnalysis && <Dim icon="📈" label="近期状态与士气" text={da.formAnalysis} />}
              {da?.injuryImpact && <Dim icon="🏥" label="伤病停赛影响" text={da.injuryImpact} />}
              {da?.h2hAnalysis && <Dim icon="🔁" label="历史交锋" text={da.h2hAnalysis} />}
              {da?.oddsAnalysis && <Dim icon="💹" label="赔率与资金动向" text={da.oddsAnalysis} />}
              {da?.qualificationAnalysis && <Dim icon="🏁" label="出线形势与本场影响" text={da.qualificationAnalysis} />}
              {da?.externalFactors && <Dim icon="🌍" label="地理/气候/主场" text={da.externalFactors} />}
              {da?.psychologyAnalysis && <Dim icon="🧠" label="心理与大赛经验" text={da.psychologyAnalysis} />}
              {da?.consensusView && <Dim icon="🗣️" label="全网专家共识" text={da.consensusView} />}

              {/* 爆冷专项维度 */}
              {(da?.upsetTriggers || da?.antiUpsetFactors || da?.upsetScenario) && (
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[11px] text-yellow-400/80 font-medium mb-2">🔥 爆冷机会深度分析</div>
                </div>
              )}
              {da?.upsetTriggers && <Dim icon="⚡" label="可能触发爆冷的关键条件" text={da.upsetTriggers} />}
              {da?.antiUpsetFactors && <Dim icon="🛡️" label="阻止爆冷的防护因素" text={da.antiUpsetFactors} />}
              {da?.historicalUpsetPattern && <Dim icon="📖" label="历史类似爆冷案例" text={da.historicalUpsetPattern} />}
              {da?.valueAssessment && <Dim icon="💎" label="押注价值评估" text={da.valueAssessment} />}
              {da?.upsetScenario && <Dim icon="🎬" label="爆冷发生的剧本" text={da.upsetScenario} />}

              {da?.latestNewsSummary && <Dim icon="📰" label="最新新闻要点" text={da.latestNewsSummary} />}

              {ins?.keyPlayers && <Dim icon="⭐" label="关键球员" text={ins.keyPlayers} />}

              {/* 最新Google新闻 */}
              {upset.latestNews && upset.latestNews.length > 0 && (
                <div className="p-2 rounded-lg bg-black/20 border border-white/10">
                  <div className="text-gray-400 mb-1.5">🗞️ 最新新闻 (Google News)</div>
                  <ul className="space-y-1">
                    {upset.latestNews.slice(0, 5).map((v, i) => (
                      <li key={i} className="text-gray-300 leading-relaxed">• {v}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 全网专家原始观点 */}
              {ins?.expertViews && ins.expertViews.length > 0 && (
                <div className="p-2 rounded-lg bg-black/20 border border-white/10">
                  <div className="text-gray-400 mb-1.5">📰 全网优质观点来源</div>
                  <ul className="space-y-1">
                    {ins.expertViews.map((v, i) => (
                      <li key={i} className="text-gray-300 leading-relaxed">• {v}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Dim({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <div className="p-2 rounded-lg bg-white/5">
      <div className="text-gray-400 mb-0.5">{icon} {label}</div>
      <div className="text-gray-300 leading-relaxed">{text}</div>
    </div>
  )
}
