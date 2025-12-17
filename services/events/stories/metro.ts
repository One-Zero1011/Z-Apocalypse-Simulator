
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
        text: "🔦 개찰구를 넘어 승강장으로 내려갑니다. 어디선가 물 떨어지는 소리와 쥐들이 움직이는 소리가 들립니다.",
        next: [
            { id: 'metro_2_tunnel', weight: 0.4, choiceText: "선로 진입 (빠름, 위험)" }, 
            { id: 'metro_2_utility', weight: 0.3, choiceText: "관리실 수색 (전력/자판기)" }, 
            { id: 'metro_2_mall', weight: 0.3, choiceText: "지하상가 수색 (물자/가스)" }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'metro_2_mall': {
        id: 'metro_2_mall',
        text: "🛍️ 지하철역과 연결된 대형 지하상가를 발견했습니다. 셔터가 내려진 가게들이 많지만, 물자가 남아있을 수 있습니다.",
        next: [
            { id: 'metro_3_fashion', weight: 0.5 },
            { id: 'metro_3_food', weight: 0.5 }
        ]
    },
    'metro_3_fashion': {
        id: 'metro_3_fashion',
        text: "👕 의류 매장에서 튼튼한 옷과 가방을 챙겨 방한 대책을 세우고 가방 용량을 늘렸습니다. 마네킹들이 사람처럼 보여 섬뜩합니다.",
        next: [{ id: 'metro_4_gas', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -2, fatigue: -5 }
    },
    'metro_3_food': {
        id: 'metro_3_food',
        text: "🍔 푸드코트를 뒤졌습니다. 썩은 냄새가 진동하지만, 밀봉된 음료수와 통조림을 꽤 발견했습니다.",
        next: [{ id: 'metro_4_gas', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '비타민'] }
    },
    'metro_4_gas': {
        id: 'metro_4_gas',
        text: "💨 상가 깊은 곳에서 가스 누출 경보기가 울리고 있습니다. 매캐한 냄새가 차오릅니다! 빨리 지상으로 나가는 환풍구를 찾아야 합니다.",
        next: [
            { id: 'metro_5_vent_exit', weight: 0.6 },
            { id: 'metro_5_gas_poison', weight: 0.4 }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'metro_5_vent_exit': {
        id: 'metro_5_vent_exit',
        text: "🌬️ 다행히 환풍구를 발견하고 사다리를 타고 지상으로 탈출했습니다. 맑은 공기가 이렇게 맛있는 줄 몰랐습니다.",
        effect: { target: 'ALL', fatigue: 10 }
    },
    'metro_5_gas_poison': {
        id: 'metro_5_gas_poison',
        text: "🤢 출구를 찾는 데 시간이 걸려 유독 가스를 마시고 말았습니다. 구토와 어지러움을 호소하며 겨우 기어 나왔습니다.",
        effect: { target: 'ALL', hp: -15, fatigue: 20 }
    },
    'metro_2_utility': {
        id: 'metro_2_utility',
        text: "⚡ '관계자 외 출입 금지' 표지판이 붙은 관리실 문을 엽니다. 비상 발전기를 가동해볼 수 있을 것 같습니다.",
        next: [
            { id: 'metro_3_power_on', weight: 0.5 },
            { id: 'metro_3_power_fail', weight: 0.5 }
        ]
    },
    'metro_3_power_on': {
        id: 'metro_3_power_on',
        text: "💡 발전기가 굉음을 내며 돌아갑니다! 승강장에 불이 켜지고 자판기가 작동합니다. 음료수를 얻었습니다.",
        next: [{ id: 'metro_4_nest', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['비타민', '비타민'] }
    },
    'metro_3_power_fail': {
        id: 'metro_3_power_fail',
        text: "🔊 발전기가 켜지는 대신 요란한 경보음이 울립니다! 소리를 듣고 좀비들이 몰려옵니다.",
        next: [{ id: 'metro_5_ambush', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -10 }
    },
    'metro_2_tunnel': {
        id: 'metro_2_tunnel',
        text: "🛤️ 끝없는 터널을 걷고 있습니다. 벽면에는 '그들이 소리를 듣는다'라는 낙서가 피로 쓰여있습니다.",
        next: [
            { id: 'metro_3_echo', weight: 0.5 },
            { id: 'metro_3_train', weight: 0.5, choiceText: "전동차 수색" }
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
        text: "🚃 멈춰선 전동차를 발견했습니다. 배터리가 방전된 것 같지만, 기술이 있다면 살릴 수 있을지도 모릅니다.",
        next: [
            { id: 'metro_3_train_repair', weight: 0.0, choiceText: "엔진 수리 및 가동 (정비공/기술자 필요)", req: { job: '정비공' } },
            { id: 'metro_3_train_repair_tech', weight: 0.0, choiceText: "엔진 수리 및 가동 (정비공/기술자 필요)", req: { job: '기술자(엔지니어)' } },
            { id: 'metro_3_train_rest', weight: 1.0, choiceText: "단순 휴식 및 수색" }
        ],
        effect: { target: 'ALL', fatigue: -5 }
    },
    'metro_3_train_repair': {
        id: 'metro_3_train_repair',
        text: "🔧 \"이 정도는 껌이지.\" 엔진을 수리하고 비상 전력을 연결했습니다. 전동차가 움직입니다! 편안하게 다음 역까지 이동합니다.",
        next: [{ id: 'metro_7_end', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: -20, sanity: 10 }
    },
    'metro_3_train_repair_tech': {
        id: 'metro_3_train_repair_tech',
        text: "🔧 복잡한 배선을 다시 연결하여 전동차를 움직이게 만들었습니다. 좀비 떼를 따돌리고 쾌속으로 이동합니다!",
        next: [{ id: 'metro_7_end', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: -20, sanity: 10 }
    },
    'metro_3_train_rest': {
        id: 'metro_3_train_rest',
        text: "🛋️ 객차 안에서 잠시 휴식을 취하며 물자를 수색했습니다. 초콜릿을 발견했지만, 차는 움직이지 않습니다. 걸어가야 합니다.",
        next: [{ id: 'metro_4_nest', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: -5, loot: ['초콜릿'] }
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
        text: "🩸 누군가 미끼가 되어 괴물들의 시선을 끄는 사이, 나머지가 필사적으로 도망쳤습니다. 미끼가 된 동료는 어둠 속으로 사라졌습니다.",
        next: [{ id: 'metro_7_end', weight: 1.0 }],
        effect: { target: 'RANDOM_1', status: 'Missing', sanity: -30 }
    },
    'metro_7_end': {
        id: 'metro_7_end',
        text: "🚉 마침내 지상의 빛이 보입니다. 다음 역은 군사 기지로 쓰였던 곳 같습니다. 버려진 보급품들이 쌓여있습니다.",
        effect: { target: 'ALL', sanity: 20, loot: ['통조림', '붕대', '항생제'] }
    }
};
