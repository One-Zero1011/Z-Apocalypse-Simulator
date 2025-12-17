
import { 
    Character, SimulationResult, CharacterUpdate, GameSettings, ForcedEvent, 
    RelationshipStatus, ActionEffect, BabyEventData, RelationshipUpdate, MBTI 
} from '../types';
import { 
    MAX_HP, MAX_SANITY, MAX_FATIGUE, MAX_INFECTION, MAX_HUNGER, 
    FATIGUE_THRESHOLD, DAILY_HUNGER_LOSS, PRODUCTION_JOBS
} from '../constants';
import { getNextStoryNode } from './events/globalEvents';
import { FATIGUE_EVENTS } from './events/fatigueEvents';
import { MBTI_SPECIFIC_ACTIONS, MBTI_EVENT_POOL, ANALYSTS, DIPLOMATS, SENTINELS } from './events/mbtiEvents';
import { 
    MENTAL_ILLNESS_ACTIONS, MENTAL_INTERACTIONS, LOVER_MENTAL_EVENTS 
} from './events/mentalEvents';
import { INTERACTION_POOL } from './events/interaction/index';
import { GHOST_EVENTS } from './events/ghostEvents';
import { getJobMbtiEvent, ALL_JOB_MBTI_EVENTS } from './events/jobEvents/index';
import { REST_EVENTS } from './events/restEvents';
import { STORY_NODES } from './events/storyNodes';

// --- Helpers ---

const getMBTIContext = (mbti: MBTI) => {
    if (ANALYSTS.includes(mbti)) return 'ANALYST';
    if (DIPLOMATS.includes(mbti)) return 'DIPLOMAT';
    if (SENTINELS.includes(mbti)) return 'SENTINEL';
    return 'EXPLORER';
};

