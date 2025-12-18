
import { StoryNode } from "../../../types";

const S = {
    SENSORY: { name: "절대 감각", description: "오감을 이용해 보이지 않는 위협을 먼저 감지합니다.", icon: "👂" },
    MECHANIC: { name: "기계 수리", description: "차량, 발전기 등 복잡한 기계 장치를 수리합니다.", icon: "⚙️" },
    AGILITY: { name: "기동력", description: "좀비 사이를 빠르게 빠져나가거나 도망칩니다.", icon: "🏃" },
    STEALTH: { name: "은밀 기동", description: "소리 없이 움직여 좀비의 시선을 피합니다.", icon: "🤫" }
};

export const METRO_NODES: Record<string, StoryNode> = {
    'metro_0_start': {
        id: 'metro_0_start',
        text: "🚇 도시의 지하철 입구가 입을 벌리고 있습니다. 지상은 좀비 떼로 가득하니, 지하 선로를 통해 이동하는 게 빠를지도 모릅니다.",
        next: [
            { id: 'metro_1_entrance', weight: 0.8 },
            { id: 'metro_avoid', weight: 0.2 }
        ]
    },
    'metro_avoid': {
        id: 'metro_avoid',
        text: "🚶 지하의 어둠은 믿을 수 없습니다. 시간이 걸리더라도 지상으로 우회합니다.",
        effect: { target: 'ALL', fatigue: 15, statChanges: { con: 1 } }
    },
    'metro_1_entrance': {
        id: 'metro_1_entrance',
        text: "🔦 개찰구를 넘어 승강장으로 내려갑니다. 어둠 속에서 기분 나쁜 소리가 들립니다.",
        next: [
            { id: 'metro_2_sensory', weight: 0.0, choiceText: "어둠 속 소리 집중 (절대 감각 필요)", req: { skill: '절대 감각' } },
            { id: 'metro_2_flashlight', weight: 0.5, choiceText: "손전등 켜고 수색" },
            { id: 'metro_2_quiet', weight: 0.5, choiceText: "조용히 선로 이동" }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'metro_2_sensory': {
        id: 'metro_2_sensory',
        text: "👂 절대 감각 스킬을 발휘해 터널 깊은 곳의 좀비 무리 위치를 정확히 파악했습니다. 안전한 우회로를 찾아냅니다.",
        next: [{ id: 'metro_3_train', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.SENSORY], statChanges: { int: 1 } }
    },
    'metro_2_flashlight': {
        id: 'metro_2_flashlight',
        text: "🔦 불빛을 비추자마자 숨어있던 감염자들이 달려듭니다! 좁은 승강장에서 난전이 벌어집니다.",
        next: [{ id: 'metro_3_train', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -20, fatigue: 10, statChanges: { str: 1 } }
    },
    'metro_2_quiet': {
        id: 'metro_2_quiet',
        text: "🤫 숨죽이고 이동했지만, 발밑의 유리 조각을 밟았습니다. 바스락 소리가 터널 전체에 울립니다.",
        next: [{ id: 'metro_3_train', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -10, fatigue: 5 }
    },
    
    'metro_3_train': {
        id: 'metro_3_train',
        text: "🚃 선로 중간에 멈춰 선 전동차를 발견했습니다. 문을 열고 내부를 통과하거나, 선로를 계속 따라갈 수 있습니다.",
        next: [
            { id: 'metro_3_mechanic', weight: 0.0, choiceText: "비상 수동 개폐 조작 (기계 수리 필요)", req: { skill: '기계 수리' } },
            { id: 'metro_3_force', weight: 0.5, choiceText: "강제로 문 열기" },
            { id: 'metro_3_track', weight: 0.5, choiceText: "전동차 우회 (선로 걷기)" }
        ]
    },
    'metro_3_mechanic': {
        id: 'metro_3_mechanic',
        text: "⚙️ 기계 수리 지식으로 비상 코크를 찾아내어 소음 없이 문을 열었습니다. 전동차 안은 안전한 쉼터가 됩니다.",
        next: [{ id: 'metro_4_station', weight: 1.0 }],
        effect: { target: 'RANDOM_1', fatigue: -15, skillsAdd: [S.MECHANIC], statChanges: { int: 1 } }
    },
    'metro_3_force': {
        id: 'metro_3_force',
        text: "💪 억지로 문을 열었습니다. 삐거덕거리는 소리에 주변 좀비들이 반응합니다. 서둘러 통과합니다.",
        next: [{ id: 'metro_4_station', weight: 1.0 }],
        effect: { target: 'RANDOM_1', fatigue: 10, statChanges: { str: 1 } }
    },
    'metro_3_track': {
        id: 'metro_3_track',
        text: "🏃 전동차 옆 좁은 틈으로 이동합니다. 벽에서 튀어나온 철근에 긁히고 옷이 찢어집니다.",
        next: [{ id: 'metro_4_station', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -5, fatigue: 15 }
    },

    'metro_4_station': {
        id: 'metro_4_station',
        text: "🚉 다음 역에 도착했습니다. 지상으로 나가는 출구는 무너져 있고, 환풍구만이 유일한 탈출구로 보입니다.",
        next: [
            { id: 'metro_3_agility', weight: 0.0, choiceText: "환풍구 등반 (기동력 필요)", req: { skill: '기동력' } },
            { id: 'metro_4_stealth', weight: 0.0, choiceText: "정비 통로 잠입 (은밀 기동 필요)", req: { skill: '은밀 기동' } },
            { 
                id: 'metro_5_climb', 
                weight: 1.0, 
                choiceText: "무너진 잔해 오르기 (민첩 기반)",
                dice: { threshold: 80, stat: 'agi', successId: 'metro_6_escape', failId: 'metro_6_fall', hpPenalty: -20 }
            }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'metro_3_agility': {
        id: 'metro_3_agility',
        text: "🏃 기동력 스킬을 발휘해 수직에 가까운 환풍구를 거침없이 기어올랐습니다. 지상의 신선한 공기가 느껴집니다.",
        next: [{ id: 'metro_6_escape', weight: 1.0 }],
        effect: { target: 'RANDOM_1', fatigue: 10, skillsAdd: [S.AGILITY], statChanges: { agi: 1 } }
    },
    'metro_4_stealth': {
        id: 'metro_4_stealth',
        text: "🤫 은밀 기동으로 좀비들이 가득한 정비 통로를 유령처럼 빠져나갔습니다. 아무도 다치지 않았습니다.",
        next: [{ id: 'metro_6_escape', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.STEALTH], statChanges: { agi: 1 } }
    },
    
    'metro_6_escape': {
        id: 'metro_6_escape',
        text: "🌤️ 마침내 지상으로 나왔습니다! 눈부신 햇살이 우리를 반깁니다.",
        effect: { target: 'ALL', sanity: 20, fatigue: 10 }
    },
    'metro_6_fall': {
        id: 'metro_6_fall',
        text: "💥 판정 실패! 잔해가 무너지며 미끄러졌습니다. 큰 소음과 함께 부상을 입고 간신히 기어 올라옵니다.",
        next: [{ id: 'metro_6_run', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -25, fatigue: 20, statChanges: { agi: -1 } }
    },
    'metro_6_run': {
        id: 'metro_6_run',
        text: "🏃‍♂️ 뒤에서 몰려오는 좀비 떼를 피해 죽을힘을 다해 달립니다. 몇몇 장비를 잃어버렸습니다.",
        effect: { target: 'RANDOM_1', inventoryRemove: ['통조림'], fatigue: 30, skillsRemove: ["은밀 기동"] }
    }
};
