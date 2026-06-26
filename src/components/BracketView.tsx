'use client'

import { knockoutMatches, KnockoutMatch } from '@/data/knockout'

const roundColors: Record<string, string> = {
  '32强': 'border-blue-500/30 bg-blue-500/5',
  '16强': 'border-purple-500/30 bg-purple-500/5',
  '1/4决赛': 'border-yellow-500/30 bg-yellow-500/5',
  '半决赛': 'border-orange-500/30 bg-orange-500/5',
  '季军赛': 'border-gray-500/30 bg-gray-500/5',
  '决赛': 'border-red-500/30 bg-red-500/5',
}

const roundLabels: Record<string, string> = {
  '32强': '🏟️ 32强赛 (Round of 32)',
  '16强': '⚔️ 16强赛 (Round of 16)',
  '1/4决赛': '🔥 1/4决赛 (Quarter-Finals)',
  '半决赛': '🏆 半决赛 (Semi-Finals)',
  '季军赛': '🥉 季军赛',
  '决赛': '👑 决赛 (Final)',
}

function MatchCard({ m }: { m: KnockoutMatch }) {
  const color = roundColors[m.round] || 'border-white/10 bg-white/5'
  return (
    <div className={`p-3 rounded-lg border ${color} transition-all hover:border-white/30`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-gray-500">第{m.matchNo}场</span>
        <span className="text-[10px] text-blue-300/70">{m.date} 北京</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm font-medium ${m.confirmed ? 'text-white' : 'text-gray-400 italic'}`}>
          {m.team1}
        </span>
        <span className="text-xs text-gray-600">vs</span>
        <span className={`text-sm font-medium ${m.confirmed ? 'text-white' : 'text-gray-400 italic'}`}>
          {m.team2}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-gray-500">{m.venue}</span>
        {m.confirmed ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300">已确定</span>
        ) : (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400">待定</span>
        )}
      </div>
      {m.result && (
        <div className="mt-1 text-center text-sm font-bold text-yellow-400">{m.result}</div>
      )}
    </div>
  )
}

export default function BracketView() {
  const rounds = ['32强', '16强', '1/4决赛', '半决赛', '季军赛', '决赛']

  return (
    <div className="max-w-6xl mx-auto">
      {rounds.map((round) => {
        const matches = knockoutMatches.filter(m => m.round === round)
        if (!matches.length) return null
        return (
          <div key={round} className="mb-8">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              {roundLabels[round]}
            </h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {matches.map(m => (
                <MatchCard key={m.matchNo} m={m} />
              ))}
            </div>
          </div>
        )
      })}

      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl text-center text-xs text-gray-500">
        <p>⚠️ 待定对阵将在小组赛全部结束后（6月28日）自动确定</p>
        <p className="mt-1">赛制：12组前2名(24队) + 8个最佳第三名 = 32队进入淘汰赛</p>
      </div>
    </div>
  )
}
