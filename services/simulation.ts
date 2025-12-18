
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
    const minors = participants.filter(p => ['초등학생', '중학생', '고등학생', '아기'].includes(p.job));
    if (minors.length === 0) return text;
    let sanitized = text;
    sanitized = sanitized.replace(/술\s*한\s*병/g, "탄산음료 한 병").replace(/술을\s*마시며/g, "탄산음료를 마시며").replace(/술자리/g, "간식 파티").replace(/건배했습니다/g, "함께 웃었습니다").replace(/취해/g, "기분이 들떠").replace(/담배/g, "껌").replace(/흡연/g, "껌 씹기");
    return sanitized;
};

const generateEffectLog = (effect: ActionEffect, characters: Character[], showResources: boolean, targetId?: string, targetName?: string): string => {
    const resourceParts: string[] = [];
    const permanentParts: string[] = [];
    if (effect.statChanges) Object.entries(effect.statChanges).forEach(([stat, val]) => permanentParts.push(`${stat.toUpperCase()}${val! > 0 ? '+' : ''}${val}`));
    if (effect.skillsAdd) effect.skillsAdd.forEach(s => permanentParts.push(`✨스킬:${s.name}`));
    if (effect.skillsRemove) effect.skillsRemove.forEach(s => permanentParts.push(`🚫상실:${s}`));
    if (showResources) {
        if (effect.hp) resourceParts.push(`❤️${effect.hp > 0 ? '+' : ''}${effect.hp}`);
        if (effect.sanity) resourceParts.push(`🧠${effect.sanity > 0 ? '+' : ''}${effect.sanity}`);
        if (effect.fatigue) resourceParts.push(`💤${effect.fatigue > 0 ? '+' : ''}${effect.fatigue}`);
        if (effect.infection) resourceParts.push(`🦠${effect.infection > 0 ? '+' : ''}${effect.infection}`);
        if (effect.hunger) resourceParts.push(`🍖${effect.hunger > 0 ? '+' : ''}${effect.hunger}`);
        if (effect.actorHp) resourceParts.push(`(나)❤️${effect.actorHp > 0 ? '+' : ''}${effect.actorHp}`);
        if (effect.targetHp) resourceParts.push(`(상대)❤️${effect.targetHp > 0 ? '+' : ''}${effect.targetHp}`);
        const affinityVal = effect.affinity || effect.affinityChange;
        if (affinityVal && targetId) {
            const target = characters.find(c => c.id === targetId);
            resourceParts.push(`💞 ${target?.name || '??'} ${affinityVal > 0 ? '+' : ''}${affinityVal}`);
        }
    }
    const allParts = [...permanentParts, ...resourceParts];
    if (allParts.length === 0) return '';
    return ` [${targetName ? `${targetName}: ` : ''}${allParts.join(', ')}]`;
};

const processRelationshipEvolution = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings) => {
    if (settings.friendshipMode) return;
    const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing' && c.status !== 'Zombie');

    const hasActivePartner = (c: Character) => {
        const existingPartner = Object.entries(c.relationshipStatuses).some(([id, status]) => (status === 'Lover' || status === 'Spouse') && living.some(l => l.id === id));
        if (existingPartner) return true;
        return updates.some(u => u.id === c.id && u.relationshipUpdates?.some(ru => ru.newStatus === 'Lover' || ru.newStatus === 'Spouse'));
    };

    living.forEach(c1 => {
        living.forEach(c2 => {
            if (c1.id >= c2.id) return;
            const currentStatus = c1.relationshipStatuses[c2.id] || 'None';
            const affinity = c1.relationships[c2.id] || 0;
            const isFamily = ['Parent', 'Child', 'Sibling', 'Family', 'Guardian', 'Ward'].includes(currentStatus);
            if (!settings.allowIncest && isFamily) return;

            const isSameSex = c1.gender === c2.gender;
            if (isSameSex && !settings.allowSameSexCouples) return;
            if (!isSameSex && !settings.allowOppositeSexCouples) return;

            const isC1Student = ['초등학생', '중학생', '고등학생'].includes(c1.job);
            const isC2Student = ['초등학생', '중학생', '고등학생'].includes(c2.job);
            if (settings.restrictStudentDating && (isC1Student !== isC2Student)) return;

            if (currentStatus !== 'Lover' && currentStatus !== 'Spouse' && affinity >= 75 && Math.random() < 0.15) {
                if (settings.pureLoveMode && (hasActivePartner(c1) || hasActivePartner(c2))) return;
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                const result = CONFESSION_EVENTS[Math.floor(Math.random() * CONFESSION_EVENTS.length)](c1.name, c2.name);
                const text = typeof result === 'string' ? result : result.text;
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 10, newStatus: 'Lover' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 10, newStatus: 'Lover' }];
                events.push(`💘 [고백] ${sanitizeForMinors(text, [c1, c2], settings)}`);
            }
            else if ((currentStatus === 'Lover' || currentStatus === 'Spouse') && affinity < 20 && Math.random() < 0.1) {
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                const result = BREAKUP_EVENTS[Math.floor(Math.random() * BREAKUP_EVENTS.length)](c1.name, c2.name);
                const text = typeof result === 'string' ? result : result.text;
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: -15, newStatus: 'Ex' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: -15, newStatus: 'Ex' }];
                events.push(`💔 [이별] ${sanitizeForMinors(text, [c1, c2], settings)}`);
            }
        });
    });
};

