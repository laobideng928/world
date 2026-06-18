// 定时自动更新：拉取每场最新Google新闻 + Opus 4.8 重新全维度分析
// 仅处理未开赛比赛；赔率保留上次数据并标注。
// 本地: node scripts/auto-update.mjs
// CI:   AI_API_KEY=... AI_BASE_URL=... node scripts/auto-update.mjs
import fs from 'node:fs'

// 读取配置：优先环境变量(CI)，否则读 .env.local(本地)
function loadEnv() {
  const e = {
    AI_API_KEY: process.env.AI_API_KEY,
    AI_BASE_URL: process.env.AI_BASE_URL,
  }
  if ((!e.AI_API_KEY || !e.AI_BASE_URL) && fs.existsSync('.env.local')) {
    const txt = fs.readFileSync('.env.local', 'utf-8')
    for (const line of txt.split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/)
      if (m && !e[m[1]]) e[m[1]] = m[2].trim()
    }
  }
  return e
}
const env = loadEnv()
const API_KEY = env.AI_API_KEY
const BASE_URL = env.AI_BASE_URL
const MODEL = 'claude-opus-4-8'
if (!API_KEY || !BASE_URL) { console.error('缺少 AI_API_KEY / AI_BASE_URL'); process.exit(1) }

// 英文队名映射用于新闻搜索
const CN2EN = {
  '墨西哥':'Mexico','南非':'South Africa','韩国':'South Korea','捷克':'Czechia','加拿大':'Canada','波黑':'Bosnia','卡塔尔':'Qatar','瑞士':'Switzerland',
  '巴西':'Brazil','摩洛哥':'Morocco','海地':'Haiti','苏格兰':'Scotland','美国':'USA','巴拉圭':'Paraguay','澳大利亚':'Australia','土耳其':'Turkiye',
  '德国':'Germany','库拉索':'Curacao','科特迪瓦':'Ivory Coast','厄瓜多尔':'Ecuador','荷兰':'Netherlands','日本':'Japan','瑞典':'Sweden','突尼斯':'Tunisia',
  '比利时':'Belgium','埃及':'Egypt','伊朗':'Iran','新西兰':'New Zealand','西班牙':'Spain','佛得角':'Cape Verde','沙特阿拉伯':'Saudi Arabia','乌拉圭':'Uruguay',
  '法国':'France','塞内加尔':'Senegal','伊拉克':'Iraq','挪威':'Norway','阿根廷':'Argentina','阿尔及利亚':'Algeria','奥地利':'Austria','约旦':'Jordan',
  '葡萄牙':'Portugal','刚果民主共和国':'DR Congo','乌兹别克斯坦':'Uzbekistan','哥伦比亚':'Colombia','英格兰':'England','克罗地亚':'Croatia','加纳':'Ghana','巴拿马':'Panama',
}
const en = (cn) => CN2EN[cn] || cn

