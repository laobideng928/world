// 从 OddsPapi 拉取真实多平台赔率，合并进 src/data/analysis.json
// 用法: ODDSPAPI_KEY=你的key node scripts/fetch-odds.mjs
import fs from 'node:fs'

const API_KEY = process.env.ODDSPAPI_KEY || ''
const BASE = 'https://api.oddspapi.io/v4'
// 想要的平台（用户选择以 Polymarket 为主，附带几个对照）
const WANT_BOOKS = (process.env.ODDS_BOOKS || 'polymarket,pinnacle,bet365,williamhill').split(',')

if (!API_KEY) {
  console.error('缺少 API key。请用: ODDSPAPI_KEY=你的key node scripts/fetch-odds.mjs')
  process.exit(1)
}

// 英文队名 -> 中文（与 analysis.json 对齐）
const EN2CN = {
  'Mexico': '墨西哥', 'South Africa': '南非', 'Korea Republic': '韩国', 'South Korea': '韩国', 'Czechia': '捷克', 'Czech Republic': '捷克',
  'Canada': '加拿大', 'Bosnia and Herzegovina': '波黑', 'Qatar': '卡塔尔', 'Switzerland': '瑞士',
  'Brazil': '巴西', 'Morocco': '摩洛哥', 'Haiti': '海地', 'Scotland': '苏格兰',
  'United States': '美国', 'USA': '美国', 'Paraguay': '巴拉圭', 'Australia': '澳大利亚', 'Turkiye': '土耳其', 'Türkiye': '土耳其', 'Turkey': '土耳其',
  'Germany': '德国', 'Curacao': '库拉索', 'Curaçao': '库拉索', 'Ivory Coast': '科特迪瓦', "Cote d'Ivoire": '科特迪瓦', "Côte d'Ivoire": '科特迪瓦', 'Ecuador': '厄瓜多尔',
  'Netherlands': '荷兰', 'Japan': '日本', 'Sweden': '瑞典', 'Tunisia': '突尼斯',
  'Belgium': '比利时', 'Egypt': '埃及', 'Iran': '伊朗', 'IR Iran': '伊朗', 'New Zealand': '新西兰',
  'Spain': '西班牙', 'Cape Verde': '佛得角', 'Cabo Verde': '佛得角', 'Saudi Arabia': '沙特阿拉伯', 'Uruguay': '乌拉圭',
  'France': '法国', 'Senegal': '塞内加尔', 'Iraq': '伊拉克', 'Norway': '挪威',
  'Argentina': '阿根廷', 'Algeria': '阿尔及利亚', 'Austria': '奥地利', 'Jordan': '约旦',
  'Portugal': '葡萄牙', 'Congo DR': '刚果民主共和国', 'DR Congo': '刚果民主共和国', 'Uzbekistan': '乌兹别克斯坦', 'Colombia': '哥伦比亚',
  'England': '英格兰', 'Croatia': '克罗地亚', 'Ghana': '加纳', 'Panama': '巴拿马',
}
const cn = (en) => EN2CN[en] || en

async function getJson(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`HTTP ${r.status} on ${url}`)
  return r.json()
}

// 拉取世界杯所有 fixtures（分 10 天窗口）
async function getFixtures() {
  const windows = [['2026-06-11', '2026-06-20'], ['2026-06-21', '2026-06-30']]
  let all = []
  for (const [from, to] of windows) {
    const data = await getJson(`${BASE}/fixtures?apiKey=${API_KEY}&sportId=10&from=${from}&to=${to}`)
    const wc = (Array.isArray(data) ? data : []).filter(f => f.tournamentName === 'World Cup')
    all = all.concat(wc)
    await new Promise(r => setTimeout(r, 1000))
  }
  return all
}

// 解析单场 1X2 赔率
function parse1x2(books, slug) {
  try {
    const outs = books[slug].markets['101'].outcomes
    return {
      home: outs['101'].players['0'].price,
      draw: outs['102'].players['0'].price,
      away: outs['103'].players['0'].price,
    }
  } catch { return null }
}

async function getOdds(fixtureId) {
  const data = await getJson(`${BASE}/odds?apiKey=${API_KEY}&fixtureId=${fixtureId}&bookmakers=${WANT_BOOKS.join(',')}`)
  const books = data.bookmakerOdds || {}
  const result = {}
  for (const slug of WANT_BOOKS) {
    const l = parse1x2(books, slug)
    if (l) result[slug] = l
  }
  return result
}

async function main() {
  console.log('拉取世界杯 fixtures ...')
  const fixtures = await getFixtures()
  console.log(`找到 ${fixtures.length} 场 fixtures`)

  // 用 (中文队1,中文队2) 集合做匹配键（无序）
  const key = (a, b) => [cn(a), cn(b)].sort().join('__')
  const fxMap = new Map()
  for (const f of fixtures) {
    if (f.hasOdds) fxMap.set(key(f.participant1Name, f.participant2Name), f)
  }

  const analysis = JSON.parse(fs.readFileSync('src/data/analysis.json', 'utf-8'))
  let matched = 0
  for (const m of analysis.matches) {
    const f = fxMap.get([m.team1, m.team2].sort().join('__'))
    if (!f) { m.realOdds = null; continue }
    try {
      const odds = await getOdds(f.fixtureId)
      // 判断主客映射：fixture 的 participant1 对应 home
      const p1cn = cn(f.participant1Name)
      const oddsByTeam = {}
      for (const [slug, l] of Object.entries(odds)) {
        // home=participant1, away=participant2
        oddsByTeam[slug] = p1cn === m.team1
          ? { [m.team1]: l.home, draw: l.draw, [m.team2]: l.away }
          : { [m.team1]: l.away, draw: l.draw, [m.team2]: l.home }
      }
      m.realOdds = oddsByTeam
      if (Object.keys(oddsByTeam).length) matched++
      process.stdout.write(`  第${m.matchNo}场 ${m.team1}vs${m.team2}: ${Object.keys(oddsByTeam).join(',') || '无盘口'}\n`)
      await new Promise(r => setTimeout(r, 1000))
    } catch (e) {
      m.realOdds = null
      process.stdout.write(`  第${m.matchNo}场 失败: ${e.message}\n`)
    }
  }

  analysis.oddsUpdatedAt = new Date().toISOString()
  analysis.oddsBooks = WANT_BOOKS
  fs.writeFileSync('src/data/analysis.json', JSON.stringify(analysis, null, 2), 'utf-8')
  console.log(`\n完成! ${matched}/${analysis.matches.length} 场获取到真实赔率，已写入 analysis.json`)
}

main().catch(e => { console.error(e); process.exit(1) })
