
import { StoryNode } from "../../../types";

// 스킬 도우미
const S = {
    HUNTING: { name: "야생 추적", description: "짐승의 흔적을 쫓아 사냥하고 고기를 얻습니다.", icon: "🏹" },
    FORAGING: { name: "산야초 채집", description: "숲에서 먹을 수 있는 열매나 약초를 구분해냅니다.", icon: "🌿" },
    SURVIVAL: { name: "생존 본능", description: "죽음의 문턱에서 초인적인 힘을 발휘합니다.", icon: "🔥" }
};

export const WINTER_NODES: Record<string, StoryNode> = {
    'winter_0_start': {
        id: 'winter_0_start',
        text: "❄️ 갑작스러운 이상기후로 기온이 급강하합니다. 식량이 얼어붙기 전에 대책을 세워야 합니다.",
        next: [{ id: 'winter_1_blizzard', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 5, loot: ['통조림'] }
    },
    'winter_1_blizzard': {
        id: 'winter_1_blizzard',
        text: "🌨️ 화이트아웃. 눈보라가 시야를 가립니다. 얼어 죽기 전에 대피할 곳을 찾아야 합니다.",
        next: [
            { id: 'winter_2_hunting', weight: 0.0, choiceText: "야생 흔적 추적 (야생 추적 필요)", req: { skill: '야생 추적' } },
            { id: 'winter_2_shelter', weight: 0.35, choiceText: "산장 찾기 (안전, 시간 소모)" }, 
            { id: 'winter_2_cave', weight: 0.25, choiceText: "동굴 탐색 (맹수 위험)" },    
            { id: 'winter_2_lake', weight: 0.3, choiceText: "얼어붙은 호수 횡단 (빠름, 익사 위험)" }
        ],
        effect: { target: 'ALL', hp: -5, fatigue: 5 }
    },
    'winter_2_hunting': {
        id: 'winter_2_hunting',
        text: "🏹 야생 추적 기술을 통해 눈보라 속에서도 짐승의 대피 경로를 찾아냈습니다. 안전한 산장으로 직행하며 많은 양의 신선한 고기를 확보합니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'RANDOM_1', loot: ['고기', '고기', '고기'], sanity: 15, fatigue: -10, skillsAdd: [S.HUNTING] }
    },
    
    'winter_2_lake': {
        id: 'winter_2_lake',
        text: "🧊 시간을 단축하기 위해 꽁꽁 언 호수를 가로지르기로 합니다. 얼음 속에서 얼어붙은 물고기들이 보입니다.",
        next: [
            { id: 'winter_3_lake_expert', weight: 0.0, choiceText: "얼음 두께 측정 및 경로 분석 (전략 수립 필요)", req: { skill: '전략 수립' } },
            { id: 'winter_3_lake_power', weight: 0.0, choiceText: "무거운 짐 들고 빠르게 돌파 (폭발적 근력 필요)", req: { skill: '폭발적 근력' } },
            { 
                id: 'winter_3_lake_safe', 
                weight: 1.0, 
                choiceText: "균형 잡고 조심조심 건너기 (민첩 기반)",
                dice: { threshold: 75, stat: 'agi', successId: 'winter_3_lake_safe', failId: 'winter_3_lake_crack', hpPenalty: -20 }
            }
        ],
        effect: { target: 'ALL', sanity: -5, loot: ['고기'] }
    },
    'winter_3_lake_power': {
        id: 'winter_3_lake_power',
        text: "💪 근력을 발휘해 얼음이 깨지기 전 무거운 보급품을 짊어지고 전력 질주하여 반대편에 도착했습니다. 보급품 속에서 비상식량을 찾아냈습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: 15, sanity: 5, statChanges: { str: 1 }, loot: ['통조림', '통조림'] }
    },
    'winter_3_lake_expert': {
        id: 'winter_3_lake_expert',
        text: "🔬 전문가의 분석 덕분에 가장 두껍고 안전한 얼음길을 찾아냈습니다. 가는 길에 얼어붙은 대어 몇 마리를 건졌습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: -20, sanity: 5, statChanges: { int: 1 }, loot: ['고기', '고기'] }
    },
    'winter_3_lake_safe': {
        id: 'winter_3_lake_safe',
        text: "🏃‍♂️ 판정 성공! 숨을 죽이고 신속하게 이동하여 호수를 건넜습니다. 무사히 건넌 기념으로 통조림을 하나씩 나눠먹었습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'ALL', fatigue: -15, statChanges: { agi: 1 }, loot: ['통조림'] }
    },
    'winter_3_lake_crack': {
        id: 'winter_3_lake_crack',
        text: "💧 판정 실패! 콰직! 얼음이 깨지며 누군가 차가운 물속에 빠졌습니다! 건져내긴 했지만 배낭에 든 식량 일부를 잃어버렸습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -30, fatigue: 20, statChanges: { con: -1 }, inventoryRemove: ['통조림'] }
    },

    'winter_2_cave': {
        id: 'winter_2_cave',
        text: "🕳️ 바람을 피하기 위해 작은 동굴로 들어갔습니다. 하지만 그곳엔 겨울잠을 자던 거대한 좀비 곰과 놈이 모아둔 먹이들이 있었습니다!",
        next: [
            { id: 'winter_3_bear_fight', weight: 0.5 },
            { id: 'winter_3_bear_sneak', weight: 0.5 }
        ],
        effect: { target: 'ALL', loot: ['고기'] }
    },
    'winter_3_bear_fight': {
        id: 'winter_3_bear_fight',
        text: "⚔️ 곰이 깨어났습니다! 좁은 동굴 안에서 사생결단을 냅니다. 치열한 사투 끝에 엄청난 양의 고기와 가죽을 얻었습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -20, loot: ['고기', '고기', '고기', '고기'], statChanges: { str: 1 }, skillsAdd: [S.SURVIVAL] }
    },
    'winter_3_bear_sneak': {
        id: 'winter_3_bear_sneak',
        text: "🤫 곰이 깊이 잠든 것을 확인하고, 놈이 모아둔 먹이 중 신선한 것들을 몰래 챙겨 밤을 보냈습니다. 따뜻하고 배부른 밤이었습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'ALL', hp: 10, fatigue: -20, statChanges: { con: 1 }, loot: ['고기', '고기'] }
    },

    'winter_2_shelter': {
        id: 'winter_2_shelter',
        text: "🔥 운 좋게 난로가 있는 산장을 발견했습니다! 식고함에는 통조림이 가득합니다. 불을 피우자 얼어붙은 몸이 녹아내립니다.",
        next: [{ id: 'winter_3_wolves', weight: 1.0 }],
        effect: { target: 'ALL', hp: 5, sanity: 10, loot: ['통조림', '통조림', '통조림'] }
    },
    'winter_3_wolves': {
        id: 'winter_3_wolves',
        text: "🐺 눈보라 속에서 굶주린 늑대 떼가 습격해왔습니다! 우리는 무기를 들고 방어 태세를 갖춥니다.",
        next: [
            { id: 'winter_4_hunt_success', weight: 0.6 },
            { id: 'winter_4_hunt_fail', weight: 0.4 }
        ],
        effect: { target: 'ALL', fatigue: 10 }
    },
    'winter_4_hunt_fail': {
        id: 'winter_4_hunt_fail',
        text: "🩸 짐승들의 이빨에 물리고 뜯겼습니다. 우리는 아끼던 통조림 일부를 미끼로 던져주며 간신히 도망쳤습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -20, sanity: -10, skillsRemove: ["야생 추적"], inventoryRemove: ['통조림'] }
    },
    'winter_4_hunt_success': {
        id: 'winter_4_hunt_success',
        text: "🍖 위기는 기회가 되었습니다. 습격해온 늑대들을 모두 사냥하여 고기를 잔뜩 얻었습니다.",
        next: [{ id: 'winter_5_thaw', weight: 1.0 }],
        effect: { target: 'RANDOM_1', loot: ['고기', '고기', '고기'], skillsAdd: [S.HUNTING] }
    },
    'winter_5_thaw': {
        id: 'winter_5_thaw',
        text: "☀️ 며칠간의 혹한이 지나고 마침내 해가 떴습니다. 눈이 녹은 자리에서 버려진 배낭을 발견해 건조식품을 챙깁니다.",
        next: [
          { id: 'winter_6_forage', weight: 0.0, choiceText: "주변 산야초 수집 (산야초 채집 필요)", req: { skill: '산야초 채집' } },
          { id: 'winter_6_end', weight: 1.0, choiceText: "이동 계속" }
        ],
        effect: { target: 'ALL', sanity: 5, loot: ['초콜릿', '통조림'] }
    },
    'winter_6_forage': {
        id: 'winter_6_forage',
        text: "🌿 눈 녹은 습지에서 기적적으로 비타민이 풍부한 약초들과 먹을 수 있는 뿌리 채소들을 찾아냈습니다.",
        effect: { target: 'RANDOM_1', loot: ['비타민', '비타민', '채소', '채소'], sanity: 10, skillsAdd: [S.FORAGING] }
    },
    'winter_6_end': {
      id: 'winter_6_end',
      text: "☀️ 날씨가 풀렸습니다. 길가에서 찾은 통조림을 챙겨 다시 길을 떠납니다.",
      effect: { target: 'ALL', statChanges: { con: 1 }, loot: ['통조림'] } 
    }
};
