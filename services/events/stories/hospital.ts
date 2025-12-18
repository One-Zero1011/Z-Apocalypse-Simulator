
import { StoryNode } from "../../../types";

// 스킬 도우미
const S = {
    ANATOMY: { name: "해부학 지식", description: "생명체의 급소를 파악해 전투나 치료에 응용합니다.", icon: "🦴" },
    SURGERY: { name: "정밀 수술", description: "심각한 부상을 입은 생존자를 수술해 살려냅니다.", icon: "🩺" },
    HYGIENE: { name: "위생 관리", description: "주변 환경을 청결히 유지해 감염 위험을 낮춥니다.", icon: "🧼" },
    PHARMA: { name: "약물 조제", description: "화학 물질이나 약초를 배합해 치료제를 만듭니다.", icon: "🧪" }
};

export const HOSPITAL_NODES: Record<string, StoryNode> = {
    'hospital_0_start': {
        id: 'hospital_0_start',
        text: "🏥 안개 속에서 거대한 종합병원 건물이 모습을 드러냈습니다. 전력이 끊긴 지 오래되어 보이지만, 약품이 남아있을지도 모릅니다.",
        next: [
            { id: 'hospital_1_lobby', weight: 0.7 },
            { id: 'hospital_ignore', weight: 0.3 }
        ],
        effect: { target: 'ALL', sanity: 5 }
    },
    'hospital_ignore': {
        id: 'hospital_ignore',
        text: "🚫 병원은 죽음의 덫입니다. 우리는 욕심을 버리고 안전하게 우회하기로 결정했습니다.",
        effect: { target: 'ALL', fatigue: 5, statChanges: { con: 1 } } // 생존력 상승
    },
    'hospital_1_lobby': {
        id: 'hospital_1_lobby',
        text: "🚪 병원 로비에 들어서자 썩은 냄새가 코를 찌릅니다. 어디를 먼저 수색할까요?",
        next: [
            { id: 'hospital_2a_stairs', weight: 0.4, choiceText: "계단으로 (전투 위험)" }, 
            { 
                id: 'hospital_2b_vents_success', 
                weight: 0.0, 
                choiceText: "좁은 환기구로 잠입",
                dice: { threshold: 70, stat: 'agi', successId: 'hospital_2b_vents_success', failId: 'hospital_2b_vents_fail', hpPenalty: -15 }
            },
            { id: 'hospital_2c_morgue', weight: 0.3, choiceText: "지하 영안실 탐색 (공포)" }   
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'hospital_2b_vents_success': {
        id: 'hospital_2b_vents_success',
        text: "🤸 성공입니다! 날렵한 몸놀림으로 환기구를 통과했습니다. 아래쪽에서 배회하는 좀비들을 완벽히 따돌리고 안전하게 간호사 스테이션에 도착합니다.",
        next: [{ id: 'hospital_3_nurse_station', weight: 1.0 }],
        effect: { target: 'ALL', sanity: 5, fatigue: 10, statChanges: { agi: 1 } }
    },
    'hospital_2b_vents_fail': {
        id: 'hospital_2b_vents_fail',
        text: "💥 실패했습니다! 좁은 환기구가 무게를 이기지 못하고 요란한 소리를 내며 무너져 내렸습니다. 먼지구덩이 속에서 떨어진 우리 앞에 굶주린 감염자들이 일제히 고개를 돌립니다!",
        next: [{ id: 'hospital_2a_stairs', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -20, fatigue: 20, statChanges: { con: -1 } }
    },
    'hospital_2c_morgue': {
        id: 'hospital_2c_morgue',
        text: "⚰️ 지하 영안실로 내려갑니다. 시체들이 부패하고 있습니다. 하지만 시체들 소지품에서 뭔가를 찾을 수 있을지도 모릅니다.",
        next: [
            { id: 'hospital_3_morgue_anatomy', weight: 0.0, choiceText: "사체 정밀 검안 (해부학 지식 필요)", req: { skill: '해부학 지식' } },
            { id: 'hospital_3_morgue_loot', weight: 0.5, choiceText: "소지품 뒤지기" },
            { id: 'hospital_3_morgue_wake', weight: 0.5 }
        ],
        effect: { target: 'ALL', sanity: -20 }
    },
    'hospital_3_morgue_anatomy': {
        id: 'hospital_3_morgue_anatomy',
        text: "🦴 해부학 지식을 활용해 시체들 중 감염되지 않은 깨끗한 부위에서 의료용 부품을 추출하고, 좀비화 징후가 있는 시체들을 미리 처리했습니다.",
        next: [{ id: 'hospital_3_nurse_station', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['붕대', '비타민'], sanity: 10, skillsAdd: [S.ANATOMY] }
    },
    'hospital_3_morgue_loot': {
        id: 'hospital_3_morgue_loot',
        text: "💍 끔찍한 냄새를 참아가며 시체들을 뒤져 귀금속과 진통제를 찾아냈습니다. 다시 로비로 올라갑니다.",
        next: [{ id: 'hospital_3_nurse_station', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['비타민'], statChanges: { int: 1 } }
    },
    'hospital_3_morgue_wake': {
        id: 'hospital_3_morgue_wake',
        text: "🧟 시체인 줄 알았던 것들이 일제히 일어납니다! 좁은 영안실에 갇혔습니다!",
        next: [{ id: 'hospital_2a_stairs', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -20, infection: 10, skillsRemove: ["정밀 수술"] }
    },

    'hospital_2a_stairs': {
        id: 'hospital_2a_stairs',
        text: "⚔️ 비상계단을 오르던 중, 잠복해 있던 감염자 무리와 마주쳤습니다! 좁은 공간에서 난전이 벌어집니다.",
        next: [{ id: 'hospital_3_nurse_station', weight: 1.0 }],
        effect: { target: 'RANDOM_HALF', hp: -15, fatigue: 15, statChanges: { str: 1 } }
    },
    'hospital_3_nurse_station': {
        id: 'hospital_3_nurse_station',
        text: "💉 3층 간호사 스테이션. 약제실에서 조제 도구를 찾을까요, 아니면 옥상으로 갈까요?",
        next: [
            { id: 'hospital_4_pharma', weight: 0.0, choiceText: "약물 조제 및 수색 (약물 조제 필요)", req: { skill: '약물 조제' } },
            { id: 'hospital_4_hygiene', weight: 0.0, choiceText: "구역 소독 및 방역 (위생 관리 필요)", req: { skill: '위생 관리' } },
            { id: 'hospital_4_surgery', weight: 0.4, choiceText: "수술실 통과" },
            { id: 'hospital_4_roof', weight: 0.4, choiceText: "옥상으로 이동" }
        ],
        effect: { target: 'ALL', loot: ['붕대'] }
    },
    'hospital_4_pharma': {
        id: 'hospital_4_pharma',
        text: "🧪 스테이션 뒤편 약제실에서 남은 약품을 조합해 고농축 항생제를 만들어냈습니다.",
        next: [{ id: 'hospital_5_boss', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['항생제', '항생제'], sanity: 10, skillsAdd: [S.PHARMA] }
    },
    'hospital_4_hygiene': {
        id: 'hospital_4_hygiene',
        text: "🧼 위생 관리 스킬을 발휘해 주변 좀비 혈흔을 지우고 방역 처리를 하여 동료들의 감염 위험을 획기적으로 낮췄습니다.",
        next: [{ id: 'hospital_5_boss', weight: 1.0 }],
        effect: { target: 'ALL', infection: -20, sanity: 10, skillsAdd: [S.HYGIENE] }
    },
    'hospital_4_surgery': {
        id: 'hospital_4_surgery',
        text: "🏥 수술실을 가로질러 이동합니다. 피 묻은 수술대와 깨진 약병들이 흩어져 있습니다. 안쪽에서 무거운 발소리가 들려옵니다.",
        next: [{ id: 'hospital_5_boss', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -10, fatigue: 5, statChanges: { int: 1 } }
    },
    
    'hospital_4_roof': {
        id: 'hospital_4_roof',
        text: "🚁 옥상으로 올라갑니다. 헬기 착륙장에 구조 신호를 보낼 수 있는 조명탄이 남아있을지도 모릅니다.",
        next: [
            { 
                id: 'hospital_5_flare_success', 
                weight: 1.0, 
                choiceText: "조명탄 발사 시도 (민첩 기반)",
                dice: { threshold: 80, stat: 'agi', successId: 'hospital_5_flare_success', failId: 'hospital_5_flare_fail', hpPenalty: -10 }
            }
        ]
    },
    'hospital_5_flare_success': {
        id: 'hospital_5_flare_success',
        text: "✨ 조명탄을 쏘아 올렸습니다! 멀리서 정찰 헬기가 이를 보고 보급품을 투하하고 사라집니다.",
        effect: { target: 'ALL', sanity: 20, loot: ['통조림', '통조림', '항생제', '무전기'], statChanges: { cha: 1 } }
    },
    'hospital_5_flare_fail': {
        id: 'hospital_5_flare_fail',
        text: "💨 조명탄은 불발되었고, 소음 때문에 옥상으로 좀비들이 몰려옵니다! 서둘러 배관을 타고 내려와 탈출합니다.",
        effect: { target: 'ALL', fatigue: 20, hp: -10, statChanges: { agi: -1 } }
    },

    'hospital_5_boss': {
        id: 'hospital_5_boss',
        text: "🧟‍♂️ [BOSS] 변종 '더 서전(The Surgeon)'이 괴성을 지르며 달려듭니다! 거대한 메스가 우리를 향해 날아옵니다.",
        next: [
            { 
                id: 'hospital_6_win', 
                weight: 0.0, 
                choiceText: "정면 승부 (힘 기반)",
                dice: { threshold: 85, stat: 'str', successId: 'hospital_6_win', failId: 'hospital_5_boss_fight_fail', hpPenalty: -30 }
            },
            { 
                id: 'hospital_6_win', 
                weight: 0.0, 
                choiceText: "공격 회피 및 반격 (민첩 기반)",
                dice: { threshold: 75, stat: 'agi', successId: 'hospital_6_win', failId: 'hospital_5_boss_dodge_fail', hpPenalty: -20, sanityPenalty: -10 }
            },
            { id: 'hospital_6_run', weight: 0.4, choiceText: "포기하고 도망치기" }
        ],
        effect: { target: 'RANDOM_HALF', hp: -25, sanity: -10 }
    },
    'hospital_5_boss_fight_fail': {
        id: 'hospital_5_boss_fight_fail',
        text: "🩸 판정 실패! 괴물의 엄청난 힘에 압도당했습니다. 휘둘러진 메스가 방어구를 뚫고 어깨를 깊게 찔렀습니다. 우리는 처절한 비명을 지르며 간신히 탈출했습니다.",
        next: [{ id: 'hospital_6_run', weight: 1.0 }],
        effect: { target: 'ALL', hp: -35, fatigue: 30, sanity: -20, statChanges: { str: -1 } }
    },
    'hospital_5_boss_dodge_fail': {
        id: 'hospital_5_boss_dodge_fail',
        text: "💨 판정 실패! 발이 무언가에 걸려 넘어지는 찰나, 차가운 금속이 허벅지를 스치고 지나갔습니다. 심각한 출혈과 함께 좀비들의 울음소리가 가까워집니다.",
        next: [{ id: 'hospital_6_run', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -45, fatigue: 30, infection: 15, statChanges: { agi: -1 } }
    },
    'hospital_6_run': {
        id: 'hospital_6_run',
        text: "🏃‍♂️ 우리는 창문을 깨고 뛰어내려 탈출했습니다. 뒤에서 '더 서전'의 기괴한 웃음소리가 들려옵니다.",
        effect: { target: 'ALL', hp: -10, fatigue: 10, skillsRemove: ["정밀 수술", "해부학 지식"] }
    },
    'hospital_6_win': {
        id: 'hospital_6_win',
        text: "💊 판정 성공! 치열한 사투 끝에 변종을 쓰러뜨렸습니다! 놈의 가슴에 칼을 꽂아 넣자 기괴한 경련과 함께 무너집니다. 약제실은 보물창고였습니다. 희귀한 약품과 백신을 확보합니다.",
        effect: { target: 'ALL', sanity: 35, loot: ['항생제', '안정제', '비타민', '백신'], kill: 10, skillsAdd: [S.SURGERY], statChanges: { int: 1, str: 1 } }
    }
};
