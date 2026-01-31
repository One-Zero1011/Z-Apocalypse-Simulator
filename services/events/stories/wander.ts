
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
        text: "Camp 🏕️ 숲속 공터에서 다른 생존자 그룹의 캠프를 발견했습니다. 고기 굽는 냄새가 바람을 타고 옵니다.",
        next: [
            { id: 'wander_1_charisma', weight: 0.0, choiceText: "압도적인 카리스마로 교섭 (카리스마 필요)", req: { skill: '카리스마' } },
            { id: 'wander_1_approach', weight: 0.5, choiceText: "평화롭게 접근 (합류/배신)" },
            { id: 'wander_1_trade', weight: 0.3, choiceText: "거래 시도 (물물교환)" }, 
            { id: 'wander_1_steal', weight: 0.2, choiceText: "약탈 시도 (하이 리스크)" }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'wander_1_charisma': {
        id: 'wander_1_charisma',
        text: "🗣️ 카리스마에 압도된 상대 그룹은 우리에게 최고의 대우를 해주며 신선한 채소와 고기를 선물했습니다.",
        effect: { target: 'RANDOM_1', loot: ['권총', '항생제', '통조림', '고기', '채소'], sanity: 20, skillsAdd: [S.LEADERSHIP], statChanges: { cha: 1 } }
    },
    
    'wander_1_trade': {
        id: 'wander_1_trade',
        text: "💰 무기를 내리고 거래를 제안합니다. 그들은 특히 '고기'를 원하고 있습니다.",
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
        text: "🎲 도박사의 운! 상대 리더가 갑자기 마음이 바뀌어 자신의 식량 창고를 통째로 털어주었습니다.",
        effect: { target: 'ALL', loot: ['백신', '통조림', '통조림', '고기', '채소'], sanity: 30, statChanges: { cha: 1 } }
    },
    'wander_2_trade_expert': {
        id: 'wander_2_trade_expert',
        text: "🗣️ 화려한 언변으로 상대를 구워삶았습니다. 낡은 장비를 주고 신선한 고기와 통조림을 잔뜩 얻어냅니다.",
        effect: { target: 'RANDOM_1', loot: ['통조림', '통조림', '고기', '고기'], sanity: 5, skillsAdd: [S.NEGOTIATION], statChanges: { int: 1 } }
    },
    'wander_2_trade_expert_acc': { 
        id: 'wander_2_trade_expert_acc',
        text: "🧮 가치를 정확히 계산하여 1인분 가격으로 3인분의 채소를 확보했습니다.",
        effect: { target: 'RANDOM_1', loot: ['채소', '채소', '채소', '붕대'], sanity: 5, skillsAdd: [S.ACCOUNTING], statChanges: { int: 1 } }
    },
    'wander_2_trade_good': {
        id: 'wander_2_trade_good',
        text: "🤝 거래 성사! 여분 장비를 주고 귀한 고기를 얻었습니다. 오늘 저녁은 파티입니다.",
        effect: { target: 'ALL', loot: ['고기', '고기'], inventoryRemove: ['부품'], statChanges: { cha: 1 } } 
    },
    'wander_2_trade_bad': {
        id: 'wander_2_trade_bad',
        text: "💢 그들은 우리를 비웃으며 가진 통조림마저 뺏으려 했습니다. 빈손으로 도망칩니다.",
        effect: { target: 'RANDOM_1', sanity: -5, skillsRemove: ["협상 기술"], inventoryRemove: ['통조림'] }
    },

    'wander_1_approach': {
        id: 'wander_1_approach',
        text: "👋 손을 들고 평화롭게 접근합니다. 그들은 따뜻한 스튜 한 그릇을 내어줍니다.",
        next: [
            { id: 'wander_2_feast', weight: 0.5 },
            { id: 'wander_2_betrayal', weight: 0.5 }
        ],
        effect: { target: 'ALL', fatigue: -5, loot: ['고기'] }
    },
    'wander_1_steal': {
        id: 'wander_1_steal',
        text: "🕵️ 밤을 틈타 그들의 식량 창고를 털기로 합니다. 훈제 고기 냄새가 코를 찌릅니다.",
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
        text: "🍖 그들은 사냥한 고기를 아낌없이 나누어 주었습니다. 배불리 먹고 가방에 통조림까지 챙겨줍니다.",
        next: [{ id: 'wander_4_parting', weight: 1.0 }],
        effect: { target: 'ALL', hp: 10, sanity: 15, statChanges: { con: 1 }, loot: ['고기', '고기', '통조림'] }
    },
    'wander_2_betrayal': {
        id: 'wander_2_betrayal',
        text: "🍷 음식에 수면제가 들어있었습니다! 가방 안의 모든 식량이 사라졌습니다.",
        next: [{ id: 'wander_4_escape', weight: 1.0 }],
        effect: { target: 'ALL', inventoryRemove: ['통조림', '고기', '채소'], sanity: -20, statChanges: { cha: -1 } }
    },
    'wander_3_success': {
        id: 'wander_3_success',
        text: "🎒 판정 성공! 그들의 창고에서 엄청난 양의 고기와 통조림을 훔쳐 달아났습니다.",
        effect: { target: 'RANDOM_1', sanity: -5, loot: ['통조림', '통조림', '고기', '고기', '채소'], skillsAdd: [S.STEALTH], statChanges: { agi: 1 } }
    },
    'wander_3_caught': {
        id: 'wander_3_caught',
        text: "🔦 판정 실패! 들켰습니다! 도망치는 와중에 식량 가방이 찢어져 내용물을 다 흘렸습니다.",
        effect: { target: 'RANDOM_HALF', hp: -30, fatigue: 20, statChanges: { agi: -1 }, inventoryRemove: ['통조림'] }
    },
    'wander_4_escape': {
        id: 'wander_4_escape',
        text: "🔗 탈출했습니다. 배가 고파 근처 숲에서 열매(채소)라도 급히 주워 먹었습니다.",
        effect: { target: 'ALL', fatigue: 20, statChanges: { str: 1 }, loot: ['채소'] }
    },
    'wander_4_parting': {
        id: 'wander_4_parting',
        text: "🤝 작별의 시간. 그들은 가는 길에 먹으라며 육포(고기)와 비타민을 챙겨주었습니다.",
        effect: { target: 'ALL', sanity: 5, statChanges: { cha: 1 }, loot: ['고기', '비타민'] }
    }
};
