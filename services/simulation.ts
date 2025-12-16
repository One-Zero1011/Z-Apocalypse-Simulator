
import { 
    Character, SimulationResult, CharacterUpdate, GameSettings, ForcedEvent, 
    RelationshipStatus, ActionEffect, BabyEventData 
} from '../types';
import { 
    MAX_HP, MAX_SANITY, MAX_FATIGUE, MAX_INFECTION, MAX_HUNGER, 
    FATIGUE_THRESHOLD, DAILY_HUNGER_LOSS, PRODUCTION_JOBS
} from '../constants';
import { getNextStoryNode } from './events/globalEvents';
import { FATIGUE_EVENTS } from './events/fatigueEvents';
import { MBTI_SPECIFIC_ACTIONS } from './events/mbtiEvents';
import { 
    MENTAL_ILLNESS_ACTIONS, MENTAL_INTERACTIONS, LOVER_MENTAL_EVENTS 
} from './events/mentalEvents';
import { INTERACTION_POOL } from './events/interaction/index';
import { GHOST_EVENTS } from './events/ghostEvents';
import { getJobMbtiEvent } from './events/jobEvents/index';
import { REST_EVENTS } from './events/restEvents';
import { STORY_NODES } from './events/storyNodes';

// --- Helpers ---

const applyEffectToUpdate = (update: CharacterUpdate, effect: ActionEffect) => {
    if (effect.hp) update.hpChange = (update.hpChange || 0) + effect.hp;
    if (effect.sanity) update.sanityChange = (update.sanityChange || 0) + effect.sanity;
    if (effect.fatigue) update.fatigueChange = (update.fatigueChange || 0) + effect.fatigue;
    if (effect.infection) update.infectionChange = (update.infectionChange || 0) + effect.infection;
    if (effect.hunger) update.hungerChange = (update.hungerChange || 0) + effect.hunger;
    if (effect.kill) update.killCountChange = (update.killCountChange || 0) + effect.kill;
    if (effect.status) update.status = effect.status;
    if (effect.loot) update.inventoryAdd = [...(update.inventoryAdd || []), ...effect.loot];
    if (effect.inventoryRemove) update.inventoryRemove = [...(update.inventoryRemove || []), ...effect.inventoryRemove];
};

const getCharacterUpdate = (updates: CharacterUpdate[], id: string): CharacterUpdate => {
    let update = updates.find(u => u.id === id);
    if (!update) {
        update = { id };
        updates.push(update);
    }
    return update;
};

// Helper: Check if character has a lover/spouse
const hasPartner = (c: Character) => Object.values(c.relationshipStatuses).some(s => s === 'Lover' || s === 'Spouse');

// Helper: Get specific loot based on job category
const getJobLootEvent = (char: Character): ActionEffect => {
    const job = char.job || '';
    let loot: string[] = [];
    let text = "";

    // Food Producers
    if (["농부", "요리사", "사육사", "어부", "사냥꾼"].includes(job)) {
        const item = Math.random() > 0.5 ? '고기' : '통조림';
        loot = [item];
        text = `🎒 [직업: ${job}] ${char.name}은(는) 자신의 능력을 발휘하여 식량(${item})을 확보했습니다.`;
    } 
    // Meds Producers
    else if (["의사", "약사", "간호사", "수의사", "응급구조사"].includes(job)) {
        const item = Math.random() > 0.7 ? '항생제' : (Math.random() > 0.5 ? '붕대' : '비타민');
        loot = [item];
        text = `💊 [직업: ${job}] ${char.name}은(는) 폐허 속에서 쓸만한 의료품(${item})을 찾아냈습니다.`;
    }
    // Tech/Utility
    else if (["기술자(엔지니어)", "정비공", "배관공", "목수"].includes(job)) {
        const item = Math.random() > 0.6 ? '맥가이버 칼' : '붕대';
        loot = [item];
        text = `🔧 [직업: ${job}] ${char.name}은(는) 자재를 가공하여 ${item}을(를) 만들어냈습니다.`;
    }
    // Searchers/Luck
    else if (["형사", "탐정", "기자", "도박사", "영업직", "노숙자"].includes(job)) {
        const items = ['초콜릿', '통조림', '비타민', '지도', '권총'];
        const item = items[Math.floor(Math.random() * items.length)];
        loot = [item];
        text = `🔎 [직업: ${job}] ${char.name}은(는) 예리한 감각으로 숨겨진 물자(${item})를 발견했습니다!`;
    }
    // Fallback
    else {
        loot = ['통조림'];
        text = `🎒 [직업] ${char.name}은(는) 운 좋게 통조림을 주웠습니다.`;
    }

    return { text, loot, fatigue: 5 };
};