const applyEffectToUpdate = (update: CharacterUpdate, effect: ActionEffect) => {
    if (effect.hp) update.hpChange = (update.hpChange || 0) + effect.hp;
    if (effect.sanity) update.sanityChange = (update.sanityChange || 0) + effect.sanity;
    if (effect.fatigue) update.fatigueChange = (update.fatigueChange || 0) + effect.fatigue;
    if (effect.infection) update.infectionChange = (update.infectionChange || 0) + effect.infection;
    if (effect.hunger) update.hungerChange = (update.hungerChange || 0) + effect.hunger;
    if (effect.kill) update.killCountChange = (update.killCountChange || 0) + effect.kill;
    if (effect.status) update.status = effect.status;
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

const sanitizeForMinors = (text: string, participants: Character[], settings: GameSettings): string => {
    if (!settings.restrictMinorAdultActions) return text;
    const minors = participants.filter(p => ['초등학생', '중학생', '고등학생'].includes(p.job));
    if (minors.length === 0) return text;
    let sanitized = text;
    sanitized = sanitized.replace(/술\s*한\s*병/g, "탄산음료 한 병");
    sanitized = sanitized.replace(/술을\s*마시며/g, "탄산음료를 마시며");
    sanitized = sanitized.replace(/술자리/g, "간식 파티");
    sanitized = sanitized.replace(/술\s*제조법/g, "음료 제조법");
    sanitized = sanitized.replace(/건배했습니다/g, "함께 웃었습니다");
    sanitized = sanitized.replace(/취해/g, "기분이 들떠");
    sanitized = sanitized.replace(/담배/g, "껌");
    sanitized = sanitized.replace(/흡연/g, "껌 씹기");
    return sanitized;
};

const generateEffectLog = (effect: ActionEffect, characters: Character[], targetId?: string): string => {
    const parts: string[] = [];
    if (effect.hp) parts.push(`❤️${effect.hp > 0 ? '+' : ''}${effect.hp}`);
    if (effect.sanity) parts.push(`🧠${effect.sanity > 0 ? '+' : ''}${effect.sanity}`);
    if (effect.fatigue) parts.push(`💤${effect.fatigue > 0 ? '+' : ''}${effect.fatigue}`);
    if (effect.infection) parts.push(`🦠${effect.infection > 0 ? '+' : ''}${effect.infection}`);
    if (effect.hunger) parts.push(`🍖${effect.hunger > 0 ? '+' : ''}${effect.hunger}`);
    if (effect.status && effect.status !== 'Alive') parts.push(`💀${effect.status}`);
    if (effect.actorHp) parts.push(`(나)❤️${effect.actorHp > 0 ? '+' : ''}${effect.actorHp}`);
    if (effect.targetHp) parts.push(`(상대)❤️${effect.targetHp > 0 ? '+' : ''}${effect.targetHp}`);
    if (effect.actorSanity) parts.push(`(나)🧠${effect.actorSanity > 0 ? '+' : ''}${effect.actorSanity}`);
    if (effect.targetSanity) parts.push(`(상대)🧠${effect.targetSanity > 0 ? '+' : ''}${effect.targetSanity}`);
    const affinityVal = effect.affinity || effect.affinityChange;
    if (affinityVal && targetId) {
        const target = characters.find(c => c.id === targetId);
        const targetName = target ? target.name : 'Unknown';
        parts.push(`💞 ${targetName} ${affinityVal > 0 ? '+' : ''}${affinityVal}`);
    }
    if (effect.loot && effect.loot.length > 0) parts.push(`📦${effect.loot.join(',')}`);
    if (parts.length === 0) return '';
    return ` (${parts.join(', ')})`;
};

const getJobLootEvent = (char: Character): ActionEffect => {
    const job = char.job || '';
    let loot: string[] = [];
    let text = "";
    if (["농부", "요리사", "사육사", "어부", "사냥꾼"].includes(job)) {
        const item = Math.random() > 0.5 ? '고기' : '통조림';
        loot = [item];
        text = `🎒 [직업: ${job}] ${char.name}은(는) 자신의 능력을 발휘하여 식량(${item})을 확보했습니다.`;
    } else if (["의사", "약사", "간호사", "수의사", "응급구조사"].includes(job)) {
        const item = Math.random() > 0.7 ? '항생제' : (Math.random() > 0.5 ? '붕대' : '비타민');
        loot = [item];
        text = `💊 [직업: ${job}] ${char.name}은(는) 폐허 속에서 쓸만한 의료품(${item})을 찾아냈습니다.`;
    } else if (["기술자(엔지니어)", "정비공", "배관공", "목수"].includes(job)) {
        const item = Math.random() > 0.6 ? '맥가이버 칼' : '붕대';
        loot = [item];
        text = `🔧 [직업: ${job}] ${char.name}은(는) 자재를 가공하여 ${item}을(를) 만들어냈습니다.`;
    } else if (["형사", "탐정", "기자", "도박사", "영업직", "노숙자"].includes(job)) {
        const items = ['초콜릿', '통조림', '비타민', '지도', '권총'];
        const item = items[Math.floor(Math.random() * items.length)];
        loot = [item];
        text = `🔎 [직업: ${job}] ${char.name}은(는) 예리한 감각으로 숨겨진 물자(${item})를 발견했습니다!`;
    } else {
        loot = ['통조림'];
        text = `🎒 [직업] ${char.name}은(는) 운 좋게 통조림을 주웠습니다.`;
    }
    return { text, loot, fatigue: 5 };
};

const getPlannedActionEffect = (char: Character): ActionEffect => {
    const actionId = char.plannedAction;
    const n = char.name;
    switch (actionId) {
        case 'rest': return { text: `💤 [명령: 휴식] ${n}은(는) 당신의 명령에 따라 하루 종일 충분한 휴식을 취하며 기력을 회복했습니다.`, hp: 15, fatigue: -35, sanity: 5 };
        case 'scavenge': return { text: `🎒 [명령: 수색] ${n}은(는) 위험을 무릅쓰고 주변을 샅샅이 뒤져 물자를 확보해 돌아왔습니다.`, loot: [Math.random() > 0.5 ? '통조림' : '붕대'], fatigue: 20, sanity: -2 };
        case 'fortify': return { text: `🛡️ [명령: 보수] ${n}은(는) 은신처 주변에 함정을 설치하고 벽을 보강하여 모두의 안전을 도모했습니다.`, sanity: 10, fatigue: 15 };
        case 'meditate': return { text: `🧘 [명령: 명상] ${n}은(는) 조용한 곳에서 명상을 하며 아포칼립스의 공포로부터 마음을 가다듬었습니다.`, sanity: 20, fatigue: 5 };
        case 'patrol': return { text: `⚔️ [명령: 섬멸] ${n}은(는) 무기를 꼬박 챙겨 주변의 좀비들을 적극적으로 소탕했습니다.`, kill: 2, fatigue: 25, hp: -5 };
        default: return { text: `${n}은(는) 계획했던 일을 수행하려 했으나 상황이 여의치 않았습니다.`, fatigue: 5 };
    }
};

const processMissingEvents = (characters: Character[], updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
    const missing = characters.filter(c => c.status === 'Missing');
    const living = characters.filter(c => c.status === 'Alive' || c.status === 'Infected');
    if (missing.length > 0) {
        for (const mChar of missing) {
            if (Math.random() < 0.05) {
                const update = getCharacterUpdate(updates, mChar.id);
                update.status = 'Alive'; update.hpChange = -20; update.sanityChange = -30;
                events.push(`🔦 [귀환] 실종되었던 ${mChar.name}이(가) 상처 입은 몸으로 기적적으로 은신처를 찾아 돌아왔습니다!`);
            }
        }
        if (living.length > 0) {
            for (const mChar of missing) {
                if (Math.random() < 0.03) {
                    const finder = living[Math.floor(Math.random() * living.length)];
                    const finderUpdate = getCharacterUpdate(updates, finder.id);
                    const relStatus = finder.relationshipStatuses[mChar.id];
                    const isClose = ['Lover', 'Spouse', 'Family', 'Parent', 'Child', 'Sibling', 'Guardian', 'Ward'].includes(relStatus || '');
                    if (isClose) {
                        events.push(`🎗️ [유품] ${finder.name}은(는) 수색 중 실종된 ${mChar.name}의 낡은 소지품을 발견했습니다. 그리움과 슬픔이 밀려옵니다.`);
                        finderUpdate.sanityChange = (finderUpdate.sanityChange || 0) - 15;
                    } else {
                        events.push(`🎒 [유품] ${finder.name}은(는) 실종된 ${mChar.name}이(가) 남긴 비상 배낭을 발견했습니다. 안에는 통조림이 들어있었습니다.`);
                        globalLoot.push('통조림');
                    }
                    break; 
                }
            }
        }
    }
};

const processStoryEvent = (currentStoryNodeId: string | null, forcedEvents: ForcedEvent[], characters: Character[], updates: CharacterUpdate[], globalLoot: string[], userSelectedNodeId?: string, settings?: GameSettings) => {
    const forcedStory = forcedEvents.find(e => e.type === 'STORY');
    let storyNode;
    let nextStoryNodeId: string | null = null;
    let consumedItems: string[] = [];
    let tarotEvent = false;

    if (forcedStory && STORY_NODES[forcedStory.key]) { storyNode = STORY_NODES[forcedStory.key]; } 
    else { storyNode = getNextStoryNode(currentStoryNodeId, userSelectedNodeId); }

    if (storyNode.id === 'tarot_start') {
        tarotEvent = true;
    }

    if (storyNode.next && storyNode.next.length > 0) { nextStoryNodeId = storyNode.id; } 
    else { nextStoryNodeId = null; }
    const livingChars = characters.filter(c => c.status === 'Alive' || c.status === 'Infected' || c.status === 'Zombie');
    let narrative = sanitizeForMinors(storyNode.text, livingChars, settings || { restrictMinorAdultActions: false } as GameSettings);
    if (storyNode.effect) {
        const effect = storyNode.effect;
        let targets: Character[] = [];
        const targetableChars = characters.filter(c => c.status === 'Alive' || c.status === 'Infected');
        if (effect.target === 'ALL') targets = targetableChars;
        else if (effect.target === 'RANDOM_1' && targetableChars.length > 0) targets = [targetableChars[Math.floor(Math.random() * targetableChars.length)]];
        else if (effect.target === 'RANDOM_HALF') {
            const shuffled = [...targetableChars].sort(() => 0.5 - Math.random());
            targets = shuffled.slice(0, Math.ceil(shuffled.length / 2));
        }
        targets.forEach(t => {
            const update = getCharacterUpdate(updates, t.id);
            const storyActionEffect: ActionEffect = { text: '', hp: effect.hp, sanity: effect.sanity, fatigue: effect.fatigue, infection: effect.infection, hunger: effect.hunger, kill: effect.kill, status: effect.status, inventoryRemove: effect.inventoryRemove };
            
            if (effect.affinity) {
                if (!update.relationshipUpdates) update.relationshipUpdates = [];
                targetableChars.filter(other => other.id !== t.id).forEach(other => {
                    update.relationshipUpdates!.push({ targetId: other.id, change: effect.affinity! });
                });
            }

            applyEffectToUpdate(update, storyActionEffect);
        });
        if (settings?.showEventEffects) {
            const effectSummary = generateEffectLog({ text: '', hp: effect.hp, sanity: effect.sanity, fatigue: effect.fatigue, infection: effect.infection, hunger: effect.hunger, loot: effect.loot, status: effect.status, affinity: effect.affinity }, characters);
            if (effectSummary) narrative += effectSummary;
        }
        if (effect.loot) globalLoot.push(...effect.loot);
        if (effect.inventoryRemove) consumedItems.push(...effect.inventoryRemove);
    }
    return { narrative, nextStoryNodeId, consumedItems, tarotEvent };
};

const processIndividualEvents = (characters: Character[], forcedEvents: ForcedEvent[], settings: GameSettings, updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
    for (const char of characters) {
        const update = getCharacterUpdate(updates, char.id);
        let action: ActionEffect | null = null; 
        
        if (char.status === 'Zombie') { 
            update.hungerChange = (update.hungerChange || 0) - DAILY_HUNGER_LOSS; 
            if (char.hunger <= 10) {
                update.hpChange = (update.hpChange || 0) - 5;
                if (char.hunger === 0) events.push(`💀 [굶주림] 좀비 ${char.name}이(가) 극심한 허기로 인해 신체가 썩어 문드러지고 있습니다.`);
            }
            continue; 
        }

        if (char.status === 'Dead' || char.status === 'Missing') {
            const forcedGhost = forcedEvents.find(e => e.type === 'SYSTEM' && e.key === 'GHOST' && e.actorId === char.id);
            if (forcedGhost && forcedGhost.targetId) {
                const target = characters.find(c => c.id === forcedGhost.targetId);
                if (target) {
                    const result = GHOST_EVENTS[forcedGhost.index || 0](char.name, target.name);
                    const tUpdate = getCharacterUpdate(updates, target.id);
                    applyEffectToUpdate(tUpdate, result);
                    events.push(sanitizeForMinors(result.text, [target], settings) + (settings.showEventEffects ? generateEffectLog(result, characters) : ''));
                }
            } else if (char.status === 'Dead') {
                const livingTargets = characters.filter(c => c.status === 'Alive' || c.status === 'Infected');
                const shuffledTargets = [...livingTargets].sort(() => 0.5 - Math.random());
                for (const target of shuffledTargets) {
                    const relStatus = char.relationshipStatuses[target.id];
                    const isDeepConnection = ['Lover', 'Spouse', 'Family', 'Parent', 'Child', 'Sibling', 'Guardian', 'Ward'].includes(relStatus || '');
                    if (Math.random() < (isDeepConnection ? 0.25 : 0.10)) {
                        const ghostEvent = GHOST_EVENTS[Math.floor(Math.random() * GHOST_EVENTS.length)];
                        const result = ghostEvent(char.name, target.name);
                        let eventText = sanitizeForMinors(result.text, [target], settings);
                        if (settings.showEventEffects) eventText += generateEffectLog(result, characters);
                        events.push(eventText);
                        const targetUpdate = getCharacterUpdate(updates, target.id);
                        if (result.loot && result.loot.length > 0) { globalLoot.push(...result.loot); const { loot, ...rest } = result; applyEffectToUpdate(targetUpdate, rest); } 
                        else { applyEffectToUpdate(targetUpdate, result); }
                        break;
                    }
                }
            }
            continue;
        }

        // --- Forced Logic Start ---
        const forcedJob = forcedEvents.find(e => e.type === 'JOB' && e.actorId === char.id);
        const forcedSys = forcedEvents.find(e => e.type === 'SYSTEM' && e.actorId === char.id);
        const forcedMbti = forcedEvents.find(e => e.type === 'MBTI' && e.actorId === char.id);

        if (char.plannedAction) { action = getPlannedActionEffect(char); update.plannedAction = null; } 
        else if (forcedJob) {
            const context = getMBTIContext(char.mbti);
            const pool = ALL_JOB_MBTI_EVENTS[forcedJob.key]?.[context];
            if (pool) {
                action = pool[forcedJob.index || 0](char.name);
                action.text = `💼 [직업] ${action.text}`;
            }
        }
        else if (forcedSys) {
            if (forcedSys.key === 'REST') action = REST_EVENTS[forcedSys.index || 0](char.name);
            if (forcedSys.key === 'FATIGUE') action = FATIGUE_EVENTS[forcedSys.index || 0](char.name);
            if (forcedSys.key === 'MENTAL') action = MENTAL_ILLNESS_ACTIONS[char.mentalState](char);
        }
        else if (forcedMbti) {
            const pool = MBTI_EVENT_POOL[char.mbti];
            const generator = pool[forcedMbti.index !== undefined ? forcedMbti.index : Math.floor(Math.random() * pool.length)];
            action = generator(char.name, char.gender === 'Male' ? '그' : char.gender === 'Female' ? '그녀' : '그들');
            action.text = `🧩 [${char.mbti}] ${action.text}`;
        }
        // --- Natural Logic Start ---
        else if (settings.useMentalStates && char.mentalState !== 'Normal' && Math.random() < 0.3) {
            action = MENTAL_ILLNESS_ACTIONS[char.mentalState](char);
        } else if (char.fatigue >= FATIGUE_THRESHOLD && Math.random() < 0.4) {
            action = FATIGUE_EVENTS[Math.floor(Math.random() * FATIGUE_EVENTS.length)](char.name);
        } else {
            const isProduction = PRODUCTION_JOBS.includes(char.job || '');
            const rand = Math.random();
            if (isProduction && rand < 0.3) { action = getJobLootEvent(char); } 
            else if (char.fatigue > 60 && rand < 0.3) { action = REST_EVENTS[Math.floor(Math.random() * REST_EVENTS.length)](char.name); } 
            else if (char.job && rand < 0.6) { action = getJobMbtiEvent(char.job, char.mbti, char.name); } 
            else { action = MBTI_SPECIFIC_ACTIONS[char.mbti](char.name, char.gender); }
        }

        if (action) {
            let eventText = sanitizeForMinors(action.text, [char], settings);
            if (settings.showEventEffects) eventText += generateEffectLog(action, characters);
            events.push(eventText);
            if (action.loot) globalLoot.push(...action.loot);
            applyEffectToUpdate(update, action);
        }
    }
};

const processInfectionCrisis = (characters: Character[], updates: CharacterUpdate[], events: string[]) => {
    const living = characters.filter(c => ['Alive', 'Infected'].includes(c.status));
    for (const char of living) {
        const projectedInfection = char.infection + (updates.find(u => u.id === char.id)?.infectionChange || 0);
        if (projectedInfection >= MAX_INFECTION) {
            const update = getCharacterUpdate(updates, char.id);
            if (update.status) continue;
            const voters = living.filter(v => v.id !== char.id);
            if (voters.length === 0) { events.push(`🧟 [감염] ${char.name}은(는) 고독하게 좀비로 변이했습니다.`); update.status = 'Zombie'; continue; }
            events.push(`⚠️ [위기] ${char.name}의 감염도가 100%입니다. 생존자들이 투표를 진행합니다.`);
            let keepScore = 0; voters.forEach(voter => {
                let score = 0; const affinity = voter.relationships[char.id] || 0;
                if (voter.mbti.includes('T')) score -= 2; if (voter.mbti.includes('F')) score += 2;
                if (affinity >= 50) score += 4; else if (affinity <= -20) score -= 3;
                const relStatus = voter.relationshipStatuses[char.id];
                if (['Lover', 'Spouse', 'Parent', 'Child', 'Sibling', 'Guardian', 'Ward'].includes(relStatus || '')) score += 15;
                if (score > 0) keepScore++;
            });
            if (keepScore >= voters.length / 2) { events.push(`🗳️ 투표 결과: 보호 결정. ${char.name}은(는) 속박된 좀비 상태가 되었습니다.`); update.status = 'Zombie'; update.hasMuzzle = false; } 
            else { events.push(`🗳️ 투표 결과: 포기 결정. ${char.name}은(는) 안락사 처리되었습니다.`); update.status = 'Dead'; update.hpChange = -9999; }
        }
    }
};

const processMarriageAndPregnancy = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings, forcedEvents: ForcedEvent[]): BabyEventData | null => {
    const forcedPreg = forcedEvents.find(e => e.type === 'SYSTEM' && e.key === 'PREGNANCY' && e.actorId && e.targetId);
    if (forcedPreg) {
        return { fatherId: forcedPreg.actorId, motherId: forcedPreg.targetId! };
    }

    if (settings.friendshipMode) return null;
    const living = characters.filter(c => ['Alive', 'Infected'].includes(c.status));
    const processedPairs = new Set<string>();
    let babyEvent: BabyEventData | null = null;
    for (const char of living) {
        for (const [pId, status] of Object.entries(char.relationshipStatuses)) {
            const partner = living.find(c => c.id === pId);
            if (!partner) continue;
            const pairKey = [char.id, partner.id].sort().join('-');
            if (processedPairs.has(pairKey)) continue; processedPairs.add(pairKey);
            if (status === 'Lover' && !['초등학생', '중학생'].includes(char.job || '') && !['초등학생', '중학생'].includes(partner.job || '')) {
                const duration = char.relationshipDurations[pId] || 0;
                const chance = Math.min(0.5, 0.01 + (duration * 0.005));
                if (Math.random() < chance) {
                    const uA = getCharacterUpdate(updates, char.id); const uB = getCharacterUpdate(updates, partner.id);
                    if (!uA.relationshipUpdates) uA.relationshipUpdates = []; if (!uB.relationshipUpdates) uB.relationshipUpdates = [];
                    uA.relationshipUpdates.push({ targetId: partner.id, change: 20, newStatus: 'Spouse' });
                    uB.relationshipUpdates.push({ targetId: char.id, change: 20, newStatus: 'Spouse' });
                    events.push(`💍 [결혼] ${char.name}와(과) ${partner.name}은(는) 부부가 되었습니다! (관계 지속 ${duration}일)`);
                    applyEffectToUpdate(uA, { text: '', sanity: 20 }); applyEffectToUpdate(uB, { text: '', sanity: 20 });
                }
            }
            if (status === 'Spouse' && !babyEvent && settings.enablePregnancy) {
                if ((char.gender === 'Male' && partner.gender === 'Female') || (char.gender === 'Female' && partner.gender === 'Male')) {
                    if (Math.random() < 0.05) babyEvent = { fatherId: char.gender === 'Male' ? char.id : partner.id, motherId: char.gender === 'Female' ? char.id : partner.id };
                }
            }
        }
    }
    return babyEvent;
};

