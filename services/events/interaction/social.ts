
import { InteractionFunction } from "./types";

export const FRIEND_EVENTS: InteractionFunction[] = [
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 가벼운 장난을 치며 긴장을 풀었습니다.`, affinity: 2, actorSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 시시콜콜한 잡담을 나누며 잠시 좀비를 잊었습니다.`, affinity: 3, actorSanity: 2, targetSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}의 어깨를 툭 치며 "살아있냐?"라고 농담했습니다.`, affinity: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 맛없는 비상식량을 주며 "너 먹어라"라고 놀렸습니다.`, affinity: 2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 서로의 꼴을 보고 낄낄거렸습니다.`, affinity: 3, actorSanity: 5, targetSanity: 5 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}에게 "나중에 밥 한 번 사라"고 말했습니다.`, affinity: 2 }),
    (a: string, b: string) => ({ text: `${a}은(는) ${b}가 졸고 있을 때 얼굴에 낙서를 하려다 참았습니다.`, affinity: 1, actorSanity: 2 }),
    (a: string, b: string) => ({ text: `${a}와(과) ${b}은(는) 하이파이브를 하며 생존을 자축했습니다.`, affinity: 5 })
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
