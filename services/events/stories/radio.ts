
import { StoryNode } from "../../../types";

const S = {
    MUSIC: { name: "희망의 노래", description: "음악으로 동료들의 슬픔과 피로를 씻어냅니다.", icon: "🎵" },
    PR: { name: "이미지 메이킹", description: "자신의 평판을 관리해 신뢰를 얻습니다.", icon: "😎" },
    HACKING: { name: "시스템 해킹", description: "보안 네트워크에 침투해 정보를 빼내거나 제어권을 얻습니다.", icon: "💻" },
    LEADERSHIP: { name: "카리스마", description: "사람들을 이끌어 집단의 사기와 결속력을 높입니다.", icon: "🗣️" }
};

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
        effect: { target: 'ALL', sanity: 5, statChanges: { cha: 1 } }
    },
    'radio_2_trap': {
        id: 'radio_2_trap',
        text: "🔒 철컹! 입구가 잠기고 스피커에서 웃음소리가 들립니다. \"오늘의 사냥감들이 입장했습니다!\"",
        next: [
            { 
                id: 'radio_3_climb', 
                weight: 1.0, 
                choiceText: "급히 닫히는 셔터 밑으로 슬라이딩 (민첩 기반)",
                dice: { threshold: 85, stat: 'agi', successId: 'radio_3_climb', failId: 'radio_trap_fail', hpPenalty: -25 }
            }
        ],
        effect: { target: 'ALL', sanity: -15 }
    },
    'radio_trap_fail': {
        id: 'radio_trap_fail',
        text: "🩸 판정 실패! 셔터에 발이 걸려 넘어진 순간, 천장에서 화살 함정이 발사되었습니다! 신음소리를 내며 간신히 몸을 빼내어 계단으로 향합니다.",
        next: [{ id: 'radio_3_climb', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -30, fatigue: 10, statChanges: { agi: -1 } }
    },
    'radio_3_climb': {
        id: 'radio_3_climb',
        text: "🏃‍♂️ 계단을 오르는 동안 함정과 좀비들이 쏟아져 나옵니다. 누군가 우릴 시험하고 있습니다.",
        next: [{ id: 'radio_4_studio', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, fatigue: 15, statChanges: { con: 1 } }
    },
    'radio_4_studio': {
        id: 'radio_4_studio',
        text: "🎧 5층 스튜디오. 그곳엔 미쳐버린 DJ가 좀비들을 청중 삼아 혼자만의 방송을 하고 있었습니다. 방송 장비는 살아있습니다.",
        next: [
            { id: 'radio_5_fight', weight: 0.4 }, 
            { id: 'radio_5_broadcast', weight: 0.3 }, 
            { id: 'radio_5_talk', weight: 0.3 } 
        ]
    },
    'radio_5_broadcast': {
        id: 'radio_5_broadcast',
        text: "🎙️ DJ가 방심한 틈을 타 마이크를 잡았습니다. 어떤 방송을 내보낼까요?",
        next: [
            { id: 'radio_6_help', weight: 0.5, choiceText: "구조 요청 (일반)" },
            { id: 'radio_6_singer', weight: 0.0, choiceText: "희망의 노래로 위로 (희망의 노래 필요)", req: { skill: '희망의 노래' } },
            { id: 'radio_6_dev', weight: 0.0, choiceText: "군용 통신망 해킹 (시스템 해킹 필요)", req: { skill: '시스템 해킹' } },
            { id: 'radio_6_pr', weight: 0.0, choiceText: "생존자 선동 및 사기 고취 (이미지 메이킹 필요)", req: { skill: '이미지 메이킹' } },
            { id: 'radio_6_music', weight: 0.5, choiceText: "음악 송출 (좀비 유인/디펜스)" }
        ]
    },
    'radio_6_pr': {
        id: 'radio_6_pr',
        text: "😎 신뢰감 있는 목소리로 거짓 섞인 희망찬 미래를 발표했습니다. 도시 곳곳의 생존자들이 우리를 '구원자'로 믿기 시작했습니다.",
        next: [{ id: 'radio_9_rescue', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 40, affinity: 10, skillsAdd: [S.PR], statChanges: { cha: 1 } }
    },
    'radio_6_help': {
        id: 'radio_6_help',
        text: "🆘 \"여기에 생존자가 있다!\" 구조 요청을 반복 송출했습니다. 방송을 듣고 누군가 오겠지만, 그게 구조대일지 좀비일지는 모릅니다.",
        next: [{ id: 'radio_7_defense', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 10, statChanges: { int: 1 } }
    },
    'radio_6_singer': {
        id: 'radio_6_singer',
        text: "🎤 마이크를 잡고 호소력 짙은 노래를 불렀습니다. 거리에 울려 퍼지는 목소리에 좀비들의 움직임이 일시적으로 멈추고, 생존자들은 희망을 얻습니다.",
        next: [{ id: 'radio_9_rescue', weight: 1.0 }], 
        effect: { target: 'RANDOM_1', sanity: 30, fatigue: -10, skillsAdd: [S.MUSIC] }
    },
    'radio_6_dev': {
        id: 'radio_6_dev',
        text: "💻 방송 장비의 주파수를 조작해 암호화된 군용 채널에 접속했습니다. 정확한 좌표를 전송하여 구조 헬기를 불렀습니다!",
        next: [{ id: 'radio_9_rescue', weight: 1.0 }], 
        effect: { target: 'RANDOM_1', sanity: 20, skillsAdd: [S.HACKING], statChanges: { int: 1 } }
    },
    'radio_6_music': {
        id: 'radio_6_music',
        text: "🎵 경쾌한 음악을 틀어 도시 전체에 울려 퍼지게 했습니다. 좀비들이 미친 듯이 방송국으로 몰려옵니다! 파티의 시작입니다.",
        next: [{ id: 'radio_7_defense', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 20, fatigue: 10, statChanges: { str: 1 } } 
    },
    'radio_7_defense': {
        id: 'radio_7_defense',
        text: "🚪 쾅! 쾅! 방송실 문을 두드리는 소리가 들립니다. 방송을 듣고 몰려온 좀비 떼가 1층을 뚫고 올라오고 있습니다.",
        next: [
            { id: 'radio_8_leader', weight: 0.0, choiceText: "사투 독려 및 지휘 (카리스마 필요)", req: { skill: '카리스마' } },
            { id: 'radio_8_performance', weight: 0.0, choiceText: "화려한 몸짓으로 좀비 유인 (매력 발산 필요)", req: { skill: '매력 발산' } },
            { id: 'radio_8_roof', weight: 0.6, choiceText: "옥상으로 도주" },
            { id: 'radio_8_fight_back', weight: 0.4, choiceText: "계단 방어" }
        ],
        effect: { target: 'ALL', sanity: -10 }
    },
    'radio_8_leader': {
        id: 'radio_8_leader',
        text: "🗣️ 강력한 카리스마로 동료들을 지휘해 한 치의 오차도 없이 입구를 막아냈습니다. 피해 없이 좀비들을 따돌립니다.",
        next: [{ id: 'radio_9_rescue', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 15, skillsAdd: [S.LEADERSHIP], statChanges: { cha: 1 } }
    },
    'radio_8_performance': {
        id: 'radio_8_performance',
        text: "✨ 화려한 퍼포먼스로 좀비들의 어그로를 완벽히 끈 뒤, 동료들이 대피할 시간을 벌고 유유히 옥상으로 탈출했습니다.",
        next: [{ id: 'radio_9_rescue', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 10, fatigue: 15, statChanges: { agi: 1 } }
    },
    'radio_8_fight_back': {
        id: 'radio_8_fight_back',
        text: "🔫 좁은 계단 길목을 지키며 좀비들을 쓸어버립니다. 탄약이 바닥나가지만, 길을 뚫었습니다.",
        next: [{ id: 'radio_9_rescue', weight: 0.5 }, { id: 'radio_9_fail', weight: 0.5 }],
        effect: { target: 'RANDOM_HALF', hp: -20, kill: 5, fatigue: 20, statChanges: { str: 1 } }
    },
    'radio_8_roof': {
        id: 'radio_8_roof',
        text: "🚁 옥상 문을 박차고 나갔습니다. 하늘에서 프로펠러 소리가 들립니다! 구조 헬기일까요?",
        next: [
            { id: 'radio_9_rescue', weight: 0.5 },
            { id: 'radio_9_fail', weight: 0.5 }
        ],
        effect: { target: 'ALL', fatigue: 10 }
    },
    'radio_9_rescue': {
        id: 'radio_9_rescue',
        text: "🧗 사다리가 내려옵니다! 군용 헬기가 우리를 발견했습니다. 우리는 방송국 옥상에서 극적으로 구조되어 안전지대로 이송됩니다. (이벤트 종료)",
        effect: { target: 'ALL', sanity: 50, hp: 50, fatigue: -50, statChanges: { cha: 2 } } 
    },
    'radio_9_fail': {
        id: 'radio_9_fail',
        text: "🚁 헬기는 우리를 보지 못하고 지나가 버렸습니다. 혼란 속에서 몇 명의 동료가 대열을 이탈하여 실종되었습니다.",
        effect: { target: 'RANDOM_HALF', status: 'Missing', sanity: -30, fatigue: 20, statChanges: { con: -1 } }
    },
    'radio_5_fight': {
        id: 'radio_5_fight',
        text: "🔫 DJ는 우리를 보자마자 산탄총을 꺼내 들었습니다. 어쩔 수 없이 그를 제압했습니다.",
        effect: { target: 'RANDOM_1', hp: -20, loot: ['초콜릿', '비타민', '권총'], statChanges: { str: 1 } }
    },
    'radio_5_talk': {
        id: 'radio_5_talk',
        text: "🗣️ 우리가 청취자라고 말하며 비위를 맞주자, DJ는 기뻐하며 자신의 '출연료'를 나눠주었습니다.",
        effect: { target: 'ALL', sanity: 10, loot: ['통조림', '비타민', '안정제'], statChanges: { cha: 1 } }
    }
};
