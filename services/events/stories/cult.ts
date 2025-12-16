
import { StoryNode } from "../../../types";

export const CULT_NODES: Record<string, StoryNode> = {
    'cult_0_start': {
        id: 'cult_0_start',
        text: "🕯️ 숲속 깊은 곳에서 기괴한 촛불 의식이 거행되는 것을 목격했습니다. '정화'라는 단어가 반복해서 들립니다.",
        next: [
            { id: 'cult_1_spy', weight: 0.5 },
            { id: 'cult_1_join', weight: 0.3 }, 
            { id: 'cult_1_run', weight: 0.2 }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    
    // 위장 잠입
    'cult_1_join': {
        id: 'cult_1_join',
        text: "🎭 그들의 로브를 훔쳐 입고 광신도 무리에 섞여 들어갑니다. 들키면 끝장입니다.",
        next: [
            { id: 'cult_2_ritual_pass', weight: 0.6 },
            { id: 'cult_2_ritual_fail', weight: 0.4 }
        ]
    },
    'cult_2_ritual_pass': {
        id: 'cult_2_ritual_pass',
        text: "🛐 그들의 광기 어린 의식을 흉내 내며 의심을 피했습니다. 교주가 다가와 '내부 성소'로 들어올 것을 권합니다.",
        next: [{ id: 'cult_3_inner', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -5 }
    },
    
    // 신규 확장: 내부 성소와 진실
    'cult_3_inner': {
        id: 'cult_3_inner',
        text: "⛩️ 안내받은 지하실에는 충격적인 광경이 펼쳐져 있습니다. 그들은 좀비를 '신 인류'라 부르며 숭배하고, 산 사람을 먹이로 주고 있었습니다!",
        next: [
            { id: 'cult_4_truth_fight', weight: 0.5 }, // 교주와 싸움
            { id: 'cult_4_truth_sabotage', weight: 0.5 } // 시설 파괴
        ],
        effect: { target: 'ALL', sanity: -20 }
    },
    'cult_4_truth_fight': {
        id: 'cult_4_truth_fight',
        text: "⚔️ \"미친 짓이야!\" 우리는 정체를 드러내고 교주에게 달려들었습니다. 호위무사들과의 난전이 벌어집니다.",
        next: [
            { id: 'cult_5_victory_boss', weight: 0.6 },
            { id: 'cult_5_defeat_captive', weight: 0.4 }
        ],
        effect: { target: 'RANDOM_HALF', hp: -30, fatigue: 20 }
    },
    'cult_4_truth_sabotage': {
        id: 'cult_4_truth_sabotage',
        text: "🔥 몰래 제단의 촛불을 기름통에 던졌습니다. 불길이 치솟자 갇혀있던 좀비들이 풀려나 신도들을 공격하기 시작합니다! 아비규환입니다.",
        next: [{ id: 'cult_6_escape_run', weight: 1.0 }],
        effect: { target: 'ALL', kill: 5, fatigue: 10 }
    },

    'cult_5_victory_boss': {
        id: 'cult_5_victory_boss',
        text: "🗡️ 교주를 쓰러뜨렸습니다. 광신도들은 리더를 잃고 흩어집니다. 교주의 방에서 귀중한 물자들을 챙깁니다.",
        effect: { target: 'ALL', sanity: 10, loot: ['권총', '안정제', '금괴(무쓸모)'] }
    },
    'cult_5_defeat_captive': {
        id: 'cult_5_defeat_captive',
        text: "⛓️ 중과부적으로 제압당했습니다. 우리는 감옥에 갇혔지만, 밤을 틈타 간신히 자물쇠를 따고 탈출했습니다. 가진 모든 것을 잃었습니다.",
        effect: { target: 'ALL', inventoryRemove: ['통조림', '붕대', '물', '무기', '지도'], hp: -10, sanity: -20 }
    },
    'cult_6_escape_run': {
        id: 'cult_6_escape_run',
        text: "🏃‍♂️ 불타는 사원을 뒤로하고 숲으로 도망쳤습니다. 뒤에서 들리는 비명소리가 밤새 우리를 괴롭힐 것입니다.",
        effect: { target: 'ALL', fatigue: 20, sanity: -10 }
    },

    'cult_2_ritual_fail': {
        id: 'cult_2_ritual_fail',
        text: "👁️ 교주가 우리의 눈을 들여다보더니 소리칩니다. \"이단자다!\" 사방에서 신도들이 덮쳐옵니다!",
        next: [{ id: 'cult_3_battle', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -10 }
    },

    'cult_1_run': {
        id: 'cult_1_run',
        text: "🏃 불길한 예감이 들어 뒤도 돌아보지 않고 도망쳤습니다. 등 뒤로 기분 나쁜 노랫소리가 따라옵니다.",
        effect: { target: 'ALL', fatigue: 10 }
    },
    'cult_1_spy': {
        id: 'cult_1_spy',
        text: "👀 덤불 뒤에 숨어 그들을 지켜봅니다. 그들은 멀쩡한 사람을 좀비 무리에 밀어 넣으려 하고 있습니다!",
        next: [
            { id: 'cult_2_save', weight: 0.4 },
            { id: 'cult_2_watch', weight: 0.6 }
        ],
        effect: { target: 'ALL', sanity: -10 }
    },
    'cult_2_save': {
        id: 'cult_2_save',
        text: "🔫 더 이상 볼 수 없어 총을 쏘며 난입했습니다! 광신도들이 무기를 들고 반격합니다.",
        next: [{ id: 'cult_3_battle', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 5 }
    },
    'cult_2_watch': {
        id: 'cult_2_watch',
        text: "😶 차마 끼어들 용기가 없어 희생을 지켜보기만 했습니다. 끔찍한 비명소리가 뇌리에서 떠나지 않습니다.",
        next: [{ id: 'cult_3_guilt', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -20 }
    },
    'cult_3_guilt': {
        id: 'cult_3_guilt',
        text: "🌫️ 죄책감에 시달리며 이동하던 중, 광신도 정찰조에게 발각되고 말았습니다!",
        next: [{ id: 'cult_3_battle', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 10 }
    },
    'cult_3_battle': {
        id: 'cult_3_battle',
        text: "⚔️ 미친 듯이 달려드는 광신도들과 혈투가 벌어졌습니다. 그들은 고통을 느끼지 않는 것 같습니다.",
        next: [
            { id: 'cult_4_victory', weight: 0.5 },
            { id: 'cult_4_retreat', weight: 0.5 }
        ],
        effect: { target: 'RANDOM_HALF', hp: -20, fatigue: 20 }
    },
    'cult_4_victory': {
        id: 'cult_4_victory',
        text: "🔥 적들을 모두 제압하고 그들의 제단을 불태웠습니다. 타지 않은 보급품 상자를 발견했습니다.",
        next: [{ id: 'cult_5_loot', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 10 }
    },
    'cult_4_retreat': {
        id: 'cult_4_retreat',
        text: "🩸 적들의 수가 너무 많아 동료를 부축하며 간신히 퇴각했습니다. 큰 상처만 남았습니다.",
        effect: { target: 'ALL', hp: -10, sanity: -10 }
    },
    'cult_5_loot': {
        id: 'cult_5_loot',
        text: "📦 그들이 모아둔 물자 속에서 귀중한 의약품을 다수 확보했습니다. 희생된 이들을 위해 잠시 묵념합니다.",
        effect: { target: 'ALL', loot: ['안정제', '항생제', '통조림'] }
    }
};
