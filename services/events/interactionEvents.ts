


// Return type allows string (legacy) or object
export type InteractionResult = string | { 
    text: string; 
    affinity?: number; 
    actorHp?: number; 
    targetHp?: number; 
    actorSanity?: number; 
    targetSanity?: number; 
    actorFatigue?: number; 
    targetFatigue?: number;
};

type InteractionFunction = (a: string, b: string) => InteractionResult;

export const INTERACTION_TEMPLATES: { POSITIVE: InteractionFunction[]; NEGATIVE: InteractionFunction[] } = {
    POSITIVE: [
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로의 등을 지켜주며 신뢰를 쌓았습니다.`, affinity: 5, targetSanity: 2 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 자신의 비상 식량을 나눠주었습니다.`, affinity: 10, targetHp: 5 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 옛날 이야기를 나누며 깊은 유대감을 느꼈습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
        (a: string, b: string) => ({ text: `${a}은(는) 위험에 처한 ${b}을(를) 간발의 차로 구했습니다.`, affinity: 15, targetSanity: 5 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 함께 보초를 서며 서로에 대해 더 알게 되었습니다.`, affinity: 3, actorFatigue: 5, targetFatigue: 5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 상처를 정성껏 치료해주었습니다.`, affinity: 10, targetHp: 10 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 미래에 대한 희망을 이야기하며 서로를 격려했습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}이(가) 힘들어하는 것을 보고 조용히 도와주었습니다.`, affinity: 5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 무기를 손질해주며 우정을 표현했습니다.`, affinity: 5 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 좀비 아포칼립스 이후 처음으로 큰 소리로 함께 웃었습니다.`, affinity: 10, actorSanity: 10, targetSanity: 10 }),
        (a: string, b: string) => ({ text: `${a}은(는) 악몽을 꾸는 ${b}의 손을 잡아주었습니다.`, affinity: 8, targetSanity: 5 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로만의 비밀 수신호를 만들었습니다.`, affinity: 5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 지저분해진 머리카락을 직접 잘라주며 단정하게 해주었습니다.`, affinity: 5, targetSanity: 2 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 우연히 발견한 술 한 병을 나눠 마시며 건배했습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 생존 기술 하나를 친절하게 가르쳐주었습니다.`, affinity: 5 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 비가 오는 동안 처마 밑에서 조용히 빗소리를 감상했습니다.`, affinity: 3, actorSanity: 5, targetSanity: 5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 해진 옷을 기워주며 솜씨를 뽐냈습니다.`, affinity: 5 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 하이파이브를 하며 완벽한 호흡을 확인했습니다.`, affinity: 5 })
    ],
    NEGATIVE: [
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 방식이 마음에 들지 않아 언성을 높였습니다.`, affinity: -5, actorSanity: -2, targetSanity: -2 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 무모한 행동을 비난하며 화를 냈습니다.`, affinity: -10, targetSanity: -5 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 이동 경로를 두고 심하게 다투었습니다.`, affinity: -10, actorSanity: -5, targetSanity: -5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}이(가) 식량을 훔쳤다고 의심했습니다.`, affinity: -15, targetSanity: -5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 태도가 마음에 들지 않아 차갑게 대했습니다.`, affinity: -5 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b} 사이에는 숨막히는 침묵만이 흘렀습니다.`, affinity: -2, actorSanity: -2, targetSanity: -2 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 실수 때문에 위험에 처할 뻔했다며 탓했습니다.`, affinity: -10, targetSanity: -5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 이기적인 태도에 실망감을 감추지 못했습니다.`, affinity: -5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "너 때문에 우리가 위험해졌어"라고 쏘아붙였습니다.`, affinity: -15, targetSanity: -10 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 사소한 물건 하나를 두고 서로 소유권을 주장하며 싸웠습니다.`, affinity: -10, actorHp: -1, targetHp: -1 }), // 싸움
        (a: string, b: string) => ({ text: `${a}은(는) ${b}가 코를 너무 심하게 곤다며 잠을 못 잤다고 불평했습니다.`, affinity: -5, actorFatigue: 5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 몸에서 나는 냄새를 지적하여 기분을 상하게 했습니다.`, affinity: -5, targetSanity: -2 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}가 몰래 물을 더 마셨다며 비난했습니다.`, affinity: -10 }),
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 정치적인 견해 차이로 쓸데없는 언쟁을 벌였습니다.`, affinity: -5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}의 발소리가 너무 크다며 조용히 하라고 짜증을 냈습니다.`, affinity: -5 }),
        (a: string, b: string) => ({ text: `${a}은(는) 위급한 상황에서 얼어붙은 ${b}를 밀치며 욕설을 뱉었습니다.`, affinity: -10, targetHp: -1, targetSanity: -5 }), // 밀침
        (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로를 쳐다보지도 않고 등을 돌려 앉았습니다.`, affinity: -5 }),
        (a: string, b: string) => ({ text: `${a}은(는) ${b}가 과거에 했던 실수를 다시 끄집어내어 비꼬았습니다.`, affinity: -10, targetSanity: -5 })
    ]
};

