
import { Character, SimulationResult, CharacterUpdate, GameSettings, ForcedEvent, RelationshipUpdate, StoryNode, ActionEffect, Status, MentalState, RelationshipStatus } from '../types';
import { MAX_HP, MAX_SANITY, MAX_FATIGUE, MAX_INFECTION, MAX_HUNGER, FATIGUE_THRESHOLD, DAILY_HUNGER_LOSS } from '../constants';
import { getNextStoryNode } from './events/globalEvents';
import { STORY_NODES } from './events/storyNodes';
import { REST_EVENTS } from './events/restEvents';
import { MBTI_SPECIFIC_ACTIONS } from './events/mbtiEvents';
import { FATIGUE_EVENTS } from './events/fatigueEvents';
import { GHOST_EVENTS } from './events/ghostEvents';
import { MENTAL_ILLNESS_ACTIONS, MENTAL_INTERACTIONS, LOVER_MENTAL_EVENTS } from './events/mentalEvents';
import { INTERACTION_POOL, ZOMBIE_HUMAN_INTERACTIONS, InteractionResult } from './events/interaction/index';
import { getJobMbtiEvent } from './events/jobEvents/index';

// Updated helper to include Affinity
const formatStatChange = (hp?: number, sanity?: number, fatigue?: number, infection?: number, hunger?: number, affinity?: number) => {
    const parts = [];
    if (hp) parts.push(`체력 ${hp > 0 ? '+' : ''}${hp}`);
    if (sanity) parts.push(`정신 ${sanity > 0 ? '+' : ''}${sanity}`);
    if (fatigue) parts.push(`피로 ${fatigue > 0 ? '+' : ''}${fatigue}`);
    if (infection) parts.push(`감염 ${infection > 0 ? '+' : ''}${infection}`);
    if (hunger) parts.push(`허기 ${hunger > 0 ? '+' : ''}${hunger}`);
    if (affinity) parts.push(`호감 ${affinity > 0 ? '+' : ''}${affinity}`);
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

    let narrativeText = storyNode.text;

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
            
            // Apply Global Affinity Change
            if (effect.affinity) {
                const relUpdates: RelationshipUpdate[] = [];
                living.forEach(other => {
                    if (other.id !== target.id) {
                        relUpdates.push({ targetId: other.id, change: effect.affinity! });
                    }
                });
                if (relUpdates.length > 0) {
                    update.relationshipUpdates = relUpdates;
                }
            }

            updates.push(update);
        });

        if (effect.loot) loot.push(...effect.loot);

        // Append stat changes to the narrative text
        const statLog = formatStatChange(effect.hp, effect.sanity, effect.fatigue, effect.infection, undefined, effect.affinity);
        narrativeText += statLog;
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
            const hungerLoss = DAILY_HUNGER_LOSS;
            update.hungerChange = -hungerLoss;
            
            // Check for Starvation Death
            if (char.hunger - hungerLoss <= 0) {
                update.status = 'Dead';
                events.push(`💀 굶주린 좀비 ${char.name}은(는) 에너지가 고갈되어 완전히 활동을 정지했습니다. (아사)`);
            } else if (Math.random() < 0.3) {
                events.push(`🧟 ${char.name}은(는) 신선한 고기를 찾아 거리를 배회했습니다.`);
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
                 update.infectionChange = Math.floor((Math.random() * 5) + 2); 
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
            let relationshipChangeType: RelationshipStatus | undefined = undefined;

            const affinity = char.relationships[target.id] || 0;
            const relStatus = char.relationshipStatuses[target.id] || 'None';

            // --- Interaction Priority System ---

            // 1. Mental Illness Interaction (Highest Priority)
            if (settings.useMentalStates && char.mentalState !== 'Normal' && Math.random() < 0.5) {
                 if (['Lover', 'Spouse'].includes(relStatus)) {
                     const pool = LOVER_MENTAL_EVENTS[char.mentalState];
                     if (pool && pool.length > 0) {
                         interactionResult = pool[Math.floor(Math.random() * pool.length)](char.name, target.name);
                     }
                 }
                 if (!interactionResult) {
                     interactionResult = MENTAL_INTERACTIONS[Math.floor(Math.random() * MENTAL_INTERACTIONS.length)](char.name, target.name);
                 }
            } 
            // 2. Zombie Human Interaction
            else if (target.status === 'Zombie') {
                 interactionResult = ZOMBIE_HUMAN_INTERACTIONS[Math.floor(Math.random() * ZOMBIE_HUMAN_INTERACTIONS.length)](target.name, char.name);
            }
            // 3. Dynamic Relationship Events (Logic Triggers)
            else {
                // A. Confession (고백): Not related, High Affinity (>60), Chance
                if (!['Lover', 'Spouse', 'Ex', 'Parent', 'Child', 'Sibling'].includes(relStatus) && affinity > 60 && Math.random() < 0.15) {
                    // Check Same Sex Setting
                    const isSameSex = char.gender === target.gender;
                    if (settings.allowSameSexCouples || !isSameSex) {
                        const pool = INTERACTION_POOL['CONFESSION'];
                        interactionResult = pool[Math.floor(Math.random() * pool.length)](char.name, target.name);
                        relationshipChangeType = 'Lover';
                    }
                }
                // B. Breakup (이별): Lover/Spouse, Low Affinity (<-10), Chance
                else if (['Lover', 'Spouse'].includes(relStatus) && affinity < -10 && Math.random() < 0.2) {
                    const pool = INTERACTION_POOL['BREAKUP'];
                    interactionResult = pool[Math.floor(Math.random() * pool.length)](char.name, target.name);
                    relationshipChangeType = 'Ex';
                }
                // C. Reunion (재결합): Ex, High Affinity (>50), Chance
                else if (relStatus === 'Ex' && affinity > 50 && Math.random() < 0.15) {
                    const pool = INTERACTION_POOL['REUNION'];
                    interactionResult = pool[Math.floor(Math.random() * pool.length)](char.name, target.name);
                    relationshipChangeType = 'Lover';
                }
                // D. Fatigue Relief (피로 회복): One is tired (>40), Not enemies, Chance
                else if ((char.fatigue > 40 || target.fatigue > 40) && affinity > 0 && Math.random() < 0.3) {
                    const pool = INTERACTION_POOL['FATIGUE_RELIEF'];
                    interactionResult = pool[Math.floor(Math.random() * pool.length)](char.name, target.name);
                }
                // E. Standard Role/Affinity Based
                else {
                    let poolKey = 'POSITIVE';
                    if (affinity < -20) poolKey = 'NEGATIVE';
                    
                    if (relStatus && relStatus !== 'None') {
                         let key = relStatus.toUpperCase();
                         // Specific mapping adjustments for cases where Enum doesn't match Pool Key
                         if (relStatus === 'BestFriend') key = 'BEST_FRIEND';
                         if (relStatus === 'Ex') key = 'EX_LOVER';
                         if (relStatus === 'Parent' || relStatus === 'Child') key = 'PARENT_CHILD';
                         
                         if (INTERACTION_POOL[key]) poolKey = key;
                    }
    
                    let pool = INTERACTION_POOL[poolKey];
                    if (!pool) pool = INTERACTION_POOL['POSITIVE'];
    
                    const actionFunc = pool[Math.floor(Math.random() * pool.length)];
                    interactionResult = actionFunc(char.name, target.name);
                }
            }

            if (interactionResult) {
                const resText = typeof interactionResult === 'string' ? interactionResult : interactionResult.text;
                let log = resText;
                
                if (typeof interactionResult !== 'string') {
                    // Relationship Status Update (if triggered)
                    if (relationshipChangeType) {
                        update.relationshipUpdates = [{ targetId: target.id, change: interactionResult.affinity || 0, newStatus: relationshipChangeType }];
                        targetUpdate.relationshipUpdates = [{ targetId: char.id, change: interactionResult.affinity || 0, newStatus: relationshipChangeType === 'Lover' ? 'Lover' : relationshipChangeType === 'Ex' ? 'Ex' : undefined }];
                        
                        // Add status emoji to log
                        if (relationshipChangeType === 'Lover') log = `💕 [커플 탄생] ` + log;
                        if (relationshipChangeType === 'Ex') log = `💔 [이별] ` + log;
                    } 
                    // Standard Affinity Update
                    else if (interactionResult.affinity) {
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
        narrative: narrativeText,
        events,
        updates,
        loot,
        nextStoryNodeId: storyNode.id
    };
};
