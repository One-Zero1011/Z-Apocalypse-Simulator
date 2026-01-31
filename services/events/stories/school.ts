
import { StoryNode } from "../../../types";

const S = {
    TEACHING: { name: "지식 전수", description: "자신이 가진 기술을 동료들에게 효율적으로 가르칩니다.", icon: "🎓" },
    ATHLETICS: { name: "폭발적 근력", description: "무거운 짐을 들거나 문을 부수는 등 힘을 씁니다.", icon: "💪" },
    ACROBATIC: { name: "유연한 몸놀림", description: "좁은 길을 통과하거나 추락 시 피해를 줄입니다.", icon: "🤸" },
    CRAFTING: { name: "도구 제작", description: "잡동사니로 칼, 횃불 등 필요한 도구를 뚝딱 만듭니다.", icon: "⚒️" },
    PR: { name: "이미지 메이킹", description: "자신의 평판을 관리해 신뢰를 얻습니다.", icon: "😎" }
};

export const SCHOOL_NODES: Record<string, StoryNode> = {
    'school_0_start': {
        id: 'school_0_start',
        text: "🏫 학교 정문입니다. '급식 지원 중'이라는 희망적인 낙서가 보입니다. 급식실 창고가 목표입니다.",
        next: [
            { id: 'school_1_main_gate', weight: 0.5 },
            { id: 'school_1_back_fence', weight: 0.5 }
        ],
        effect: { target: 'ALL', sanity: -2, loot: ['통조림'] }
    },

    'school_1_main_gate': {
        id: 'school_1_main_gate',
        text: "🚪 정문을 비집고 들어갑니다. 매점 자판기가 부서져 있고 과자들이 흩어져 있습니다.",
        next: [
          { id: 'school_2_acrobatic', weight: 0.0, choiceText: "유연하게 장애물 통과 (유연한 몸놀림 필요)", req: { skill: '유연한 몸놀림' } },
          { id: 'school_2_hallway', weight: 1.0 }
        ],
        effect: { target: 'RANDOM_1', hp: -5, fatigue: 5, statChanges: { con: 1 }, loot: ['초콜릿', '통조림'] }
    },
    'school_2_acrobatic': {
        id: 'school_2_acrobatic',
        text: "🤸 유연하게 통과했습니다. 도중에 떨어진 학생의 배낭에서 간식거리를 한가득 챙겼습니다.",
        next: [{ id: 'school_2_hallway', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 5, skillsAdd: [S.ACROBATIC], statChanges: { agi: 1 }, loot: ['초콜릿', '초콜릿', '통조림'] }
    },
    'school_1_back_fence': {
        id: 'school_1_back_fence',
        text: "🧱 담장을 넘습니다. 운동장 구석 텃밭에 누군가 가꾸던 채소들이 아직 자라고 있습니다.",
        next: [{ id: 'school_2_hallway', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 10, sanity: -5, statChanges: { agi: 1 }, loot: ['채소', '채소'] }
    },

    'school_2_hallway': {
        id: 'school_2_hallway',
        text: "복도 사물함에서 학생들의 도시락 가방을 뒤집니다. 어디를 먼저 수색할까요?",
        next: [
            { id: 'school_3_crafting', weight: 0.0, choiceText: "잡동사니로 도구 제작 (도구 제작 필요)", req: { skill: '도구 제작' } },
            { id: 'school_3_cafeteria', weight: 0.5, choiceText: "급식실 (식량 창고)" }, 
            { id: 'school_3_library', weight: 0.5, choiceText: "도서관 (정보)" },
            { id: 'school_3_science_lab', weight: 0.0, choiceText: "과학실 (지식 전수 필요)", req: { skill: '지식 전수' } },
            { id: 'school_3_science_lab_res', weight: 0.0, choiceText: "과학실 (전략 수립 필요)", req: { skill: '전략 수립' } },
            { id: 'school_3_science_lab_univ', weight: 0.0, choiceText: "과학실 (부품 재활용 필요)", req: { skill: '부품 재활용' } }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'school_3_crafting': {
        id: 'school_3_crafting',
        text: "⚒️ 부서진 집기를 이용해 튼튼한 보관함을 만들고, 식재료를 안전하게 패킹했습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'RANDOM_1', loot: ['맥가이버 칼', '통조림', '통조림'], sanity: 10, skillsAdd: [S.CRAFTING], statChanges: { int: 1 } }
    },

    'school_3_cafeteria': {
        id: 'school_3_cafeteria',
        text: "🍽️ 급식실 창고입니다! 대량의 쌀과 통조림, 냉동 고기들이 보입니다.",
        next: [
            { 
                id: 'school_cafeteria_success', 
                weight: 1.0, 
                choiceText: "잠긴 문 어깨로 밀치기 (힘 기반)",
                dice: { threshold: 75, stat: 'str', successId: 'school_cafeteria_success', failId: 'school_cafeteria_fail', hpPenalty: -10 }
            }
        ]
    },
    'school_cafeteria_success': {
        id: 'school_cafeteria_success',
        text: "🍽️ 판정 성공! 창고를 완전히 털었습니다. 당분간 굶주릴 일은 없을 것 같습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'RANDOM_1', loot: ['통조림', '통조림', '통조림', '통조림', '고기', '고기', '채소'], statChanges: { str: 1 }, skillsAdd: [S.ATHLETICS] }
    },
    'school_cafeteria_fail': {
        id: 'school_cafeteria_fail',
        text: "🤕 판정 실패! 문은 열리지 않았고, 소리를 듣고 몰려온 좀비들을 피하다가 가방에 든 식량마저 흘렸습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -15, fatigue: 10, statChanges: { str: -1 }, inventoryRemove: ['통조림'] }
    },
    'school_3_library': {
        id: 'school_3_library',
        text: "📚 사서실 구석에서 사서 선생님이 숨겨둔 비상 식량(통조림)과 지도를 발견했습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 10, loot: ['지도', '통조림', '통조림'], skillsAdd: [S.TEACHING], statChanges: { int: 1 } }
    },
    'school_3_science_lab': {
        id: 'school_3_science_lab',
        text: "🧪 과학실 냉장고 안에서 신선도가 유지된 시약(?) 대신 교수용 간식과 소독약을 챙겼습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['항생제', '권총', '통조림'], sanity: 5, statChanges: { int: 1 } }
    },
    'school_3_science_lab_res': { 
        id: 'school_3_science_lab_res',
        text: "🧪 전략적으로 실험실 내부의 비상용 건조 식품들을 찾아냈습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['항생제', '통조림', '통조림'], sanity: 5, statChanges: { int: 1 } }
    },
    'school_3_science_lab_univ': { 
        id: 'school_3_science_lab_univ',
        text: "🧪 유통기한이 지난 약품들 사이에서 멀쩡한 비타민과 통조림을 선별해냈습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['항생제', '비타민', '통조림'], sanity: 5, statChanges: { int: 1 } }
    },

    'school_4_broadcast': {
        id: 'school_4_broadcast',
        text: "📢 방송실로 향하는 복도. 매점 아주머니가 남기고 간 박스에서 소중한 식량을 발견합니다.",
        next: [
            { id: 'school_5_survivors', weight: 0.6 },
            { id: 'school_5_trap', weight: 0.4 }
        ],
        effect: { target: 'ALL', fatigue: 5, loot: ['통조림', '초콜릿'] }
    },

    'school_5_survivors': {
        id: 'school_5_survivors',
        text: "👥 학생 생존자들이 가진 가방에는 과자와 사탕이 가득해 보입니다.",
        next: [
            { id: 'school_6_pr', weight: 0.0, choiceText: "학생들에게 우호적 이미지 전달 (이미지 메이킹 필요)", req: { skill: '이미지 메이킹' } },
            { id: 'school_6_negotiate', weight: 0.5, choiceText: "대화 시도 (설득/협상)" },
            { id: 'school_6_fight', weight: 0.5, choiceText: "무력 제압 (전투/제압)" }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'school_6_pr': {
        id: 'school_6_pr',
        text: "😎 아이들은 우리를 믿고 자신들이 아껴둔 모든 과자와 통조림을 내주었습니다.",
        next: [{ id: 'school_8_bus_escape', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 30, loot: ['초콜릿', '초콜릿', '통조림', '통조림'], skillsAdd: [S.PR], statChanges: { cha: 1 } }
    },
    'school_5_trap': {
        id: 'school_5_trap',
        text: "⚠️ 함정에 걸렸습니다! 도망치는 와중에 가방이 찢어져 식량을 조금 잃었습니다.",
        next: [{ id: 'school_7_boss_gym', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, fatigue: 15, statChanges: { agi: -1 }, inventoryRemove: ['통조림'] }
    },

    'school_6_negotiate': {
        id: 'school_6_negotiate',
        text: "🤝 대화 성공. 학생들은 학교 급식실 열쇠와 함께 숨겨둔 통조림 배낭을 건네줍니다.",
        next: [{ id: 'school_8_bus_escape', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 15, loot: ['초콜릿', '통조림', '통조림', '고기'], statChanges: { cha: 1 } }
    },
    'school_6_fight': {
        id: 'school_6_fight',
        text: "⚔️ 학생들을 제압하고 그들이 가진 모든 식량을 빼앗았습니다. 가방은 무겁지만 마음은 무겁습니다.",
        next: [{ id: 'school_7_boss_gym', weight: 1.0 }],
        effect: { target: 'ALL', hp: -10, sanity: -20, kill: 2, statChanges: { cha: -1 }, loot: ['통조림', '통조림', '초콜릿', '고기'] }
    },

    'school_7_boss_gym': {
        id: 'school_7_boss_gym',
        text: "🧟‍♂️ [BOSS] 체육 선생님을 쓰러뜨리고 그가 지키고 있던 체육 창고 안의 비상 보급 상자를 엽니다.",
        next: [
            { id: 'school_8_bus_escape', weight: 0.6 },
            { id: 'school_8_fail', weight: 0.4 }
        ],
        effect: { target: 'ALL', hp: -20, fatigue: 20, statChanges: { str: 1 }, loot: ['통조림', '고기'] }
    },

    'school_8_bus_escape': {
        id: 'school_8_bus_escape',
        text: "🚌 스쿨버스 가득 식량과 자재를 싣고 학교를 빠져나갑니다. 풍족한 수확입니다.",
        effect: { target: 'ALL', sanity: 20, fatigue: -10, loot: ['붕대', '비타민', '통조림', '통조림', '고기', '채소'], statChanges: { int: 1 } }
    },
    'school_8_fail': {
        id: 'school_8_fail',
        text: "🔒 탈출 실패. 배고픔과 공포 속에 밤을 지새웁니다.",
        effect: { target: 'ALL', hp: -10, sanity: -30, fatigue: 20, statChanges: { con: -1 } }
    }
};
