
import { StoryNode } from "../../../types";

const S = {
    MARKSMANSHIP: { name: "전술 사격", description: "총기류를 능숙하게 다루며 명중률과 처치 효율이 상승합니다.", icon: "🔫" },
    LAW: { name: "질서 유지", description: "그룹 내 규칙을 세우고 갈등을 법대로 중재합니다.", icon: "⚖️" },
    MELEE: { name: "근접 제압", description: "근거리 무기나 맨손으로 좀비를 효율적으로 무력화합니다.", icon: "✊" },
    INFIL: { name: "잠입 기술", description: "폐쇄된 구역이나 적진에 몰래 들어갑니다.", icon: "🗝️" }
};

export const PRISON_NODES: Record<string, StoryNode> = {
    'prison_0_start': {
        id: 'prison_0_start',
        text: "🏰 주립 교도소입니다. 거대한 식량 창고와 무기고가 우리의 목표입니다.",
        next: [
            { id: 'prison_1_front_assault', weight: 0.3, choiceText: "정면 돌파 (무력 진입)" },
            { id: 'prison_1_sewer_sneak', weight: 0.7, choiceText: "배수로 잠입 (은밀 침투)" },
            { id: 'prison_1_infiltration', weight: 0.0, choiceText: "교도소 외벽 등반 및 잠입 (잠입 기술 필요)", req: { skill: '잠입 기술' } }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'prison_1_infiltration': {
        id: 'prison_1_infiltration',
        text: "🗝️ 잠입 성공. 복도의 직원용 사물함에서 고기 통조림을 찾아냈습니다.",
        next: [{ id: 'prison_3_control_room', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: 15, skillsAdd: [S.INFIL], statChanges: { agi: 1 }, loot: ['통조림', '고기'] }
    },
    'prison_1_front_assault': {
        id: 'prison_1_front_assault',
        text: "🔫 정면 돌파. 위병소 근처에서 군용 레이션(통조림)을 무더기로 발견했습니다.",
        next: [
          { id: 'prison_2_marksmanship', weight: 0.0, choiceText: "정밀 저격으로 입구 정리 (전술 사격 필요)", req: { skill: '전술 사격' } },
          { id: 'prison_2_block_c', weight: 1.0 }
        ],
        effect: { target: 'ALL', kill: 3, fatigue: 15, hp: -5, statChanges: { str: 1 }, loot: ['통조림', '통조림', '통조림'] }
    },
    'prison_2_marksmanship': {
        id: 'prison_2_marksmanship',
        text: "🔫 저격 성공. 쓰러진 경비병의 배낭에서 고급 소고기 통조림을 찾아냈습니다.",
        next: [{ id: 'prison_2_block_c', weight: 1.0 }],
        effect: { target: 'RANDOM_1', kill: 5, sanity: 5, skillsAdd: [S.MARKSMANSHIP], statChanges: { agi: 1 }, loot: ['통조림', '고기'] }
    },
    'prison_1_sewer_sneak': {
        id: 'prison_1_sewer_sneak',
        text: "🕳️ 잠입 성공. 배수로 끝 주방 근처에서 버려진 고기 덩어리들을 발견했습니다.",
        next: [{ id: 'prison_2_block_c', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -10, fatigue: 10, statChanges: { agi: 1 }, loot: ['고기', '고기'] }
    },
    'prison_2_block_c': {
        id: 'prison_2_block_c',
        text: "⛓️ C동 구역. 죄수들이 감방 안에 숨겨둔 비상 식량(라면, 통조림)들이 곳곳에 보입니다.",
        next: [
            { id: 'prison_3_logistics', weight: 0.0, choiceText: "창고 자원 최적화 (자원 관리 필요)", req: { skill: '자원 관리' } },
            { id: 'prison_3_armory', weight: 0.5, choiceText: "무기고 수색" },
            { id: 'prison_3_infirmary', weight: 0.5, choiceText: "의무실 수색" },
            { id: 'prison_3_control_room', weight: 0.0, choiceText: "통제실 진입 (질서 유지 필요)", req: { skill: '질서 유지' } },
            { id: 'prison_3_control_room_dev', weight: 0.0, choiceText: "보안 해킹 (시스템 해킹 필요)", req: { skill: '시스템 해킹' } }
        ],
        effect: { target: 'ALL', sanity: -5, loot: ['통조림', '통조림'] }
    },
    'prison_3_logistics': {
        id: 'prison_3_logistics',
        text: "🧮 자원 관리 스킬로 대형 식료품 창고를 발견했습니다! 수개월치 통조림과 곡물을 확보합니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '통조림', '통조림', '통조림', '통조림', '고기', '채소'], sanity: 10, statChanges: { int: 1 } }
    },
    'prison_3_armory': {
        id: 'prison_3_armory',
        text: "🔫 무기고 입구에서 경비대원들의 비상 전투 식량을 대량으로 건졌습니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['권총', '맥가이버 칼', '통조림', '통조림'], statChanges: { str: 1 } }
    },
    'prison_3_infirmary': {
        id: 'prison_3_infirmary',
        text: "💊 의무실 안쪽 조리실에서 환자용 영양 통조림을 다수 발견했습니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -5, loot: ['항생제', '붕대', '통조림', '통조림'], statChanges: { con: 1 } }
    },
    'prison_3_control_room': {
        id: 'prison_3_control_room',
        text: "🖥️ 통제실을 장악하자 비밀 창고가 열립니다. 고급 스테이크용 고기와 와인이 들어있습니다!",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'RANDOM_1', loot: ['권총', '무전기', '고기', '고기'], sanity: 10, skillsAdd: [S.LAW], statChanges: { int: 1 } }
    },
    'prison_3_control_room_dev': { 
        id: 'prison_3_control_room_dev', 
        text: "🖥️ 해킹 성공. 교도소 식량 배급 시스템의 제어권을 획득하여 창고 문을 모두 열었습니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }], 
        effect: { target: 'ALL', loot: ['권총', '무전기', '통조림', '통조림', '통조림'], sanity: 10, statChanges: { int: 1 } } 
    },
    'prison_4_warden': {
        id: 'prison_4_warden',
        text: "🗝️ 마스터 키를 가진 죄수들을 제압하면 그들의 거대한 식량 더미를 차지할 수 있습니다.",
        next: [
            { id: 'prison_5_melee', weight: 0.0, choiceText: "선두에서 무력 제압 (근접 제압 필요)", req: { skill: '근접 제압' } },
            { id: 'prison_5_ambush', weight: 0.6, choiceText: "정면 승부" },
            { id: 'prison_5_hide', weight: 0.4 }
        ],
        effect: { target: 'ALL', sanity: -5, loot: ['통조림'] }
    },
    'prison_5_melee': {
        id: 'prison_5_melee',
        text: "✊ 제압 성공. 적들이 모아둔 며칠치 신선한 고기들을 모두 빼앗았습니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 15, kill: 2, skillsAdd: [S.MELEE], statChanges: { str: 1 }, loot: ['고기', '고기', '고기'] }
    },
    'prison_5_ambush': {
        id: 'prison_5_ambush',
        text: "⚔️ 적들을 쓰러뜨리고 그들의 배낭에서 통조림을 챙깁니다.",
        next: [{ id: 'prison_6_victory', weight: 0.5 }, { id: 'prison_6_captured', weight: 0.5 }],
        effect: { target: 'RANDOM_HALF', hp: -20, kill: 2, fatigue: 20, statChanges: { str: 1 }, loot: ['통조림', '통조림'] }
    },
    'prison_5_hide': {
        id: 'prison_5_hide',
        text: "🤫 숨어서 기다리는 동안 바닥에 떨어진 에너지 바(초콜릿)를 주웠습니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -15, fatigue: 5, statChanges: { agi: 1 }, loot: ['초콜릿'] }
    },
    'prison_6_victory': {
        id: 'prison_6_victory',
        text: "🩸 리더의 방에서 최상품 통조림 세트를 발견했습니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['고기', '통조림', '통조림', '권총'], statChanges: { str: 1 } }
    },
    'prison_6_captured': {
        id: 'prison_6_captured',
        text: "🔗 제압당했지만, 감옥 안에서 죄수들이 숨겨둔 건조 식품을 발견해 몰래 먹으며 버텼습니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'ALL', hp: -10, inventoryRemove: ['무전기'], statChanges: { cha: -1 }, loot: ['통조림'] }
    },
    'prison_7_yard': {
        id: 'prison_7_yard',
        text: "🏟️ 운동장에 흩어진 보급 상자들 사이를 달려야 합니다. 먹을 것이 가득합니다!",
        next: [
            { 
                id: 'prison_8_armored_car', 
                weight: 1.0, 
                choiceText: "좀비 사이를 가로질러 달리기 (민첩 기반)",
                dice: { threshold: 85, stat: 'agi', successId: 'prison_8_armored_car', failId: 'prison_8_lockdown', hpPenalty: -30 }
            }
        ],
        effect: { target: 'ALL', fatigue: 15, loot: ['통조림', '통조림'] }
    },
    'prison_8_armored_car': {
        id: 'prison_8_armored_car',
        text: "🚐 버스 안에 가득 실려있던 군용 식량들과 함께 교도소를 빠져나갑니다! 최고의 수확입니다.",
        effect: { target: 'ALL', sanity: 15, fatigue: -20, statChanges: { con: 1, str: 1 }, loot: ['통조림', '통조림', '통조림', '통조림', '고기', '고기', '채소'] }
    },
    'prison_8_lockdown': {
        id: 'prison_8_lockdown',
        text: "🚨 갇혔습니다. 배고픔과 절망 속에 가방에 남은 마지막 통조림을 깝니다.",
        effect: { target: 'ALL', sanity: -30, fatigue: 20, statChanges: { con: -2 }, loot: ['통조림'] }
    }
};
