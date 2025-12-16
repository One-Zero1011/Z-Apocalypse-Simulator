
import { MBTI } from './types';

export const MBTI_TYPES: MBTI[] = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ'
, 'ENFJ', 'ENTJ'
];

export const MAX_HP = 100;
export const MAX_SANITY = 100;
export const MAX_FATIGUE = 100;
export const MAX_INFECTION = 100; // New
export const MAX_HUNGER = 100; // New
export const FATIGUE_THRESHOLD = 80; // Above this, bad things happen
export const DAILY_HUNGER_LOSS = 2; // Reduced from 20 to 2

// Changed from ['생수 500ml', '맥가이버 칼'] to items with effects
export const INITIAL_INVENTORY = ['붕대', '통조림'];

export const DEFAULT_RELATIONSHIP_VALUE = 0;

export const JOB_CATEGORIES: Record<string, string[]> = {
    "전투/보안 (Combat/Security)": [
        "군인", "경찰", "형사", "소방관", "경호원", "용병", "교도관", "사냥꾼", "탐정"
    ],
    "의료/과학 (Medical/Science)": [
        "의사", "간호사", "수의사", "약사", "심리상담사", "연구원", "응급구조사", "물리치료사"
    ],
    "기술/생산 (Tech/Production)": [
        "개발자", "기술자(엔지니어)", "목수", "배관공", "정비공", "농부", "사육사", "요리사", "바리스타"
    ],
    "전문직/사무 (Professional)": [
        "회사원", "공무원", "변호사", "판사", "검사", "정치인", "기자", "비서", "교사/교수", "회계사"
    ],
    "예술/연예 (Arts/Entertainment)": [
        "연예인", "가수", "배우", "아이돌", "만화가/웹툰작가", "작가", "발레리나/무용수", "광대", "미식가", "화가"
    ],
    "서비스/기타 (Service/Other)": [
        "미용사", "호텔리어", "승무원", "택시기사", "배달원", "유튜버/스트리머", "프로게이머", "운동선수"
    ],
    "종교/영성 (Spiritual)": [
        "성직자(신부/목사)", "스님", "무당", "수녀"
    ],
    "학생/무직/아웃로 (Unbound)": [
        "대학생", "고등학생", "백수", "거지/노숙자", "조폭/마피아", "도박사", "죄수"
    ]
};
