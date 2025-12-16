
export type InteractionResult = string | { 
    text: string; 
    affinity?: number; 
    actorHp?: number; 
    targetHp?: number; 
    actorSanity?: number; 
    targetSanity?: number; 
    actorFatigue?: number; 
    targetFatigue?: number;
};

export type InteractionFunction = (a: string, b: string) => InteractionResult;
