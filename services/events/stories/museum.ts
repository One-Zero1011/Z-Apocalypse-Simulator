
import { StoryNode } from "../../../types";

const S = {
    TEACHING: { name: "지식 전수", description: "자신이 가진 기술을 동료들에게 효율적으로 가르칩니다.", icon: "🎓" },
    MELEE: { name: "근접 제압", description: "근거리 무기나 맨손으로 좀비를 효율적으로 무력화합니다.", icon: "✊" },
    ART: { name: "예술적 통찰", description: "창의적인 생각으로 예상치 못한 해결책을 제시합니다.", icon: "🎨" }
};

export const MUSEUM_NODES: Record<string, StoryNode> = {
    'museum_0_start': {
        id: 'museum_0_start',
        text: "🏛️ 박물관입니다. 웅장한 로비 카페테리아에는 아직 먹을 것이 남아있을 수 있습니다.",
        next: [
            { id: 'museum_1_enter', weight: 1.0 }
        ],
        effect: { target: 'ALL', sanity: 5, loot: ['통조림'] }
    },
    'museum_1_enter': {
        id: 'museum_1_enter',
        text: "🏺 박물관 카페의 매대가 부서져 있습니다. 구석에서 초콜릿 묶음을 발견했습니다.",
        next: [
            { id: 'museum_2_history', weight: 0.0, choiceText: "역사적 구조 파악 (지식 전수 필요)", req: { skill: '지식 전수' } },
            { id: 'museum_2_fight', weight: 0.6, choiceText: "전시물(무기) 확보 후 전투" },
            { id: 'museum_2_hide', weight: 0.4, choiceText: "전시관 사이로 은신" }
        ],
        effect: { target: 'ALL', sanity: -5, loot: ['초콜릿', '초콜릿'] }
    },
    'museum_2_history': {
        id: 'museum_2_history',
        text: "🎓 비밀 통로 발견. 직원용 휴게실에서 보존 처리가 된 고대식 장기 보관 식품(?) 대신 대량의 통조림을 찾아냈습니다.",
        next: [{ id: 'museum_3_storage', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.TEACHING], statChanges: { int: 1 }, loot: ['통조림', '통조림', '통조림'] }
    },
    'museum_2_fight': {
        id: 'museum_2_fight',
        text: "⚔️ 전투 중. 쓰러진 좀비(관람객)의 배낭에서 샌드위치(고기)와 통조림을 건졌습니다.",
        next: [{ id: 'museum_3_knight', weight: 1.0 }],
        effect: { target: 'ALL', kill: 3, fatigue: 15, statChanges: { str: 1 }, loot: ['고기', '통조림'] }
    },
    'museum_2_hide': {
        id: 'museum_2_hide',
        text: "🤫 공룡 화석 뒤. 도중에 발견한 자판기를 털어 간식들을 챙겼습니다.",
        next: [{ id: 'museum_3_knight', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 5, sanity: -5, loot: ['초콜릿', '통조림'] }
    },
    'museum_3_knight': {
        id: 'museum_3_knight',
        text: "🛡️ 갑옷 기사가 길을 막습니다. 놈이 지키고 있는 전시관 뒤쪽엔 직원용 냉장고가 보입니다!",
        next: [
            { id: 'museum_4_melee', weight: 0.0, choiceText: "갑옷 틈새 공략 (근접 제압 필요)", req: { skill: '근접 제압' } },
            { 
                id: 'museum_4_topple', 
                weight: 1.0, 
                choiceText: "협동하여 넘어뜨리기 (힘 기반)",
                dice: { threshold: 80, stat: 'str', successId: 'museum_4_win', failId: 'museum_4_fail', hpPenalty: -30 }
            }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'museum_4_melee': {
        id: 'museum_4_melee',
        text: "✊ 기사 제압. 놈의 뒤에 있던 직원용 대형 냉장고에서 신선한 고기와 채소들을 대량 확보했습니다!",
        next: [{ id: 'museum_5_treasure', weight: 1.0 }],
        effect: { target: 'RANDOM_1', kill: 5, skillsAdd: [S.MELEE], statChanges: { str: 1, agi: 1 }, loot: ['고기', '고기', '고기', '채소', '채소'] }
    },
    'museum_4_win': {
        id: 'museum_4_win',
        text: "🛡️ 기사 처치. 놈의 배낭(?)에서 최고급 통조림 세트가 나옵니다.",
        next: [{ id: 'museum_5_treasure', weight: 1.0 }],
        effect: { target: 'ALL', kill: 2, fatigue: 20, statChanges: { str: 1 }, loot: ['통조림', '통조림', '통조림'] }
    },
    'museum_4_fail': {
        id: 'museum_4_fail',
        text: "🩸 도주 성공. 하지만 가방을 열어보니 챙겼던 식량들이 대부분 떨어져 나갔습니다.",
        effect: { target: 'RANDOM_HALF', hp: -35, fatigue: 30, statChanges: { con: -1 }, inventoryRemove: ['통조림'] }
    },
    'museum_3_storage': {
        id: 'museum_3_storage',
        text: "📦 수장고 파밍. 오랫동안 보존된 구호 물품 상자들을 열어 대량의 통조림을 확보했습니다.",
        next: [{ id: 'museum_5_treasure', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '통조림', '통조림', '통조림', '붕대'], sanity: 5 }
    },
    'museum_5_treasure': {
        id: 'museum_5_treasure',
        text: "👑 왕의 옥좌 아래 숨겨진 비상용 식량(고기)과 와인을 즐기며 하루를 마무리합니다.",
        effect: { target: 'ALL', sanity: 30, fatigue: -20, skillsAdd: [S.ART], statChanges: { cha: 1 }, loot: ['고기', '고기'] }
    }
};
