
import { StoryNode } from "../../../types";

export const CULT_NODES: Record<string, StoryNode> = {
    'cult_0_start': {
        id: 'cult_0_start',
        text: "🕯️ 숲속 깊은 곳에서 기괴한 촛불 의식이 거행되는 것을 목격했습니다. '정화'라는 단어가 반복해서 들립니다.",
        next: [
            { id: 'cult_1_spy', weight: 0.6 },
            { id: 'cult_1_run', weight: 0.4 }
        ],
        effect: { target: 'ALL', sanity: -5 }
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
        effect: { target: 'ALL', loot: ['정신병약', '항생제', '통조림'] }
    }
};
