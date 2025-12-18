
import { StoryNode } from "../../../types";

const S = {
    NEGOTIATION: { name: "협상 기술", description: "다른 생존자와의 거래나 대화에서 유리한 고지를 점합니다.", icon: "🤝" },
    ACCOUNTING: { name: "가치 평가", description: "아이템의 진정한 가치를 판별해 손해를 막습니다.", icon: "📉" },
    LEADERSHIP: { name: "카리스마", description: "사람들을 이끌어 집단의 사기와 결속력을 높입니다.", icon: "🗣️" },
    STEALTH: { name: "은밀 기동", description: "소리 없이 움직여 좀비의 시선을 피합니다.", icon: "🤫" }
};

export const WANDER_NODES: Record<string, StoryNode> = {
    'wander_0_start': {
        id: 'wander_0_start',
        text: "🏕️ 숲속 공터에서 다른 생존자 그룹의 캠프를 발견했습니다. 규모가 꽤 커 보입니다.",
        next: [
            { id: 'wander_1_charisma', weight: 0.0, choiceText: "압도적인 카리스마로 교섭 (카리스마 필요)", req: { skill: '카리스마' } },
            { id: 'wander_1_approach', weight: 0.5, choiceText: "평화롭게 접근 (합류/배신)" },
            { id: 'wander_1_trade', weight: 0.3, choiceText: "거래 시도 (물물교환)" }, 
            { id: 'wander_1_steal', weight: 0.2, choiceText: "약탈 시도 (하이 리스크)" }
        ]
    },
    'wander_1_charisma': {
        id: 'wander_1_charisma',
        text: "🗣️ 카리스마에 압도된 상대 그룹은 우리를 진정한 생존자로 인정하고, 자신들의 캠프에서 가장 좋은 물자를 선물했습니다.",
        effect: { target: 'ALL', loot: ['권총', '항생제', '통조림'], sanity: 20, skillsAdd: [S.LEADERSHIP], statChanges: { cha: 1 } }
    },
    
    'wander_1_trade': {
        id: 'wander_1_trade',
        text: "💰 무기를 내리고 물물교환을 제안합니다. 우리가 가진 잉여 물자와 그들의 물자를 교환할 수 있을까요?",
        next: [
            { id: 'wander_2_trade_luck', weight: 0.0, choiceText: "말도 안 되는 조건에 베팅 (도박사의 운 필요)", req: { skill: '도박사의 운' } },
            { id: 'wander_2_trade_expert', weight: 0.0, choiceText: "전문가 협상 (협상 기술 필요)", req: { skill: '협상 기술' } },
            { id: 'wander_2_trade_expert_acc', weight: 0.0, choiceText: "정확한 가치 산정 (가치 평가 필요)", req: { skill: '가치 평가' } },
            { id: 'wander_2_trade_good', weight: 0.6, choiceText: "일반 거래 시도" },
            { id: 'wander_2_trade_bad', weight: 0.4 }
        ]
    },
    'wander_2_trade_luck': {
        id: 'wander_2_trade_luck',
        text: "🎲 도박사의 운이 작용했습니다! 상대 리더가 갑자기 기분이 좋아져서 모든 물자를 그냥 주고 가버렸습니다.",
        effect: { target: 'ALL', loot: ['백신', '권총', '비타민'], sanity: 30, statChanges: { cha: 1 } }
    },
    'wander_2_trade_expert': {
        id: 'wander_2_trade_expert',
        text: "🗣️ 화려한 언변과 협상 기술로 상대를 구워삶았습니다. 쓸모없는 잡동사니를 주고 귀한 항생제를 잔뜩 얻어냅니다.",
        effect: { target: 'ALL', loot: ['항생제', '항생제', '고기'], sanity: 5, skillsAdd: [S.NEGOTIATION], statChanges: { int: 1 } }
    },
    'wander_2_trade_expert_acc': { 
        id: 'wander_2_trade_expert_acc',
        text: "🧮 물자의 가치를 정확히 계산하여 우리에게 유리한 조건으로 거래를 성사시켰습니다.",
        effect: { target: 'ALL', loot: ['항생제', '고기', '붕대'], sanity: 5, skillsAdd: [S.ACCOUNTING], statChanges: { int: 1 } }
    },
    'wander_2_trade_good': {
        id: 'wander_2_trade_good',
        text: "🤝 거래 성사! 그들은 우리의 여분 장비를 받고 귀한 의약품을 내주었습니다. 서로 만족스러운 거래였습니다.",
        effect: { target: 'ALL', loot: ['항생제', '붕대'], inventoryRemove: ['통조림'], statChanges: { cha: 1 } } 
    },
    'wander_2_trade_bad': {
        id: 'wander_2_trade_bad',
        text: "💢 그들은 터무니없는 대가를 요구하다가 우리가 거절하자 위협을 가했습니다. 빈손으로 물러납니다.",
        effect: { target: 'ALL', sanity: -5, skillsRemove: ["협상 기술"] }
    },

    'wander_1_approach': {
        id: 'wander_1_approach',
        text: "👋 손을 들고 평화롭게 접근합니다. 그들은 경계하지만, 곧 모닥불 곁을 내어줍니다.",
        next: [
            { id: 'wander_2_feast', weight: 0.5 },
            { id: 'wander_2_betrayal', weight: 0.5 }
        ],
        effect: { target: 'ALL', fatigue: -5 }
    },
    'wander_1_steal': {
        id: 'wander_1_steal',
        text: "🕵️ 밤을 틈타 그들의 창고를 털기로 합니다. 경비가 삼엄합니다.",
        next: [
            { 
                id: 'wander_3_success', 
                weight: 1.0, 
                choiceText: "은밀하게 창고 침투 (민첩 기반)",
                dice: { threshold: 80, stat: 'agi', successId: 'wander_3_success', failId: 'wander_3_caught', hpPenalty: -15 }
            }
        ],
        effect: { target: 'ALL', fatigue: 10 }
    },
    'wander_2_feast': {
        id: 'wander_2_feast',
        text: "🍖 그들은 사냥한 멧돼지 고기를 나눠주었습니다. 오랜만에 배불리 먹고 정보를 교환합니다.",
        next: [{ id: 'wander_4_parting', weight: 1.0 }],
        effect: { target: 'ALL', hp: 10, sanity: 15, statChanges: { con: 1 } }
    },
    'wander_2_betrayal': {
        id: 'wander_2_betrayal',
        text: "🍷 음식에 수면제가 들어있었습니다! 눈을 떠보니 우리는 묶여있고 짐은 사라졌습니다.",
        next: [{ id: 'wander_4_escape', weight: 1.0 }],
        effect: { target: 'ALL', inventoryRemove: ['통조림', '붕대'], sanity: -20, statChanges: { cha: -1 } }
    },
    'wander_3_success': {
        id: 'wander_3_success',
        text: "🎒 판정 성공! 그들의 식량과 약품을 훔쳐 달아났습니다. 양심의 가책이 느껴지지만 배는 부릅니다.",
        effect: { target: 'ALL', sanity: -5, loot: ['통조림', '항생제'], skillsAdd: [S.STEALTH], statChanges: { agi: 1 } }
    },
    'wander_3_caught': {
        id: 'wander_3_caught',
        text: "🔦 판정 실패! 들켰습니다! 총알이 빗발치는 가운데 빈손으로 도망쳤습니다. 몇 명이 다리에 총상을 입었습니다.",
        effect: { target: 'RANDOM_HALF', hp: -30, fatigue: 20, statChanges: { agi: -1 } }
    },
    'wander_4_escape': {
        id: 'wander_4_escape',
        text: "🔗 밧줄을 끊고 필사적으로 탈출했습니다. 가진 것은 없지만 목숨은 건졌습니다.",
        effect: { target: 'ALL', fatigue: 20, statChanges: { str: 1 } }
    },
    'wander_4_parting': {
        id: 'wander_4_parting',
        text: "🤝 날이 밝자 우리는 서로의 행운을 빌며 헤어졌습니다. 그들은 지도에 안전 가옥 위치를 표시해주었습니다.",
        effect: { target: 'ALL', sanity: 5, statChanges: { cha: 1 } }
    }
};