// --- Logic Sections ---

const processStoryEvent = (
    currentStoryNodeId: string | null,
    forcedEvents: ForcedEvent[],
    characters: Character[],
    updates: CharacterUpdate[],
    globalLoot: string[],
    userSelectedNodeId?: string // New Parameter
) => {
    // 1. Determine Story Node
    const forcedStory = forcedEvents.find(e => e.type === 'STORY');
    let storyNode;
    let nextStoryNodeId: string | null = null;
    let consumedItems: string[] = [];

    // Check for item consumption based on choice BEFORE moving to next node
    if (currentStoryNodeId && userSelectedNodeId && STORY_NODES[currentStoryNodeId]) {
        const currentNode = STORY_NODES[currentStoryNodeId];
        const selectedOption = currentNode.next?.find(o => o.id === userSelectedNodeId);
        if (selectedOption?.req?.item) {
            consumedItems.push(selectedOption.req.item);
        }
    }

    if (forcedStory && STORY_NODES[forcedStory.key]) {
        storyNode = STORY_NODES[forcedStory.key];
        nextStoryNodeId = forcedStory.key;
    } else {
        // Pass user selection to getNextStoryNode
        storyNode = getNextStoryNode(currentStoryNodeId, userSelectedNodeId);
        nextStoryNodeId = storyNode.id;
    }

    const narrative = storyNode.text;

    // 2. Apply Story Effects
    if (storyNode.effect) {
        const effect = storyNode.effect;
        let targets: Character[] = [];
        const livingChars = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');

        if (effect.target === 'ALL') targets = livingChars;
        else if (effect.target === 'RANDOM_1') targets = [livingChars[Math.floor(Math.random() * livingChars.length)]];
        else if (effect.target === 'RANDOM_HALF') {
            const shuffled = [...livingChars].sort(() => 0.5 - Math.random());
            targets = shuffled.slice(0, Math.ceil(shuffled.length / 2));
        }

        targets.forEach(t => {
            const update = getCharacterUpdate(updates, t.id);
            const storyActionEffect: ActionEffect = {
                text: '', 
                hp: effect.hp,
                sanity: effect.sanity,
                fatigue: effect.fatigue,
                infection: effect.infection,
                hunger: effect.hunger,
                kill: effect.kill,
                status: effect.status,
                inventoryRemove: effect.inventoryRemove
            };
            applyEffectToUpdate(update, storyActionEffect);
        });

        if (effect.loot) globalLoot.push(...effect.loot);
    }

    return { narrative, nextStoryNodeId, consumedItems };
};

