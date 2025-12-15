
import { ActionEffect, Character, MBTI, MentalState } from "../../types";
import { ANALYSTS, DIPLOMATS, SENTINELS, EXPLORERS } from "./mbtiEvents";

// Helper to categorize MBTI
const getMBTIContext = (mbti: MBTI) => {
    if (ANALYSTS.includes(mbti)) return 'ANALYST';
    if (DIPLOMATS.includes(mbti)) return 'DIPLOMAT';
    if (SENTINELS.includes(mbti)) return 'SENTINEL';
    return 'EXPLORER';
};

// 1. Solo Events based on Disease & MBTI Group
export const MENTAL_ILLNESS_ACTIONS: Record<MentalState | string, (char: Character) => ActionEffect> = {
    'PTSD': (char) => {
        const group = getMBTIContext(char.mbti);
        // Default fallbacks included
        const events = {
            'ANALYST': [
                { text: `🤯 [PTSD/분석가] ${char.name}은(는) "계산이 틀렸어..."라고 중얼거리며 머리를 쥐어뜯었습니다.`, sanity: -5, fatigue: 5 },
                { text: `🤯 [PTSD/분석가] ${char.name}은(는) 과거의 실패를 무한히 복기하느라 현실 감각을 잃었습니다.`, fatigue: 10 },
                { text: `🤯 [PTSD/분석가] ${char.name}은(는) 완벽한 방어선이 뚫리는 환상을 보고 경직되었습니다.`, sanity: -10 }
            ],
            'DIPLOMAT': [
                { text: `🤯 [PTSD/외교관] ${char.name}은(는) 죽은 동료의 비명소리가 들린다며 귀를 막고 오열했습니다.`, sanity: -10, fatigue: 10 },
                { text: `🤯 [PTSD/외교관] ${char.name}은(는) "내가 구하지 못했어"라며 심한 죄책감에 시달렸습니다.`, sanity: -15 },
                { text: `🤯 [PTSD/외교관] ${char.name}은(는) 피 냄새가 진동한다며 계속해서 손을 씻었습니다.`, fatigue: 5 }
            ],
            'SENTINEL': [
                { text: `🤯 [PTSD/관리자] ${char.name}은(는) 문이 잠겼는지 백 번도 넘게 확인하며 밤을 지새웠습니다.`, fatigue: 20 },
                { text: `🤯 [PTSD/관리자] ${char.name}은(는) "규칙을 지켰어야 해"라며 강박적으로 짐을 다시 쌌습니다.`, sanity: -5, fatigue: 5 },
                { text: `🤯 [PTSD/관리자] ${char.name}은(는) 갑자기 사이렌 소리가 들린다며 바닥에 엎드렸습니다.`, sanity: -5 }
            ],
            'EXPLORER': [
                { text: `🤯 [PTSD/탐험가] ${char.name}은(는) 작은 소리에도 놀라 무기를 난사할 뻔했습니다.`, kill: 0, sanity: -5, fatigue: 5 },
                { text: `🤯 [PTSD/탐험가] ${char.name}은(는) 좀비의 환영을 보고 패닉에 빠져 무작정 달렸습니다.`, hp: -5, fatigue: 15 },
                { text: `🤯 [PTSD/탐험가] ${char.name}은(는) 악몽에서 깨어나지 못하고 비명을 질러 모두를 깨웠습니다.`, sanity: -5 }
            ]
        };
        const pool = events[group] || events['EXPLORER'];
        return pool[Math.floor(Math.random() * pool.length)];
    },
    'Depression': (char) => {
        const group = getMBTIContext(char.mbti);
        const events = {
            'ANALYST': [
                { text: `💧 [우울증/분석가] ${char.name}은(는) "생존 확률 0%"라며 모든 행동을 중단했습니다.`, fatigue: 5 },
                { text: `💧 [우울증/분석가] ${char.name}은(는) 세상의 멸망이 논리적 귀결이라며 허무해했습니다.`, sanity: -10 },
                { text: `💧 [우울증/분석가] ${char.name}은(는) 더 이상 해결책을 찾을 의지조차 잃었습니다.`, sanity: -5 }
            ],
            'DIPLOMAT': [
                { text: `💧 [우울증/외교관] ${char.name}은(는) "우린 버려졌어"라며 깊은 절망감에 빠졌습니다.`, sanity: -15 },
                { text: `💧 [우울증/외교관] ${char.name}은(는) 자신이 짐만 된다고 생각하여 식사를 거부했습니다.`, hp: -10, fatigue: 10 },
                { text: `💧 [우울증/외교관] ${char.name}은(는) 하루 종일 멍하니 하늘만 바라보며 눈물을 흘렸습니다.`, fatigue: 5 }
            ],
            'SENTINEL': [
                { text: `💧 [우울증/관리자] ${char.name}은(는) 맡은 임무를 수행할 기력이 없어 주저앉았습니다.`, fatigue: 15 },
                { text: `💧 [우울증/관리자] ${char.name}은(는) 질서가 무너진 세상에 환멸을 느끼고 무기력해졌습니다.`, sanity: -10 },
                { text: `💧 [우울증/관리자] ${char.name}은(는) 주변 정리를 포기하고 쓰레기 더미 속에 앉아있었습니다.`, sanity: -5 }
            ],
            'EXPLORER': [
                { text: `💧 [우울증/탐험가] ${char.name}은(는) 움직일 힘조차 없어 좀비가 다가와도 피하지 않으려 했습니다.`, hp: -10, sanity: -5 },
                { text: `💧 [우울증/탐험가] ${char.name}은(는) 자극적인 것에조차 반응하지 않고 무감각해졌습니다.`, sanity: -10 },
                { text: `💧 [우울증/탐험가] ${char.name}은(는) 자신의 무기를 만지작거리며 위험한 생각을 했습니다.`, sanity: -15 }
            ]
        };
        const pool = events[group] || events['EXPLORER'];
        return pool[Math.floor(Math.random() * pool.length)];
    },
    'Schizophrenia': (char) => {
        const group = getMBTIContext(char.mbti);
        const events = {
            'ANALYST': [
                { text: `👁️ [조현병/분석가] ${char.name}은(는) 좀비들의 움직임에서 존재하지 않는 '패턴'을 읽어냈습니다.`, sanity: -10 },
                { text: `👁️ [조현병/분석가] ${char.name}은(는) 라디오 잡음이 비밀 코드라며 해석하느라 밤을 샜습니다.`, fatigue: 15 },
                { text: `👁️ [조현병/분석가] ${char.name}은(는) 정부가 뇌파를 조종한다며 알루미늄 호일을 머리에 썼습니다.`, sanity: -5 }
            ],
            'DIPLOMAT': [
                { text: `👁️ [조현병/외교관] ${char.name}은(는) 천사 혹은 악마의 목소리가 들린다며 허공과 대화했습니다.`, sanity: -15 },
                { text: `👁️ [조현병/외교관] ${char.name}은(는) 좀비들이 구원을 바라고 있다며 다가가려 했습니다.`, hp: -10, sanity: -10 },
                { text: `👁️ [조현병/외교관] ${char.name}은(는) 자신이 선택받은 구원자라는 망상에 빠졌습니다.`, sanity: -5 }
            ],
            'SENTINEL': [
                { text: `👁️ [조현병/관리자] ${char.name}은(는) 보이지 않는 적이 캠프에 침입했다고 경보를 울렸습니다.`, fatigue: 10 },
                { text: `👁️ [조현병/관리자] ${char.name}은(는) 음식이 오염되었다고 믿고 전부 버리려 했습니다.`, sanity: -5 },
                { text: `👁️ [조현병/관리자] ${char.name}은(는) 동료들이 좀비가 변장한 가짜라고 의심했습니다.`, sanity: -10 }
            ],
            'EXPLORER': [
                { text: `👁️ [조현병/탐험가] ${char.name}은(는) 몸에 벌레가 기어 다니는 환촉을 느껴 피부를 긁어댔습니다.`, hp: -5, sanity: -5 },
                { text: `👁️ [조현병/탐험가] ${char.name}은(는) 썩은 냄새가 진동한다며 코를 막고 구토했습니다.`, fatigue: 5 },
                { text: `👁️ [조현병/탐험가] ${char.name}은(는) 그림자가 자신을 공격한다고 믿고 칼을 휘둘렀습니다.`, fatigue: 10 }
            ]
        };
        const pool = events[group] || events['EXPLORER'];
        return pool[Math.floor(Math.random() * pool.length)];
    },
    'Paranoia': (char) => {
        const group = getMBTIContext(char.mbti);
        const events = {
            'ANALYST': [
                { text: `🔒 [편집증/분석가] ${char.name}은(는) 동료 중 배신자가 있을 확률을 계산하며 아무도 믿지 않았습니다.`, sanity: -10 },
                { text: `🔒 [편집증/분석가] ${char.name}은(는) 누군가 자신의 장비를 조작했다고 확신했습니다.`, sanity: -5 },
                { text: `🔒 [편집증/분석가] ${char.name}은(는) 모든 정보가 조작되었다며 지도를 찢어버렸습니다.`, sanity: -5 }
            ],
            'DIPLOMAT': [
                { text: `🔒 [편집증/외교관] ${char.name}은(는) 모두가 뒤에서 자신을 욕하고 있다고 믿었습니다.`, sanity: -10 },
                { text: `🔒 [편집증/외교관] ${char.name}은(는) 호의를 베푸는 동료에게 다른 꿍꿍이가 있다고 생각했습니다.`, sanity: -5 },
                { text: `🔒 [편집증/외교관] ${char.name}은(는) "아무도 날 사랑하지 않아"라며 구석에 숨었습니다.`, sanity: -10 }
            ],
            'SENTINEL': [
                { text: `🔒 [편집증/관리자] ${char.name}은(는) 누군가 식량을 훔쳤다며 동료들의 가방을 강제로 뒤졌습니다.`, sanity: -5 },
                { text: `🔒 [편집증/관리자] ${char.name}은(는) 잠을 자면 살해당할 것이라 믿고 뜬눈으로 밤을 지새웠습니다.`, hp: -5, fatigue: 20 },
                { text: `🔒 [편집증/관리자] ${char.name}은(는) 물에 독이 들어있다며 마시기를 거부했습니다.`, hp: -10, fatigue: 10 }
            ],
            'EXPLORER': [
                { text: `🔒 [편집증/탐험가] ${char.name}은(는) 누군가 미행하고 있다며 숲속에 함정을 설치했습니다.`, fatigue: 10 },
                { text: `🔒 [편집증/탐험가] ${char.name}은(는) 작은 소리에도 과민반응하여 동료에게 총을 겨눴습니다.`, sanity: -15 },
                { text: `🔒 [편집증/탐험가] ${char.name}은(는) 캠프가 발각되었다며 당장 떠나야 한다고 소란을 피웠습니다.`, fatigue: 5 }
            ]
        };
        const pool = events[group] || events['EXPLORER'];
        return pool[Math.floor(Math.random() * pool.length)];
    },
    'DID': (char) => {
        const group = getMBTIContext(char.mbti);
        const events = {
            'ANALYST': [
                { text: `🎭 [자아분열/분석가] ${char.name}은(는) 냉철한 '전략가'와 겁쟁이 '패배자' 인격 사이에서 혼란을 겪었습니다.`, sanity: -10 },
                { text: `🎭 [자아분열/분석가] ${char.name}은(는) 기억하지 못하는 사이에 복잡한 암호를 풀어놓았습니다.`, fatigue: 5 },
                { text: `🎭 [자아분열/분석가] ${char.name}은(는) 갑자기 권위적인 말투로 변해 모두에게 명령을 내렸습니다.`, sanity: -5 }
            ],
            'DIPLOMAT': [
                { text: `🎭 [자아분열/외교관] ${char.name}은(는) 자비로운 '성녀'와 잔혹한 '심판자' 인격을 오갔습니다.`, sanity: -15 },
                { text: `🎭 [자아분열/외교관] ${char.name}은(는) 갑자기 어린아이가 되어 엄마를 찾으며 울기 시작했습니다.`, sanity: -10, fatigue: 5 },
                { text: `🎭 [자아분열/외교관] ${char.name}은(는) 거울 속의 자신을 낯선 사람처럼 대했습니다.`, sanity: -5 }
            ],
            'SENTINEL': [
                { text: `🎭 [자아분열/관리자] ${char.name}은(는) 엄격한 '교관'이 되어 동료들을 혹독하게 훈련시켰습니다.`, fatigue: 15 },
                { text: `🎭 [자아분열/관리자] ${char.name}은(는) 자신이 군인이라고 믿으며 경례를 했습니다.`, sanity: -5 },
                { text: `🎭 [자아분열/관리자] ${char.name}은(는) 겁에 질린 '탈영병' 인격이 튀어나와 숨으려 했습니다.`, sanity: -10 }
            ],
            'EXPLORER': [
                { text: `🎭 [자아분열/탐험가] ${char.name}의 눈빛이 살인마 '사냥꾼'처럼 변하더니 좀비에게 맨몸으로 돌진했습니다!`, hp: -15, kill: 1, fatigue: 15 },
                { text: `🎭 [자아분열/탐험가] ${char.name}은(는) 자신이 누구인지, 여기가 어디인지 전혀 기억하지 못했습니다.`, sanity: -5 },
                { text: `🎭 [자아분열/탐험가] ${char.name}은(는) 갑자기 야생 동물처럼 행동하며 그르렁거렸습니다.`, sanity: -10 }
            ]
        };
        const pool = events[group] || events['EXPLORER'];
        return pool[Math.floor(Math.random() * pool.length)];
    },
    'Normal': (char) => ({ text: `${char.name}은(는) 평범한 하루를 보냈습니다.`, fatigue: 5 })
};

