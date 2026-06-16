// 一次性生成脚本：列出剩余赛程，逐场调用AI分析，固化为 src/data/analysis.json
// 运行: node scripts/generate-analysis.mjs
import fs from 'node:fs'
import path from 'node:path'

// ---- 读取 .env.local ----
const envText = fs.readFileSync('.env.local', 'utf-8')
const env = {}
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}
const API_KEY = env.AI_API_KEY
const BASE_URL = env.AI_BASE_URL
const MODEL = env.AI_MODEL || 'gemini-3.1-pro-preview'

// ---- FIFA排名 ----
const R = {
  '阿根廷':1,'法国':2,'西班牙':3,'英格兰':4,'巴西':5,'葡萄牙':6,'荷兰':7,'比利时':8,'德国':9,'克罗地亚':10,
  '哥伦比亚':11,'乌拉圭':12,'摩洛哥':13,'日本':14,'美国':15,'墨西哥':16,'塞内加尔':17,'瑞士':18,'伊朗':19,'韩国':20,
  '澳大利亚':21,'厄瓜多尔':22,'奥地利':23,'土耳其':24,'挪威':25,'加拿大':26,'埃及':27,'苏格兰':28,'巴拉圭':29,'突尼斯':30,
  '科特迪瓦':31,'瑞典':32,'阿尔及利亚':33,'沙特阿拉伯':34,'南非':35,'乌兹别克斯坦':36,'卡塔尔':37,'波黑':38,'捷克':39,'巴拿马':40,
  '加纳':41,'刚果民主共和国':42,'伊拉克':43,'约旦':44,'佛得角':45,'海地':46,'新西兰':47,'库拉索':48,
}