const processRelationshipEvolution = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings) => {
    const living = characters.filter(c => ['Alive', 'Infected'].includes(c.status));
    const processedPairs = new Set<string>();
    
    for (const char of living) {
        for (const target of living) {
            if (char.id === target.id) continue;
            const pairKey = [char.id, target.id].sort().join('-');
            if (processedPairs.has(pairKey)) continue;
            processedPairs.add(pairKey);
            
            const charUpdate = updates.find(u => u.id === char.id);
            const targetUpdate = updates.find(u => u.id === target.id);
            
            const getAffinity = (c: Character, tId: string, u: CharacterUpdate | undefined) => {
                const base = c.relationships[tId] || 0;
                const change = u?.relationshipUpdates?.find(r => r.targetId === tId)?.change || 0;
                return base + change;
            };

            const affAtoB = getAffinity(char, target.id, charUpdate);
            const affBtoA = getAffinity(target, char.id, targetUpdate);
            const avgAffinity = (affAtoB + affBtoA) / 2;
            const currentStatus = char.relationshipStatuses[target.id] || 'None';

            if (!settings.friendshipMode && (currentStatus === 'Friend' || currentStatus === 'BestFriend' || currentStatus === 'None')) {
                const charJob = char.job || '';
                const targetJob = target.job || '';
                const isStudentA = ['초등학생', '중학생', '고등학생'].includes(charJob);
                const isStudentB = ['초등학생', '중학생', '고등학생'].includes(targetJob);
                
                let canDate = true;
                if (settings.restrictStudentDating) {
                    if (isStudentA !== isStudentB) canDate = false;
                }

                if (canDate && avgAffinity >= 75 && Math.random() < 0.15) {
                    const uA = getCharacterUpdate(updates, char.id); const uB = getCharacterUpdate(updates, target.id);
                    if (!uA.relationshipUpdates) uA.relationshipUpdates = []; if (!uB.relationshipUpdates) uB.relationshipUpdates = [];
                    
                    uA.relationshipUpdates.push({ targetId: target.id, change: 10, newStatus: 'Lover' });
                    uB.relationshipUpdates.push({ targetId: char.id, change: 10, newStatus: 'Lover' });
                    
                    const confessionPool = INTERACTION_POOL['CONFESSION'];
                    const confession = confessionPool[Math.floor(Math.random() * confessionPool.length)](char.name, target.name);
                    const confessionText = typeof confession === 'string' ? confession : confession.text;
                    events.push(`💖 [연인] ${confessionText}`);
                    continue; 
                }
            }

            if (currentStatus === 'Friend' && avgAffinity >= 80 && Math.random() < 0.2) {
                const uA = getCharacterUpdate(updates, char.id); const uB = getCharacterUpdate(updates, target.id);
                if (!uA.relationshipUpdates) uA.relationshipUpdates = []; if (!uB.relationshipUpdates) uB.relationshipUpdates = [];
                uA.relationshipUpdates.push({ targetId: target.id, change: 10, newStatus: 'BestFriend' });
                uB.relationshipUpdates.push({ targetId: char.id, change: 10, newStatus: 'BestFriend' });
                events.push(`🤞 [절친] ${char.name}와(과) ${target.name}은(는) 둘도 없는 단짝 친구가 되었습니다.`);
            }
            
            if (currentStatus === 'None' && avgAffinity <= -40 && Math.random() < 0.15) {
                const uA = getCharacterUpdate(updates, char.id); const uB = getCharacterUpdate(updates, target.id);
                if (!uA.relationshipUpdates) uA.relationshipUpdates = []; if (!uB.relationshipUpdates) uB.relationshipUpdates = [];
                uA.relationshipUpdates.push({ targetId: target.id, change: -5, newStatus: 'Rival' });
                uB.relationshipUpdates.push({ targetId: char.id, change: -5, newStatus: 'Rival' });
                events.push(`⚔️ [라이벌] ${char.name}와(과) ${target.name}은(는) 사사건건 부딪히며 경쟁 관계가 되었습니다.`);
            } else if (currentStatus === 'Rival' && avgAffinity <= -80 && Math.random() < 0.1) {
                const uA = getCharacterUpdate(updates, char.id); const uB = getCharacterUpdate(updates, target.id);
                if (!uA.relationshipUpdates) uA.relationshipUpdates = []; if (!uB.relationshipUpdates) uB.relationshipUpdates = [];
                uA.relationshipUpdates.push({ targetId: target.id, change: -10, newStatus: 'Enemy' });
                uB.relationshipUpdates.push({ targetId: char.id, change: -10, newStatus: 'Enemy' });
                events.push(`👿 [원수] ${char.name}와(과) ${target.name}은(는) 서로를 증오하며 원수가 되었습니다.`);
            }
        }
    }
};

