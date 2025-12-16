
import { StoryNode } from "../../../types";

export const SCHOOL_NODES: Record<string, StoryNode> = {
    // Depth 0: 시작
    'school_0_start': {
        id: 'school_0_start',
        text: "🏫 덩굴로 뒤덮인 학교 정문이 보입니다. '생존자 환영'이라는 붉은 스프레이 낙서가 희미하게 남아있습니다. 과거엔 피난처였던 것 같습니다.",
        next: [
            { id: 'school_1_main_gate', weight: 0.5 },
            { id: 'school_1_back_fence', weight: 0.5 }
        ],
        effect: { target: 'ALL', sanity: -2 }
    },

    // Depth 1: 진입
    'school_1_main_gate': {
        id: 'school_1_main_gate',
        text: "🚪 정문은 바리케이드로 막혀있지만 틈이 보입니다. 억지로 몸을 비집고 들어갑니다. 녹슨 철사에 옷이 찢어집니다.",
        next: [{ id: 'school_2_hallway', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -5, fatigue: 5 }
    },
    'school_1_back_fence': {
        id: 'school_1_back_fence',
        text: "🧱 학교 뒤편 담장을 넘습니다. 운동장에는 교복을 입은 채 배회하는 '학생들'이 가득합니다. 들키지 않게 조심해야 합니다.",
        next: [{ id: 'school_2_hallway', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 10, sanity: -5 }
    },

    // Depth 2: 복도 (분기점)
    'school_2_hallway': {
        id: 'school_2_hallway',
        text: "복도는 어둡고 습합니다. 사물함들이 쏟아져 나와 길을 막고 있습니다. 어디를 먼저 수색할까요?",
        next: [
            { id: 'school_3_cafeteria', weight: 0.5, choiceText: "급식실 (식량)" }, 
            { id: 'school_3_library', weight: 0.5, choiceText: "도서관 (정보)" },
            { id: 'school_3_science_lab', weight: 0.0, choiceText: "과학실 (약품/제조)", req: { job: '교사/교수' } },
            { id: 'school_3_science_lab_res', weight: 0.0, choiceText: "과학실 (약품/제조)", req: { job: '연구원' } }
        ]
    },

    // Depth 3: 자원 확보
    'school_3_cafeteria': {
        id: 'school_3_cafeteria',
        text: "🍽️ 급식실의 냄새는 끔찍하지만, 조리실 안쪽 창고는 잠겨있습니다. 자물쇠를 부수고 들어가니 유통기한이 긴 통조림들이 남아있습니다!",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '통조림', '고기'] }
    },
    'school_3_library': {
        id: 'school_3_library',
        text: "📚 도서관은 난장판이지만, 생존자들이 남긴 '주변 지역 안전 지도'를 발견했습니다. 귀중한 정보입니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 10, loot: ['지도'] }
    },
    'school_3_science_lab': {
        id: 'school_3_science_lab',
        text: "🧪 과학실에는 실험용 약품들이 남아있습니다. 전문 지식을 활용해 '화염병'과 '소독약'을 제조했습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['항생제', '권총'], sanity: 5 } // 권총은 화염병/무기 대용
    },
    'school_3_science_lab_res': { // Duplicate for Researcher check
        id: 'school_3_science_lab_res',
        text: "🧪 과학실에는 실험용 약품들이 남아있습니다. 전문 지식을 활용해 '화염병'과 '소독약'을 제조했습니다.",
        next: [{ id: 'school_4_broadcast', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['항생제', '권총'], sanity: 5 }
    },

    // Depth 4: 방송실의 신호
    'school_4_broadcast': {
        id: 'school_4_broadcast',
        text: "📢 삐- 삐- 방송실 스피커에서 기계적인 잡음이 들립니다. 방송실에 누군가, 혹은 무언가가 있는 걸까요? 3층으로 올라갑니다.",
        next: [
            { id: 'school_5_survivors', weight: 0.6 },
            { id: 'school_5_trap', weight: 0.4 }
        ],
        effect: { target: 'ALL', fatigue: 5 }
    },

    // Depth 5: 생존자 조우 / 함정
    'school_5_survivors': {
        id: 'school_5_survivors',
        text: "👥 방송실에는 앳된 얼굴의 학생들이 무장하고 경계 중이었습니다. 그들은 우리를 외부의 약탈자로 오해하고 활을 겨눕니다.",
        next: [
            { id: 'school_6_negotiate', weight: 0.5, choiceText: "대화 시도 (설득/협상)" },
            { id: 'school_6_fight', weight: 0.5, choiceText: "무력 제압 (전투/제압)" }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'school_5_trap': {
        id: 'school_5_trap',
        text: "⚠️ 방송실 문을 열자마자 천장에서 그물이 떨어집니다! 자동 녹음된 미끼 방송이었습니다. 종소리가 울리며 좀비들이 몰려옵니다!",
        next: [{ id: 'school_7_boss_gym', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, fatigue: 15 }
    },

    // Depth 6: 갈등 해결
    'school_6_negotiate': {
        id: 'school_6_negotiate',
        text: "🤝 무기를 버리고 대화를 시도합니다. 오해가 풀린 학생들은 학교의 비밀 통로 열쇠를 건네주며 탈출을 돕습니다.",
        next: [{ id: 'school_8_bus_escape', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 15, loot: ['초콜릿'] }
    },
    'school_6_fight': {
        id: 'school_6_fight',
        text: "⚔️ 대화가 통하지 않아 무력 충돌이 발생했습니다. 아이들을 제압했지만 마음이 무겁습니다. 소란 때문에 체육관 쪽이 시끄러워집니다.",
        next: [{ id: 'school_7_boss_gym', weight: 1.0 }],
        effect: { target: 'ALL', hp: -10, sanity: -20, kill: 2 }
    },

    // Depth 7: 보스전 (체육관)
    'school_7_boss_gym': {
        id: 'school_7_boss_gym',
        text: "🧟‍♂️ [BOSS] 탈출로인 체육관을 거대한 '체육 선생님' 좀비가 막고 있습니다. 놈은 뜀틀을 집어 던지며 달려듭니다!",
        next: [
            { id: 'school_8_bus_escape', weight: 0.6 },
            { id: 'school_8_fail', weight: 0.4 }
        ],
        effect: { target: 'ALL', hp: -20, fatigue: 20 }
    },

    // Depth 8: 엔딩
    'school_8_bus_escape': {
        id: 'school_8_bus_escape',
        text: "🚌 운동장에 세워진 스쿨버스의 시동이 걸렸습니다! 우리는 좀비 무리를 뚫고 학교를 빠져나갑니다. 안녕, 학교.",
        effect: { target: 'ALL', sanity: 20, fatigue: -10, loot: ['붕대', '비타민'] }
    },
    'school_8_fail': {
        id: 'school_8_fail',
        text: "🔒 탈출에 실패했습니다. 우리는 과학실 구석에 바리케이드를 치고 구조를 기다리며 밤을 보냅니다. 밖에서 긁는 소리가 멈추지 않습니다.",
        effect: { target: 'ALL', hp: -10, sanity: -30, fatigue: 20 }
    }
};
