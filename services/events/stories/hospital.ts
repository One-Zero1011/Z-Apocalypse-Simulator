
import { StoryNode } from "../../../types";

export const HOSPITAL_NODES: Record<string, StoryNode> = {
    'hospital_0_start': {
        id: 'hospital_0_start',
        text: "🏥 안개 속에서 거대한 종합병원 건물이 모습을 드러냈습니다. 전력이 끊긴 지 오래되어 보이지만, 약품이 남아있을지도 모릅니다.",
        next: [
            { id: 'hospital_1_lobby', weight: 0.7 },
            { id: 'hospital_ignore', weight: 0.3 }
        ],
        effect: { target: 'ALL', sanity: 5 }
    },
    'hospital_ignore': {
        id: 'hospital_ignore',
        text: "🚫 병원은 죽음의 덫입니다. 우리는 욕심을 버리고 안전하게 우회하기로 결정했습니다.",
        effect: { target: 'ALL', fatigue: 5 }
    },
    'hospital_1_lobby': {
        id: 'hospital_1_lobby',
        text: "🚪 로비에 들어서자 썩은 냄새가 코를 찌릅니다. 바닥에는 환자복을 입은 시체들이 즐비합니다. 어디로 이동할까요?",
        next: [
            { id: 'hospital_2a_stairs', weight: 0.5 }, // 힘으로 돌파
            { id: 'hospital_2b_vents', weight: 0.5 }   // 은신
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'hospital_2a_stairs': {
        id: 'hospital_2a_stairs',
        text: "⚔️ 비상계단을 오르던 중, 잠복해 있던 감염자 무리와 마주쳤습니다! 좁은 공간에서 난전이 벌어집니다.",
        next: [{ id: 'hospital_3_nurse_station', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -15, fatigue: 15 }
    },
    'hospital_2b_vents': {
        id: 'hospital_2b_vents',
        text: "💨 좁고 어두운 환기구를 통해 이동합니다. 먼지와 폐쇄공포증이 엄습하지만 좀비들을 피할 수 있었습니다.",
        next: [{ id: 'hospital_3_nurse_station', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: -10, fatigue: 10 }
    },
    'hospital_3_nurse_station': {
        id: 'hospital_3_nurse_station',
        text: "💉 3층 간호사 스테이션에 도착했습니다. 흩어진 차트들 사이에서 약간의 응급처치 도구를 발견했습니다.",
        next: [
            { id: 'hospital_4_surgery', weight: 0.6 },
            { id: 'hospital_4_trap', weight: 0.4 }
        ],
        effect: { target: 'ALL', loot: ['붕대'] }
    },
    'hospital_4_trap': {
        id: 'hospital_4_trap',
        text: "⚠️ 약품 창고로 가는 복도가 무너져 내렸습니다! 잔해를 치우는 동안 큰 소음이 발생하고 말았습니다.",
        next: [{ id: 'hospital_5_boss', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 20 }
    },
    'hospital_4_surgery': {
        id: 'hospital_4_surgery',
        text: "🔪 수술실을 지나가야 합니다. 수술대 위에 묶여 있던 무언가가 사슬을 끊으려 발버둥 치고 있습니다.",
        next: [{ id: 'hospital_5_boss', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -10 }
    },
    'hospital_5_boss': {
        id: 'hospital_5_boss',
        text: "🧟‍♂️ [BOSS] 약제실 앞에서 의사 가운을 입은 거대 변종 좀비, '더 서전(The Surgeon)'이 길을 막아섭니다!",
        next: [
            { id: 'hospital_6_win', weight: 0.6 },
            { id: 'hospital_6_run', weight: 0.4 }
        ],
        effect: { target: 'RANDOM_HALF', hp: -25, sanity: -10 }
    },
    'hospital_6_run': {
        id: 'hospital_6_run',
        text: "🏃‍♂️ 놈은 너무 강력했습니다! 우리는 눈앞의 약품을 포기하고 창문을 깨고 뛰어내려 탈출했습니다.",
        effect: { target: 'ALL', hp: -10, fatigue: 10 }
    },
    'hospital_6_win': {
        id: 'hospital_6_win',
        text: "💊 치열한 사투 끝에 변종을 쓰러뜨렸습니다! 약제실은 보물창고였습니다. 희귀한 약품들을 가방 가득 챙깁니다.",
        effect: { target: 'ALL', sanity: 30, loot: ['항생제', '항생제', '정신병약', '비타민'] }
    }
};
