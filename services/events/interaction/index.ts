
import { InteractionFunction } from "./types";
import { INTERACTION_TEMPLATES, FATIGUE_RELIEF_INTERACTIONS } from "./general";
import { LOVER_EVENTS, CONFESSION_EVENTS, BREAKUP_EVENTS, REUNION_EVENTS, SPOUSE_EVENTS, EX_LOVER_EVENTS } from "./love";
import { FAMILY_EVENTS, SIBLING_EVENTS, PARENT_CHILD_EVENTS } from "./family";
import { BEST_FRIEND_EVENTS, COLLEAGUE_EVENTS, SAVIOR_EVENTS } from "./social";
import { RIVAL_EVENTS, ENEMY_EVENTS } from "./hostile";
import { ZOMBIE_HUMAN_INTERACTIONS } from "./zombie";

export * from "./types";
export * from "./general";
export * from "./love";
export * from "./family";
export * from "./social";
export * from "./hostile";
export * from "./zombie";

export const INTERACTION_POOL: Record<string, InteractionFunction[]> = {
    'POSITIVE': INTERACTION_TEMPLATES.POSITIVE,
    'NEGATIVE': INTERACTION_TEMPLATES.NEGATIVE,
    'FATIGUE_RELIEF': FATIGUE_RELIEF_INTERACTIONS,
    'LOVER': LOVER_EVENTS,
    'CONFESSION': CONFESSION_EVENTS,
    'BREAKUP': BREAKUP_EVENTS,
    'REUNION': REUNION_EVENTS,
    'SPOUSE': SPOUSE_EVENTS,
    'SIBLING': SIBLING_EVENTS,
    'PARENT_CHILD': PARENT_CHILD_EVENTS,
    'FAMILY': FAMILY_EVENTS,
    'BEST_FRIEND': BEST_FRIEND_EVENTS,
    'COLLEAGUE': COLLEAGUE_EVENTS,
    'RIVAL': RIVAL_EVENTS,
    'SAVIOR': SAVIOR_EVENTS,
    'ENEMY': ENEMY_EVENTS,
    'EX_LOVER': EX_LOVER_EVENTS,
    'ZOMBIE_HUMAN': ZOMBIE_HUMAN_INTERACTIONS, 
};
