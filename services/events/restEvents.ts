
import { ActionEffect } from "../../types";

export const REST_EVENTS: ((name: string) => ActionEffect)[] = [
    (name) => ({ 
        text: `💤 ${name}은(는) 안전한 은신처를 찾아 기절하듯 깊은 잠에 빠졌습니다.`, 
        fatigue: -30, hp: 5 
    }),
    (name) => ({ 
        text: `🧘 ${name}은(는) 조용한 구석에서 명상을 하며 지친 몸과 마음을 추스렸습니다.`, 
        fatigue: -15, sanity: 10 
    }),
    (name) => ({ 
        text: `🪑 ${name}은(는) 먼지 쌓인 푹신한 리클라이너 의자를 발견하고 몸을 파묻었습니다.`, 
        fatigue: -20 
    }),
    (name) => ({ 
        text: `🦶 ${name}은(는) 신발을 벗고 부르튼 발을 마사지하며 피로를 풀었습니다.`, 
        fatigue: -10, hp: 2 
    }),
    (name) => ({ 
        text: `🔥 ${name}은(는) 타오르는 모닥불을 멍하니 바라보며(불멍) 잡념을 비웠습니다.`, 
        fatigue: -10, sanity: 5 
    }),
    (name) => ({ 
        text: `🙆 ${name}은(는) 굳어있던 근육을 풀어주는 전신 스트레칭을 했습니다.`, 
        fatigue: -15 
    }),
    (name) => ({ 
        text: `📖 ${name}은(는) 배낭 구석에 있던 읽다 만 책을 읽으며 잠시 현실을 잊었습니다.`, 
        fatigue: -5, sanity: 10 
    }),
    (name) => ({ 
        text: `☕ ${name}은(는) 따뜻한 물 한 잔을 천천히 마시며 숨을 골랐습니다.`, 
        fatigue: -10 
    }),
    (name) => ({ 
        text: `🚿 ${name}은(는) 빗물을 받아 대충이나마 몸을 씻어내며 개운함을 느꼈습니다.`, 
        fatigue: -10, sanity: 5 
    }),
    (name) => ({ 
        text: `🛌 ${name}은(는) 깨끗한 매트리스를 발견하고 오랜만에 등을 펴고 누웠습니다.`, 
        fatigue: -25 
    }),
    (name) => ({ 
        text: `🌬️ ${name}은(는) 시원한 바람이 부는 옥상 난간에 기대어 땀을 식혔습니다.`, 
        fatigue: -10, sanity: 5 
    }),
    (name) => ({ 
        text: `🍫 ${name}은(는) 주머니 속에 아껴두었던 사탕을 녹여 먹으며 당분을 보충했습니다.`, 
        fatigue: -5, sanity: 5 
    }),
    (name) => ({ 
        text: `🦴 ${name}은(는) 무거운 장비를 모두 내려놓고 가벼운 몸으로 잠시 쉬었습니다.`, 
        fatigue: -15 
    }),
    (name) => ({ 
        text: `👖 ${name}은(는) 젖은 양말을 갈아신는 것만으로도 살 것 같은 기분을 느꼈습니다.`, 
        fatigue: -10, sanity: 2 
    }),
    (name) => ({ 
        text: `😌 ${name}은(는) 아무런 생각 없이 10분간 쪽잠을 잤습니다.`, 
        fatigue: -15 
    }),
    (name) => ({ 
        text: `🩹 ${name}은(는) 자잘한 생채기들을 치료하고 붕대를 다시 감았습니다.`, 
        fatigue: -5, hp: 5 
    })
];