// New: Fatigue Relief Interactions
export const FATIGUE_RELIEF_INTERACTIONS: InteractionFunction[] = [
    (actor: string, target: string) => ({
        text: `💆 ${actor}은(는) 지친 ${target}의 뭉친 어깨를 오랫동안 주물러 주었습니다.`,
        targetFatigue: -15, actorFatigue: 5, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `🛡️ ${actor}은(는) 졸고 있는 ${target}을(를) 위해 대신 불침번을 서주었습니다.`,
        targetFatigue: -25, actorFatigue: 15, affinity: 10
    }),
    (actor: string, target: string) => ({
        text: `☕ ${actor}은(는) ${target}에게 따뜻하게 데운 물 한 잔을 건네며 휴식을 권했습니다.`,
        targetFatigue: -10, actorFatigue: 0, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `🛏️ ${actor}은(는) ${target}이(가) 편히 잘 수 있도록 잠자리를 정돈해주었습니다.`,
        targetFatigue: -10, actorFatigue: 2, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `🔥 ${actor}와(과) ${target}은(는) 모닥불 곁에 앉아 아무 말 없이 멍하니 불을 바라보며 피로를 잊었습니다. (불멍)`,
        targetFatigue: -15, actorFatigue: -15, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `🧼 ${actor}은(는) 더러워진 ${target}의 얼굴과 손을 닦아주며 위생을 챙겨주었습니다.`,
        targetFatigue: -5, actorFatigue: 2, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `👂 ${actor}은(는) ${target}의 투정을 묵묵히 들어주며 정신적인 피로를 덜어주었습니다.`,
        targetFatigue: -10, actorFatigue: 5, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `👞 ${actor}은(는) ${target}의 해진 신발을 수선해주어 걷기 편하게 해주었습니다.`,
        targetFatigue: -5, actorFatigue: 5, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `🦵 ${actor}은(는) 많이 걸어 부은 ${target}의 다리를 마사지해주었습니다.`,
        targetFatigue: -10, actorFatigue: 5, affinity: 7
    }),
    (actor: string, target: string) => ({
        text: `🍫 ${actor}은(는) 아껴둔 초콜릿 한 조각을 ${target}의 입에 넣어주며 당분을 보충해줬습니다.`,
        targetFatigue: -5, actorFatigue: 0, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `🎶 ${actor}은(는) 잠 못 드는 ${target}를 위해 조용히 자장가를 흥얼거렸습니다.`,
        targetFatigue: -15, actorFatigue: 2, affinity: 8
    }),
    (actor: string, target: string) => ({
        text: `🎒 ${actor}은(는) ${target}의 무거운 짐을 잠시 대신 들어주었습니다.`,
        targetFatigue: -10, actorFatigue: 10, affinity: 10
    }),
    (actor: string, target: string) => ({
        text: `🔥 ${actor}은(는) 따뜻하게 데운 돌을 ${target}의 품에 안겨주어 추위를 잊게 했습니다.`,
        targetFatigue: -10, actorFatigue: 2, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `🧘 ${actor}와(과) ${target}은(는) 서로의 뭉친 근육을 풀어주며 스트레칭을 도왔습니다.`,
        targetFatigue: -10, actorFatigue: -10, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `🧊 ${actor}은(는) 차가운 물수건을 ${target}의 이마에 올려주어 열기를 식혀주었습니다.`,
        targetFatigue: -10, actorFatigue: 2, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `🛠️ ${actor}은(는) 진흙 투성이인 ${target}의 장비를 대신 닦아주며 쉴 시간을 주었습니다.`,
        targetFatigue: -15, actorFatigue: 5, affinity: 8
    }),
    (actor: string, target: string) => ({
        text: `💤 ${actor}와(과) ${target}은(는) 서로의 등에 기대어 체중을 지탱하며 잠시 눈을 붙였습니다.`,
        targetFatigue: -10, actorFatigue: -10, affinity: 5
    }),
    (actor: string, target: string) => ({
        text: `👋 ${actor}은(는) ${target}에게 "지금은 안전하니 잠깐이라도 눈을 붙여"라고 안심시켰습니다.`,
        targetFatigue: -15, actorFatigue: 5, affinity: 5
    })
];

