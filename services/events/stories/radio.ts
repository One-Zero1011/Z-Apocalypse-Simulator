
import { StoryNode } from "../../../types";

export const RADIO_NODES: Record<string, StoryNode> = {
    'radio_0_start': {
        id: 'radio_0_start',
        text: "📡 지역 라디오 방송국 건물에서 조명탄이 쏘아 올려진 것을 목격했습니다. 아직 방송 장비가 작동하는 걸까요?",
        next: [{ id: 'radio_1_enter', weight: 1.0 }]
    },
    'radio_1_enter': {
        id: 'radio_1_enter',
        text: "🎙️ 방송국 내부는 의외로 깨끗합니다. 하지만 곳곳에 설치된 CCTV가 우리를 따라 움직이는 것 같습니다.",
        next: [
            { id: 'radio_2_voice', weight: 0.5 },
            { id: 'radio_2_trap', weight: 0.5 }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'radio_2_voice': {
        id: 'radio_2_voice',
        text: "🔊 스피커에서 목소리가 나옵니다. \"생존자 여러분, 환영합니다. 5층 스튜디오로 오시면 안전을 보장합니다.\"",
        next: [{ id: 'radio_3_climb', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 5 }
    },
    'radio_2_trap': {
        id: 'radio_2_trap',
        text: "🔒 철컹! 입구가 잠기고 스피커에서 웃음소리가 들립니다. \"오늘의 사냥감들이 입장했습니다!\"",
        next: [{ id: 'radio_3_climb', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -15 }
    },
    'radio_3_climb': {
        id: 'radio_3_climb',
        text: "🏃‍♂️ 계단을 오르는 동안 함정과 좀비들이 쏟아져 나옵니다. 누군가 우릴 시험하고 있습니다.",
        next: [{ id: 'radio_4_studio', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, fatigue: 15 }
    },
    'radio_4_studio': {
        id: 'radio_4_studio',
        text: "🎧 5층 스튜디오. 그곳엔 미쳐버린 DJ가 좀비들을 청중 삼아 혼자만의 방송을 하고 있었습니다.",
        next: [
            { id: 'radio_5_fight', weight: 0.7 },
            { id: 'radio_5_talk', weight: 0.3 }
        ]
    },
    'radio_5_fight': {
        id: 'radio_5_fight',
        text: "🔫 DJ는 우리를 보자마자 산탄총을 꺼내 들었습니다. 어쩔 수 없이 그를 제압했습니다.",
        effect: { target: 'RANDOM_1', hp: -20, loot: ['초콜릿', '비타민'] }
    },
    'radio_5_talk': {
        id: 'radio_5_talk',
        text: "🗣️ 우리가 청취자라고 말하며 비위를 맞추자, DJ는 기뻐하며 자신의 '출연료'를 나눠주었습니다.",
        effect: { target: 'ALL', sanity: 10, loot: ['통조림', '비타민'] }
    }
};