const processIndividualEvents = (
    characters: Character[],
    forcedEvents: ForcedEvent[],
    settings: GameSettings,
    updates: CharacterUpdate[],
    events: string[]
) => {
    for (const char of characters) {
        const update = getCharacterUpdate(updates, char.id);

        // Zombie Hunger Decay
        if (char.status === 'Zombie') {
            update.hungerChange = (update.hungerChange || 0) - DAILY_HUNGER_LOSS;
        }

        // Dead/Ghost Events
        if (char.status === 'Dead' || char.status === 'Missing') {
            const livingTargets = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
            // Shuffle targets to avoid bias
            const shuffledTargets = [...livingTargets].sort(() => 0.5 - Math.random());

            for (const target of shuffledTargets) {
                const relStatus = char.relationshipStatuses[target.id];
                const isDeepConnection = ['Lover', 'Spouse', 'Family', 'Parent', 'Child', 'Sibling'].includes(relStatus || '');
                
                // Base 10%, Deep connection 25%
                const probability = isDeepConnection ? 0.25 : 0.10;

                if (Math.random() < probability) {
                    const ghostEvent = GHOST_EVENTS[Math.floor(Math.random() * GHOST_EVENTS.length)];
                    const result = ghostEvent(char.name, target.name);
                    events.push(result.text);
                    
                    const targetUpdate = getCharacterUpdate(updates, target.id);
                    applyEffectToUpdate(targetUpdate, result);
                    
                    // Trigger only one ghost event per dead character per day
                    break;
                }
            }
            continue;
        }

        // Forced Event Check
        const forcedCharEvent = forcedEvents.find(e => e.type !== 'STORY' && e.actorId === char.id);
        if (forcedCharEvent && forcedCharEvent.type === 'MBTI') {
            const mbtiGen = MBTI_SPECIFIC_ACTIONS[char.mbti]; 
            const action = mbtiGen(char.name, char.gender);
            events.push(action.text);
            applyEffectToUpdate(update, action);
            continue;
        }

        // Priority Logic
        if (settings.useMentalStates && char.mentalState !== 'Normal' && Math.random() < 0.3) {
            const mentalAction = MENTAL_ILLNESS_ACTIONS[char.mentalState](char);
            events.push(mentalAction.text);
            applyEffectToUpdate(update, mentalAction);
        } else if (char.fatigue >= FATIGUE_THRESHOLD && Math.random() < 0.4) {
            const fatigueAction = FATIGUE_EVENTS[Math.floor(Math.random() * FATIGUE_EVENTS.length)](char.name);
            events.push(fatigueAction.text);
            applyEffectToUpdate(update, fatigueAction);
        } else if (char.status !== 'Zombie') {
            
            // Production Job Loot Logic (30% Guarantee)
            const isProduction = PRODUCTION_JOBS.includes(char.job || '');
            if (isProduction && Math.random() < 0.3) {
                const lootAction = getJobLootEvent(char);
                events.push(lootAction.text);
                applyEffectToUpdate(update, lootAction);
                continue; // Skip standard job/mbti event if loot is produced
            }

            const rand = Math.random();
            if (char.fatigue > 60 && rand < 0.3) {
                const restAction = REST_EVENTS[Math.floor(Math.random() * REST_EVENTS.length)](char.name);
                events.push(restAction.text);
                applyEffectToUpdate(update, restAction);
            } else if (char.job && rand < 0.6) {
                const jobAction = getJobMbtiEvent(char.job, char.mbti, char.name);
                events.push(jobAction.text);
                applyEffectToUpdate(update, jobAction);
            } else {
                const mbtiAction = MBTI_SPECIFIC_ACTIONS[char.mbti](char.name, char.gender);
                events.push(mbtiAction.text);
                applyEffectToUpdate(update, mbtiAction);
            }
        }
    }
};

