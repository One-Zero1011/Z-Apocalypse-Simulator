
import { 
    Character, SimulationResult, CharacterUpdate, GameSettings, ForcedEvent, 
    RelationshipStatus, ActionEffect, BabyEventData, RelationshipUpdate, MBTI, Ending, MentalState 
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
import { INTERACTION_POOL, INTERACTION_TEMPLATES, CONFESSION_EVENTS, BREAKUP_EVENTS, REUNION_EVENTS } from './events/interaction/index';
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

const applyEffectToUpdate = (update: CharacterUpdate, effect: {
    hp?: number;
    sanity?: number;
    fatigue?: number;
    infection?: number;
    hunger?: number;
    kill?: number;
    status?: any;
    mentalState?: MentalState;
    inventoryRemove?: string[];
    statChanges?: Partial<any>;
    skillsAdd?: any[];
    skillsRemove?: string[];
}) => {
    if (effect.hp) update.hpChange = (update.hpChange || 0) + effect.hp;
    if (effect.sanity) update.sanityChange = (update.sanityChange || 0) + effect.sanity;
    if (effect.fatigue) update.fatigueChange = (update.fatigueChange || 0) + effect.fatigue;
    if (effect.infection) update.infectionChange = (update.infectionChange || 0) + effect.infection;
    if (effect.hunger) update.hungerChange = (update.hungerChange || 0) + effect.hunger;
    if (effect.kill) update.killCountChange = (update.killCountChange || 0) + effect.kill;
    if (effect.status) update.status = effect.status;
    if (effect.mentalState) update.mentalState = effect.mentalState;
    if (effect.inventoryRemove) update.inventoryRemove = [...(update.inventoryRemove || []), ...effect.inventoryRemove];
    
    // New fields
    if (effect.statChanges) update.statChanges = { ...(update.statChanges || {}), ...effect.statChanges };
    if (effect.skillsAdd) update.skillsAdd = [...(update.skillsAdd || []), ...effect.skillsAdd];
    if (effect.skillsRemove) update.skillsRemove = [...(update.skillsRemove || []), ...effect.skillsRemove];
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

/**
 * 이벤트 로그 뒤에 붙을 효과 수치 문자열을 생성합니다.
 * @param showResources true인 경우 HP, 정신력 등 자원 변화도 표시합니다. false여도 스킬/스탯은 항상 표시합니다.
 * @param targetName 대상 이름이 제공될 경우 로그 앞에 붙입니다.
 */
const generateEffectLog = (effect: ActionEffect, characters: Character[], showResources: boolean, targetId?: string, targetName?: string): string => {
    const resourceParts: string[] = [];
    const permanentParts: string[] = [];

    // --- 영구적 변화 (설정과 상관없이 항상 표시) ---
    if (effect.statChanges) {
        Object.entries(effect.statChanges).forEach(([stat, val]) => {
            permanentParts.push(`${stat.toUpperCase()}${val! > 0 ? '+' : ''}${val}`);
        });
    }
    if (effect.skillsAdd) effect.skillsAdd.forEach(s => permanentParts.push(`✨스킬습득:${s.name}`));
    if (effect.skillsRemove) effect.skillsRemove.forEach(s => permanentParts.push(`🚫스킬상실:${s}`));

    // --- 자원 변화 (설정에 따라 표시) ---
    if (showResources) {
        if (effect.hp) resourceParts.push(`❤️${effect.hp > 0 ? '+' : ''}${effect.hp}`);
        if (effect.sanity) resourceParts.push(`🧠${effect.sanity > 0 ? '+' : ''}${effect.sanity}`);
        if (effect.fatigue) resourceParts.push(`💤${effect.fatigue > 0 ? '+' : ''}${effect.fatigue}`);
        if (effect.infection) resourceParts.push(`🦠${effect.infection > 0 ? '+' : ''}${effect.infection}`);
        if (effect.hunger) resourceParts.push(`🍖${effect.hunger > 0 ? '+' : ''}${effect.hunger}`);
        if (effect.status && effect.status !== 'Alive') resourceParts.push(`💀${effect.status}`);
        
        if (effect.actorHp) resourceParts.push(`(나)❤️${effect.actorHp > 0 ? '+' : ''}${effect.actorHp}`);
        if (effect.targetHp) resourceParts.push(`(상대)❤️${effect.targetHp > 0 ? '+' : ''}${effect.targetHp}`);
        if (effect.actorSanity) resourceParts.push(`(나)🧠${effect.actorSanity > 0 ? '+' : ''}${effect.actorSanity}`);
        if (effect.targetSanity) resourceParts.push(`(상대)🧠${effect.targetSanity > 0 ? '+' : ''}${effect.targetSanity}`);
        
        const affinityVal = effect.affinity || effect.affinityChange;
        if (affinityVal && targetId) {
            const target = characters.find(c => c.id === targetId);
            const targetNameInRel = target ? target.name : 'Unknown';
            resourceParts.push(`💞 ${targetNameInRel} ${affinityVal > 0 ? '+' : ''}${affinityVal}`);
        }
        if (effect.loot && effect.loot.length > 0) resourceParts.push(`📦${effect.loot.join(',')}`);
    }

    const allParts = [...permanentParts, ...resourceParts];
    if (allParts.length === 0) return '';
    const prefix = targetName ? `${targetName}: ` : '';
    return ` [${prefix}${allParts.join(', ')}]`;
};

const checkEndings = (day: number, currentCharacters: Character[], updates: CharacterUpdate[]): Ending | null => {
    const virtualChars = currentCharacters.map(c => {
        const u = updates.find(up => up.id === c.id);
        const next = { ...c };
        if (u) {
            if (u.hpChange !== undefined) next.hp = Math.max(0, Math.min(next.maxHp || MAX_HP, next.hp + u.hpChange));
            if (u.sanityChange !== undefined) next.sanity = Math.max(0, Math.min(next.maxSanity || MAX_SANITY, next.sanity + u.sanityChange));
            if (u.status) next.status = u.status;
            if (u.infectionChange !== undefined) next.infection = Math.max(0, Math.min(MAX_INFECTION, next.infection + u.infectionChange));
            if (next.hp <= 0 && next.status !== 'Missing') next.status = 'Dead';
        }
        return next;
    });

    const living = virtualChars.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
    const totalCount = virtualChars.length;

    if (living.length === 0 && totalCount > 0) {
        return { id: 'end_extinction', title: '멸망 (Extinction)', description: '은신처는 고요해졌습니다. 더 이상 숨 쉬는 자는 없습니다. 인류의 흔적은 안개 속으로 사라졌습니다.', icon: '💀', type: 'BAD' };
    }

    if (day < 365) return null;

    if (living.length >= 2 && living.every(c => c.sanity < 20 || c.mentalState === 'Madness')) {
        return { id: 'end_madness', title: '절대적 광기 (Absolute Madness)', description: '살아남은 자들은 이제 좀비보다 더 예측할 수 없는 존재가 되었습니다. 누구도 진실을 말하지 않고, 누구도 믿지 않는 지옥도가 펼쳐집니다.', icon: '🎭', type: 'BAD' };
    }

    if (living.length > 0 && living.every(c => c.status === 'Zombie')) {
        return { id: 'end_zombie_kingdom', title: '좀비 낙원 (Zombie Kingdom)', description: '이성이 사라진 자리에 본능만이 남았습니다. 그들은 더 이상 서로를 해치지 않으며, 살아있는 자들을 찾아 대지를 횡단하는 거대한 군단이 되었습니다.', icon: '🧟‍♂️', type: 'NEUTRAL' };
    }

    if (living.length === 1) {
        const lone = living[0];
        if (lone.infection > 50) {
            return { id: 'end_silent_world', title: '침묵의 도시 (Silent World)', description: '마지막까지 버텨온 당신의 신체마저 서서히 변해갑니다. 텅 빈 도시의 마지막 기록은 여기서 멈춥니다.', icon: '🏙️', type: 'BAD' };
        }
    }

    if (living.length >= 3 && living.every(c => c.mentalState === 'Trauma')) {
        return { id: 'end_trauma', title: '트라우마 수용소 (Trauma Ward)', description: '생존은 성공했지만, 매일 밤 들려오는 죽은 이들의 비명이 멈추지 않습니다. 육체는 살아있되 영혼은 그날의 참극에 묶여버렸습니다.', icon: '🤯', type: 'NEUTRAL' };
    }

    if (living.length >= 2 && living.every(c => c.hp > 70 && c.sanity > 70)) {
        return { id: 'end_miracle', title: '기적의 생존자 (Miracle Survivors)', description: '최악의 환경 속에서도 당신들은 인간성을 잃지 않았습니다. 저 멀리서 구조 헬기의 프로펠러 소리가 들려옵니다. 마침내, 끝이 보입니다.', icon: '🚁', type: 'GOOD' };
    }

    let enemyCount = 0;
    living.forEach(c => {
        Object.values(c.relationshipStatuses).forEach(s => { if (s === 'Enemy' || s === 'Rival') enemyCount++; });
    });
    if (living.length >= 3 && enemyCount > living.length * 2) {
        return { id: 'end_civil_war', title: '내분 (Civil War)', description: '좀비보다 무서운 것은 곁에 있는 동료였습니다. 신뢰가 무너진 자리에 총성이 울려 퍼집니다. 은신처는 안쪽에서부터 붕괴되었습니다.', icon: '🔫', type: 'BAD' };
    }

    let loversCount = 0;
    living.forEach(c => {
        Object.values(c.relationshipStatuses).forEach(s => { if (s === 'Lover' || s === 'Spouse') loversCount++; });
    });
    if (living.length >= 4 && loversCount >= living.length) {
        return { id: 'end_oasis', title: '사랑의 도피처 (Oasis of Love)', description: '세상의 멸망도 그들의 유대를 끊지 못했습니다. 서로를 지키겠다는 강력한 의지가 이곳을 지옥 속의 작은 낙원으로 만들었습니다.', icon: '💖', type: 'GOOD' };
    }

    if (living.length >= 2 && living.every(c => c.infection > 80 && c.status !== 'Zombie')) {
        return { id: 'end_infection_age', title: '감염의 시대 (Age of Infection)', description: '모두가 잠재적인 괴물이 된 채 서로를 응시합니다. 썩어가는 육신을 부여잡고 인간으로서의 마지막 시간을 보내고 있습니다.', icon: '🦠', type: 'NEUTRAL' };
    }

    const avgHp = living.reduce((s, c) => s + c.hp, 0) / living.length;
    const avgSanity = living.reduce((s, c) => s + c.sanity, 0) / living.length;
    if (living.length >= 2 && avgHp < 30 && avgSanity > 60) {
        return { id: 'end_hope', title: '희망의 불씨 (Spark of Hope)', description: '육체는 한계에 도달해 비틀거리지만, 눈빛만은 형형하게 빛납니다. 당신들의 불굴의 의지는 후세에 전설로 남을 것입니다.', icon: '🔥', type: 'SPECIAL' };
    }

    return null;
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

const processStoryEvent = (currentStoryNodeId: string | null, forcedEvents: ForcedEvent[], characters: Character[], updates: CharacterUpdate[], globalLoot: string[], userSelectedNodeId: string | undefined, settings: GameSettings, dayEvents: string[]) => {
    const forcedStory = forcedEvents.find(e => e.type === 'STORY');
    const nextNode = getNextStoryNode(currentStoryNodeId, forcedStory?.key || userSelectedNodeId);
    
    if (!nextNode) {
        console.error(`Story Node Error: nextNode is undefined.`);
        return { 
            narrative: "⚠️ 이야기의 흐름이 끊겼습니다. (데이터 오류 발생)", 
            nextStoryNodeId: null, 
            consumedItems: [], 
            tarotEvent: false 
        };
    }

    let narrative = nextNode.text;
    const consumedItems: string[] = [];
    let tarotEvent = false;
    if (nextNode.id === 'tarot_start') tarotEvent = true;

    if (nextNode.effect) {
        const effect = nextNode.effect;
        const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
        let targets: Character[] = [];
        if (effect.target === 'ALL') targets = living;
        else if (effect.target === 'RANDOM_1' && living.length > 0) targets = [living[Math.floor(Math.random() * living.length)]];
        else if (effect.target === 'RANDOM_HALF') targets = living.sort(() => 0.5 - Math.random()).slice(0, Math.ceil(living.length / 2));

        targets.forEach(t => {
            const u = getCharacterUpdate(updates, t.id);
            applyEffectToUpdate(u, effect as any);
            
            // 영구적 변화(스킬/스탯)가 있는 경우 개별 로그 추가 (어떤 캐릭터가 변했는지 명시)
            // Fix: Cast StoryEffect to unknown before ActionEffect as per compiler requirement
            if (effect.statChanges || effect.skillsAdd || effect.skillsRemove) {
                const pLog = generateEffectLog(effect as unknown as ActionEffect, characters, false, t.id, t.name);
                if (pLog) dayEvents.push(`⚡ [성장/변화]${pLog}`);
            }
        });

        // 내러티브 뒤에 붙는 전체 요약 로그 (자원 변화 위주)
        const summaryLog = generateEffectLog(effect as unknown as ActionEffect, characters, settings.showEventEffects);
        if (summaryLog) narrative += summaryLog;

        if (effect.loot) globalLoot.push(...effect.loot);
        if (effect.inventoryRemove) consumedItems.push(...effect.inventoryRemove);
        if (effect.affinity) {
            living.forEach(c1 => {
                const u = getCharacterUpdate(updates, c1.id);
                u.relationshipUpdates = [...(u.relationshipUpdates || []), ...living.filter(c2 => c2.id !== c1.id).map(c2 => ({ targetId: c2.id, change: effect.affinity! }))];
            });
        }
    }
    return { narrative, nextStoryNodeId: nextNode.id, consumedItems, tarotEvent };
};

const processIndividualEvents = (characters: Character[], forcedEvents: ForcedEvent[], settings: GameSettings, updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
    const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
    living.forEach(char => {
        const u = getCharacterUpdate(updates, char.id);
        const forced = forcedEvents.find(e => e.actorId === char.id && (e.type === 'MBTI' || e.type === 'JOB' || e.type === 'SYSTEM'));
        
        if (forced) {
            let effect: ActionEffect | undefined;
            if (forced.type === 'MBTI') {
                const gen = MBTI_EVENT_POOL[forced.key as MBTI][forced.index || 0];
                effect = gen(char.name, char.gender === 'Male' ? '그' : '그녀');
                effect.text = `🧩 [${char.mbti}] ${effect.text}`;
            } else if (forced.type === 'JOB') {
                const jobEvents = ALL_JOB_MBTI_EVENTS[char.job];
                const group = getMBTIContext(char.mbti);
                const pool = jobEvents?.[group];
                if (pool) {
                    const gen = pool[forced.index || 0];
                    effect = gen(char.name);
                }
            } else if (forced.type === 'SYSTEM') {
                if (forced.key === 'REST') {
                    effect = REST_EVENTS[forced.index || 0](char.name);
                } else if (forced.key === 'FATIGUE') {
                    effect = FATIGUE_EVENTS[forced.index || 0](char.name);
                } else if (forced.key === 'MENTAL') {
                    if (char.mentalState !== 'Normal') {
                        effect = MENTAL_ILLNESS_ACTIONS[char.mentalState](char);
                    }
                }
            }

            if (effect) {
                const text = sanitizeForMinors(effect.text, [char], settings);
                // 개별 이벤트이므로 이미 이름이 텍스트에 포함되어 있음. targetName 생략.
                events.push(text + generateEffectLog(effect, characters, settings.showEventEffects, undefined, undefined));
                applyEffectToUpdate(u, effect);
                if (effect.loot) globalLoot.push(...effect.loot);
            }
            return;
        }

        if (char.plannedAction) {
            let effect: ActionEffect;
            switch(char.plannedAction) {
                case 'rest': effect = { text: `🛌 ${char.name}은(는) 집중 휴식을 취했습니다.`, hp: 15, fatigue: -35 }; break;
                case 'scavenge': effect = { text: `🎒 ${char.name}은(는) 목숨을 건 수색 끝에 물자를 확보했습니다.`, fatigue: 15, loot: ['통조림'] }; break;
                case 'fortify': effect = { text: `🛡️ ${char.name}은(는) 하루 종일 은신처를 보수했습니다.`, sanity: 5, fatigue: 15 }; break;
                case 'meditate': effect = { text: `🧘 ${char.name}은(는) 명상을 하며 정신을 가다듬었습니다.`, sanity: 20, fatigue: 5 }; break;
                case 'patrol': effect = { text: `⚔️ ${char.name}은(는) 적극적으로 주변 좀비를 소탕했습니다.`, kill: 3, fatigue: 25 }; break;
                default: effect = { text: `${char.name}은(는) 평소처럼 행동했습니다.`, fatigue: 5 };
            }
            events.push(effect.text + generateEffectLog(effect, characters, settings.showEventEffects, undefined, undefined));
            applyEffectToUpdate(u, effect);
            if (effect.loot) globalLoot.push(...effect.loot);
            u.plannedAction = null;
            return;
        }

        if (char.status === 'Zombie') {
            u.hungerChange = -DAILY_HUNGER_LOSS;
            if (char.hunger < 10) u.hpChange = (u.hpChange || 0) - 5;
            return;
        }

        if (char.fatigue >= FATIGUE_THRESHOLD && Math.random() < 0.4) {
            const effect = FATIGUE_EVENTS[Math.floor(Math.random() * FATIGUE_EVENTS.length)](char.name);
            events.push(effect.text + generateEffectLog(effect, characters, settings.showEventEffects, undefined, undefined));
            applyEffectToUpdate(u, effect);
            return;
        }

        if (settings.useMentalStates && char.mentalState !== 'Normal' && Math.random() < 0.3) {
            const effect = MENTAL_ILLNESS_ACTIONS[char.mentalState](char);
            events.push(effect.text + generateEffectLog(effect, characters, settings.showEventEffects, undefined, undefined));
            applyEffectToUpdate(u, effect);
            return;
        }

        if (char.fatigue >= 60 && Math.random() < 0.3) {
            const effect = REST_EVENTS[Math.floor(Math.random() * REST_EVENTS.length)](char.name);
            events.push(effect.text + generateEffectLog(effect, characters, settings.showEventEffects, undefined, undefined));
            applyEffectToUpdate(u, effect);
            return;
        }

        if (PRODUCTION_JOBS.includes(char.job) && Math.random() < 0.3) {
            const effect = getJobLootEvent(char);
            events.push(effect.text + generateEffectLog(effect, characters, settings.showEventEffects, undefined, undefined));
            applyEffectToUpdate(u, effect);
            if (effect.loot) globalLoot.push(...effect.loot);
            return;
        }

        if (Math.random() < 0.6) {
            const effect = getJobMbtiEvent(char.job, char.mbti, char.name);
            events.push(effect.text + generateEffectLog(effect, characters, settings.showEventEffects, undefined, undefined));
            applyEffectToUpdate(u, effect);
        } else {
            const effect = MBTI_SPECIFIC_ACTIONS[char.mbti](char.name, char.gender);
            events.push(effect.text + generateEffectLog(effect, characters, settings.showEventEffects, undefined, undefined));
            applyEffectToUpdate(u, effect);
        }
    });
};

const processInfectionCrisis = (characters: Character[], updates: CharacterUpdate[], events: string[]) => {
    characters.filter(c => c.status === 'Infected' || c.infection > 0).forEach(char => {
        const u = getCharacterUpdate(updates, char.id);
        if (char.status !== 'Zombie') {
            u.infectionChange = (u.infectionChange || 0) + 2;
            if (char.infection + (u.infectionChange || 0) >= MAX_INFECTION) {
                let voteScore = characters.filter(c => c.id !== char.id && c.status !== 'Dead' && c.status !== 'Missing').reduce((acc, c) => {
                    let score = c.mbti.includes('F') ? 2 : -2;
                    if ((c.relationships[char.id] || 0) >= 50) score += 4;
                    if ((c.relationships[char.id] || 0) <= -20) score -= 3;
                    if (['Lover', 'Spouse', 'Parent', 'Child', 'Sibling'].includes(c.relationshipStatuses[char.id] || '')) score += 15;
                    return acc + score;
                }, 0);
                if (voteScore > 0) {
                    events.push(`🗳️ [투표] ${char.name}의 감염이 한계에 도달했습니다. 생존자들은 그를 죽이는 대신 속박하여 함께하기로 결정했습니다.`);
                    u.status = 'Zombie';
                } else {
                    events.push(`💀 [최후] ${char.name}은(는) 결국 좀비로 변했습니다. 생존자들은 눈물을 머금고 그의 안식을 찾아주었습니다.`);
                    u.status = 'Dead';
                }
            }
        }
    });
};

const processMissingEvents = (characters: Character[], updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
    characters.filter(c => c.status === 'Missing').forEach(char => {
        const u = getCharacterUpdate(updates, char.id);
        const r = Math.random();
        if (r < 0.05) {
            events.push(`🚶 [귀환] 실종되었던 ${char.name}이(가) 상처투성이인 채로 돌아왔습니다!`);
            u.status = 'Alive'; u.hpChange = -30; u.sanityChange = -20;
        } else if (r < 0.08) {
            events.push(`💀 [사망] ${char.name}의 찢겨진 소지품이 발견되었습니다. 그는 돌아오지 못할 것입니다.`);
            u.status = 'Dead';
        }
    });
};

const processMarriageAndPregnancy = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings, forcedEvents: ForcedEvent[]): BabyEventData | null => {
    if (!settings.enablePregnancy) return null;
    let babyEvent: BabyEventData | null = null;
    const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing' && c.status !== 'Zombie');
    living.forEach(c1 => {
        Object.entries(c1.relationshipStatuses).forEach(([id, status]) => {
            if (status === 'Lover' && c1.id < id) {
                const c2 = living.find(h => h.id === id);
                if (!c2) return;
                const duration = c1.relationshipDurations[c2.id] || 0;
                if (Math.random() < 0.01 + (duration * 0.005)) {
                    const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                    u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 10, newStatus: 'Spouse' }];
                    u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 10, newStatus: 'Spouse' }];
                    events.push(`💍 [결혼] ${c1.name}와(과) ${c2.name}은(는) 부부가 되기로 맹세했습니다.`);
                }
            }
        });
    });
    
    // 자연 임신 발생 (첫 번째 발생한 것만 처리)
    for (const c1 of living) {
        for (const [id, status] of Object.entries(c1.relationshipStatuses)) {
            if (status === 'Spouse' && c1.id < id && !babyEvent && Math.random() < (settings.pregnancyChance / 100)) {
                const c2 = living.find(h => h.id === id);
                if (c2) {
                    events.push(`🤰 [임신] ${c1.name}와(과) ${c2.name} 부부에게 축복이 찾아왔습니다!`);
                    babyEvent = { fatherId: c1.id, motherId: id };
                }
            }
        }
    }

    // 개발자 도구 강제 임신 (자연 발생보다 우선순위 높음)
    const forced = forcedEvents.find(e => e.type === 'SYSTEM' && e.key === 'PREGNANCY');
    if (forced?.actorId && forced?.targetId) {
        babyEvent = { fatherId: forced.actorId, motherId: forced.targetId };
    }
    
    return babyEvent;
};

