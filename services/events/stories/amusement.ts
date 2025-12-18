
import { StoryNode } from "../../../types";

const S = {
    ART: { name: "예술적 통찰", description: "창의적인 생각으로 예상치 못한 해결책을 제시합니다.", icon: "🎨" },
    BOMBER: { name: "폭발 전문가", description: "투척물이나 폭발물을 제조하고 안전하게 다룹니다.", icon: "💣" },
    TRAP: { name: "함정 설치", description: "주변 지형을 이용해 좀비의 발을 묶거나 처치하는 함정을 만듭니다.", icon: "🪤" }
};

export const AMUSEMENT_NODES: Record<string, StoryNode> = {
    'amusement_0_start': {
        id: 'amusement_0_start',
        text: "🎡 '환상의 나라' 놀이공원입니다. 기괴한 음악 소리가 들려옵니다.",
        next: [{ id: 'amusement_1_ticket', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -5 }
    },

    'amusement_1_ticket': {
        id: 'amusement_1_ticket',
        text: "🎫 개찰구를 넘어 입장합니다. 바닥엔 팝콘 대신 탄피가 흩어져 있습니다.",
        next: [
            { id: 'amusement_2_art', weight: 0.0, choiceText: "창의적인 지름길 구상 (예술적 통찰 필요)", req: { skill: '예술적 통찰' } },
            { id: 'amusement_2_haunted', weight: 0.5, choiceText: "유령의 집 (지름길)" },
            { id: 'amusement_2_arcade', weight: 0.5, choiceText: "오락실 (물자 파밍)" },
            { id: 'amusement_2_arcade_expert', weight: 0.0, choiceText: "오락실 정밀 수색 (반사 신경 필요)", req: { skill: '반사 신경' } },
            { id: 'amusement_2_arcade_sneak', weight: 0.0, choiceText: "직원 구역 잠입 (은밀 기동 필요)", req: { skill: '은밀 기동' } },
            { id: 'amusement_2_arcade_recycle', weight: 0.0, choiceText: "기계 부품 추출 (부품 재활용 필요)", req: { skill: '부품 재활용' } }
        ]
    },
    'amusement_2_art': {
        id: 'amusement_2_art',
        text: "🎨 예술적 통찰로 놀이공원의 복잡한 조형물들을 이용해 좀비들의 시야를 완전히 차단하는 경로를 찾아냈습니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 15, skillsAdd: [S.ART], statChanges: { cha: 1 } }
    },

    'amusement_2_haunted': {
        id: 'amusement_2_haunted',
        text: "👻 지름길이지만 무섭습니다. 진짜 좀비가 섞여 있어 급히 도망쳤습니다!",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -10, sanity: -15, statChanges: { int: -1 } }
    },
    'amusement_2_arcade': {
        id: 'amusement_2_arcade',
        text: "🕹️ 인형 뽑기 기계를 깨고 초콜릿 바를 챙겼습니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['초콜릿'], statChanges: { agi: 1 } }
    },
    'amusement_2_arcade_expert': {
        id: 'amusement_2_arcade_expert',
        text: "🕹️ 빠른 반사 신경으로 함정을 피하며 오락실 창고의 귀중품을 쓸어담았습니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['초콜릿', '비타민', '맥가이버 칼'], sanity: 10, statChanges: { agi: 1 } }
    },
    'amusement_2_arcade_sneak': { 
        id: 'amusement_2_arcade_sneak',
        text: "🕹️ 소리 없이 직원 전용 통로를 수색하여 대량의 비상 물자를 획득했습니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '초콜릿', '비타민'], sanity: 10, statChanges: { agi: 1 } }
    },
    'amusement_2_arcade_recycle': {
        id: 'amusement_2_arcade_recycle',
        text: "🕹️ 오락 기계들을 분해하여 배터리와 전선을 포함한 유용한 부품들을 추출했습니다.",
        next: [{ id: 'amusement_3_rollercoaster', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['맥가이버 칼', '비타민'], sanity: 5, statChanges: { int: 1 } }
    },

    'amusement_3_rollercoaster': {
        id: 'amusement_3_rollercoaster',
        text: "🎢 롤러코스터 레일 위를 걸어 이동합니다.",
        next: [
            { id: 'amusement_4_circus', weight: 0.7 },
            { id: 'amusement_4_fall', weight: 0.3 }
        ],
        effect: { target: 'ALL', fatigue: 10, statChanges: { agi: 1 } }
    },
    'amusement_4_fall': {
        id: 'amusement_4_fall',
        text: "🦶 미끄러져 추락했습니다! 타박상이 심합니다.",
        next: [{ id: 'amusement_4_circus', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -15, fatigue: 10, statChanges: { agi: -1 } }
    },

    'amusement_4_circus': {
        id: 'amusement_4_circus',
        text: "🎪 중앙 광장의 서커스 천막을 통과해야 합니다.",
        next: [{ id: 'amusement_5_clowns', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -5, statChanges: { int: 1 } }
    },

    'amusement_5_clowns': {
        id: 'amusement_5_clowns',
        text: "🤡 좀비가 된 광대들이 다가옵니다! 공포스럽습니다.",
        next: [
            { id: 'amusement_6_bomber', weight: 0.0, choiceText: "광대 폭파 (폭발 전문가 필요)", req: { skill: '폭발 전문가' } },
            { id: 'amusement_6_trap', weight: 0.0, choiceText: "함정으로 유인 (함정 설치 필요)", req: { skill: '함정 설치' } },
            { id: 'amusement_6_fight', weight: 0.5 },
            { id: 'amusement_6_run', weight: 0.5 }
        ],
        effect: { target: 'ALL', sanity: -20 }
    },
    'amusement_6_bomber': {
        id: 'amusement_6_bomber',
        text: "💣 폭발 전문가 스킬로 매점의 가스통을 개조해 화려한 폭죽쇼를 만들었습니다. 광대들이 흔적도 없이 사라졌습니다.",
        next: [{ id: 'amusement_7_mascot_boss', weight: 1.0 }],
        effect: { target: 'RANDOM_1', kill: 10, sanity: 15, skillsAdd: [S.BOMBER], statChanges: { int: 1 } }
    },
    'amusement_6_trap': {
        id: 'amusement_6_trap',
        text: "🪤 함정 설치 스킬로 회전목마의 말들을 이용해 광대들을 묶어버렸습니다. 탄약 하나 쓰지 않고 해결했습니다.",
        next: [{ id: 'amusement_7_mascot_boss', weight: 1.0 }],
        effect: { target: 'RANDOM_1', kill: 5, sanity: 10, skillsAdd: [S.TRAP], statChanges: { int: 1 } }
    },

    'amusement_6_fight': {
        id: 'amusement_6_fight',
        text: "🔫 광대들을 처치하고 통제실에 도착해 전원을 올립니다.",
        next: [{ id: 'amusement_7_mascot_boss', weight: 1.0 }],
        effect: { target: 'ALL', kill: 5, fatigue: 20, statChanges: { str: 1 } }
    },
    'amusement_6_run': {
        id: 'amusement_6_run',
        text: "🏃‍♂️ 놈들을 피해 통제실로 숨어 들어가 전원을 올립니다.",
        next: [{ id: 'amusement_7_mascot_boss', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 25, statChanges: { agi: 1 } }
    },

    'amusement_7_mascot_boss': {
        id: 'amusement_7_mascot_boss',
        text: "🧸 [BOSS] '해피 베어' 인형 탈을 쓴 괴물이 습격해옵니다!",
        next: [
            { id: 'amusement_8_parade', weight: 0.6 },
            { id: 'amusement_8_trapped', weight: 0.4 }
        ],
        effect: { target: 'ALL', hp: -20, sanity: -10, statChanges: { con: 1 } }
    },

    'amusement_8_parade': {
        id: 'amusement_8_parade',
        text: "🎉 괴물을 물리쳤습니다. 퍼레이드 카를 타고 탈출합니다!",
        effect: { target: 'ALL', sanity: 30, loot: ['비타민', '통조림'], statChanges: { cha: 1 } }
    },
    'amusement_8_trapped': {
        id: 'amusement_8_trapped',
        text: "🎡 관람차에 갇혔습니다. 구조대가 오길 기다립니다.",
        effect: { target: 'ALL', sanity: -20, hunger: -20, statChanges: { con: -1 } }
    }
};
