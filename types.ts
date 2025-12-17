
export type MBTI = 
  'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ' |
  'ISTP' | 'ISFP' | 'INFP' | 'INTP' |
  'ESTP' | 'ESFP' | 'ENFP' | 'ENTP' |
  'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export type Gender = 'Male' | 'Female' | 'Non-Binary';

export type Status = 'Alive' | 'Dead' | 'Zombie' | 'Infected' | 'Missing';

export type MentalState = 'Normal' | 'Trauma' | 'Despair' | 'Delusion' | 'Anxiety' | 'Madness';

export type RelationshipStatus = 
    'Lover' | 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 
    'Rival' | 'Enemy' | 'BestFriend' | 'Family' | 
    'Colleague' | 'Ex' | 'Friend' | 'Savior' | 'None';

export interface Character {
  id: string;
  name: string;
  gender: Gender;
  mbti: MBTI;
  job: string;
  hp: number;
  sanity: number;
  fatigue: number;
  infection: number;
  hunger: number;
  status: Status;
  mentalState: MentalState;
  hasMuzzle: boolean;
  inventory: string[];
  relationships: Record<string, number>; // key: characterId, value: affinity (-100 to 100)
  relationshipStatuses: Record<string, RelationshipStatus>;
  relationshipDurations: Record<string, number>; // key: characterId, value: duration days
  killCount: number;
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
  infectionChange?: number;
  hungerChange?: number;
  killCountChange?: number;
  status?: Status;
  mentalState?: MentalState;
  inventoryAdd?: string[];
  inventoryRemove?: string[];
  hasMuzzle?: boolean;
  relationshipUpdates?: RelationshipUpdate[];
}

export interface BabyEventData {
    fatherId: string;
    motherId: string;
}

export interface DayLog {
  day: number;
  narrative: string;
  events: string[];
}

export interface SimulationResult {
  narrative: string;
  events: string[];
  updates: CharacterUpdate[];
  loot: string[];
  inventoryRemove?: string[]; // New: Items to remove from global inventory
  nextStoryNodeId: string | null;
  babyEvent?: BabyEventData | null; // New
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
    actorHp?: number; // Explicit actor HP change
    targetHp?: number; // Explicit target HP change
    actorSanity?: number; // Explicit actor Sanity change
    targetSanity?: number; // Explicit target Sanity change
    targetInfection?: number; // Explicit target Infection change
}

export interface GameSettings {
    allowSameSexCouples: boolean;
    allowIncest: boolean; // Added: 근친 허용
    pureLoveMode: boolean; // Added: 순애 모드 (일부일처제)
    restrictStudentDating: boolean; // Added: 학생끼리만 연애 허용
    developerMode: boolean; // Added developerMode
    useMentalStates: boolean; // Added useMentalStates
    enableInteractions: boolean; // Added: 플레이어(생존자) 상호작용 옵션
    enableStoryChoices: boolean; // Added: 스토리 선택지 활성화 여부
    enablePregnancy: boolean; // Added: 임신 시스템 활성화 여부
    showEventEffects: boolean; // Added: 이벤트 효과(수치) 표시 여부
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

export interface StoryRequirement {
    job?: string; // 특정 직업 필요
    item?: string; // 특정 아이템 필요
    minSurvivors?: number; // 최소 생존자 수
}

export interface StoryOption {
    id: string;
    weight: number;
    choiceText?: string;
    req?: StoryRequirement; // Added Requirement
}

export interface StoryNode {
    id: string;
    text: string;
    // 다음으로 이어질 수 있는 이벤트들의 목록과 가중치(확률)
    // choiceText가 있으면 유저 선택 가능
    next?: StoryOption[]; 
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
