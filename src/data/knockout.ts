// 2026世界杯淘汰赛对阵数据（基于 wc-2026.org 真实赛程）
// 含已确定队伍和待定占位

export interface KnockoutMatch {
  matchNo: number
  round: '32强' | '16强' | '1/4决赛' | '半决赛' | '季军赛' | '决赛'
  date: string  // 北京时间
  team1: string
  team2: string
  venue: string
  confirmed: boolean // 双方是否已确定
  result?: string    // 比分（已赛完时）
}

export const knockoutMatches: KnockoutMatch[] = [
  // 32强赛
  { matchNo: 73, round: '32强', date: '06/29 03:00', team1: '南非', team2: '加拿大', venue: '洛杉矶', confirmed: true },
  { matchNo: 74, round: '32强', date: '06/30 01:00', team1: '巴西', team2: '日本', venue: '休斯顿', confirmed: true },
  { matchNo: 75, round: '32强', date: '06/30 04:30', team1: '德国', team2: 'A/B/C/D/F组第三', venue: '波士顿', confirmed: false },
  { matchNo: 76, round: '32强', date: '06/30 09:00', team1: '荷兰', team2: '摩洛哥', venue: '蒙特雷', confirmed: true },
  { matchNo: 77, round: '32强', date: '07/01 01:00', team1: '科特迪瓦', team2: 'I组次名', venue: '达拉斯', confirmed: false },
  { matchNo: 78, round: '32强', date: '07/01 05:00', team1: 'I组首名', team2: 'C/D/F/G/H组第三', venue: '纽约/新泽西', confirmed: false },
  { matchNo: 79, round: '32强', date: '07/01 09:00', team1: '墨西哥', team2: 'C/E/F/H/I组第三', venue: '墨西哥城', confirmed: false },
  { matchNo: 80, round: '32强', date: '07/02 00:00', team1: 'L组首名', team2: 'E/H/I/J/K组第三', venue: '亚特兰大', confirmed: false },
  { matchNo: 81, round: '32强', date: '07/02 04:00', team1: 'G组首名', team2: 'A/E/H/I/J组第三', venue: '西雅图', confirmed: false },
  { matchNo: 82, round: '32强', date: '07/02 08:00', team1: '美国', team2: '波黑', venue: '旧金山湾区', confirmed: true },
  { matchNo: 83, round: '32强', date: '07/03 03:00', team1: 'H组首名', team2: 'J组次名', venue: '洛杉矶', confirmed: false },
  { matchNo: 84, round: '32强', date: '07/03 07:00', team1: 'K组次名', team2: 'L组次名', venue: '多伦多', confirmed: false },
  { matchNo: 85, round: '32强', date: '07/03 11:00', team1: '瑞士', team2: 'E/F/G/I/J组第三', venue: '温哥华', confirmed: false },
  { matchNo: 86, round: '32强', date: '07/04 02:00', team1: '澳大利亚', team2: 'G组次名', venue: '达拉斯', confirmed: false },
  { matchNo: 87, round: '32强', date: '07/04 06:00', team1: '阿根廷', team2: 'H组次名', venue: '迈阿密', confirmed: false },
  { matchNo: 88, round: '32强', date: '07/04 09:30', team1: 'K组首名', team2: 'D/E/I/J/L组第三', venue: '堪萨斯城', confirmed: false },
  // 16强赛
  { matchNo: 89, round: '16强', date: '07/05 01:00', team1: '第73场胜者', team2: '第75场胜者', venue: '休斯顿', confirmed: false },
  { matchNo: 90, round: '16强', date: '07/05 05:00', team1: '第74场胜者', team2: '第77场胜者', venue: '费城', confirmed: false },
  { matchNo: 91, round: '16强', date: '07/06 04:00', team1: '第76场胜者', team2: '第78场胜者', venue: '纽约/新泽西', confirmed: false },
  { matchNo: 92, round: '16强', date: '07/06 08:00', team1: '第79场胜者', team2: '第80场胜者', venue: '墨西哥城', confirmed: false },
  { matchNo: 93, round: '16强', date: '07/07 03:00', team1: '第83场胜者', team2: '第84场胜者', venue: '达拉斯', confirmed: false },
  { matchNo: 94, round: '16强', date: '07/07 08:00', team1: '第81场胜者', team2: '第82场胜者', venue: '西雅图', confirmed: false },
  { matchNo: 95, round: '16强', date: '07/08 00:00', team1: '第86场胜者', team2: '第88场胜者', venue: '亚特兰大', confirmed: false },
  { matchNo: 96, round: '16强', date: '07/08 04:00', team1: '第85场胜者', team2: '第87场胜者', venue: '温哥华', confirmed: false },
  // 1/4决赛
  { matchNo: 97, round: '1/4决赛', date: '07/10 04:00', team1: '第89场胜者', team2: '第90场胜者', venue: '波士顿', confirmed: false },
  { matchNo: 98, round: '1/4决赛', date: '07/11 03:00', team1: '第93场胜者', team2: '第94场胜者', venue: '洛杉矶', confirmed: false },
  { matchNo: 99, round: '1/4决赛', date: '07/12 05:00', team1: '第91场胜者', team2: '第92场胜者', venue: '迈阿密', confirmed: false },
  { matchNo: 100, round: '1/4决赛', date: '07/12 09:00', team1: '第95场胜者', team2: '第96场胜者', venue: '堪萨斯城', confirmed: false },
  // 半决赛
  { matchNo: 101, round: '半决赛', date: '07/15 03:00', team1: '第97场胜者', team2: '第98场胜者', venue: '达拉斯', confirmed: false },
  { matchNo: 102, round: '半决赛', date: '07/16 03:00', team1: '第99场胜者', team2: '第100场胜者', venue: '亚特兰大', confirmed: false },
  // 季军赛 & 决赛
  { matchNo: 103, round: '季军赛', date: '07/19 05:00', team1: '半决赛负者1', team2: '半决赛负者2', venue: '迈阿密', confirmed: false },
  { matchNo: 104, round: '决赛', date: '07/20 03:00', team1: '半决赛胜者1', team2: '半决赛胜者2', venue: '纽约/新泽西', confirmed: false },
]
