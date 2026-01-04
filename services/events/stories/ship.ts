
import { StoryNode } from "../../../types";

const S = {
    MECHANIC: { name: "기계 수리", description: "차량, 발전기 등 복잡한 기계 장치를 수리합니다.", icon: "⚙️" },
    AGILITY: { name: "기동력", description: "좀비 사이를 빠르게 빠져나가거나 도망칩니다.", icon: "🏃" },
    FISHING: { name: "그물 낚시", description: "물가에서 물고기를 잡아 단백질을 보충합니다.", icon: "🎣" },
    SCAVENGING: { name: "폐지 줍기", description: "남들이 지나친 쓰레기 더미에서 귀중품을 찾습니다.", icon: "📦" }
};

export const SHIP_NODES: Record<string, StoryNode> = {
    'ship_0_start': {
        id: 'ship_0_start',
        text: "🚢 안개 낀 항구에 거대한 크루즈선 '포세이돈 호'가 정박해 있습니다. 밧줄이 끊어질 듯 위태롭게 흔들립니다.",
        next: [
            { id: 'ship_1_board', weight: 0.7, choiceText: "승선 시도" },
            { id: 'ship_avoid', weight: 0.3, choiceText: "위험하므로 무시" }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'ship_avoid': {
        id: 'ship_avoid',
        text: "🌊 바다는 위험합니다. 우리는 육지에 머물기로 했습니다.",
        effect: { target: 'ALL', fatigue: 5 }
    },
    'ship_1_board': {
        id: 'ship_1_board',
        text: "⚓ 배에 오르는 사다리는 녹슬고 미끄럽습니다. 아래쪽 바다에는 부어오른 시체들이 둥둥 떠다닙니다.",
        next: [
            { 
                id: 'ship_2_deck', 
                weight: 1.0, 
                choiceText: "미끄러운 사다리 오르기 (민첩 기반)",
                dice: { threshold: 75, stat: 'agi', successId: 'ship_2_deck', failId: 'ship_1_fall', hpPenalty: -20 }
            }
        ]
    },
    'ship_1_fall': {
        id: 'ship_1_fall',
        text: "💦 풍덩! 발을 헛디뎌 차가운 바다에 빠졌습니다. 시체들이 다리를 잡고 끌어당깁니다! 간신히 기어 올라왔지만 물을 많이 마셨습니다.",
        next: [{ id: 'ship_2_deck', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -20, infection: 15, fatigue: 20, statChanges: { agi: -1 } }
    },
    'ship_2_deck': {
        id: 'ship_2_deck',
        text: "🛳️ 갑판은 아수라장입니다. 선원복을 입은 좀비들이 비틀거리며 다가옵니다. 어디로 향할까요?",
        next: [
            { id: 'ship_3_kitchen', weight: 0.5, choiceText: "식당칸 (식량)" },
            { id: 'ship_3_infirmary', weight: 0.5, choiceText: "의무실 (의약품)" },
            { id: 'ship_3_engine', weight: 0.0, choiceText: "기관실 (기계 수리 필요)", req: { skill: '기계 수리' } }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'ship_3_kitchen': {
        id: 'ship_3_kitchen',
        text: "🍽️ 호화로운 뷔페가 차려졌던 흔적이 있습니다. 썩은 음식 사이에서 통조림과 와인을 발견했습니다.",
        next: [{ id: 'ship_4_captain', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '통조림'], sanity: 5, statChanges: { con: 1 } }
    },
    'ship_3_infirmary': {
        id: 'ship_3_infirmary',
        text: "💉 선내 의무실입니다. 이곳은 마지막까지 환자들을 치료하던 곳 같습니다. 붕대와 약품을 챙깁니다.",
        next: [{ id: 'ship_4_captain', weight: 1.0 }],
        effect: { target: 'RANDOM_1', loot: ['붕대', '항생제', '백신'], sanity: -5, statChanges: { int: 1 } }
    },
    'ship_3_engine': {
        id: 'ship_3_engine',
        text: "🔧 기계 수리 기술로 보조 발전기를 가동했습니다! 선내에 불이 들어오고, 전자식 금고들이 열립니다.",
        next: [{ id: 'ship_4_captain', weight: 1.0 }],
        effect: { target: 'RANDOM_1', loot: ['권총', '지도', '무전기'], skillsAdd: [S.MECHANIC], sanity: 10 }
    },
    'ship_4_captain': {
        id: 'ship_4_captain',
        text: "👨‍✈️ 조타실에 도착했습니다. 거대하게 변이된 '선장' 좀비가 열쇠를 목에 건 채 우리를 노려봅니다.",
        next: [
            { 
                id: 'ship_5_win', 
                weight: 1.0, 
                choiceText: "선장과 결투 (힘 기반)",
                dice: { threshold: 85, stat: 'str', successId: 'ship_5_win', failId: 'ship_5_run', hpPenalty: -30 }
            },
            { id: 'ship_5_lure', weight: 0.0, choiceText: "소리로 유인하여 낙사 (기동력 필요)", req: { skill: '기동력' } }
        ]
    },
    'ship_5_lure': {
        id: 'ship_5_lure',
        text: "🏃 빠른 기동력으로 선장을 갑판 끝으로 유인한 뒤, 발을 걸어 바다로 떨어뜨렸습니다. 싸우지 않고 이겼습니다!",
        next: [{ id: 'ship_6_loot', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: 10, skillsAdd: [S.AGILITY] }
    },
    'ship_5_win': {
        id: 'ship_5_win',
        text: "⚔️ 치열한 사투 끝에 선장을 쓰러뜨렸습니다. 그의 목에서 마스터키를 획득합니다.",
        next: [{ id: 'ship_6_loot', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, kill: 5, statChanges: { str: 1 } }
    },
    'ship_5_run': {
        id: 'ship_5_run',
        text: "🩸 너무 강력합니다! 우리는 부상을 입고 배에서 뛰어내려 도망쳤습니다. 빈손입니다.",
        effect: { target: 'RANDOM_1', hp: -30, fatigue: 20, sanity: -10 }
    },
    'ship_6_loot': {
        id: 'ship_6_loot',
        text: "📦 선장실 금고를 열었습니다. 최고급 물자들이 쏟아져 나옵니다. 배를 거점으로 삼을 수는 없지만, 가방은 무겁습니다.",
        effect: { target: 'ALL', loot: ['권총', '백신', '통조림', '항생제', '안정제'], sanity: 20, statChanges: { cha: 1 } }
    }
};
