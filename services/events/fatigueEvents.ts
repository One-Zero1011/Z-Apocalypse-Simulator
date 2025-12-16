
import { ActionEffect } from "../../types";

export const FATIGUE_EVENTS: ((name: string) => ActionEffect)[] = [
    (name: string) => ({ text: `💤 ${name}은(는) 보초를 서다 깜빡 잠이 들어 좀비의 접근을 허용했습니다. 가까스로 피했지만 팔을 긁혔습니다.`, hp: -20, sanity: -10, infection: 10 }),
    (name: string) => ({ text: `😵 ${name}은(는) 극도의 피로로 인해 헛것을 보고 허공에 무기를 휘둘렀습니다.`, sanity: -15, fatigue: 5 }),
    (name: string) => ({ text: `🤕 ${name}은(는) 다리가 풀려 계단에서 굴러떨어졌습니다.`, hp: -10, fatigue: 5 }),
    (name: string) => ({ text: `🤢 ${name}은(는) 면역력이 떨어져 심한 몸살을 앓기 시작했습니다.`, hp: -15, fatigue: 10 }),
    (name: string) => ({ text: `💢 ${name}은(는) 피곤함에 짜증을 내며 주변 사람들과 다투었습니다.`, sanity: -10 }),
    (name: string) => ({ text: `🧟 ${name}은(는) 도망치다 지쳐서 쓰러질 뻔했습니다. 발목을 잡혔지만 뿌리쳤습니다.`, hp: -5, fatigue: 10, infection: 5 }),
    (name: string) => ({ text: `⚠️ ${name}은(는) 손이 떨려 중요한 물자를 떨어뜨려 잃어버렸습니다.`, sanity: -5 }),
    (name: string) => ({ text: `🌬️ ${name}은(는) 정신을 잃고 쓰러져, 차가운 바닥에서 밤을 보냈습니다.`, hp: -10, fatigue: -20 }), // Passed out but rested slightly
    (name: string) => ({ text: `🩸 ${name}은(는) 몽롱한 상태로 철조망을 넘다가 깊게 찔려 피가 났습니다.`, hp: -10, infection: 5, sanity: -5 }),
    (name: string) => ({ text: `💀 ${name}은(는) 졸음을 참지 못하고 좀비 시체 옆에서 잠들었다가 깨어났습니다. 찝찝합니다.`, sanity: -10, infection: 5, fatigue: -10 })
];
