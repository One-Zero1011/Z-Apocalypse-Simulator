
import { StoryNode } from "../../../types";

const S = {
    TEACHING: { name: "지식 전수", description: "자신이 가진 기술을 동료들에게 효율적으로 가르칩니다.", icon: "🎓" },
    MELEE: { name: "근접 제압", description: "근거리 무기나 맨손으로 좀비를 효율적으로 무력화합니다.", icon: "✊" },
    ART: { name: "예술적 통찰", description: "창의적인 생각으로 예상치 못한 해결책을 제시합니다.", icon: "🎨" }
};

export const MUSEUM_NODES: Record<string, StoryNode> = {
    'museum_0_start': {
        id: 'museum_0_start',
        text: "🏛️ 웅장한 국립 박물관입니다. 입구는 무너져 있지만 내부는 견고해 보입니다. 고대 무기 전시관이 있다는 안내판이 보입니다.",
        next: [
            { id: 'museum_1_enter', weight: 1.0 }
        ],
        effect: { target: 'ALL', sanity: 5 }
    },
    'museum_1_enter': {
        id: 'museum_1_enter',
        text: "🏺 로비에는 깨진 도자기와 미라들이 널려 있습니다. 그런데 미라 중 일부가 움직이는 것 같습니다!",
        next: [
            { id: 'museum_2_history', weight: 0.0, choiceText: "역사적 구조 파악 (지식 전수 필요)", req: { skill: '지식 전수' } },
            { id: 'museum_2_fight', weight: 0.6, choiceText: "전시물(무기) 확보 후 전투" },
            { id: 'museum_2_hide', weight: 0.4, choiceText: "전시관 사이로 은신" }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'museum_2_history': {
        id: 'museum_2_history',
        text: "🎓 박물관의 비밀 통로와 직원용 엘리베이터 위치를 기억해냈습니다. 좀비들을 피해 무기고(수장고)로 직행합니다.",
        next: [{ id: 'museum_3_storage', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.TEACHING], statChanges: { int: 1 } }
    },
    'museum_2_fight': {
        id: 'museum_2_fight',
        text: "⚔️ 유리 진열장을 깨고 고대 검과 창을 꺼내 들었습니다. 날은 무디지만 둔기로는 쓸만합니다!",
        next: [{ id: 'museum_3_knight', weight: 1.0 }],
        effect: { target: 'ALL', kill: 3, fatigue: 15, statChanges: { str: 1 } }
    },
    'museum_2_hide': {
        id: 'museum_2_hide',
        text: "🤫 공룡 화석 뒤에 숨어 좀비들이 지나가길 기다립니다. 거대한 티라노사우루스 뼈가 삐걱거립니다.",
        next: [{ id: 'museum_3_knight', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 5, sanity: -5 }
    },
    'museum_3_knight': {
        id: 'museum_3_knight',
        text: "🛡️ 중세관에 들어서자, 전신 판금 갑옷을 입은 거대한 좀비가 길을 막습니다. 일반적인 공격은 통하지 않습니다!",
        next: [
            { id: 'museum_4_melee', weight: 0.0, choiceText: "갑옷 틈새 공략 (근접 제압 필요)", req: { skill: '근접 제압' } },
            { 
                id: 'museum_4_topple', 
                weight: 1.0, 
                choiceText: "협동하여 넘어뜨리기 (힘 기반)",
                dice: { threshold: 80, stat: 'str', successId: 'museum_4_win', failId: 'museum_4_fail', hpPenalty: -30 }
            }
        ]
    },
    'museum_4_melee': {
        id: 'museum_4_melee',
        text: "✊ 근접 제압 기술로 육중한 공격을 흘려내고, 투구 틈새와 관절 부위를 정확히 가격하여 무력화시켰습니다.",
        next: [{ id: 'museum_5_treasure', weight: 1.0 }],
        effect: { target: 'RANDOM_1', kill: 5, skillsAdd: [S.MELEE], statChanges: { str: 1, agi: 1 } }
    },
    'museum_4_win': {
        id: 'museum_4_win',
        text: "🛡️ 쿵! 육중한 금속음과 함께 기사 좀비가 쓰러졌습니다. 우리는 놈이 일어나기 전에 투구를 벗기고 마무리했습니다.",
        next: [{ id: 'museum_5_treasure', weight: 1.0 }],
        effect: { target: 'ALL', kill: 2, fatigue: 20, statChanges: { str: 1 } }
    },
    'museum_4_fail': {
        id: 'museum_4_fail',
        text: "🩸 놈의 철퇴에 맞아 방어선이 무너졌습니다. 갑옷 입은 괴물은 지치지도 않고 쫓아옵니다. 우리는 2층에서 뛰어내려 탈출했습니다.",
        effect: { target: 'RANDOM_HALF', hp: -35, fatigue: 30, statChanges: { con: -1 } }
    },
    'museum_3_storage': {
        id: 'museum_3_storage',
        text: "📦 수장고에는 보존 처리가 잘 된 식량과, 놀랍게도 한국 전쟁 당시의 구호 물품들이 남아있었습니다.",
        next: [{ id: 'museum_5_treasure', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '붕대'], sanity: 5 }
    },
    'museum_5_treasure': {
        id: 'museum_5_treasure',
        text: "👑 박물관의 깊은 곳에서 왕의 옥좌를 발견했습니다. 잠시나마 왕이 된 기분으로 휴식을 취하며, 예술품들이 주는 위안을 얻습니다.",
        effect: { target: 'ALL', sanity: 30, fatigue: -20, skillsAdd: [S.ART], statChanges: { cha: 1 } }
    }
};
