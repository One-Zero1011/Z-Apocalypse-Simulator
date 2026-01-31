
import { StoryNode, Skill } from "../../../types";

// 스킬 객체 도우미 (services/skillData.ts 참조)
const S = {
    MARKSMANSHIP: { name: "전술 사격", description: "총기류를 능숙하게 다루며 명중률과 처치 효율이 상승합니다.", icon: "🔫" },
    MELEE_COMBAT: { name: "근접 제압", description: "근거리 무기나 맨손으로 좀비를 효율적으로 무력화합니다.", icon: "✊" },
    DEFENSE_STANCE: { name: "철벽 방어", description: "방어 태세를 갖춰 자신과 동료가 입는 피해를 줄입니다.", icon: "🛡️" },
    AMBUSH: { name: "매복 습격", description: "적의 사각지대에서 기습하여 큰 피해를 입힙니다.", icon: "🗡️" },
    TRAP_SETTING: { name: "함정 설치", description: "주변 지형을 이용해 좀비의 발을 묶거나 처치하는 함정을 만듭니다.", icon: "🪤" },
    BOMBER: { name: "폭발 전문가", description: "투척물이나 폭발물을 제조하고 안전하게 다룹니다.", icon: "💣" },
    WEAPON_MAINTENANCE: { name: "병기 관리", description: "무기의 상태를 최상으로 유지해 고장 확률을 줄입니다.", icon: "🔧" },
    TACTICAL_COMMAND: { name: "전술 지휘", description: "전투 시 동료들의 위치를 지정해 효율을 극대화합니다.", icon: "🚩" },
    FIRST_AID: { name: "응급 처치", description: "현장에서 즉석으로 상처를 지혈하고 통증을 완화합니다.", icon: "🩹" },
    SURGERY: { name: "정밀 수술", description: "심각한 부상을 입은 생존자를 수술해 살려냅니다.", icon: "🩺" },
    PHARMACOLOGY: { name: "약물 조제", description: "화학 물질이나 약초를 배합해 치료제를 만듭니다.", icon: "🧪" },
    HYGIENE_CONTROL: { name: "위생 관리", description: "주변 환경을 청결히 유지해 감염 위험을 낮춥니다.", icon: "🧼" },
    MENTAL_CARE: { name: "심리 상담", description: "불안해하는 동료의 마음을 진정시키고 정신력을 회복시킵니다.", icon: "🛋️" },
    TRAUMA_RELIEF: { name: "트라우마 극복", description: "과거의 공포에서 벗어나 정신적 내성을 강화합니다.", icon: "🧠" },
    DETOX: { name: "해독술", description: "체내의 독소나 가벼운 감염 수치를 억제합니다.", icon: "🧪" },
    ANATOMY_KNOWLEDGE: { name: "해부학 지식", description: "생명체의 급소를 파악해 전투나 치료에 응용합니다.", icon: "🦴" },
    MECHANIC: { name: "기계 수리", description: "차량, 발전기 등 복잡한 기계 장치를 수리합니다.", icon: "⚙️" },
    ELECTRONICS: { name: "전자 공학", description: "회로를 조작해 잠긴 문을 열거나 전자기기를 개조합니다.", icon: "📟" },
    HACKING: { name: "시스템 해킹", description: "보안 네트워크에 침투해 정보를 빼내거나 제어권을 얻습니다.", icon: "💻" },
    CARPENTRY: { name: "구조물 강화", description: "목재나 철재로 바리케이드를 튼튼하게 보강합니다.", icon: "🪵" },
    PLUMBING: { name: "수원 확보", description: "배관을 연결해 깨끗한 물을 구하거나 정화합니다.", icon: "🚰" },
    RECYCLING: { name: "부품 재활용", description: "쓰레기나 고철에서 유용한 부품을 추출합니다.", icon: "🛠️" },
    CRAFTING: { name: "도구 제작", description: "잡동사니로 칼, 횃불 등 필요한 도구를 뚝딱 만듭니다.", icon: "⚒️" },
    DRIVING: { name: "숙련된 운전", description: "어떤 탈것이든 안정적이고 빠르게 조종합니다.", icon: "🚗" },
    FARMING: { name: "식량 생산", description: "작물을 재배하거나 채집하여 식량을 확보합니다.", icon: "🌱" },
    LIVESTOCK: { name: "가축 사육", description: "동물을 길러 고기, 가죽, 우유 등을 얻습니다.", icon: "🐄" },
    COOKING: { name: "요리 마스터", description: "식재료의 맛과 영양을 살려 효율적인 식사를 준비합니다.", icon: "🍳" },
    FISHING: { name: "그물 낚시", description: "물가에서 물고기를 잡아 단백질을 보충합니다.", icon: "🎣" },
    HUNTING: { name: "야생 추적", description: "짐승의 흔적을 쫓아 사냥하고 고기를 얻습니다.", icon: "🏹" },
    FORAGING: { name: "산야초 채집", description: "숲에서 먹을 수 있는 열매나 약초를 구분해냅니다.", icon: "🌿" },
    ADMINISTRATION: { name: "행정 처리", description: "물자 분배와 인력 배치를 체계적으로 관리합니다.", icon: "📑" },
    LOGISTICS: { name: "자원 관리", description: "보유한 물자의 소모를 최소화하고 재고를 파악합니다.", icon: "🧮" },
    NEGOTIATION: { name: "협상 기술", description: "다른 생존자와의 거래나 대화에서 유리한 고지를 점합니다.", icon: "🤝" },
    LEADERSHIP: { name: "카리스마", description: "사람들을 이끌어 집단의 사기와 결속력을 높입니다.", icon: "🗣️" },
    INVESTIGATION: { name: "수사 근성", description: "현장의 단서를 추적해 숨겨진 물자나 위험을 찾아냅니다.", icon: "🔍" },
    TEACHING: { name: "지식 전수", description: "자신이 가진 기술을 동료들에게 효율적으로 가르칩니다.", icon: "🎓" },
    ACCOUNTING: { name: "가치 평가", description: "아이템의 진정한 가치를 판별해 손해를 막습니다.", icon: "📉" },
    REPORTING: { name: "정보 수집", description: "주변 소문을 분석하거나 방송으로 정보를 얻습니다.", icon: "📰" },
    SECRETARY: { name: "보좌술", description: "리더의 결정을 돕고 스케줄을 효율적으로 조정합니다.", icon: "📅" },
    LAW_ENFORCEMENT: { name: "질서 유지", description: "그룹 내 규칙을 세우고 갈등을 법대로 중재합니다.", icon: "⚖️" },
    PLANNING: { name: "전략 수립", description: "장기적인 생존 계획을 세워 행동 실패를 줄입니다. ", icon: "📊" },
    PUBLIC_RELATIONS: { name: "이미지 메이킹", description: "자신의 평판을 관리해 신뢰를 얻습니다.", icon: "😎" },
    MUSIC: { name: "희망의 노래", description: "음악으로 동료들의 슬픔과 피로를 씻어냅니다.", icon: "🎵" },
    ACTING: { name: "메소드 연기", description: "자신의 감정이나 상태를 완벽하게 속여 위기를 넘깁니다.", icon: "🎭" },
    ARTISTIC: { name: "예술적 통찰", description: "창의적인 생각으로 예상치 못한 해결책을 제시합니다.", icon: "🎨" },
    ACROBATIC: { name: "유연한 몸놀림", description: "좁은 길을 통과하거나 추락 시 피해를 줄입니다.", icon: "🤸" },
    ATHLETICS: { name: "폭발적 근력", description: "무거운 짐을 들거나 문을 부수는 등 힘을 씁니다.", icon: "💪" },
    AGILITY: { name: "기동력", description: "좀비 사이를 빠르게 빠져나가거나 도망칩니다.", icon: "🏃" },
    STEALTH: { name: "은밀 기동", description: "소리 없이 움직여 좀비의 시선을 피합니다.", icon: "🤫" },
    SENSORY: { name: "절대 감각", description: "오감을 이용해 보이지 않는 위협을 먼저 감지합니다.", icon: "👂" },
    GAMER_REFLEX: { name: "반사 신경", description: "순간적인 판단과 빠른 손놀림으로 위기를 피합니다.", icon: "🕹️" },
    PERFORMANCE: { name: "매력 발산", description: "남들의 주목을 끌어 어그로를 담당하거나 호감을 얻습니다.", icon: "✨" },
    SPIRITUALITY: { name: "종교적 신념", description: "강한 신앙심으로 공포에 굴하지 않고 버팁니다.", icon: "🙏" },
    MEDITATION: { name: "명상법", description: "정적 속에서 정신력을 회복하고 집중력을 높입니다.", icon: "🧘" },
    DIVINATION: { name: "예지력", description: "앞으로 일어날 불행을 직감적으로 예고합니다.", icon: "🔮" },
    LUCK: { name: "도박사의 운", description: "절망적인 확률 속에서도 기적적으로 살아남습니다.", icon: "🎲" },
    SURVIVAL_INSTINCT: { name: "생존 본능", description: "죽음의 문턱에서 초인적인 힘을 발휘합니다.", icon: "🔥" },
    SCAVENGING: { name: "폐지 줍기", description: "남들이 지나친 쓰레기 더미에서 귀중품을 찾습니다.", icon: "📦" },
    INFILTRATION: { name: "잠입 기술", description: "폐쇄된 구역이나 적진에 몰래 들어갑니다.", icon: "🗝️" },
    POTENTIAL: { name: "성장 잠재력", description: "시간이 지날수록 모든 방면에서 빠르게 성장합니다.", icon: "🍼" }
};

