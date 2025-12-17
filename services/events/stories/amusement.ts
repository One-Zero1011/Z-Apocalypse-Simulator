
import { StoryNode } from "../../../types";

export const AMUSEMENT_NODES: Record<string, StoryNode> = {
    // Depth 0: 시작
    'amusement_0_start': {
        id: 'amusement_0_start',
        text: "🎡 멀리서 관람차가 돌아가는 것이 보입니다. '환상의 나라' 놀이공원입니다. 기괴한 음악 소리가 끊겨서 들려옵니다.",
        next: [
            { id: 'amusement_1_ticket', weight: 1.0 }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },

    // Depth 1: 매표소
    'amusement_1_ticket': {
        id: 'amusement_1_ticket',
        text: "🎫 매표소 입구. 회전식 개찰구에 좀비들이 끼어있습니다. 담을 넘어 입장합니다. 바닥엔 팝콘 대신 탄피가 흩어져 있습니다.",
        next: [
            { id: 'amusement_2_haunted', weight: 0.5, choiceText: "유령의 집 (지름길, 공포)" },
            { id: 'amusement_2_arcade', weight: 0.5, choiceText: "오락실 (물자 파밍)" },
            { id: 'amusement_2_arcade_gamer', weight: 0.0, choiceText: "오락실 털기 (프로게이머/학생 필요)", req: { job: '프로게이머' } },
            { id: 'amusement_2_arcade_student_mid', weight: 0.0, choiceText: "오락실 털기 (프로게이머/학생 필요)", req: { job: '중학생' } },
            { id: 'amusement_2_arcade_student_high', weight: 0.0, choiceText: "오락실 털기 (프로게이머/학생 필요)", req: { job: '고등학생' } },
            { id: 'amusement_2_arcade_student_univ', weight: 0.0, choiceText: "오락실 털기 (프로게이머/학생 필요)", req: { job: '대학생' } },
            { id: 'amusement_2_arcade_student_elem', weight: 0.0, choiceText: "오락실 털기 (프로게이머/학생 필요)", req: { job: '초등학생' } }
        ]
    },

    // Depth 2: 어트랙션 선택 1
    'amusement_2_haunted': {
        id: 'amusement_2_haunted',
        text: "👻 '유령의 집'. 어둡지만 지름길입니다. 모형 귀신인 줄 알았던 것 중 진짜 좀비가 섞여 있어 깜짝 놀라 도망쳤습니다!",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -10, sanity: -15 }
    },
    'amusement_2_arcade': {
        id: 'amusement_2_arcade',
        text: "🕹️ 오락실. 먼지 쌓인 인형 뽑기 기계 안에 초콜릿 바와 건전지가 들어있습니다. 유리를 깨고 꺼냅니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['초콜릿', '초콜릿'] }
    },
    'amusement_2_arcade_gamer': {
        id: 'amusement_2_arcade_gamer',
        text: "🕹️ 오락실의 숨겨진 직원용 창고를 찾아냈습니다! 동체시력이 좋은 눈으로 구석구석 뒤져 귀한 간식과 상품을 싹쓸이합니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['초콜릿', '초콜릿', '비타민', '맥가이버 칼'], sanity: 10 }
    },
    'amusement_2_arcade_student_mid': { 
        id: 'amusement_2_arcade_student_mid',
        text: "🕹️ 오락실의 숨겨진 직원용 창고를 찾아냈습니다! 익숙한 지형이라 구석구석 뒤져 귀한 간식과 상품을 싹쓸이합니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['초콜릿', '초콜릿', '비타민', '맥가이버 칼'], sanity: 10 }
    },
    'amusement_2_arcade_student_high': {
        id: 'amusement_2_arcade_student_high',
        text: "🕹️ 오락실의 숨겨진 직원용 창고를 찾아냈습니다! 익숙한 지형이라 구석구석 뒤져 귀한 간식과 상품을 싹쓸이합니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['초콜릿', '초콜릿', '비타민', '맥가이버 칼'], sanity: 10 }
    },
    'amusement_2_arcade_student_univ': {
        id: 'amusement_2_arcade_student_univ',
        text: "🕹️ 오락실의 숨겨진 직원용 창고를 찾아냈습니다! 익숙한 지형이라 구석구석 뒤져 귀한 간식과 상품을 싹쓸이합니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['초콜릿', '초콜릿', '비타민', '맥가이버 칼'], sanity: 10 }
    },
    'amusement_2_arcade_student_elem': {
        id: 'amusement_2_arcade_student_elem',
        text: "🕹️ 오락실의 숨겨진 직원용 창고를 찾아냈습니다! 작은 몸집으로 구석구석 뒤져 귀한 간식과 상품을 싹쓸이합니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['초콜릿', '초콜릿', '비타민', '맥가이버 칼'], sanity: 10 }
    },

    // Depth 3: 롤러코스터
    'amusement_3_rollercoaster': {
        id: 'amusement_3_rollercoaster',
        text: "🎢 롤러코스터 레일 위를 걷습니다. 높은 곳이라 시야가 좋지만, 바람이 세고 발을 헛디딜 위험이 있습니다.",
        next: [
            { id: 'amusement_4_circus', weight: 0.7 },
            { id: 'amusement_4_fall', weight: 0.3 }
        ],
        effect: { target: 'ALL', fatigue: 10 }
    },
    'amusement_4_fall': {
        id: 'amusement_4_fall',
        text: "🦶 낡은 레일이 부서지며 미끄러졌습니다! 안전망 덕분에 목숨은 건졌지만 심한 타박상을 입었습니다.",
        next: [{ id: 'amusement_4_circus', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -15, fatigue: 10 }
    },

    // Depth 4: 서커스 천막
    'amusement_4_circus': {
        id: 'amusement_4_circus',
        text: "🎪 중앙 광장의 거대한 서커스 천막. 안에서 웃음소리 같은 괴성이 들립니다. 전력을 복구하려면 저곳을 지나 통제실로 가야 합니다.",
        next: [{ id: 'amusement_5_clowns', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -5 }
    },

    // Depth 5: 광대 군단
    'amusement_5_clowns': {
        id: 'amusement_5_clowns',
        text: "🤡 좀비가 된 광대들이 외발자전거를 타거나 풍선을 든 채 비틀거리며 다가옵니다. 공포 영화의 한 장면 같습니다.",
        next: [
            { id: 'amusement_6_fight', weight: 0.5 },
            { id: 'amusement_6_run', weight: 0.5 }
        ],
        effect: { target: 'ALL', sanity: -20 }
    },

    // Depth 6: 교전 및 전력 복구
    'amusement_6_fight': {
        id: 'amusement_6_fight',
        text: "🔫 광대들의 알록달록한 옷이 피로 물듭니다. 놈들을 모두 처치하고 통제실에 도착해 전원을 올립니다.",
        next: [{ id: 'amusement_7_mascot_boss', weight: 1.0 }],
        effect: { target: 'ALL', kill: 5, fatigue: 20 }
    },
    'amusement_6_run': {
        id: 'amusement_6_run',
        text: "🏃‍♂️ 놈들을 피해 미친 듯이 달려서 통제실로 들어가 문을 잠갔습니다. 밖에서 문을 긁는 소리가 들립니다. 서둘러 전원을 올립니다.",
        next: [{ id: 'amusement_7_mascot_boss', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 25 }
    },

    // Depth 7: 보스전 (마스코트)
    'amusement_7_mascot_boss': {
        id: 'amusement_7_mascot_boss',
        text: "🧸 [BOSS] 불이 켜지자, 놀이공원의 마스코트 '해피 베어' 인형 탈을 쓴 거대한 괴물이 통제실 유리를 깨고 들어옵니다! 인형 탈 안에는 무엇이 들어있을까요?",
        next: [
            { id: 'amusement_8_parade', weight: 0.6 },
            { id: 'amusement_8_trapped', weight: 0.4 }
        ],
        effect: { target: 'ALL', hp: -20, sanity: -10 }
    },

    // Depth 8: 엔딩
    'amusement_8_parade': {
        id: 'amusement_8_parade',
        text: "🎉 괴물을 쓰러뜨렸습니다. 전력이 복구되자 퍼레이드 카가 움직이기 시작합니다. 우리는 퍼레이드 카에 올라타 음악을 크게 틀고 좀비들을 유인하며 유유히 정문을 빠져나갑니다.",
        effect: { target: 'ALL', sanity: 30, loot: ['비타민', '통조림'] }
    },
    'amusement_8_trapped': {
        id: 'amusement_8_trapped',
        text: "🎡 괴물을 피해 관람차로 도망쳤지만, 전력이 다시 끊겨 공중 50미터 상공에 갇혀버렸습니다. 구조대가 오기만을 기다려야 합니다...",
        effect: { target: 'ALL', sanity: -20, hunger: -20, fatigue: 10 }
    }
};
