
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
        text: "🃏 안개 낀 거리 한복판에 낡은 타로 천이 깔린 테이블이 놓여 있습니다. 운명의 카드가 우리를 기다립니다.",
        next: [
            { id: 'tarot_divination', weight: 0.0, choiceText: "운명 미리 읽기 (예지력 필요)", req: { skill: '예지력' } },
            { id: 'tarot_continue', weight: 1.0, choiceText: "카드 뽑기" }
        ],
        effect: { target: 'RANDOM_1', statChanges: { int: 1, cha: -1 }, skillsAdd: [S.DIVINATION], skillsRemove: ["이미지 메이킹"] }
    },
    'tarot_divination': {
        id: 'tarot_divination',
        text: "🔮 예지력 스킬로 불길한 카드를 미리 골라내고 가장 행운이 가득한 결과를 확정지었습니다.",
        effect: { target: 'RANDOM_1', hp: 50, sanity: 50, fatigue: -50, skillsAdd: [S.POTENTIAL] }
    },
    'tarot_continue': {
        id: 'tarot_continue',
        text: "🃏 알 수 없는 이끌림에 카드를 한 장 선택합니다.",
        effect: { target: 'RANDOM_1', skillsRemove: ["성장 잠재력"] }
    },
    'sunny_day': { 
        id: 'sunny_day', 
        text: "☀️ 구름 한 점 없는 맑은 날입니다. 젖은 옷을 말리고 모처럼 평화로운 시간을 보냅니다.", 
        next: [
          { id: 'sunny_meditation', weight: 0.0, choiceText: "단체 명상 수행 (명상법 필요)", req: { skill: '명상법' } },
          { id: 'training_gym', weight: 0.3, choiceText: "근력 강화 훈련" },
          { id: 'sunny_rest', weight: 0.7, choiceText: "개인 정비" }
        ],
        effect: { target: 'RANDOM_1', statChanges: { con: 1, agi: -1 }, skillsAdd: [S.FARMING], skillsRemove: ["야생 추적"] } 
    },
    'training_gym': {
        id: 'training_gym',
        text: "💪 남는 시간을 활용해 맨몸 운동과 무거운 짐 들기로 체력을 단련했습니다. 근육이 비명을 지르지만 힘이 솟는 것 같습니다.",
        effect: { target: 'RANDOM_1', statChanges: { str: 1, agi: -1 }, fatigue: 20, hp: -5, skillsAdd: [S.MELEE_COMBAT], skillsRemove: ["은밀 기동"] }
    },
    'library_study': {
        id: 'library_study',
        text: "📚 먼지 쌓인 공공 도서관에서 쓸만한 기술 서적들을 발견했습니다. 누군가 공부를 제안합니다.",
        next: [
            { id: 'skill_learn_medical', weight: 0.5, choiceText: "응급 처치법 학습" },
            { id: 'skill_learn_tech', weight: 0.5, choiceText: "기계 수리법 학습" }
        ],
        effect: { target: 'RANDOM_1', skillsAdd: [S.TEACHING], skillsRemove: ["근접 제압"] }
    },
    'skill_learn_medical': {
        id: 'skill_learn_medical',
        text: "🩹 의학 백과사전을 정독하며 상처를 지혈하고 봉합하는 법을 익혔습니다. 이제 누군가를 살릴 수 있을지도 모릅니다.",
        effect: { target: 'RANDOM_1', statChanges: { int: 1, str: -1 }, skillsAdd: [S.FIRST_AID], fatigue: 15, skillsRemove: ["폭발 전문가"] }
    },
    'skill_learn_tech': {
        id: 'skill_learn_tech',
        text: "⚙️ 기계 공학 잡지를 보며 복잡한 엔진의 구조를 이해하게 되었습니다. 손재주가 좋아진 기분입니다.",
        effect: { target: 'RANDOM_1', statChanges: { int: 1, cha: -1 }, skillsAdd: [S.MECHANIC], fatigue: 15, skillsRemove: ["희망의 노래"] }
    },
    'accident_injury': {
        id: 'accident_injury',
        text: "💥 폐허의 계단이 무너지며 누군가 크게 넘어졌습니다! 운 좋게 뼈는 부러지지 않았지만 몸이 예전 같지 않습니다.",
        effect: { target: 'RANDOM_1', hp: -20, statChanges: { agi: -1, con: 1 }, fatigue: 10, skillsRemove: ["근접 제압"], skillsAdd: [S.SURVIVAL_INSTINCT] }
    },
    'trauma_forgetting': {
        id: 'trauma_forgetting',
        text: "🤯 끔찍한 좀비 떼의 습격 이후, 누군가 심각한 공황 상태에 빠졌습니다. 공포가 이성을 마비시켜 자신의 기술조차 사용하기 두려워합니다.",
        effect: { target: 'RANDOM_1', sanity: -30, skillsRemove: ["전술 사격", "트라우마 극복", "전술 지휘"], mentalState: 'Trauma' }
    },
    'shooting_range': {
        id: 'shooting_range',
        text: "🔫 버려진 사격 통제실에서 소량의 탄약과 연습용 표적을 발견했습니다. 사격 연습을 할까요?",
        next: [
            { id: 'skill_gain_marksman', weight: 1.0, choiceText: "사격 집중 훈련" }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["종교적 신념"] }
    },
    'skill_gain_marksman': {
        id: 'skill_gain_marksman',
        text: "🎯 수백 번의 격발 연습 끝에 총기의 반동을 제어하고 조준하는 법을 몸으로 익혔습니다.",
        effect: { target: 'RANDOM_1', statChanges: { agi: 1, str: -1 }, skillsAdd: [S.MARKSMANSHIP], fatigue: 25, skillsRemove: ["근접 제압"] }
    },
    'sunny_meditation': {
        id: 'sunny_meditation',
        text: "🧘 명상법을 통해 모두가 극심한 트라우마에서 잠시 벗어나 내면의 평화를 찾았습니다.",
        effect: { target: 'RANDOM_1', statChanges: { int: 1, agi: -1 }, skillsAdd: [S.MEDITATION], skillsRemove: ["폭발적 근력"] }
    },
    'sunny_rest': { id: 'sunny_rest', text: "☀️ 평화로운 하루를 보냈습니다.", effect: { target: 'RANDOM_1', skillsRemove: ["매력 발산"] } },
    'foggy_day': { 
        id: 'foggy_day', 
        text: "🌫️ 한 치 앞도 보이지 않는 짙은 안개가 꼈습니다. 좀비의 기습에 대비해야 합니다.", 
        effect: { target: 'RANDOM_1', fatigue: 5, skillsRemove: ["전략 수립"] } 
    },
    'heavy_rain': { 
        id: 'heavy_rain', 
        text: "🌧️ 장대비가 쏟아져 내립니다. 몸은 젖었지만, 덕분에 좀비들의 냄새 추적을 따돌렸습니다.", 
        effect: { target: 'RANDOM_1', fatigue: -5, sanity: 5, skillsRemove: ["이미지 메이킹"] } 
    },
    'heatwave': {
        id: 'heatwave',
        text: "🔥 숨이 턱턱 막히는 폭염이 찾아왔습니다. 가만히 있어도 땀이 흐르고 체력이 떨어집니다.",
        effect: { target: 'RANDOM_1', hp: -2, fatigue: 10, statChanges: { con: -1 }, skillsRemove: ["해독술", "산야초 채집", "명상법"] }
    },
    'thunderstorm': {
        id: 'thunderstorm',
        text: "⛈️ 천둥번개가 요란하게 치는 밤입니다. 굉음 때문에 불안에 떱니다.",
        effect: { target: 'RANDOM_1', sanity: -5, fatigue: 5, skillsRemove: ["정보 수집"] }
    },
    'full_moon': {
        id: 'full_moon',
        text: "🌕 유난히 밝은 보름달이 떴습니다. 달빛 아래서 좀비들의 그림자가 기괴함을 자아냅니다.",
        effect: { target: 'RANDOM_1', sanity: -5, skillsRemove: ["잠입 기술"] }
    },
    'starry_night': {
        id: 'starry_night',
        text: "🌠 밤하늘에 별똥별이 떨어집니다. 잠시나마 지옥 같은 현실을 잊고 소원을 빌어봅니다.",
        effect: { target: 'RANDOM_1', sanity: 10, statChanges: { cha: 1 }, skillsAdd: [S.SPIRITUALITY] }
    },
    'quiet_day': { 
        id: 'quiet_day', 
        text: "🤫 기묘할 정도로 고요한 하루입니다. 폭풍전야일까요?", 
        effect: { target: 'RANDOM_1', fatigue: -5, skillsRemove: ["전술 지휘"] } 
    },
    'horde_pass': { 
        id: 'horde_pass', 
        text: "🧟‍♂️ 수천 마리의 좀비 떼가 이동하는 것을 목격했습니다. 숨죽여 그들이 지나가길 기다립니다.", 
        effect: { target: 'RANDOM_1', fatigue: 15, sanity: -5, skillsAdd: [S.AMBUSH], skillsRemove: ["매복 습격"] } 
    },
    'helicopter': { 
        id: 'helicopter', 
        text: "🚁 머리 위로 헬리콥터가 지나갔지만, 우리를 보지 못했습니다. 구조의 희망과 절망이 동시에 교차합니다.", 
        effect: { target: 'RANDOM_1', sanity: -5, skillsRemove: ["희망의 노래"] } 
    },
    'nightmare_shared': {
        id: 'nightmare_shared',
        text: "😱 밤새 끔찍한 비명소리가 들려 모두가 잠을 설쳤습니다.",
        next: [
          { id: 'nightmare_mental', weight: 0.0, choiceText: "동료 심리 케어 (심리 상담 필요)", req: { skill: '심리 상담' } },
          { id: 'nightmare_continue', weight: 1.0 }
        ],
        effect: { target: 'RANDOM_1', sanity: -5, fatigue: 10, skillsRemove: ["협상 기술"] }
    },
    'nightmare_mental': {
        id: 'nightmare_mental',
        text: " Couch 심리 상담 스킬로 공포에 질린 동료들을 진정시키고 악몽의 원인을 분석해 안심시켰습니다.",
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: -5, statChanges: { cha: 1 }, skillsAdd: [S.MENTAL_CARE] }
    },
    'nightmare_continue': { id: 'nightmare_continue', text: "😱 힘든 밤이었습니다.", effect: { target: 'RANDOM_1', skillsRemove: ["심리 상담", "희망의 노래"] } },
    'old_music': {
        id: 'old_music',
        text: "🎵 배터리가 남은 낡은 MP3 플레이어를 발견했습니다. 흘러나오는 옛 노래가 모두의 마음을 적십니다.",
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.MUSIC] }
    },
    'board_game': {
        id: 'board_game',
        text: "🎲 먼지 쌓인 보드게임을 발견했습니다. 잠시 웃음을 되찾습니다.",
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: -5, statChanges: { int: 1 }, skillsAdd: [S.LOGISTICS] }
    },
    'stray_dog': {
        id: 'stray_dog',
        text: "🐕 떠돌이 개 한 마리가 캠프 근처를 서성입니다.",
        next: [
          { id: 'dog_livestock', weight: 0.0, choiceText: "동물 길들이기 (가축 사육 필요)", req: { skill: '가축 사육' } },
          { id: 'dog_friend', weight: 1.0, choiceText: "먹이 주기" }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["수사 근성"] }
    },
    'dog_livestock': {
        id: 'dog_livestock',
        text: "🐄 가축 사육 지식을 이용해 떠돌이 개를 훌륭한 파수견으로 길들였습니다. 이제 밤길이 더 든든합니다.",
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: -10, skillsAdd: [S.LIVESTOCK] }
    },
    'dog_friend': { id: 'dog_friend', text: "🐕 개는 꼬리를 흔들며 잠시 머물다 갑니다.", effect: { target: 'ALL', sanity: 5 } },
    'rat_swarm': {
        id: 'rat_swarm',
        text: "🐀 쥐 떼가 식량 창고를 습격했습니다!",
        effect: { target: 'RANDOM_1', sanity: -5, inventoryRemove: ['통조림'], skillsRemove: ["위생 관리", "식량 생산"] }
    },
    'abandoned_truck': {
        id: 'abandoned_truck',
        text: "🚚 갓길에 버려진 택배 트럭을 발견했습니다. 뒷문은 굳게 잠겨있습니다.",
        next: [
            { id: 'truck_scavenge', weight: 0.0, choiceText: "버려진 상자 정밀 수색 (폐지 줍기 필요)", req: { skill: '폐지 줍기' } },
            { id: 'truck_lockpick', weight: 0.0, choiceText: "자물쇠 해킹 (전자 공학 필요)", req: { skill: '전자 공학' } },
            { id: 'truck_lockpick_mech', weight: 0.0, choiceText: "자물쇠 따기 (기계 수리 필요)", req: { skill: '기계 수리' } },
            { id: 'truck_force', weight: 1.0, choiceText: "힘으로 부수기 (피로도 증가)" }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["미적 감각"] }
    },
    'truck_scavenge': {
        id: 'truck_scavenge',
        text: "📦 폐지 줍기 달인의 감각으로 트럭 구석에서 아무도 발견하지 못한 '귀중품 상자'를 찾아냈습니다.",
        effect: { target: 'RANDOM_1', loot: ['백신', '통조림', '비타민'], sanity: 10, skillsAdd: [S.SCAVENGING, S.INVESTIGATION] }
    },
    'truck_lockpick': {
        id: 'truck_lockpick',
        text: "🔧 전문 기술을 발휘해 소리 없이 문을 열었습니다. 안에는 유용한 물건들이 가득합니다!",
        effect: { target: 'RANDOM_1', loot: ['통조림', '통조림', '붕대'], sanity: 5, skillsAdd: [S.ELECTRONICS] }
    },
    'truck_lockpick_mech': { 
        id: 'truck_lockpick_mech', 
        text: "🔧 기계 수리 실력으로 잠긴 뒷문을 손상 없이 열었습니다. 유용한 물건들이 가득합니다!", 
        effect: { target: 'RANDOM_1', loot: ['통조림', '통조림', '붕대'], sanity: 5, skillsAdd: [S.MECHANIC] } 
    },
    'truck_force': {
        id: 'truck_force',
        text: "🔨 한참을 두드리고 부순 끝에 문을 열었습니다. 요란한 소리 때문에 서둘러 물건만 챙겨 떠납니다.",
        effect: { target: 'RANDOM_1', statChanges: { str: 1, int: -1 }, skillsAdd: [S.ATHLETICS], loot: ['통조림', '붕대'], fatigue: 15, skillsRemove: ["수사 근성"] }
    },
    'pharmacy_ruin': {
        id: 'pharmacy_ruin',
        text: "💊 약국 폐허의 금고가 열려있습니다. 누군가 털어가려다 실패한 것 같습니다. 안에는 귀한 백신과 약품이 그대로 있습니다!",
        next: [
          { id: 'pharmacy_detox', weight: 0.0, choiceText: "해독제 조제 시도 (해독술 필요)", req: { skill: '해독술' } },
          { id: 'pharmacy_loot', weight: 1.0 }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["가치 평가"] }
    },
    'pharmacy_detox': {
        id: 'pharmacy_detox',
        text: "🧪 해독술 스킬로 남아있는 약품들을 배합해 강력한 세정액과 해독제를 만들었습니다.",
        effect: { target: 'RANDOM_1', loot: ['백신', '항생제', '붕대'], infection: -30, skillsAdd: [S.HYGIENE_CONTROL, S.DETOX] }
    },
    'pharmacy_loot': { id: 'pharmacy_loot', text: "💊 물자를 챙겼습니다.", effect: { target: 'ALL', loot: ['붕대', '항생제', '비타민', '백신'] } },
    'creepy_doll': {
        id: 'creepy_doll',
        text: "🧸 목이 잘린 곰 인형이 길 한복판에 놓여 있습니다. 기분이 나쁩니다.",
        effect: { target: 'RANDOM_1', sanity: -5, skillsRemove: ["예술적 통찰", "종교적 신념"] }
    },
    'flower_field': {
        id: 'flower_field',
        text: "🌸 폐허 속에 기적처럼 피어난 꽃밭을 발견했습니다.",
        effect: { target: 'RANDOM_1', sanity: 5, statChanges: { cha: 1 }, skillsAdd: [S.ARTISTIC, S.FORAGING] }
    },
    'weapon_maintenance': {
        id: 'weapon_maintenance',
        text: "🔫 오늘은 이동을 멈추고 무기를 손질하고 장비를 점검하기로 했습니다.",
        next: [
          { id: 'weapon_expert', weight: 0.0, choiceText: "병기 관리 전문가의 정비 (병기 관리 필요)", req: { skill: '병기 관리' } },
          { id: 'weapon_basic', weight: 1.0 }
        ],
        effect: { target: 'RANDOM_1', fatigue: 5, sanity: 5, skillsAdd: [S.WEAPON_MAINTENANCE] }
    },
    'weapon_expert': {
        id: 'weapon_expert',
        text: "🔧 병기 관리 스킬로 모든 무기를 완벽하게 튜닝했습니다. 다음 전투에서 훨씬 더 효율적으로 싸울 수 있습니다.",
        effect: { target: 'RANDOM_1', sanity: 15, kill: 2, fatigue: -5, skillsAdd: [S.WEAPON_MAINTENANCE] }
    },
    'weapon_basic': { id: 'weapon_basic', text: "🔫 정비를 마쳤습니다.", effect: { target: 'RANDOM_1', skillsRemove: ["병기 관리"] } },
    'cannibal_meal': {
        id: 'cannibal_meal',
        text: "🍖 충격적인 광경을 목격했습니다. 누군가가 남기고 간 '고기'가 있습니다. 사람이었던 것 같습니다...",
        next: [
          { id: 'cannibal_cook', weight: 0.0, choiceText: "거부감 없는 요리 가공 (요리 마스터 필요)", req: { skill: '요리 마스터' } },
          { id: 'cannibal_eat', weight: 0.5, choiceText: "눈을 감고 먹기" },
          { id: 'cannibal_ignore', weight: 0.5 }
        ],
        effect: { target: 'RANDOM_1', sanity: -20, skillsRemove: ["카리스마"] }
    },
    'cannibal_cook': {
        id: 'cannibal_cook',
        text: "🍳 요리 마스터 스킬로 이것이 무엇이었는지 알 수 없게 완벽한 보존 식품으로 가공했습니다. 죄책감은 사라지고 포만감만 남습니다.",
        effect: { target: 'RANDOM_1', loot: ['통조림', '통조림'], sanity: 10, skillsAdd: [S.COOKING] }
    },
    'cannibal_eat': { id: 'cannibal_eat', text: "🍖 끔찍한 맛이었습니다.", effect: { target: 'RANDOM_1', hp: 20, sanity: -30, statChanges: { con: -1 }, skillsRemove: ["요리 마스터"] } },
    'cannibal_ignore': { id: 'cannibal_ignore', text: "🚫 우리는 그것을 지나쳤습니다.", effect: { target: 'RANDOM_1', skillsRemove: ["보좌술"] } },
    'vaccine_drop': {
        id: 'vaccine_drop',
        text: "🚁 추락한 군용 드론의 잔해를 발견했습니다. 'Z-백신'이라고 적힌 앰플이 보입니다!",
        effect: { target: 'RANDOM_1', sanity: 15, loot: ['백신'], skillsRemove: ["행정 처리"] }
    },
    'military_convoy': {
        id: 'military_convoy',
        text: "🚛 전복된 군용 수송 차량 행렬을 발견했습니다. 화물 상자는 굳게 잠겨있습니다.",
        next: [
            { id: 'convoy_accounting', weight: 0.0, choiceText: "운송장 가치 산정 (가치 평가 필요)", req: { skill: '가치 평가' } },
            { id: 'convoy_loot', weight: 0.5, choiceText: "수색 강행 (백신/무기, 위험)" },
            { id: 'convoy_ignore', weight: 0.5, choiceText: "무시하고 이동 (안전)" }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["질서 유지"] }
    },
    'convoy_accounting': {
        id: 'convoy_accounting',
        text: "📈 가치 평가 스킬로 수많은 상자 중 가장 값비싼 약품이 든 상자만을 골라내어 신속하게 챙겼습니다.",
        effect: { target: 'RANDOM_1', loot: ['백신', '백신', '항생제'], sanity: 10, skillsAdd: [S.LOGISTICS] }
    },
    'convoy_loot': {
        id: 'convoy_loot',
        text: "📦 위험을 무릅쓰고 상자를 엽니다. 안에서 백신과 무기를 확보했지만, 매복해있던 군인 좀비가 튀어나옵니다!",
        effect: { target: 'RANDOM_1', sanity: 5, hp: -10, loot: ['백신', '권총', '통조림'], statChanges: { str: 1 }, skillsRemove: ["자원 관리"] }
    },
    'convoy_ignore': {
        id: 'convoy_ignore',
        text: "👀 너무 위험해 보입니다. 아쉬움을 뒤로하고 조용히 자리를 뜹니다.",
        effect: { target: 'ALL', fatigue: 5 }
    },
    'oneoff_locked_box': {
        id: 'oneoff_locked_box',
        text: "🔒 수풀 속에 숨겨진 군용 보급 상자를 발견했습니다.",
        next: [
            { id: 'box_crafting', weight: 0.0, choiceText: "수제 도구로 해체 (도구 제작 필요)", req: { skill: '도구 제작' } },
            { id: 'box_knife', weight: 0.0, choiceText: "맥가이버 칼로 따기 (맥가이버 칼 필요)", req: { item: '맥가이버 칼' } },
            { id: 'box_smash', weight: 1.0, choiceText: "돌로 내리찍기 (소음 발생)" }
        ]
    },
    'box_crafting': {
        id: 'box_crafting',
        text: "⚒️ 도구 제작 스킬로 주변 나뭇가지를 깎아 완벽한 지렛대를 만들어 상자를 열었습니다.",
        effect: { target: 'RANDOM_1', loot: ['권총', '비타민'], sanity: 5, skillsAdd: [S.CRAFTING] }
    },
    'box_knife': {
        id: 'box_knife',
        text: "🔪 맥가이버 칼의 도구들을 이용해 정밀하게 자물쇠를 해체했습니다. 안에는 최고급 보급품이 가득합니다!",
        effect: { target: 'ALL', loot: ['권총', '통조림', '항생제', '지도'], sanity: 10 }
    },
    'box_smash': {
        id: 'box_smash',
        text: "🔨 돌로 수십 번을 내리찍어 겨우 상자를 열었습니다. 그 과정에서 내용물 일부가 부서졌고, 소음을 듣고 좀비가 몰려와 급히 자리를 떴습니다.",
        effect: { target: 'RANDOM_1', statChanges: { str: 1, agi: -1 }, skillsAdd: [S.RECYCLING], loot: ['통조림'], fatigue: 15, skillsRemove: ["도구 제작"] }
    },
    'oneoff_confusing_path': {
        id: 'oneoff_confusing_path',
        text: "🌫️ 짙은 안개 때문에 방향 감각을 상실했습니다.",
        next: [
            { id: 'path_planning', weight: 0.0, choiceText: "기후 패턴 분석 (전략 수립 필요)", req: { skill: '전략 수립' } },
            { id: 'path_map', weight: 0.0, choiceText: "지도로 위치 확인 (지도 필요)", req: { item: '지도' } },
            { id: 'path_guess', weight: 1.0, choiceText: "감으로 찍어서 이동" }
        ]
    },
    'path_planning': {
        id: 'path_planning',
        text: "📊 전략 수립 스킬로 안개의 흐름과 바람의 방향을 분석해 최적의 경로를 도출했습니다.",
        effect: { target: 'RANDOM_1', fatigue: -10, sanity: 10, statChanges: { int: 1 }, skillsAdd: [S.PLANNING] }
    },
    'path_map': {
        id: 'path_map',
        text: "🗺️ 지도를 펼쳐 주변 지형지물과 대조했습니다. 숨겨진 안전 가옥으로 가는 지름길을 찾아냈습니다!",
        effect: { target: 'ALL', fatigue: -20, hp: 5, sanity: 5 }
    },
    'path_guess': {
        id: 'path_guess',
        text: "🌀 감을 믿고 이동했지만, 늪지대를 헤매며 체력만 낭비했습니다.",
        effect: { target: 'RANDOM_1', statChanges: { int: -1, con: 1 }, skillsAdd: [S.SURVIVAL_INSTINCT], fatigue: 20, sanity: -5, skillsRemove: ["전략 수립"] }
    },
    'oneoff_zombie_dog': {
        id: 'oneoff_zombie_dog',
        text: "🐕르르릉... 덩치 큰 좀비견 세 마리가 길을 막고 있습니다.",
        next: [
            { id: 'dog_animal', weight: 0.0, choiceText: "야생 동물의 위협 모방 (야생 추적 필요)", req: { skill: '야생 추적' } },
            { id: 'dog_shoot', weight: 0.0, choiceText: "권총 사격 (권총 필요)", req: { item: '권총' } },
            { id: 'dog_fight', weight: 1.0, choiceText: "근접전 돌입 (부상 위험)" }
        ]
    },
    'dog_animal': {
        id: 'dog_animal',
        text: "🏹 야생 추적 스킬을 응용해 상위 포식자의 기세를 흉내 냈습니다. 좀비견들은 겁을 먹고 도망갔습니다.",
        effect: { target: 'RANDOM_1', sanity: 15, statChanges: { cha: 1 }, skillsAdd: [S.HUNTING] }
    },
    'dog_shoot': {
        id: 'dog_shoot',
        text: "🔫 탕! 탕! 탕! 침착하게 권총을 발사해 달려드는 짐승들을 제압했습니다.",
        effect: { target: 'ALL', sanity: 5, fatigue: 5 }
    },
    'dog_fight': {
        id: 'dog_fight',
        text: "⚔️ 무기를 들고 육탄전을 벌였습니다. 놈들을 처치했지만, 날카로운 이빨에 물리고 뜯겨 심한 상처를 입었습니다.",
        effect: { target: 'RANDOM_1', statChanges: { con: -1, str: 1 }, skillsAdd: [S.MELEE_COMBAT], hp: -20, infection: 15, fatigue: 20, skillsRemove: ["야생 추적"] }
    },
    'oneoff_faint_signal': {
        id: 'oneoff_faint_signal',
        text: "📡 버려진 통신탑 근처에서 미세한 잡음이 들리는 것 같습니다.",
        next: [
            { id: 'signal_reporting', weight: 0.0, choiceText: "전파 소스 정보 분석 (정보 수집 필요)", req: { skill: '정보 수집' } },
            { id: 'signal_radio', weight: 0.0, choiceText: "주파수 스캔 (무전기 필요)", req: { item: '무전기' } },
            { id: 'signal_ignore', weight: 1.0, choiceText: "무시하고 이동" }
        ]
    },
    'signal_reporting': {
        id: 'signal_reporting',
        text: "📰 정보 수집 능력을 발휘해 잡음 속에 섞인 군용 암호를 해석했습니다. 공습 지역을 미리 알고 피할 수 있었습니다.",
        effect: { target: 'RANDOM_1', sanity: 20, fatigue: -10, statChanges: { int: 1 }, skillsAdd: [S.REPORTING] }
    },
    'signal_radio': {
        id: 'signal_radio',
        text: "📻 무전기를 켜고 주파수를 맞추자, 생존자 그룹의 좌표 방송이 잡혔습니다! 그들이 숨겨둔 보급품 위치를 알아냈습니다.",
        effect: { target: 'ALL', loot: ['통조림', '통조림', '비타민', '안정제'], sanity: 10 }
    },
    'signal_ignore': {
        id: 'signal_ignore',
        text: "🔇 바람 소리겠거니 하고 지나쳤습니다.",
        effect: { target: 'RANDOM_1', fatigue: 5, skillsRemove: ["정보 수집"] }
    },
    'oneoff_broken_bridge': {
        id: 'oneoff_broken_bridge',
        text: "Bridge 🌉 협곡을 건너는 다리가 끊어져 있습니다. 주변에 튼튼해 보이는 덩굴 식물이 있습니다.",
        next: [
            { id: 'bridge_carpentry', weight: 0.0, choiceText: "나무 다리 보강 (구조물 강화 필요)", req: { skill: '구조물 강화' } },
            { id: 'bridge_cut', weight: 0.0, choiceText: "덩굴 잘라 밧줄 만들기 (맥가이버 칼 필요)", req: { item: '맥가이버 칼' } },
            { id: 'bridge_tech', weight: 0.0, choiceText: "임시 다리 건설 (기계 수리 필요)", req: { skill: '기계 수리' } },
            { id: 'bridge_detour', weight: 1.0, choiceText: "먼 길로 우회하기" }
        ]
    },
    'bridge_carpentry': {
        id: 'bridge_carpentry',
        text: "🪵 구조물 강화 스킬로 끊어진 다리 틈을 튼튼한 판자들로 메워 차량까지 지나갈 수 있는 길을 만들었습니다.",
        effect: { target: 'ALL', fatigue: -10, sanity: 15 }
    },
    'bridge_cut': {
        id: 'bridge_cut',
        text: "🔪 맥가이버 칼의 도구들을 이용해 덩굴을 잘라 튼튼한 밧줄을 만들었습니다. 타잔처럼 줄을 타고 건너 시간을 대폭 단축했습니다.",
        effect: { target: 'ALL', fatigue: -15, sanity: 5, statChanges: { agi: 1 } }
    },
    'bridge_tech': {
        id: 'bridge_tech',
        text: "🔧 주변의 자재를 모아 임시 다리를 뚝딱 만들어냈습니다. 모두가 안전하고 편하게 건넜습니다.",
        effect: { target: 'RANDOM_1', fatigue: -15, sanity: 5, skillsAdd: [S.CRAFTING] }
    },
    'bridge_detour': {
        id: 'bridge_detour',
        text: "🚶 도구도 기술도 없습니다. 어쩔 수 없이 산을 하나 넘어서 돌아가야 했습니다. 다리가 퉁퉁 부었습니다.",
        effect: { target: 'ALL', fatigue: 25, hp: -5, statChanges: { con: -1 } }
    },

    // =================================================================
    // DICE CHALLENGE ONE-OFFS
    // =================================================================

    'dice_tripwire': {
        id: 'dice_tripwire',
        text: "🧶 어두운 복도를 지나던 중, 발밑에 팽팽하게 당겨진 인계철선을 발견했습니다! 함정입니다.",
        next: [
            {
                id: 'dice_tripwire_success',
                weight: 1.0,
                choiceText: "함정 뛰어넘기 (민첩 기반)",
                dice: { threshold: 75, stat: 'agi', successId: 'dice_tripwire_success', failId: 'dice_tripwire_fail', hpPenalty: -20 }
            }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["함정 설치"] }
    },
    'dice_tripwire_success': {
        id: 'dice_tripwire_success',
        text: "🤸 성공입니다! 가벼운 몸놀림으로 함정을 뛰어넘었습니다. 뒤를 돌아보니 날카로운 화살들이 벽에 박혀있습니다.",
        effect: { target: 'RANDOM_1', sanity: 5, statChanges: { agi: 1 }, skillsAdd: [S.AGILITY, S.TRAP_SETTING] }
    },
    'dice_tripwire_fail': {
        id: 'dice_tripwire_fail',
        text: "💥 실패했습니다! 발이 선에 걸리는 순간, 천장에서 떨어진 쇳덩이가 어깨를 강타했습니다.",
        effect: { target: 'RANDOM_1', hp: -25, fatigue: 10, statChanges: { con: -1 }, skillsRemove: ["기동력", "함정 설치"] }
    },

    'dice_locked_pharmacy': {
        id: 'dice_locked_pharmacy',
        text: "🏪 셔터가 내려진 작은 약국을 발견했습니다. 자물쇠가 녹슬어 열기 힘들어 보입니다.",
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
        text: "🔓 성공! 딸칵 소리와 함께 문이 열렸습니다. 안에는 아직 털리지 않은 의약품들이 가득합니다.",
        effect: { target: 'ALL', loot: ['항생제', '붕대', '비타민'], sanity: 10, statChanges: { int: 1 } }
    },
    'dice_pharmacy_fail': {
        id: 'dice_pharmacy_fail',
        text: "🔇 실패했습니다. 자물쇠 안에서 핀이 부러져버렸습니다. 이제는 부수지 않는 한 열 수 없습니다.",
        effect: { target: 'RANDOM_1', fatigue: 5, skillsRemove: ["잠입 기술"] }
    },

    'dice_sleeping_horde': {
        id: 'dice_sleeping_horde',
        text: "🧟 수십 마리의 좀비가 바닥에 쓰러져 잠든(?) 지하 주차장을 통과해야 합니다. 작은 소음도 치명적입니다.",
        next: [
            {
                id: 'dice_horde_success',
                weight: 1.0,
                choiceText: "숨죽이고 이동 (민첩 기반)",
                dice: { threshold: 85, stat: 'agi', successId: 'dice_horde_success', failId: 'dice_horde_fail', hpPenalty: -30 }
            }
        ],
        effect: { target: 'RANDOM_1', skillsRemove: ["은밀 기동"] }
    },
    'dice_horde_success': {
        id: 'dice_horde_success',
        text: "🤫 성공! 유령처럼 조용히 주차장을 가로질렀습니다. 심장이 터질 것 같지만 무사합니다.",
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: 10, skillsAdd: [S.STEALTH] }
    },
    'dice_horde_fail': {
        id: 'dice_horde_fail',
        text: "🔊 깡통을 밟았습니다! 고요했던 주차장에 금속음이 울려 퍼집니다. 좀비들이 일제히 비명을 지르며 일어납니다!",
        effect: { target: 'RANDOM_HALF', hp: -25, infection: 10, fatigue: 20, skillsRemove: ["은밀 기동", "매복 습격"] }
    },

    'dice_heavy_gate': {
        id: 'dice_heavy_gate',
        text: "🚧 거대한 철문이 반쯤 내려앉아 길을 막고 있습니다. 억지로 들어 올려야 지나갈 수 있습니다.",
        next: [
            {
                id: 'dice_gate_success',
                weight: 1.0,
                choiceText: "철문 들어 올리기 (힘 기반)",
                dice: { threshold: 80, stat: 'str', successId: 'dice_gate_success', failId: 'dice_gate_fail', hpPenalty: -10 }
            }
        ]
    },
    'dice_gate_success': {
        id: 'dice_gate_success',
        text: "💪 성공! 근육이 비명을 지르지만 문을 충분히 들어 올렸습니다. 모두가 신속히 반대편으로 빠져나갑니다.",
        effect: { target: 'RANDOM_1', fatigue: 15, sanity: 5, statChanges: { str: 1 }, skillsAdd: [S.CARPENTRY] }
    },
    'dice_gate_fail': {
        id: 'dice_gate_fail',
        text: "🩸 실패했습니다. 문이 갑자기 미끄러져 내려오며 손을 찧고 말았습니다. 엄청난 고통이 밀려옵니다.",
        effect: { target: 'RANDOM_1', hp: -15, fatigue: 20, statChanges: { con: -1 }, skillsRemove: ["구조물 강화", "폭발적 근력"] }
    },

    'dice_suspicious_trader': {
        id: 'dice_suspicious_trader',
        text: "👤 낯선 생존자가 길가에서 물건을 늘어놓고 있습니다. 인상은 험악하지만 좋은 물건이 있어 보입니다.",
        next: [
            {
                id: 'dice_trader_success',
                weight: 1.0,
                choiceText: "유리한 조건으로 협상 (매력 기반)",
                dice: { threshold: 75, stat: 'cha', successId: 'dice_trader_success', failId: 'dice_trader_fail', sanityPenalty: -10 }
            }
        ]
    },
    'dice_trader_success': {
        id: 'dice_trader_success',
        text: "🤝 성공! 화려한 말솜씨로 상대의 경계심을 풀고 저렴한 가격에 물건을 교환했습니다.",
        effect: { target: 'RANDOM_1', loot: ['통조림', '안정제'], inventoryRemove: ['붕대'], statChanges: { cha: 1 }, skillsAdd: [S.NEGOTIATION, S.ACCOUNTING] }
    },
    'dice_trader_fail': {
        id: 'dice_trader_fail',
        text: "💢 실패했습니다. 상대는 우리가 자신을 속이려 한다고 생각하고 오히려 위협을 가했습니다.",
        effect: { target: 'RANDOM_1', sanity: -15, statChanges: { cha: -1 }, skillsRemove: ["협상 기술", "가치 평가"] }
    },

    'dice_broken_generator': {
        id: 'dice_broken_generator',
        text: "⚡ 버려진 안전 가옥에서 고장 난 비상 발전기를 발견했습니다. 기름은 충분해 보입니다.",
        next: [
            {
                id: 'dice_gen_success',
                weight: 1.0,
                choiceText: "회로 수리 (지능 기반)",
                dice: { threshold: 85, stat: 'int', successId: 'dice_gen_success', failId: 'dice_gen_fail', sanityPenalty: -5 }
            }
        ]
    },
    'dice_gen_success': {
        id: 'dice_gen_success',
        text: "💡 성공! 발전기가 요란한 소리를 내며 돌아갑니다. 전등이 켜지자 모두의 표정도 밝아집니다.",
        effect: { target: 'RANDOM_1', sanity: 20, fatigue: -10, skillsAdd: [S.MECHANIC, S.ELECTRONICS] }
    },
    'dice_gen_fail': {
        id: 'dice_gen_fail',
        text: "💥 실패! 엔진 내부에서 불꽃이 튀더니 매연만 뿜어져 나옵니다. 발전기는 이제 고철덩어리입니다.",
        effect: { target: 'RANDOM_1', fatigue: 10, skillsRemove: ["기계 수리", "전자 공학"] }
    },

    'dice_precarious_bridge': {
        id: 'dice_precarious_bridge',
        text: "🌉 골짜기 사이에 낡은 밧줄 다리가 놓여 있습니다. 금방이라도 끊어질 것 같습니다.",
        next: [
            {
                id: 'dice_bridge_success',
                weight: 1.0,
                choiceText: "다리 건너기 (민첩 기반)",
                dice: { threshold: 80, stat: 'agi', successId: 'dice_bridge_success', failId: 'dice_bridge_fail', hpPenalty: -25 }
            }
        ]
    },
    'dice_bridge_success': {
        id: 'dice_bridge_success',
        text: "🧗 성공! 아슬아슬하게 다리를 건넜습니다. 시간을 대폭 단축했습니다.",
        effect: { target: 'RANDOM_1', fatigue: -15, sanity: 5, statChanges: { agi: 1 }, skillsAdd: [S.AGILITY] }
    },
    'dice_bridge_fail': {
        id: 'dice_bridge_fail',
        text: "😱 실패! 다리 한쪽 밧줄이 끊어지며 매달리게 되었습니다. 필사적으로 올라왔지만 온몸이 멍투성입니다.",
        effect: { target: 'RANDOM_HALF', hp: -20, sanity: -10, fatigue: 20, statChanges: { agi: -1 }, skillsRemove: ["기동력"] }
    },

    'dice_stuck_crate': {
        id: 'dice_stuck_crate',
        text: "📦 거대한 나무 상자가 진흙 속에 파묻혀 있습니다. 뚜껑이 꽉 끼어 열리지 않습니다.",
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
        text: "🔓 성공! 콰직 하는 소리와 함께 뚜껑이 열렸습니다. 안에는 통조림 몇 개가 굴러다닙니다.",
        effect: { target: 'RANDOM_1', loot: ['통조림', '통조림'], statChanges: { str: 1 }, skillsAdd: [S.RECYCLING] }
    },
    'dice_crate_fail': {
        id: 'dice_crate_fail',
        text: "😣 실패! 무리하게 힘을 주다가 허리를 삐끗했습니다. 상자는 미동도 하지 않습니다.",
        effect: { target: 'RANDOM_1', hp: -10, fatigue: 15, statChanges: { con: -1 }, skillsRemove: ["부품 재활용"] }
    },

    'dice_infected_scratch': {
        id: 'dice_infected_scratch',
        text: "🩸 동료의 상처가 심상치 않습니다. 부패가 시작되려 합니다. 긴급 처치가 필요합니다.",
        next: [
            {
                id: 'dice_wound_success',
                weight: 1.0,
                choiceText: "정밀 소독 및 절개 (지능 기반)",
                dice: { threshold: 90, stat: 'int', successId: 'dice_wound_success', failId: 'dice_wound_fail', hpPenalty: -20 }
            }
        ]
    },
    'dice_wound_success': {
        id: 'dice_wound_success',
        text: "🩺 성공! 정교한 손놀림으로 오염된 조직을 도려내고 봉합했습니다. 감염이 멈췄습니다.",
        effect: { target: 'RANDOM_1', infection: -40, hp: 10, sanity: 10, skillsAdd: [S.SURGERY] }
    },
    'dice_wound_fail': {
        id: 'dice_wound_fail',
        text: "🩹 실패... 소독이 부족했는지 오히려 상태가 악화되었습니다. 동료의 신음소리가 깊어집니다.",
        effect: { target: 'RANDOM_1', infection: 15, hp: -20, sanity: -20, skillsRemove: ["정밀 수술", "응급 처치", "해부학 지식"] }
    },

    'dice_dark_crawlspace': {
        id: 'dice_dark_crawlspace',
        text: "🕳️ 건물의 좁은 배수구가 반대편 지상으로 이어지는 것 같습니다. 어둡고 축축합니다.",
        next: [
            {
                id: 'dice_crawl_success',
                weight: 1.0,
                choiceText: "어둠 속에서 길 찾기 (지능 기반)",
                dice: { threshold: 70, stat: 'int', successId: 'dice_crawl_success', failId: 'dice_crawl_fail', sanityPenalty: -15 }
            }
        ]
    },
    'dice_crawl_success': {
        id: 'dice_crawl_success',
        text: "🏃 성공! 미로 같은 배수구를 빠져나와 안전한 공터에 도착했습니다.",
        effect: { target: 'RANDOM_1', fatigue: -10, sanity: 5, statChanges: { int: 1 }, skillsAdd: [S.INFILTRATION] }
    },
    'dice_crawl_fail': {
        id: 'dice_crawl_fail',
        text: "🌀 실패... 막힌 길로 들어가 한참을 헤매다 돌아왔습니다. 밀폐 공포증이 도질 것 같습니다.",
        effect: { target: 'RANDOM_1', sanity: -20, fatigue: 20, skillsRemove: ["잠입 기술"] }
    },

    'dice_bracing_wall': {
        id: 'dice_bracing_wall',
        text: "🧱 강풍에 은신처의 벽면이 흔들립니다. 지금 당장 버팀목을 세워 지탱해야 합니다.",
        next: [
            {
                id: 'dice_bracing_wall_success',
                weight: 1.0,
                choiceText: "전신으로 벽 지탱 (힘 기반)",
                dice: { threshold: 85, stat: 'str', successId: 'dice_bracing_wall_success', failId: 'dice_bracing_wall_fail', hpPenalty: -30 }
            }
        ]
    },
    'dice_bracing_wall_success': {
        id: 'dice_bracing_wall_success',
        text: "🏛️ 성공! 폭풍이 지나갈 때까지 온몸으로 벽을 지탱했습니다. 은신처를 지켜냈습니다.",
        effect: { target: 'RANDOM_1', sanity: 15, fatigue: 25, statChanges: { str: 1, con: 1 }, skillsAdd: [S.DEFENSE_STANCE] }
    },
    'dice_bracing_wall_fail': {
        id: 'dice_bracing_wall_fail',
        text: "🏚️ 실패... 벽이 무너져 내리며 파편에 깔렸습니다. 우리는 비를 맞으며 새 은신처를 찾아야 합니다.",
        effect: { target: 'ALL', hp: -20, fatigue: 30, sanity: -10, statChanges: { con: -1 }, skillsRemove: ["철벽 방어"] }
    },

    'dice_rooftop_jump': {
        id: 'dice_rooftop_jump',
        text: "🏙️ 좀비 떼에게 옥상으로 몰렸습니다! 옆 건물 옥상으로 뛰어넘어야 합니다.",
        next: [
            {
                id: 'dice_jump_success',
                weight: 1.0,
                choiceText: "건너편으로 도약 (민첩 기반)",
                dice: { threshold: 80, stat: 'agi', successId: 'dice_jump_success', failId: 'dice_jump_fail', hpPenalty: -40 }
            }
        ]
    },
    'dice_jump_success': {
        id: 'dice_jump_success',
        text: "🤸 성공! 허공을 가르고 건너편 옥상에 안전하게 착지했습니다. 좀비들은 허무하게 떨어집니다.",
        effect: { target: 'ALL', kill: 5, sanity: 20, statChanges: { agi: 1 } }
    },
    'dice_jump_fail': {
        id: 'dice_jump_fail',
        text: "😱 실패... 난간을 잡지 못하고 추락할 뻔했습니다. 다행히 창틀을 잡았지만 다리가 부러질 듯 아픕니다.",
        effect: { target: 'RANDOM_1', hp: -45, fatigue: 25, sanity: -15, statChanges: { agi: -1 } }
    },

    'dice_calm_panic': {
        id: 'dice_calm_panic',
        text: "🤯 동료 한 명이 갑자기 공황 상태에 빠져 소리를 지르기 시작했습니다. 좀비들이 모여들고 있습니다!",
        next: [
            {
                id: 'dice_panic_success',
                weight: 1.0,
                choiceText: "단호한 위로와 진정 (매력 기반)",
                dice: { threshold: 75, stat: 'cha', successId: 'dice_panic_success', failId: 'dice_panic_fail', sanityPenalty: -10 }
            }
        ]
    },
    'dice_panic_success': {
        id: 'dice_panic_success',
        text: "🤫 성공! 따뜻한 포옹과 단호한 말로 동료를 진정시켰습니다. 위기를 조용히 넘깁니다.",
        effect: { target: 'ALL', sanity: 15, statChanges: { cha: 1 } }
    },
    'dice_panic_fail': {
        id: 'dice_panic_fail',
        text: "🔊 실패... 동료는 더 크게 울부짖었고, 결국 근처 좀비들에게 위치가 발각되었습니다!",
        effect: { target: 'ALL', hp: -10, fatigue: 15, sanity: -5, statChanges: { cha: -1 } }
    },

    'dice_radio_alignment': {
        id: 'dice_radio_alignment',
        text: "📡 옥상의 안테나를 정렬하여 신호를 잡어야 합니다. 눈보라 때문에 손이 얼어붙습니다.",
        next: [
            {
                id: 'dice_radio_success',
                weight: 1.0,
                choiceText: "정밀하게 주파수 조정 (지능 기반)",
                dice: { threshold: 85, stat: 'int', successId: 'dice_radio_success', failId: 'dice_radio_fail', sanityPenalty: -5 }
            }
        ]
    },
    'dice_radio_success': {
        id: 'dice_radio_success',
        text: "📻 성공! 지지직거리는 소리 너머로 구조대의 교신 내용이 들립니다. 희망이 보입니다!",
        effect: { target: 'RANDOM_1', sanity: 30, loot: ['무전기'], statChanges: { int: 1 }, skillsAdd: [S.HACKING, S.SENSORY] }
    },
    'dice_radio_fail': {
        id: 'dice_radio_fail',
        text: "💨 실패... 안테나가 강풍에 꺾여버렸습니다. 더 이상 통신 시도는 불가능합니다.",
        effect: { target: 'RANDOM_1', fatigue: 10, sanity: -10, skillsRemove: ["시스템 해킹", "절대 감각"] }
    },

    'dice_patch_leak': {
        id: 'dice_patch_leak',
        text: "🤢 지하실의 가스 배관이 파손되어 유독 가스가 새어 나옵니다. 빨리 막아야 합니다.",
        next: [
            {
                id: 'dice_leak_success',
                weight: 1.0,
                choiceText: "임시 마개 설치 (민첩 기반)",
                dice: { threshold: 80, stat: 'agi', successId: 'dice_leak_success', failId: 'dice_leak_fail', hpPenalty: -20 }
            }
        ]
    },
    'dice_leak_success': {
        id: 'dice_leak_success',
        text: "✅ 성공! 가스가 더 퍼지기 전에 밸브를 잠그고 구멍을 막았습니다.",
        effect: { target: 'RANDOM_1', fatigue: 5, sanity: 5, skillsAdd: [S.PLUMBING] }
    },
    'dice_leak_fail': {
        id: 'dice_leak_fail',
        text: "🤮 실패... 가스를 너무 많이 마셨습니다. 심한 현기증과 구역질이 동반됩니다.",
        effect: { target: 'RANDOM_HALF', hp: -15, fatigue: 30, statChanges: { con: -1 }, skillsRemove: ["수원 확보"] }
    },

    'dice_disarm_mine': {
        id: 'dice_disarm_mine',
        text: "💣 밟았습니다! 발밑에서 차가운 금속음이 들립니다. 구식 지뢰입니다.",
        next: [
            {
                id: 'dice_mine_success',
                weight: 1.0,
                choiceText: "천천히 지뢰 해체 (지능 기반)",
                dice: { threshold: 95, stat: 'int', successId: 'dice_mine_success', failId: 'dice_mine_fail', hpPenalty: -80 }
            }
        ]
    },
    'dice_mine_success': {
        id: 'dice_mine_success',
        text: "✨ 대성공! 식은땀을 흘리며 공이를 고정하고 지뢰를 무력화했습니다. 심장이 멈추는 줄 알았습니다.",
        effect: { target: 'RANDOM_1', sanity: 20, fatigue: 20, statChanges: { int: 1 }, skillsAdd: [S.BOMBER] }
    },
    'dice_mine_fail': {
        id: 'dice_mine_fail',
        text: "💥 실패!! 엄청난 폭발음과 함께 주변이 화염에 휩싸였습니다.",
        effect: { target: 'RANDOM_1', hp: -90, status: 'Dead', sanity: -50, skillsRemove: ["폭발 전문가"] }
    },

    'dice_icy_climb': {
        id: 'dice_icy_climb',
        text: "🧗 절벽 위에 버려진 캠프가 보입니다. 빙벽을 타고 올라가야 합니다.",
        next: [
            {
                id: 'dice_climb_success',
                weight: 1.0,
                choiceText: "빙벽 등반 (힘 기반)",
                dice: { threshold: 85, stat: 'str', successId: 'dice_climb_success', failId: 'dice_climb_fail', hpPenalty: -30 }
            }
        ]
    },
    'dice_climb_success': {
        id: 'dice_climb_success',
        text: "🏔️ 성공! 절벽 끝에 도달했습니다. 안에는 방한용품이 남아있습니다.",
        effect: { target: 'ALL', loot: ['비타민', '비타민'], fatigue: 20, statChanges: { str: 1, con: 1 } }
    },
    'dice_climb_fail': {
        id: 'dice_climb_fail',
        text: "❄️ 실패... 중간에 힘이 빠져 수 미터를 미끄러져 내려왔습니다. 얼음물에 몸이 젖었습니다.",
        effect: { target: 'ALL', hp: -10, fatigue: 40, sanity: -5, statChanges: { str: -1 } }
    },

    'dice_wolf_encounter': {
        id: 'dice_wolf_encounter',
        text: "🐺 숲에서 굶주린 늑대 무리와 마주쳤습니다. 놈들의 눈빛이 좀비만큼이나 광기 어립니다.",
        next: [
            {
                id: 'dice_wolf_success',
                weight: 1.0,
                choiceText: "기세로 압도하기 (매력 기반)",
                dice: { threshold: 80, stat: 'cha', successId: 'dice_wolf_success', failId: 'dice_wolf_fail', hpPenalty: -20 }
            }
        ]
    },
    'dice_wolf_success': {
        id: 'dice_wolf_success',
        text: "👹 성공! 압도적인 위압감을 뿜어내자 늑대들이 꼬리를 내리고 물러납니다.",
        effect: { target: 'RANDOM_1', sanity: 15, statChanges: { cha: 1 }, skillsAdd: [S.LEADERSHIP] }
    },
    'dice_wolf_fail': {
        id: 'dice_wolf_fail',
        text: "🩸 실패... 늑대들이 약함을 간파하고 달려들었습니다! 치열한 싸움 끝에 쫓아냈지만 상처가 깊습니다.",
        effect: { target: 'RANDOM_HALF', hp: -25, fatigue: 20, loot: ['고기'], statChanges: { con: -1 }, skillsRemove: ["카리스마", "가축 사육"] }
    },

    'dice_bandit_checkpoint': {
        id: 'dice_bandit_checkpoint',
        text: "🔫 무장한 약탈자들이 길목을 막고 통행료를 요구합니다. 말이 통할 것 같지 않습니다.",
        next: [
            {
                id: 'dice_bandit_success',
                weight: 1.0,
                choiceText: "거짓말로 유인 및 돌파 (매력 기반)",
                dice: { threshold: 85, stat: 'cha', successId: 'dice_bandit_success', failId: 'dice_bandit_fail', hpPenalty: -30 }
            }
        ]
    },
    'dice_bandit_success': {
        id: 'dice_bandit_success',
        text: "😎 성공! 뒤쪽에 군부대가 오고 있다고 속여 그들을 도망치게 했습니다. 비웃으며 길을 지나갑니다.",
        effect: { target: 'RANDOM_1', sanity: 10, skillsAdd: [S.PUBLIC_RELATIONS] }
    },
    'dice_bandit_fail': {
        id: 'dice_bandit_fail',
        text: "🧨 실패! 거짓말이 들통나자 그들이 총을 쏘기 시작했습니다. 소중한 물자를 버리고 도망칩니다.",
        effect: { target: 'RANDOM_1', hp: -10, inventoryRemove: ['통조림'], fatigue: 15, statChanges: { cha: -1 }, skillsRemove: ["이미지 메이킹"] }
    },

    'dice_rusty_fire_escape': {
        id: 'dice_rusty_fire_escape',
        text: "🏙️ 건물 5층에 물자가 보입니다. 녹슨 비상계단을 타고 올라가야 합니다.",
        next: [
            {
                id: 'dice_escape_success',
                weight: 1.0,
                choiceText: "계단 오르기 (힘 기반)",
                dice: { threshold: 75, stat: 'str', successId: 'dice_escape_success', failId: 'dice_escape_fail', hpPenalty: -15 }
            }
        ]
    },
    'dice_escape_success': {
        id: 'dice_escape_success',
        text: "🧗 성공! 가파른 계단을 무사히 올라 5층 창고에 도달했습니다. 깨끗한 물자를 확보했습니다.",
        effect: { target: 'ALL', loot: ['통조림', '비타민'], fatigue: 15, statChanges: { str: 1 } }
    },
    'dice_escape_fail': {
        id: 'dice_escape_fail',
        text: "💥 실패! 계단 한 칸이 부서지며 다리가 끼었습니다. 간신히 빠져나왔지만 심각한 통증을 느킵니다.",
        effect: { target: 'RANDOM_1', hp: -25, fatigue: 15, statChanges: { agi: -1, con: -1 } }
    },

    // --- New Additional 20 Nodes ---
    'dice_plane_crash': {
        id: 'dice_plane_crash',
        text: "✈️ 근처 숲에 화물기가 추락했습니다! 아직 타오르는 잔해 속에서 물자를 건져낼 수 있을까요?",
        next: [{
            id: 'dice_plane_success', weight: 1.0, choiceText: "잔해 속으로 뛰어들기 (민첩 기반)",
            dice: { threshold: 80, stat: 'agi', successId: 'dice_plane_success', failId: 'dice_plane_fail', hpPenalty: -30 }
        }]
    },
    'dice_plane_success': { id: 'dice_plane_success', text: "📦 성공! 열기를 뚫고 온전한 구급 상자와 통조림들을 챙겨 나왔습니다.", effect: { target: 'ALL', loot: ['붕대', '통조림', '비타민'], sanity: 5 } },
    'dice_plane_fail': { id: 'dice_plane_fail', text: "🔥 실패! 갑작스러운 2차 폭발로 화상을 입고 튕겨 나갔습니다.", effect: { target: 'RANDOM_1', hp: -40, fatigue: 20, statChanges: { con: -1 } } },

    'dice_rusty_pump': {
        id: 'dice_rusty_pump',
        text: "🚰 버려진 마을의 수동 펌프를 발견했습니다. 녹을 제거하고 작동시키면 깨끗한 물을 얻을 수 있습니다.",
        next: [{
            id: 'dice_pump_success', weight: 1.0, choiceText: "펌프 손잡이 수리 (힘 기반)",
            dice: { threshold: 70, stat: 'str', successId: 'dice_pump_success', failId: 'dice_pump_fail', hpPenalty: -10 }
        }]
    },
    'dice_pump_success': { id: 'dice_pump_success', text: "💧 성공! 맑은 물이 쏟아져 나옵니다. 모두가 갈증을 해소하고 활기를 되찾습니다.", effect: { target: 'RANDOM_1', hp: 10, fatigue: -20, skillsAdd: [S.PLUMBING] } },
    'dice_pump_fail': { id: 'dice_pump_fail', text: "🔩 실패! 무리하게 힘을 주다 펌프 축이 완전히 부러졌습니다.", effect: { target: 'RANDOM_1', fatigue: 15, statChanges: { str: -1 }, skillsRemove: ["수원 확보"] } },

    'dice_bully_scare': {
        id: 'dice_bully_scare',
        text: "💢 약탈자 무리가 길을 막고 위협합니다. 싸우기엔 수가 너무 많습니다. 겁을 줘서 쫓아낼 수 있을까요?",
        next: [{
            id: 'dice_bully_success', weight: 1.0, choiceText: "압도적인 기세 보이기 (매력 기반)",
            dice: { threshold: 85, stat: 'cha', successId: 'dice_bully_success', failId: 'dice_bully_fail', sanityPenalty: -20 }
        }]
    },
    'dice_bully_success': { id: 'dice_bully_success', text: "👹 성공! 냉혹한 눈빛과 위압감에 약탈자들은 겁을 먹고 도망쳤습니다.", effect: { target: 'RANDOM_1', sanity: 15, statChanges: { cha: 1 }, skillsAdd: [S.LAW_ENFORCEMENT] } },
    'dice_bully_fail': { id: 'dice_bully_fail', text: "💢 실패! 허세인 것이 들통나 비웃음을 샀고, 물자 일부를 빼앗겼습니다.", effect: { target: 'RANDOM_1', inventoryRemove: ['통조림'], sanity: -15, skillsRemove: ["질서 유지"] } },

    'dice_logic_puzzle': {
        id: 'dice_logic_puzzle',
        text: "🔐 금고 위에 기묘한 수수께끼가 적혀 있습니다. 논리적인 추론이 필요합니다.",
        next: [{
            id: 'dice_logic_success', weight: 1.0, choiceText: "암호 해독 (지능 기반)",
            dice: { threshold: 80, stat: 'int', successId: 'dice_logic_success', failId: 'dice_logic_fail', sanityPenalty: -10 }
        }]
    },
    'dice_logic_success': { id: 'dice_logic_success', text: "🔓 성공! 금고가 열리고 유통기한이 남은 비타민과 지도가 나옵니다.", effect: { target: 'RANDOM_1', loot: ['비타민', '지도'], statChanges: { int: 1 }, skillsAdd: [S.LUCK] } },
    'dice_logic_fail': { id: 'dice_logic_fail', text: "😵 실패! 머리만 아프고 금고는 굳게 잠긴 채입니다.", effect: { target: 'RANDOM_1', sanity: -5, fatigue: 10, skillsRemove: ["도박사의 운", "지식 전수"] } },

    'dice_tightrope': {
        id: 'dice_tightrope',
        text: "🏗️ 공사 중인 건물의 좁은 철골 위를 걸어 건너편으로 이동해야 합니다. 좀비들이 밑에서 기다립니다.",
        next: [{
            id: 'dice_tightrope_success', weight: 1.0, choiceText: "균형 잡고 건너기 (민첩 기반)",
            dice: { threshold: 75, stat: 'agi', successId: 'dice_tightrope_success', failId: 'dice_tightrope_fail', hpPenalty: -25 }
        }]
    },
    'dice_tightrope_success': { id: 'dice_tightrope_success', text: "🤸 성공! 서커스 단원처럼 가볍게 철골을 타고 건넜습니다.", effect: { target: 'RANDOM_1', fatigue: 5, statChanges: { agi: 1 }, skillsAdd: [S.ACROBATIC] } },
    'dice_tightrope_fail': { id: 'dice_tightrope_fail', text: "😱 실패! 발을 헛디뎌 추락할 뻔했습니다. 간신히 매달려 올라왔지만 온몸이 멍투성입니다.", effect: { target: 'RANDOM_1', hp: -35, fatigue: 20, statChanges: { con: -1 }, skillsRemove: ["유연한 몸놀림"] } },

    'dice_wall_push': {
        id: 'dice_wall_push',
        text: "🏚️ 무너진 벽 파편 아래 유용한 가방이 보입니다. 무거운 콘크리트를 밀어내야 합니다.",
        next: [{
            id: 'dice_push_success', weight: 1.0, choiceText: "파편 밀어내기 (힘 기반)",
            dice: { threshold: 80, stat: 'str', successId: 'dice_push_success', failId: 'dice_push_fail', hpPenalty: -15 }
        }]
    },
    'dice_push_success': { id: 'dice_push_success', text: "💪 성공! 파편을 들어 올리고 가방 안에서 항생제를 찾았습니다.", effect: { target: 'RANDOM_1', loot: ['항생제'], statChanges: { str: 1 }, skillsAdd: [S.ATHLETICS] } },
    'dice_push_fail': { id: 'dice_push_fail', text: "🩸 실패! 파편이 미끄러져 발을 찧었습니다. 엄청난 고통이 밀려옵니다.", effect: { target: 'RANDOM_1', hp: -20, fatigue: 15, statChanges: { con: -1 }, skillsRemove: ["폭발적 근력"] } },

    'dice_old_lock': {
        id: 'dice_old_lock',
        text: "🗝️ 앤티크 샵의 진열장에 귀한 의료용 키트가 보입니다. 자물쇠가 정교합니다.",
        next: [{
            id: 'dice_lock_success', weight: 1.0, choiceText: "정밀 핀 조작 (지능 기반)",
            dice: { threshold: 85, stat: 'int', successId: 'dice_lock_success', failId: 'dice_lock_fail', sanityPenalty: -5 }
        }]
    },
    'dice_lock_success': { id: 'dice_lock_success', text: "🔓 성공! 딸칵 소리와 함께 유리장이 열렸습니다. 최상급 붕대를 확보했습니다.", effect: { target: 'RANDOM_1', loot: ['붕대','붕대'], statChanges: { int: 1 } } },
    'dice_lock_fail': { id: 'dice_lock_fail', text: "🔇 실패! 자물쇠 내부가 엉켜버려 영영 열 수 없게 되었습니다.", effect: { target: 'ALL', fatigue: 5 } },

    'dice_honey_tongue': {
        id: 'dice_honey_tongue',
        text: "🗣️ 잔뜩 예민해진 다른 생존자 일행을 만났습니다. 말 한마디 잘못하면 싸움이 날 것 같습니다.",
        next: [{
            id: 'dice_honey_success', weight: 1.0, choiceText: "친근하게 말 걸기 (매력 기반)",
            dice: { threshold: 75, stat: 'cha', successId: 'dice_honey_success', failId: 'dice_honey_fail', sanityPenalty: -15 }
        }]
    },
    'dice_honey_success': { id: 'dice_honey_success', text: "🤝 성공! 그들은 경계를 풀고 우리에게 여분의 초콜릿을 나누어 주었습니다.", effect: { target: 'RANDOM_1', loot: ['초콜릿'], statChanges: { cha: 1 }, skillsAdd: [S.ADMINISTRATION, S.SECRETARY, S.ACTING] } },
    'dice_honey_fail': { id: 'dice_honey_fail', text: "💢 실패! 오해를 불러일으켜 심한 말다툼이 벌어졌습니다. 기분만 상했습니다.", effect: { target: 'RANDOM_1', sanity: -15, statChanges: { cha: -1 }, skillsRemove: ["행정 처리", "보좌술", "메소드 연기"] } },

    'dice_cluttered_attic': {
        id: 'dice_cluttered_attic',
        text: "🏘️ 버려진 집의 다락방으로 올라가야 합니다. 계단이 썩어 매우 위태롭습니다.",
        next: [{
            id: 'dice_attic_success', weight: 1.0, choiceText: "살금살금 오르기 (민첩 기반)",
            dice: { threshold: 70, stat: 'agi', successId: 'dice_attic_success', failId: 'dice_attic_fail', hpPenalty: -20 }
        }]
    },
    'dice_attic_success': { id: 'dice_attic_success', text: "📦 성공! 조심스럽게 올라가서 먼지 쌓인 통조림 두 통을 찾아냈습니다.", effect: { target: 'RANDOM_1', loot: ['통조림', '통조림'], sanity: 5, skillsAdd: [S.GAMER_REFLEX] } },
    'dice_attic_fail': { id: 'dice_attic_fail', text: "💥 실패! 계단이 무너지며 바닥으로 추락했습니다. 비명을 지르며 좀비들에게 위치를 알리고 말았습니다.", effect: { target: 'RANDOM_1', hp: -25, fatigue: 15, statChanges: { agi: -1 }, skillsRemove: ["반사 신경"] } },

    'dice_heavy_debris': {
        id: 'dice_heavy_debris',
        text: "🛣️ 도로가 폐차들로 막혀 있습니다. 한 대만 옆으로 밀어내면 지름길로 갈 수 있습니다.",
        next: [{
            id: 'dice_debris_success', weight: 1.0, choiceText: "차량 밀기 (힘 기반)",
            dice: { threshold: 85, stat: 'str', successId: 'dice_debris_success', failId: 'dice_debris_fail', hpPenalty: -10 }
        }]
    },
    'dice_debris_success': { id: 'dice_debris_success', text: "💪 성공! 전신 근육을 사용해 차를 밀어내고 길을 뚫었습니다. 이동 시간을 단축했습니다.", effect: { target: 'RANDOM_1', fatigue: -15, statChanges: { str: 1 }, skillsAdd: [S.DRIVING] } },
    'dice_debris_fail': { id: 'dice_debris_fail', text: "🥵 실패! 차는 꿈쩍도 하지 않고 허리 근육만 놀랐습니다.", effect: { target: 'RANDOM_1', hp: -10, fatigue: 30, statChanges: { con: -1 }, skillsRemove: ["숙련된 운전"] } },

    'dice_circuit_board': {
        id: 'dice_circuit_board',
        text: "📟 작동을 멈춘 보안 단말기가 있습니다. 배선을 연결하면 문을 열 수 있습니다.",
        next: [{
            id: 'dice_circuit_success', weight: 1.0, choiceText: "회로 재연결 (지능 기반)",
            dice: { threshold: 80, stat: 'int', successId: 'dice_circuit_success', failId: 'dice_circuit_fail', sanityPenalty: -5 }
        }]
    },
    'dice_circuit_success': { id: 'dice_circuit_success', text: "💡 성공! 단말기가 켜지며 숨겨진 비상 통로가 열렸습니다. 안전 가옥에 진입합니다.", effect: { target: 'RANDOM_1', sanity: 15, fatigue: -10, skillsAdd: [S.ELECTRONICS] } },
    'dice_circuit_fail': { id: 'dice_circuit_fail', text: "⚡ 실패! 전기 충격을 입고 단말기가 완전히 타버렸습니다.", effect: { target: 'RANDOM_1', hp: -15, fatigue: 10, skillsRemove: ["전자 공학"] } },

    'dice_emotional_plea': {
        id: 'dice_emotional_plea',
        text: "🛡️ 우리를 내쫓으려는 다른 생존자 캠프 주민들을 설득해야 합니다. 감성에 호소할까요?",
        next: [{
            id: 'dice_plea_success', weight: 1.0, choiceText: "눈물 섞인 호소 (매력 기반)",
            dice: { threshold: 80, stat: 'cha', successId: 'dice_plea_success', failId: 'dice_plea_fail', sanityPenalty: -20 }
        }]
    },
    'dice_plea_success': { id: 'dice_plea_success', text: "🥺 성공! 그들은 우리의 사정에 공감하며 하룻밤 묵어갈 곳과 따뜻한 스튜를 제공했습니다.", effect: { target: 'ALL', hp: 15, sanity: 20, fatigue: -20 } },
    'dice_plea_fail': { id: 'dice_plea_fail', text: "❄️ 실패! 그들은 냉담했습니다. 오히려 비웃음을 당하고 쫓겨났습니다.", effect: { target: 'ALL', sanity: -20, statChanges: { cha: -1 } } },

    'dice_river_leap': {
        id: 'dice_river_leap',
        text: "🌊 오염된 강 위로 부서진 교각이 드문드문 보입니다. 뛰어넘어야만 합니다.",
        next: [{
            id: 'dice_leap_success', weight: 1.0, choiceText: "도약하기 (민첩 기반)",
            dice: { threshold: 85, stat: 'agi', successId: 'dice_leap_success', failId: 'dice_leap_fail', hpPenalty: -30 }
        }]
    },
    'dice_leap_success': { id: 'dice_leap_success', text: "🏃 성공! 완벽한 도약으로 강을 건넜습니다. 오염 지역을 빠르게 벗어납니다.", effect: { target: 'RANDOM_1', fatigue: 5, statChanges: { agi: 1 }, skillsAdd: [S.FISHING] } },
    'dice_leap_fail': { id: 'dice_leap_fail', text: "💧 실패! 강물에 빠져 허우적댔습니다. 옷은 젖었고 감염의 위협이 느껴집니다.", effect: { target: 'RANDOM_HALF', hp: -10, infection: 25, fatigue: 30, skillsRemove: ["그물 낚시"] } },

    'dice_iron_door': {
        id: 'dice_iron_door',
        text: "🚪 거대한 철문이 잠겨 있습니다. 지레를 이용해 억지로 벌려야 합니다.",
        next: [{
            id: 'dice_iron_success', weight: 1.0, choiceText: "문 벌리기 (힘 기반)",
            dice: { threshold: 75, stat: 'str', successId: 'dice_iron_success', failId: 'dice_iron_fail', hpPenalty: -10 }
        }]
    },
    'dice_iron_success': { id: 'dice_iron_success', text: "🔓 성공! 삐걱거리는 소리와 함께 문이 열렸습니다. 안에서 비상 물자를 획득합니다.", effect: { target: 'ALL', loot: ['통조림', '붕대'], statChanges: { str: 1 } } },
    'dice_iron_fail': { id: 'dice_iron_fail', text: "💥 실패! 쇠지렛대가 튕겨나가며 팔을 강타했습니다.", effect: { target: 'RANDOM_1', hp: -20, fatigue: 10, statChanges: { con: -1 } } },

    'dice_chemical_mix': {
        id: 'dice_chemical_mix',
        text: "🧪 실험실 구석에 정체불명의 용액들이 있습니다. 잘 배합하면 소독제가 될 것 같습니다.",
        next: [{
            id: 'dice_chem_success', weight: 1.0, choiceText: "용액 배합 (지능 기반)",
            dice: { threshold: 90, stat: 'int', successId: 'dice_chem_success', failId: 'dice_chem_fail', sanityPenalty: -5 }
        }]
    },
    'dice_chem_success': { id: 'dice_chem_success', text: "🧪 성공! 강력한 살균 소독제를 만들어냈습니다. 감염 예방에 큰 도움이 될 것입니다.", effect: { target: 'RANDOM_1', infection: -30, skillsAdd: [S.PHARMACOLOGY] } },
    'dice_chem_fail': { id: 'dice_chem_fail', text: "🤢 실패! 유독 가스가 발생해 모두가 기침을 하며 도망쳐야 했습니다.", effect: { target: 'RANDOM_1', hp: -5, fatigue: 20, skillsRemove: ["약물 조제"] } },

    'dice_street_performance': {
        id: 'dice_street_performance',
        text: "🎸 광장에 좀비들이 가득합니다. 누군가 악기를 연주해 주의를 끌면 나머지가 통과할 수 있습니다.",
        next: [{
            id: 'dice_perf_success', weight: 1.0, choiceText: "공연 시작 (매력 기반)",
            dice: { threshold: 85, stat: 'cha', successId: 'dice_perf_success', failId: 'dice_perf_fail', hpPenalty: -30 }
        }]
    },
    'dice_perf_success': { id: 'dice_perf_success', text: "✨ 성공! 화려한 연주와 퍼포먼스에 좀비들이 넋을 잃었습니다. 동료들은 피해 없이 광장을 지났습니다.", effect: { target: 'RANDOM_1', sanity: 15, skillsAdd: [S.PERFORMANCE] } },
    'dice_perf_fail': { id: 'dice_perf_fail', text: "📢 실패! 소리만 지르다 좀비들에게 포위당했습니다. 난전이 벌어집니다.", effect: { target: 'RANDOM_HALF', hp: -25, kill: 3, fatigue: 20, skillsRemove: ["매력 발산"] } },

    'dice_slippery_ledge': {
        id: 'dice_slippery_ledge',
        text: "🧗 이끼 낀 절벽 난간을 타고 이동해야 합니다. 발밑은 낭떠러지입니다.",
        next: [{
            id: 'dice_ledge_success', weight: 1.0, choiceText: "난간 타기 (민첩 기반)",
            dice: { threshold: 80, stat: 'agi', successId: 'dice_ledge_success', failId: 'dice_ledge_fail', hpPenalty: -40 }
        }]
    },
    'dice_ledge_success': { id: 'dice_ledge_success', text: "🧗 성공! 유령처럼 조용하고 신속하게 난간을 통과했습니다.", effect: { target: 'ALL', fatigue: 15, statChanges: { agi: 1 } } },
    'dice_ledge_fail': { id: 'dice_ledge_fail', text: "😱 실패! 미끄러져 추락하다 간신히 바위를 잡았습니다. 어깨가 빠질 것 같습니다.", effect: { target: 'RANDOM_1', hp: -45, fatigue: 30, statChanges: { con: -1 } } },

    'dice_boulder_roll': {
        id: 'dice_boulder_roll',
        text: "🪨 산길에 바위가 굴러 내려옵니다! 피할 곳이 마땅치 않습니다. 정면으로 막아내거나 쳐내야 합니다.",
        next: [{
            id: 'dice_boulder_success', weight: 1.0, choiceText: "바위 밀쳐내기 (힘 기반)",
            dice: { threshold: 90, stat: 'str', successId: 'dice_boulder_success', failId: 'dice_boulder_fail', hpPenalty: -50 }
        }]
    },
    'dice_boulder_success': { id: 'dice_boulder_success', text: "💪 성공! 초인적인 힘으로 바위의 궤적을 바꿨습니다. 모두가 안전합니다.", effect: { target: 'RANDOM_1', sanity: 10, fatigue: 40, statChanges: { str: 2 }, skillsAdd: [S.SURVIVAL_INSTINCT] } },
    'dice_boulder_fail': { id: 'dice_boulder_fail', text: "🚑 실패! 바위에 휩쓸려 큰 부상을 입었습니다. 뼈가 으스러지는 소리가 들립니다.", effect: { target: 'RANDOM_1', hp: -50, fatigue: 30, statChanges: { con: -2 }, skillsRemove: ["생존 본능"] } },

    'dice_ancient_script': {
        id: 'dice_ancient_script',
        text: "📜 오래된 성당 지하에서 고대 문자로 된 치료 기록을 발견했습니다. 해독할 수 있을까요?",
        next: [{
            id: 'dice_script_success', weight: 1.0, choiceText: "기록 해독 (지능 기반)",
            dice: { threshold: 95, stat: 'int', successId: 'dice_script_success', failId: 'dice_script_fail', sanityPenalty: -20 }
        }]
    },
    'dice_script_success': { id: 'dice_script_success', text: "📖 성공! 면역 체계를 강화하는 고대 지식을 습득했습니다. 이제 좀비가 두렵지 않습니다.", effect: { target: 'RANDOM_1', infection: -50, sanity: 30, skillsAdd: [S.DIVINATION] } },
    'dice_script_fail': { id: 'dice_script_fail', text: "🌀 실패! 기괴한 문양을 읽다 심한 현기증과 정신적 혼란을 겪었습니다.", effect: { target: 'RANDOM_1', sanity: -30, mentalState: 'Delusion', skillsRemove: ["예지력"] } },

    'dice_group_cheer': {
        id: 'dice_group_cheer',
        text: "📢 모두가 탈진해 쓰러지려 합니다. 마지막 열정을 쥐어짜야 합니다.",
        next: [{
            id: 'dice_cheer_success', weight: 1.0, choiceText: "희망의 연설 (매력 기반)",
            dice: { threshold: 85, stat: 'cha', successId: 'dice_cheer_success', failId: 'dice_cheer_fail', sanityPenalty: -30 }
        }]
    },
    'dice_cheer_success': { id: 'dice_cheer_success', text: "🔥 성공! 뜨거운 연설에 모두가 눈물을 흘리며 일어섰습니다. 기적적인 회복입니다.", effect: { target: 'RANDOM_1', hp: 20, sanity: 40, fatigue: -50, skillsAdd: [S.TACTICAL_COMMAND] } },
    'dice_cheer_fail': { id: 'dice_cheer_fail', text: "🔇 실패... 공허한 외침은 비웃음만 샀습니다. 그룹의 결속력이 무너집니다.", effect: { target: 'RANDOM_1', sanity: -20, affinity: -10, skillsRemove: ["전술 지휘"] } }
};
