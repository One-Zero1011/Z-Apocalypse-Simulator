
import { StoryNode } from "../../../types";

const S = {
    ACTING: { name: "메소드 연기", description: "자신의 감정이나 상태를 완벽하게 속여 위기를 넘깁니다.", icon: "🎭" },
    SPIRIT: { name: "종교적 신념", description: "강한 신앙심으로 공포에 굴하지 않고 버팁니다.", icon: "🙏" },
    COMMAND: { name: "전술 지휘", description: "전투 시 동료들의 위치를 지정해 효율을 극대화합니다.", icon: "🚩" },
    CARE: { name: "심리 상담", description: "불안해하는 동료의 마음을 진정시키고 정신력을 회복시킵니다.", icon: "🛋️" }
};

export const CULT_NODES: Record<string, StoryNode> = {
    'cult_0_start': {
        id: 'cult_0_start',
        text: "🕯️ 광신도들의 거점에서 기괴한 연기가 피어오릅니다. 그들은 '정화의 제물'로 신선한 고기를 비축해둔 것 같습니다.",
        next: [
            { id: 'cult_1_spy', weight: 0.5, choiceText: "몰래 염탐 (정보 수집)" },
            { id: 'cult_1_join', weight: 0.3, choiceText: "위장 잠입 (내부 진입)" }, 
            { id: 'cult_1_run', weight: 0.2, choiceText: "도망치기 (안전 우선)" }
        ],
        effect: { target: 'ALL', sanity: -5, loot: ['통조림'] }
    },
    
    'cult_1_join': {
        id: 'cult_1_join',
        text: "🎭 광신도 무리에 섞여 들어갑니다. 그들은 '성찬'이라며 정체불명의 고기를 나눠줍니다.",
        next: [
            { id: 'cult_2_acting', weight: 0.0, choiceText: "완벽한 신도 연기 (메소드 연기 필요)", req: { skill: '메소드 연기' } },
            { 
                id: 'cult_2_ritual_pass', 
                weight: 1.0, 
                choiceText: "자연스럽게 행동하기 (매력 기반)",
                dice: { threshold: 80, stat: 'cha', successId: 'cult_2_ritual_pass', failId: 'cult_2_ritual_fail', sanityPenalty: -15 }
            }
        ],
        effect: { target: 'ALL', loot: ['고기'] }
    },
    'cult_2_acting': {
        id: 'cult_2_acting',
        text: "🎭 연기에 감동한 교주가 우리를 신실한 신자로 믿고, 신성한 제물(고기)과 백신을 맡겼습니다.",
        next: [{ id: 'cult_3_inner', weight: 1.0 }],
        effect: { target: 'RANDOM_1', loot: ['백신', '고기', '고기', '안정제'], sanity: 10, skillsAdd: [S.ACTING], statChanges: { cha: 1 } }
    },
    'cult_2_ritual_pass': {
        id: 'cult_2_ritual_pass',
        text: "🛐 판정 성공! 의식을 통과하며 성소 구석에 쌓인 통조림들을 슬쩍 챙겼습니다.",
        next: [{ id: 'cult_3_inner', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -5, statChanges: { cha: 1 }, loot: ['통조림', '통조림'] }
    },
    
    'cult_3_inner': {
        id: 'cult_3_inner',
        text: "⛩️ 지하실에는 산 사람과 좀비, 그리고 대량의 인육(?)이 섞여 있습니다. 구역질을 참으며 창고를 봅니다.",
        next: [
            { id: 'cult_4_spirit', weight: 0.0, choiceText: "신앙의 이름으로 심판 (종교적 신념 필요)", req: { skill: '종교적 신념' } },
            { id: 'cult_4_truth_fight', weight: 0.5, choiceText: "교주와 정면 승부" },
            { id: 'cult_4_truth_gun', weight: 0.0, choiceText: "권총으로 저격 (권총 필요)", req: { item: '권총' } },
            { id: 'cult_4_truth_soldier', weight: 0.0, choiceText: "전술적 제압 (전술 지휘 필요)", req: { skill: '전술 지휘' } },
            { id: 'cult_4_truth_sabotage', weight: 0.5, choiceText: "시설 파괴 및 도주" }
        ],
        effect: { target: 'ALL', sanity: -20, loot: ['인육'] }
    },
    'cult_4_spirit': {
        id: 'cult_4_spirit',
        text: "🙏 신념의 일갈에 신도들이 동요하는 틈을 타 창고의 모든 정상적인 식량들을 쓸어 담았습니다.",
        next: [{ id: 'cult_5_victory_boss', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 30, skillsAdd: [S.SPIRIT], loot: ['통조림', '통조림', '통조림', '고기'] }
    },
    'cult_4_truth_gun': {
        id: 'cult_4_truth_gun',
        text: "💥 교주를 쓰러뜨리자 신도들이 흩어집니다. 제단 아래 숨겨진 비상 식량을 찾아냈습니다.",
        next: [{ id: 'cult_5_victory_boss', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 5, fatigue: 5, statChanges: { str: 1 }, loot: ['통조림', '통조림'] }
    },
    'cult_4_truth_soldier': {
        id: 'cult_4_truth_soldier',
        text: "⚔️ 전술 지휘로 호위무사들을 제압하고 그들이 가진 보급품 배낭을 모두 수거했습니다.",
        next: [{ id: 'cult_5_victory_boss', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.COMMAND], loot: ['고기', '고기', '통조림'] }
    },
    'cult_4_truth_fight': {
        id: 'cult_4_truth_fight',
        text: "⚔️ 난전 끝에 승리했습니다. 피 튀기는 싸움이었지만 적들의 창고는 이제 우리의 것입니다.",
        next: [
            { id: 'cult_5_victory_boss', weight: 0.6 },
            { id: 'cult_5_defeat_captive', weight: 0.4 }
        ],
        effect: { target: 'RANDOM_HALF', hp: -30, fatigue: 20, statChanges: { str: 1 }, loot: ['고기', '통조림'] }
    },
    'cult_4_truth_sabotage': {
        id: 'cult_4_truth_sabotage',
        text: "🔥 불길이 치솟는 동안 주방에 들러 갓 구운 고기(?)와 채소들을 챙겨 빠져나옵니다.",
        next: [{ id: 'cult_6_escape_run', weight: 1.0 }],
        effect: { target: 'ALL', kill: 5, fatigue: 10, statChanges: { agi: 1 }, loot: ['고기', '채소'] }
    },

    'cult_5_victory_boss': {
        id: 'cult_5_victory_boss',
        text: "🗡️ 상황 종료. 교주의 비밀 금고에는 백신과 함께 고농축 영양 통조림이 가득했습니다.",
        effect: { target: 'RANDOM_1', sanity: 10, loot: ['권총', '안정제', '통조림', '통조림', '통조림'], statChanges: { cha: 1 }, skillsAdd: [S.CARE] }
    },
    'cult_5_defeat_captive': {
        id: 'cult_5_defeat_captive',
        text: "⛓️ 탈출에는 성공했지만, 놈들에게 잡혀있는 동안 모든 식량을 빼앗기고 오물 섞인 물만 마셨습니다.",
        effect: { target: 'ALL', inventoryRemove: ['통조림', '고기', '채소'], hp: -10, sanity: -20, statChanges: { con: -1 } }
    },
    'cult_6_escape_run': {
        id: 'cult_6_escape_run',
        text: "🏃‍♂️ 숲으로 도망쳤습니다. 도중에 떨어진 광신도의 배낭에서 마른 고기들을 발견했습니다.",
        effect: { target: 'RANDOM_1', fatigue: 20, sanity: -10, skillsAdd: [S.CARE], loot: ['고기', '고기'] }
    },

    'cult_2_ritual_fail': {
        id: 'cult_2_ritual_fail',
        text: "👁️ 판정 실패! 도망치는 와중에 주방을 가로지르며 통조림 몇 개를 낚아챘습니다.",
        next: [{ id: 'cult_3_battle', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -10, statChanges: { cha: -1 }, loot: ['통조림'] }
    },

    'cult_1_run': {
        id: 'cult_1_run',
        text: "🏃 도망쳤습니다. 하지만 길가에 버려진 그들의 보급 수레에서 식량을 조금 챙겼습니다.",
        effect: { target: 'ALL', fatigue: 10, statChanges: { con: 1 }, loot: ['통조림', '통조림'] }
    },
    'cult_1_spy': {
        id: 'cult_1_spy',
        text: "👀 염탐하며 그들의 식량 배급 시간을 파악했습니다. 창고 위치가 확실합니다.",
        next: [
            { id: 'cult_2_save', weight: 0.4 },
            { id: 'cult_2_watch', weight: 0.6 }
        ],
        effect: { target: 'ALL', sanity: -10, statChanges: { int: 1 }, loot: ['통조림'] }
    },
    'cult_2_save': {
        id: 'cult_2_save',
        text: "🔫 난입했습니다! 광신도를 제압하고 제물이 될 뻔한 식량(고기)들을 챙겼습니다.",
        next: [{ id: 'cult_3_battle', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 5, statChanges: { str: 1 }, loot: ['고기', '고기'] }
    },
    'cult_2_watch': {
        id: 'cult_2_watch',
        text: "😶 지켜보기만 했습니다. 그들이 떠난 자리에 남은 비참한 음식 쓰레기(?) 사이에서 통조림을 건졌습니다.",
        next: [{ id: 'cult_3_guilt', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -20, statChanges: { cha: -1 }, loot: ['통조림'] }
    },
    'cult_3_guilt': {
        id: 'cult_3_guilt',
        text: "🌫️ 죄책감에 시달리다 발견된 정찰조를 처치하고 그들의 배낭을 털었습니다.",
        next: [{ id: 'cult_3_battle', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 10, loot: ['고기'] }
    },
    'cult_3_battle': {
        id: 'cult_3_battle',
        text: "⚔️ 혈투 끝에 승리했습니다. 적들의 몸을 뒤져 비상 식량을 확보합니다.",
        next: [
            { id: 'cult_4_victory', weight: 0.5 },
            { id: 'cult_4_retreat', weight: 0.5 }
        ],
        effect: { target: 'RANDOM_HALF', hp: -20, fatigue: 20, loot: ['통조림'] }
    },
    'cult_4_victory': {
        id: 'cult_4_victory',
        text: "🔥 제단을 불태우고 창고를 열어 대량의 신선한 고기를 확보했습니다!",
        next: [{ id: 'cult_5_loot', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 10, statChanges: { str: 1 }, loot: ['고기', '고기', '고기'] }
    },
    'cult_4_retreat': {
        id: 'cult_4_retreat',
        text: "🩸 간신히 퇴각했습니다. 배가 너무 고파 도중에 주운 썩은 고기라도 챙겼습니다.",
        effect: { target: 'ALL', hp: -10, sanity: -10, statChanges: { con: -1 }, loot: ['인육'] }
    },
    'cult_5_loot': {
        id: 'cult_5_loot',
        text: "📦 의약품과 함께 보존 처리가 잘 된 프리미엄 통조림들을 다수 확보했습니다.",
        effect: { target: 'RANDOM_1', loot: ['안정제', '항생제', '통조림', '통조림', '통조림'], skillsAdd: [S.CARE] }
    }
};
