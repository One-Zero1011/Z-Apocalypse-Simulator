
import { StoryNode } from "../../../types";

const S = {
    HACKING: { name: "시스템 해킹", description: "보안 네트워크에 침투해 정보를 빼내거나 제어권을 얻습니다.", icon: "💻" },
    ELECTRONICS: { name: "전자 공학", description: "회로를 조작해 잠긴 문을 열거나 전자기기를 개조합니다.", icon: "📟" },
    REFLEX: { name: "반사 신경", description: "순간적인 판단과 빠른 손놀림으로 위기를 피합니다.", icon: "🕹️" }
};

export const FACTORY_NODES: Record<string, StoryNode> = {
    'factory_0_start': {
        id: 'factory_0_start',
        text: "🏭 웅웅거리는 기계 소리가 들리는 현대식 공장입니다. 담벼락엔 '접근 금지: 자동 방어 시스템 가동 중'이라고 적혀 있습니다.",
        next: [
            { id: 'factory_1_hack', weight: 0.0, choiceText: "보안 시스템 해킹 (시스템 해킹 필요)", req: { skill: '시스템 해킹' } },
            { id: 'factory_1_sneak', weight: 0.6, choiceText: "개구멍으로 잠입" },
            { id: 'factory_avoid', weight: 0.4, choiceText: "지나치기" }
        ],
        effect: { target: 'ALL', fatigue: 5 }
    },
    'factory_avoid': {
        id: 'factory_avoid',
        text: "🤖 로봇 경비견이 순찰하는 것을 보고 발길을 돌립니다. 목숨이 더 중요합니다.",
        effect: { target: 'ALL', sanity: 5 }
    },
    'factory_1_hack': {
        id: 'factory_1_hack',
        text: "💻 외부 터미널에 접속하여 경비 시스템을 '아군'으로 인식시켰습니다. 정문이 활짝 열립니다.",
        next: [{ id: 'factory_3_control', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.HACKING], statChanges: { int: 1 } }
    },
    'factory_1_sneak': {
        id: 'factory_1_sneak',
        text: "🕵️ 배수구를 통해 공장 내부로 들어왔습니다. 컨베이어 벨트가 쉴 새 없이 돌아가며 위험한 물건들을 나르고 있습니다.",
        next: [
            { 
                id: 'factory_2_dodge', 
                weight: 1.0, 
                choiceText: "프레스 기계 사이 통과 (민첩 기반)",
                dice: { threshold: 80, stat: 'agi', successId: 'factory_3_control', failId: 'factory_2_crushed', hpPenalty: -40 }
            }
        ]
    },
    'factory_2_crushed': {
        id: 'factory_2_crushed',
        text: "💥 쾅! 타이밍을 놓쳐 기계 팔에 강타당했습니다. 뼈가 부러지는 고통을 참으며 기어갑니다.",
        next: [{ id: 'factory_3_control', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -40, fatigue: 20, statChanges: { agi: -1, con: -1 } }
    },
    'factory_2_dodge': {
        id: 'factory_2_dodge',
        text: "🤸 날렵하게 움직여 압착기와 절단기 사이를 무사히 통과했습니다. 마치 액션 영화의 한 장면 같았습니다.",
        next: [{ id: 'factory_3_control', weight: 1.0 }],
        effect: { target: 'RANDOM_1', fatigue: 10, skillsAdd: [S.REFLEX], statChanges: { agi: 1 } }
    },
    'factory_3_control': {
        id: 'factory_3_control',
        text: "🎛️ 중앙 제어실입니다. 생산 라인을 조작하면 유용한 물품을 만들 수 있지만, 경보가 울리고 있습니다.",
        next: [
            { id: 'factory_4_elec', weight: 0.0, choiceText: "회로 과부하로 경보 해제 (전자 공학 필요)", req: { skill: '전자 공학' } },
            { id: 'factory_4_loot_run', weight: 0.5, choiceText: "빠르게 챙기고 도주" },
            { id: 'factory_4_produce', weight: 0.5, choiceText: "생산 라인 가동 (위험 감수)" }
        ]
    },
    'factory_4_elec': {
        id: 'factory_4_elec',
        text: "⚡ 전자 공학 지식으로 경보 시스템의 퓨즈를 날려버렸습니다. 안전하게 공장 재고를 털었습니다.",
        next: [{ id: 'factory_5_exit', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['권총', '맥가이버 칼', '통조림'], sanity: 10, skillsAdd: [S.ELECTRONICS] }
    },
    'factory_4_loot_run': {
        id: 'factory_4_loot_run',
        text: "🏃 경비 드론이 몰려오기 전에 눈에 보이는 것만 챙겨서 달아났습니다.",
        next: [{ id: 'factory_5_exit', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['통조림', '붕대'], fatigue: 15 }
    },
    'factory_4_produce': {
        id: 'factory_4_produce',
        text: "🏭 생산 라인을 재가동합니다! 기계가 돌아가는 소리에 좀비들이 몰려옵니다.",
        next: [
            { 
                id: 'factory_produce_success', 
                weight: 1.0, 
                choiceText: "방어하며 생산 완료 대기 (체력 기반)",
                dice: { threshold: 85, stat: 'con', successId: 'factory_produce_success', failId: 'factory_produce_fail', hpPenalty: -25 }
            }
        ]
    },
    'factory_produce_success': {
        id: 'factory_produce_success',
        text: "🛡️ 쏟아지는 좀비들을 몸으로 막아내는 동안, 기계가 '최신형 전술 장비' 생산을 마쳤습니다!",
        next: [{ id: 'factory_5_exit', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['권총', '권총', '지도'], hp: -10, kill: 5, statChanges: { con: 1, str: 1 } }
    },
    'factory_produce_fail': {
        id: 'factory_produce_fail',
        text: "🧟 버티지 못하고 밀려났습니다! 생산되던 물품은 컨베이어 벨트에 낀 채 망가졌고, 우리는 상처만 입고 도망쳤습니다.",
        next: [{ id: 'factory_5_exit', weight: 1.0 }],
        effect: { target: 'ALL', hp: -25, infection: 10, sanity: -20 }
    },
    'factory_5_exit': {
        id: 'factory_5_exit',
        text: "🚪 공장 뒷문을 통해 빠져나왔습니다. 기계 소리가 멀어집니다.",
        effect: { target: 'ALL', fatigue: 10 }
    }
};
