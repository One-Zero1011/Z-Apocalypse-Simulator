
import { Character, SimulationResult, CharacterUpdate, GameSettings, ForcedEvent, RelationshipUpdate, StoryNode, ActionEffect, Status, MentalState } from '../types';
import { MAX_HP, MAX_SANITY, MAX_FATIGUE, MAX_INFECTION, MAX_HUNGER, FATIGUE_THRESHOLD, DAILY_HUNGER_LOSS } from '../constants';
import { getNextStoryNode } from './events/globalEvents';
import { STORY_NODES } from './events/storyNodes';
import { REST_EVENTS } from './events/restEvents';
import { MBTI_SPECIFIC_ACTIONS } from './events/mbtiEvents';
import { FATIGUE_EVENTS } from './events/fatigueEvents';
import { GHOST_EVENTS } from './events/ghostEvents';
import { MENTAL_ILLNESS_ACTIONS, MENTAL_INTERACTIONS, LOVER_MENTAL_EVENTS } from './events/mentalEvents';
import { INTERACTION_POOL, ZOMBIE_HUMAN_INTERACTIONS, InteractionResult } from './events/interactionEvents';
import { getJobMbtiEvent } from './events/jobEvents/index';

const formatStatChange = (hp?: number, sanity?: number, fatigue?: number, infection?: number, hunger?: number) => {
    const parts = [];
    if (hp) parts.push(`체력 ${hp > 0 ? '+' : ''}${hp}`);
    if (sanity) parts.push(`정신 ${sanity > 0 ? '+' : ''}${sanity}`);
    if (fatigue) parts.push(`피로 ${fatigue > 0 ? '+' : ''}${fatigue}`);
    if (infection) parts.push(`감염 ${infection > 0 ? '+' : ''}${infection}`);
    if (hunger) parts.push(`허기 ${hunger > 0 ? '+' : ''}${hunger}`);
    return parts.length > 0 ? ` (${parts.join(', ')})` : '';
};