// 2. Interaction Events (When Actor has Mental Illness)
export const MENTAL_INTERACTIONS = [
    (actor: string, target: string) => ({
        text: `😨 ${actor}은(는) ${target}을(를) 좀비로 착각하고 공격했습니다!`,
        affinityChange: -20,
        victimHpChange: -15,
        victimSanityChange: -10
    }),
    (actor: string, target: string) => ({
        text: `😭 ${actor}은(는) ${target}을(를) 붙잡고 "제발 날 버리지 마"라며 오열했습니다.`,
        affinityChange: 5, // Pity
        victimSanityChange: -5,
        victimHpChange: 0
    }),
    (actor: string, target: string) => ({
        text: `😡 ${actor}은(는) ${target}이(가) 자신을 감시한다며 멱살을 잡았습니다.`,
        affinityChange: -15,
        victimSanityChange: -5,
        victimHpChange: 0
    }),
    (actor: string, target: string) => ({
        text: `🌫️ ${actor}은(는) ${target}에게 알 수 없는 헛소리를 중얼거려 공포감을 주었습니다.`,
        affinityChange: -5,
        victimSanityChange: -10,
        victimHpChange: 0
    }),
    (actor: string, target: string) => ({
        text: `🎭 ${actor}은(는) 갑자기 ${target}을(를) 처음 보는 사람처럼 대하며 경계했습니다.`,
        affinityChange: -5,
        victimSanityChange: -5,
        victimHpChange: 0
    })
];