// ---- 真实赛程 [场次,组,队1,队2,美东ISO,球场,城市] ----
const fixtures = [
  [1,'A','墨西哥','南非','2026-06-11T15:00:00-04:00','阿兹特克球场','墨西哥城'],
  [2,'A','韩国','捷克','2026-06-11T22:00:00-04:00','阿克隆球场','瓜达拉哈拉'],
  [3,'B','加拿大','波黑','2026-06-12T15:00:00-04:00','BMO球场','多伦多'],
  [4,'D','美国','巴拉圭','2026-06-12T21:00:00-04:00','SoFi体育场','洛杉矶'],
  [5,'C','海地','苏格兰','2026-06-13T21:00:00-04:00','吉列体育场','波士顿'],
  [6,'D','澳大利亚','土耳其','2026-06-14T00:00:00-04:00','BC体育场','温哥华'],
  [7,'C','巴西','摩洛哥','2026-06-13T18:00:00-04:00','大都会人寿球场','纽约/新泽西'],
  [8,'B','卡塔尔','瑞士','2026-06-13T15:00:00-04:00','利维斯体育场','旧金山湾区'],
  [9,'E','科特迪瓦','厄瓜多尔','2026-06-14T19:00:00-04:00','林肯金融球场','费城'],
  [10,'E','德国','库拉索','2026-06-14T13:00:00-04:00','NRG体育场','休斯顿'],
  [11,'F','荷兰','日本','2026-06-14T16:00:00-04:00','AT&T体育场','达拉斯'],
  [12,'F','瑞典','突尼斯','2026-06-14T22:00:00-04:00','BBVA球场','蒙特雷'],
  [13,'H','沙特阿拉伯','乌拉圭','2026-06-15T18:00:00-04:00','硬石体育场','迈阿密'],
  [14,'H','西班牙','佛得角','2026-06-15T12:00:00-04:00','梅赛德斯奔驰球场','亚特兰大'],
  [15,'G','伊朗','新西兰','2026-06-15T21:00:00-04:00','SoFi体育场','洛杉矶'],
  [16,'G','比利时','埃及','2026-06-15T15:00:00-04:00','流明球场','西雅图'],
  [17,'I','法国','塞内加尔','2026-06-16T15:00:00-04:00','大都会人寿球场','纽约/新泽西'],
  [18,'I','伊拉克','挪威','2026-06-16T18:00:00-04:00','吉列体育场','波士顿'],
  [19,'J','阿根廷','阿尔及利亚','2026-06-16T21:00:00-04:00','箭头体育场','堪萨斯城'],
  [20,'J','奥地利','约旦','2026-06-16T00:00:00-04:00','利维斯体育场','旧金山湾区'],
  [21,'L','加纳','巴拿马','2026-06-17T19:00:00-04:00','BMO球场','多伦多'],
  [22,'L','英格兰','克罗地亚','2026-06-17T16:00:00-04:00','AT&T体育场','达拉斯'],
  [23,'K','葡萄牙','刚果民主共和国','2026-06-17T13:00:00-04:00','NRG体育场','休斯顿'],
  [24,'K','乌兹别克斯坦','哥伦比亚','2026-06-17T22:00:00-04:00','阿兹特克球场','墨西哥城'],
  [25,'A','捷克','南非','2026-06-18T12:00:00-04:00','梅赛德斯奔驰球场','亚特兰大'],
  [26,'B','瑞士','波黑','2026-06-18T15:00:00-04:00','SoFi体育场','洛杉矶'],
  [27,'B','加拿大','卡塔尔','2026-06-18T18:00:00-04:00','BC体育场','温哥华'],
  [28,'A','墨西哥','韩国','2026-06-18T21:00:00-04:00','阿克隆球场','瓜达拉哈拉'],
  [29,'C','巴西','海地','2026-06-19T21:00:00-04:00','林肯金融球场','费城'],
  [30,'C','苏格兰','摩洛哥','2026-06-19T18:00:00-04:00','吉列体育场','波士顿'],
  [31,'D','土耳其','巴拉圭','2026-06-19T23:00:00-04:00','利维斯体育场','旧金山湾区'],
  [32,'D','美国','澳大利亚','2026-06-19T15:00:00-04:00','流明球场','西雅图'],
  [33,'E','德国','科特迪瓦','2026-06-20T16:00:00-04:00','BMO球场','多伦多'],
  [34,'E','厄瓜多尔','库拉索','2026-06-20T20:00:00-04:00','箭头体育场','堪萨斯城'],
  [35,'F','荷兰','瑞典','2026-06-20T13:00:00-04:00','NRG体育场','休斯顿'],
  [36,'F','突尼斯','日本','2026-06-21T00:00:00-04:00','BBVA球场','蒙特雷'],
  [37,'H','乌拉圭','佛得角','2026-06-21T18:00:00-04:00','硬石体育场','迈阿密'],
  [38,'H','西班牙','沙特阿拉伯','2026-06-21T12:00:00-04:00','梅赛德斯奔驰球场','亚特兰大'],
  [39,'G','比利时','伊朗','2026-06-21T15:00:00-04:00','SoFi体育场','洛杉矶'],
  [40,'G','新西兰','埃及','2026-06-21T21:00:00-04:00','BC体育场','温哥华'],
  [41,'I','挪威','塞内加尔','2026-06-22T20:00:00-04:00','大都会人寿球场','纽约/新泽西'],
  [42,'I','法国','伊拉克','2026-06-22T17:00:00-04:00','林肯金融球场','费城'],
  [43,'J','阿根廷','奥地利','2026-06-22T13:00:00-04:00','AT&T体育场','达拉斯'],
  [44,'J','约旦','阿尔及利亚','2026-06-22T23:00:00-04:00','利维斯体育场','旧金山湾区'],
  [45,'L','英格兰','加纳','2026-06-23T16:00:00-04:00','吉列体育场','波士顿'],
  [46,'L','巴拿马','克罗地亚','2026-06-23T19:00:00-04:00','BMO球场','多伦多'],
  [47,'K','葡萄牙','乌兹别克斯坦','2026-06-23T13:00:00-04:00','NRG体育场','休斯顿'],
  [48,'K','哥伦比亚','刚果民主共和国','2026-06-23T22:00:00-04:00','阿克隆球场','瓜达拉哈拉'],
  [49,'C','苏格兰','巴西','2026-06-24T18:00:00-04:00','硬石体育场','迈阿密'],
  [50,'C','摩洛哥','海地','2026-06-24T18:00:00-04:00','梅赛德斯奔驰球场','亚特兰大'],
  [51,'B','瑞士','加拿大','2026-06-24T15:00:00-04:00','BC体育场','温哥华'],
  [52,'B','波黑','卡塔尔','2026-06-24T15:00:00-04:00','流明球场','西雅图'],
  [53,'A','捷克','墨西哥','2026-06-24T21:00:00-04:00','阿兹特克球场','墨西哥城'],
  [54,'A','南非','韩国','2026-06-24T21:00:00-04:00','BBVA球场','蒙特雷'],
  [55,'E','库拉索','科特迪瓦','2026-06-25T16:00:00-04:00','林肯金融球场','费城'],
  [56,'E','厄瓜多尔','德国','2026-06-25T16:00:00-04:00','大都会人寿球场','纽约/新泽西'],
  [57,'F','日本','瑞典','2026-06-25T19:00:00-04:00','AT&T体育场','达拉斯'],
  [58,'F','突尼斯','荷兰','2026-06-25T19:00:00-04:00','箭头体育场','堪萨斯城'],
  [59,'D','土耳其','美国','2026-06-25T22:00:00-04:00','SoFi体育场','洛杉矶'],
  [60,'D','巴拉圭','澳大利亚','2026-06-25T22:00:00-04:00','利维斯体育场','旧金山湾区'],
  [61,'I','挪威','法国','2026-06-26T15:00:00-04:00','吉列体育场','波士顿'],
  [62,'I','塞内加尔','伊拉克','2026-06-26T15:00:00-04:00','BMO球场','多伦多'],
  [63,'G','埃及','伊朗','2026-06-26T23:00:00-04:00','流明球场','西雅图'],
  [64,'G','新西兰','比利时','2026-06-26T23:00:00-04:00','BC体育场','温哥华'],
  [65,'H','佛得角','沙特阿拉伯','2026-06-26T20:00:00-04:00','NRG体育场','休斯顿'],
  [66,'H','乌拉圭','西班牙','2026-06-26T20:00:00-04:00','阿克隆球场','瓜达拉哈拉'],
  [67,'L','巴拿马','英格兰','2026-06-27T17:00:00-04:00','大都会人寿球场','纽约/新泽西'],
  [68,'L','克罗地亚','加纳','2026-06-27T17:00:00-04:00','林肯金融球场','费城'],
  [69,'J','阿尔及利亚','奥地利','2026-06-27T22:00:00-04:00','箭头体育场','堪萨斯城'],
  [70,'J','约旦','阿根廷','2026-06-27T22:00:00-04:00','AT&T体育场','达拉斯'],
  [71,'K','哥伦比亚','葡萄牙','2026-06-27T19:30:00-04:00','硬石体育场','迈阿密'],
  [72,'K','刚果民主共和国','乌兹别克斯坦','2026-06-27T19:30:00-04:00','梅赛德斯奔驰球场','亚特兰大'],
]

