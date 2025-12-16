
import { InteractionFunction } from "./types";

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