// ----------------------------------------------------------------------
// New Function: Infection Crisis Vote Logic (Previous Implementation kept)
// ----------------------------------------------------------------------
const processInfectionCrisis = (
    characters: Character[],
    updates: CharacterUpdate[],
    events: string[]
) => {
    const living = characters.filter(c => ['Alive', 'Infected'].includes(c.status));
    const getProjectedInfection = (char: Character) => {
        const update = updates.find(u => u.id === char.id);
        return char.infection + (update?.infectionChange || 0);
    };

    for (const char of living) {
        const projectedInfection = getProjectedInfection(char);
        if (projectedInfection >= MAX_INFECTION) {
            const update = getCharacterUpdate(updates, char.id);
            if (update.status) continue; 
            const voters = living.filter(v => v.id !== char.id);
            if (voters.length === 0) {
                events.push(`🧟 [감염] ${char.name}은(는) 고립된 채 고통 속에 몸부림치다 완전히 좀비로 변이했습니다.`);
                update.status = 'Zombie';
                continue;
            }
            events.push(`⚠️ [위기] ${char.name}의 감염도가 100%에 도달했습니다. 남은 생존자들은 ${char.name}의 처분을 두고 투표를 진행합니다.`);
            let keepScore = 0;
            let exileScore = 0;
            voters.forEach(voter => {
                let score = 0;
                const affinity = voter.relationships[char.id] || 0;
                const mbti = voter.mbti;
                if (mbti.includes('T')) score -= 2;
                if (mbti.includes('F')) score += 2; 
                if (affinity >= 50) score += 4;
                else if (affinity >= 10) score += 2;
                else if (affinity <= -20) score -= 3;
                else if (affinity <= -50) score -= 5;
                const relStatus = voter.relationshipStatuses[char.id];
                if (['Lover', 'Spouse', 'Parent', 'Child', 'Sibling'].includes(relStatus || '')) {
                    score += 15;
                } else if (relStatus === 'Enemy' || relStatus === 'Rival') {
                    score -= 5;
                }
                if (score > 0) keepScore++;
                else exileScore++;
            });
            if (keepScore >= exileScore) {
                events.push(`🗳️ 투표 결과 [보호 ${keepScore} : 포기 ${exileScore}] - 생존자들은 위험을 감수하고 ${char.name}을(를) 데리고 있기로 결정했습니다.`);
                events.push(`🧟 ${char.name}은(는) 좀비로 변했습니다. 밧줄로 묶었지만 입마개가 없어 매우 위험합니다! 인벤토리의 '입마개'를 사용하세요.`);
                update.status = 'Zombie';
                update.hasMuzzle = false; 
            } else {
                events.push(`🗳️ 투표 결과 [보호 ${keepScore} : 포기 ${exileScore}] - 생존자들은 모두의 안전을 위해 ${char.name}을(를) 처리하기로 결정했습니다.`);
                events.push(`🔫 ${char.name}은(는) 인간으로서의 존엄을 지키며 동료들의 손에 최후를 맞이했습니다.`);
                update.status = 'Dead';
                update.hpChange = -9999;
            }
        }
    }
};

