// 合并 scripts/odds-raw.json 的真实赔率到 src/data/analysis.json
// odds-raw.json 的 key 是 matchNo，值是 {platform:{home,draw,away}}
// home=该场 team1, away=该场 team2
import fs from 'node:fs'

const raw = JSON.parse(fs.readFileSync('scripts/odds-raw.json', 'utf-8'))
const analysis = JSON.parse(fs.readFileSync('src/data/analysis.json', 'utf-8'))

let merged = 0
for (const m of analysis.matches) {
  const r = raw[String(m.matchNo)]
  if (!r) continue
  const byTeam = {}
  for (const [slug, o] of Object.entries(r)) {
    // home->team1, away->team2; 跳过 draw<=0 的无效平局盘
    const entry = { [m.team1]: o.home, [m.team2]: o.away }
    if (o.draw && o.draw > 0) entry.draw = o.draw
    byTeam[slug] = entry
  }
  m.realOdds = byTeam
  merged++
}

analysis.oddsUpdatedAt = new Date().toISOString()
analysis.oddsSource = '联网搜索 (Pinnacle/Bet365/William Hill/Polymarket 等公开盘口)'
analysis.oddsBooks = ['polymarket', 'pinnacle', 'bet365', 'williamhill']
fs.writeFileSync('src/data/analysis.json', JSON.stringify(analysis, null, 2), 'utf-8')

const withOdds = analysis.matches.filter(m => m.realOdds && Object.keys(m.realOdds).length).length
console.log(`合并完成: 本次写入 ${merged} 场, 全量共 ${withOdds}/${analysis.matches.length} 场含真实赔率`)