// 3. Lover Specific Mental Events (Unique per Disease)
// Now a Record instead of an Array
export const LOVER_MENTAL_EVENTS: Record<MentalState | string, ((actor: string, target: string) => any)[]> = {
    'PTSD': [
        (actor, target) => ({
            text: `💔 [PTSD] ${actor}은(는) ${target}이(가) 죽는 환영을 보고 "오지 마!"라고 소리치며 밀쳐냈습니다.`,
            affinityChange: -5, victimSanityChange: -10
        }),
        (actor, target) => ({
            text: `💔 [PTSD] ${actor}은(는) 악몽을 꾸다 깨어나 ${target}의 품에서 하염없이 울었습니다.`,
            affinityChange: 5, victimSanityChange: -5
        }),
        (actor, target) => ({
            text: `💔 [PTSD] ${actor}은(는) ${target}을(를) 잃을까 봐 과보호하며 집착했습니다.`,
            affinityChange: -2, victimSanityChange: -2
        })
    ],
    'Depression': [
        (actor, target) => ({
            text: `💔 [우울증] ${actor}은(는) ${target}에게 "난 짐만 될 거야, 날 버려"라고 애원했습니다.`,
            affinityChange: -5, victimSanityChange: -15
        }),
        (actor, target) => ({
            text: `💔 [우울증] ${actor}은(는) ${target}의 키스에도 아무런 감정을 느끼지 못하고 멍하니 있었습니다.`,
            affinityChange: -10, victimSanityChange: -10
        }),
        (actor, target) => ({
            text: `💔 [우울증] ${actor}은(는) 하루 종일 등만 돌린 채 ${target}의 말을 무시했습니다.`,
            affinityChange: -5, victimSanityChange: -5
        })
    ],
    'Schizophrenia': [
        (actor, target) => ({
            text: `💔 [조현병] ${actor}은(는) ${target}의 얼굴이 괴물로 변하는 환각을 보고 비명을 질렀습니다.`,
            affinityChange: -10, victimSanityChange: -15
        }),
        (actor, target) => ({
            text: `💔 [조현병] ${actor}은(는) ${target}에게 "너는 진짜 내 애인이 아니야, 껍데기야!"라고 의심했습니다.`,
            affinityChange: -20, victimSanityChange: -15
        }),
        (actor, target) => ({
            text: `💔 [조현병] ${actor}은(는) 허공의 목소리가 ${target}을(를) 죽이라고 한다며 괴로워했습니다.`,
            affinityChange: -5, victimSanityChange: -20
        })
    ],
    'Paranoia': [
        (actor, target) => ({
            text: `💔 [편집증] ${actor}은(는) ${target}이(가) 음식에 독을 탔다고 의심하여 그릇을 엎었습니다.`,
            affinityChange: -25, victimSanityChange: -10
        }),
        (actor, target) => ({
            text: `💔 [편집증] ${actor}은(는) ${target}이(가) 잠든 사이 소지품을 뒤지며 증거를 찾으려 했습니다.`,
            affinityChange: -15, victimSanityChange: -5
        }),
        (actor, target) => ({
            text: `💔 [편집증] ${actor}은(는) ${target}이(가) 다른 생존자와 바람을 피우고 음모를 꾸민다고 확신했습니다.`,
            affinityChange: -20, victimSanityChange: -10
        })
    ],
    'DID': [
        (actor, target) => ({
            text: `💔 [자아분열] ${actor}은(는) 낯선 눈빛으로 ${target}을(를) 보며 "당신은 누구시죠?"라고 정중하게 물었습니다.`,
            affinityChange: -5, victimSanityChange: -20
        }),
        (actor, target) => ({
            text: `💔 [자아분열] ${actor}의 폭력적인 인격이 깨어나 ${target}을(를) 위협했습니다.`,
            affinityChange: -30, victimHpChange: -5, victimSanityChange: -15
        }),
        (actor, target) => ({
            text: `💔 [자아분열] ${actor}은(는) 어린아이의 인격으로 변해 ${target}에게 업어달라고 보챘습니다.`,
            affinityChange: 0, victimSanityChange: -5
        })
    ],
    'Normal': [] // Fallback
};
