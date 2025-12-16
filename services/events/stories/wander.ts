
import { StoryNode } from "../../../types";

export const WANDER_NODES: Record<string, StoryNode> = {
    'wander_0_start': {
        id: 'wander_0_start',
        text: "🏕️ 숲속 공터에서 다른 생존자 그룹의 캠프를 발견했습니다. 규모가 꽤 커 보입니다.",
        next: [
            { id: 'wander_1_approach', weight: 0.6 },
            { id: 'wander_1_steal', weight: 0.4 }
        ]
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
            { id: 'wander_3_success', weight: 0.4 },
            { id: 'wander_3_caught', weight: 0.6 }
        ],
        effect: { target: 'ALL', fatigue: 10 }
    },
    'wander_2_feast': {
        id: 'wander_2_feast',
        text: "🍖 그들은 사냥한 멧돼지 고기를 나눠주었습니다. 오랜만에 배불리 먹고 정보를 교환합니다.",
        next: [{ id: 'wander_4_parting', weight: 1.0 }],
        effect: { target: 'ALL', hp: 10, sanity: 15 }
    },
    'wander_2_betrayal': {
        id: 'wander_2_betrayal',
        text: "🍷 음식에 수면제가 들어있었습니다! 눈을 떠보니 우리는 묶여있고 짐은 사라졌습니다.",
        next: [{ id: 'wander_4_escape', weight: 1.0 }],
        effect: { target: 'ALL', inventoryRemove: ['통조림'], sanity: -20 }
    },
    'wander_3_success': {
        id: 'wander_3_success',
        text: "🎒 대성공! 그들의 식량과 약품을 훔쳐 달아났습니다. 양심의 가책이 느껴지지만 배는 부릅니다.",
        effect: { target: 'ALL', sanity: -5, loot: ['통조림', '항생제'] }
    },
    'wander_3_caught': {
        id: 'wander_3_caught',
        text: "🔦 들켰습니다! 총알이 빗발치는 가운데 빈손으로 도망쳤습니다. 몇 명이 다리에 총상을 입었습니다.",
        effect: { target: 'RANDOM_HALF', hp: -30, fatigue: 20 }
    },
    'wander_4_escape': {
        id: 'wander_4_escape',
        text: "🔗 밧줄을 끊고 필사적으로 탈출했습니다. 가진 것은 없지만 목숨은 건졌습니다.",
        effect: { target: 'ALL', fatigue: 20 }
    },
    'wander_4_parting': {
        id: 'wander_4_parting',
        text: "🤝 날이 밝자 우리는 서로의 행운을 빌며 헤어졌습니다. 그들은 지도에 안전 가옥 위치를 표시해주었습니다.",
        effect: { target: 'ALL', sanity: 5 }
    }
};
