
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
    'Colleague' | 'Ex' | 'Friend' | 'Savior' | 'Guardian' | 'Ward' | 
    'Fan' | 'None';

export interface Stats {
  str: number; // 힘
  agi: number; // 민첩
  con: number; // 체력
  int: number; // 지능
  cha: number; // 매력
}

export interface Skill {
  name: string;
  description: string;
  icon: string;
}

export interface Character {
  id: string;
  name: string;
  gender: Gender;
  mbti: MBTI;
  job: string;
  stats: Stats;
  skills: Skill[]; 
  hp: number;
  maxHp: number;
  sanity: number;
  maxSanity: number;
  fatigue: number;
  infection: number;
  hunger: number;
  status: Status;
  mentalState: MentalState;
  hasMuzzle: boolean;
  inventory: string[];
  relationships: Record<string, number>; 
  relationshipStatuses: Record<string, RelationshipStatus>;
  relationshipDurations: Record<string, number>; 
  killCount: number;
  plannedAction?: string | null; 
  griefLogs: string[]; // 동료 사망에 대한 기억 로그 추가
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
  plannedAction?: string | null; 
  statChanges?: Partial<Stats>; 
  skillsAdd?: Skill[]; 
  skillsRemove?: string[]; 
  griefLogAdd?: string; // 새로운 사망 기억 추가
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

export interface Ending {
    id: string;
    title: string;
    description: string;
    icon: string;
    type: 'BAD' | 'NEUTRAL' | 'GOOD' | 'SPECIAL';
}

export interface SimulationResult {
  narrative: string;
  events: string[];
  updates: CharacterUpdate[];
  loot: string[];
  inventoryRemove?: string[]; 
  nextStoryNodeId: string | null;
  babyEvent?: BabyEventData | null; 
  tarotEvent?: boolean; 
  ending?: Ending | null; 
}

export interface ActionEffect {
    text: string;
    hp?: number;
    sanity?: number;
    kill?: number;
    fatigue?: number;
    infection?: number; 
    hunger?: number; 
    affinityChange?: number; 
    victimHpChange?: number; 
    victimSanityChange?: number; 
    targetFatigue?: number; 
    actorFatigue?: number; 
    affinity?: number; 
    loot?: string[]; 
    status?: Status; 
    mentalState?: MentalState;
    inventoryRemove?: string[]; 
    actorHp?: number; 
    targetHp?: number; 
    actorSanity?: number; 
    targetSanity?: number; 
    targetInfection?: number; 
    statChanges?: Partial<Stats>; 
    skillsAdd?: Skill[]; 
    skillsRemove?: string[]; 
}

export interface GameSettings {
    allowSameSexCouples: boolean;
    allowOppositeSexCouples: boolean; 
    allowIncest: boolean; 
    pureLoveMode: boolean; 
    restrictStudentDating: boolean; 
    friendshipMode: boolean; 
    restrictMinorAdultActions: boolean; 
    developerMode: boolean; 
    useMentalStates: boolean; 
    enableInteractions: boolean; 
    enableStoryChoices: boolean; 
    enablePregnancy: boolean; 
    pregnancyChance: number; 
    showEventEffects: boolean; 
    enableEndings: boolean; 
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
    settings?: GameSettings; 
}

export interface StoryEffect {
    target: 'ALL' | 'RANDOM_1' | 'RANDOM_HALF'; 
    hp?: number;
    sanity?: number;
    fatigue?: number;
    infection?: number; 
    kill?: number; 
    status?: Status; 
    mentalState?: MentalState;
    loot?: string[]; 
    inventoryRemove?: string[]; 
    affinity?: number; 
    hunger?: number; 
    statChanges?: Partial<Stats>; 
    skillsAdd?: Skill[]; 
    skillsRemove?: string[]; 
}

export interface StoryRequirement {
    skill?: string; 
    item?: string; 
    minSurvivors?: number; 
}

export interface DiceChallenge {
    threshold: number; 
    stat: keyof Stats; 
    successId: string; 
    failId: string;    
    hpPenalty?: number; 
    sanityPenalty?: number; 
}

export interface StoryOption {
    id: string;
    weight: number;
    choiceText?: string;
    req?: StoryRequirement; 
    dice?: DiceChallenge; 
}

export interface StoryNode {
    id: string;
    text: string;
    next?: StoryOption[]; 
    effect?: StoryEffect;
}

export interface ForcedEvent {
    type: 'STORY' | 'MBTI' | 'INTERACTION' | 'JOB' | 'SYSTEM'; 
    key: string; 
    index?: number; 
    actorId?: string; 
    targetId?: string; 
    previewText?: string; 
}
