
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
        text: "📡 지역 라디오 방송국 건물에서 조명탄이 쏘아 올려진 것을 목격했습니다. 아직 사람이 있다면 식량도 있을 것입니다.",
        next: [{ id: 'radio_1_enter', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'radio_1_enter': {
        id: 'radio_1_enter',
        text: "🎙️ 방송국 내부는 의외로 깨끗합니다. 로비 자판기에는 아직 과자와 통조림이 남아있습니다.",
        next: [
            { id: 'radio_2_voice', weight: 0.5 },
            { id: 'radio_2_trap', weight: 0.5 }
        ],
        effect: { target: 'ALL', sanity: -5, loot: ['초콜릿', '통조림'] }
    },
    'radio_2_voice': {
        id: 'radio_2_voice',
        text: "🔊 스피커에서 목소리가 나옵니다. \"환영합니다. 5층 스튜디오로 오시면 따뜻한 스튜를 대접하죠.\"",
        next: [{ id: 'radio_3_climb', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 5, statChanges: { cha: 1 }, loot: ['고기'] }
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
        text: "🩸 판정 실패! 셔터에 발이 걸려 넘어진 순간, 가방에 든 통조림 몇 개가 찌그러져 터져버렸습니다.",
        next: [{ id: 'radio_3_climb', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -30, fatigue: 10, statChanges: { agi: -1 }, inventoryRemove: ['통조림'] }
    },
    'radio_3_climb': {
        id: 'radio_3_climb',
        text: "🏃‍♂️ 계단을 오르는 동안 함정을 피하며 층층마다 흩어진 직원용 도시락을 챙겼습니다.",
        next: [{ id: 'radio_4_studio', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, fatigue: 15, statChanges: { con: 1 }, loot: ['고기', '통조림'] }
    },
    'radio_4_studio': {
        id: 'radio_4_studio',
        text: "🎧 5층 스튜디오. 그곳엔 미쳐버린 DJ가 있었지만, 그의 뒤편엔 산더미처럼 쌓인 통조림 박스들이 보입니다.",
        next: [
            { id: 'radio_5_fight', weight: 0.4 }, 
            { id: 'radio_5_broadcast', weight: 0.3 }, 
            { id: 'radio_5_talk', weight: 0.3 } 
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
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
        text: "😎 신뢰감 있는 목소리로 이야기하자, 주변의 다른 생존자들이 방송국으로 식량을 기부하러 왔습니다.",
        next: [{ id: 'radio_9_rescue', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 40, affinity: 10, skillsAdd: [S.PR], statChanges: { cha: 1 }, loot: ['통조림', '채소'] }
    },
    'radio_6_help': {
        id: 'radio_6_help',
        text: "🆘 구조 요청을 반복 송출했습니다. 얼마 후 옥상에 보급품 상자가 투하되었습니다!",
        next: [{ id: 'radio_7_defense', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 10, statChanges: { int: 1 }, loot: ['통조림', '통조림', '고기'] }
    },
    'radio_6_singer': {
        id: 'radio_6_singer',
        text: "🎤 마이크를 잡고 노래를 불렀습니다. 방송을 들은 누군가가 감동했다며 몰래 입구에 식량을 두고 갔습니다.",
        next: [{ id: 'radio_9_rescue', weight: 1.0 }], 
        effect: { target: 'RANDOM_1', sanity: 30, fatigue: -10, skillsAdd: [S.MUSIC], loot: ['초콜릿', '통조림'] }
    },
    'radio_6_dev': {
        id: 'radio_6_dev',
        text: "💻 군용 채널에 접속했습니다. 근처 보급창고의 비밀번호를 알아냈습니다!",
        next: [{ id: 'radio_9_rescue', weight: 1.0 }], 
        effect: { target: 'RANDOM_1', sanity: 20, skillsAdd: [S.HACKING], statChanges: { int: 1 }, loot: ['통조림', '통조림', '통조림'] }
    },
    'radio_6_music': {
        id: 'radio_6_music',
        text: "🎵 경쾌한 음악을 틀자 좀비들이 몰려옵니다. 정신없는 와중에 매점 창고를 털었습니다.",
        next: [{ id: 'radio_7_defense', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 20, fatigue: 10, statChanges: { str: 1 }, loot: ['통조림', '초콜릿'] } 
    },
    'radio_7_defense': {
        id: 'radio_7_defense',
        text: "🚪 좀비들이 올라오고 있습니다. 우리는 쌓여있던 통조림 박스로 문을 막았습니다.",
        next: [
            { id: 'radio_8_leader', weight: 0.0, choiceText: "사투 독려 및 지휘 (카리스마 필요)", req: { skill: '카리스마' } },
            { id: 'radio_8_performance', weight: 0.0, choiceText: "화려한 몸짓으로 좀비 유인 (매력 발산 필요)", req: { skill: '매력 발산' } },
            { id: 'radio_8_roof', weight: 0.6, choiceText: "옥상으로 도주" },
            { id: 'radio_8_fight_back', weight: 0.4, choiceText: "계단 방어" }
        ],
        effect: { target: 'ALL', sanity: -10, loot: ['통조림'] }
    },
    'radio_8_leader': {
        id: 'radio_8_leader',
        text: "🗣️ 완벽히 입구를 막아냈습니다. 여유롭게 남은 비상 식량을 모두 챙겨 탈출합니다.",
        next: [{ id: 'radio_9_rescue', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 15, skillsAdd: [S.LEADERSHIP], statChanges: { cha: 1 }, loot: ['통조림', '통조림', '고기'] }
    },
    'radio_8_performance': {
        id: 'radio_8_performance',
        text: "✨ 좀비들을 따돌린 뒤, 비어있는 탕비실을 털어 지상으로 탈출했습니다.",
        next: [{ id: 'radio_9_rescue', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 10, fatigue: 15, statChanges: { agi: 1 }, loot: ['통조림', '채소'] }
    },
    'radio_8_fight_back': {
        id: 'radio_8_fight_back',
        text: "🔫 좀비들을 쓸어버리며 내려갑니다. 도중에 떨어진 가방에서 고기를 건졌습니다.",
        next: [{ id: 'radio_9_rescue', weight: 0.5 }, { id: 'radio_9_fail', weight: 0.5 }],
        effect: { target: 'RANDOM_HALF', hp: -20, kill: 5, fatigue: 20, statChanges: { str: 1 }, loot: ['고기'] }
    },
    'radio_8_roof': {
        id: 'radio_8_roof',
        text: "🚁 옥상으로 향하며 마지막으로 캐비닛의 통조림을 챙겼습니다.",
        next: [
            { id: 'radio_9_rescue', weight: 0.5 },
            { id: 'radio_9_fail', weight: 0.5 }
        ],
        effect: { target: 'ALL', fatigue: 10, loot: ['통조림'] }
    },
    'radio_9_rescue': {
        id: 'radio_9_rescue',
        text: "🧗 군용 헬기가 우리를 발견했습니다! 헬기 안에는 따뜻한 식사가 기다리고 있습니다. (이벤트 종료)",
        effect: { target: 'ALL', sanity: 50, hp: 50, fatigue: -50, statChanges: { cha: 2 }, loot: ['통조림', '통조림', '채소'] } 
    },
    'radio_9_fail': {
        id: 'radio_9_fail',
        text: "🚁 헬기는 우리를 보지 못하고 지나가 버렸습니다. 혼란 속에서 가방을 놓쳐 식량을 잃어버렸습니다.",
        effect: { target: 'RANDOM_HALF', status: 'Missing', sanity: -30, fatigue: 20, statChanges: { con: -1 }, inventoryRemove: ['통조림'] }
    },
    'radio_5_fight': {
        id: 'radio_5_fight',
        text: "🔫 DJ를 제압했습니다. 그의 비밀 창고에서 신선한 고기와 통조림을 찾아냈습니다.",
        effect: { target: 'RANDOM_1', hp: -20, loot: ['초콜릿', '통조림', '고기', '권총'], statChanges: { str: 1 } }
    },
    'radio_5_talk': {
        id: 'radio_5_talk',
        text: "🗣️ DJ는 기뻐하며 자신의 '비상 식량'인 스테이크 고기를 나눠주었습니다.",
        effect: { target: 'ALL', sanity: 10, loot: ['통조림', '고기', '고기', '안정제'], statChanges: { cha: 1 } }
    }
};
