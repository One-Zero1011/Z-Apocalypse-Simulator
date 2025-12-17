
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

// Helper: Generate Effect String
const generateEffectLog = (effect: ActionEffect, characters: Character[], targetId?: string): string => {
    const parts: string[] = [];
    if (effect.hp) parts.push(`❤️${effect.hp > 0 ? '+' : ''}${effect.hp}`);
    if (effect.sanity) parts.push(`🧠${effect.sanity > 0 ? '+' : ''}${effect.sanity}`);
    if (effect.fatigue) parts.push(`💤${effect.fatigue > 0 ? '+' : ''}${effect.fatigue}`);
    if (effect.infection) parts.push(`🦠${effect.infection > 0 ? '+' : ''}${effect.infection}`);
    if (effect.hunger) parts.push(`🍖${effect.hunger > 0 ? '+' : ''}${effect.hunger}`);
    if (effect.status && effect.status !== 'Alive') parts.push(`💀${effect.status}`);
    
    // Explicit Actor/Target changes (used in Interactions)
    if (effect.actorHp) parts.push(`(나)❤️${effect.actorHp > 0 ? '+' : ''}${effect.actorHp}`);
    if (effect.targetHp) parts.push(`(상대)❤️${effect.targetHp > 0 ? '+' : ''}${effect.targetHp}`);
    if (effect.actorSanity) parts.push(`(나)🧠${effect.actorSanity > 0 ? '+' : ''}${effect.actorSanity}`);
    if (effect.targetSanity) parts.push(`(상대)🧠${effect.targetSanity > 0 ? '+' : ''}${effect.targetSanity}`);
    
    // Affinity
    if (effect.affinity && targetId) {
        const target = characters.find(c => c.id === targetId);
        const targetName = target ? target.name : 'Unknown';
        parts.push(`💞 ${targetName} ${effect.affinity > 0 ? '+' : ''}${effect.affinity}`);
    }
    
    // Loot
    if (effect.loot && effect.loot.length > 0) {
        parts.push(`📦${effect.loot.join(',')}`);
    }

    if (parts.length === 0) return '';
    return ` (${parts.join(', ')})`;
};

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
    userSelectedNodeId?: string,
    settings?: GameSettings // Add settings to check showEventEffects
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

    let narrative = storyNode.text;

    // 2. Apply Story Effects
    if (storyNode.effect) {
        const effect = storyNode.effect;
        let targets: Character[] = [];
        
        // BUG FIX: Restrict targets to only Alive or Infected. 
        // Previously used (!Dead && !Missing), which included Zombies, causing them to be revived by events.
        const livingChars = characters.filter(c => c.status === 'Alive' || c.status === 'Infected');

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

        // Append Effect String to Narrative if enabled
        if (settings?.showEventEffects) {
            const effectSummary = generateEffectLog({
                text: '',
                hp: effect.hp,
                sanity: effect.sanity,
                fatigue: effect.fatigue,
                infection: effect.infection,
                hunger: effect.hunger,
                loot: effect.loot,
                status: effect.status
            }, characters);
            if (effectSummary) narrative += effectSummary;
        }

        if (effect.loot) globalLoot.push(...effect.loot);
    }

    return { narrative, nextStoryNodeId, consumedItems };
};