const marketContext = `博彩市场参考(2026年6月,Polymarket/Bet365):西班牙夺冠9/2、法国5/1、英格兰13/2、巴西8/1、阿根廷9/1。已发生大冷门:6月16日佛得角0-0逼平西班牙(赛前西班牙胜率92%)。胜率接近易爆冷:D组美国38%vs土耳其36%、K组比利时40%vs乌拉圭34%、L组挪威44%vs日本38%、B组瑞士55%vs加拿大30%(加拿大主场)。`
const tacticalBrief = `战术身体简报:法国身体10速度10反击爆点;西班牙技术10但缺中锋面对密防效率低高空弱(被佛得角逼平印证);巴西技术10但防守不稳心理抗压差;摩洛哥铁血防反(22年4强)身体9定位球致命;日本技术快传但身体对抗弱6制空差;沙特曾爆冷胜阿根廷逼抢凶;乌拉圭硬朗防反身体9但阵容老化;非洲球队(摩洛哥/塞内加尔/科特迪瓦)身体普遍强于亚洲球队。`

function fmt(iso) {
  return new Date(iso).toLocaleString('zh-CN', { timeZone: 'America/New_York', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
}

async function analyzeMatch(m, retries = 2) {
  const [no, group, t1, t2, iso, venue, city] = m
  const r1 = R[t1] ?? 50, r2 = R[t2] ?? 50
  const prompt = `你是资深足球博彩分析师。分析这场2026世界杯小组赛的爆冷可能性。
${marketContext}
${tacticalBrief}
比赛:第${no}场 ${group}组 ${t1}(FIFA第${r1}) vs ${t2}(FIFA第${r2})，开球${fmt(iso)}(美东ET)，${city}${venue}。
结合Polymarket与博彩赔率、战术相克、身体素质、主场气候、心理因素分析。只返回JSON:
{"upsetProbability":数字0-100(弱队取胜概率),"upsetTeam":"可能爆冷的弱队","favoriteTeam":"被看好的强队","upsetWinOdds":数字(押弱队取胜欧赔如3.50),"marketImplied":"市场隐含概率描述","tacticalReason":"战术相克(50字内)","physicalComparison":"身体素质对比(40字内)","keyReason":"关键爆冷原因(30字内)","detailedAnalysis":"综合分析(120字内)","riskLevel":"high/medium/low"}
只返回JSON,不要markdown标记。`
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: '你是专业足球博彩分析AI,只返回有效JSON,不含markdown标记。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7, max_tokens: 4000,
        }),
      })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      const content = data.choices?.[0]?.message?.content || ''
      const jm = content.match(/\{[\s\S]*\}/)
      if (!jm) throw new Error('no json')
      const a = JSON.parse(jm[0])
      return { matchNo: no, group, team1: t1, team2: t2, team1Rank: r1, team2Rank: r2, kickoff: fmt(iso), kickoffET: iso, venue, city, ...a }
    } catch (e) {
      if (attempt === retries) {
        const rankDiff = Math.abs(r1 - r2)
        const fav = r1 < r2 ? t1 : t2, und = r1 > r2 ? t1 : t2
        const prob = Math.min(60, Math.max(15, 50 - rankDiff * 0.8))
        return { matchNo: no, group, team1: t1, team2: t2, team1Rank: r1, team2Rank: r2, kickoff: fmt(iso), kickoffET: iso, venue, city,
          upsetProbability: Math.round(prob), upsetTeam: und, favoriteTeam: fav, upsetWinOdds: Math.round((100/prob)*100)/100,
          marketImplied: `市场隐含弱队胜率约${Math.round(prob)}%`, tacticalReason: '弱队多防守反击应对强队', physicalComparison: '需结合球队身体数据',
          keyReason: `排名差${rankDiff}位`, detailedAnalysis: `${und}排名低于${fav}，但世界杯弱队常超常发挥(AI分析失败，降级数据)。`, riskLevel: prob > 40 ? 'high' : prob > 28 ? 'medium' : 'low', _fallback: true }
      }
      await new Promise(r => setTimeout(r, 1500))
    }
  }
}