const processInteractionPhase = (characters: Character[], forcedEvents: ForcedEvent[], settings: GameSettings, updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
    if (!settings.enableInteractions) return;
    const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
    if (living.length < 1) return;

    const dead = characters.filter(c => c.status === 'Dead');
    const forcedGhost = forcedEvents.find(e => e.type === 'SYSTEM' && e.key === 'GHOST');
    
    if (forcedGhost && forcedGhost.actorId && forcedGhost.targetId) {
        const deadName = characters.find(c => c.id === forcedGhost.actorId)?.name || "망자";
        const livingChar = living.find(c => c.id === forcedGhost.targetId);
        if (livingChar) {
            const effect = GHOST_EVENTS[forcedGhost.index || 0](deadName, livingChar.name);
            applyEffectToUpdate(getCharacterUpdate(updates, livingChar.id), effect);
            events.push(effect.text + generateEffectLog(effect, characters, settings.showEventEffects, undefined, undefined));
        }
    } else {
        dead.forEach(d => {
            living.forEach(l => {
                if (Math.random() < ((l.relationships[d.id] || 0) > 50 ? 0.25 : 0.1)) {
                    const effect = GHOST_EVENTS[Math.floor(Math.random() * GHOST_EVENTS.length)](d.name, l.name);
                    applyEffectToUpdate(getCharacterUpdate(updates, l.id), effect);
                    events.push(effect.text + generateEffectLog(effect, characters, settings.showEventEffects, undefined, undefined));
                }
            });
        });
    }

    if (living.length < 2) return;

    living.forEach(actor => {
        const forcedInt = forcedEvents.find(e => e.actorId === actor.id && e.type === 'INTERACTION');
        const others = living.filter(c => c.id !== actor.id);
        if (others.length === 0) return;

        if (forcedInt || Math.random() < 0.5) {
            let target: Character | undefined;
            if (forcedInt?.targetId) {
                target = others.find(o => o.id === forcedInt.targetId);
            } else {
                target = others[Math.floor(Math.random() * others.length)];
            }

            if (!target) return;

            const uA = getCharacterUpdate(updates, actor.id); const uT = getCharacterUpdate(updates, target.id);
            let effect: any;

            if (forcedInt) {
                const pool = INTERACTION_POOL[forcedInt.key];
                if (pool) {
                    effect = pool[forcedInt.index || 0](actor.name, target.name);
                }
            } else if (actor.status === 'Zombie') {
                if (actor.hasMuzzle) effect = INTERACTION_POOL['ZOMBIE_HUMAN'][Math.floor(Math.random() * INTERACTION_POOL['ZOMBIE_HUMAN'].length)](actor.name, target.name);
                else if (Math.random() < 0.1) effect = { text: `🧟 ${actor.name}은(는) ${target.name}을(를) 물어뜯었습니다!`, targetHp: -25, targetInfection: 30, affinity: -50 };
                else effect = INTERACTION_POOL['ZOMBIE_HUMAN'][Math.floor(Math.random() * INTERACTION_POOL['ZOMBIE_HUMAN'].length)](actor.name, target.name);
            } else if (actor.mentalState !== 'Normal' && Math.random() < 0.4) {
                const relStatus = actor.relationshipStatuses[target.id];
                const isLover = relStatus === 'Lover' || relStatus === 'Spouse';
                
                if (isLover && LOVER_MENTAL_EVENTS[actor.mentalState]) {
                    const pool = LOVER_MENTAL_EVENTS[actor.mentalState];
                    effect = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
                } else {
                    effect = MENTAL_INTERACTIONS[Math.floor(Math.random() * MENTAL_INTERACTIONS.length)](actor.name, target.name);
                }
            } else {
                const rel = actor.relationshipStatuses[target.id] || 'None';
                const affinity = actor.relationships[target.id] || 0;
                
                if (target.fatigue >= 60 && affinity >= 30 && Math.random() < 0.4) {
                    const pool = INTERACTION_POOL['FATIGUE_RELIEF'];
                    effect = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
                } else {
                    let pool;
                    if (rel === 'None') {
                        if (affinity < -20) pool = INTERACTION_TEMPLATES.NEGATIVE;
                        else if (affinity > 20) pool = INTERACTION_TEMPLATES.POSITIVE;
                        else pool = Math.random() > 0.5 ? INTERACTION_TEMPLATES.POSITIVE : INTERACTION_TEMPLATES.NEGATIVE;
                    } else {
                        pool = INTERACTION_POOL[rel];
                    }
                    
                    if (!pool) pool = INTERACTION_TEMPLATES.POSITIVE;
                    effect = pool[Math.floor(Math.random() * pool.length)](actor.name, target.name);
                }
            }

            if (effect) {
                events.push(sanitizeForMinors(effect.text, [actor, target], settings) + generateEffectLog(effect, characters, settings.showEventEffects, target.id, undefined));
                if (effect.affinity) {
                    uA.relationshipUpdates = [...(uA.relationshipUpdates || []), { targetId: target.id, change: effect.affinity }];
                    uT.relationshipUpdates = [...(uT.relationshipUpdates || []), { targetId: actor.id, change: effect.affinity }];
                }
                if (effect.actorHp) uA.hpChange = (uA.hpChange || 0) + effect.actorHp;
                if (effect.targetHp) uT.hpChange = (uT.hpChange || 0) + effect.targetHp;
                if (effect.actorSanity) uA.sanityChange = (uA.sanityChange || 0) + effect.actorSanity;
                if (effect.targetSanity) uT.sanityChange = (uT.sanityChange || 0) + effect.targetSanity;
                if (effect.actorFatigue) uA.fatigueChange = (uA.fatigueChange || 0) + effect.actorFatigue;
                if (effect.targetFatigue) uT.fatigueChange = (uT.fatigueChange || 0) + effect.targetFatigue;
                if (effect.targetInfection) uT.infectionChange = (uT.infectionChange || 0) + effect.targetInfection;
            }
        }
    });
};