// 拉取 Google News RSS 最新标题
async function fetchNews(t1, t2) {
  const q = encodeURIComponent(`${en(t1)} ${en(t2)} World Cup 2026`)
  const url = `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(12000) })
    if (!r.ok) return []
    const xml = await r.text()
    const items = [...xml.matchAll(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/g)]
      .map(m => m[1])
      .filter(t => t && t !== 'Google News' && !t.includes('" - Google') && !/^".*"$/.test(t.trim()))
    return items.slice(0, 6)
  } catch { return [] }
}

function oddsText(realOdds, t1, t2) {
  if (!realOdds) return '暂无真实赔率'
  return Object.entries(realOdds).map(([s, o]) =>
    `${s}: ${t1} ${o[t1] ?? '-'} / 平 ${o.draw ?? '-'} / ${t2} ${o[t2] ?? '-'}`).join('；')
}

async function analyze(m, news, retries = 2) {
  const ins = m.insights || {}
  const newsBlock = news.length ? news.map((n, i) => `${i + 1}. ${n}`).join('\n') : '（本次未抓取到新增新闻，请基于已知情报分析）'
  const prompt = `你是世界顶级足球分析师，以客观中立著称。请对这场2026世界杯小组赛做全维度客观分析。重点结合下方【最新新闻】更新你的判断。

【比赛】第${m.matchNo}场 ${m.group}组 ${m.team1}(FIFA第${m.team1Rank}) vs ${m.team2}(FIFA第${m.team2Rank})
【开球】${m.kickoff} 美东ET · ${m.city} ${m.venue}
【各平台真实赔率(主/平/客)】${oddsText(m.realOdds, m.team1, m.team2)}
【既有情报】伤病:${ins.injuries||'-'}；状态:${ins.form||'-'}；战术:${ins.tactics||'-'}；交锋:${ins.h2h||'-'}；关键球员:${ins.keyPlayers||'-'}
【最新新闻(Google News,${new Date().toISOString().slice(0,10)})】
${newsBlock}

输出严格JSON(无markdown)：
{
 "winProbability":{"${m.team1}":数字,"draw":数字,"${m.team2}":数字},
 "tacticalAnalysis":"战术体系与相克(120字内)",
 "physicalAnalysis":"身体素质对比(80字内)",
 "formAnalysis":"近期状态士气，结合最新新闻(80字内)",
 "injuryImpact":"伤病停赛影响，结合最新新闻(80字内)",
 "h2hAnalysis":"历史交锋参考(60字内)",
 "oddsAnalysis":"赔率与资金动向，去水位公平概率(100字内)",
 "externalFactors":"地理气候主场(70字内)",
 "psychologyAnalysis":"心理与大赛经验(70字内)",
 "consensusView":"综合全网共识(100字内)",
 "latestNewsSummary":"最新新闻要点提炼(80字内)",
 "upsetProbability":数字0-100,"upsetTeam":"弱队","favoriteTeam":"强队","upsetWinOdds":数字,"riskLevel":"high/medium/low",
 "upsetTriggers":"可能触发爆冷的3-4个关键条件，如伤病/战术克制/心理/气候等(100字内)",
 "antiUpsetFactors":"阻止爆冷发生的2-3个防护因素(80字内)",
 "historicalUpsetPattern":"历史上类似配置的爆冷案例参考(80字内)",
 "valueAssessment":"当前赔率是否低估了弱队？押注价值如何(80字内)",
 "upsetScenario":"如果爆冷发生，最可能的比赛剧本是什么(100字内)",
 "objectiveConclusion":"最客观结论与比分区间(120字内)"
}
平衡呈现支持与反对爆冷的论据。只返回JSON。`
  for (let a = 0; a <= retries; a++) {
    try {
      const r = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({ model: MODEL, messages: [
          { role: 'system', content: '你是客观中立的顶级足球分析师，只返回有效JSON，不含markdown。' },
          { role: 'user', content: prompt }], temperature: 0.6, max_tokens: 3000 }),
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = await r.json()
      const c = data.choices?.[0]?.message?.content || ''
      const jm = c.match(/\{[\s\S]*\}/)
      if (!jm) throw new Error('no json')
      return JSON.parse(jm[0])
    } catch (e) {
      if (a === retries) { console.error(`  第${m.matchNo}场失败: ${e.message}`); return null }
      await new Promise(r => setTimeout(r, 2000))
    }
  }
}

async function runPool(items, limit, fn) {
  const res = new Array(items.length); let i = 0
  async function w() { while (i < items.length) { const k = i++; res[k] = await fn(items[k], k) } }
  await Promise.all(Array.from({ length: limit }, w)); return res
}

async function main() {
  const analysis = JSON.parse(fs.readFileSync('src/data/analysis.json', 'utf-8'))
  const now = Date.now()
  const upcoming = analysis.matches.filter(m => new Date(m.kickoffET).getTime() > now)
  console.log(`自动更新：${upcoming.length} 场未开赛比赛（${new Date().toISOString()}）`)

  await runPool(upcoming, 5, async (m) => {
    process.stdout.write(`  更新第${m.matchNo}场 ${m.team1}vs${m.team2}\n`)
    const news = await fetchNews(m.team1, m.team2)
    const da = await analyze(m, news)
    if (da) {
      m.deepAnalysis = da
      m.latestNews = news
      if (typeof da.upsetProbability === 'number') m.upsetProbability = da.upsetProbability
      if (da.upsetTeam) m.upsetTeam = da.upsetTeam
      if (da.favoriteTeam) m.favoriteTeam = da.favoriteTeam
      if (da.upsetWinOdds) m.upsetWinOdds = da.upsetWinOdds
      if (da.riskLevel) m.riskLevel = da.riskLevel
    }
  })

  analysis.deepModel = MODEL
  analysis.lastUpdated = new Date().toISOString()
  fs.writeFileSync('src/data/analysis.json', JSON.stringify(analysis, null, 2), 'utf-8')
  console.log(`完成！更新时间 ${analysis.lastUpdated}`)
}
main().catch(e => { console.error(e); process.exit(1) })
