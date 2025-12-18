
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
        text: "🏫 덩굴로 뒤덮인 학교 정문이 보입니다. '생존자 환영'이라는 붉은 스프레이 낙서가 희미하게 남아있습니다. 과거엔 피난처였던 것 같습니다.",
        next: [
            { id: 'school_1_main_gate', weight: 0.5 },
            { id: 'school_1_back_fence', weight: 0.5 }
        ],
        effect: { target: 'ALL', sanity: -2 }
    },

    'school_1_main_gate': {
        id: 'school_1_main_gate',
        text: "🚪 정문은 바리케이드로 막혀있지만 틈이 보입니다. 억지로 몸을 비집고 들어갑니다. 녹슨 철사에 옷이 찢어집니다.",
        next: [
          { id: 'school_2_acrobatic', weight: 0.0, choiceText: "유연하게 장애물 통과 (유연한 몸놀림 필요)", req: { skill: '유연한 몸놀림' } },
          { id: 'school_2_hallway', weight: 1.0 }
        ],
        effect: { target: 'RANDOM_1', hp: -5, fatigue: 5, statChanges: { con: 1 } }
    },
    'school_2_acrobatic': {
        id: 'school_2_acrobatic',
        text: "🤸 유연한 몸놀림 스킬로 날카로운 철사들 사이를 상처 하나 없이 미끄러지듯 통과했습니다.",
        next: [{ id: 'school_2_hallway', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 5, skillsAdd: [S.ACROBATIC], statChanges: { agi: 1 } }
    },
    'school_1_back_fence': {
        id: 'school_1_back_fence',
        text: "🧱 학교 뒤편 담장을 넘습니다. 운동장에는 교복을 입은 채 배회하는 '학생들'이 가득합니다. 들키지 않게 조심해야 합니다.",
        next: [{ id: 'school_2_hallway', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 10, sanity: -5, statChanges: { agi: 1 } }
    },

    'school_2_hallway': {
        id: 'school_2_hallway',
        text: "복도는 어둡고 습합니다. 사물함들이 쏟아져 나와 길을 막고 있습니다. 어디를 먼저 수색할까요?",
        next: [
            { id: 'school_3_crafting', weight: 0.0, choiceText: "잡동사니로 도구 제작 (도구 제작 필요)", req: { skill: '도구 제작' } },
            { id: 'school_3_cafeteria', weight: 0.5, choiceText: "급식실 (식량)" }, 
            { id: 'school_3_library', weight: 0.5, choiceText: "도서관 (정보)" },
            { id: 'school_3_science_lab', weight: 0.0, choiceText: "과학실 (지식 전수 필요)", req: { skill: '지식 전수' } },
            { id: 'school_3_science_lab_res', weight: 0.0, choiceText: "과학실 (전략 수립 필요)", req: { skill: '전략 수립' } },
            { id: 'school_3_science_lab_univ', weight: 0.0, choiceText: "과학실 (부품 재활용 필요)", req: { skill: '부품 재활용' } }
        ]
    },
    'school_3_crafting': {
        id: 'school_3_crafting',
        text: "⚒️ 부서진 사물함 경첩과 의자 다리를 조합해 튼튼한 무기와 보관함을 만들어냈습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['맥가이버 칼', '붕대'], sanity: 10, skillsAdd: [S.CRAFTING], statChanges: { int: 1 } }
    },

    'school_3_cafeteria': {
        id: 'school_3_cafeteria',
        text: "🍽️ 급식실의 창고는 잠겨있습니다. 안에는 식량이 가득해 보입니다.",
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
        text: "🍽️ 판정 성공! 자물쇠를 부수고 들어가니 유통기한이 긴 통조림들이 남아있습니다!",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '통조림', '고기'], statChanges: { str: 1 }, skillsAdd: [S.ATHLETICS] }
    },
    'school_cafeteria_fail': {
        id: 'school_cafeteria_fail',
        text: "🤕 판정 실패! 문은 꿈쩍도 하지 않고 어깨만 삐끗했습니다. 소란을 듣고 좀비가 몰려와 서둘러 도망칩니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -15, fatigue: 10, statChanges: { str: -1 } }
    },
    'school_3_library': {
        id: 'school_3_library',
        text: "📚 도서관은 난장판이지만, 생존자들이 남긴 '주변 지역 안전 지도'를 발견했습니다. 귀중한 정보입니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 10, loot: ['지도'], skillsAdd: [S.TEACHING], statChanges: { int: 1 } }
    },
    'school_3_science_lab': {
        id: 'school_3_science_lab',
        text: "🧪 과학실의 약품들을 지식을 활용해 배합하여 '화염병'과 '소독약'을 제조했습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['항생제', '권총'], sanity: 5, statChanges: { int: 1 } }
    },
    'school_3_science_lab_res': { 
        id: 'school_3_science_lab_res',
        text: "🧪 전략적인 판단으로 쓸만한 화학 물질들을 찾아내어 호신용 무기를 만들었습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['항생제', '권총'], sanity: 5, statChanges: { int: 1 } }
    },
    'school_3_science_lab_univ': { 
        id: 'school_3_science_lab_univ',
        text: "🧪 잡동사니들을 재활용하여 응급 처치 도구와 소독제를 급조해냈습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['항생제', '붕대'], sanity: 5, statChanges: { int: 1 } }
    },

    'school_4_broadcast': {
        id: 'school_4_broadcast',
        text: "📢 방송실에서 기계적인 잡음이 들립니다. 3층으로 올라가 봅니다.",
        next: [
            { id: 'school_5_survivors', weight: 0.6 },
            { id: 'school_5_trap', weight: 0.4 }
        ],
        effect: { target: 'ALL', fatigue: 5 }
    },

    'school_5_survivors': {
        id: 'school_5_survivors',
        text: "👥 방송실에는 무장한 학생 생존자들이 있었습니다. 그들은 경계하며 무기를 겨눕니다.",
        next: [
            { id: 'school_6_pr', weight: 0.0, choiceText: "학생들에게 우호적 이미지 전달 (이미지 메이킹 필요)", req: { skill: '이미지 메이킹' } },
            { id: 'school_6_negotiate', weight: 0.5, choiceText: "대화 시도 (설득/협상)" },
            { id: 'school_6_fight', weight: 0.5, choiceText: "무력 제압 (전투/제압)" }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'school_6_pr': {
        id: 'school_6_pr',
        text: "😎 이미지 메이킹 기술로 우리가 아주 믿음직하고 정의로운 어른들이라는 인상을 심어주었습니다. 아이들은 울며 우리에게 매달립니다.",
        next: [{ id: 'school_8_bus_escape', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 30, loot: ['초콜릿'], skillsAdd: [S.PR], statChanges: { cha: 1 } }
    },
    'school_5_trap': {
        id: 'school_5_trap',
        text: "⚠️ 함정에 걸렸습니다! 종소리가 울리며 학교 전역의 좀비들이 방송실로 몰려옵니다!",
        next: [{ id: 'school_7_boss_gym', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, fatigue: 15, statChanges: { agi: -1 } }
    },

    'school_6_negotiate': {
        id: 'school_6_negotiate',
        text: "🤝 대화를 통해 오해를 풀었습니다. 학생들은 학교의 비밀 탈출로 열쇠를 건네줍니다.",
        next: [{ id: 'school_8_bus_escape', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 15, loot: ['초콜릿'], statChanges: { cha: 1 } }
    },
    'school_6_fight': {
        id: 'school_6_fight',
        text: "⚔️ 무력 충돌이 벌어졌습니다. 아이들을 제압했지만 모두의 정신적 충격이 큽니다.",
        next: [{ id: 'school_7_boss_gym', weight: 1.0 }],
        effect: { target: 'ALL', hp: -10, sanity: -20, kill: 2, statChanges: { cha: -1 } }
    },

    'school_7_boss_gym': {
        id: 'school_7_boss_gym',
        text: "🧟‍♂️ [BOSS] 거대한 '체육 선생님' 좀비가 체육관 정문을 막고 있습니다! 필사의 대결을 벌입니다.",
        next: [
            { id: 'school_8_bus_escape', weight: 0.6 },
            { id: 'school_8_fail', weight: 0.4 }
        ],
        effect: { target: 'ALL', hp: -20, fatigue: 20, statChanges: { str: 1 } }
    },

    'school_8_bus_escape': {
        id: 'school_8_bus_escape',
        text: "🚌 스쿨버스를 타고 학교를 빠져나갑니다. 안녕, 학교.",
        effect: { target: 'ALL', sanity: 20, fatigue: -10, loot: ['붕대', '비타민'], statChanges: { int: 1 } }
    },
    'school_8_fail': {
        id: 'school_8_fail',
        text: "🔒 탈출 실패. 우리는 교실 구석에 고립되었습니다. 긴 밤이 될 것 같습니다.",
        effect: { target: 'ALL', hp: -10, sanity: -30, fatigue: 20, statChanges: { con: -1 } }
    }
};
