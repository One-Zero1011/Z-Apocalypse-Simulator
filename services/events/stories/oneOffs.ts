
import { StoryNode } from "../../../types";

export const ONE_OFF_NODES: Record<string, StoryNode> = {
    // --- 날씨 및 환경 (Weather & Environment) ---
    'sunny_day': { 
        id: 'sunny_day', 
        text: "☀️ 구름 한 점 없는 맑은 날입니다. 젖은 옷을 말리고 장비를 정비하며 모처럼 평화로운 시간을 보냅니다.", 
        effect: { target: 'ALL', sanity: 5, fatigue: -5 } 
    },
    'foggy_day': { 
        id: 'foggy_day', 
        text: "🌫️ 한 치 앞도 보이지 않는 짙은 안개가 꼈습니다. 좀비의 기습에 대비해 신경을 곤두세우느라 피로가 쌓입니다.", 
        effect: { target: 'ALL', fatigue: 5 } 
    },
    'heavy_rain': { 
        id: 'heavy_rain', 
        text: "🌧️ 장대비가 쏟아져 내립니다. 몸은 젖었지만, 덕분에 좀비들의 냄새 추적을 따돌리고 샤워를 할 수 있었습니다.", 
        effect: { target: 'ALL', fatigue: -5, sanity: 5 } 
    },
    'heatwave': {
        id: 'heatwave',
        text: "🔥 숨이 턱턱 막히는 폭염이 찾아왔습니다. 가만히 있어도 땀이 흐르고 체력이 떨어집니다.",
        effect: { target: 'ALL', hp: -2, fatigue: 10 }
    },
    'thunderstorm': {
        id: 'thunderstorm',
        text: "⛈️ 천둥번개가 요란하게 치는 밤입니다. 굉음 때문에 좀비 소리를 듣지 못할까 봐 모두가 불안에 떱니다.",
        effect: { target: 'ALL', sanity: -5, fatigue: 5 }
    },
    'full_moon': {
        id: 'full_moon',
        text: "🌕 유난히 밝은 보름달이 떴습니다. 달빛 아래서 좀비들의 그림자가 길게 늘어져 기괴함을 자아냅니다.",
        effect: { target: 'ALL', sanity: -5 }
    },
    'starry_night': {
        id: 'starry_night',
        text: "🌠 밤하늘에 별똥별이 떨어집니다. 잠시나마 지옥 같은 현실을 잊고 소원을 빌어봅니다.",
        effect: { target: 'ALL', sanity: 10 }
    },

    // --- 분위기 및 상태 (Atmosphere & Status) ---
    'quiet_day': { 
        id: 'quiet_day', 
        text: "🤫 기묘할 정도로 고요한 하루입니다. 폭풍전야일까요? 아니면 잠시나마 신이 우리를 보살피는 걸까요?", 
        effect: { target: 'ALL', fatigue: -5 } 
    },
    'horde_pass': { 
        id: 'horde_pass', 
        text: "🧟‍♂️ 수천 마리의 좀비 떼가 이동하는 것을 목격했습니다. 숨죽여 그들이 지나가길 기다리느라 진이 빠집니다.", 
        effect: { target: 'ALL', fatigue: 15, sanity: -5 } 
    },
    'helicopter': { 
        id: 'helicopter', 
        text: "🚁 머리 위로 헬리콥터가 지나갔지만, 우리를 보지 못했습니다. 구조의 희망과 절망이 동시에 교차합니다.", 
        effect: { target: 'ALL', sanity: -5 } 
    },
    'nightmare_shared': {
        id: 'nightmare_shared',
        text: "😱 밤새 끔찍한 비명소리가 들려 모두가 잠을 설쳤습니다. 그것이 사람인지 짐승인지 알 수 없습니다.",
        effect: { target: 'ALL', sanity: -5, fatigue: 10 }
    },

    // --- 소소한 발견 (Minor Discoveries) ---
    'old_music': {
        id: 'old_music',
        text: "🎵 배터리가 남은 낡은 MP3 플레이어를 발견했습니다. 흘러나오는 옛 노래가 모두의 마음을 적십니다.",
        effect: { target: 'ALL', sanity: 10 }
    },
    'board_game': {
        id: 'board_game',
        text: "🎲 먼지 쌓인 보드게임을 발견했습니다. 잠시 생존 경쟁을 잊고 게임에 몰두하며 웃음을 되찾습니다.",
        effect: { target: 'ALL', sanity: 15, fatigue: -5 }
    },
    'stray_dog': {
        id: 'stray_dog',
        text: "🐕 떠돌이 개 한 마리가 캠프 근처를 서성입니다. 먹을 것을 나눠주자 꼬리를 흔들며 잠시 머물다 갑니다.",
        effect: { target: 'ALL', sanity: 5 }
    },
    'rat_swarm': {
        id: 'rat_swarm',
        text: "🐀 쥐 떼가 식량 창고를 습격했습니다! 급하게 쫓아냈지만 식량 일부가 오염되었습니다.",
        effect: { target: 'ALL', sanity: -5, inventoryRemove: ['통조림'] }
    },
    'abandoned_truck': {
        id: 'abandoned_truck',
        text: "🚚 갓길에 버려진 택배 트럭을 발견했습니다. 상자를 뜯어보니 쓸만한 물건들이 남아있습니다!",
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'pharmacy_ruin': {
        id: 'pharmacy_ruin',
        text: "💊 약국 폐허를 지나가다 구석에 떨어져 있던 구급상자를 발견했습니다.",
        effect: { target: 'ALL', loot: ['붕대', '항생제', '비타민'] }
    },
    'creepy_doll': {
        id: 'creepy_doll',
        text: "🧸 목이 잘린 곰 인형이 길 한복판에 놓여 있습니다. 누군가 우리를 지켜보는 것 같은 기분이 듭니다.",
        effect: { target: 'ALL', sanity: -5 }
    },
    'flower_field': {
        id: 'flower_field',
        text: "🌸 폐허 속에 기적처럼 피어난 꽃밭을 발견했습니다. 잠시 가던 길을 멈추고 향기를 맡습니다.",
        effect: { target: 'ALL', sanity: 5 }
    },
    'weapon_maintenance': {
        id: 'weapon_maintenance',
        text: "🔫 오늘은 이동을 멈추고 무기를 손질하고 장비를 점검하기로 했습니다. 준비된 상태가 마음을 편하게 합니다.",
        effect: { target: 'ALL', fatigue: 5, sanity: 5 }
    }
};
