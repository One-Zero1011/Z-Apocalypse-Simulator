
import { InteractionFunction } from "./types";

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
