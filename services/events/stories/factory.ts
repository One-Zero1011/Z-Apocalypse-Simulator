
import { StoryNode } from "../../../types";

const S = {
    HACKING: { name: "시스템 해킹", description: "보안 네트워크에 침투해 정보를 빼내거나 제어권을 얻습니다.", icon: "💻" },
    ELECTRONICS: { name: "전자 공학", description: "회로를 조작해 잠긴 문을 열거나 전자기기를 개조합니다.", icon: "📟" },
    REFLEX: { name: "반사 신경", description: "순간적인 판단과 빠른 손놀림으로 위기를 피합니다.", icon: "🕹️" }
};

export const FACTORY_NODES: Record<string, StoryNode> = {
    'factory_0_start': {
        id: 'factory_0_start',
        text: "🏭 현대식 공장입니다. 직원 복지 구역에 있는 대형 식당을 털 계획입니다.",
        next: [
            { id: 'factory_1_hack', weight: 0.0, choiceText: "보안 시스템 해킹 (시스템 해킹 필요)", req: { skill: '시스템 해킹' } },
            { id: 'factory_1_sneak', weight: 0.6, choiceText: "개구멍으로 잠입" },
            { id: 'factory_avoid', weight: 0.4, choiceText: "지나치기" }
        ],
        effect: { target: 'ALL', fatigue: 5, loot: ['고철', '통조림'] }
    },
    'factory_avoid': {
        id: 'factory_avoid',
        text: "🤖 무시합니다. 근처 공장 노동자들의 쉼터에서 남은 도시락(고기)을 주웠습니다.",
        effect: { target: 'ALL', sanity: 5, loot: ['고기', '통조림'] }
    },
    'factory_1_hack': {
        id: 'factory_1_hack',
        text: "💻 보안 해제. 자동 배급기가 열리며 직원용 에너지 바(초콜릿)가 쏟아집니다.",
        next: [{ id: 'factory_3_control', weight: 1.0 }],
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.HACKING], statChanges: { int: 1 }, loot: ['부품', '초콜릿', '초콜릿'] }
    },
    'factory_1_sneak': {
        id: 'factory_1_sneak',
        text: "🕵️ 잠입 중. 정비용 통로 구석에서 버려진 간식 봉투를 발견했습니다.",
        next: [
            { 
                id: 'factory_2_dodge', 
                weight: 1.0, 
                choiceText: "프레스 기계 사이 통과 (민첩 기반)",
                dice: { threshold: 80, stat: 'agi', successId: 'factory_3_control', failId: 'factory_2_crushed', hpPenalty: -40 }
            }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'factory_2_crushed': {
        id: 'factory_2_crushed',
        text: "💥 부상 발생. 고통 속에 기어가며 가방 속의 통조림 하나가 찌그러졌지만 다행히 먹을 순 있습니다.",
        next: [{ id: 'factory_3_control', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -40, fatigue: 20, statChanges: { agi: -1, con: -1 }, loot: ['통조림'] }
    },
    'factory_2_dodge': {
        id: 'factory_2_dodge',
        text: "🤸 회피 성공! 탈출구 근처 창고에서 신선한 고기 팩들을 발견했습니다.",
        next: [{ id: 'factory_3_control', weight: 1.0 }],
        effect: { target: 'RANDOM_1', fatigue: 10, skillsAdd: [S.REFLEX], statChanges: { agi: 1 }, loot: ['고기', '고기'] }
    },
    'factory_3_control': {
        id: 'factory_3_control',
        text: "🎛️ 제어실. 이곳의 비상 보급 장치를 가동하면 압축 영양 식량을 얻을 수 있습니다.",
        next: [
            { id: 'factory_4_elec', weight: 0.0, choiceText: "회로 과부하로 경보 해제 (전자 공학 필요)", req: { skill: '전자 공학' } },
            { id: 'factory_4_loot_run', weight: 0.5, choiceText: "빠르게 챙기고 도주" },
            { id: 'factory_4_produce', weight: 0.5, choiceText: "생산 라인 가동 (위험 감수)" }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'factory_4_elec': {
        id: 'factory_4_elec',
        text: "⚡ 경보 해제. 여유롭게 직원 식당 창고를 털어 대량의 통조림과 채소를 챙겼습니다.",
        next: [{ id: 'factory_5_exit', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['부품', '고철', '통조림', '통조림', '채소', '채소'], sanity: 10, skillsAdd: [S.ELECTRONICS] }
    },
    'factory_4_loot_run': {
        id: 'factory_4_loot_run',
        text: "🏃 급히 챙깁니다. 눈에 보이는 통조림 박스 세 개를 낚아챘습니다.",
        next: [{ id: 'factory_5_exit', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['고철', '부품', '붕대', '통조림', '통조림', '통조림'], fatigue: 15 }
    },
    'factory_4_produce': {
        id: 'factory_4_produce',
        text: "🏭 생산 라인 가동! 벨트에서 갓 만들어진 압축 전투 식량(고기)들이 쏟아집니다.",
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
        text: "🛡️ 방어 성공! 고단백 압축 식량 수십 팩을 확보했습니다. 한 달은 끄떡없습니다!",
        next: [{ id: 'factory_5_exit', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['부품', '고기', '고기', '고기', '고기', '고기', '고기', '시멘트'], hp: -10, kill: 5, statChanges: { con: 1, str: 1 } }
    },
    'factory_produce_fail': {
        id: 'factory_produce_fail',
        text: "🧟 밀려났습니다! 생산된 식량 대부분이 짓밟혔지만, 품속에 몇 개는 챙겼습니다.",
        next: [{ id: 'factory_5_exit', weight: 1.0 }],
        effect: { target: 'ALL', hp: -25, infection: 10, sanity: -20, loot: ['고기'] }
    },
    'factory_5_exit': {
        id: 'factory_5_exit',
        text: "🚪 퇴각. 도중에 발견한 마지막 보급 상자(통조림)를 챙깁니다.",
        effect: { target: 'ALL', fatigue: 10, loot: ['통조림', '통조림'] }
    }
};