// ----------------------------------------------------------------------
// New Function: Marriage and Pregnancy Logic
// ----------------------------------------------------------------------
const processMarriageAndPregnancy = (
    characters: Character[],
    updates: CharacterUpdate[],
    events: string[],
    settings: GameSettings // Added settings parameter to check pregnancy
): BabyEventData | null => {
    const living = characters.filter(c => ['Alive', 'Infected'].includes(c.status));
    const processedPairs = new Set<string>();
    let babyEvent: BabyEventData | null = null;

    for (const char of living) {
        for (const [partnerId, status] of Object.entries(char.relationshipStatuses)) {
            const partner = living.find(c => c.id === partnerId);
            if (!partner) continue;

            const pairKey = [char.id, partner.id].sort().join('-');
            if (processedPairs.has(pairKey)) continue;
            processedPairs.add(pairKey);

            // 1. Marriage Logic (Lover -> Spouse)
            if (status === 'Lover') {
                const duration = char.relationshipDurations[partnerId] || 0;
                // Chance starts at 1%, increases by 1% every 2 days, max 50%
                const chance = Math.min(0.50, 0.01 + (Math.floor(duration / 2) * 0.01));
                
                if (Math.random() < chance) {
                    const charUpdate = getCharacterUpdate(updates, char.id);
                    const partnerUpdate = getCharacterUpdate(updates, partner.id);

                    if (!charUpdate.relationshipUpdates) charUpdate.relationshipUpdates = [];
                    if (!partnerUpdate.relationshipUpdates) partnerUpdate.relationshipUpdates = [];

                    charUpdate.relationshipUpdates.push({ targetId: partner.id, change: 20, newStatus: 'Spouse' });
                    partnerUpdate.relationshipUpdates.push({ targetId: char.id, change: 20, newStatus: 'Spouse' });

                    events.push(`💍 [결혼] ${char.name}와(과) ${partner.name}은(는) 서로의 사랑을 확인하고 부부가 되기로 맹세했습니다! (관계 지속 ${duration}일)`);
                    
                    // Boost sanity for both
                    applyEffectToUpdate(charUpdate, { text: '', sanity: 20 });
                    applyEffectToUpdate(partnerUpdate, { text: '', sanity: 20 });
                }
            }

            // 2. Pregnancy Logic (Spouse -> Baby)
            // Only if settings enabled and M+F couple
            if (status === 'Spouse' && !babyEvent && settings.enablePregnancy) {
                const isHetero = (char.gender === 'Male' && partner.gender === 'Female') || (char.gender === 'Female' && partner.gender === 'Male');
                
                if (isHetero) {
                    // Fixed 5% chance per day
                    if (Math.random() < 0.05) {
                        const fatherId = char.gender === 'Male' ? char.id : partner.id;
                        const motherId = char.gender === 'Female' ? char.id : partner.id;
                        
                        // We do NOT add the baby here directly. 
                        // Instead, we trigger the UI modal via babyEvent return.
                        babyEvent = { fatherId, motherId };
                    }
                }
            }
        }
    }
    return babyEvent;
};

