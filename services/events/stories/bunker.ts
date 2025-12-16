
import { StoryNode } from "../../../types";

export const BUNKER_NODES: Record<string, StoryNode> = {
    // Depth 0: 시작
    'bunker_0_signal': {
        id: 'bunker_0_signal',
        text: "📻 버려진 군용 통신 차량에서 반복되는 좌표 신호를 포착했습니다. '프로젝트 노아: 최후의 피난처'. 좌표는 깊은 산속을 가리킵니다.",
        next: [
            { id: 'bunker_1_mountain', weight: 0.6 },
            { id: 'bunker_1_river', weight: 0.4 }
        ],
        effect: { target: 'ALL', sanity: 5 }
    },

    // Depth 1: 접근 경로 선택
    'bunker_1_mountain': {
        id: 'bunker_1_mountain',
        text: "🏔️ 산길을 통해 좌표로 이동합니다. 길은 험하고 가파르지만, 좀비들의 눈을 피하기엔 좋습니다.",
        next: [{ id: 'bunker_2_entrance', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 15 }
    },
    'bunker_1_river': {
        id: 'bunker_1_river',
        text: "🌊 계곡을 따라 이동합니다. 이동 속도는 빠르지만, 물가에 서식하는 변종 거머리들의 습격 위험이 있습니다.",
        next: [{ id: 'bunker_2_entrance', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, fatigue: 5 }
    },

    // Depth 2: 입구 발견
    'bunker_2_entrance': {
        id: 'bunker_2_entrance',
        text: "🚪 거대한 강철 문이 산비탈에 박혀있습니다. 문은 굳게 닫혀있고, 옆에는 전자식 키패드와 환풍구가 보입니다.",
        next: [
            { id: 'bunker_3_hack', weight: 0.5 },
            { id: 'bunker_3_vent', weight: 0.5 }
        ]
    },

    // Depth 3: 진입 방법
    'bunker_3_hack': {
        id: 'bunker_3_hack',
        text: "💻 보안 시스템을 해킹하여 정문을 엽니다. 시간이 걸리고 정신적으로 소모가 크지만, 안전하게 들어갈 수 있습니다.",
        next: [{ id: 'bunker_4_lobby', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: -15, fatigue: 10 }
    },
    'bunker_3_vent': {
        id: 'bunker_3_vent',
        text: "💨 비좁은 환풍구를 통해 기어 들어갑니다. 옷이 찢어지고 찰과상을 입었지만 내부에 진입했습니다.",
        next: [{ id: 'bunker_4_lobby', weight: 1.0 }],
        effect: { target: 'ALL', hp: -5, fatigue: 10 }
    },

    // Depth 4: 로비 (분기점)
    'bunker_4_lobby': {
        id: 'bunker_4_lobby',
        text: "🏢 벙커 내부는 전력이 들어오지 않아 어둡습니다. 바닥에는 연구원들의 백골 시체가 즐비합니다. 어디를 먼저 조사할까요?",
        next: [
            { id: 'bunker_5_armory', weight: 0.5 }, // 무기고
            { id: 'bunker_5_cafeteria', weight: 0.5 } // 식당
        ],
        effect: { target: 'ALL', sanity: -5 }
    },

    // Depth 5: 자원 확보
    'bunker_5_armory': {
        id: 'bunker_5_armory',
        text: "🔫 무기고는 이미 털린 상태였지만, 구석에서 숨겨진 탄약 상자를 발견했습니다.",
        next: [{ id: 'bunker_6_corridor', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['맥가이버 칼', '권총'] }
    },
    'bunker_5_cafeteria': {
        id: 'bunker_5_cafeteria',
        text: "🥫 식당의 냉동고는 멈췄지만, 통조림 창고는 무사합니다. 다량의 식량을 확보했습니다.",
        next: [{ id: 'bunker_6_corridor', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '통조림', '초콜릿'] }
    },

    // Depth 6: 복도의 위협
    'bunker_6_corridor': {
        id: 'bunker_6_corridor',
        text: "⚠️ 지하 2층으로 내려가는 복도에서 '자동 방어 포탑'이 작동을 시작했습니다! 붉은 레이저가 우리를 겨눕니다.",
        next: [
            { id: 'bunker_7_sprint', weight: 0.4 },
            { id: 'bunker_7_destroy', weight: 0.6 }
        ]
    },

    // Depth 7: 위협 대처
    'bunker_7_sprint': {
        id: 'bunker_7_sprint',
        text: "🏃‍♂️ 사격이 시작되기 전에 전력 질주하여 사각지대로 피했습니다! 숨이 턱 끝까지 차오릅니다.",
        next: [{ id: 'bunker_8_lab', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 20 }
    },
    'bunker_7_destroy': {
        id: 'bunker_7_destroy',
        text: "💥 엄폐물 뒤에서 사격하여 포탑을 파괴했습니다. 파편이 튀어 부상을 입었지만 위협은 제거되었습니다.",
        next: [{ id: 'bunker_8_lab', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -15 }
    },

    // Depth 8: 실험실 (비밀)
    'bunker_8_lab': {
        id: 'bunker_8_lab',
        text: "🧪 지하 2층 실험실. 이곳에서 '슈퍼 솔져' 실험이 자행되었던 것 같습니다. 배양관 안의 괴생명체가 눈을 뜹니다.",
        next: [{ id: 'bunker_9_fight_mutant', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -20 }
    },

    // Depth 9: 중간 보스
    'bunker_9_fight_mutant': {
        id: 'bunker_9_fight_mutant',
        text: "🧟‍♂️ [BOSS] 배양관을 깨고 나온 변종 '타이런트'가 포효합니다! 좁은 실험실에서 필사의 전투가 벌어집니다.",
        next: [
            { id: 'bunker_10_reactor', weight: 0.7 }, // 승리
            { id: 'bunker_10_retreat', weight: 0.3 }  // 도주 (실패 분기)
        ],
        effect: { target: 'ALL', hp: -25, fatigue: 20 }
    },

    // Depth 10: 도주 (실패 엔딩)
    'bunker_10_retreat': {
        id: 'bunker_10_retreat',
        text: "💨 놈은 너무 강력합니다! 우리는 동료 한 명을 미끼로 던져두고 벙커를 빠져나왔습니다. 아무것도 얻지 못했습니다.",
        effect: { target: 'RANDOM_1', status: 'Dead', sanity: -30 }
    },

    // Depth 10: 원자로 (성공 루트 진입)
    'bunker_10_reactor': {
        id: 'bunker_10_reactor',
        text: "☢️ 괴물을 쓰러뜨리고 최하층 제어실에 도달했습니다. 원자로가 과열되어 폭발 직전입니다. 냉각 시스템을 재부팅해야 합니다.",
        next: [
            { id: 'bunker_11_success', weight: 0.5 },
            { id: 'bunker_11_meltdown', weight: 0.5 }
        ],
        // 기술자가 있으면 성공 확률 높음 (로직상 구현 한계로 랜덤)
    },

    // Depth 11: 엔딩
    'bunker_11_meltdown': {
        id: 'bunker_11_meltdown',
        text: "🚨 재부팅 실패! 경보음이 울립니다. 우리는 귀중한 약품 몇 개만 챙겨서 폭발하기 직전의 벙커를 탈출했습니다.",
        effect: { target: 'ALL', fatigue: 20, loot: ['백신', '항생제'] }
    },
    'bunker_11_success': {
        id: 'bunker_11_success',
        text: "✅ 시스템 정상화. 조명이 켜지고 공기 정화 장치가 돌아갑니다. 우리는 이곳을 새로운 안전 기지로 삼고, 막대한 물자를 확보했습니다!",
        effect: { target: 'ALL', sanity: 50, hp: 50, fatigue: -50, loot: ['백신', '안정제', '통조림', '통조림', '무전기', '지도'] }
    }
};