export const LOVER_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 몰래 숨겨둔 초콜릿을 주며 사랑을 속삭였습니다.`, affinity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 좀비 떼를 피해 숨은 곳에서 손을 꼭 잡고 있었습니다.`, affinity: 5, actorSanity: 2, targetSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}을(를) 위해 자신의 목숨을 걸고 약을 구해왔습니다.`, affinity: 20, targetHp: 10 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 세상이 끝나더라도 함께하자고 약속했습니다.`, affinity: 10, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) 악몽을 꾸는 ${b}을(를) 밤새 안아주었습니다.`, affinity: 10, targetSanity: 10 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 폐허 속에서 둘만의 작은 결혼식을 상상했습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 머리카락을 빗겨주며 평화로운 한때를 보냈습니다.`, affinity: 5, targetFatigue: -5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 나중에 살게 될 집의 모습을 구체적으로 그렸습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 어울릴만한 예쁜 돌멩이를 주워 선물했습니다.`, affinity: 5, targetSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 이마에 입을 맞추며 "오늘도 살아줘서 고마워"라고 말했습니다.`, affinity: 10, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 남들의 시선을 피해 몰래 키스하며 스릴을 즐겼습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 가장 좋아하는 노래 가사를 편지로 써서 건넸습니다.`, affinity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 차가워진 손을 자신의 옷 속에 넣어 녹여주었습니다.`, affinity: 10, targetHp: 2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로의 심장 소리를 들으며 살아있음을 확인했습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) 캔 뚜껑 고리를 ${b}의 약지에 끼워주며 영원한 사랑을 맹세했습니다.`, affinity: 15, targetSanity: 10 })
];

export const CONFESSION_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}은(는) 떨리는 목소리로 ${b}에게 좋아한다고 고백했습니다!`, affinity: 20, actorSanity: 10, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 꽃을 건네며 마음을 전했습니다.`, affinity: 15, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "너 없이는 살 수 없어"라고 말했습니다.`, affinity: 20, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) "내일 죽더라도 후회하기 싫어"라며 ${b}에게 마음을 털어놓았습니다.`, affinity: 15, actorSanity: 10 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}를 지키다 부상을 입고, 치료받는 도중 엉겁결에 사랑을 고백했습니다.`, affinity: 25, actorHp: -5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 눈을 바라보다가 자신도 모르게 키스해버렸습니다.`, affinity: 15, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "이 지옥 같은 세상에서 너만이 나의 천국이야"라고 고백했습니다.`, affinity: 20, targetSanity: 10 }),
    (a: string, b: string) => ({ text: `${a}은(는) 서툰 솜씨로 쓴 시를 ${b}에게 읽어주며 마음을 표현했습니다.`, affinity: 10, targetSanity: 5 })
];