const processInteractionPhase = (
    characters: Character[],
    forcedEvents: ForcedEvent[],
    settings: GameSettings,
    updates: CharacterUpdate[],
    events: string[]
) => {
    const getProjectedStatus = (c: Character) => {
        const u = updates.find(up => up.id === c.id);
        return u?.status || c.status;
    };
    const living = characters.filter(c => {
        const s = getProjectedStatus(c);
        return s !== 'Dead' && s !== 'Missing';
    });
    const forcedInteractions = forcedEvents.filter(e => e.type === 'INTERACTION' && e.actorId && e.targetId);
    for (const fe of forcedInteractions) {
        const actor = characters.find(c => c.id === fe.actorId);
        const target = characters.find(c => c.id === fe.targetId);
        if (actor && target) {
            const pool = INTERACTION_POOL[fe.key];
            if (pool && pool[fe.index || 0]) {
                const result = pool[fe.index || 0](actor.name, target.name);
                processInteractionResult(result, actor, target, updates, events);
            }
        }
    }
    const numInteractions = Math.max(1, Math.floor(living.length / 2));
    for (let i = 0; i < numInteractions; i++) {
        if (living.length < 2) break;
        const actorIdx = Math.floor(Math.random() * living.length);
        const actor = living[actorIdx];
        let targetIdx = Math.floor(Math.random() * living.length);
        while (targetIdx === actorIdx) {
            targetIdx = Math.floor(Math.random() * living.length);
        }
        const target = living[targetIdx];
        if (forcedInteractions.some(fe => fe.actorId === actor.id && fe.targetId === target.id)) continue;
        const affinity = actor.relationships[target.id] || 0;
        const relStatus = actor.relationshipStatuses[target.id] || 'None';
        const actorStatus = getProjectedStatus(actor);
        const targetStatus = getProjectedStatus(target);
        let poolKey = 'POSITIVE';
        let interactionResult: any = null;
        let relationshipChangeType: RelationshipStatus | undefined = undefined;
        if (actorStatus === 'Zombie' || targetStatus === 'Zombie') {
            const z = actorStatus === 'Zombie' ? actor : target;
            const h = actorStatus === 'Zombie' ? target : actor;
            const zUpdate = updates.find(u => u.id === z.id);
            const hasMuzzle = zUpdate?.hasMuzzle !== undefined ? zUpdate.hasMuzzle : z.hasMuzzle;
            if (actorStatus === 'Zombie' && targetStatus === 'Zombie') continue; 
            if (hasMuzzle) {
               const pool = INTERACTION_POOL['ZOMBIE_HUMAN'];
               interactionResult = pool[Math.floor(Math.random() * pool.length)](z.name, h.name);
            } else {
               if (Math.random() < 0.1) {
                   interactionResult = { 
                       text: `🩸 [위험] 입마개를 하지 않은 좀비 ${z.name}이(가) 본능을 이기지 못하고 ${h.name}을(를) 물어뜯었습니다!`,
                       targetHp: -20,
                       targetInfection: 20
                   };
               } else {
                   const pool = INTERACTION_POOL['ZOMBIE_HUMAN'];
                   interactionResult = pool[Math.floor(Math.random() * pool.length)](z.name, h.name);
               }
            }
        } 
        else if (settings.useMentalStates && actor.mentalState !== 'Normal' && Math.random() < 0.4) {
            if (relStatus === 'Lover' || relStatus === 'Spouse') {
                const pool = LOVER_MENTAL_EVENTS[actor.mentalState] || [];
                if (pool.length > 0) interactionResult = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
            } else {
                const pool = MENTAL_INTERACTIONS;
                interactionResult = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
            }
        }
        else {
            if (['Lover', 'Spouse'].includes(relStatus)) {
                if (affinity < -20) {
                    if (Math.random() < 0.3) {
                        const pool = INTERACTION_POOL['BREAKUP'];
                        interactionResult = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
                        relationshipChangeType = 'Ex';
                    } else {
                        poolKey = 'NEGATIVE';
                    }
                } else {
                    poolKey = relStatus === 'Spouse' ? 'SPOUSE' : 'LOVER';
                }
            } else if (relStatus === 'Ex') {
                if (affinity > 50 && Math.random() < 0.2) {
                    const actorHasPartner = hasPartner(actor);
                    const targetHasPartner = hasPartner(target);
                    if (settings.pureLoveMode && (actorHasPartner || targetHasPartner)) {
                        poolKey = 'POSITIVE'; 
                    } else {
                        const pool = INTERACTION_POOL['REUNION'];
                        interactionResult = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
                        relationshipChangeType = 'Lover';
                    }
                } else {
                    poolKey = 'EX_LOVER';
                }
            } else if (['Parent', 'Child', 'Sibling', 'Family'].includes(relStatus)) {
                if (relStatus === 'Sibling') poolKey = 'SIBLING';
                else if (relStatus === 'Family') poolKey = 'FAMILY';
                else poolKey = 'PARENT_CHILD';
            } else if (relStatus === 'Enemy' || relStatus === 'Rival') {
                poolKey = relStatus === 'Enemy' ? 'ENEMY' : 'RIVAL';
            } else if (relStatus === 'BestFriend') {
                poolKey = 'BEST_FRIEND';
            } else {
                if (!['Lover', 'Spouse', 'Ex'].includes(relStatus) && affinity > 60 && Math.random() < 0.15) {
                    const isSameSex = actor.gender === target.gender;
                    const isFamily = ['Parent', 'Child', 'Sibling', 'Family'].includes(relStatus);
                    const allowedByGender = settings.allowSameSexCouples || !isSameSex;
                    const allowedByFamily = settings.allowIncest || !isFamily;
                    if (allowedByGender && allowedByFamily) {
                        const actorHasPartner = hasPartner(actor);
                        const targetHasPartner = hasPartner(target);
                        if (settings.pureLoveMode && (actorHasPartner || targetHasPartner)) {
                        } else {
                            const pool = INTERACTION_POOL['CONFESSION'];
                            interactionResult = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
                            relationshipChangeType = 'Lover';
                        }
                    }
                }
                if (!interactionResult) {
                    if (affinity > 30) poolKey = 'POSITIVE';
                    else if (affinity < -10) poolKey = 'NEGATIVE';
                    else poolKey = Math.random() > 0.5 ? 'POSITIVE' : 'NEGATIVE';
                }
            }
            if (!interactionResult) {
                if ((actor.fatigue > 50 || target.fatigue > 50) && affinity > 20 && Math.random() < 0.3) {
                    poolKey = 'FATIGUE_RELIEF';
                }
                const pool = INTERACTION_POOL[poolKey] || INTERACTION_POOL['POSITIVE'];
                interactionResult = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
            }
        }
        processInteractionResult(interactionResult, actor, target, updates, events, relationshipChangeType);
    }
};

