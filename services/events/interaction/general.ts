
import { InteractionFunction } from "./types";

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
