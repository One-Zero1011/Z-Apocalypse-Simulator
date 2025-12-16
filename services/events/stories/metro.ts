
import { StoryNode } from "../../../types";

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
        effect: { target: 'ALL', fatigue: 15 }
    },
    'metro_1_entrance': {
        id: 'metro_1_entrance',
        text: "🔦 개찰구를 넘어 승강장으로 내려갑니다. 전등은 깨져있고, 발밑에는 물이 차박거립니다. 쥐들이 도망갑니다.",
        next: [{ id: 'metro_2_tunnel', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -5 }
    },
    'metro_2_tunnel': {
        id: 'metro_2_tunnel',
        text: "🛤️ 끝없는 터널을 걷고 있습니다. 벽면에는 '그들이 소리를 듣는다'라는 낙서가 피로 쓰여있습니다.",
        next: [
            { id: 'metro_3_echo', weight: 0.5 },
            { id: 'metro_3_train', weight: 0.5 }
        ],
        effect: { target: 'ALL', fatigue: 10 }
    },
    'metro_3_echo': {
        id: 'metro_3_echo',
        text: "👂 어디선가 기괴한 울음소리가 메아리칩니다. 소리의 근원지를 파악할 수 없어 공포감이 증폭됩니다.",
        next: [{ id: 'metro_4_nest', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -15 }
    },
    'metro_3_train': {
        id: 'metro_3_train',
        text: "🚃 멈춰선 전동차를 발견했습니다. 객차 안에서 잠시 휴식을 취하며 물자를 수색합니다.",
        next: [{ id: 'metro_4_nest', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: -10, loot: ['초콜릿'] }
    },
    'metro_4_nest': {
        id: 'metro_4_nest',
        text: "🕸️ 터널의 천장이 이상한 점액질로 뒤덮여 있습니다. 이곳은 평범한 좀비가 아닌, 변종 '크롤러'들의 둥지입니다!",
        next: [{ id: 'metro_5_ambush', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -10 }
    },
    'metro_5_ambush': {
        id: 'metro_5_ambush',
        text: "👾 사방에서 기어 나오는 괴물들에게 포위당했습니다! 탄약을 아끼지 말고 쏘아붙여야 합니다!",
        next: [
            { id: 'metro_6_breach', weight: 0.5 },
            { id: 'metro_6_sacrifice', weight: 0.5 }
        ],
        effect: { target: 'RANDOM_HALF', hp: -20, fatigue: 20 }
    },
    'metro_6_breach': {
        id: 'metro_6_breach',
        text: "💣 수류탄(혹은 폭발물)을 던져 벽을 뚫고 환풍구로 탈출했습니다. 폭발의 충격으로 모두가 이명에 시달립니다.",
        next: [{ id: 'metro_7_end', weight: 1.0 }],
        effect: { target: 'ALL', hp: -5 }
    },
    'metro_6_sacrifice': {
        id: 'metro_6_sacrifice',
        text: "🩸 누군가 미끼가 되어 괴물들의 시선을 끄는 사이, 나머지가 필사적으로 도망쳤습니다. 처절한 생존이었습니다.",
        next: [{ id: 'metro_7_end', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -40, sanity: -30 }
    },
    'metro_7_end': {
        id: 'metro_7_end',
        text: "🚉 마침내 지상의 빛이 보입니다. 다음 역은 군사 기지로 쓰였던 곳 같습니다. 버려진 보급품들이 쌓여있습니다.",
        effect: { target: 'ALL', sanity: 20, loot: ['통조림', '붕대', '항생제'] }
    }
};