const processInteractionPhase = (characters: Character[], forcedEvents: ForcedEvent[], settings: GameSettings, updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
    if (!settings.enableInteractions) return; 
    
    const getProjectedStatus = (c: Character) => updates.find(up => up.id === c.id)?.status || c.status;
    const living = characters.filter(c => { const s = getProjectedStatus(c); return s !== 'Dead' && s !== 'Missing'; });
    if (living.length < 2) return;

    const forcedInteractions = forcedEvents.filter(e => e.type === 'INTERACTION' && e.actorId && e.targetId);
    for (const fe of forcedInteractions) {
        const actor = characters.find(c => c.id === fe.actorId); const target = characters.find(c => c.id === fe.targetId);
        if (actor && target && INTERACTION_POOL[fe.key]?.[fe.index || 0]) {
            processInteractionResult(INTERACTION_POOL[fe.key][fe.index || 0](actor.name, target.name), actor, target, updates, events, settings);
        }
    }

    const numInteractions = Math.max(1, Math.floor(living.length / 2));
    for (let i = 0; i < numInteractions; i++) {
        // 상호작용 중간에 사망한 캐릭터가 있을 수 있으므로 현재 시점의 생존자만 필터링
        const currentLiving = living.filter(c => getProjectedStatus(c) !== 'Dead');
        if (currentLiving.length < 2) break;

        const actor = currentLiving[Math.floor(Math.random() * currentLiving.length)];
        let target = currentLiving[Math.floor(Math.random() * currentLiving.length)];
        while (target.id === actor.id) target = currentLiving[Math.floor(Math.random() * currentLiving.length)];
        
        if (forcedInteractions.some(fe => fe.actorId === actor.id && fe.targetId === target.id)) continue;

        const actorStatus = getProjectedStatus(actor); const targetStatus = getProjectedStatus(target);
        const relStatus = actor.relationshipStatuses[target.id] || 'None';
        let res: any = null;

        if (actorStatus === 'Zombie' || targetStatus === 'Zombie') {
            const z = actorStatus === 'Zombie' ? actor : target; const h = actorStatus === 'Zombie' ? target : actor;
            res = INTERACTION_POOL['ZOMBIE_HUMAN'][Math.floor(Math.random() * INTERACTION_POOL['ZOMBIE_HUMAN'].length)](z.name, h.name);
            const zUpdate = updates.find(u => u.id === z.id);
            if (!(zUpdate?.hasMuzzle ?? z.hasMuzzle) && Math.random() < 0.1) res = { text: `🩸 [위험] 입마개 없는 좀비 ${z.name}이(가) ${h.name}을(를) 물었습니다!`, targetHp: -20, targetInfection: 20 };
        } else if (settings.useMentalStates && actor.mentalState !== 'Normal' && Math.random() < 0.4) {
            const isDeepConnection = ['Lover', 'Spouse'].includes(relStatus);
            if (isDeepConnection && LOVER_MENTAL_EVENTS[actor.mentalState]) {
                const pool = LOVER_MENTAL_EVENTS[actor.mentalState];
                res = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
            } else {
                res = MENTAL_INTERACTIONS[Math.floor(Math.random() * MENTAL_INTERACTIONS.length)](actor.name, target.name);
            }
        } else {
            let poolKey = 'POSITIVE';
            if (actor.relationships[target.id] < -10) poolKey = 'NEGATIVE';
            else if (Math.random() > 0.5) poolKey = 'POSITIVE';
            else poolKey = 'NEGATIVE';

            if (relStatus === 'Lover') poolKey = 'LOVER';
            else if (relStatus === 'Spouse') poolKey = 'SPOUSE';
            else if (relStatus === 'Sibling') poolKey = 'SIBLING';
            else if (relStatus === 'Parent') poolKey = 'PARENT_TO_CHILD';
            else if (relStatus === 'Child') poolKey = 'CHILD_TO_PARENT';
            else if (relStatus === 'Guardian') poolKey = 'GUARDIAN_TO_WARD';
            else if (relStatus === 'Ward') poolKey = 'WARD_TO_GUARDIAN';
            else if (relStatus === 'BestFriend') poolKey = 'BEST_FRIEND';
            else if (relStatus === 'Colleague') poolKey = 'COLLEAGUE';
            else if (relStatus === 'Rival') poolKey = 'RIVAL';
            else if (relStatus === 'Enemy') poolKey = 'ENEMY';
            else if (relStatus === 'Savior') poolKey = 'SAVIOR';
            else if (relStatus === 'Ex') poolKey = 'EX_LOVER';
            else if (relStatus === 'Family') poolKey = 'FAMILY';
            else if (relStatus === 'Friend') poolKey = 'FRIEND';

            if (target.fatigue > 60 && Math.random() < 0.3) poolKey = 'FATIGUE_RELIEF';

            const pool = INTERACTION_POOL[poolKey] || INTERACTION_POOL['POSITIVE'];
            res = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
        }
        processInteractionResult(res, actor, target, updates, events, settings);
    }
};

