
export interface StoryEffect {
    target: 'ALL' | 'RANDOM_1' | 'RANDOM_HALF'; // 효과 대상
    hp?: number;
    sanity?: number;
    fatigue?: number;
    loot?: string[]; // 획득 아이템
}

export interface StoryNode {
    id: string;
    text: string;
    // 다음으로 이어질 수 있는 이벤트들의 목록과 가중치(확률)
    next?: { id: string; weight: number }[]; 
    // 이 노드에 도달했을 때 발생하는 효과
    effect?: StoryEffect;
}

// 모든 스토리 노드 정의
export const STORY_NODES: Record<string, StoryNode> = {
    // --- 1. 날씨/환경 아크 (The Storm) ---
    'storm_start': {
        id: 'storm_start',
        text: "⛈️ 먹구름이 심상치 않게 몰려오고 있습니다. 공기에서 비릿한 냄새가 납니다.",
        next: [
            { id: 'storm_heavy', weight: 0.7 },
            { id: 'storm_pass', weight: 0.3 }
        ],
        effect: { target: 'ALL', fatigue: 5 } // 준비하느라 피곤함
    },
    'storm_heavy': {
        id: 'storm_heavy',
        text: "⚡ 거센 폭풍우가 캠프를 강타했습니다! 빗물이 들이치고 시야가 차단되었습니다.",
        next: [
            { id: 'storm_leak', weight: 0.4 },
            { id: 'storm_zombies', weight: 0.4 },
            { id: 'storm_clearing', weight: 0.2 }
        ],
        effect: { target: 'ALL', hp: -5, fatigue: 15, sanity: -5 } // 폭풍 피해
    },
    'storm_pass': {
        id: 'storm_pass',
        text: "☁️ 다행히 폭풍은 빗겨갔지만, 눅눅한 습기가 캠프를 감싸고 있습니다.",
        effect: { target: 'ALL', fatigue: 5 }
    },
    'storm_leak': {
        id: 'storm_leak',
        text: "💧 폭풍우의 여파로 식량 창고의 지붕이 샜습니다. 물자 일부가 손상되었습니다.",
        effect: { target: 'ALL', sanity: -10 }
    },
    'storm_zombies': {
        id: 'storm_zombies',
        text: "🧟 빗소리에 묻혀 접근한 좀비들이 울타리를 긁어대기 시작했습니다. 긴장감이 감돕니다.",
        effect: { target: 'ALL', sanity: -15, fatigue: 10 }
    },
    'storm_clearing': {
        id: 'storm_clearing',
        text: "🌈 폭풍이 지나간 자리에 맑은 하늘이 드러났습니다. 빗물을 식수로 모을 수 있었습니다.",
        effect: { target: 'ALL', sanity: 10, loot: ['생수 500ml', '생수 500ml'] }
    },

    // --- 2. 수상한 신호 아크 (The Signal) ---
    'signal_start': {
        id: 'signal_start',
        text: "📻 오래된 라디오에서 지직거리는 잡음 사이로 사람의 목소리가 들린 것 같습니다.",
        next: [
            { id: 'signal_clear', weight: 0.5 },
            { id: 'signal_lost', weight: 0.5 }
        ],
        effect: { target: 'ALL', sanity: 5 } // 희망
    },
    'signal_lost': {
        id: 'signal_lost',
        text: "🔇 어제 들었던 신호를 다시 잡으려 노력했지만, 라디오는 침묵만을 지킵니다. 잘못 들은 걸까요?",
        effect: { target: 'ALL', sanity: -10 } // 실망
    },
    'signal_clear': {
        id: 'signal_clear',
        text: "📡 신호가 뚜렷해졌습니다. '...북쪽... 쇼핑몰... 생존자...' 좌표를 부르고 있습니다.",
        next: [
            { id: 'signal_trap', weight: 0.4 },
            { id: 'signal_loot', weight: 0.4 },
            { id: 'signal_fake', weight: 0.2 }
        ],
        effect: { target: 'RANDOM_HALF', fatigue: 10 } // 수색 준비
    },
    'signal_trap': {
        id: 'signal_trap',
        text: "⚔️ 좌표가 가리키는 곳은 약탈자들의 함정이었습니다! 치열한 교전 끝에 간신히 도망쳤습니다.",
        effect: { target: 'RANDOM_HALF', hp: -30, fatigue: 30, sanity: -20 } // 큰 피해
    },
    'signal_loot': {
        id: 'signal_loot',
        text: "📦 좌표 근처에서 누군가 남기고 간 보급품 상자를 발견했습니다! 누군가 우릴 돕고 있습니다.",
        effect: { target: 'ALL', sanity: 20, loot: ['통조림', '항생제', '초콜릿'] } // 대박
    },
    'signal_fake': {
        id: 'signal_fake',
        text: "📼 현장에 도착해보니 켜진 녹음기만 반복해서 돌아가고 있었습니다. 허탈함이 밀려옵니다.",
        effect: { target: 'ALL', sanity: -15, fatigue: 20 }
    },

    // --- 3. 미스터리 벙커 아크 (The Bunker) - NEW ---
    'bunker_start': {
        id: 'bunker_start',
        text: "🌲 숲속 깊은 곳에서 덤불에 가려진 낡은 강철 해치를 발견했습니다. '출입 금지' 표지판이 붙어있습니다.",
        next: [
            { id: 'bunker_open_try', weight: 0.6 },
            { id: 'bunker_ignore', weight: 0.4 }
        ]
    },
    'bunker_ignore': {
        id: 'bunker_ignore',
        text: "🚫 불길한 예감이 들어 해치를 그대로 두고 돌아왔습니다. 때로는 호기심이 죽음을 부르는 법입니다.",
        effect: { target: 'ALL', sanity: 5 } // 안도감
    },
    'bunker_open_try': {
        id: 'bunker_open_try',
        text: "🔧 해치를 열기로 결정했습니다. 녹슨 손잡이는 꿈쩍도 하지 않지만, 틈새에서 서늘한 바람이 나옵니다.",
        next: [
            { id: 'bunker_success', weight: 0.5 },
            { id: 'bunker_fail', weight: 0.5 }
        ],
        effect: { target: 'RANDOM_HALF', fatigue: 20 } // 문 여느라 고생
    },
    'bunker_fail': {
        id: 'bunker_fail',
        text: "🔒 아무리 애를 써도 해치는 열리지 않았습니다. 헛수고만 하고 지쳐서 돌아왔습니다.",
        effect: { target: 'ALL', fatigue: 10, sanity: -5 }
    },
    'bunker_success': {
        id: 'bunker_success',
        text: "🔓 끼이익! 굉음과 함께 해치가 열렸습니다. 어두운 사다리가 지하로 이어집니다.",
        next: [
            { id: 'bunker_paradise', weight: 0.3 },
            { id: 'bunker_toxic', weight: 0.3 },
            { id: 'bunker_lab', weight: 0.4 }
        ]
    },
    'bunker_paradise': {
        id: 'bunker_paradise',
        text: "🥫 잭팟! 그곳은 종말론자가 꾸며놓은 벙커였습니다. 유통기한이 남은 통조림과 물을 대량으로 확보했습니다!",
        effect: { target: 'ALL', sanity: 30, loot: ['통조림', '통조림', '생수 500ml', '생수 500ml', '비타민'] }
    },
    'bunker_toxic': {
        id: 'bunker_toxic',
        text: "☠️ 내려가자마자 독한 가스 냄새가 진동했습니다. 곰팡이 포자를 마시고 기침하며 급히 탈출했습니다.",
        effect: { target: 'ALL', hp: -15, fatigue: 10 }
    },
    'bunker_lab': {
        id: 'bunker_lab',
        text: "🧬 이곳은 평범한 벙커가 아닌 실험실이었습니다. 수술대 위에 묶여있던 좀비가 사슬을 끊고 덤벼들었습니다!",
        effect: { target: 'RANDOM_1', hp: -40, fatigue: 20 } // 한 명이 크게 다침
    },

    // --- 4. 광신도 집단 아크 (The Cult) - NEW ---
    'cult_start': {
        id: 'cult_start',
        text: "👁️ 캠프 주변 나무에 기이한 문양이 피로 그려져 있는 것을 발견했습니다. 누군가 우릴 지켜보고 있습니다.",
        next: [
            { id: 'cult_encounter', weight: 0.5 },
            { id: 'cult_hide', weight: 0.5 }
        ],
        effect: { target: 'ALL', sanity: -10 }
    },
    'cult_hide': {
        id: 'cult_hide',
        text: "🤫 우리는 흔적을 지우고 며칠간 숨죽여 지냈습니다. 다행히 기이한 발자국들은 다른 곳으로 멀어졌습니다.",
        effect: { target: 'ALL', fatigue: 10, sanity: 5 }
    },
    'cult_encounter': {
        id: 'cult_encounter',
        text: "🕯️ 한밤중, 횃불을 든 무리가 캠프 앞에 나타났습니다. 그들은 '정화'를 요구하며 문을 두드립니다.",
        next: [
            { id: 'cult_fight', weight: 0.6 },
            { id: 'cult_convert', weight: 0.4 }
        ]
    },
    'cult_fight': {
        id: 'cult_fight',
        text: "⚔️ 미친 소리라며 그들을 쫓아냈습니다. 그들은 저주를 퍼부으며 물러갔지만, 몇몇 동료가 부상을 입었습니다.",
        effect: { target: 'RANDOM_HALF', hp: -20, fatigue: 20 }
    },
    'cult_convert': {
        id: 'cult_convert',
        text: "😵 그들의 말이 묘하게 설득력 있게 들립니다. 몇몇 생존자가 그들의 교리에 현혹되어 정신적으로 불안해졌습니다.",
        effect: { target: 'RANDOM_HALF', sanity: -30 }
    },

    // --- 5. 방랑 상인 아크 (The Trader) - NEW ---
    'trader_start': {
        id: 'trader_start',
        text: "🎒 거대한 배낭을 멘 노인이 캠프 근처를 지나갑니다. 그는 적의가 없어 보이며 손을 흔듭니다.",
        next: [
            { id: 'trader_trade', weight: 0.6 },
            { id: 'trader_rob', weight: 0.2 },
            { id: 'trader_ignore', weight: 0.2 }
        ]
    },
    'trader_ignore': {
        id: 'trader_ignore',
        text: "🚶 함정일지도 모릅니다. 우리는 그를 무시했고, 노인은 어깨를 으쓱하며 사라졌습니다.",
    },
    'trader_trade': {
        id: 'trader_trade',
        text: "🤝 그와 접촉했습니다. 그는 귀한 항생제를 가지고 있었고, 우리에게 남는 식량과 공정한 거래를 제안했습니다.",
        next: [
            { id: 'trader_good_deal', weight: 0.7 },
            { id: 'trader_bad_deal', weight: 0.3 }
        ]
    },
    'trader_good_deal': {
        id: 'trader_good_deal',
        text: "💊 거래 성사! 우리는 귀한 약품을 얻었고, 노인은 덤으로 지도에 안전한 루트를 표시해주었습니다.",
        effect: { target: 'ALL', sanity: 10, loot: ['항생제', '항생제'] }
    },
    'trader_bad_deal': {
        id: 'trader_bad_deal',
        text: "📉 노인이 떠난 뒤 확인해보니, 그가 준 약은 가짜였습니다. 사기를 당했습니다!",
        effect: { target: 'ALL', sanity: -20 }
    },
    'trader_rob': {
        id: 'trader_rob',
        text: "🔫 우리는 거래 대신 노인을 위협해 물건을 뺏으려 했습니다. 하지만 노인은 연막탄을 터뜨리고 순식간에 사라졌습니다.",
        effect: { target: 'ALL', hp: -5, fatigue: 10 } // 콜록거림
    },

    // --- 6. 군 수송대 아크 (Military Convoy) - NEW ---
    'convoy_start': {
        id: 'convoy_start',
        text: "🚛 고속도로 위에 전복된 군용 트럭 행렬이 보입니다. 아직 쓸만한 물건이 있을지도 모릅니다.",
        next: [
            { id: 'convoy_search', weight: 0.7 },
            { id: 'convoy_pass', weight: 0.3 }
        ]
    },
    'convoy_pass': {
        id: 'convoy_pass',
        text: "👀 너무 위험해 보입니다. 우리는 멀리서 지켜보다가 그냥 지나치기로 했습니다.",
    },
    'convoy_search': {
        id: 'convoy_search',
        text: "🔍 조심스럽게 트럭에 접근합니다. 잠긴 뒷문을 열자 안에서 덜컹거리는 소리가 납니다.",
        next: [
            { id: 'convoy_weapon', weight: 0.4 },
            { id: 'convoy_horde', weight: 0.6 }
        ]
    },
    'convoy_weapon': {
        id: 'convoy_weapon',
        text: "🔫 트럭 안에는 미처 회수하지 못한 군용 장비와 탄약이 들어있었습니다! 화력이 대폭 상승했습니다.",
        effect: { target: 'ALL', sanity: 20, loot: ['맥가이버 칼', '통조림'] }
    },
    'convoy_horde': {
        id: 'convoy_horde',
        text: "🧟‍♀️ 문을 열자마자 안에 갇혀있던 군인 좀비들이 쏟아져 나왔습니다! 함정이었습니다!",
        effect: { target: 'ALL', hp: -25, fatigue: 25 }
    },


    // --- 7. 야생 동물 & 질병 (기존) ---
    'dog_start': {
        id: 'dog_start',
        text: "🐕 캠프 주변을 서성이는 떠돌이 개 한 마리를 발견했습니다. 굶주려 보입니다.",
        next: [ { id: 'dog_feed', weight: 0.5 }, { id: 'dog_chase', weight: 0.5 } ]
    },
    'dog_feed': {
        id: 'dog_feed',
        text: "🥩 남겨둔 음식을 개에게 주었습니다. 개는 꼬리를 흔들며 어딘가로 가라는 듯 짖습니다.",
        next: [ { id: 'dog_treasure', weight: 1.0 } ],
        effect: { target: 'ALL', sanity: 5 }
    },
    'dog_chase': { 
        id: 'dog_chase', 
        text: "👋 혹시 감염되었을지 몰라 개를 쫓아냈습니다. 개는 슬픈 눈으로 숲으로 사라졌습니다.",
        effect: { target: 'ALL', sanity: -5 }
    },
    'dog_treasure': { 
        id: 'dog_treasure', 
        text: "💎 개를 따라가 보니 숲속 덤불에 숨겨진 여행 가방을 발견했습니다. 쓸만한 물건들이 들어있습니다.",
        effect: { target: 'ALL', loot: ['붕대', '초콜릿', '비타민'] }
    },

    'flu_start': {
        id: 'flu_start',
        text: "🤒 몇몇 생존자들이 고열과 기침 증상을 호소하기 시작했습니다. 단순 감기일까요?",
        next: [ { id: 'flu_worse', weight: 0.4 }, { id: 'flu_better', weight: 0.6 } ],
        effect: { target: 'RANDOM_HALF', fatigue: 15 }
    },
    'flu_better': { 
        id: 'flu_better', 
        text: "💊 다행히 환자들의 열이 내렸습니다. 단순한 계절성 독감이었습니다.",
        effect: { target: 'ALL', sanity: 5 }
    },
    'flu_worse': {
        id: 'flu_worse',
        text: "🏥 증상이 악화되었습니다. 사람들은 좀비 바이러스가 아닌지 의심하며 서로를 경계합니다.",
        next: [ { id: 'flu_crisis', weight: 1.0 } ],
        effect: { target: 'RANDOM_HALF', hp: -10, fatigue: 20 }
    },
    'flu_crisis': { 
        id: 'flu_crisis', 
        text: "📉 캠프 내 분위기가 흉흉합니다. 약이 부족해 모두가 예민해져 있습니다.",
        effect: { target: 'ALL', sanity: -15 }
    },

    // --- 8. 단발성 이벤트 (One-offs) ---
    'sunny_day': { id: 'sunny_day', text: "☀️ 구름 한 점 없는 맑은 날입니다. 태양 전지판 충전이 잘 될 것 같습니다.", effect: { target: 'ALL', sanity: 5 } },
    'foggy_day': { id: 'foggy_day', text: "🌫️ 안개가 자욱해 한 치 앞도 보이지 않습니다. 오늘은 멀리 나가지 않는 게 좋겠습니다.", effect: { target: 'ALL', fatigue: 5 } },
    'quiet_day': { id: 'quiet_day', text: "🤫 기묘할 정도로 조용한 하루입니다. 좀비들의 울음소리조차 들리지 않습니다.", effect: { target: 'ALL', fatigue: -10 } },
    'music_night': { id: 'music_night', text: "🎸 누군가 오래된 기타를 연주합니다. 잠시나마 평화가 찾아왔습니다.", effect: { target: 'ALL', sanity: 15 } },
    'helicopter': { id: 'helicopter', text: "🚁 멀리서 헬리콥터 소리가 들렸지만, 너무 높이 날아 구조 요청을 보낼 수 없었습니다.", effect: { target: 'ALL', sanity: -5 } },
    'full_moon': { id: 'full_moon', text: "🌕 보름달이 떴습니다. 달빛 아래 좀비들의 그림자가 길게 드리웁니다.", effect: { target: 'ALL', sanity: -5 } },
    'car_found': { id: 'car_found', text: "🚑 버려진 구급차를 발견했지만, 이미 내부는 텅 비어있었습니다.", effect: { target: 'ALL', sanity: -5 } },
    'horde_pass': { id: 'horde_pass', text: "🧟‍♂️ 수천 마리의 좀비 떼가 캠프 근처를 지나갔습니다. 숨을 죽이고 그들이 지나가길 기다렸습니다.", effect: { target: 'ALL', fatigue: 10, sanity: -5 } }
};