const processInteractionPhase = (characters: Character[], forcedEvents: ForcedEvent[], settings: GameSettings, updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
    const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
    if (living.length < 2) return;
    
    const shuffled = [...living].sort(() => 0.5 - Math.random());
    for (let i = 0; i < shuffled.length - 1; i += 2) {
        const a = shuffled[i]; const b = shuffled[i+1];
        const uA = getCharacterUpdate(updates, a.id); const uB = getCharacterUpdate(updates, b.id);
        
        // 1. 좀비 특수 상호작용 및 물기 로직 (입마개 미착용 시 10% 확률)
        if (a.status === 'Zombie') {
            if (!a.hasMuzzle && Math.random() < 0.1) {
                events.push(`⚠️ [돌발] 입마개가 없는 좀비 ${a.name}이(가) ${b.name}을(를) 거칠게 물어뜯었습니다!`);
                uB.hpChange = (uB.hpChange || 0) - 30;
                uB.infectionChange = (uB.infectionChange || 0) + 40;
                uB.sanityChange = (uB.sanityChange || 0) - 20;
                uA.relationshipUpdates = [...(uA.relationshipUpdates || []), { targetId: b.id, change: -50 }];
                uB.relationshipUpdates = [...(uB.relationshipUpdates || []), { targetId: a.id, change: -50 }];
            } else {
                const pool = INTERACTION_POOL['ZOMBIE_HUMAN'];
                const result = pool[Math.floor(Math.random() * pool.length)](a.name, b.name);
                const text = typeof result === 'string' ? result : result.text;
                if (typeof result !== 'string') {
                    if (result.targetSanity) uB.sanityChange = (uB.sanityChange || 0) + result.targetSanity;
                }
                events.push(`🧟 ${text}`);
            }
            continue;
        }

        // 2. 인간 상호작용
        const status = a.relationshipStatuses[b.id] || 'None';
        const pool = INTERACTION_POOL[status] || INTERACTION_POOL['POSITIVE'];
        const effectGen = pool[Math.floor(Math.random() * pool.length)];
        const result = effectGen(a.name, b.name);
        const text = typeof result === 'string' ? result : result.text;
        
        if (typeof result !== 'string') {
            if (result.affinity) {
                uA.relationshipUpdates = [...(uA.relationshipUpdates || []), { targetId: b.id, change: result.affinity }];
                uB.relationshipUpdates = [...(uB.relationshipUpdates || []), { targetId: a.id, change: result.affinity }];
            }
            if (result.targetHp) uB.hpChange = (uB.hpChange || 0) + result.targetHp;
            if (result.actorHp) uA.hpChange = (uA.hpChange || 0) + result.actorHp;
        }
        events.push(`💬 ${sanitizeForMinors(text, [a, b], settings)}${generateEffectLog(typeof result === 'string' ? {text} : result, characters, settings.showEventEffects)}`);
    }
};

export const simulateDay = async (day: number, characters: Character[], currentStoryNodeId: string | null, settings: GameSettings, forcedEvents: ForcedEvent[], userSelectedNodeId?: string): Promise<SimulationResult> => {
    const events: string[] = []; const updates: CharacterUpdate[] = []; const globalLoot: string[] = [];
    
    // 1. Story Event
    const storyNode = getNextStoryNode(currentStoryNodeId, userSelectedNodeId);
    let nextStoryNodeId = storyNode.id;
    events.push(`📖 [스토리] ${storyNode.text}`);
    if (storyNode.effect) {
        characters.filter(c => c.status !== 'Dead').forEach(t => applyEffectToUpdate(getCharacterUpdate(updates, t.id), storyNode.effect as any));
    }

    // 2. Daily Behavior (좀비 격리)
    characters.filter(c => c.status !== 'Dead').forEach(c => {
        const u = getCharacterUpdate(updates, c.id);
        u.hungerChange = (u.hungerChange || 0) - DAILY_HUNGER_LOSS;
        
        if (c.status === 'Zombie') {
            if (c.hunger < 10) u.hpChange = (u.hpChange || 0) - 5;
            // 좀비는 여기서 행동 종료 (인간용 이벤트 스킵)
            return;
        }
        
        // 인간 전용 행동
        if (Math.random() < 0.5) {
            const effect = getJobMbtiEvent(c.job, c.mbti, c.name);
            applyEffectToUpdate(u, effect);
            events.push(effect.text + generateEffectLog(effect, characters, settings.showEventEffects));
        }
    });

    // 3. Interactions & Evolution
    processInteractionPhase(characters, forcedEvents, settings, updates, events, globalLoot);
    processRelationshipEvolution(characters, updates, events, settings);

    return { narrative: `${day}일차의 기록입니다.`, events, updates, loot: globalLoot, nextStoryNodeId: storyNode.next ? nextStoryNodeId : null };
};
