// 2026世界杯球队数据：赔率、战术风格、身体素质
// 数据来源：多平台市场数据（截至2026年6月）

export interface TeamProfile {
  name: string
  fifaRank: number
  // 战术风格
  tacticalStyle: string
  formation: string
  playStyle: string
  // 身体素质评估 (1-10)
  physicality: number
  speed: number
  stamina: number
  technique: number
  // 球队特点
  strengths: string[]
  weaknesses: string[]
  keyPlayer: string
  squadValue: string // 阵容身价
}

// 球队战术与身体素质档案
export const teamProfiles: Record<string, TeamProfile> = {
  '西班牙': {
    name: '西班牙', fifaRank: 3, tacticalStyle: 'Tiki-Taka控球传切',
    formation: '4-3-3', playStyle: '极致控球，高位压迫，短传渗透',
    physicality: 6, speed: 7, stamina: 8, technique: 10,
    strengths: ['中场控制力世界顶级', '传球成功率极高', '阵容深度厚'],
    weaknesses: ['缺乏强力中锋', '面对密集防守效率低', '高空球偏弱'],
    keyPlayer: '亚马尔/佩德里', squadValue: '€12.2亿',
  },
  '佛得角': {
    name: '佛得角', fifaRank: 45, tacticalStyle: '防守反击',
    formation: '4-4-2', playStyle: '密集防守，依靠身体对抗与快速反击',
    physicality: 8, speed: 8, stamina: 7, technique: 5,
    strengths: ['门将状态神勇', '防守韧性强', '身体对抗出色'],
    weaknesses: ['整体身价低', '进攻手段单一', '大赛经验匮乏'],
    keyPlayer: 'Vozinha(门将)', squadValue: '€5500万',
  },
  '阿根廷': {
    name: '阿根廷', fifaRank: 1, tacticalStyle: '攻守平衡+巨星驱动',
    formation: '4-3-3', playStyle: '中场强硬抢断，梅西自由组织，反击犀利',
    physicality: 8, speed: 8, stamina: 8, technique: 9,
    strengths: ['卫冕冠军底蕴', '梅西大赛掌控力', '团队凝聚力强'],
    weaknesses: ['核心年龄偏大', '后防老化', '高强度连战体能'],
    keyPlayer: '梅西/劳塔罗', squadValue: '€8.5亿',
  },
  '法国': {
    name: '法国', fifaRank: 2, tacticalStyle: '身体素质+快速反击',
    formation: '4-2-3-1', playStyle: '依托强壮中场，姆巴佩边路爆点冲击',
    physicality: 10, speed: 10, stamina: 9, technique: 9,
    strengths: ['身体素质全队顶级', '反击速度恐怖', '阵容厚度无敌'],
    weaknesses: ['更衣室隐患', '偶尔大意失荆州', '控球非强项'],
    keyPlayer: '姆巴佩', squadValue: '€11亿',
  },
  '巴西': {
    name: '巴西', fifaRank: 5, tacticalStyle: '桑巴技术流',
    formation: '4-2-3-1', playStyle: '个人技术突破，边路传中，即兴发挥',
    physicality: 8, speed: 9, stamina: 8, technique: 10,
    strengths: ['进攻球员天赋极高', '边路突破犀利', '创造力强'],
    weaknesses: ['防守稳定性差', '心理抗压不足', '战术纪律松散'],
    keyPlayer: '维尼修斯', squadValue: '€9.5亿',
  },
  '摩洛哥': {
    name: '摩洛哥', fifaRank: 13, tacticalStyle: '铁血防反',
    formation: '4-1-4-1', playStyle: '严密防守体系，快速转换，定位球致命',
    physicality: 9, speed: 8, stamina: 9, technique: 7,
    strengths: ['防守体系成熟(22年4强)', '团队执行力强', '身体强壮'],
    weaknesses: ['终结效率一般', '缺乏顶级射手', '阵容深度有限'],
    keyPlayer: '哈基米', squadValue: '€3.5亿',
  },
  '德国': {
    name: '德国', fifaRank: 9, tacticalStyle: '高位压迫控球',
    formation: '4-2-3-1', playStyle: '高位逼抢，快速传导，边中结合',
    physicality: 8, speed: 7, stamina: 9, technique: 9,
    strengths: ['大赛经验丰富', '中场组织强', '战术执行严谨'],
    weaknesses: ['后防速度慢', '中锋点不稳定', '近年起伏大'],
    keyPlayer: '维尔茨/穆西亚拉', squadValue: '€9亿',
  },
  '日本': {
    name: '日本', fifaRank: 14, tacticalStyle: '技术快速传切',
    formation: '4-2-3-1', playStyle: '快速短传，整体跑动，旅欧球员能力强',
    physicality: 6, speed: 8, stamina: 9, technique: 8,
    strengths: ['旅欧球员多', '跑动覆盖大', '战术纪律严明'],
    weaknesses: ['身体对抗弱', '制空权差', '关键球处理欠火候'],
    keyPlayer: '久保建英/三笘薰', squadValue: '€3.2亿',
  },
  '葡萄牙': {
    name: '葡萄牙', fifaRank: 6, tacticalStyle: '边路传中+技术',
    formation: '4-3-3', playStyle: '边路爆点，传中包抄，中场技术细腻',
    physicality: 8, speed: 8, stamina: 8, technique: 9,
    strengths: ['锋线人才济济', '边路突破强', '替补深度足'],
    weaknesses: ['C罗年龄问题', '后防偶有走神', '战术依赖个人'],
    keyPlayer: 'B费/C罗', squadValue: '€9.5亿',
  },
  '英格兰': {
    name: '英格兰', fifaRank: 4, tacticalStyle: '身体+边路冲击',
    formation: '4-2-3-1', playStyle: '强壮中场，边路快马，定位球威胁大',
    physicality: 9, speed: 9, stamina: 9, technique: 8,
    strengths: ['身体素质全面', '年轻天赋多', '阵容均衡'],
    weaknesses: ['大赛心理包袱', '战术保守', '点球魔咒'],
    keyPlayer: '贝林厄姆/凯恩', squadValue: '€11亿',
  },
  '沙特阿拉伯': {
    name: '沙特阿拉伯', fifaRank: 34, tacticalStyle: '快速反击',
    formation: '4-3-3', playStyle: '高位逼抢偷袭，本土联赛大牌带动',
    physicality: 7, speed: 8, stamina: 8, technique: 6,
    strengths: ['曾爆冷胜阿根廷', '主场般气候适应', '逼抢凶狠'],
    weaknesses: ['后防漏洞多', '整体实力有限', '稳定性差'],
    keyPlayer: '萨利赫·谢赫里', squadValue: '€3000万',
  },
  '乌拉圭': {
    name: '乌拉圭', fifaRank: 12, tacticalStyle: '硬朗防反',
    formation: '4-4-2', playStyle: '强硬防守，身体对抗，反击效率高',
    physicality: 9, speed: 7, stamina: 8, technique: 7,
    strengths: ['南美强队底蕴', '防守强硬', '锋线有冲击力'],
    weaknesses: ['阵容老化', '速度偏慢', '中场创造力一般'],
    keyPlayer: '努涅斯/巴尔韦德', squadValue: '€4.5亿',
  },
}

// 赔率数据（小组出线/比赛胜负赔率，欧赔）
export interface OddsData {
  team1: string
  team2: string
  group: string
  // 来自不同平台的胜负赔率（欧赔，team1胜/平/team2胜）
  platform1: { team1Win: number; draw: number; team2Win: number }
  platformImplied: { team1: number; draw: number; team2: number } // 隐含概率%
  // 爆冷赢球赔率（弱队取胜的赔率）
  upsetWinOdds: number
  upsetTeam: string
}
