
import { ActionEffect, MBTI } from "../../../types";
import { ANALYSTS, DIPLOMATS, SENTINELS } from "../mbtiEvents";

// Import all category events
import { COMBAT_SECURITY_EVENTS } from "./combatSecurity";
import { MEDICAL_SCIENCE_EVENTS } from "./medicalScience";
import { TECH_PRODUCTION_EVENTS } from "./techProduction";
import { PROFESSIONAL_EVENTS } from "./professional";
import { ARTS_ENTERTAINMENT_EVENTS } from "./artsEntertainment";
import { SERVICE_OTHER_EVENTS } from "./serviceOther";
import { SPIRITUAL_EVENTS } from "./spiritual";
import { UNBOUND_EVENTS } from "./unbound";

// Merge all events into one object
export const ALL_JOB_MBTI_EVENTS: Record<string, Record<string, ((n: string) => ActionEffect)[]>> = {
    ...COMBAT_SECURITY_EVENTS,
    ...MEDICAL_SCIENCE_EVENTS,
    ...TECH_PRODUCTION_EVENTS,
    ...PROFESSIONAL_EVENTS,
    ...ARTS_ENTERTAINMENT_EVENTS,
    ...SERVICE_OTHER_EVENTS,
    ...SPIRITUAL_EVENTS,
    ...UNBOUND_EVENTS
};

// Helper to determine MBTI context
const getMBTIContext = (mbti: MBTI) => {
    if (ANALYSTS.includes(mbti)) return 'ANALYST';
    if (DIPLOMATS.includes(mbti)) return 'DIPLOMAT';
    if (SENTINELS.includes(mbti)) return 'SENTINEL';
    return 'EXPLORER';
};

// Fallback Generic Events
const GENERIC_JOB_EVENTS: Record<string, ((n: string) => ActionEffect)[]> = {
    'ANALYST': [
        (n) => ({ text: `🤔 ${n}은(는) 상황을 논리적으로 분석하여 최선의 수를 찾았습니다.`, sanity: 5 }),
        (n) => ({ text: `🧠 ${n}은(는) 감정에 휘둘리지 않고 냉철하게 문제를 해결했습니다.`, fatigue: 5 })
    ],
    'DIPLOMAT': [
        (n) => ({ text: `🤝 ${n}은(는) 따뜻한 말로 동료들을 위로했습니다.`, sanity: 10, fatigue: 5 }),
        (n) => ({ text: `🕊️ ${n}은(는) 모두의 화합을 위해 노력했습니다.`, sanity: 5 })
    ],
    'SENTINEL': [
        (n) => ({ text: `📋 ${n}은(는) 맡은 바 임무를 성실하게 수행했습니다.`, fatigue: 10, sanity: 5 }),
        (n) => ({ text: `🛡️ ${n}은(는) 규칙을 준수하여 안전을 확보했습니다.`, hp: 5 })
    ],
    'EXPLORER': [
        (n) => ({ text: `🏃 ${n}은(는) 뛰어난 임기응변으로 위기를 탈출했습니다.`, fatigue: 10 }),
        (n) => ({ text: `🎒 ${n}은(는) 새로운 곳을 탐색하여 물자를 찾았습니다.`, loot: ['통조림'] })
    ]
};

export const getJobMbtiEvent = (job: string, mbti: MBTI, name: string): ActionEffect => {
    const context = getMBTIContext(mbti);
    
    // 1. Try to find specific Job + MBTI Group event
    if (ALL_JOB_MBTI_EVENTS[job] && ALL_JOB_MBTI_EVENTS[job][context]) {
        const pool = ALL_JOB_MBTI_EVENTS[job][context];
        if (pool.length > 0) {
            return pool[Math.floor(Math.random() * pool.length)](name);
        }
    }

    // 2. Fallback: Generic MBTI Event
    const pool = GENERIC_JOB_EVENTS[context];
    return pool[Math.floor(Math.random() * pool.length)](name);
};
