import { MBTI } from './types';

export const MBTI_TYPES: MBTI[] = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

export const MAX_HP = 100;
export const MAX_SANITY = 100;
export const MAX_FATIGUE = 100;
export const FATIGUE_THRESHOLD = 80; // Above this, bad things happen

export const INITIAL_INVENTORY = ['생수 500ml', '맥가이버 칼'];

export const DEFAULT_RELATIONSHIP_VALUE = 0;