function processInteractionResult(result: any, actor: Character, target: Character, updates: CharacterUpdate[], events: string[], settings: GameSettings) {
    if (!result) return;
    let text = typeof result === 'string' ? result : result.text;
    const effect = typeof result === 'string' ? {} : result;
    text = sanitizeForMinors(text, [actor, target], settings);
    if (settings?.showEventEffects) text += generateEffectLog(effect, [actor, target], target.id);
    events.push(text);
    const uA = getCharacterUpdate(updates, actor.id); const uB = getCharacterUpdate(updates, target.id);
    
    if (effect.actorHp) uA.hpChange = (uA.hpChange || 0) + effect.actorHp;
    if (effect.targetHp) uB.hpChange = (uB.hpChange || 0) + effect.targetHp;
    if (effect.actorSanity) uA.sanityChange = (uA.sanityChange || 0) + effect.actorSanity;
    if (effect.targetSanity) uB.sanityChange = (uB.sanityChange || 0) + effect.targetSanity;
    if (effect.actorFatigue) uA.fatigueChange = (uA.fatigueChange || 0) + effect.actorFatigue;
    if (effect.targetFatigue) uB.fatigueChange = (uB.fatigueChange || 0) + effect.targetFatigue;
    if (effect.targetInfection) uB.infectionChange = (uB.infectionChange || 0) + effect.targetInfection;

    const affinityVal = effect.affinity || effect.affinityChange;
    if (affinityVal) {
        if (!uA.relationshipUpdates) uA.relationshipUpdates = []; uA.relationshipUpdates.push({ targetId: target.id, change: affinityVal });
        if (!uB.relationshipUpdates) uB.relationshipUpdates = []; uB.relationshipUpdates.push({ targetId: actor.id, change: affinityVal });
    }
}

