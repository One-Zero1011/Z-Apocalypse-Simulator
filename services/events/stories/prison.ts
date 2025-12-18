
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
        text: "🏰 주립 교도소입니다. 내부는 좀비들로 가득할까요, 아니면 죄수들이 장악했을까요?",
        next: [
            { id: 'prison_1_front_assault', weight: 0.3, choiceText: "정면 돌파 (무력 진입)" },
            { id: 'prison_1_sewer_sneak', weight: 0.7, choiceText: "배수로 잠입 (은밀 침투)" },
            { id: 'prison_1_infiltration', weight: 0.0, choiceText: "교도소 외벽 등반 및 잠입 (잠입 기술 필요)", req: { skill: '잠입 기술' } }
        ]
    },
    'prison_1_infiltration': {
        id: 'prison_1_infiltration',
        text: "🗝️ 잠입 기술을 활용해 감시탑의 사각지대를 완벽히 타고 올라가 통제실로 직행했습니다.",
        next: [{ id: 'prison_3_control_room', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 15, fatigue: 15, skillsAdd: [S.INFIL], statChanges: { agi: 1 } }
    },
    'prison_1_front_assault': {
        id: 'prison_1_front_assault',
        text: "🔫 정면돌파를 선택했습니다. 위병소의 좀비들을 처리하며 정문으로 들어갑니다.",
        next: [
          { id: 'prison_2_marksmanship', weight: 0.0, choiceText: "정밀 저격으로 입구 정리 (전술 사격 필요)", req: { skill: '전술 사격' } },
          { id: 'prison_2_block_c', weight: 1.0 }
        ],
        effect: { target: 'ALL', kill: 3, fatigue: 15, hp: -5, statChanges: { str: 1 } }
    },
    'prison_2_marksmanship': {
        id: 'prison_2_marksmanship',
        text: "🔫 전술 사격 스킬로 위병소의 좀비들을 소음 없이 정확히 제거했습니다. 탄약 소모를 최소화했습니다.",
        next: [{ id: 'prison_2_block_c', weight: 1.0 }],
        effect: { target: 'ALL', kill: 5, sanity: 5, skillsAdd: [S.MARKSMANSHIP], statChanges: { agi: 1 } }
    },
    'prison_1_sewer_sneak': {
        id: 'prison_1_sewer_sneak',
        text: "🕳️ 배수로를 통해 잠입합니다. 악취가 진동하지만 들키지 않고 진입했습니다.",
        next: [{ id: 'prison_2_block_c', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -10, fatigue: 10, statChanges: { agi: 1 } }
    },
    'prison_2_block_c': {
        id: 'prison_2_block_c',
        text: "⛓️ C동 감방 구역. 감염된 죄수들이 울부짖습니다. 어디를 수색할까요?",
        next: [
            { id: 'prison_3_logistics', weight: 0.0, choiceText: "창고 자원 최적화 (자원 관리 필요)", req: { skill: '자원 관리' } },
            { id: 'prison_3_armory', weight: 0.5, choiceText: "무기고 수색" },
            { id: 'prison_3_infirmary', weight: 0.5, choiceText: "의무실 수색" },
            { id: 'prison_3_control_room', weight: 0.0, choiceText: "통제실 진입 (질서 유지 필요)", req: { skill: '질서 유지' } },
            { id: 'prison_3_control_room_dev', weight: 0.0, choiceText: "보안 해킹 (시스템 해킹 필요)", req: { skill: '시스템 해킹' } }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'prison_3_logistics': {
        id: 'prison_3_logistics',
        text: "🧮 자원 관리 스킬로 엉망이 된 창고에서 버려질 뻔한 보급품들을 체계적으로 분류해 챙겼습니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '통조림', '붕대'], sanity: 10, statChanges: { int: 1 } }
    },
    'prison_3_armory': {
        id: 'prison_3_armory',
        text: "🔫 무기고에서 진압봉과 약간의 탄약을 챙겼습니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['권총', '맥가이버 칼'], statChanges: { str: 1 } }
    },
    'prison_3_infirmary': {
        id: 'prison_3_infirmary',
        text: "💊 의무실에서 의약품을 다수 발견했습니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -5, loot: ['항생제', '붕대'], statChanges: { con: 1 } }
    },
    'prison_3_control_room': {
        id: 'prison_3_control_room',
        text: "🖥️ 질서 유지 능력을 발휘해 보안 매뉴얼을 찾아내 통제실을 장악했습니다. 전자식 문을 열어 무기를 챙깁니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['권총', '무전기'], sanity: 10, skillsAdd: [S.LAW], statChanges: { int: 1 } }
    },
    'prison_3_control_room_dev': { 
        id: 'prison_3_control_room_dev', 
        text: "🖥️ 해킹을 통해 통제실 시스템에 진입했습니다. 교도소 내부 상황을 파악하고 장비를 확보했습니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }], 
        effect: { target: 'ALL', loot: ['권총', '무전기'], sanity: 10, statChanges: { int: 1 } } 
    },
    'prison_4_warden': {
        id: 'prison_4_warden',
        text: "🗝️ 마스터 키를 발견했지만, 무장한 죄수들이 몰려오고 있습니다.",
        next: [
            { id: 'prison_5_melee', weight: 0.0, choiceText: "선두에서 무력 제압 (근접 제압 필요)", req: { skill: '근접 제압' } },
            { id: 'prison_5_ambush', weight: 0.6, choiceText: "정면 승부" },
            { id: 'prison_5_hide', weight: 0.4 }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'prison_5_melee': {
        id: 'prison_5_melee',
        text: "✊ 근접 제압 스킬로 다가오는 죄수들의 리더를 단숨에 메치고 무기를 빼앗았습니다. 적들은 전의를 상실했습니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 15, kill: 2, skillsAdd: [S.MELEE], statChanges: { str: 1 } }
    },
    'prison_5_ambush': {
        id: 'prison_5_ambush',
        text: "⚔️ 죄수들의 리더와 부하들이 들이닥쳤습니다! 난전이 벌어집니다.",
        next: [{ id: 'prison_6_victory', weight: 0.5 }, { id: 'prison_6_captured', weight: 0.5 }],
        effect: { target: 'RANDOM_HALF', hp: -20, kill: 2, fatigue: 20, statChanges: { str: 1 } }
    },
    'prison_5_hide': {
        id: 'prison_5_hide',
        text: "🤫 적당한 곳에 숨어 그들이 지나가길 기다립니다. 긴장감이 흐릅니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -15, fatigue: 5, statChanges: { agi: 1 } }
    },
    'prison_6_victory': {
        id: 'prison_6_victory',
        text: "🩸 리더를 쓰러뜨리고 그들의 식량을 빼앗았습니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['고기', '권총'], statChanges: { str: 1 } }
    },
    'prison_6_captured': {
        id: 'prison_6_captured',
        text: "🔗 중과부적으로 제압당했습니다. 하지만 밤중에 좀비들이 들이닥쳐 혼란스러운 틈을 타 탈출했습니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'ALL', hp: -10, inventoryRemove: ['무전기'], statChanges: { cha: -1 } }
    },
    'prison_7_yard': {
        id: 'prison_7_yard',
        text: "🏟️ 운동장은 지옥도입니다. 혼란을 틈타 차량으로 달려야 합니다.",
        next: [
            { 
                id: 'prison_8_armored_car', 
                weight: 1.0, 
                choiceText: "좀비 사이를 가로질러 달리기 (민첩 기반)",
                dice: { threshold: 85, stat: 'agi', successId: 'prison_8_armored_car', failId: 'prison_8_lockdown', hpPenalty: -30 }
            }
        ],
        effect: { target: 'ALL', fatigue: 15 }
    },
    'prison_8_armored_car': {
        id: 'prison_8_armored_car',
        text: "🚐 판정 성공! 버스를 탈취해 교도소를 빠져나갑니다.",
        effect: { target: 'ALL', sanity: 15, fatigue: -20, statChanges: { con: 1, str: 1 } }
    },
    'prison_8_lockdown': {
        id: 'prison_8_lockdown',
        text: "🚨 판정 실패! 모든 문이 잠겼습니다! 고립되었습니다.",
        effect: { target: 'ALL', sanity: -30, fatigue: 20, statChanges: { con: -2 } }
    }
};
