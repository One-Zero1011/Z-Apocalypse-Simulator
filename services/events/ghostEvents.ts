
import { ActionEffect } from "../../types";

export const GHOST_EVENTS: ((deadName: string, livingName: string) => ActionEffect)[] = [
    (dead, living) => ({ 
        text: `👻 [유령] ${living}은(는) 짙은 안개 속에서 ${dead}이(가) 서 있는 것을 보고 비명을 질렀습니다.`, 
        sanity: -15 
    }),
    (dead, living) => ({ 
        text: `👻 [유령] ${living}은(는) 귓가에서 "도망쳐..."라고 속삭이는 ${dead}의 목소리를 들었습니다.`, 
        sanity: -10, 
        fatigue: 5 
    }),
    (dead, living) => ({ 
        text: `👻 [유령] ${living}은(는) 꿈속에서 ${dead}이(가) 나타나 슬픈 표정으로 작별 인사를 하는 것을 보았습니다.`, 
        sanity: 5, 
        fatigue: -5 
    }),
    (dead, living) => ({ 
        text: `👻 [유령] ${living}이(가) 위험에 처했을 때, 마치 ${dead}이(가) 밀쳐낸 것처럼 기적적으로 공격을 피했습니다.`, 
        sanity: -5, 
        hp: 5 
    }),
    (dead, living) => ({ 
        text: `👻 [유령] ${living}은(는) ${dead}이(가) 아끼던 물건이 갑자기 떨어진 것을 보고 소스라치게 놀랐습니다.`, 
        sanity: -10 
    }),
    (dead, living) => ({ 
        text: `👻 [유령] ${living}은(는) 밤새 ${dead}의 울음소리 같은 바람 소리 때문에 잠을 설쳤습니다.`, 
        sanity: -5, 
        fatigue: 15 
    }),
    (dead, living) => ({ 
        text: `👻 [유령] ${living}은(는) 허공을 응시하며 ${dead}와(과) 대화를 나누는 것 같았습니다.`, 
        sanity: -20 
    }),
    (dead, living) => ({ 
        text: `👻 [유령] ${living}은(는) ${dead}의 환영이 가리키는 곳에서 쓸만한 물자를 발견했습니다.`, 
        sanity: -5, 
        fatigue: -5,
        loot: ['통조림'] // 텍스트에 맞춰 아이템 획득 데이터 추가
    }),
    (dead, living) => ({ 
        text: `👻 [유령] ${living}은(는) 거울에 비친 자신의 뒤에 ${dead}이(가) 서 있는 것을 보았습니다.`, 
        sanity: -15 
    }),
    (dead, living) => ({ 
        text: `👻 [유령] ${living}은(는) ${dead}이(가) 웃고 있는 환영을 보고 왠지 모를 용기를 얻었습니다.`, 
        sanity: 10 
    })
];
