
import { StoryNode } from "../../../types";

const S = {
    HACKING: { name: "시스템 해킹", description: "보안 네트워크에 침투해 정보를 빼내거나 제어권을 얻습니다.", icon: "💻" },
    MECHANIC: { name: "기계 수리", description: "차량, 발전기 등 복잡한 기계 장치를 수리합니다.", icon: "⚙️" },
    ELECTRONICS: { name: "전자 공학", description: "회로를 조작해 잠긴 문을 열거나 전자기기를 개조합니다.", icon: "📟" },
    COMMAND: { name: "전술 지휘", description: "전투 시 동료들의 위치를 지정해 효율을 극대화합니다.", icon: "🚩" }
};

export const BUNKER_NODES: Record<string, StoryNode> = {
    'bunker_0_signal': {
        id: 'bunker_0_signal',
        text: "📻 버려진 군용 통신 차량에서 반복되는 좌표 신호를 포착했습니다. '프로젝트 노아: 최후의 피난처'. 좌표는 깊은 산속을 가리킵니다.",
        next: [
            { id: 'bunker_1_mountain', weight: 0.6 },
            { id: 'bunker_1_river', weight: 0.4 }
        ],
        effect: { target: 'ALL', sanity: 5, statChanges: { int: 1 } }
    },
    'bunker_1_mountain': {
        id: 'bunker_1_mountain',
        text: "🏔️ 산길을 통해 좌표로 이동합니다. 길은 험하고 가파르지만, 좀비들의 눈을 피하기엔 좋습니다.",
        next: [{ id: 'bunker_2_entrance', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 15, statChanges: { str: 1 } }
    },
    'bunker_1_river': {
        id: 'bunker_1_river',
        text: "🌊 계곡을 따라 이동합니다. 이동 속도는 빠르지만, 물가에 서식하는 변종 거머리들의 습격 위험이 있습니다.",
        next: [{ id: 'bunker_2_entrance', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, fatigue: 5, statChanges: { agi: 1 } }
    },
    'bunker_2_entrance': {
        id: 'bunker_2_entrance',
        text: "🚪 거대한 강철 문이 산비탈에 박혀있습니다. 옆에는 복잡한 전자 키패드가 깜빡입니다.",
        next: [
            { id: 'bunker_3_hack_expert', weight: 0.0, choiceText: "보안 해킹 (시스템 해킹 필요)", req: { skill: '시스템 해킹' } },
            { 
                id: 'bunker_3_hack_success', 
                weight: 0.0, 
                choiceText: "강제 우회로 생성 (지능 기반)",
                dice: { threshold: 80, stat: 'int', successId: 'bunker_3_hack_success', failId: 'bunker_3_hack_fail', sanityPenalty: -20 }
            },
            { id: 'bunker_3_vent', weight: 0.5, choiceText: "환풍구로 진입 (누구나 가능)" }
        ]
    },
    'bunker_3_hack_success': {
        id: 'bunker_3_hack_success',
        text: "💻 판정 성공! 띠리링 소리와 함께 암호가 풀렸습니다. 벙커 정문이 부드럽게 열리며 내부의 시원한 공기가 흘러나옵니다.",
        next: [{ id: 'bunker_4_lobby', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 15, statChanges: { int: 1 } }
    },
    'bunker_3_hack_fail': {
        id: 'bunker_3_hack_fail',
        text: "🚨 판정 실패! 삐-! 날카로운 경보음이 울립니다! 보안 시스템이 작동하여 주변의 모든 좀비를 불러모으기 시작합니다. 급하게 환풍구로 몸을 숨깁니다.",
        next: [{ id: 'bunker_3_vent', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -15, fatigue: 15, statChanges: { int: -1 } }
    },
    'bunker_3_hack_expert': {
        id: 'bunker_3_hack_expert',
        text: "💻 시스템 해킹에 성공했습니다! 정문이 부드럽게 열립니다. 체력을 아끼고 안전하게 진입합니다.",
        next: [{ id: 'bunker_4_lobby', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.HACKING] }
    },
    'bunker_3_vent': {
        id: 'bunker_3_vent',
        text: "💨 비좁은 환풍구를 통해 기어 들어갑니다. 옷이 찢어지고 찰과상을 입었지만 내부에 진입했습니다.",
        next: [{ id: 'bunker_4_lobby', weight: 1.0 }],
        effect: { target: 'ALL', hp: -5, fatigue: 15, statChanges: { agi: 1 } }
    },
    
    'bunker_4_lobby': {
        id: 'bunker_4_lobby',
        text: "🏛️ 벙커 로비는 웅장합니다. 오랫동안 방치되었지만 전력은 살아있습니다. 지하 2층으로 내려가는 엘리베이터는 멈췄고, 비상 계단이 보입니다.",
        next: [{ id: 'bunker_6_corridor', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 5 }
    },

    'bunker_6_corridor': {
        id: 'bunker_6_corridor',
        text: "⚠️ 지하 2층으로 내려가는 복도에서 '자동 방어 포탑'이 작동을 시작했습니다! 붉은 레이저가 우리를 겨눕니다. 어떻게 할까요?",
        next: [
            { id: 'bunker_7_secretary', weight: 0.0, choiceText: "매뉴얼 보좌 및 차단 (보좌술 필요)", req: { skill: '보좌술' } },
            { id: 'bunker_7_destroy', weight: 0.4, choiceText: "사격으로 파괴 (권총 필요)", req: { item: '권총' } },
            { id: 'bunker_7_soldier', weight: 0.0, choiceText: "전술적 파괴 (전술 지휘 필요)", req: { skill: '전술 지휘' } },
            { 
                id: 'bunker_8_lab', 
                weight: 0.6, 
                choiceText: "포탑 사이를 전력 질주 (민첩 기반)",
                dice: { threshold: 85, stat: 'agi', successId: 'bunker_8_lab', failId: 'bunker_7_sprint_fail', hpPenalty: -30 }
            }
        ]
    },
    'bunker_7_secretary': {
        id: 'bunker_7_secretary',
        text: "📅 보좌술 스킬을 발휘해 벽에 붙은 보안 매뉴얼을 빠르게 해독하고 긴급 정지 코드를 입력했습니다. 포탑이 작동을 멈춥니다.",
        next: [{ id: 'bunker_8_lab', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 10, statChanges: { int: 1 } }
    },
    'bunker_7_destroy': {
        id: 'bunker_7_destroy',
        text: "💥 권총으로 포탑의 센서를 정확히 사격하여 무력화시켰습니다. 탄약은 썼지만 다친 사람은 없습니다.",
        next: [{ id: 'bunker_8_lab', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 5, statChanges: { str: 1 } }
    },
    'bunker_7_soldier': {
        id: 'bunker_7_soldier',
        text: "🚩 전술 지휘를 통해 동료들을 사각지대로 이동시키고, 포탑의 탄약이 떨어질 때까지 유인하여 안전하게 통과했습니다.",
        next: [{ id: 'bunker_8_lab', weight: 1.0 }],
        effect: { target: 'RANDOM_1', fatigue: 10, skillsAdd: [S.COMMAND] }
    },
    'bunker_7_sprint_fail': {
        id: 'bunker_7_sprint_fail',
        text: "🩸 판정 실패! 탕! 탕! 자동 포탑의 사격을 피하지 못했습니다. 누군가 다리에 총상을 입고 비명을 지릅니다. 기어서 실험실로 들어갑니다.",
        next: [{ id: 'bunker_8_lab', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -35, fatigue: 25, sanity: -10, statChanges: { con: -1 } }
    },

    'bunker_8_lab': {
        id: 'bunker_8_lab',
        text: "🧪 지하 실험실에 도착했습니다. 이곳에서 바이러스 연구가 진행되었던 것 같습니다. 배양관 안에 끔찍한 괴생명체가 잠들어 있습니다.",
        next: [
            { id: 'bunker_10_reactor', weight: 1.0, choiceText: "제어실로 이동" }
        ],
        effect: { target: 'ALL', sanity: -5, loot: ['항생제', '비타민'], statChanges: { int: 1 } }
    },

    'bunker_10_reactor': {
        id: 'bunker_10_reactor',
        text: "☢️ 최하층 제어실에 도달했습니다. 원자로가 과열되어 폭발 직전입니다! 냉각 시스템을 재부팅해야 합니다.",
        next: [
            { id: 'bunker_11_success_engineer', weight: 0.0, choiceText: "전문가 수리 (기계 수리 필요)", req: { skill: '기계 수리' } },
            { 
                id: 'bunker_11_success_random', 
                weight: 0.5, 
                choiceText: "복잡한 시스템 수동 제어 (지능 기반)",
                dice: { threshold: 90, stat: 'int', successId: 'bunker_11_success_random', failId: 'bunker_11_meltdown', sanityPenalty: -30, hpPenalty: -10 }
            }
        ]
    },
    'bunker_11_meltdown': {
        id: 'bunker_11_meltdown',
        text: "🚨 판정 실패! 원자로가 임계치를 넘었습니다! 굉음과 함께 열기가 뿜어져 나옵니다. 우리는 폭발하기 직전의 벙커를 필사적으로 탈출했습니다. 소중한 물자들을 모두 잃어버렸습니다.",
        effect: { target: 'ALL', fatigue: 50, hp: -20, sanity: -30, loot: ['백신'], statChanges: { con: -1, int: -1 } }
    },
    'bunker_11_success_random': {
        id: 'bunker_11_success_random',
        text: "✅ 판정 성공! 기적적으로 냉각 시스템이 정상화되었습니다! 원자로가 식으며 벙커 전체에 비상 전력이 들어옵니다. 이곳을 우리의 새로운 안전 기지로 삼습니다.",
        effect: { target: 'ALL', sanity: 60, hp: 50, fatigue: -50, loot: ['백신', '안정제', '통조림', '무전기'], statChanges: { int: 2 } }
    },
    'bunker_11_success_engineer': {
        id: 'bunker_11_success_engineer',
        text: "🔧 기계 수리 실력으로 과열된 원자로를 식히고 전력을 복구했습니다. 완벽한 안전 가옥을 확보했습니다!",
        effect: { target: 'RANDOM_1', sanity: 70, hp: 60, fatigue: -60, loot: ['백신', '안정제', '통조림', '무전기', '권총'], skillsAdd: [S.MECHANIC, S.ELECTRONICS], statChanges: { int: 1 } }
    }
};
