
import { 
    Character, SimulationResult, CharacterUpdate, GameSettings, ForcedEvent, 
    RelationshipStatus, ActionEffect 
} from '../types';
import { 
    MAX_HP, MAX_SANITY, MAX_FATIGUE, MAX_INFECTION, MAX_HUNGER, 
    FATIGUE_THRESHOLD, DAILY_HUNGER_LOSS 
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

// --- Logic Sections ---

const processStoryEvent = (
    currentStoryNodeId: string | null,
    forcedEvents: ForcedEvent[],
    characters: Character[],
    updates: CharacterUpdate[],
    globalLoot: string[]
) => {
    // 1. Determine Story Node
    const forcedStory = forcedEvents.find(e => e.type === 'STORY');
    let storyNode;
    let nextStoryNodeId: string | null = null;

    if (forcedStory && STORY_NODES[forcedStory.key]) {
        storyNode = STORY_NODES[forcedStory.key];
        nextStoryNodeId = forcedStory.key;
    } else {
        storyNode = getNextStoryNode(currentStoryNodeId);
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

    return { narrative, nextStoryNodeId };
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
            if (Math.random() < 0.05) {
                const livingTargets = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
                if (livingTargets.length > 0) {
                    const target = livingTargets[Math.floor(Math.random() * livingTargets.length)];
                    const ghostEvent = GHOST_EVENTS[Math.floor(Math.random() * GHOST_EVENTS.length)];
                    const result = ghostEvent(char.name, target.name);
                    events.push(result.text);
                    
                    const targetUpdate = getCharacterUpdate(updates, target.id);
                    applyEffectToUpdate(targetUpdate, result);
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
// New Function: Infection Crisis Vote Logic
// ----------------------------------------------------------------------
const processInfectionCrisis = (
    characters: Character[],
    updates: CharacterUpdate[],
    events: string[]
) => {
    const living = characters.filter(c => ['Alive', 'Infected'].includes(c.status));

    // Helper to calculate projected infection including today's changes
    const getProjectedInfection = (char: Character) => {
        const update = updates.find(u => u.id === char.id);
        return char.infection + (update?.infectionChange || 0);
    };

    for (const char of living) {
        const projectedInfection = getProjectedInfection(char);
        
        // 감염도가 100%에 도달했거나 넘어선 경우
        if (projectedInfection >= MAX_INFECTION) {
            const update = getCharacterUpdate(updates, char.id);
            // 이미 상태 변경이 예정되어 있다면(사망 등) 스킵
            if (update.status) continue; 

            const voters = living.filter(v => v.id !== char.id);
            
            // 1. 혼자인 경우: 자동 좀비화
            if (voters.length === 0) {
                events.push(`🧟 [감염] ${char.name}은(는) 고립된 채 고통 속에 몸부림치다 완전히 좀비로 변이했습니다.`);
                update.status = 'Zombie';
                continue;
            }

            // 2. 투표 진행
            events.push(`⚠️ [위기] ${char.name}의 감염도가 100%에 도달했습니다. 남은 생존자들은 ${char.name}의 처분을 두고 투표를 진행합니다.`);
            
            let keepScore = 0;
            let exileScore = 0;
            
            voters.forEach(voter => {
                let score = 0;
                const affinity = voter.relationships[char.id] || 0;
                const mbti = voter.mbti;
                
                // MBTI Bias
                if (mbti.includes('T')) score -= 2; // 이성적: 위험 요소 제거 (Exile)
                if (mbti.includes('F')) score += 2; // 감성적: 동료애 (Keep)
                
                // Affinity Bias
                if (affinity >= 50) score += 4;
                else if (affinity >= 10) score += 2;
                else if (affinity <= -20) score -= 3;
                else if (affinity <= -50) score -= 5;

                // Relationship Status Override (강력한 변수)
                const relStatus = voter.relationshipStatuses[char.id];
                if (['Lover', 'Spouse', 'Parent', 'Child', 'Sibling'].includes(relStatus || '')) {
                    score += 15; // 가족/연인은 무조건 살리려 함
                } else if (relStatus === 'Enemy' || relStatus === 'Rival') {
                    score -= 5;
                }

                if (score > 0) keepScore++;
                else exileScore++;
            });

            // 3. 결과 처리
            if (keepScore >= exileScore) {
                // Keep: Zombie but constrained
                events.push(`🗳️ 투표 결과 [보호 ${keepScore} : 포기 ${exileScore}] - 생존자들은 위험을 감수하고 ${char.name}을(를) 데리고 있기로 결정했습니다.`);
                events.push(`🧟 ${char.name}은(는) 좀비로 변했습니다. 밧줄로 묶었지만 입마개가 없어 매우 위험합니다! 인벤토리의 '입마개'를 사용하세요.`);
                update.status = 'Zombie';
                update.hasMuzzle = false; // 입마개 없음 (플레이어가 직접 채워야 함)
            } else {
                // Exile/Kill: Death
                events.push(`🗳️ 투표 결과 [보호 ${keepScore} : 포기 ${exileScore}] - 생존자들은 모두의 안전을 위해 ${char.name}을(를) 처리하기로 결정했습니다.`);
                events.push(`🔫 ${char.name}은(는) 인간으로서의 존엄을 지키며 동료들의 손에 최후를 맞이했습니다.`);
                update.status = 'Dead';
                update.hpChange = -9999; // 확실한 사망 처리
            }
        }
    }
};

const processInteractionPhase = (
    characters: Character[],
    forcedEvents: ForcedEvent[],
    settings: GameSettings,
    updates: CharacterUpdate[],
    events: string[]
) => {
    // Check status considering pending updates from Vote/Crisis
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

        // Logic for Event Selection
        if (actorStatus === 'Zombie' || targetStatus === 'Zombie') {
            const z = actorStatus === 'Zombie' ? actor : target;
            const h = actorStatus === 'Zombie' ? target : actor;
            
            // Check Muzzle update
            const zUpdate = updates.find(u => u.id === z.id);
            const hasMuzzle = zUpdate?.hasMuzzle !== undefined ? zUpdate.hasMuzzle : z.hasMuzzle;

            if (actorStatus === 'Zombie' && targetStatus === 'Zombie') continue; 
            
            if (hasMuzzle) {
               // 입마개가 있으면 얌전함
               const pool = INTERACTION_POOL['ZOMBIE_HUMAN'];
               interactionResult = pool[Math.floor(Math.random() * pool.length)](z.name, h.name);
            } else {
               // 입마개가 없으면 10% 확률로 공격
               if (Math.random() < 0.1) {
                   interactionResult = { 
                       text: `🩸 [위험] 입마개를 하지 않은 좀비 ${z.name}이(가) 본능을 이기지 못하고 ${h.name}을(를) 물어뜯었습니다!`,
                       targetHp: -20,
                       targetInfection: 20
                   };
               } else {
                   // 90% 확률로 일반 상호작용 (으르렁거리거나 멍하니 있음)
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
                    // Check Pure Love Mode
                    const actorHasPartner = hasPartner(actor);
                    const targetHasPartner = hasPartner(target);
                    if (settings.pureLoveMode && (actorHasPartner || targetHasPartner)) {
                        poolKey = 'POSITIVE'; // Fallback to friend event
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
                        // Check Pure Love Mode (Monogamy)
                        const actorHasPartner = hasPartner(actor);
                        const targetHasPartner = hasPartner(target);
                        
                        if (settings.pureLoveMode && (actorHasPartner || targetHasPartner)) {
                            // Block Confession -> Normal Interaction
                            // Maybe add a special text? For now, standard fallback.
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
    forcedEvents: ForcedEvent[]
): Promise<SimulationResult> => {
    const events: string[] = [];
    const updates: CharacterUpdate[] = [];
    const globalLoot: string[] = [];

    // Phase 1: Story
    const { narrative, nextStoryNodeId } = processStoryEvent(currentStoryNodeId, forcedEvents, characters, updates, globalLoot);

    // Phase 2: Individual Events
    processIndividualEvents(characters, forcedEvents, settings, updates, events);

    // Phase 2.5: Infection Crisis Vote (NEW)
    processInfectionCrisis(characters, updates, events);

    // Phase 3: Interactions
    processInteractionPhase(characters, forcedEvents, settings, updates, events);

    return {
        narrative,
        events,
        updates,
        loot: globalLoot,
        nextStoryNodeId
    };
};
