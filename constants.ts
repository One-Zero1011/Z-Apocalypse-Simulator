
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
export const MAX_INFECTION = 100; // New
export const MAX_HUNGER = 100; // New
export const FATIGUE_THRESHOLD = 80; // Above this, bad things happen
export const DAILY_HUNGER_LOSS = 2; // Reduced from 20 to 2

// Changed from ['생수 500ml', '맥가이버 칼'] to items with effects
export const INITIAL_INVENTORY = ['붕대', '통조림'];

export const DEFAULT_RELATIONSHIP_VALUE = 0;