export const BREAKUP_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 극심한 스트레스로 인해 서로에게 씻을 수 없는 상처를 주고 헤어졌습니다.`, affinity: -30, actorSanity: -10, targetSanity: -10 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 이기적인 행동에 질려 이별을 통보했습니다.`, affinity: -20, targetSanity: -5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}의 사랑은 좀비 아포칼립스의 현실 앞에서 무너져 내렸습니다.`, affinity: -25, actorSanity: -15, targetSanity: -15 }),
    (a: string, b: string) => ({ text: `${a}은(는) "널 지켜줄 자신이 없어"라며 ${b}를 밀어냈습니다.`, affinity: -10, actorSanity: -10 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 생존 방식의 차이를 좁히지 못하고 각자의 길을 가기로 했습니다.`, affinity: -15 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 변해버린 모습에 낯설음을 느끼고 이별을 고했습니다.`, affinity: -20, targetSanity: -5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 자신보다 식량을 더 중요하게 여기는 모습에 정이 떨어졌습니다.`, affinity: -25 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로를 쳐다보며 더 이상 사랑이 남아있지 않음을 깨달았습니다.`, affinity: -20, actorSanity: -5, targetSanity: -5 })
];

export const REUNION_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 죽음의 위기 속에서 서로의 소중함을 다시 깨닫고 재결합했습니다.`, affinity: 30, actorSanity: 10, targetSanity: 10 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 지난 과오를 눈물로 사과하며 다시 받아달라고 부탁했습니다.`, affinity: 20, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) "역시 너밖에 없다"며 서로를 꼭 끌어안았습니다.`, affinity: 25, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 헤어져 있던 시간만큼 더 뜨겁게 사랑하기로 했습니다.`, affinity: 20 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 다른 사람과 위험에 처한 것을 보고 질투와 사랑을 동시에 느끼며 다시 고백했습니다.`, affinity: 20 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 우연히 옛 추억의 장소를 지나다 다시 사랑이 불타올랐습니다.`, affinity: 15, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) 죽다 살아온 ${b}를 보고, 자존심을 버리고 달려가 안겼습니다.`, affinity: 30, actorSanity: 10 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로의 빈자리가 너무 크다는 것을 인정하고 다시 손을 잡았습니다.`, affinity: 25 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "다신 널 놓치지 않을게"라고 맹세했습니다.`, affinity: 30, targetSanity: 10 })
];

export const SPOUSE_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 닳아버린 결혼반지를 닦아주며 "살아서 돌아가자"고 약속했습니다.`, affinity: 10, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 아이들의 사진을 보며 함께 조용히 눈물을 흘렸습니다.`, affinity: 10, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 잠든 얼굴을 보며 험한 세상에서 반드시 지키겠다고 다짐했습니다.`, affinity: 10 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "여보, 조금만 더 힘내"라며 마지막 남은 물을 건넸습니다.`, affinity: 15, targetFatigue: -5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) "검은 머리 파뿌리 될 때까지"라는 결혼 서약을 되새겼습니다.`, affinity: 10 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 어깨에 기대어 "당신과 결혼한 건 내 인생 최고의 행운이야"라고 말했습니다.`, affinity: 15, targetSanity: 10 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 폐허가 된 도시를 보며 "언젠가 다시 집을 짓자"고 약속했습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 악몽을 꾸자 깨워서 따뜻하게 안아주었습니다.`, affinity: 10, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 흰머리를 뽑아주며 세월의 무상함과 부부애를 느꼈습니다.`, affinity: 5 })
];

