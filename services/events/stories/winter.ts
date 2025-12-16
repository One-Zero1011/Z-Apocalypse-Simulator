
import { StoryNode } from "../../../types";

export const WINTER_NODES: Record<string, StoryNode> = {
    'winter_0_start': {
        id: 'winter_0_start',
        text: "❄️ 갑작스러운 기이상후로 기온이 급강하합니다. 입김이 얼어붙고 하늘에서 잿빛 눈이 내리기 시작합니다.",
        next: [{ id: 'winter_1_blizzard', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 5 }
    },
    'winter_1_blizzard': {
        id: 'winter_1_blizzard',
        text: "🌨️ 화이트아웃. 눈보라가 시야를 가리고 체온을 앗아갑니다. 당장 피할 곳을 찾거나 불을 피워야 합니다.",
        next: [
            { id: 'winter_2_shelter', weight: 0.5 },
            { id: 'winter_2_exposure', weight: 0.5 }
        ],
        effect: { target: 'ALL', hp: -5, fatigue: 10 }
    },
    'winter_2_exposure': {
        id: 'winter_2_exposure',
        text: "🥶 마땅한 은신처를 찾지 못했습니다. 생존자들은 서로의 체온에 의지해 떨며 밤을 지새웁니다. 동상 환자가 발생했습니다.",
        next: [{ id: 'winter_3_wolves', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -15, fatigue: 20 }
    },
    'winter_2_shelter': {
        id: 'winter_2_shelter',
        text: "🔥 운 좋게 난로가 있는 산장을 발견했습니다! 땔감을 모아 불을 피우자 얼어붙은 몸이 녹아내립니다.",
        next: [{ id: 'winter_3_wolves', weight: 1.0 }],
        effect: { target: 'ALL', hp: 5, sanity: 10 }
    },
    'winter_3_wolves': {
        id: 'winter_3_wolves',
        text: "🐺 눈보라 속에서 굶주린 늑대 떼(혹은 늑대처럼 변한 좀비견들)가 습격해왔습니다!",
        next: [
            { id: 'winter_4_hunt_success', weight: 0.6 },
            { id: 'winter_4_hunt_fail', weight: 0.4 }
        ],
        effect: { target: 'ALL', fatigue: 10 }
    },
    'winter_4_hunt_fail': {
        id: 'winter_4_hunt_fail',
        text: "🩸 짐승들의 이빨에 물리고 뜯겼습니다. 우리는 식량 일부를 미끼로 던져주며 간신히 도망쳤습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -20, sanity: -10 }
    },
    'winter_4_hunt_success': {
        id: 'winter_4_hunt_success',
        text: "🍖 위기는 기회가 되었습니다. 습격해온 짐승들을 사냥하여 신선한 고기(식량)를 얻었습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '통조림'] }
    },
    'winter_5_thaw': {
        id: 'winter_5_thaw',
        text: "☀️ 며칠간의 혹한이 지나고 마침내 해가 떴습니다. 눈이 녹은 자리에서 얼어 죽은 다른 생존자의 배낭을 발견했습니다.",
        effect: { target: 'ALL', sanity: 5, loot: ['초콜릿', '비타민'] }
    }
};
