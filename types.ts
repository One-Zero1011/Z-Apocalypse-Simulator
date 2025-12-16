
export type Gender = 'Male' | 'Female' | 'Non-Binary';

export type MBTI = 
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

// Updated Status to include 'Zombie'
export type Status = 'Alive' | 'Infected' | 'Zombie' | 'Dead' | 'Missing';
export type RelationshipStatus = 
  | 'Lover' | 'Spouse' // 부부 Added
  | 'Family' | 'Parent' | 'Child' | 'Sibling' // Granular Family Added
  | 'Ex' 
  | 'BestFriend' | 'Friend' | 'Colleague' | 'Rival' | 'Savior' | 'Enemy' 
  | 'None';

// New: Mental States (Renamed to Emotions)
export type MentalState = 'Normal' | 'Trauma' | 'Despair' | 'Delusion' | 'Anxiety' | 'Madness';

export interface Character {
  id: string;
  name: string;
  gender: Gender;
  mbti: MBTI;
  job?: string; // New: Occupation (Optional)
  hp: number; // 0-100
  sanity: number; // 0-100
  fatigue: number; // 0-100
  infection: number; // 0-100 (New)
  hunger: number; // 0-100 (New, for Zombies)
  hasMuzzle: boolean; // (New)
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
  infectionChange?: number; // New
  hungerChange?: number; // New
  hasMuzzle?: boolean; // New
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
    infection?: number; // New
    hunger?: number; // New
    affinityChange?: number; // For Interactions
    victimHpChange?: number; // For Interactions
    victimSanityChange?: number; // For Interactions
    targetFatigue?: number; // For Interactions
    actorFatigue?: number; // For Interactions
    affinity?: number; // For Interactions
    loot?: string[]; // Added for Job Events and others
    status?: Status; // Added
    inventoryRemove?: string[]; // Added
}

export interface GameSettings {
    allowSameSexCouples: boolean;
    allowIncest: boolean; // Added: 근친 허용
    pureLoveMode: boolean; // Added: 순애 모드 (일부일처제)
    developerMode: boolean; // Added developerMode
    useMentalStates: boolean; // Added useMentalStates
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
    settings?: GameSettings; // Added settings
}

export interface StoryEffect {
    target: 'ALL' | 'RANDOM_1' | 'RANDOM_HALF'; // 효과 대상
    hp?: number;
    sanity?: number;
    fatigue?: number;
    infection?: number; // New
    kill?: number; // New: Kill count change
    status?: Status; // Added for events that change status (e.g. death)
    loot?: string[]; // 획득 아이템
    inventoryRemove?: string[]; // 제거할 아이템
    affinity?: number; // New: Global affinity change
    hunger?: number; // Added
}

export interface StoryNode {
    id: string;
    text: string;
    // 다음으로 이어질 수 있는 이벤트들의 목록과 가중치(확률)
    next?: { id: string; weight: number }[]; 
    // 이 노드에 도달했을 때 발생하는 효과
    effect?: StoryEffect;
}

// Developer Debug Type
export interface ForcedEvent {
    type: 'STORY' | 'MBTI' | 'INTERACTION';
    key: string; // storyId OR Category Key (e.g. 'INTJ', 'LOVER')
    index?: number; // Array index for MBTI/Interaction
    actorId?: string; // Who triggers it
    targetId?: string; // Who is the target (for interaction)
    previewText?: string; // For UI display
}