function processInteractionResult(
    result: any, 
    actor: Character, 
    target: Character, 
    updates: CharacterUpdate[], 
    events: string[],
    newRelStatus?: RelationshipStatus
) {
    if (!result) return;
    const text = typeof result === 'string' ? result : result.text;
    events.push(text);
    const effect = typeof result === 'string' ? {} : result;
    const actorUpdate = getCharacterUpdate(updates, actor.id);
    const targetUpdate = getCharacterUpdate(updates, target.id);
    if (effect.actorHp) actorUpdate.hpChange = (actorUpdate.hpChange || 0) + effect.actorHp;
    if (effect.actorSanity) actorUpdate.sanityChange = (actorUpdate.sanityChange || 0) + effect.actorSanity;
    if (effect.actorFatigue) actorUpdate.fatigueChange = (actorUpdate.fatigueChange || 0) + effect.actorFatigue;
    if (effect.targetHp) targetUpdate.hpChange = (targetUpdate.hpChange || 0) + effect.targetHp;
    if (effect.targetSanity) targetUpdate.sanityChange = (targetUpdate.sanityChange || 0) + effect.targetSanity;
    if (effect.targetFatigue) targetUpdate.fatigueChange = (targetUpdate.fatigueChange || 0) + effect.targetFatigue;
    if (effect.targetInfection) targetUpdate.infectionChange = (targetUpdate.infectionChange || 0) + effect.targetInfection;
    if (effect.affinity) {
        const change = effect.affinity;
        if (!actorUpdate.relationshipUpdates) actorUpdate.relationshipUpdates = [];
        actorUpdate.relationshipUpdates.push({ targetId: target.id, change: change, newStatus: newRelStatus });
        if (!targetUpdate.relationshipUpdates) targetUpdate.relationshipUpdates = [];
        targetUpdate.relationshipUpdates.push({ targetId: actor.id, change: change, newStatus: newRelStatus === 'Lover' ? 'Lover' : newRelStatus === 'Ex' ? 'Ex' : undefined });
    }
}

// --- Main Export ---

export const simulateDay = async (
    day: number, 
    characters: Character[], 
    currentStoryNodeId: string | null, 
    settings: GameSettings, 
    forcedEvents: ForcedEvent[],
    userSelectedNodeId?: string // New Parameter
): Promise<SimulationResult> => {
    const events: string[] = [];
    const updates: CharacterUpdate[] = [];
    const globalLoot: string[] = [];

    // Phase 1: Story (Pass user selection)
    const { narrative, nextStoryNodeId, consumedItems } = processStoryEvent(currentStoryNodeId, forcedEvents, characters, updates, globalLoot, userSelectedNodeId);

    // Phase 2: Individual Events
    processIndividualEvents(characters, forcedEvents, settings, updates, events);

    // Phase 2.5: Infection Crisis Vote
    processInfectionCrisis(characters, updates, events);

    // Phase 2.6: Marriage & Pregnancy (New)
    const babyEvent = processMarriageAndPregnancy(characters, updates, events, settings);

    // Phase 3: Interactions
    processInteractionPhase(characters, forcedEvents, settings, updates, events);

    return {
        narrative,
        events,
        updates,
        loot: globalLoot,
        inventoryRemove: consumedItems, // Pass consumed items to result
        nextStoryNodeId,
        babyEvent
    };
};