export const simulateDay = async (day: number, characters: Character[], currentStoryNodeId: string | null, settings: GameSettings, forcedEvents: ForcedEvent[], userSelectedNodeId?: string): Promise<SimulationResult> => {
    const events: string[] = []; const updates: CharacterUpdate[] = []; const globalLoot: string[] = [];
    const { narrative, nextStoryNodeId, consumedItems, tarotEvent } = processStoryEvent(currentStoryNodeId, forcedEvents, characters, updates, globalLoot, userSelectedNodeId, settings);
    processIndividualEvents(characters, forcedEvents, settings, updates, events, globalLoot);
    processInfectionCrisis(characters, updates, events);
    processMissingEvents(characters, updates, events, globalLoot);
    const babyEvent = processMarriageAndPregnancy(characters, updates, events, settings, forcedEvents);
    processInteractionPhase(characters, forcedEvents, settings, updates, events, globalLoot);
    processRelationshipEvolution(characters, updates, events, settings);
    
    const allConsumedItems = [...consumedItems];
    updates.forEach(u => { if (u.inventoryRemove) allConsumedItems.push(...u.inventoryRemove); });
    return { narrative, events, updates, loot: globalLoot, inventoryRemove: allConsumedItems, nextStoryNodeId, babyEvent, tarotEvent };
};