export const SIBLING_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "어렸을 때 기억나?"라며 추억을 이야기하며 긴장을 풀었습니다.`, affinity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 사소한 일로 투닥거렸지만, 금세 화해하고 식량을 나눴습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 짓궂은 장난을 쳤지만, 위험할 땐 누구보다 먼저 달려갔습니다.`, affinity: 10 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 머리를 쓰다듬으며 "내가 형(오빠/누나/언니)이니까 널 지킬게"라고 말했습니다.`, affinity: 10, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "엄마가 너 편식하지 말랬잖아"라고 잔소리를 했습니다.`, affinity: 2, actorSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 부모님을 그리워하며 서로를 위로했습니다.`, affinity: 10, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 위험한 행동을 하자 등짝을 때리며 걱정했습니다.`, affinity: 5, targetHp: -1 }), // 살짝 때림
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "너만은 꼭 살릴 거야"라고 비장하게 말했습니다.`, affinity: 15, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로의 닮은 점을 발견하고 킥킥대며 웃었습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 })
];

export const PARENT_CHILD_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 신발 끈을 고쳐 매주며 "조심해야 한다"고 당부했습니다.`, affinity: 10, targetSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) 끔찍한 광경으로부터 ${b}의 눈을 가려주었습니다.`, affinity: 10, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) 자신의 몫을 덜어 ${b}에게 주며 배가 부르다고 거짓말을 했습니다.`, affinity: 15, targetHp: 5, actorHp: -2 }), // 희생
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 꼭 붙어 자며 서로의 온기를 느꼈습니다.`, affinity: 10, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 세상이 망하기 전의 아름다웠던 이야기를 들려주었습니다.`, affinity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 훌쩍 자란 것을 보고 대견함과 안쓰러움을 동시에 느꼈습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 생존을 위한 사냥법을 엄격하게 가르쳤습니다.`, affinity: 5, targetFatigue: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}를 업고 걷느라 허리가 아프지만 내색하지 않았습니다.`, affinity: 15, actorFatigue: 10, targetFatigue: -5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 머리를 빗겨주며 "사랑한다, 우리 아가"라고 속삭였습니다.`, affinity: 10, targetSanity: 10 })
];

export const FAMILY_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 옷을 여며주며 "아프지 마"라고 걱정했습니다.`, affinity: 5, targetSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 죽은 친척들을 떠올리며 서로를 위로했습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 맛있는 부분을 덜어주며 "많이 먹어"라고 챙겼습니다.`, affinity: 5, targetHp: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 안전을 확인하고서야 잠자리에 들었습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) "우리 가문의 피는 못 속여"라며 웃었습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 집안 대대로 내려오는 이야기를 해주었습니다.`, affinity: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 힘들어하자 짐을 대신 들어주었습니다.`, affinity: 10, actorFatigue: 5, targetFatigue: -5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 명절 때 모였던 기억을 이야기하며 향수에 젖었습니다.`, affinity: 5, actorSanity: 2, targetSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}를 보며 "살아남아 줘서 고맙다"고 말했습니다.`, affinity: 10, targetSanity: 5 })
];

export const BEST_FRIEND_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 말하지 않아도 서로의 생각을 읽고 완벽한 호흡을 보여주었습니다.`, affinity: 10 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 흑역사를 폭로하려다 입막음을 당했습니다.`, affinity: 2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 험한 농담을 주고받으며 긴장을 풀었습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "네가 좀비가 되면 내가 처리해줄게"라고 농담했습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 좀비 흉내를 내며 서로를 웃겼습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "지옥 끝까지 같이 가자"며 주먹을 맞부딪쳤습니다.`, affinity: 15, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 마지막 하나 남은 담배(혹은 간식)를 나눠 가졌습니다.`, affinity: 10, actorSanity: 2, targetSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 좋아하는 물건을 구해다 주며 츤데레처럼 굴었습니다.`, affinity: 10 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로의 등을 맞대고 좀비 떼를 막아냈습니다.`, affinity: 15 })
];

export const COLLEAGUE_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) "회사 다닐 때가 좋았지"라며 씁쓸하게 웃었습니다.`, affinity: 5, actorSanity: 2, targetSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 마치 업무를 분담하듯이 효율적으로 좀비를 처리했습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "이건 야근 수당도 안 나온다"며 투덜거렸습니다.`, affinity: 2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 예전 상사 뒷담화를 하며 스트레스를 풀었습니다.`, affinity: 5, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 능력을 칭찬하며 "자넨 승진감이야"라고 농담했습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 생존 계획을 프레젠테이션하듯 진지하게 논의했습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "커피 한 잔 마시고 싶다"며 한숨을 쉬었습니다.`, affinity: 2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 기계적인 호흡으로 장애물을 치웠습니다.`, affinity: 3 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 깍듯이 존댓말을 쓰며 서로를 존중했습니다.`, affinity: 2 })
];

export const RIVAL_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "나보다 먼저 죽지 마"라며 경쟁심을 불태웠습니다.`, affinity: 2, actorFatigue: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 실수하자 비웃었지만, 뒤에서는 조용히 도와주었습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 누가 더 많은 좀비를 잡는지 내기를 했습니다.`, affinity: 2, actorFatigue: 5, targetFatigue: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 지기 싫어서 위험한 임무를 자처했습니다.`, affinity: 0, actorFatigue: 10 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 위기에 처하자 망설임 없이 구해주고는 "빚진 거야"라고 말했습니다.`, affinity: 10 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로의 실력을 인정하면서도 겉으로는 티격태격했습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}보다 더 빨리 달리기 위해 숨이 터져라 뛰었습니다.`, affinity: 0, actorFatigue: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 칭찬받자 은근히 질투심을 느꼈습니다.`, affinity: -2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 동시에 같은 좀비를 공격하고 서로 자기 킬이라고 우겼습니다.`, affinity: -5, actorHp: -1, targetHp: -1 }), // 몸싸움
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "너보단 내가 더 오래 살 거야"라고 도발했습니다.`, affinity: -2 })
];

export const SAVIOR_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 생명의 은인이라며 과도한 친절을 베풀었습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}를 볼 때마다 자신이 구해줬던 그날을 상기시켰습니다.`, affinity: 0 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 목숨 빚을 갚겠다며 위험을 대신 감수했습니다.`, affinity: 10, actorFatigue: 10 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "그때 날 구해줘서 고마워"라고 다시 한번 진심을 전했습니다.`, affinity: 10, actorSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 필요한 물건을 미리 구해다 바쳤습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 그림자처럼 붙어 다니며 호위하려 했습니다.`, affinity: 5, actorFatigue: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 위험해지자 자신의 몸을 던져 막아냈습니다.`, affinity: 15, actorHp: -5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 절대적인 충성심을 보였습니다.`, affinity: 10 })
];

export const ENEMY_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 지나가자 바닥에 침을 뱉으며 경멸했습니다.`, affinity: -10 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로를 미끼로 쓸 기회만 엿보고 있습니다.`, affinity: -20, actorSanity: -5, targetSanity: -5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 제안을 무조건 반대하며 훼방을 놓았습니다.`, affinity: -10 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b} 사이에서 살벌한 살기가 느껴졌습니다.`, affinity: -5, actorSanity: -2, targetSanity: -2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 물통에 몰래 흙을 넣으려다 실패했습니다.`, affinity: -15 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 자는 동안 무기를 훔치려다 그만두었습니다.`, affinity: -10, targetSanity: -5 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 좁은 길에서 서로 먼저 가겠다고 몸싸움을 벌였습니다.`, affinity: -15, actorHp: -5, targetHp: -5 }), // 싸움 (HP 감소)
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 좀비에게 물렸으면 좋겠다고 저주를 퍼부었습니다.`, affinity: -20 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 발을 걸어 넘어뜨리고는 실수인 척했습니다.`, affinity: -15, targetHp: -2 }), // 부상
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 눈만 마주치면 으르렁거렸습니다.`, affinity: -5 })
];

export const EX_LOVER_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 어색한 침묵 속에서 서로의 눈을 피했습니다.`, affinity: -2, actorSanity: -1, targetSanity: -1 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "너 성격은 여전하구나"라며 비꼬았습니다.`, affinity: -10 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 다른 사람과 웃는 것을 보고 질투와 안도감을 동시에 느꼈습니다.`, affinity: 0, actorSanity: -2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}와 함께 찍었던 사진을 버릴지 말지 고민했습니다.`, affinity: 2, actorSanity: -2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "우리가 헤어지지 않았다면 어땠을까?"라고 넌지시 물었습니다.`, affinity: 5, targetSanity: -2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 과거의 좋았던 기억을 떠올리며 씁쓸해했습니다.`, affinity: 5, actorSanity: 2, targetSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 다치자 걱정되는 마음을 숨기려 애썼습니다.`, affinity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) 술에 취해 실수로 ${b}의 이름을 불렀습니다.`, affinity: -5 })
];

// Unified Export for Developer Menu & Simulation
// Note: ZOMBIE_HUMAN events now use InteractionFunction signature, so no cast needed.
export const ZOMBIE_HUMAN_INTERACTIONS: InteractionFunction[] = [
    (z: string, h: string) => ({ text: `${z}은(는) 흐릿한 눈으로 ${h}을(를) 멍하니 바라보았습니다. 기억이 남은 걸까요?`, targetSanity: -2 }),
    (z: string, h: string) => ({ text: `${z}은(는) ${h}에게 다가가려다 쇠사슬(혹은 끈)에 저지당해 그르렁거렸습니다.`, targetSanity: -2 }),
    (z: string, h: string) => ({ text: `${z}은(는) ${h}이(가) 주는 먹이를 얌전히 받아먹었습니다.`, targetSanity: 2 }),
    (z: string, h: string) => ({ text: `${h}은(는) 좀비가 된 ${z}의 머리를 빗겨주며 슬픈 표정을 지었습니다.`, targetSanity: 5 }),
    (z: string, h: string) => ({ text: `${h}은(는) ${z}에게 말을 걸어보았지만, 돌아오는 것은 신음소리뿐이었습니다.`, targetSanity: -5 }),
    (z: string, h: string) => ({ text: `${z}은(는) 갑자기 발작하며 ${h}을(를) 공격하려 했지만, 곧 잠잠해졌습니다.`, targetSanity: -5 }),
    (z: string, h: string) => ({ text: `${h}은(는) ${z}의 썩어가는 피부를 보며 고개를 돌렸습니다.`, targetSanity: -2 }),
    (z: string, h: string) => ({ text: `${z}은(는) ${h}의 냄새를 맡으며 주변을 맴돌았습니다.`, targetSanity: -2 }),
    (z: string, h: string) => ({ text: `${z}은(는) ${h}이(가) 떨어뜨린 물건을 주우려는 듯 멈칫했습니다.`, targetSanity: -5 }),
    (z: string, h: string) => ({ text: `${h}은(는) ${z}의 손을 잡으려다 차가운 체온에 놀라 손을 뺐습니다.`, targetSanity: -2 }),
    (z: string, h: string) => ({ text: `${z}은(는) ${h}의 목소리에 반응하여 고개를 갸웃거렸습니다.`, targetSanity: -2 }),
    (z: string, h: string) => ({ text: `${h}은(는) 좀비가 된 ${z}에게 "미안하다"고 반복해서 사과했습니다.`, targetSanity: -5 }),
    (z: string, h: string) => ({ text: `${z}은(는) ${h}가 휘두르는 손짓에 강아지처럼 반응했습니다.`, targetSanity: 2 }),
    (z: string, h: string) => ({ text: `${h}은(는) ${z}의 입마개를 고쳐 매주며 안전을 확인했습니다.`, targetSanity: 2 }),
    (z: string, h: string) => ({ text: `${z}은(는) ${h}의 뒤를 졸졸 따라다니며 보디가드 흉내를 냈습니다.`, targetSanity: -2 }),
    (z: string, h: string) => ({ text: `${h}은(는) ${z}의 찢어진 옷을 갈아입혀주려다 물릴 뻔했습니다.`, targetSanity: -5 }),
    (z: string, h: string) => ({ text: `${z}은(는) 멍하니 하늘을 바라보며 생전의 습관처럼 한숨을 쉬었습니다.`, targetSanity: -5 }),
    (z: string, h: string) => ({ text: `${h}은(는) ${z}와 눈이 마주치자 오싹함을 느꼈습니다.`, targetSanity: -2 })
];

export const INTERACTION_POOL: Record<string, InteractionFunction[]> = {
    'POSITIVE': INTERACTION_TEMPLATES.POSITIVE,
    'NEGATIVE': INTERACTION_TEMPLATES.NEGATIVE,
    'FATIGUE_RELIEF': FATIGUE_RELIEF_INTERACTIONS,
    'LOVER': LOVER_EVENTS,
    'CONFESSION': CONFESSION_EVENTS,
    'BREAKUP': BREAKUP_EVENTS,
    'REUNION': REUNION_EVENTS,
    'SPOUSE': SPOUSE_EVENTS,
    'SIBLING': SIBLING_EVENTS,
    'PARENT_CHILD': PARENT_CHILD_EVENTS,
    'FAMILY': FAMILY_EVENTS,
    'BEST_FRIEND': BEST_FRIEND_EVENTS,
    'COLLEAGUE': COLLEAGUE_EVENTS,
    'RIVAL': RIVAL_EVENTS,
    'SAVIOR': SAVIOR_EVENTS,
    'ENEMY': ENEMY_EVENTS,
    'EX_LOVER': EX_LOVER_EVENTS,
    'ZOMBIE_HUMAN': ZOMBIE_HUMAN_INTERACTIONS, 
};