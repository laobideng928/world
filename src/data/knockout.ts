// 2026世界杯32强赛完整对阵（基于实际小组赛出线结果）
// 数据来源：FIFA官方 / Wikipedia / Olympics.com / Sportsnet (2026年6月28日确定)
export interface KnockoutMatch {
  matchNo: number
  round: '32强' | '16强' | '1/4决赛' | '半决赛' | '季军赛' | '决赛'
  date: string         // 北京时间
  kickoffET: string    // ISO datetime 美东
  team1: string
  team2: string
  venue: string
  city: string
  confirmed: boolean
  result?: string      // 已赛比分
  winner?: string      // 胜者
  finished?: boolean
}

export const knockoutMatches: KnockoutMatch[] = [
  // 32强赛 - 已赛完
  { matchNo: 73, round: '32强', date: '06/28 03:00', kickoffET: '2026-06-28T15:00:00-04:00', team1: '南非', team2: '加拿大', venue: 'SoFi体育场', city: '洛杉矶', confirmed: true, finished: true, result: '0-1', winner: '加拿大' },
  { matchNo: 74, round: '32强', date: '06/29 01:00', kickoffET: '2026-06-29T13:00:00-04:00', team1: '巴西', team2: '日本', venue: 'NRG体育场', city: '休斯顿', confirmed: true, finished: true, result: '2-1', winner: '巴西' },
  { matchNo: 75, round: '32强', date: '06/29 04:30', kickoffET: '2026-06-29T16:30:00-04:00', team1: '德国', team2: '巴拉圭', venue: '吉列体育场', city: '波士顿', confirmed: true, finished: true, result: '1-1(点球3-4)', winner: '巴拉圭' },
  { matchNo: 76, round: '32强', date: '06/30 09:00', kickoffET: '2026-06-29T21:00:00-04:00', team1: '荷兰', team2: '摩洛哥', venue: 'BBVA球场', city: '蒙特雷', confirmed: true, finished: true, result: '1-1(点球2-3)', winner: '摩洛哥' },
  // 32强赛 - 今天及未来（待赛）
  { matchNo: 77, round: '32强', date: '06/30 01:00', kickoffET: '2026-06-30T13:00:00-04:00', team1: '科特迪瓦', team2: '挪威', venue: 'AT&T体育场', city: '达拉斯', confirmed: true, finished: false },
  { matchNo: 78, round: '32强', date: '06/30 05:00', kickoffET: '2026-06-30T17:00:00-04:00', team1: '法国', team2: '瑞典', venue: '大都会人寿球场', city: '纽约/新泽西', confirmed: true, finished: false },
  { matchNo: 79, round: '32强', date: '06/30 09:00', kickoffET: '2026-06-30T21:00:00-04:00', team1: '墨西哥', team2: '厄瓜多尔', venue: '阿兹特克球场', city: '墨西哥城', confirmed: true, finished: false },
  { matchNo: 80, round: '32强', date: '07/01 00:00', kickoffET: '2026-07-01T12:00:00-04:00', team1: '英格兰', team2: '刚果民主共和国', venue: '梅赛德斯奔驰球场', city: '亚特兰大', confirmed: true, finished: false },
  { matchNo: 81, round: '32强', date: '07/01 04:00', kickoffET: '2026-07-01T16:00:00-04:00', team1: '比利时', team2: '塞内加尔', venue: '流明球场', city: '西雅图', confirmed: true, finished: false },
  { matchNo: 82, round: '32强', date: '07/01 08:00', kickoffET: '2026-07-01T20:00:00-04:00', team1: '美国', team2: '波黑', venue: '利维斯体育场', city: '旧金山湾区', confirmed: true, finished: false },
  { matchNo: 83, round: '32强', date: '07/02 03:00', kickoffET: '2026-07-02T15:00:00-04:00', team1: '西班牙', team2: '奥地利', venue: 'SoFi体育场', city: '洛杉矶', confirmed: true, finished: false },
  { matchNo: 84, round: '32强', date: '07/02 07:00', kickoffET: '2026-07-02T19:00:00-04:00', team1: '葡萄牙', team2: '克罗地亚', venue: 'BMO球场', city: '多伦多', confirmed: true, finished: false },
  { matchNo: 85, round: '32强', date: '07/02 11:00', kickoffET: '2026-07-02T23:00:00-04:00', team1: '瑞士', team2: '阿尔及利亚', venue: 'BC体育场', city: '温哥华', confirmed: true, finished: false },
  { matchNo: 86, round: '32强', date: '07/03 02:00', kickoffET: '2026-07-03T14:00:00-04:00', team1: '澳大利亚', team2: '埃及', venue: 'AT&T体育场', city: '达拉斯', confirmed: true, finished: false },
  { matchNo: 87, round: '32强', date: '07/03 06:00', kickoffET: '2026-07-03T18:00:00-04:00', team1: '阿根廷', team2: '佛得角', venue: '硬石体育场', city: '迈阿密', confirmed: true, finished: false },
  { matchNo: 88, round: '32强', date: '07/03 09:30', kickoffET: '2026-07-03T21:30:00-04:00', team1: '哥伦比亚', team2: '加纳', venue: '箭头体育场', city: '堪萨斯城', confirmed: true, finished: false },
  // 16强（待定，依赖32强结果）
  { matchNo: 89, round: '16强', date: '07/05 01:00', kickoffET: '2026-07-05T13:00:00-04:00', team1: '第73场胜者', team2: '第75场胜者', venue: 'NRG体育场', city: '休斯顿', confirmed: false, finished: false },
  { matchNo: 90, round: '16强', date: '07/05 05:00', kickoffET: '2026-07-05T17:00:00-04:00', team1: '第74场胜者', team2: '第77场胜者', venue: '林肯金融球场', city: '费城', confirmed: false, finished: false },
  { matchNo: 91, round: '16强', date: '07/06 04:00', kickoffET: '2026-07-06T16:00:00-04:00', team1: '第76场胜者', team2: '第78场胜者', venue: '大都会人寿球场', city: '纽约/新泽西', confirmed: false, finished: false },
  { matchNo: 92, round: '16强', date: '07/06 08:00', kickoffET: '2026-07-06T20:00:00-04:00', team1: '第79场胜者', team2: '第80场胜者', venue: '阿兹特克球场', city: '墨西哥城', confirmed: false, finished: false },
  { matchNo: 93, round: '16强', date: '07/07 03:00', kickoffET: '2026-07-07T15:00:00-04:00', team1: '第83场胜者', team2: '第84场胜者', venue: 'AT&T体育场', city: '达拉斯', confirmed: false, finished: false },
  { matchNo: 94, round: '16强', date: '07/07 08:00', kickoffET: '2026-07-07T20:00:00-04:00', team1: '第81场胜者', team2: '第82场胜者', venue: '流明球场', city: '西雅图', confirmed: false, finished: false },
  { matchNo: 95, round: '16强', date: '07/08 00:00', kickoffET: '2026-07-08T12:00:00-04:00', team1: '第86场胜者', team2: '第88场胜者', venue: '梅赛德斯奔驰球场', city: '亚特兰大', confirmed: false, finished: false },
  { matchNo: 96, round: '16强', date: '07/08 04:00', kickoffET: '2026-07-08T16:00:00-04:00', team1: '第85场胜者', team2: '第87场胜者', venue: 'BC体育场', city: '温哥华', confirmed: false, finished: false },
  // 1/4决赛
  { matchNo: 97, round: '1/4决赛', date: '07/10 04:00', kickoffET: '2026-07-10T16:00:00-04:00', team1: '第89场胜者', team2: '第90场胜者', venue: '吉列体育场', city: '波士顿', confirmed: false, finished: false },
  { matchNo: 98, round: '1/4决赛', date: '07/11 03:00', kickoffET: '2026-07-11T15:00:00-04:00', team1: '第93场胜者', team2: '第94场胜者', venue: 'SoFi体育场', city: '洛杉矶', confirmed: false, finished: false },
  { matchNo: 99, round: '1/4决赛', date: '07/12 05:00', kickoffET: '2026-07-12T17:00:00-04:00', team1: '第91场胜者', team2: '第92场胜者', venue: '硬石体育场', city: '迈阿密', confirmed: false, finished: false },
  { matchNo: 100, round: '1/4决赛', date: '07/12 09:00', kickoffET: '2026-07-12T21:00:00-04:00', team1: '第95场胜者', team2: '第96场胜者', venue: '箭头体育场', city: '堪萨斯城', confirmed: false, finished: false },
  // 半决赛 + 决赛
  { matchNo: 101, round: '半决赛', date: '07/15 03:00', kickoffET: '2026-07-15T15:00:00-04:00', team1: '1/4决赛①胜者', team2: '1/4决赛②胜者', venue: 'AT&T体育场', city: '达拉斯', confirmed: false, finished: false },
  { matchNo: 102, round: '半决赛', date: '07/16 03:00', kickoffET: '2026-07-16T15:00:00-04:00', team1: '1/4决赛③胜者', team2: '1/4决赛④胜者', venue: '梅赛德斯奔驰球场', city: '亚特兰大', confirmed: false, finished: false },
  { matchNo: 103, round: '季军赛', date: '07/19 05:00', kickoffET: '2026-07-19T17:00:00-04:00', team1: '半决赛负者1', team2: '半决赛负者2', venue: '硬石体育场', city: '迈阿密', confirmed: false, finished: false },
  { matchNo: 104, round: '决赛', date: '07/20 03:00', kickoffET: '2026-07-20T15:00:00-04:00', team1: '半决赛胜者1', team2: '半决赛胜者2', venue: '大都会人寿球场', city: '纽约/新泽西', confirmed: false, finished: false },
]

// 仅返回已确认对阵且未开赛的淘汰赛比赛
export function getUpcomingKnockout(): KnockoutMatch[] {
  const now = Date.now()
  return knockoutMatches.filter(m => m.confirmed && !m.finished && new Date(m.kickoffET).getTime() > now)
}
