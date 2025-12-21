
import { InteractionFunction } from "./types";
import { INTERACTION_TEMPLATES, FATIGUE_RELIEF_INTERACTIONS } from "./general";
import { LOVER_EVENTS, CONFESSION_EVENTS, BREAKUP_EVENTS, REUNION_EVENTS, SPOUSE_EVENTS, EX_LOVER_EVENTS } from "./love";
import { FAMILY_EVENTS, SIBLING_EVENTS, PARENT_TO_CHILD_EVENTS, CHILD_TO_PARENT_EVENTS, GUARDIAN_TO_WARD_EVENTS, WARD_TO_GUARDIAN_EVENTS } from "./family";
import { BEST_FRIEND_EVENTS, COLLEAGUE_EVENTS, SAVIOR_EVENTS, FRIEND_EVENTS, FAN_EVENTS } from "./social";
import { RIVAL_EVENTS, ENEMY_EVENTS } from "./hostile";
import { ZOMBIE_HUMAN_INTERACTIONS } from "./zombie";

export * from "./types";
export * from "./general";
export * from "./love";
export * from "./family";
export * from "./social";
export * from "./hostile";
export * from "./zombie";

// Keys must match RelationshipStatus type in types.ts exactly
export const INTERACTION_POOL: Record<string, InteractionFunction[]> = {
    'POSITIVE': INTERACTION_TEMPLATES.POSITIVE,
    'NEGATIVE': INTERACTION_TEMPLATES.NEGATIVE,
    'FATIGUE_RELIEF': FATIGUE_RELIEF_INTERACTIONS,
    
    // Special Event Types (Called explicitly)
    'CONFESSION': CONFESSION_EVENTS,
    'BREAKUP': BREAKUP_EVENTS,
    'REUNION': REUNION_EVENTS,
    'ZOMBIE_HUMAN': ZOMBIE_HUMAN_INTERACTIONS, 

    // Relationship Status Keys (Matched to types.ts)
    'Lover': LOVER_EVENTS,
    'Spouse': SPOUSE_EVENTS,
    'Sibling': SIBLING_EVENTS,
    'Parent':  CHILD_TO_PARENT_EVENTS, // Actor is Parent -> Target is Child
    'Child': PARENT_TO_CHILD_EVENTS, // Actor is Child -> Target is Parent
    'Guardian': GUARDIAN_TO_WARD_EVENTS, // Actor is Guardian
    'Ward': WARD_TO_GUARDIAN_EVENTS, // Actor is Ward
    'Family': FAMILY_EVENTS,
    'Friend': FRIEND_EVENTS,
    'BestFriend': BEST_FRIEND_EVENTS,
    'Colleague': COLLEAGUE_EVENTS,
    'Rival': RIVAL_EVENTS,
    'Savior': SAVIOR_EVENTS,
    'Enemy': ENEMY_EVENTS,
    'Fan':FAN_EVENTS,
    'Ex': EX_LOVER_EVENTS,
    'None': INTERACTION_TEMPLATES.POSITIVE // Fallback for None
};
