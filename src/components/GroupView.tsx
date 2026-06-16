import { generateMatches, isMatchFinished } from '@/data/matches'

interface GroupInfo {
  name: string
  teams: { name: string; rank: number; tier: number }[]
}

function fmtKickoff(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('zh-CN', { timeZone: 'America/New_York', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function GroupView({ group }: { group: GroupInfo }) {
  const tierLabels: Record<number, string> = {
    1: '第一档（种子队）',
    2: '第二档',
    3: '第三档',
    4: '第四档',
  }

  const tierColors: Record<number, string> = {
    1: 'text-yellow-400',
    2: 'text-blue-400',
    3: 'text-green-400',
    4: 'text-gray-400',
  }

  const now = new Date()
  const groupMatches = generateMatches().filter(m => m.group === group.name)

  return (
    <div className="upset-card">
      <h3 className="text-xl font-bold text-yellow-400 mb-4">
        第{group.name}组
      </h3>
      <div className="space-y-3">
        {group.teams.map((team) => (
          <div
            key={team.name}
            className="flex items-center justify-between p-2 rounded-lg bg-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">{team.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">
                FIFA #{team.rank}
              </div>
              <div className={`text-xs ${tierColors[team.tier]}`}>
                {tierLabels[team.tier]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 小组赛程与时间 */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="text-xs text-gray-400 mb-2 font-medium">📅 赛程（美东ET）</div>
        <div className="space-y-1.5">
          {groupMatches.map((m) => {
            const finished = isMatchFinished(m, now)
            return (
              <div key={m.id} className={`flex items-center justify-between text-xs ${finished ? 'opacity-40' : ''}`}>
                <span className="text-gray-300">
                  {m.team1} vs {m.team2}
                </span>
                <span className={finished ? 'text-gray-500 line-through' : 'text-blue-300/80'}>
                  {finished ? '已结束' : fmtKickoff(m.kickoffET)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 小组实力评估 */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="text-xs text-gray-500">
          小组平均排名: {Math.round(group.teams.reduce((s, t) => s + t.rank, 0) / 4)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          排名差距: {Math.max(...group.teams.map(t => t.rank)) - Math.min(...group.teams.map(t => t.rank))} 位
        </div>
      </div>
    </div>
  )
}