const processRelationshipEvolution = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings) => {
    if (settings.friendshipMode) return;

    const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing' && c.status !== 'Zombie');

    // 순애 모드용 도우미: 살아있는 파트너가 있거나, 오늘 이미 파트너가 생겼는지 확인
    const hasActivePartner = (c: Character) => {
        // 1. 기존 파트너(살아있는 경우)가 있는지 확인
        const existingPartner = Object.entries(c.relationshipStatuses).some(([id, status]) => 
            (status === 'Lover' || status === 'Spouse') && 
            living.some(l => l.id === id)
        );
        if (existingPartner) return true;

        // 2. 오늘 시뮬레이션 중에 이미 파트너가 생겼는지 확인 (updates 배열 체크)
        const pendingPartner = updates.some(u => 
            u.id === c.id && 
            u.relationshipUpdates?.some(ru => ru.newStatus === 'Lover' || ru.newStatus === 'Spouse')
        );
        return pendingPartner;
    };

    living.forEach(c1 => {
        living.forEach(c2 => {
            if (c1.id >= c2.id) return;

            const currentStatus = c1.relationshipStatuses[c2.id] || 'None';
            const affinity = c1.relationships[c2.id] || 0;
            
            const canBeLover = ['None', 'Friend', 'BestFriend', 'Colleague', 'Savior', 'Rival'].includes(currentStatus);
            if (canBeLover) {
                // 성별 기반 허용 여부 체크
                const isSameSex = c1.gender === c2.gender;
                if (isSameSex && !settings.allowSameSexCouples) return;
                if (!isSameSex && !settings.allowOppositeSexCouples) return;

                const students = ['초등학생', '중학생', '고등학생'];
                const isC1Student = students.includes(c1.job);
                const isC2Student = students.includes(c2.job);
                
                // 순애 모드 체크: 이미 살아있는 파트너가 있다면 새로운 연인이 될 수 없음
                if (settings.pureLoveMode && (hasActivePartner(c1) || hasActivePartner(c2))) return;

                if (settings.restrictStudentDating && (isC1Student !== isC2Student)) {
                } else if (affinity >= 75 && Math.random() < 0.15) {
                    const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                    
                    const eventGen = CONFESSION_EVENTS[Math.floor(Math.random() * CONFESSION_EVENTS.length)];
                    const result = eventGen(c1.name, c2.name);
                    const text = typeof result === 'string' ? result : result.text;
                    const cleanText = sanitizeForMinors(text, [c1, c2], settings);

                    u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 5, newStatus: 'Lover' }];
                    u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 5, newStatus: 'Lover' }];
                    
                    if (typeof result !== 'string') {
                         if (result.actorSanity) u1.sanityChange = (u1.sanityChange || 0) + result.actorSanity;
                         if (result.targetSanity) u2.sanityChange = (u2.sanityChange || 0) + result.targetSanity;
                         if (result.actorHp) u1.hpChange = (u1.hpChange || 0) + result.actorHp;
                    }

                    events.push(`💘 [고백] ${cleanText}`);
                }
            }
            else if (['Lover', 'Spouse'].includes(currentStatus)) {
                if (affinity < 30 && Math.random() < 0.2) {
                    const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                    
                    const eventGen = BREAKUP_EVENTS[Math.floor(Math.random() * BREAKUP_EVENTS.length)];
                    const result = eventGen(c1.name, c2.name);
                    const text = typeof result === 'string' ? result : result.text;
                    const cleanText = sanitizeForMinors(text, [c1, c2], settings);

                    u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: -10, newStatus: 'Ex' }];
                    u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: -10, newStatus: 'Ex' }];

                    if (typeof result !== 'string') {
                         if (result.actorSanity) u1.sanityChange = (u1.sanityChange || 0) + result.actorSanity;
                         if (result.targetSanity) u2.sanityChange = (u2.sanityChange || 0) + result.targetSanity;
                    }

                    events.push(`💔 [이별] ${cleanText}`);
                }
            }
            else if (currentStatus === 'Ex') {
                // 순애 모드 체크: 이미 살아있는 파트너가 있다면 재결합할 수 없음
                if (settings.pureLoveMode && (hasActivePartner(c1) || hasActivePartner(c2))) return;

                if (affinity >= 70 && Math.random() < 0.1) {
                    const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                    
                    const eventGen = REUNION_EVENTS[Math.floor(Math.random() * REUNION_EVENTS.length)];
                    const result = eventGen(c1.name, c2.name);
                    const text = typeof result === 'string' ? result : result.text;
                    const cleanText = sanitizeForMinors(text, [c1, c2], settings);

                    u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 10, newStatus: 'Lover' }];
                    u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 10, newStatus: 'Lover' }];

                    if (typeof result !== 'string') {
                         if (result.actorSanity) u1.sanityChange = (u1.sanityChange || 0) + result.actorSanity;
                         if (result.targetSanity) u2.sanityChange = (u2.sanityChange || 0) + result.targetSanity;
                    }

                    events.push(`💞 [재결합] ${cleanText}`);
                }
            }

            if (['Friend', 'None', 'Colleague'].includes(currentStatus) && affinity >= 80 && Math.random() < 0.1) {
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 5, newStatus: 'BestFriend' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 5, newStatus: 'BestFriend' }];
                events.push(`🤝 [절친] ${c1.name}와(과) ${c2.name}은(는) 둘도 없는 단짝이 되었습니다.`);
            }

            if (!['Enemy', 'Rival'].includes(currentStatus) && affinity <= -50 && Math.random() < 0.1) {
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: -5, newStatus: 'Enemy' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: -5, newStatus: 'Enemy' }];
                events.push(`⚔️ [원수] ${c1.name}와(과) ${c2.name}은(는) 서로를 증오하게 되었습니다.`);
            }
            
            if (currentStatus !== 'Rival' && affinity <= -20 && affinity > -50 && Math.random() < 0.05) {
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 0, newStatus: 'Rival' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 0, newStatus: 'Rival' }];
                events.push(`🔥 [라이벌] ${c1.name}와(과) ${c2.name}은(는) 경쟁 의식을 불태우기 시작했습니다.`);
            }

            const isMinor1 = ['아기', '초등학생', '중학생', '고등학생'].includes(c1.job);
            const isMinor2 = ['아기', '초등학생', '중학생', '고등학생'].includes(c2.job);
            
            if (['None', 'Friend'].includes(currentStatus) && affinity >= 60) {
                if (!isMinor1 && isMinor2 && Math.random() < 0.05) {
                     const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                     u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 10, newStatus: 'Guardian' }];
                     u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 10, newStatus: 'Ward' }];
                     events.push(`🛡️ [보호] ${c1.name}은(는) ${c2.name}의 든든한 보호자가 되기로 결심했습니다.`);
                }
                else if (isMinor1 && !isMinor2 && Math.random() < 0.05) {
                     const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                     u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 10, newStatus: 'Ward' }];
                     u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 10, newStatus: 'Guardian' }];
                     events.push(`🛡️ [보호] ${c2.name}은(는) ${c1.name}의 든든한 보호자가 되기로 결심했습니다.`);
                }
            }

            if (['None', 'Friend', 'Colleague'].includes(currentStatus) && affinity >= 85 && Math.random() < 0.03) {
                 const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                 u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 5, newStatus: 'Savior' }];
                 u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 5, newStatus: 'Savior' }];
                 events.push(`🦸 [은인] ${c1.name}와(과) ${c2.name}은(는) 위기의 순간 서로를 구해준 생명의 은인이 되었습니다.`);
            }
        });
    });
};

