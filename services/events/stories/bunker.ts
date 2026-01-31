
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
        text: "📻 '프로젝트 노아: 최후의 피난처' 신호입니다. 엄청난 양의 장기 보존 식량이 보관되어 있을 것입니다.",
        next: [
            { id: 'bunker_1_mountain', weight: 0.6 },
            { id: 'bunker_1_river', weight: 0.4 }
        ],
        effect: { target: 'ALL', sanity: 5, statChanges: { int: 1 }, loot: ['통조림'] }
    },
    'bunker_1_mountain': {
        id: 'bunker_1_mountain',
        text: "🏔️ 산길 이동 중 버려진 등산객의 배낭에서 육포와 통조림을 찾아냈습니다.",
        next: [{ id: 'bunker_2_entrance', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 15, statChanges: { str: 1 }, loot: ['고기', '통조림'] }
    },
    'bunker_1_river': {
        id: 'bunker_1_river',
        text: "🌊 계곡 이동 중 신선한 민물고기를 몇 마리 잡았습니다.",
        next: [{ id: 'bunker_2_entrance', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -10, fatigue: 5, statChanges: { agi: 1 }, loot: ['고기', '고기'] }
    },
    'bunker_2_entrance': {
        id: 'bunker_2_entrance',
        text: "🚪 강철 문 옆 경비 초소에서 군용 비상 식량을 발견했습니다.",
        next: [
            { id: 'bunker_3_hack_expert', weight: 0.0, choiceText: "보안 해킹 (시스템 해킹 필요)", req: { skill: '시스템 해킹' } },
            { 
                id: 'bunker_3_hack_success', 
                weight: 0.0, 
                choiceText: "강제 우회로 생성 (지능 기반)",
                dice: { threshold: 80, stat: 'int', successId: 'bunker_3_hack_success', failId: 'bunker_3_hack_fail', sanityPenalty: -20 }
            },
            { id: 'bunker_3_vent', weight: 0.5, choiceText: "환풍구로 진입 (누구나 가능)" }
        ],
        effect: { target: 'ALL', loot: ['통조림', '통조림'] }
    },
    'bunker_3_hack_success': {
        id: 'bunker_3_hack_success',
        text: "💻 판정 성공! 정문이 열리자 자동 식료품 배급기가 수많은 통조림을 뱉어냅니다!",
        next: [{ id: 'bunker_4_lobby', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 15, statChanges: { int: 1 }, loot: ['통조림', '통조림', '통조림', '통조림'] }
    },
    'bunker_3_hack_fail': {
        id: 'bunker_3_hack_fail',
        text: "🚨 판정 실패! 경보음이 울리며 보안 로봇이 나타났습니다. 도망치는 중에 챙긴 식량을 흘렸습니다.",
        next: [{ id: 'bunker_3_vent', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -15, fatigue: 15, statChanges: { int: -1 }, inventoryRemove: ['통조림'] }
    },
    'bunker_3_hack_expert': {
        id: 'bunker_3_hack_expert',
        text: "💻 해킹 성공. 보안 해제로 인해 창고 잠금이 풀리며 식량이 쏟아져 나옵니다.",
        next: [{ id: 'bunker_4_lobby', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.HACKING], loot: ['통조림', '통조림', '통조림'] }
    },
    'bunker_3_vent': {
        id: 'bunker_3_vent',
        text: "💨 환풍구를 기어가며 구석에 낀 에너지 바(초콜릿)를 주워 먹었습니다.",
        next: [{ id: 'bunker_4_lobby', weight: 1.0 }],
        effect: { target: 'ALL', hp: -5, fatigue: 15, statChanges: { agi: 1 }, loot: ['초콜릿'] }
    },
    
    'bunker_4_lobby': {
        id: 'bunker_4_lobby',
        text: "🏛️ 벙커 로비의 자동 판매기는 멀쩡합니다! 수십 개의 통조림과 음료를 확보했습니다.",
        next: [{ id: 'bunker_6_corridor', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 5, loot: ['통조림', '통조림', '통조림', '통조림', '통조림'] }
    },

    'bunker_6_corridor': {
        id: 'bunker_6_corridor',
        text: "⚠️ 포탑이 겨누고 있습니다. 포탑 뒤쪽엔 보급용 상자가 가득 쌓여있습니다.",
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
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'bunker_7_secretary': {
        id: 'bunker_7_secretary',
        text: "📅 보안 정지 성공. 상자들을 열어보니 프리미엄 통조림과 고기들이 가득합니다.",
        next: [{ id: 'bunker_8_lab', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 10, statChanges: { int: 1 }, loot: ['통조림', '통조림', '고기', '고기'] }
    },
    'bunker_7_destroy': {
        id: 'bunker_7_destroy',
        text: "💥 파괴 성공. 포탑 주변의 부서진 상자에서 통조림을 건졌습니다.",
        next: [{ id: 'bunker_8_lab', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 5, statChanges: { str: 1 }, loot: ['통조림', '통조림'] }
    },
    'bunker_7_soldier': {
        id: 'bunker_7_soldier',
        text: "🚩 전술적 돌파 성공. 보급로를 장악하여 안전하게 식량을 옮깁니다.",
        next: [{ id: 'bunker_8_lab', weight: 1.0 }],
        effect: { target: 'RANDOM_1', fatigue: 10, skillsAdd: [S.COMMAND], loot: ['통조림', '통조림', '통조림', '고기'] }
    },
    'bunker_7_sprint_fail': {
        id: 'bunker_7_sprint_fail',
        text: "🩸 판정 실패! 총상을 입었습니다. 도망치는 와중에 식량 가방을 떨어뜨렸습니다.",
        next: [{ id: 'bunker_8_lab', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -35, fatigue: 25, sanity: -10, statChanges: { con: -1 }, inventoryRemove: ['통조림'] }
    },

    'bunker_8_lab': {
        id: 'bunker_8_lab',
        text: "🧪 실험실 안쪽 보존 구역에는 실험체용(?) 고탄력 영양제와 통조림이 보관되어 있습니다.",
        next: [
            { id: 'bunker_10_reactor', weight: 1.0, choiceText: "제어실로 이동" }
        ],
        effect: { target: 'ALL', sanity: -5, loot: ['항생제', '비타민', '통조림', '통조림'], statChanges: { int: 1 } }
    },

    'bunker_10_reactor': {
        id: 'bunker_10_reactor',
        text: "☢️ 원자로 과열! 성공하면 벙커의 자동 주방 시스템을 가동해 무한한 식량을 얻을 수 있습니다!",
        next: [
            { id: 'bunker_11_success_engineer', weight: 0.0, choiceText: "전문가 수리 (기계 수리 필요)", req: { skill: '기계 수리' } },
            { 
                id: 'bunker_11_success_random', 
                weight: 0.5, 
                choiceText: "복잡한 시스템 수동 제어 (지능 기반)",
                dice: { threshold: 90, stat: 'int', successId: 'bunker_11_success_random', failId: 'bunker_11_meltdown', sanityPenalty: -30, hpPenalty: -10 }
            }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'bunker_11_meltdown': {
        id: 'bunker_11_meltdown',
        text: "🚨 판정 실패! 폭발 직전입니다! 서둘러 창고의 통조림 몇 개만 챙겨서 탈출했습니다.",
        effect: { target: 'ALL', fatigue: 50, hp: -20, sanity: -30, loot: ['백신', '통조림', '통조림'], statChanges: { con: -1, int: -1 } }
    },
    'bunker_11_success_random': {
        id: 'bunker_11_success_random',
        text: "✅ 판정 성공! 벙커가 정상화되었습니다! 자동 주방에서 쏟아지는 따뜻한 요리와 엄청난 양의 보존식품을 차지했습니다.",
        effect: { target: 'ALL', sanity: 60, hp: 50, fatigue: -50, loot: ['백신', '안정제', '통조림', '통조림', '통조림', '통조림', '통조림', '고기', '고기', '채소', '채소'], statChanges: { int: 2 } }
    },
    'bunker_11_success_engineer': {
        id: 'bunker_11_success_engineer',
        text: "🔧 기계 복구 성공! 벙커의 모든 창고를 개방했습니다. 트럭 한 대 분량의 식량이 우리 것이 되었습니다.",
        effect: { target: 'RANDOM_1', sanity: 70, hp: 60, fatigue: -60, loot: ['백신', '안정제', '통조림', '통조림', '통조림', '통조림', '고기', '고기', '채소', '권총'], skillsAdd: [S.MECHANIC, S.ELECTRONICS], statChanges: { int: 1 } }
    }
};
