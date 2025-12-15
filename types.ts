
export type Gender = 'Male' | 'Female' | 'Non-Binary';

export type MBTI = 
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export type Status = 'Alive' | 'Infected' | 'Dead' | 'Missing';
export type RelationshipStatus = 
  | 'Lover' | 'Ex' | 'Family' 
  | 'BestFriend' | 'Colleague' | 'Rival' | 'Savior' | 'Enemy' 
  | 'None';

// New: Mental States
export type MentalState = 'Normal' | 'PTSD' | 'Depression' | 'Schizophrenia' | 'Paranoia' | 'DID';

export interface Character {
  id: string;
  name: string;
  gender: Gender;
  mbti: MBTI;
  hp: number; // 0-100
  sanity: number; // 0-100
  fatigue: number; // 0-100
  status: Status;
  mentalState: MentalState; // New Field
  inventory: string[];
  relationships: Record<string, number>; 
  relationshipStatuses: Record<string, RelationshipStatus>;
  killCount: number;
}

export interface DayLog {
  day: number;
  narrative: string;
  events: string[];
}

export interface RelationshipUpdate {
  targetId: string;
  change: number;
  newStatus?: RelationshipStatus;
}

export interface CharacterUpdate {
  id: string;
  hpChange?: number;
  sanityChange?: number;
  fatigueChange?: number;
  status?: Status;
  mentalState?: MentalState; // New
  inventoryAdd?: string[];
  inventoryRemove?: string[];
  relationshipUpdates?: RelationshipUpdate[];
  killCountChange?: number;
}

export interface SimulationResult {
  narrative: string;
  events: string[];
  updates: CharacterUpdate[];
  loot: string[];
  nextStoryNodeId: string | null;
}

export interface ActionEffect {
    text: string;
    hp?: number;
    sanity?: number;
    kill?: number;
    fatigue?: number;
}

export interface GameState {
    type: 'FULL_SAVE';
    version: 1;
    timestamp: string;
    day: number;
    characters: Character[];
    inventory: string[];
    logs: DayLog[];
    storyNodeId?: string | null;
}