export const simulateDay = async (day: number, characters: Character[], currentStoryNodeId: string | null, settings: GameSettings, forcedEvents: ForcedEvent[], userSelectedNodeId?: string): Promise<SimulationResult> => {
    const events: string[] = []; const updates: CharacterUpdate[] = []; const globalLoot: string[] = [];
    const { narrative, nextStoryNodeId, consumedItems, tarotEvent } = processStoryEvent(currentStoryNodeId, forcedEvents, characters, updates, globalLoot, userSelectedNodeId, settings, events);
    processIndividualEvents(characters, forcedEvents, settings, updates, events, globalLoot);
    processInfectionCrisis(characters, updates, events);
    processMissingEvents(characters, updates, events, globalLoot);
    const babyEvent = processMarriageAndPregnancy(characters, updates, events, settings, forcedEvents);
    processInteractionPhase(characters, forcedEvents, settings, updates, events, globalLoot);
    processRelationshipEvolution(characters, updates, events, settings);
    
    let ending: Ending | null = null;
    if (settings.enableEndings) {
        ending = checkEndings(day, characters, updates);
    }

    const allConsumedItems = [...consumedItems];
    updates.forEach(u => { if (u.inventoryRemove) allConsumedItems.push(...u.inventoryRemove); });
    return { narrative, events, updates, loot: globalLoot, inventoryRemove: allConsumedItems, nextStoryNodeId, babyEvent, tarotEvent, ending };
};
