
import { InteractionFunction } from "./types";

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
