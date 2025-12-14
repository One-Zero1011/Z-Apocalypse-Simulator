
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

export interface Character {
  id: string;
  name: string;
  gender: Gender;
  mbti: MBTI;
  hp: number; // 0-100
  sanity: number; // 0-100
  fatigue: number; // 0-100 (New: Fatigue system)
  status: Status;
  inventory: string[];
  relationships: Record<string, number>; // characterId -> affinity (-100 to 100)
  relationshipStatuses: Record<string, RelationshipStatus>; // characterId -> Status (Lover/Ex)
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
  fatigueChange?: number; // New
  status?: Status;
  inventoryAdd?: string[];
  inventoryRemove?: string[];
  relationshipUpdates?: RelationshipUpdate[];
  killCountChange?: number;
}

export interface SimulationResult {
  narrative: string;
  events: string[];
  updates: CharacterUpdate[];
}

export interface ActionEffect {
    text: string;
    hp?: number;
    sanity?: number;
    kill?: number;
    fatigue?: number;
}