// 并发控制
async function runWithConcurrency(items, limit, fn) {
  const results = []
  let idx = 0
  async function worker() {
    while (idx < items.length) {
      const i = idx++
      process.stdout.write(`  分析第${items[i][0]}场 ${items[i][2]}vs${items[i][3]} ...\n`)
      results[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
  return results
}

async function main() {
  const now = new Date()
  const upcoming = fixtures.filter(f => new Date(f[4]).getTime() > now.getTime())
  console.log(`当前美东时间: ${now.toLocaleString('zh-CN', { timeZone: 'America/New_York' })}`)
  console.log(`剩余待赛比赛: ${upcoming.length} 场 (已结束 ${fixtures.length - upcoming.length} 场)\n`)

  const analyses = await runWithConcurrency(upcoming, 6, analyzeMatch)
  analyses.sort((a, b) => b.upsetProbability - a.upsetProbability)

  const out = {
    generatedAt: new Date().toISOString(),
    model: MODEL,
    totalMatches: fixtures.length,
    upcomingCount: upcoming.length,
    finishedCount: fixtures.length - upcoming.length,
    matches: analyses,
  }
  const outPath = path.join('src', 'data', 'analysis.json')
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf-8')
  const failures = analyses.filter(a => a._fallback).length
  console.log(`\n完成! 已写入 ${outPath}`)
  console.log(`成功 ${analyses.length - failures} 场, 降级 ${failures} 场`)
}

main().catch(e => { console.error(e); process.exit(1) })