const processIndividualEvents = (
    characters: Character[],
    forcedEvents: ForcedEvent[],
    settings: GameSettings,
    updates: CharacterUpdate[],
    events: string[],
    globalLoot: string[] // Added param to capture individual loot
) => {
    for (const char of characters) {
        const update = getCharacterUpdate(updates, char.id);
        let action: ActionEffect | null = null; // Helper to store action

        // Zombie Hunger Decay & SKIP
        if (char.status === 'Zombie') {
            update.hungerChange = (update.hungerChange || 0) - DAILY_HUNGER_LOSS;
            continue; // CRITICAL FIX: Zombies must NOT perform individual actions (Jobs, MBTI, etc.)
        }

        // Dead/Ghost Events
        if (char.status === 'Dead' || char.status === 'Missing') {
            // Ghost should not haunt Zombies
            const livingTargets = characters.filter(c => c.status === 'Alive' || c.status === 'Infected');
            const shuffledTargets = [...livingTargets].sort(() => 0.5 - Math.random());

            for (const target of shuffledTargets) {
                const relStatus = char.relationshipStatuses[target.id];
                const isDeepConnection = ['Lover', 'Spouse', 'Family', 'Parent', 'Child', 'Sibling'].includes(relStatus || '');
                
                const probability = isDeepConnection ? 0.25 : 0.10;

                if (Math.random() < probability) {
                    const ghostEvent = GHOST_EVENTS[Math.floor(Math.random() * GHOST_EVENTS.length)];
                    const result = ghostEvent(char.name, target.name);
                    
                    let eventText = result.text;
                    if (settings.showEventEffects) {
                        eventText += generateEffectLog(result, characters);
                    }
                    events.push(eventText);
                    
                    const targetUpdate = getCharacterUpdate(updates, target.id);
                    // Handle loot from ghost events if any
                    if (result.loot && result.loot.length > 0) {
                        globalLoot.push(...result.loot);
                        const { loot, ...rest } = result;
                        applyEffectToUpdate(targetUpdate, rest);
                    } else {
                        applyEffectToUpdate(targetUpdate, result);
                    }
                    
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
            action = mbtiGen(char.name, char.gender);
        }
        // Priority Logic
        else if (settings.useMentalStates && char.mentalState !== 'Normal' && Math.random() < 0.3) {
            action = MENTAL_ILLNESS_ACTIONS[char.mentalState](char);
        } else if (char.fatigue >= FATIGUE_THRESHOLD && Math.random() < 0.4) {
            const fatigueGen = FATIGUE_EVENTS[Math.floor(Math.random() * FATIGUE_EVENTS.length)];
            action = fatigueGen(char.name);
        } else {
            // Normal Daily Events (Alive/Infected non-zombie)
            
            // Production Job Loot Logic (30% Guarantee)
            const isProduction = PRODUCTION_JOBS.includes(char.job || '');
            if (isProduction && Math.random() < 0.3) {
                action = getJobLootEvent(char);
            }
            else {
                const rand = Math.random();
                if (char.fatigue > 60 && rand < 0.3) {
                    const restGen = REST_EVENTS[Math.floor(Math.random() * REST_EVENTS.length)];
                    action = restGen(char.name);
                } else if (char.job && rand < 0.6) {
                    action = getJobMbtiEvent(char.job, char.mbti, char.name);
                } else {
                    action = MBTI_SPECIFIC_ACTIONS[char.mbti](char.name, char.gender);
                }
            }
        }

        // Unified Action Processor
        if (action) {
            let eventText = action.text;
            if (settings.showEventEffects) {
                eventText += generateEffectLog(action, characters);
            }
            events.push(eventText);

            if (action.loot && action.loot.length > 0) {
                globalLoot.push(...action.loot);
                // loot를 globalLoot에 추가하고, char update에서는 제거하여 중복(또는 숨김 인벤토리 저장)을 방지
                const { loot, ...rest } = action;
                applyEffectToUpdate(update, rest);
            } else {
                applyEffectToUpdate(update, action);
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

                    let eventText = `💍 [결혼] ${char.name}와(과) ${partner.name}은(는) 서로의 사랑을 확인하고 부부가 되기로 맹세했습니다! (관계 지속 ${duration}일)`;
                    if (settings.showEventEffects) {
                        eventText += ` (🧠+20)`; // Simple static log for marriage
                    }
                    events.push(eventText);
                    
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
    events: string[],
    globalLoot: string[] // Added param to capture individual loot
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
                processInteractionResult(result, actor, target, updates, events, settings);
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
        
        // --- ZOMBIE INTERACTION LOGIC ---
        // If either party is a Zombie, we override normal social logic.
        if (actorStatus === 'Zombie' || targetStatus === 'Zombie') {
            const z = actorStatus === 'Zombie' ? actor : target;
            const h = actorStatus === 'Zombie' ? target : actor;
            const zUpdate = updates.find(u => u.id === z.id);
            const hasMuzzle = zUpdate?.hasMuzzle !== undefined ? zUpdate.hasMuzzle : z.hasMuzzle;
            
            // Zombies ignore each other
            if (actorStatus === 'Zombie' && targetStatus === 'Zombie') continue; 
            
            // Interaction Pool for Zombies
            const pool = INTERACTION_POOL['ZOMBIE_HUMAN'];
            
            if (hasMuzzle) {
               // Safe interaction if muzzled
               interactionResult = pool[Math.floor(Math.random() * pool.length)](z.name, h.name);
            } else {
               // 10% Chance to Attack, 90% Chance for Flavor Interaction
               if (Math.random() < 0.1) {
                   interactionResult = { 
                       text: `🩸 [위험] 입마개를 하지 않은 좀비 ${z.name}이(가) 본능을 이기지 못하고 ${h.name}을(를) 물어뜯었습니다!`,
                       targetHp: -20,
                       targetInfection: 20
                   };
               } else {
                   interactionResult = pool[Math.floor(Math.random() * pool.length)](z.name, h.name);
               }
            }
        } 
        // --- HUMAN INTERACTION LOGIC (Only if neither is Zombie) ---
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
                else if (relStatus === 'Child') poolKey = 'PARENT_TO_CHILD'; // Actor views Target as Child (Actor is Parent)
                else poolKey = 'CHILD_TO_PARENT'; // Actor views Target as Parent (Actor is Child)
            } else if (relStatus === 'Enemy' || relStatus === 'Rival') {
                poolKey = relStatus === 'Enemy' ? 'ENEMY' : 'RIVAL';
            } else if (relStatus === 'BestFriend') {
                poolKey = 'BEST_FRIEND';
            } else if (relStatus === 'Colleague') {
                poolKey = 'COLLEAGUE';
            } else if (relStatus === 'Savior') {
                poolKey = 'SAVIOR';
            } else {
                if (!['Lover', 'Spouse', 'Ex'].includes(relStatus) && affinity > 60 && Math.random() < 0.15) {
                    const isSameSex = actor.gender === target.gender;
                    const isFamily = ['Parent', 'Child', 'Sibling', 'Family'].includes(relStatus);
                    const allowedByGender = settings.allowSameSexCouples || !isSameSex;
                    const allowedByFamily = settings.allowIncest || !isFamily;
                    
                    // --- Age Gap Check (Student Restriction) ---
                    const studentJobs = ['초등학생', '중학생', '고등학생'];
                    const isActorStudent = studentJobs.includes(actor.job || '');
                    const isTargetStudent = studentJobs.includes(target.job || '');
                    // If restriction is ON:
                    // - If Actor is Student and Target is NOT Student => Disallow
                    // - If Actor is NOT Student and Target is Student => Disallow
                    // (Equivalent to: must match student status if either is a student)
                    // If restriction is OFF: Always allowed (true)
                    const allowedByAge = !settings.restrictStudentDating || (isActorStudent === isTargetStudent);

                    if (allowedByGender && allowedByFamily && allowedByAge) {
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
        processInteractionResult(interactionResult, actor, target, updates, events, settings, relationshipChangeType);
    }
};

function processInteractionResult(
    result: any, 
    actor: Character, 
    target: Character, 
    updates: CharacterUpdate[], 
    events: string[],
    settings?: GameSettings,
    newRelStatus?: RelationshipStatus
) {
    if (!result) return;
    
    // Add Effects String
    let text = typeof result === 'string' ? result : result.text;
    const effect = typeof result === 'string' ? {} : result;

    if (settings?.showEventEffects) {
        text += generateEffectLog(effect, [actor, target], target.id);
    }
    events.push(text);

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
    // Also handle affinityChange which was used in some mental events
    if (effect.affinityChange) {
        const change = effect.affinityChange;
        if (!actorUpdate.relationshipUpdates) actorUpdate.relationshipUpdates = [];
        actorUpdate.relationshipUpdates.push({ targetId: target.id, change: change, newStatus: newRelStatus });
        if (!targetUpdate.relationshipUpdates) targetUpdate.relationshipUpdates = [];
        targetUpdate.relationshipUpdates.push({ targetId: actor.id, change: change, newStatus: newRelStatus === 'Lover' ? 'Lover' : newRelStatus === 'Ex' ? 'Ex' : undefined });
    }
    // Handle victim stats from mental events
    if (effect.victimHpChange) targetUpdate.hpChange = (targetUpdate.hpChange || 0) + effect.victimHpChange;
    if (effect.victimSanityChange) targetUpdate.sanityChange = (targetUpdate.sanityChange || 0) + effect.victimSanityChange;
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
    const { narrative, nextStoryNodeId, consumedItems } = processStoryEvent(currentStoryNodeId, forcedEvents, characters, updates, globalLoot, userSelectedNodeId, settings);

    // Phase 2: Individual Events
    processIndividualEvents(characters, forcedEvents, settings, updates, events, globalLoot); // Pass globalLoot

    // Phase 2.5: Infection Crisis Vote
    processInfectionCrisis(characters, updates, events);

    // Phase 2.6: Marriage & Pregnancy (New)
    const babyEvent = processMarriageAndPregnancy(characters, updates, events, settings);

    // Phase 3: Interactions
    processInteractionPhase(characters, forcedEvents, settings, updates, events, globalLoot);

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