export const ONE_OFF_NODES: Record<string, StoryNode> = {
    'tarot_start': {
        id: 'tarot_start',
        text: "🃏 낡은 타로 테이블 옆에 누군가 버리고 간 배낭이 있습니다. 안에서 통조림을 발견했습니다.",
        next: [
            { id: 'tarot_divination', weight: 0.0, choiceText: "운명 미리 읽기 (예지력 필요)", req: { skill: '예지력' } },
            { id: 'tarot_continue', weight: 1.0, choiceText: "카드 뽑기" }
        ],
        effect: { target: 'RANDOM_1', statChanges: { int: 1, cha: -1 }, skillsAdd: [S.DIVINATION], skillsRemove: ["이미지 메이킹"], loot: ['통조림'] }
    },
    'tarot_divination': {
        id: 'tarot_divination',
        text: "🔮 예지력 성공! 행운의 결과와 함께 하늘에서 보급품 상자가 떨어집니다.",
        effect: { target: 'RANDOM_1', hp: 50, sanity: 50, fatigue: -50, skillsAdd: [S.POTENTIAL], loot: ['통조림', '고기'] }
    },
    'tarot_continue': {
        id: 'tarot_continue',
        text: "🃏 카드를 선택합니다.",
        effect: { target: 'RANDOM_1', skillsRemove: ["성장 잠재력"] }
    },
    'sunny_day': { 
        id: 'sunny_day', 
        text: "☀️ 맑은 날입니다. 숲에서 잘 익은 야생 열매들과 채소들을 한가득 채집했습니다.", 
        next: [
          { id: 'sunny_meditation', weight: 0.0, choiceText: "단체 명상 수행 (명상법 필요)", req: { skill: '명상법' } },
          { id: 'training_gym', weight: 0.3, choiceText: "근력 강화 훈련" },
          { id: 'sunny_rest', weight: 0.7, choiceText: "개인 정비" }
        ],
        effect: { target: 'RANDOM_1', statChanges: { con: 1, agi: -1 }, skillsAdd: [S.FARMING], skillsRemove: ["야생 추적"], loot: ['채소', '채소', '채소'] } 
    },
    'training_gym': {
        id: 'training_gym',
        text: "💪 체력을 단련하고 단백질 보충을 위해 아껴둔 고기를 먹었습니다.",
        effect: { target: 'RANDOM_1', statChanges: { str: 1, agi: -1 }, fatigue: 20, hp: -5, skillsAdd: [S.MELEE_COMBAT], skillsRemove: ["은밀 기동"], loot: ['고기'] }
    },
    'library_study': {
        id: 'library_study',
        text: "📚 도서관 휴게실 자판기를 털어 대량의 간식거리를 확보했습니다.",
        next: [
            { id: 'skill_learn_medical', weight: 0.5, choiceText: "응급 처치법 학습" },
            { id: 'skill_learn_tech', weight: 0.5, choiceText: "기계 수리법 학습" }
        ],
        effect: { target: 'RANDOM_1', skillsAdd: [S.TEACHING], skillsRemove: ["근접 제압"], loot: ['초콜릿', '통조림'] }
    },
    'skill_learn_medical': {
        id: 'skill_learn_medical',
        text: "🩹 학습 성공. 도중에 찾은 환자용 영양식을 챙겼습니다.",
        effect: { target: 'RANDOM_1', statChanges: { int: 1, str: -1 }, skillsAdd: [S.FIRST_AID], fatigue: 15, skillsRemove: ["폭발 전문가"], loot: ['통조림'] }
    },
    'skill_learn_tech': {
        id: 'skill_learn_tech',
        text: "⚙️ 기술 학습 성공. 탕비실에서 남은 커피와 과자를 찾았습니다.",
        effect: { target: 'RANDOM_1', statChanges: { int: 1, cha: -1 }, skillsAdd: [S.MECHANIC], fatigue: 15, skillsRemove: ["희망의 노래"], loot: ['초콜릿'] }
    },
    'accident_injury': {
        id: 'accident_injury',
        text: "💥 사고 발생! 하지만 떨어진 곳에 우연히 누군가 숨겨둔 비상 식량 가방이 있었습니다.",
        effect: { target: 'RANDOM_1', hp: -20, statChanges: { agi: -1, con: 1 }, fatigue: 10, skillsRemove: ["근접 제압"], skillsAdd: [S.SURVIVAL_INSTINCT], loot: ['통조림', '고기'] }
    },
    'trauma_forgetting': {
        id: 'trauma_forgetting',
        text: "🤯 공황 상태. 스트레스로 인해 눈앞의 식량조차 보지 못하고 지나칩니다.",
        effect: { target: 'RANDOM_1', sanity: -30, skillsRemove: ["전술 사격", "트라우마 극복", "전술 지휘"], mentalState: 'Trauma' }
    },
    'shooting_range': {
        id: 'shooting_range',
        text: "🔫 사격장 관리소 냉장고에서 유통기한이 남은 소시지를 발견했습니다!",
        next: [
            { id: 'skill_gain_marksman', weight: 1.0, choiceText: "사격 집중 훈련" }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["종교적 신념"], loot: ['고기', '고기'] }
    },
    'skill_gain_marksman': {
        id: 'skill_gain_marksman',
        text: "🎯 훈련 성공. 기운을 내기 위해 통조림을 하나 먹었습니다.",
        effect: { target: 'RANDOM_1', statChanges: { agi: 1, str: -1 }, skillsAdd: [S.MARKSMANSHIP], fatigue: 25, skillsRemove: ["근접 제압"], loot: ['통조림'] }
    },
    'sunny_meditation': {
        id: 'sunny_meditation',
        text: "🧘 명상 중 주변에서 식용 버섯(채소)들을 발견해 챙겼습니다.",
        effect: { target: 'RANDOM_1', statChanges: { int: 1, agi: -1 }, skillsAdd: [S.MEDITATION], skillsRemove: ["폭발적 근력"], loot: ['채소', '채소'] }
    },
    'sunny_rest': { id: 'sunny_rest', text: "☀️ 평화로운 하루. 근처 덤불에서 산딸기(채소)를 한가득 땄습니다.", effect: { target: 'RANDOM_1', skillsRemove: ["매력 발산"], loot: ['채소', '채소'] } },
    'foggy_day': { 
        id: 'foggy_day', 
        text: "🌫️ 안개 속을 헤매다 누군가 떨어뜨린 식량 배낭을 주웠습니다.", 
        effect: { target: 'RANDOM_1', fatigue: 5, skillsRemove: ["전략 수립"], loot: ['통조림', '고기'] } 
    },
    'heavy_rain': { 
        id: 'heavy_rain', 
        text: "🌧️ 장대비가 내립니다. 빗물에 씻겨 내려온 싱싱한 채소들을 강가에서 건졌습니다.", 
        effect: { target: 'RANDOM_1', fatigue: -5, sanity: 5, skillsRemove: ["이미지 메이킹"], loot: ['채소', '채소'] } 
    },
    'heatwave': {
        id: 'heatwave',
        text: "🔥 폭염. 다행히 근처 아이스크림 가게 냉동고 구석에서 녹지 않은 캔 음료와 간식을 찾았습니다.",
        effect: { target: 'RANDOM_1', hp: -2, fatigue: 10, statChanges: { con: -1 }, skillsRemove: ["해독술", "산야초 채집", "명상법"], loot: ['초콜릿'] }
    },
    'thunderstorm': {
        id: 'thunderstorm',
        text: "⛈️ 번개 치는 밤. 무너진 창고 안에서 비를 피하다가 통조림 박스를 발견했습니다.",
        effect: { target: 'RANDOM_1', sanity: -5, fatigue: 5, skillsRemove: ["정보 수집"], loot: ['통조림', '통조림'] }
    },
    'full_moon': {
        id: 'full_moon',
        text: "🌕 달빛 아래서 좀비 무리의 배낭을 몰래 털어 식량을 확보했습니다.",
        effect: { target: 'RANDOM_1', sanity: -5, skillsRemove: ["잠입 기술"], loot: ['통조림', '고기'] }
    },
    'starry_night': {
        id: 'starry_night',
        text: "🌠 별을 보며 소원을 빌자, 다음 날 아침 문 앞에 누군가 식량 배낭을 두고 갔습니다.",
        effect: { target: 'RANDOM_1', sanity: 10, statChanges: { cha: 1 }, skillsAdd: [S.SPIRITUALITY], loot: ['통조림', '고기', '채소'] }
    },
    'quiet_day': { 
        id: 'quiet_day', 
        text: "🤫 고요한 하루. 여유롭게 주변 상점가를 뒤져 대량의 식량을 확보했습니다.", 
        effect: { target: 'RANDOM_1', fatigue: -5, skillsRemove: ["전술 지휘"], loot: ['통조림', '통조림', '통조림', '고기'] } 
    },
    'horde_pass': { 
        id: 'horde_pass', 
        text: "🧟‍♂️ 좀비 떼가 지나간 자리에서 그들이 밟지 않은 온전한 식량 상자를 발견했습니다!",
        effect: { target: 'RANDOM_1', fatigue: 15, sanity: -5, skillsAdd: [S.AMBUSH], skillsRemove: ["매복 습격"], loot: ['통조림', '통조림', '고기', '채소'] } 
    },
    'helicopter': { 
        id: 'helicopter', 
        text: "🚁 헬기가 보급품 상자 하나를 떨어뜨리고 사라졌습니다! 통조림이 가득합니다.", 
        effect: { target: 'RANDOM_1', sanity: -5, skillsRemove: ["희망의 노래"], loot: ['통조림', '통조림', '통조림', '통조림'] } 
    },
    'nightmare_shared': {
        id: 'nightmare_shared',
        text: "😱 악몽을 꿨지만, 깨어보니 품속에 챙겨뒀던 초콜릿이 남아있어 위안을 얻습니다.",
        next: [
          { id: 'nightmare_mental', weight: 0.0, choiceText: "동료 심리 케어 (심리 상담 필요)", req: { skill: '심리 상담' } },
          { id: 'nightmare_continue', weight: 1.0 }
        ],
        effect: { target: 'RANDOM_1', sanity: -5, fatigue: 10, skillsRemove: ["협상 기술"], loot: ['초콜릿'] }
    },
    'nightmare_mental': {
        id: 'nightmare_mental',
        text: "상담 성공. 안정제로 마음을 달래고 영양 가득한 스튜(고기)를 함께 나눠먹었습니다.",
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: -5, statChanges: { cha: 1 }, skillsAdd: [S.MENTAL_CARE], loot: ['고기', '채소'] }
    },
    'nightmare_continue': { id: 'nightmare_continue', text: "😱 힘든 밤이었지만 남은 통조림 하나로 배를 채웁니다.", effect: { target: 'RANDOM_1', skillsRemove: ["심리 상담", "희망의 노래"], loot: ['통조림'] } },
    'old_music': {
        id: 'old_music',
        text: "🎵 음악을 들으며 아껴둔 간식을 먹으니 잠시나마 행복해집니다.",
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.MUSIC], loot: ['초콜릿', '통조림'] }
    },
    'board_game': {
        id: 'board_game',
        text: "🎲 게임 내기에서 이겨 동료들의 비상 식량 일부를 따냈습니다.",
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: -5, statChanges: { int: 1 }, skillsAdd: [S.LOGISTICS], loot: ['통조림', '초콜릿'] }
    },
    'stray_dog': {
        id: 'stray_dog',
        text: "🐕 개가 입에 통조림 하나를 물고 나타났습니다.",
        next: [
          { id: 'dog_livestock', weight: 0.0, choiceText: "동물 길들이기 (가축 사육 필요)", req: { skill: '가축 사육' } },
          { id: 'dog_friend', weight: 1.0, choiceText: "먹이 주기" }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["수사 근성"], loot: ['통조림'] }
    },
    'dog_livestock': {
        id: 'dog_livestock',
        text: "🐄 개가 숲속에 숨겨진 비밀 식량 창고로 우리를 안내했습니다!",
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: -10, skillsAdd: [S.LIVESTOCK], loot: ['통조림', '통조림', '고기', '고기', '채소'] }
    },
    'dog_friend': { id: 'dog_friend', text: "🐕 개와 통조림을 나눠먹었습니다.", effect: { target: 'ALL', sanity: 5, loot: ['통조림'] } },
    'rat_swarm': {
        id: 'rat_swarm',
        text: "🐀 쥐 떼가 식량 창고를 습격했습니다! 하지만 도망가는 쥐들을 잡아 단백질(고기)을 보충했습니다(?).",
        effect: { target: 'RANDOM_1', sanity: -5, inventoryRemove: ['통조림'], skillsRemove: ["위생 관리", "식량 생산"], loot: ['고기', '고기'] }
    },
    'abandoned_truck': {
        id: 'abandoned_truck',
        text: "🚚 택배 트럭입니다! 안에는 자재뿐만 아니라 배달 중이던 신선식품 박스들이 가득합니다.",
        next: [
            { id: 'truck_scavenge', weight: 0.0, choiceText: "버려진 상자 정밀 수색 (폐지 줍기 필요)", req: { skill: '폐지 줍기' } },
            { id: 'truck_lockpick', weight: 0.0, choiceText: "자물쇠 해킹 (전자 공학 필요)", req: { skill: '전자 공학' } },
            { id: 'truck_lockpick_mech', weight: 0.0, choiceText: "자물쇠 따기 (기계 수리 필요)", req: { skill: '기계 수리' } },
            { id: 'truck_force', weight: 1.0, choiceText: "힘으로 부수기 (피로도 증가)" }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["미적 감각"], loot: ['통조림'] }
    },
    'truck_scavenge': {
        id: 'truck_scavenge',
        text: "📦 정밀 수색 성공! 터지지 않은 냉동 식품(고기)과 통조림 무더기를 찾아냈습니다.",
        effect: { target: 'RANDOM_1', loot: ['목재', '고철', '백신', '통조림', '통조림', '고기', '고기'], sanity: 10, skillsAdd: [S.SCAVENGING, S.INVESTIGATION] }
    },
    'truck_lockpick': {
        id: 'truck_lockpick',
        text: "🔧 잠금 해제. 트럭 안쪽의 신선도 유지 박스에서 채소와 고기를 대량 확보했습니다!",
        effect: { target: 'RANDOM_1', loot: ['목재', '목재', '고철', '부품', '고기', '채소'], sanity: 5, skillsAdd: [S.ELECTRONICS] }
    },
    'truck_lockpick_mech': { 
        id: 'truck_lockpick_mech', 
        text: "🔧 문을 열었습니다. 안에는 장기 보관용 비상 식량 상자들이 가득합니다.", 
        effect: { target: 'RANDOM_1', loot: ['목재', '고철', '고철', '부품', '통조림', '통조림', '통조림'], sanity: 5, skillsAdd: [S.MECHANIC] } 
    },
    'truck_force': {
        id: 'truck_force',
        text: "🔨 문을 부쉈습니다. 도중에 식량 일부가 파손되었지만 고기 몇 덩어리를 건졌습니다.",
        effect: { target: 'RANDOM_1', statChanges: { str: 1, int: -1 }, skillsAdd: [S.ATHLETICS], loot: ['목재', '고철', '고기'], fatigue: 15, skillsRemove: ["수사 근성"] }
    },
    'pharmacy_ruin': {
        id: 'pharmacy_ruin',
        text: "💊 약국 금고 뒤에서 약사가 숨겨둔 고칼로리 영양 간식들을 발견했습니다.",
        next: [
          { id: 'pharmacy_detox', weight: 0.0, choiceText: "해독제 조제 시도 (해독술 필요)", req: { skill: '해독술' } },
          { id: 'pharmacy_loot', weight: 1.0 }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["가치 평가"], loot: ['초콜릿', '통조림'] }
    },
    'pharmacy_detox': {
        id: 'pharmacy_detox',
        text: "🧪 조제 성공. 기운을 차리기 위해 다량의 영양 통조림을 함께 챙겼습니다.",
        effect: { target: 'RANDOM_1', loot: ['백신', '항생제', '붕대', '통조림', '통조림'], infection: -30, skillsAdd: [S.HYGIENE_CONTROL, S.DETOX] }
    },
    'pharmacy_loot': { id: 'pharmacy_loot', text: "💊 물자와 함께 직원용 비상 식량을 챙겼습니다.", effect: { target: 'ALL', loot: ['붕대', '항생제', '비타민', '백신', '통조림', '통조림'] } },
    'creepy_doll': {
        id: 'creepy_doll',
        text: "🧸 인형의 배를 갈라보니 그 안에 숨겨진 초콜릿 바가 들어있었습니다.",
        effect: { target: 'RANDOM_1', sanity: -5, skillsRemove: ["예술적 통찰", "종교적 신념"], loot: ['초콜릿'] }
    },
    'flower_field': {
        id: 'flower_field',
        text: "🌸 꽃밭 주변에서 식용 가능한 야생 채소들을 한가득 채집했습니다.",
        effect: { target: 'RANDOM_1', sanity: 5, statChanges: { cha: 1 }, skillsAdd: [S.ARTISTIC, S.FORAGING], loot: ['채소', '채소', '채소'] }
    },
    'weapon_maintenance': {
        id: 'weapon_maintenance',
        text: "🔫 정비하는 동안 주변을 수색해 버려진 캠핑용 통조림들을 찾았습니다.",
        next: [
          { id: 'weapon_expert', weight: 0.0, choiceText: "병기 관리 전문가의 정비 (병기 관리 필요)", req: { skill: '병기 관리' } },
          { id: 'weapon_basic', weight: 1.0 }
        ],
        effect: { target: 'RANDOM_1', fatigue: 5, sanity: 5, skillsAdd: [S.WEAPON_MAINTENANCE], loot: ['통조림'] }
    },
    'weapon_expert': {
        id: 'weapon_expert',
        text: "🔧 정비 성공. 고마움의 표시로 동료들이 자신의 통조림을 하나씩 내놓았습니다.",
        effect: { target: 'RANDOM_1', sanity: 15, kill: 2, fatigue: -5, skillsAdd: [S.WEAPON_MAINTENANCE], loot: ['통조림', '통조림'] }
    },
    'weapon_basic': { id: 'weapon_basic', text: "🔫 정비 완료. 남은 통조림 하나를 나눠먹었습니다.", effect: { target: 'RANDOM_1', skillsRemove: ["병기 관리"], loot: ['통조림'] } },
    'cannibal_meal': {
        id: 'cannibal_meal',
        text: "🍖 충격적인 광경... 하지만 그 옆의 상자엔 진짜 '통조림'들이 가득합니다.",
        next: [
          { id: 'cannibal_cook', weight: 0.0, choiceText: "거부감 없는 요리 가공 (요리 마스터 필요)", req: { skill: '요리 마스터' } },
          { id: 'cannibal_eat', weight: 0.5, choiceText: "눈을 감고 먹기" },
          { id: 'cannibal_ignore', weight: 0.5 }
        ],
        effect: { target: 'RANDOM_1', sanity: -20, skillsRemove: ["카리스마"], loot: ['통조림', '통조림'] }
    },
    'cannibal_cook': {
        id: 'cannibal_cook',
        text: "🍳 요리 마스터의 솜씨로 짐승의 고기(?)와 채소들을 완벽한 보존 식품으로 가공했습니다.",
        effect: { target: 'RANDOM_1', loot: ['통조림', '통조림', '고기', '고기', '채소'], sanity: 10, skillsAdd: [S.COOKING] }
    },
    'cannibal_eat': { id: 'cannibal_eat', text: "🍖 배는 부르지만 정신이 나갈 것 같습니다.", effect: { target: 'RANDOM_1', hp: 20, sanity: -30, statChanges: { con: -1 }, skillsRemove: ["요리 마스터"], loot: ['고기', '고기'] } },
    'cannibal_ignore': { id: 'cannibal_ignore', text: "🚫 무시합니다. 다행히 근처에서 통조림 하나를 주웠습니다.", effect: { target: 'RANDOM_1', skillsRemove: ["보좌술"], loot: ['통조림'] } },
    'vaccine_drop': {
        id: 'vaccine_drop',
        text: "🚁 드론 잔해 옆에 보급용 고열량 초콜릿 박스가 떨어져 있습니다!",
        effect: { target: 'RANDOM_1', sanity: 15, loot: ['백신', '초콜릿', '초콜릿', '초콜릿'], skillsRemove: ["행정 처리"] }
    },
    'military_convoy': {
        id: 'military_convoy',
        text: "🚛 군용 수송 차량! 화물 칸엔 엄청난 양의 전투 식량(통조림)이 실려있습니다!",
        next: [
            { id: 'convoy_accounting', weight: 0.0, choiceText: "운송장 가치 산정 (가치 평가 필요)", req: { skill: '가치 평가' } },
            { id: 'convoy_loot', weight: 0.5, choiceText: "수색 강행 (백신/무기/식량, 위험)" },
            { id: 'convoy_ignore', weight: 0.5, choiceText: "무시하고 이동 (안전)" }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["질서 유지"], loot: ['통조림', '통조림'] }
    },
    'convoy_accounting': {
        id: 'convoy_accounting',
        text: "📈 가치 평가 성공. 가장 영양가 높고 무거운 식량 박스들만 골라 담았습니다.",
        effect: { target: 'RANDOM_1', loot: ['백신', '백신', '항생제', '통조림', '통조림', '통조림', '고기', '고기'], sanity: 10, skillsAdd: [S.LOGISTICS] }
    },
    'convoy_loot': {
        id: 'convoy_loot',
        text: "📦 위험한 수색 성공! 전투 식량 수십 팩과 약품을 확보했습니다.",
        effect: { target: 'RANDOM_1', sanity: 5, hp: -10, loot: ['백신', '권총', '통조림', '통조림', '통조림', '고기'], statChanges: { str: 1 }, skillsRemove: ["자원 관리"] }
    },
    'convoy_ignore': {
        id: 'convoy_ignore',
        text: "👀 무시하고 지나가다 길가에서 떨어진 통조림 하나를 발견합니다.",
        effect: { target: 'ALL', fatigue: 5, loot: ['통조림'] }
    },
    'oneoff_locked_box': {
        id: 'oneoff_locked_box',
        text: "🔒 보급 상자입니다! 묵직한 것이 식량이 가득 든 것 같습니다.",
        next: [
            { id: 'box_crafting', weight: 0.0, choiceText: "수제 도구로 해체 (도구 제작 필요)", req: { skill: '도구 제작' } },
            { id: 'box_knife', weight: 0.0, choiceText: "맥가이버 칼로 따기 (맥가이버 칼 필요)", req: { item: '맥가이버 칼' } },
            { id: 'box_smash', weight: 1.0, choiceText: "돌로 내리찍기 (소음 발생)" }
        ]
    },
    'box_crafting': {
        id: 'box_crafting',
        text: "⚒️ 상자를 열었습니다! 통조림과 비타민이 가득합니다.",
        effect: { target: 'RANDOM_1', loot: ['부품', '고철', '비타민', '통조림', '통조림'], sanity: 5, skillsAdd: [S.CRAFTING] }
    },
    'box_knife': {
        id: 'box_knife',
        text: "🔪 정밀 해체 성공. 파손 없이 대량의 식량과 무기를 챙겼습니다.",
        effect: { target: 'ALL', loot: ['권총', '부품', '고철', '지도', '통조림', '통조림', '고기'], sanity: 10 }
    },
    'box_smash': {
        id: 'box_smash',
        text: "🔨 억지로 열었습니다. 식량 일부가 으깨졌지만 통조림 두 개는 건졌습니다.",
        effect: { target: 'RANDOM_1', statChanges: { str: 1, agi: -1 }, skillsAdd: [S.RECYCLING], loot: ['고철', '고철', '통조림', '통조림'], fatigue: 15, skillsRemove: ["도구 제작"] }
    },

    'oneoff_hardware_store': {
        id: 'oneoff_hardware_store',
        text: "🔨 철물점 카운터 뒤에서 직원이 숨겨둔 통조림 무더기를 발견했습니다!",
        next: [
            { id: 'hardware_expert', weight: 0.0, choiceText: "전문가적 수색 (기계 수리 필요)", req: { skill: '기계 수리' } },
            { id: 'hardware_loot', weight: 1.0, choiceText: "자재 챙기기" }
        ],
        effect: { target: 'ALL', loot: ['목재', '고철', '통조림', '통조림'] }
    },
    'hardware_expert': {
        id: 'hardware_expert',
        text: "🔧 정밀 수색 성공. 자재와 함께 보존 처리가 된 고기 팩들을 찾아냈습니다.",
        effect: { target: 'RANDOM_1', loot: ['공구세트', '목재', '부품', '고기', '고기'], sanity: 10, skillsAdd: [S.MECHANIC] }
    },
    'hardware_loot': {
        id: 'hardware_loot',
        text: "📦 자재와 함께 구석의 통조림들을 배낭에 가득 채웠습니다.",
        effect: { target: 'ALL', loot: ['목재', '목재', '고철', '통조림', '통조림'], fatigue: 15 }
    },

    'oneoff_construction_site': {
        id: 'oneoff_construction_site',
        text: "🏗️ 공사장 현장 사무실에서 인부들이 남긴 대량의 컵라면(통조림 대체)과 간식을 발견했습니다.",
        next: [
            { id: 'const_athletics', weight: 0.0, choiceText: "무거운 자재 운반 (폭발적 근력 필요)", req: { skill: '폭발적 근력' } },
            { id: 'const_basic', weight: 1.0, choiceText: "조심해서 나르기" }
        ],
        effect: { target: 'ALL', loot: ['목재', '통조림', '통조림'] }
    },
    'const_athletics': {
        id: 'const_athletics',
        text: "💪 근력을 발휘해 자재와 함께 식량 박스들을 통째로 옮겼습니다.",
        effect: { target: 'RANDOM_1', loot: ['시멘트', '목재', '목재', '통조림', '통조림', '통조림'], fatigue: 20, statChanges: { str: 1 } }
    },
    'const_basic': {
        id: 'const_basic',
        text: "🧱 자재를 옮기며 발견한 통조림들을 챙겼습니다.",
        effect: { target: 'ALL', loot: ['시멘트', '목재', '통조림'], fatigue: 30 }
    },

    'oneoff_scrap_yard': {
        id: 'oneoff_scrap_yard',
        text: "🚗 폐차장 사무실 냉장고에서 마른 고기와 통조림을 찾아냈습니다.",
        next: [
            { id: 'scrap_recycle', weight: 0.0, choiceText: "부품 정밀 추출 (부품 재활용 필요)", req: { skill: '부품 재활용' } },
            { id: 'scrap_loot', weight: 1.0, choiceText: "쓸만한 고철 줍기" }
        ],
        effect: { target: 'ALL', loot: ['고철', '통조림'] }
    },
    'scrap_recycle': {
        id: 'scrap_recycle',
        text: "🛠️ 재활용 성공. 도중에 차량 트렁크에서 발견된 비상 식량 세트를 챙겼습니다.",
        effect: { target: 'RANDOM_1', loot: ['부품', '부품', '고철', '통조림', '통조림'], sanity: 5, skillsAdd: [S.RECYCLING] }
    },
    'scrap_loot': {
        id: 'scrap_loot',
        text: "⚙️ 고철과 함께 버려진 통조림들을 모았습니다.",
        effect: { target: 'ALL', loot: ['고철', '고철', '부품', '통조림'], fatigue: 10 }
    },

    'oneoff_renovation_house': {
        id: 'oneoff_renovation_house',
        text: "🏠 저택 주방 펜트리에서 유통기한이 넉넉한 식재료들을 대량 발견했습니다!",
        next: [
            { id: 'reno_scavenge', weight: 0.0, choiceText: "고급 자재 선별 (폐지 줍기 필요)", req: { skill: '폐지 줍기' } },
            { id: 'reno_loot', weight: 1.0, choiceText: "판자 챙기기" }
        ],
        effect: { target: 'ALL', loot: ['목재', '통조림', '통조림', '채소', '채소'] }
    },
    'reno_scavenge': {
        id: 'reno_scavenge',
        text: "📦 정밀 수색 성공! 숨겨진 프리미엄 고기 통조림들과 비타민을 찾아냈습니다.",
        effect: { target: 'RANDOM_1', loot: ['목재', '목재', '공구세트', '고기', '고기', '비타민'], skillsAdd: [S.SCAVENGING] }
    },
    'reno_loot': {
        id: 'reno_loot',
        text: "🪵 판자와 함께 주방의 통조림들을 배낭 가득 챙겼습니다.",
        effect: { target: 'ALL', loot: ['목재', '목재', '부품', '통조림', '통조림'] }
    },

    'oneoff_utility_van': {
        id: 'oneoff_utility_van',
        text: "Van 🚐 차량 조수석에서 직원이 먹다 남긴 햄버거(고기)와 통조림을 발견했습니다.",
        next: [
            { id: 'van_elec', weight: 0.0, choiceText: "전자 부품 확보 (전자 공학 필요)", req: { skill: '전자 공학' } },
            { id: 'van_loot', weight: 1.0, choiceText: "장비 털기" }
        ],
        effect: { target: 'ALL', loot: ['부품', '고기', '통조림'] }
    },
    'van_elec': {
        id: 'van_elec',
        text: "📟 전자 부품과 함께 차량용 비상 식량 세트를 획득했습니다.",
        effect: { target: 'RANDOM_1', loot: ['부품', '부품', '공구세트', '통조림', '통조림'], skillsAdd: [S.ELECTRONICS] }
    },
    'van_loot': {
        id: 'van_loot',
        text: "🔧 장비와 함께 좌석 밑의 통조림들을 챙겼습니다.",
        effect: { target: 'ALL', loot: ['부품', '고철', '목재', '통조림'], fatigue: 10 }
    },

    'oneoff_confusing_path': {
        id: 'oneoff_confusing_path',
        text: "🌫️ 길을 잃었지만, 다행히 안개 속에 숨겨져 있던 보급 상자를 발견했습니다.",
        next: [
            { id: 'path_planning', weight: 0.0, choiceText: "기후 패턴 분석 (전략 수립 필요)", req: { skill: '전략 수립' } },
            { id: 'path_map', weight: 0.0, choiceText: "지도로 위치 확인 (지도 필요)", req: { item: '지도' } },
            { id: 'path_guess', weight: 1.0, choiceText: "감으로 찍어서 이동" }
        ],
        effect: { target: 'ALL', loot: ['통조림'] }
    },
    'path_planning': {
        id: 'path_planning',
        text: "📊 분석 성공. 안전한 지름길에 있는 편의점에서 식량을 대량 확보했습니다.",
        effect: { target: 'RANDOM_1', fatigue: -10, sanity: 10, statChanges: { int: 1 }, skillsAdd: [S.PLANNING], loot: ['통조림', '통조림', '고기'] }
    },
    'path_map': {
        id: 'path_map',
        text: "🗺️ 지도 확인 성공! 근처 안전 가옥의 식량 창고 좌표를 알아냈습니다.",
        effect: { target: 'ALL', fatigue: -20, hp: 5, sanity: 5, loot: ['통조림', '통조림', '통조림', '채소'] }
    },
    'path_guess': {
        id: 'path_guess',
        text: "🌀 길을 헤매다 가방이 나무에 걸려 식량 일부를 잃어버렸습니다.",
        effect: { target: 'RANDOM_1', statChanges: { int: -1, con: 1 }, skillsAdd: [S.SURVIVAL_INSTINCT], fatigue: 20, sanity: -5, skillsRemove: ["전략 수립"], inventoryRemove: ['통조림'] }
    },
    'oneoff_zombie_dog': {
        id: 'oneoff_zombie_dog',
        text: "🐕 좀비견들이 지키고 있는 뼈다귀(?) 무더기 사이에서 신선한 고기 팩들을 발견했습니다.",
        next: [
            { id: 'dog_animal', weight: 0.0, choiceText: "야생 동물의 위협 모방 (야생 추적 필요)", req: { skill: '야생 추적' } },
            { id: 'dog_shoot', weight: 0.0, choiceText: "권총 사격 (권총 필요)", req: { item: '권총' } },
            { id: 'dog_fight', weight: 1.0, choiceText: "근접전 돌입 (부상 위험)" }
        ],
        effect: { target: 'ALL', loot: ['고기'] }
    },
    'dog_animal': {
        id: 'dog_animal',
        text: "🏹 쫓아내기 성공! 좀비견들이 버리고 간 다량의 고기들을 모두 챙겼습니다.",
        effect: { target: 'RANDOM_1', sanity: 15, statChanges: { cha: 1 }, skillsAdd: [S.HUNTING], loot: ['고기', '고기', '고기'] }
    },
    'dog_shoot': {
        id: 'dog_shoot',
        text: "🔫 사격 성공. 위협 요소를 제거하고 고기를 확보했습니다.",
        effect: { target: 'ALL', sanity: 5, fatigue: 5, loot: ['고기', '고기'] }
    },
    'dog_fight': {
        id: 'dog_fight',
        text: "⚔️ 난전 승리. 다쳤지만 고기는 얻었습니다.",
        effect: { target: 'RANDOM_1', statChanges: { con: -1, str: 1 }, skillsAdd: [S.MELEE_COMBAT], hp: -20, infection: 15, fatigue: 20, skillsRemove: ["야생 추적"], loot: ['고기'] }
    },
    'oneoff_faint_signal': {
        id: 'oneoff_faint_signal',
        text: "📡 통신탑 근처 보관함에서 관리자용 비상 통조림들을 발견했습니다.",
        next: [
            { id: 'signal_reporting', weight: 0.0, choiceText: "전파 소스 정보 분석 (정보 수집 필요)", req: { skill: '정보 수집' } },
            { id: 'signal_radio', weight: 0.0, choiceText: "주파수 스캔 (무전기 필요)", req: { item: '무전기' } },
            { id: 'signal_ignore', weight: 1.0, choiceText: "무시하고 이동" }
        ],
        effect: { target: 'ALL', loot: ['통조림', '통조림'] }
    },
    'signal_reporting': {
        id: 'signal_reporting',
        text: "📰 분석 성공. 인근 군 보급품 낙하지점 정보를 알아내 식량을 챙겼습니다.",
        effect: { target: 'RANDOM_1', sanity: 20, fatigue: -10, statChanges: { int: 1 }, skillsAdd: [S.REPORTING], loot: ['통조림', '통조림', '통조림'] }
    },
    'signal_radio': {
        id: 'signal_radio',
        text: "📻 무전 스캔 성공! 보급품 위치를 알아내어 풍족하게 챙겼습니다.",
        effect: { target: 'ALL', loot: ['통조림', '통조림', '통조림', '고기', '안정제'], sanity: 10 }
    },
    'signal_ignore': {
        id: 'signal_ignore',
        text: "🔇 무시합니다. 배가 고파 도중에 찾은 통조림 하나를 먹었습니다.",
        effect: { target: 'RANDOM_1', fatigue: 5, skillsRemove: ["정보 수집"], loot: ['통조림'] }
    },
    'oneoff_broken_bridge': {
        id: 'oneoff_broken_bridge',
        text: "🌉 다리 너머에 떨어진 보급품 가방이 보입니다. 건너가서 가져와야 합니다.",
        next: [
            { id: 'bridge_carpentry', weight: 0.0, choiceText: "나무 다리 보강 (구조물 강화 필요)", req: { skill: '구조물 강화' } },
            { id: 'bridge_cut', weight: 0.0, choiceText: "덩굴 잘라 밧줄 만들기 (맥가이버 칼 필요)", req: { item: '맥가이버 칼' } },
            { id: 'bridge_tech', weight: 0.0, choiceText: "임시 다리 건설 (기계 수리 필요)", req: { skill: '기계 수리' } },
            { id: 'bridge_detour', weight: 1.0, choiceText: "먼 길로 우회하기" }
        ]
    },
    'bridge_carpentry': {
        id: 'bridge_carpentry',
        text: "🪵 보강 성공. 안전하게 다리를 건너 보급품 가방 속의 대량 식량을 차지했습니다.",
        effect: { target: 'ALL', fatigue: -10, sanity: 15, loot: ['통조림', '통조림', '고기', '채소'] }
    },
    'bridge_cut': {
        id: 'bridge_cut',
        text: "🔪 밧줄 성공. 신속하게 건너가 가방 속의 통조림들을 챙겼습니다.",
        effect: { target: 'ALL', fatigue: -15, sanity: 5, statChanges: { agi: 1 }, loot: ['통조림', '통조림', '고기'] }
    },
    'bridge_tech': {
        id: 'bridge_tech',
        text: "🔧 건설 성공. 모두가 건너가서 흩어진 식량들을 꼼꼼히 주워 모았습니다.",
        effect: { target: 'RANDOM_1', fatigue: -15, sanity: 5, skillsAdd: [S.CRAFTING], loot: ['통조림', '통조림', '채소'] }
    },
    'bridge_detour': {
        id: 'bridge_detour',
        text: "🚶 우회 성공. 가는 길에 야생 고구마(채소)를 조금 캤습니다.",
        effect: { target: 'ALL', fatigue: 25, hp: -5, statChanges: { con: -1 }, loot: ['채소', '채소'] }
    },

    // --- DICE CHALLENGES (보너스 식량 강화) ---
    'dice_tripwire': {
        id: 'dice_tripwire',
        text: "🧶 함정 발견. 옆에 함정을 설치한 생존자가 남긴 식량 자루가 있습니다.",
        next: [
            {
                id: 'dice_tripwire_success',
                weight: 1.0,
                choiceText: "함정 뛰어넘기 (민첩 기반)",
                dice: { threshold: 75, stat: 'agi', successId: 'dice_tripwire_success', failId: 'dice_tripwire_fail', hpPenalty: -20 }
            }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["함정 설치"], loot: ['통조림'] }
    },
    'dice_tripwire_success': {
        id: 'dice_tripwire_success',
        text: "🤸 성공! 함정을 무시하고 주인 없는 식량 자루를 통째로 차지했습니다.",
        effect: { target: 'RANDOM_1', sanity: 5, statChanges: { agi: 1 }, skillsAdd: [S.AGILITY, S.TRAP_SETTING], loot: ['통조림', '통조림', '고기'] }
    },
    'dice_locked_pharmacy': {
        id: 'dice_locked_pharmacy',
        text: "🏪 약국 셔터 안쪽 카운터에 영양 식품들이 가득 쌓여있습니다.",
        next: [
            {
                id: 'dice_pharmacy_success',
                weight: 1.0,
                choiceText: "정밀하게 자물쇠 따기 (지능 기반)",
                dice: { threshold: 80, stat: 'int', successId: 'dice_pharmacy_success', failId: 'dice_pharmacy_fail', sanityPenalty: -10 }
            }
        ]
    },
    'dice_pharmacy_success': {
        id: 'dice_pharmacy_success',
        text: "🔓 성공! 의약품뿐만 아니라 대량의 고에너지 통조림과 채소 보충제를 확보했습니다.",
        effect: { target: 'ALL', loot: ['항생제', '붕대', '비타민', '통조림', '통조림', '통조림', '채소'], sanity: 10, statChanges: { int: 1 } }
    },
    'dice_stuck_crate': {
        id: 'dice_stuck_crate',
        text: "📦 거대한 나무 상자! '식량 보급품'이라고 적혀 있습니다.",
        next: [
            {
                id: 'dice_crate_success',
                weight: 1.0,
                choiceText: "강제로 열기 (힘 기반)",
                dice: { threshold: 75, stat: 'str', successId: 'dice_crate_success', failId: 'dice_crate_fail', hpPenalty: -5 }
            }
        ]
    },
    'dice_crate_success': {
        id: 'dice_crate_success',
        text: "🔓 성공! 안에는 프리미엄 햄 통조림과 건조 야채들이 가득합니다.",
        effect: { target: 'RANDOM_1', loot: ['통조림', '통조림', '통조림', '통조림', '고기', '채소'], statChanges: { str: 1 }, skillsAdd: [S.RECYCLING] }
    },
    'dice_plane_crash': {
        id: 'dice_plane_crash',
        text: "✈️ 추락한 화물기! 기내 식당 구역이 온전해 보입니다.",
        next: [{
            id: 'dice_plane_success', weight: 1.0, choiceText: "잔해 속으로 뛰어들기 (민첩 기반)",
            dice: { threshold: 80, stat: 'agi', successId: 'dice_plane_success', failId: 'dice_plane_fail', hpPenalty: -30 }
        }]
    },
    'dice_plane_success': { id: 'dice_plane_success', text: "📦 성공! 승객용 기내식 통조림 수십 개와 고기 팩을 챙겨 나왔습니다.", effect: { target: 'ALL', loot: ['붕대', '통조림', '통조림', '통조림', '고기', '고기', '비타민'], sanity: 5 } },

    'dice_cluttered_attic': {
        id: 'dice_cluttered_attic',
        text: "🏘️ 다락방 수색. 누군가 숨겨둔 대량의 비상 식량이 보입니다.",
        next: [{
            id: 'dice_attic_success', weight: 1.0, choiceText: "살금살금 오르기 (민첩 기반)",
            dice: { threshold: 70, stat: 'agi', successId: 'dice_attic_success', failId: 'dice_attic_fail', hpPenalty: -20 }
        }]
    },
    'dice_attic_success': { id: 'dice_attic_success', text: "📦 성공! 먼지 쌓인 상자 안에서 통조림 5캔과 초콜릿을 찾아냈습니다.", effect: { target: 'RANDOM_1', loot: ['통조림', '통조림', '통조림', '통조림', '통조림', '초콜릿'], sanity: 5, skillsAdd: [S.GAMER_REFLEX] } },

    'dice_iron_door': {
        id: 'dice_iron_door',
        text: "🚪 철문 뒤의 비밀 저장고! 식량이 가득할 것 같습니다.",
        next: [{
            id: 'dice_iron_success', weight: 1.0, choiceText: "문 벌리기 (힘 기반)",
            dice: { threshold: 75, stat: 'str', successId: 'dice_iron_success', failId: 'dice_iron_fail', hpPenalty: -10 }
        }]
    },
    'dice_iron_success': { id: 'dice_iron_success', text: "🔓 성공! 안쪽에는 대량의 전투 식량과 고기 보존식이 있었습니다.", effect: { target: 'ALL', loot: ['통조림', '통조림', '통조림', '고기', '고기', '붕대'], statChanges: { str: 1 } } }
};
