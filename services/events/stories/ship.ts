
import { StoryNode } from "../../../types";

const S = {
    MECHANIC: { name: "기계 수리", description: "차량, 발전기 등 복잡한 기계 장치를 수리합니다.", icon: "⚙️" },
    AGILITY: { name: "기동력", description: "좀비 사이를 빠르게 빠져나가거나 도망칩니다.", icon: "🏃" },
    FISHING: { name: "그물 낚시", description: "물가에서 물고기를 잡아 단백질을 보충합니다.", icon: "🎣" },
    SCAVENGING: { name: "폐지 줍기", description: "남들이 지나친 쓰레기 더미에서 귀중품을 찾습니다.", icon: "📦" }
};

export const SHIP_NODES: Record<string, StoryNode> = {
    'ship_0_start': {
        id: 'ship_0_start',
        text: "🚢 크루즈선 '포세이돈 호'입니다. 선내 식당에는 최고급 식재료와 통조림이 산더미처럼 쌓여있을 것입니다.",
        next: [
            { id: 'ship_1_board', weight: 0.7, choiceText: "승선 시도" },
            { id: 'ship_avoid', weight: 0.3, choiceText: "위험하므로 무시" }
        ],
        effect: { target: 'ALL', sanity: -5, loot: ['통조림'] }
    },
    'ship_avoid': {
        id: 'ship_avoid',
        text: "🌊 무시합니다. 항구 근처 횟집(?) 잔해에서 냉동 생선을 조금 건졌습니다.",
        effect: { target: 'ALL', fatigue: 5, loot: ['고기', '고기'] }
    },
    'ship_1_board': {
        id: 'ship_1_board',
        text: "⚓ 사다리 오르기. 도중에 떨어진 선원의 배낭에서 비상 식량을 찾아냈습니다.",
        next: [
            { 
                id: 'ship_2_deck', 
                weight: 1.0, 
                choiceText: "미끄러운 사다리 오르기 (민첩 기반)",
                dice: { threshold: 75, stat: 'agi', successId: 'ship_2_deck', failId: 'ship_1_fall', hpPenalty: -20 }
            }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'ship_1_fall': {
        id: 'ship_1_fall',
        text: "💦 바다에 빠졌습니다! 허우적대는 동안 배낭 속의 식량 일부가 물에 젖어 못쓰게 되었습니다.",
        next: [{ id: 'ship_2_deck', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -20, infection: 15, fatigue: 20, statChanges: { agi: -1 }, inventoryRemove: ['통조림'] }
    },
    'ship_2_deck': {
        id: 'ship_2_deck',
        text: "🛳️ 갑판 수색. 썬베드 근처 가방들에서 말린 과일과 통조림을 찾아냅니다.",
        next: [
            { id: 'ship_3_kitchen', weight: 0.5, choiceText: "식당칸 (식량)" },
            { id: 'ship_3_infirmary', weight: 0.5, choiceText: "의무실 (의약품)" },
            { id: 'ship_3_engine', weight: 0.0, choiceText: "기관실 (기계 수리 필요)", req: { skill: '기계 수리' } }
        ],
        effect: { target: 'ALL', sanity: -5, loot: ['초콜릿', '통조림'] }
    },
    'ship_3_kitchen': {
        id: 'ship_3_kitchen',
        text: "🍽️ 뷔페장! 거대한 냉동고 안에는 아직 얼어있는 고기와 채소, 그리고 수천 개의 통조림이 있습니다!",
        next: [{ id: 'ship_4_captain', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '통조림', '통조림', '통조림', '고기', '고기', '채소', '채소'], sanity: 5, statChanges: { con: 1 } }
    },
    'ship_3_infirmary': {
        id: 'ship_3_infirmary',
        text: "💉 의무실 수색. 환자용 고칼로리 캔 음식을 대량으로 챙겼습니다.",
        next: [{ id: 'ship_4_captain', weight: 1.0 }],
        effect: { target: 'RANDOM_1', loot: ['붕대', '항생제', '백신', '통조림', '통조림'], sanity: -5, statChanges: { int: 1 } }
    },
    'ship_3_engine': {
        id: 'ship_3_engine',
        text: "🔧 발전기 가동. 선내 자판기가 모두 열리며 초콜릿과 음료수가 쏟아져 나옵니다.",
        next: [{ id: 'ship_4_captain', weight: 1.0 }],
        effect: { target: 'RANDOM_1', loot: ['권총', '무전기', '초콜릿', '초콜릿', '통조림', '통조림'], skillsAdd: [S.MECHANIC], sanity: 10 }
    },
    'ship_4_captain': {
        id: 'ship_4_captain',
        text: "👨‍✈️ 선장실 앞. 선장이 가진 열쇠로 최고급 식재료 창고를 열 수 있을 것입니다.",
        next: [
            { 
                id: 'ship_5_win', 
                weight: 1.0, 
                choiceText: "선장과 결투 (힘 기반)",
                dice: { threshold: 85, stat: 'str', successId: 'ship_5_win', failId: 'ship_5_run', hpPenalty: -30 }
            },
            { id: 'ship_5_lure', weight: 0.0, choiceText: "소리로 유인하여 낙사 (기동력 필요)", req: { skill: '기동력' } }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'ship_5_lure': {
        id: 'ship_5_lure',
        text: "🏃 선장을 떨어뜨리고 선장실 냉장고를 열어 신선한 고기를 챙겼습니다.",
        next: [{ id: 'ship_6_loot', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: 10, skillsAdd: [S.AGILITY], loot: ['고기', '고기'] }
    },
    'ship_5_win': {
        id: 'ship_5_win',
        text: "⚔️ 선장 처치. 그의 목에서 열쇠를 얻어 특급 식재료 박스를 열었습니다.",
        next: [{ id: 'ship_6_loot', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, kill: 5, statChanges: { str: 1 }, loot: ['고기', '고기', '채소'] }
    },
    'ship_5_run': {
        id: 'ship_5_run',
        text: "🩸 도망칩니다! 와중에 챙겼던 무거운 식량 박스들을 모두 버려야 했습니다.",
        effect: { target: 'RANDOM_1', hp: -30, fatigue: 20, sanity: -10, inventoryRemove: ['통조림', '고기'] }
    },
    'ship_6_loot': {
        id: 'ship_6_loot',
        text: "📦 항해 성공. 크루즈의 모든 비상 보관함을 털어 대량의 호화 식량을 확보했습니다!",
        effect: { target: 'ALL', loot: ['권총', '백신', '통조림', '통조림', '통조림', '고기', '고기', '채소', '초콜릿'], sanity: 20, statChanges: { cha: 1 } }
    }
};
