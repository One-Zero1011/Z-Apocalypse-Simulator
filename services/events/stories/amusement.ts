
import { StoryNode } from "../../../types";

const S = {
    ART: { name: "예술적 통찰", description: "창의적인 생각으로 예상치 못한 해결책을 제시합니다.", icon: "🎨" },
    BOMBER: { name: "폭발 전문가", description: "투척물이나 폭발물을 제조하고 안전하게 다룹니다.", icon: "💣" },
    TRAP: { name: "함정 설치", description: "주변 지형을 이용해 좀비의 발을 묶거나 처치하는 함정을 만듭니다.", icon: "🪤" }
};

export const AMUSEMENT_NODES: Record<string, StoryNode> = {
    'amusement_0_start': {
        id: 'amusement_0_start',
        text: "🎡 놀이공원 입구입니다. 매점 창고에는 대량의 간식과 통조림이 있을 것입니다.",
        next: [{ id: 'amusement_1_ticket', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -5, loot: ['초콜릿'] }
    },

    'amusement_1_ticket': {
        id: 'amusement_1_ticket',
        text: "🎫 입장합니다. 바닥에 흩어진 미개봉 팝콘 박스들을 챙깁니다.",
        next: [
            { id: 'amusement_2_art', weight: 0.0, choiceText: "창의적인 지름길 구상 (예술적 통찰 필요)", req: { skill: '예술적 통찰' } },
            { id: 'amusement_haunted', weight: 0.5, choiceText: "유령의 집 (지름길)" },
            { id: 'amusement_arcade', weight: 0.5, choiceText: "오락실 (물자 파밍)" },
            { id: 'amusement_arcade_expert', weight: 0.0, choiceText: "오락실 정밀 수색 (반사 신경 필요)", req: { skill: '반사 신경' } },
            { id: 'amusement_arcade_sneak', weight: 0.0, choiceText: "직원 구역 잠입 (은밀 기동 필요)", req: { skill: '은밀 기동' } },
            { id: 'amusement_arcade_recycle', weight: 0.0, choiceText: "기계 부품 추출 (부품 재활용 필요)", req: { skill: '부품 재활용' } }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'amusement_2_art': {
        id: 'amusement_2_art',
        text: "🎨 예술적 통찰로 좀비들을 피하며 스낵바 창고로 들어갔습니다. 유통기한이 넉넉한 통조림들을 발견했습니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 15, skillsAdd: [S.ART], statChanges: { cha: 1 }, loot: ['통조림', '통조림', '통조림'] }
    },

    'amusement_haunted': {
        id: 'amusement_haunted',
        text: "👻 무섭지만 지름길입니다. 도중에 떨어진 관광객의 배낭에서 간식을 건졌습니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -10, sanity: -15, statChanges: { int: -1 }, loot: ['초콜릿', '통조림'] }
    },
    'amusement_arcade': {
        id: 'amusement_arcade',
        text: "🕹️ 자판기를 부수고 대량의 초콜릿 바와 음료수를 챙겼습니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['초콜릿', '초콜릿', '통조림'], statChanges: { agi: 1 } }
    },
    'amusement_arcade_expert': {
        id: 'amusement_arcade_expert',
        text: "🕹️ 빠른 반사 신경으로 함정을 피하며 오락실 VIP룸에 숨겨진 보급품과 고급 간식을 챙겼습니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['초콜릿', '비타민', '맥가이버 칼', '통조림', '통조림'], sanity: 10, statChanges: { agi: 1 } }
    },
    'amusement_arcade_sneak': { 
        id: 'amusement_arcade_sneak',
        text: "🕹️ 직원 전용 식당 창고를 발견했습니다! 신선도가 유지된 채소와 육포가 가득합니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '통조림', '고기', '고기', '채소'], sanity: 10, statChanges: { agi: 1 } }
    },
    'amusement_arcade_recycle': {
        id: 'amusement_arcade_recycle',
        text: "🕹️ 기계를 분해하는 동안 구석 선반에서 잊혀진 직원용 간식들을 찾아냈습니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['맥가이버 칼', '비타민', '통조림'], sanity: 5, statChanges: { int: 1 } }
    },

    'amusement_3_rollercoaster': {
        id: 'amusement_3_rollercoaster',
        text: "🎢 레일 위를 이동합니다. 정비사들이 남긴 비상 식량 봉투를 발견했습니다.",
        next: [
            { id: 'amusement_4_circus', weight: 0.7 },
            { id: 'amusement_4_fall', weight: 0.3 }
        ],
        effect: { target: 'ALL', fatigue: 10, statChanges: { agi: 1 }, loot: ['통조림', '고기'] }
    },
    'amusement_4_fall': {
        id: 'amusement_4_fall',
        text: "🦶 추락했습니다! 하지만 떨어진 곳이 솜사탕 매대였고, 그 안에서 통조림을 찾았습니다.",
        next: [{ id: 'amusement_4_circus', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -15, fatigue: 10, statChanges: { agi: -1 }, loot: ['통조림'] }
    },

    'amusement_4_circus': {
        id: 'amusement_4_circus',
        text: "🎪 서커스 천막. 단원들이 키우던 가축(좀비가 됨)들이 남긴 사료와 식량이 보입니다.",
        next: [{ id: 'amusement_5_clowns', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -5, statChanges: { int: 1 }, loot: ['고기'] }
    },

    'amusement_5_clowns': {
        id: 'amusement_5_clowns',
        text: "🤡 광대 좀비들의 가방에 든 소시지와 통조림이 탐납니다. 필사적으로 뺏어야 합니다.",
        next: [
            { id: 'amusement_6_bomber', weight: 0.0, choiceText: "광대 폭파 (폭발 전문가 필요)", req: { skill: '폭발 전문가' } },
            { id: 'amusement_6_trap', weight: 0.0, choiceText: "함정으로 유인 (함정 설치 필요)", req: { skill: '함정 설치' } },
            { id: 'amusement_6_escape_attempt', weight: 1.0, choiceText: "필사적으로 도망치기" }
        ],
        effect: { target: 'ALL', sanity: -20, loot: ['고기'] }
    },
    'amusement_6_bomber': {
        id: 'amusement_6_bomber',
        text: "💣 쾅! 광대들이 사라진 자리에 그들이 가방 가득 모아둔 소시지(고기)들이 흩어졌습니다.",
        next: [{ id: 'amusement_7_mascot_boss', weight: 1.0 }],
        effect: { target: 'RANDOM_1', kill: 10, sanity: 15, skillsAdd: [S.BOMBER], statChanges: { int: 1 }, loot: ['고기', '고기', '고기', '통조림'] }
    },
    'amusement_6_trap': {
        id: 'amusement_6_trap',
        text: "🪤 함정에 걸린 좀비들의 배낭을 여유롭게 털었습니다. 꽤 많은 식량이 나옵니다.",
        next: [{ id: 'amusement_7_mascot_boss', weight: 1.0 }],
        effect: { target: 'RANDOM_1', kill: 5, sanity: 10, skillsAdd: [S.TRAP], statChanges: { int: 1 }, loot: ['통조림', '통조림', '고기'] }
    },

    'amusement_6_escape_attempt': {
        id: 'amusement_6_escape_attempt',
        text: "🏃‍♂️ 도망칩니다! 도중에 매점 가판대를 엎어 좀비들을 막고 식량을 챙겼습니다.",
        next: [
            { id: 'amusement_6_run', weight: 0.5 },
            { id: 'amusement_6_caught', weight: 0.5 }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },

    'amusement_6_run': {
        id: 'amusement_6_run',
        text: "🏃‍♂️ 성공! 통제실 직원 냉장고에서 신선한 채소와 고기를 발견했습니다.",
        next: [{ id: 'amusement_7_mascot_boss', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 25, statChanges: { agi: 1 }, loot: ['고기', '채소'] }
    },
    'amusement_6_caught': {
        id: 'amusement_6_caught',
        text: "🤡 실패! 억지로 싸우는 도중 가방이 찢어져 소중한 고기를 잃어버렸습니다.",
        next: [{ id: 'amusement_7_mascot_boss', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -25, fatigue: 30, sanity: -10, statChanges: { agi: -1 }, inventoryRemove: ['고기'] }
    },

    'amusement_7_mascot_boss': {
        id: 'amusement_7_mascot_boss',
        text: "🧸 [BOSS] 해피 베어를 쓰러뜨리면 놈이 보물처럼 지키던 통조림 산을 차지할 수 있습니다.",
        next: [
            { id: 'amusement_8_parade', weight: 0.6 },
            { id: 'amusement_8_trapped', weight: 0.4 }
        ],
        effect: { target: 'ALL', hp: -20, sanity: -10, statChanges: { con: 1 }, loot: ['통조림'] }
    },

    'amusement_8_parade': {
        id: 'amusement_8_parade',
        text: "🎉 승리! 퍼레이드 카에는 수개월치 축제용 식량과 보존식품이 가득 실려있습니다!",
        effect: { target: 'ALL', sanity: 30, loot: ['비타민', '통조림', '통조림', '통조림', '통조림', '고기', '고기'], statChanges: { cha: 1 } }
    },
    'amusement_8_trapped': {
        id: 'amusement_8_trapped',
        text: "🎡 갇혔습니다. 다행히 관람차 칸마다 손님들이 남긴 팝콘과 통조림이 조금씩 있습니다.",
        effect: { target: 'ALL', sanity: -20, hp: -10, statChanges: { con: -1 }, loot: ['통조림', '초콜릿'] } 
    }
};