export const simulateDay = async (
    day: number,
    characters: Character[],
    lastStoryNodeId: string | null,
    settings: GameSettings,
    forcedEvents: ForcedEvent[]
): Promise<SimulationResult> => {
    const events: string[] = [];
    const updates: CharacterUpdate[] = [];
    const loot: string[] = [];

    // 1. Determine Story Node
    let storyNode: StoryNode;
    const forcedStory = forcedEvents.find(e => e.type === 'STORY');
    if (forcedStory && forcedStory.key && STORY_NODES[forcedStory.key]) {
        storyNode = STORY_NODES[forcedStory.key];
    } else {
        storyNode = getNextStoryNode(lastStoryNodeId);
    }

    // 2. Apply Story Effect
    if (storyNode.effect) {
        const effect = storyNode.effect;
        let targets: Character[] = [];
        const living = characters.filter(c => c.status === 'Alive' || c.status === 'Infected');

        if (effect.target === 'ALL') targets = living;
        else if (effect.target === 'RANDOM_1') targets = [living[Math.floor(Math.random() * living.length)]].filter(Boolean);
        else if (effect.target === 'RANDOM_HALF') {
            const shuffled = [...living].sort(() => 0.5 - Math.random());
            targets = shuffled.slice(0, Math.ceil(living.length / 2));
        }

        targets.forEach(target => {
            const update: CharacterUpdate = { id: target.id };
            if (effect.hp) update.hpChange = effect.hp;
            if (effect.sanity) update.sanityChange = effect.sanity;
            if (effect.fatigue) update.fatigueChange = effect.fatigue;
            if (effect.infection) update.infectionChange = effect.infection;
            if (effect.kill) update.killCountChange = effect.kill;
            if (effect.status) update.status = effect.status;
            if (effect.inventoryRemove) update.inventoryRemove = effect.inventoryRemove;
            updates.push(update);
        });

        if (effect.loot) loot.push(...effect.loot);
    }

    // 3. Process Characters
    const livingCharacters = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
    const processedIds = new Set<string>();

    // Shuffle to random order
    const shuffledChars = [...livingCharacters].sort(() => 0.5 - Math.random());

    for (const char of shuffledChars) {
        if (processedIds.has(char.id)) continue;

        const update: CharacterUpdate = { id: char.id };
        
        // ZOMBIE LOGIC
        if (char.status === 'Zombie') {
            update.hungerChange = -DAILY_HUNGER_LOSS;
            if (Math.random() < 0.3) {
                events.push(`🧟 ${char.name}은(는) 먹이를 찾아 어슬렁거렸습니다.`);
            }
            updates.push(update);
            processedIds.add(char.id);
            continue;
        }

        // INFECTION PROGRESS
        if (char.status === 'Infected' || (char.infection > 0 && char.status === 'Alive')) {
             if (char.infection >= 100) {
                 update.status = 'Zombie';
                 update.hpChange = MAX_HP; 
                 update.sanityChange = 0;
                 update.hungerChange = MAX_HUNGER;
                 events.push(`🧟 ${char.name}은(는) 바이러스를 이기지 못하고 좀비가 되었습니다!`);
                 updates.push(update);
                 processedIds.add(char.id);
                 continue;
             } else {
                 update.infectionChange = (Math.random() * 5) + 2; 
             }
        }

        // FATIGUE CHECK
        if (char.fatigue >= FATIGUE_THRESHOLD) {
            const fatigueAction = FATIGUE_EVENTS[Math.floor(Math.random() * FATIGUE_EVENTS.length)](char.name);
            update.hpChange = (update.hpChange || 0) + (fatigueAction.hp || 0);
            update.sanityChange = (update.sanityChange || 0) + (fatigueAction.sanity || 0);
            update.fatigueChange = (update.fatigueChange || 0) + (fatigueAction.fatigue || 0);
            events.push(`${fatigueAction.text}${formatStatChange(fatigueAction.hp, fatigueAction.sanity, fatigueAction.fatigue)}`);
            updates.push(update);
            processedIds.add(char.id);
            continue;
        }

        // MENTAL STATE EVENTS
        if (settings.useMentalStates && char.mentalState && char.mentalState !== 'Normal') {
             if (Math.random() < 0.4) {
                 const mentalAction = MENTAL_ILLNESS_ACTIONS[char.mentalState](char);
                 if (mentalAction) {
                    update.hpChange = (update.hpChange || 0) + (mentalAction.hp || 0);
                    update.sanityChange = (update.sanityChange || 0) + (mentalAction.sanity || 0);
                    update.fatigueChange = (update.fatigueChange || 0) + (mentalAction.fatigue || 0);
                    events.push(`${mentalAction.text}${formatStatChange(mentalAction.hp, mentalAction.sanity, mentalAction.fatigue)}`);
                    updates.push(update);
                    processedIds.add(char.id);
                    continue;
                 }
             }
        }

        // INTERACTION (Pair Event)
        const potentialTargets = shuffledChars.filter(c => c.id !== char.id && !processedIds.has(c.id));
        if (potentialTargets.length > 0 && Math.random() < 0.35) {
            const target = potentialTargets[0];
            const targetUpdate: CharacterUpdate = { id: target.id };
            let interactionResult: any; 

            // Check Mental Interaction First
            if (settings.useMentalStates && char.mentalState !== 'Normal' && Math.random() < 0.5) {
                 if (['Lover', 'Spouse'].includes(char.relationshipStatuses[target.id])) {
                     const pool = LOVER_MENTAL_EVENTS[char.mentalState];
                     if (pool && pool.length > 0) {
                         interactionResult = pool[Math.floor(Math.random() * pool.length)](char.name, target.name);
                     }
                 }
                 if (!interactionResult) {
                     interactionResult = MENTAL_INTERACTIONS[Math.floor(Math.random() * MENTAL_INTERACTIONS.length)](char.name, target.name);
                 }
            } 
            else if (target.status === 'Zombie') {
                 interactionResult = ZOMBIE_HUMAN_INTERACTIONS[Math.floor(Math.random() * ZOMBIE_HUMAN_INTERACTIONS.length)](target.name, char.name);
            }
            else {
                // Standard Interaction
                const affinity = char.relationships[target.id] || 0;
                let poolKey = 'POSITIVE';
                if (affinity < -20) poolKey = 'NEGATIVE';
                
                const relStatus = char.relationshipStatuses[target.id];
                if (relStatus && INTERACTION_POOL[relStatus.toUpperCase()]) {
                     let key = relStatus.toUpperCase();
                     if (relStatus === 'BestFriend') key = 'BEST_FRIEND';
                     if (relStatus === 'Ex') key = 'EX_LOVER';
                     
                     if (INTERACTION_POOL[key]) poolKey = key;
                }

                let pool = INTERACTION_POOL[poolKey];
                if (!pool) pool = INTERACTION_POOL['POSITIVE'];

                const actionFunc = pool[Math.floor(Math.random() * pool.length)];
                interactionResult = actionFunc(char.name, target.name);
            }

            if (interactionResult) {
                const resText = typeof interactionResult === 'string' ? interactionResult : interactionResult.text;
                let log = resText;
                
                if (typeof interactionResult !== 'string') {
                    if (interactionResult.affinity) {
                        const change = interactionResult.affinity;
                        update.relationshipUpdates = [{ targetId: target.id, change }];
                        targetUpdate.relationshipUpdates = [{ targetId: char.id, change }];
                    }
                    if (interactionResult.actorHp) update.hpChange = (update.hpChange || 0) + interactionResult.actorHp;
                    if (interactionResult.actorSanity) update.sanityChange = (update.sanityChange || 0) + interactionResult.actorSanity;
                    if (interactionResult.actorFatigue) update.fatigueChange = (update.fatigueChange || 0) + interactionResult.actorFatigue;
                    
                    if (interactionResult.targetHp) targetUpdate.hpChange = (targetUpdate.hpChange || 0) + interactionResult.targetHp;
                    if (interactionResult.targetSanity) targetUpdate.sanityChange = (targetUpdate.sanityChange || 0) + interactionResult.targetSanity;
                    if (interactionResult.targetFatigue) targetUpdate.fatigueChange = (targetUpdate.fatigueChange || 0) + interactionResult.targetFatigue;
                    
                    log += formatStatChange(interactionResult.actorHp, interactionResult.actorSanity, interactionResult.actorFatigue);
                }
                events.push(log);
                updates.push(update);
                updates.push(targetUpdate);
                processedIds.add(char.id);
                processedIds.add(target.id);
                continue;
            }
        }

        // Rest / Recovery Event
        if (Math.random() > 0.8) {
           const restAction = REST_EVENTS[Math.floor(Math.random() * REST_EVENTS.length)](char.name);
           update.hpChange = (update.hpChange || 0) + (restAction.hp || 0);
           update.sanityChange = (update.sanityChange || 0) + (restAction.sanity || 0);
           update.fatigueChange = (update.fatigueChange || 0) + (restAction.fatigue || 0);
           
           const statLog = formatStatChange(restAction.hp, restAction.sanity, restAction.fatigue);
           events.push(`${restAction.text}${statLog}`);
           updates.push(update);
           processedIds.add(char.id);
           continue;
        }

        // JOB + MBTI EVENT Logic
        if (char.job && Math.random() < 0.3) {
           const jobAction = getJobMbtiEvent(char.job, char.mbti, char.name);
           
           update.hpChange = (update.hpChange || 0) + (jobAction.hp || 0);
           update.sanityChange = (update.sanityChange || 0) + (jobAction.sanity || 0);
           update.fatigueChange = (update.fatigueChange || 0) + (jobAction.fatigue || 0);
           update.killCountChange = (update.killCountChange || 0) + (jobAction.kill || 0);
           if (jobAction.infection) update.infectionChange = (update.infectionChange || 0) + jobAction.infection;
           
           if (jobAction.loot) {
               const lootItems = jobAction.loot;
               if (lootItems && Array.isArray(lootItems)) {
                   loot.push(...lootItems);
                   jobAction.text += ` [${lootItems.join(', ')}] 획득!`;
               }
           }

           const statLog = formatStatChange(jobAction.hp, jobAction.sanity, jobAction.fatigue, update.infectionChange);
           events.push(`${jobAction.text}${statLog}`);
           updates.push(update);
           processedIds.add(char.id);
           continue;
        }

        // Default: Standard MBTI Event
        const action = MBTI_SPECIFIC_ACTIONS[char.mbti](char.name, char.gender);
        update.hpChange = (update.hpChange || 0) + (action.hp || 0);
        update.sanityChange = (update.sanityChange || 0) + (action.sanity || 0);
        update.fatigueChange = (update.fatigueChange || 0) + (action.fatigue || 0);
        update.killCountChange = (update.killCountChange || 0) + (action.kill || 0);
        if (action.infection) update.infectionChange = (update.infectionChange || 0) + action.infection;
        
        const statLog = formatStatChange(action.hp, action.sanity, action.fatigue, action.infection);
        events.push(`${action.text}${statLog}`);
        updates.push(update);
        processedIds.add(char.id);
    }

    return {
        narrative: storyNode.text,
        events,
        updates,
        loot,
        nextStoryNodeId: storyNode.id
    };
};
