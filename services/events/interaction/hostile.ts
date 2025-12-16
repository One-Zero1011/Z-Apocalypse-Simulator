
import { InteractionFunction } from "./types";

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
