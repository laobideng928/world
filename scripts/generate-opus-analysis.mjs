// 用 Claude Opus 4.8 逐场做全维度客观分析
// 结合：真实多平台赔率(analysis.json的realOdds) + 全网搜集观点(insights-data.mjs)
// 运行: node scripts/generate-opus-analysis.mjs
import fs from 'node:fs'
import { insights } from './insights-data.mjs'

const envText = fs.readFileSync('.env.local', 'utf-8')
const env = {}
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}
const API_KEY = env.AI_API_KEY
const BASE_URL = env.AI_BASE_URL
const MODEL = 'claude-opus-4-8'

const analysis = JSON.parse(fs.readFileSync('src/data/analysis.json', 'utf-8'))

function oddsText(realOdds, t1, t2) {
  if (!realOdds) return '暂无真实赔率'
  return Object.entries(realOdds).map(([slug, o]) =>
    `${slug}: ${t1} ${o[t1] ?? '-'} / 平 ${o.draw ?? '-'} / ${t2} ${o[t2] ?? '-'}`
  ).join('；')
}

function insightText(ins) {
  if (!ins) return '暂无搜集到的赛前情报'
  return [
    ins.injuries ? `伤病停赛: ${ins.injuries}` : '',
    ins.form ? `近期状态: ${ins.form}` : '',
    ins.tactics ? `战术风格: ${ins.tactics}` : '',
    ins.h2h ? `历史交锋: ${ins.h2h}` : '',
    ins.keyPlayers ? `关键球员: ${ins.keyPlayers}` : '',
    ins.xfactor ? `X因素: ${ins.xfactor}` : '',
    (ins.expertViews && ins.expertViews.length) ? `全网专家观点: ${ins.expertViews.join(' | ')}` : '',
  ].filter(Boolean).join('\n')
}

async function analyzeOne(m, retries = 2) {
  const ins = insights[String(m.matchNo)]
  const prompt = `你是世界顶级的足球赛事分析师，以客观、中立、数据驱动著称。请对这场2026世界杯小组赛做全维度的客观分析。务必基于提供的真实赔率和全网情报，不臆测、不偏袒，呈现多方视角。

【比赛】第${m.matchNo}场 ${m.group}组 ${m.team1}(FIFA第${m.team1Rank}) vs ${m.team2}(FIFA第${m.team2Rank})
【开球】${m.kickoff} 美东ET · ${m.city} ${m.venue}

【各大平台真实赔率(主/平/客)】
${oddsText(m.realOdds, m.team1, m.team2)}

【全网搜集的赛前情报与专家观点】
${insightText(ins)}

请输出严格的JSON(不带markdown标记)，对以下所有维度做客观分析：
{
  "winProbability": {"${m.team1}": 数字, "draw": 数字, "${m.team2}": 数字},   // 三者和为100，基于赔率去水位+情报综合研判
  "tacticalAnalysis": "战术体系与相克的客观分析(120字内)",
  "physicalAnalysis": "身体素质对比：速度/对抗/耐力(80字内)",
  "formAnalysis": "近期状态与士气客观评估(80字内)",
  "injuryImpact": "伤病停赛对双方的实际影响(80字内)",
  "h2hAnalysis": "历史交锋的参考价值(60字内)",
  "oddsAnalysis": "赔率与市场资金动向解读，含去水位后的公平概率判断(100字内)",
  "externalFactors": "地理/气候/主场/旅行/赛程因素(70字内)",
  "psychologyAnalysis": "心理与大赛经验、出线压力(70字内)",
  "consensusView": "综合全网专家观点的客观共识(100字内)",
  "upsetProbability": 数字0-100,   // 排名较低方爆冷取胜概率
  "upsetTeam": "可能爆冷的弱队",
  "favoriteTeam": "被看好的强队",
  "upsetWinOdds": 数字,   // 押弱队取胜的参考欧赔
  "riskLevel": "high/medium/low",   // 爆冷风险等级
  "objectiveConclusion": "最客观的结论与最可能的比分区间(120字内)"
}
要求：分析要平衡呈现支持与反对爆冷的论据，体现最客观的判断。只返回JSON。`

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: '你是客观中立的顶级足球分析师，只返回有效JSON，不含markdown标记。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.6, max_tokens: 3000,
        }),
      })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      const content = data.choices?.[0]?.message?.content || ''
      const jm = content.match(/\{[\s\S]*\}/)
      if (!jm) throw new Error('no json')
      return JSON.parse(jm[0])
    } catch (e) {
      if (attempt === retries) {
        console.error(`  第${m.matchNo}场分析失败: ${e.message}`)
        return null
      }
      await new Promise(r => setTimeout(r, 2000))
    }
  }
}

async function runWithConcurrency(items, limit, fn) {
  const results = new Array(items.length)
  let idx = 0
  async function worker() {
    while (idx < items.length) {
      const i = idx++
      process.stdout.write(`  [Opus4.8] 分析第${items[i].matchNo}场 ${items[i].team1}vs${items[i].team2}\n`)
      results[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
  return results
}

async function main() {
  const matches = analysis.matches
  console.log(`用 ${MODEL} 全维度分析 ${matches.length} 场比赛...\n`)
  const deep = await runWithConcurrency(matches, 5, analyzeOne)

  let ok = 0
  matches.forEach((m, i) => {
    if (deep[i]) {
      m.deepAnalysis = deep[i]
      // 用 Opus 的研判覆盖核心爆冷字段
      if (typeof deep[i].upsetProbability === 'number') m.upsetProbability = deep[i].upsetProbability
      if (deep[i].upsetTeam) m.upsetTeam = deep[i].upsetTeam
      if (deep[i].favoriteTeam) m.favoriteTeam = deep[i].favoriteTeam
      if (deep[i].upsetWinOdds) m.upsetWinOdds = deep[i].upsetWinOdds
      if (deep[i].riskLevel) m.riskLevel = deep[i].riskLevel
      m.insights = insights[String(m.matchNo)] || null
      ok++
    }
  })

  analysis.deepModel = MODEL
  analysis.deepAnalyzedAt = new Date().toISOString()
  fs.writeFileSync('src/data/analysis.json', JSON.stringify(analysis, null, 2), 'utf-8')
  console.log(`\n完成! ${ok}/${matches.length} 场获得 Opus 4.8 全维度分析，已写入 analysis.json`)
}

main().catch(e => { console.error(e); process.exit(1) })