// 시작 가능한 이벤트 ID 목록 (Main Events)
export const STARTER_NODE_IDS = [
    'storm_start', 
    'signal_start', 
    'dog_start', 
    'flu_start',
    'bunker_start',
    'cult_start',
    'trader_start',
    'convoy_start',
    'sunny_day',
    'foggy_day',
    'quiet_day',
    'music_night',
    'helicopter',
    'full_moon',
    'car_found',
    'horde_pass'
];

/**
 * 다음 스토리 노드를 결정하는 함수
 * @param currentId 현재 노드 ID (없으면 랜덤 시작)
 */
export const getNextStoryNode = (currentId: string | null): StoryNode => {
    // 1. 현재 진행 중인 이벤트가 있고, 다음 단계가 정의되어 있다면
    if (currentId && STORY_NODES[currentId] && STORY_NODES[currentId].next) {
        const nextOptions = STORY_NODES[currentId].next!;
        const totalWeight = nextOptions.reduce((sum, opt) => sum + opt.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const option of nextOptions) {
            random -= option.weight;
            if (random <= 0) {
                return STORY_NODES[option.id];
            }
        }
        // Fallback
        return STORY_NODES[nextOptions[0].id];
    }

    // 2. 진행 중인 이벤트가 없거나, 체인의 끝이라면 -> 새로운 메인 이벤트 시작
    const randomStarterId = STARTER_NODE_IDS[Math.floor(Math.random() * STARTER_NODE_IDS.length)];
    return STORY_NODES[randomStarterId];
};
