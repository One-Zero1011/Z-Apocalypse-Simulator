
import { StoryNode } from "../../../types";

export const WINTER_NODES: Record<string, StoryNode> = {
    'winter_0_start': {
        id: 'winter_0_start',
        text: "❄️ 갑작스러운 이상기후로 기온이 급강하합니다. 입김이 얼어붙고 하늘에서 잿빛 눈이 내리기 시작합니다.",
        next: [{ id: 'winter_1_blizzard', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 5 }
    },
    'winter_1_blizzard': {
        id: 'winter_1_blizzard',
        text: "🌨️ 화이트아웃. 눈보라가 시야를 가립니다. 이동 경로를 선택해야 합니다.",
        next: [
            { id: 'winter_2_shelter', weight: 0.4 }, // 산장 찾기 (기존)
            { id: 'winter_2_cave', weight: 0.3 },    // 동굴 (신규)
            { id: 'winter_2_lake', weight: 0.3 }     // 얼어붙은 호수 (신규 - 지름길)
        ],
        effect: { target: 'ALL', hp: -5, fatigue: 5 }
    },
    
    // 신규 분기: 얼어붙은 호수 (위험하지만 빠름)
    'winter_2_lake': {
        id: 'winter_2_lake',
        text: "🧊 시간을 단축하기 위해 꽁꽁 언 호수를 가로지르기로 합니다. 얼음이 쩍쩍 갈라지는 소리가 들립니다.",
        next: [
            { id: 'winter_3_lake_safe', weight: 0.6 },
            { id: 'winter_3_lake_crack', weight: 0.4 }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'winter_3_lake_safe': {
        id: 'winter_3_lake_safe',
        text: "🏃‍♂️ 숨을 죽이고 신속하게 이동하여 호수를 건넜습니다. 이동 시간을 크게 단축했습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: -15 }
    },
    'winter_3_lake_crack': {
        id: 'winter_3_lake_crack',
        text: "💧 콰직! 얼음이 깨지며 누군가 차가운 물속에 빠졌습니다! 건져내긴 했지만 저체온증이 심각합니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -30, fatigue: 20 }
    },

    // 신규 분기: 동굴 (곰)
    'winter_2_cave': {
        id: 'winter_2_cave',
        text: "🕳️ 바람을 피하기 위해 작은 동굴로 들어갔습니다. 하지만 그곳엔 겨울잠을 자던 거대한 곰(혹은 좀비 곰)이 있었습니다!",
        next: [
            { id: 'winter_3_bear_fight', weight: 0.5 },
            { id: 'winter_3_bear_sneak', weight: 0.5 }
        ]
    },
    'winter_3_bear_fight': {
        id: 'winter_3_bear_fight',
        text: "⚔️ 곰이 깨어났습니다! 좁은 동굴 안에서 사생결단을 냅니다. 고기와 가죽을 얻을 수 있을까요?",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -20, loot: ['고기', '고기'] }
    },
    'winter_3_bear_sneak': {
        id: 'winter_3_bear_sneak',
        text: "🤫 곰이 깊이 잠든 것을 확인하고, 동굴 구석에서 조용히 밤을 보냈습니다. 따뜻하고 안전했습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'ALL', hp: 10, fatigue: -20 }
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
        text: "🐺 눈보라 속에서 굶주린 늑대 떼가 습격해왔습니다!",
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
        effect: { target: 'ALL', loot: ['고기', '고기'] }
    },
    'winter_5_thaw': {
        id: 'winter_5_thaw',
        text: "☀️ 며칠간의 혹한이 지나고 마침내 해가 떴습니다. 눈이 녹은 자리에서 얼어 죽은 다른 생존자의 배낭을 발견했습니다.",
        effect: { target: 'ALL', sanity: 5, loot: ['초콜릿', '비타민'] }
    }
};
