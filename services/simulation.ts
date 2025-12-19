import { 
    Character, SimulationResult, CharacterUpdate, GameSettings, ForcedEvent, 
    RelationshipStatus, ActionEffect, BabyEventData, RelationshipUpdate, MBTI, Ending, MentalState, StoryEffect
} from '../types';
import { 
    MAX_HP, MAX_SANITY, MAX_FATIGUE, MAX_INFECTION, MAX_HUNGER, 
    FATIGUE_THRESHOLD, DAILY_HUNGER_LOSS, PRODUCTION_JOBS
} from '../constants';
import { getNextStoryNode } from './events/globalEvents';
import { FATIGUE_EVENTS } from './events/fatigueEvents';
import { MBTI_SPECIFIC_ACTIONS, MBTI_EVENT_POOL, ANALYSTS, DIPLOMATS, SENTINELS, EXPLORERS } from './events/mbtiEvents';
import { 
    MENTAL_ILLNESS_ACTIONS, MENTAL_INTERACTIONS, LOVER_MENTAL_EVENTS 
} from './events/mentalEvents';
/* Fix: InteractionFunction is imported from its correct location */
import { INTERACTION_POOL, INTERACTION_TEMPLATES, CONFESSION_EVENTS, BREAKUP_EVENTS, REUNION_EVENTS, InteractionFunction } from './events/interaction/index';
import { GHOST_EVENTS } from './events/ghostEvents';
import { getJobMbtiEvent, ALL_JOB_MBTI_EVENTS } from './events/jobEvents/index';
import { REST_EVENTS } from './events/restEvents';
import { STORY_NODES } from './events/storyNodes';

// --- Helpers ---

// Helper to safely add loot with limits (Max 2 per type per event instance)
const addLootToGlobal = (loot: string[] | undefined, globalLoot: string[]) => {
    if (!loot) return;
    const lootCounts: Record<string, number> = {};
    const filteredLoot: string[] = [];
    for (const item of loot) {
        lootCounts[item] = (lootCounts[item] || 0) + 1;
        // 같은 종류의 아이템은 이벤트당 최대 2개까지만 획득 가능
        if (lootCounts[item] <= 2) {
            filteredLoot.push(item);
        }
    }
    globalLoot.push(...filteredLoot);
};

const applyEffectToUpdate = (update: CharacterUpdate, effect: ActionEffect, globalLoot: string[]) => {
    if (effect.hp || effect.actorHp) update.hpChange = (update.hpChange || 0) + (effect.hp || effect.actorHp || 0);
    if (effect.sanity || effect.actorSanity) update.sanityChange = (update.sanityChange || 0) + (effect.sanity || effect.actorSanity || 0);
    if (effect.fatigue || effect.actorFatigue) update.fatigueChange = (update.fatigueChange || 0) + (effect.fatigue || effect.actorFatigue || 0);
    if (effect.infection) update.infectionChange = (update.infectionChange || 0) + effect.infection;
    if (effect.hunger) update.hungerChange = (update.hungerChange || 0) + effect.hunger;
    if (effect.kill) update.killCountChange = (update.killCountChange || 0) + effect.kill;
    if (effect.status) update.status = effect.status;
    if (effect.mentalState) update.mentalState = effect.mentalState;
    
    // Loot Logic: Used for personal events. 
    // For shared events (stories), loot should be handled separately to avoid duplication.
    if (effect.loot) {
        addLootToGlobal(effect.loot, globalLoot);
    }
    
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
    // 그룹 내에 미성년자가 한 명이라도 있는지 확인
    const minors = participants.filter(p => 
        (p.status === 'Alive' || p.status === 'Infected') && 
        ['초등학생', '중학생', '고등학생', '아기'].includes(p.job)
    );
    
    if (minors.length === 0) return text;
    
    let sanitized = text;
    sanitized = sanitized.replace(/술\s*한\s*병/g, "탄산음료 한 병")
                         .replace(/술을\s*마시며/g, "음료수를 마시며")
                         .replace(/술자리/g, "다과회")
                         .replace(/건배했습니다/g, "함께 웃었습니다")
                         .replace(/취해/g, "기분이 들떠")
                         .replace(/담배/g, "사탕")
                         .replace(/흡연/g, "휴식");
    return sanitized;
};

const
 generateEffectLog = (effect: ActionEffect, characters: Character[], showResources: boolean, targetId?: string): string => {
    // 이름이 있으면 이름 뒤에 공백이나 콜론 등을 붙이기 위해 순수 이름만 추출
    const target = targetId ? characters.find(c => c.id === targetId) : null;
    const name = target ? target.name : '';
    const parts: string[] = [];
    if (effect.loot && effect.loot.length > 0) {
        parts.push(`🎒+${effect.loot.join(',')}`);
    }
    if (effect.inventoryRemove && effect.inventoryRemove.length > 0) {
        parts.push(`🎒-${effect.inventoryRemove.join(',')}`);
    }

    // 2. 스탯(Stats) 변화
    if (effect.statChanges) {
        Object.entries(effect.statChanges).forEach(([stat, val]) => {
            parts.push(`💪${name ? name + ' ' : ''}${stat.toUpperCase()}${val > 0 ? '+' : ''}${val}`);
        });
    }

    // 3. 스킬(Skills) 획득 및 제거
    if (effect.skillsAdd && effect.skillsAdd.length > 0) {
        const names = effect.skillsAdd.map(s => s.name).join(',');
        parts.push(`✨Skill${name ? name + ' ' : ''}+(${names})`);
    }
    if (effect.skillsRemove && effect.skillsRemove.length > 0) {
        parts.push(`🚫Skill${name ? name + ' ' : ''}-(${effect.skillsRemove.join(',')})`);
    }
    if (showResources == true) {
        if (effect.hp || effect.actorHp) parts.push(`❤️${(effect.hp || effect.actorHp || 0) > 0 ? '+' : ''}${effect.hp || effect.actorHp}`);
        if (effect.sanity || effect.actorSanity) parts.push(`🧠${(effect.sanity || effect.actorSanity || 0) > 0 ? '+' : ''}${effect.sanity || effect.actorSanity}`);
        if (effect.fatigue || effect.actorFatigue) parts.push(`💤${(effect.fatigue || effect.actorFatigue || 0) > 0 ? '+' : ''}${effect.fatigue || effect.actorFatigue}`);
        if (effect.infection) parts.push(`🦠${effect.infection > 0 ? '+' : ''}${effect.infection}`);
        const affinityVal = (effect as any).affinity || (effect as any).affinityChange;
        if (affinityVal && targetId) {
            const target = characters.find(c => c.id === targetId);
            parts.push(`💞${target?.name || '??'}${affinityVal > 0 ? '+' : ''}${affinityVal}`);
        }
    }
    return parts.length > 0 ? ` [${parts.join(', ')}]` : '';
};

// --- Core Logic ---

const processStatusChanges = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings) => {
    characters.forEach(c => {
        const u = getCharacterUpdate(updates, c.id);
        
        // 1. Mental State System Logic
        if (settings.useMentalStates) {
            // 정신력 50 이하일 때 확률적으로 정신 질환 발생
            if (c.mentalState === 'Normal' && c.sanity <= 50 && Math.random() < 0.4) {
                const possibleStates: MentalState[] = ['Trauma', 'Despair', 'Delusion', 'Anxiety', 'Madness'];
                const newState = possibleStates[Math.floor(Math.random() * possibleStates.length)];
                u.mentalState = newState;
                events.push(`🧠 [정신 붕괴] ${c.name}은(는) 계속되는 악몽을 견디지 못하고 [${newState}] 상태에 빠졌습니다.`);
            }
            // 정신력 70 + 100이상부터 10씩증가 이상일 때 확률적으로 회복
            else if (c.mentalState !== 'Normal' && c.sanity >= 70 + (((c.maxSanity/10) - 10) *10)  && Math.random() < 0.1) {
                u.mentalState = 'Normal';
                events.push(`✨ [정신 회복] ${c.name}은(는) 안정을 되찾고 정신적 고통에서 벗어났습니다.`);
            }
        } else {
            // 시스템이 꺼져있다면 항상 Normal 유지
            if (c.mentalState !== 'Normal') {
                u.mentalState = 'Normal';
            }
        }

        // Hunger Logic: Only for Zombies
        if (c.status === 'Zombie') {
            if (c.hunger <= 10) {
                u.hpChange = (u.hpChange || 0) - 5;
                events.push(`🦴 [굶주림] 좀비가 된 ${c.name}이(가) 심한 허기로 인해 신체 조직이 썩어갑니다.`);
            }
        }

        // Infection Logic
        if (c.status === 'Infected' || (c.infection > 0 && c.status === 'Alive')) {
            const currentInfection = c.infection + (u.infectionChange || 0);
            if (currentInfection >= MAX_INFECTION) {
                let voteScore = 0;
                const voters = characters.filter(v => v.id !== c.id && v.status === 'Alive');
                
                voters.forEach(v => {
                    if (v.mbti.includes('F')) voteScore += 2; else voteScore -= 2;
                    const affinity = v.relationships[c.id] || 0;
                    if (affinity >= 50) voteScore += 4;
                    if (affinity <= -20) voteScore -= 3;
                    const rel = v.relationshipStatuses[c.id];
                    if (['Lover', 'Spouse', 'Parent', 'Child', 'Sibling', 'Family', 'Savior', 'Guardian', 'Ward'].includes(rel || '')) {
                        voteScore += 15;
                    }
                });

                if (voteScore > 0 || voters.length === 0) {
                    u.status = 'Zombie';
                    events.push(`🧟 [전환 투표] ${c.name}이(가) 끝내 좀비로 변했습니다. 동료들은 차마 그를 버리지 못하고 구속하여 데리고 가기로 했습니다.`);
                    voters.forEach(v => {
                        const vu = getCharacterUpdate(updates, v.id);
                        vu.griefLogAdd = `${c.name}이(가) 우리 곁을 떠나 괴물이 되었습니다. 그 눈빛을 잊을 수 없습니다.`;
                    });
                } else {
                    u.status = 'Dead';
                    u.hpChange = -999; // Marker for vote death
                    events.push(`💀 [전환 투표] ${c.name}이(가) 좀비로 변하려 하자, 동료들이 안전을 위해 그를 안식에 들게 했습니다.`);
                    voters.forEach(v => {
                        const vu = getCharacterUpdate(updates, v.id);
                        vu.griefLogAdd = `결국 우리 손으로 ${c.name}을(를) 보냈습니다. 이것이 최선이었을까요?`;
                    });
                }
            }
        }

        // Missing Logic
        if (c.status === 'Missing') {
            const rand = Math.random();
            if (rand < 0.05) { u.status = 'Alive'; events.push(`✨ [귀환] 실종되었던 ${c.name}이(가) 기적적으로 돌아왔습니다!`); }
            else if (rand < 0.08) { u.status = 'Dead'; events.push(`💀 [사망 확인] 실종된 ${c.name}의 유품이 발견되었습니다.`); }
        }

        // General Death Logic (HP Depletion or Instant Death Event)
        // FIX: Check for explicit status change to 'Dead' in current update
        const currentHp = c.hp + (u.hpChange || 0);
        const isDeadAlready = c.status === 'Dead' || c.status === 'Missing';
        const isInstantDeath = u.status === 'Dead'; // Event set status to Dead explicitly
        const isVoteDeath = u.hpChange === -999; // Infection vote marker (handled above)
        const isTurningZombie = u.status === 'Zombie'; // Turning into zombie (handled above)

        if (!isDeadAlready && (currentHp <= 0 || isInstantDeath) && !isTurningZombie && !isVoteDeath) {
            u.status = 'Dead';
            events.push(`💀 [사망] ${c.name}이(가) 고통 끝에 숨을 거두었습니다.`);
            characters.filter(v => v.id !== c.id && v.status !== 'Dead' && v.status !== 'Missing').forEach(v => {
                const vu = getCharacterUpdate(updates, v.id);
                // Prevent overwriting existing grief logs (e.g. if specific event already added one)
                if (!vu.griefLogAdd) {
                    const affinity = v.relationships[c.id] || 0;
                    const relStatus = v.relationshipStatuses[c.id]; // 관계 상태 가져오기
                    if (['Spouse', 'Parent', 'Child', 'Sibling', 'Family'].includes(relStatus || '') && affinity > 50) {
                        vu.griefLogAdd = `사랑하는 가족 ${c.name}이(가) 떠났습니다. 하늘이 무너지는 슬픔을 느낍니다.`
                    }
                    else if (['Spouse', 'Parent', 'Child', 'Sibling', 'Family'].includes(relStatus || '') && affinity <= 50 && affinity >= 0) {
                        vu.griefLogAdd = `가족 ${c.name}이(가) 떠났습니다. 그리 슬프진 않지만, 어째서인지 눈물이 새어나옵니다.`
                    }
                    else if (relStatus === 'Lover') {
                        vu.griefLogAdd = `사랑하는 연인 ${c.name}을(를) 잃었습니다. 더 이상 살아갈 이유를 모르겠습니다.`
                    }
                    else if (relStatus === 'Rival') {
                        vu.griefLogAdd = `라이벌인 ${c.name}을(를) 잃었습니다. 어딘가 복잡한 기분이 듭니다.`
                    }
                    else if (affinity > 50) vu.griefLogAdd = `나의 소중한 친구 ${c.name}을(를) 잃었습니다. 가슴 한구석이 텅 빈 것 같습니다.`;

                    else vu.griefLogAdd = `동료였던 ${c.name}의 죽음을 목격했습니다. 죽음은 언제나 우리 곁에 있습니다.`;
                }
            });
        }
    });
};

const processInteractionPhase = (characters: Character[], settings: GameSettings, updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
    // Interaction Mode Check
    if (!settings.enableInteractions) return;

    const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
    if (living.length < 2) return;
    
    const shuffled = [...living].sort(() => 0.5 - Math.random());
    for (let i = 0; i < shuffled.length - 1; i += 2) {
        const a = shuffled[i]; const b = shuffled[i+1];
        const uA = getCharacterUpdate(updates, a.id); const uB = getCharacterUpdate(updates, b.id);
        const relStatus = a.relationshipStatuses[b.id] || 'None';

        if (a.status === 'Zombie') {
            if (!a.hasMuzzle && Math.random() < 0.1) {
                events.push(`⚠️ [돌발] 입마개가 없는 좀비 ${a.name}이(가) ${b.name}을(를) 거칠게 물었습니다!`);
                uB.hpChange = (uB.hpChange || 0) - 30; uB.infectionChange = (uB.infectionChange || 0) + 40;
            } else {
                const pool = INTERACTION_POOL['ZOMBIE_HUMAN'];
                const effect = pool[Math.floor(Math.random() * pool.length)](a.name, b.name) as any;
                applyEffectToUpdate(uB, { ...effect, hp: effect.targetHp, sanity: effect.targetSanity, fatigue: effect.targetFatigue } as any, globalLoot);
                events.push(`🧟 ${effect.text}`);
            }
            continue;
        }

        // --- 특수 상호작용 풀 결정 (정신 질환 및 피로도 고려) ---
        let pool: InteractionFunction[];
        if (a.mentalState !== 'Normal' && Math.random() < 0.3) {
            // 주체가 정신 질환 상태인 경우
            if ((relStatus === 'Lover' || relStatus === 'Spouse') && LOVER_MENTAL_EVENTS[a.mentalState]) {
                pool = LOVER_MENTAL_EVENTS[a.mentalState];
            } else {
                pool = MENTAL_INTERACTIONS;
            }
        } else if (b.fatigue >= 80 && Math.random() < 0.3) {
            // 대상의 피로도가 매우 높을 때 (피로 회복 지원)
            pool = INTERACTION_POOL['FATIGUE_RELIEF'];
        } else {
            // 일반 관계 기반 풀
            pool = Math.random() < 0.5 ? INTERACTION_POOL['NEGATIVE'] : INTERACTION_POOL['POSITIVE'];
        }

        const effect = pool[Math.floor(Math.random() * pool.length)](a.name, b.name) as any;
        
        if (typeof effect === 'string') {
          events.push(`💬 ${sanitizeForMinors(effect, [a, b], settings)}`);
        } else {
          // Handle Loot Once per interaction (prevent duplication if both have same effect)
          if (effect.loot) addLootToGlobal(effect.loot, globalLoot);
          const effectNoLoot = { ...effect, loot: undefined };

          // Actor's stats
          applyEffectToUpdate(uA, { ...effectNoLoot, hp: effect.actorHp, sanity: effect.actorSanity, fatigue: effect.actorFatigue } as any, globalLoot);
          // Target's stats
          applyEffectToUpdate(uB, { ...effectNoLoot, hp: effect.targetHp, sanity: effect.targetSanity, fatigue: effect.targetFatigue } as any, globalLoot);
          
          // 은인(Savior) 트리거
          const isTargetCritical = b.hp <= 30;
          if (isTargetCritical && (effect.targetHp || 0) >= 10 && relStatus !== 'Savior') {
              uB.relationshipUpdates = [...(uB.relationshipUpdates || []), { targetId: a.id, change: 30, newStatus: 'Savior' }];
              events.push(`🦸 [은인] ${b.name}은(는) 죽음의 문턱에서 자신을 살려낸 ${a.name}을(를) 평생의 은인으로 여기기로 했습니다!`);
          } else if (effect.affinity) {
              uA.relationshipUpdates = [...(uA.relationshipUpdates || []), { targetId: b.id, change: effect.affinity }];
              uB.relationshipUpdates = [...(uB.relationshipUpdates || []), { targetId: a.id, change: effect.affinity }];
          }
          
          const sanitizedText = sanitizeForMinors(effect.text, [a, b], settings);
          events.push(`💬 ${sanitizedText}${generateEffectLog(effect as ActionEffect, characters, settings.showEventEffects, b.id)}`);
        }
    }
};

const processRelationshipEvolution = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings): BabyEventData | null => {
    if (settings.friendshipMode) return null;
    let newBaby: BabyEventData | null = null;
    const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing' && c.status !== 'Zombie');
    
    // FIX: 오늘 새롭게 맺어진 커플을 추적하는 Set (동일 틱 내 중복 고백 방지)
    const newlyCoupledIds = new Set<string>();

    const isStudent = (job: string) => ['초등학생', '중학생', '고등학생', '아기'].includes(job);

    living.forEach(c1 => {
        living.forEach(c2 => {
            if (c1.id >= c2.id) return;
            const currentStatus = c1.relationshipStatuses[c2.id] || 'None';
            const affinity = c1.relationships[c2.id] || 0;
            const duration = c1.relationshipDurations[c2.id] || 0;

            // 0. Friendship Mode Check (Global Lock)
            if (settings.friendshipMode) return;

            // 1. Breakup Logic
            if ((currentStatus === 'Lover' || currentStatus === 'Spouse') && affinity <= 10 && Math.random() < 0.2) {
                const res = BREAKUP_EVENTS[Math.floor(Math.random() * BREAKUP_EVENTS.length)](c1.name, c2.name) as any;
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: -10, newStatus: 'Ex' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: -10, newStatus: 'Ex' }];
                if (res.actorSanity) u1.sanityChange = (u1.sanityChange || 0) + res.actorSanity;
                if (res.targetSanity) u2.sanityChange = (u2.sanityChange || 0) + res.targetSanity;
                events.push(`💔 [이별] ${typeof res === 'string' ? res : res.text}`);
                return; // End for this pair
            }

            // 2. Reunion Logic
            if (currentStatus === 'Ex' && affinity >= 60 && Math.random() < 0.1) {
                // Check restrictions for reunion as well
                if (settings.pureLoveMode) {
                    const c1HasLover = Object.values(c1.relationshipStatuses).some(s => s === 'Lover' || s === 'Spouse');
                    const c2HasLover = Object.values(c2.relationshipStatuses).some(s => s === 'Lover' || s === 'Spouse');
                    // FIX: 기존 연인 상태 + 오늘 새롭게 맺어진 상태 체크
                    if (c1HasLover || c2HasLover || newlyCoupledIds.has(c1.id) || newlyCoupledIds.has(c2.id)) return;
                }

                const res = REUNION_EVENTS[Math.floor(Math.random() * REUNION_EVENTS.length)](c1.name, c2.name) as any;
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 15, newStatus: 'Lover' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 15, newStatus: 'Lover' }];
                if (res.actorSanity) u1.sanityChange = (u1.sanityChange || 0) + res.actorSanity;
                if (res.targetSanity) u2.sanityChange = (u2.sanityChange || 0) + res.targetSanity;
                events.push(`💖 [재결합] ${typeof res === 'string' ? res : res.text}`);
                
                // FIX: 명부 등록
                newlyCoupledIds.add(c1.id);
                newlyCoupledIds.add(c2.id);
            }
            
            // 3. Confession Logic
            else if (currentStatus !== 'Lover' && currentStatus !== 'Spouse' && affinity >= 75 && Math.random() < 0.15) {
                // Check Gender Preferences
                const isSameSex = c1.gender === c2.gender;
                if (isSameSex && !settings.allowSameSexCouples) return;
                if (!isSameSex && !settings.allowOppositeSexCouples) return;

                // Check Incest
                const isFamily = ['Parent', 'Child', 'Sibling', 'Family'].includes(currentStatus);
                if (isFamily && !settings.allowIncest) return;

                // Check Student Restriction
                if (settings.restrictStudentDating) {
                    const c1Student = isStudent(c1.job);
                    const c2Student = isStudent(c2.job);
                    if (c1Student !== c2Student) return; // Block student-adult
                }
                
                // Pure Love Mode (Cheating prevention)
                if (settings.pureLoveMode) {
                    const c1HasLover = Object.values(c1.relationshipStatuses).some(s => s === 'Lover' || s === 'Spouse');
                    const c2HasLover = Object.values(c2.relationshipStatuses).some(s => s === 'Lover' || s === 'Spouse');
                    // FIX: 기존 연인 상태 + 오늘 새롭게 맺어진 상태 체크
                    if (c1HasLover || c2HasLover || newlyCoupledIds.has(c1.id) || newlyCoupledIds.has(c2.id)) return;
                }

                const res = CONFESSION_EVENTS[Math.floor(Math.random() * CONFESSION_EVENTS.length)](c1.name, c2.name) as any;
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 10, newStatus: 'Lover' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 10, newStatus: 'Lover' }];
                if (res.actorSanity) u1.sanityChange = (u1.sanityChange || 0) + res.actorSanity;
                if (res.targetSanity) u2.sanityChange = (u2.sanityChange || 0) + res.targetSanity;
                events.push(`💘 [고백] ${typeof res === 'string' ? res : res.text}`);
                
                // FIX: 명부 등록
                newlyCoupledIds.add(c1.id);
                newlyCoupledIds.add(c2.id);
            }
            
            // 4. Marriage Logic
            else if (currentStatus === 'Lover' && duration >= 7 && Math.random() < (0.01 + duration * 0.005)) {
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 20, newStatus: 'Spouse' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 20, newStatus: 'Spouse' }];
                events.push(`💍 [결혼] ${c1.name}와(과) ${c2.name}은(는) 영원한 사랑을 맹세하며 부부가 되었습니다!`);
            }
            
            // 5. Pregnancy Logic
            
            else if (settings.enablePregnancy && currentStatus === 'Spouse' && !newBaby && Math.random() < (settings.pregnancyChance / 100)) {
                // 이성 커플인지 확인 (남성-여성 조합일 때만)
                const isHetero = (c1.gender === 'Male' && c2.gender === 'Female') || (c1.gender === 'Female' && c2.gender === 'Male');
                if (isHetero) {
                    newBaby = { fatherId: c1.gender === 'Male' ? c1.id : c2.id, motherId: c1.gender === 'Female' ? c1.id : c2.id };
                    }
                }
        });
    });
    return newBaby;
};

export const simulateDay = async (day: number, characters: Character[], currentStoryNodeId: string | null, settings: GameSettings, forcedEvents: ForcedEvent[], userSelectedNodeId?: string): Promise<SimulationResult> => {
    const events: string[] = []; const updates: CharacterUpdate[] = []; const globalLoot: string[] = [];
    const inventoryRemove: string[] = [];

    const storyNode = getNextStoryNode(currentStoryNodeId, userSelectedNodeId);
    let nextStoryNodeId = storyNode.id;
    
    // 타로 이벤트 체크
    const tarotEvent = nextStoryNodeId === 'tarot_continue';

    // [변경점 1] 효과 로그를 저장할 변수를 먼저 선언
    let effectLogString = '';

    // [변경점 2] 효과 적용 로직을 로그 생성보다 *먼저* 실행
    if (storyNode.effect) {
        const effect = storyNode.effect;
        let targets: Character[] = [];
        const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
        
        // 타겟 선정
        if (effect.target === 'ALL') targets = living;
        else if (effect.target === 'RANDOM_1' && living.length > 0) targets = [living[Math.floor(Math.random() * living.length)]];
        else if (effect.target === 'RANDOM_HALF' && living.length > 0) targets = [...living].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(living.length / 2));
        
        // 아이템 획득 처리
        if (effect.loot) {
            addLootToGlobal(effect.loot, globalLoot);
        }

        // 캐릭터 업데이트 적용
        const effectForTargets = { ...effect, loot: undefined };
        targets.forEach(t => {
            const u = getCharacterUpdate(updates, t.id);
            applyEffectToUpdate(u, effectForTargets as any, globalLoot);
        });

        if (effect.inventoryRemove) inventoryRemove.push(...effect.inventoryRemove);

        // [변경점 3] 타겟이 정해진 후 로그 생성 (대상이 1명이면 ID를 넘겨서 이름 표시)
        const targetIdForLog = targets.length === 1 ? targets[0].id : undefined;
        effectLogString = generateEffectLog(storyNode.effect as any, characters, settings.showEventEffects, targetIdForLog);
    }
    
    // [변경점 4] 최종 로그 조합 및 출력
    const sanitizedStoryText = sanitizeForMinors(storyNode.text, characters, settings);
    let storyLog = `📖 [스토리] ${sanitizedStoryText}${effectLogString}`;
    events.push(storyLog);
    
    // FIX: 특정 스토리 노드 도달 시 타로 이벤트 플래그 활성화

    if (storyNode.effect) {
        const effect = storyNode.effect;
        let targets: Character[] = [];
        const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
        
        if (effect.target === 'ALL') targets = living;
        else if (effect.target === 'RANDOM_1' && living.length > 0) targets = [living[Math.floor(Math.random() * living.length)]];
        else if (effect.target === 'RANDOM_HALF' && living.length > 0) targets = [...living].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(living.length / 2));
        
        // Fix: Loot duplication issue
        // Handle loot ONCE for the event, not per target character
        if (effect.loot) {
            addLootToGlobal(effect.loot, globalLoot);
        }

        // Pass effect WITHOUT loot to character updates to prevent duplication inside the loop
        const effectForTargets = { ...effect, loot: undefined };

        targets.forEach(t => {
            const u = getCharacterUpdate(updates, t.id);
            applyEffectToUpdate(u, effectForTargets as any, globalLoot);
        });

        if (effect.inventoryRemove) inventoryRemove.push(...effect.inventoryRemove);
    }

    const processPlannedActions = (characters: Character[], updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
        characters.filter(c => c.status === 'Alive' && c.plannedAction).forEach(c => {
            const u = getCharacterUpdate(updates, c.id);
            u.plannedAction = null; 
            switch(c.plannedAction) {
                case 'rest':
                    const restEffect = REST_EVENTS[Math.floor(Math.random() * REST_EVENTS.length)](c.name);  // 1. 랜덤 이벤트 풀에서 텍스트(상황 묘사)만 가져옵니다.
                    // 2. [수정됨] UI에 명시된 대로 고정된 대폭 회복 수치를 직접 적용합니다.
                    // 기존의 applyEffectToUpdate를 사용하지 않고 직접 수치를 더합니다.
                    u.hpChange = (u.hpChange || 0) + 15;        // 체력 +15
                    u.fatigueChange = (u.fatigueChange || 0) - 35; // 피로도 -35 (대폭 감소)
                    u.sanityChange = (u.sanityChange || 0) + 5;    // (보너스) 정신력 소폭 회복
                    // 3. 로그 출력
                    events.push(`🛌 [계획/휴식] ${restEffect.text}`);
                    break;
                case 'scavenge':
                    const found = Math.random() < 0.7 ? '통조림' : '붕대';
                    found && globalLoot.push(found); u.fatigueChange = (u.fatigueChange || 0) + 20;
                    events.push(`🎒 [계획] ${c.name}은(는) 위험을 무릅쓰고 정찰을 나가 ${found}을(를) 찾아왔습니다.`);
                    break;
                case 'fortify':
                    u.sanityChange = (u.sanityChange || 0) + 10; u.fatigueChange = (u.fatigueChange || 0) + 10;
                    events.push(`🛡️ [계획] ${c.name}은(는) 은신처 주위를 보강하며 마음의 안정을 찾았습니다.`);
                    break;
                case 'meditate':
                    u.sanityChange = (u.sanityChange || 0) + 25;
                    events.push(`🧘 [계획] ${c.name}은(는) 조용히 명상을 하며 흐트러진 정신을 가다듬었습니다.`);
                    break;
                case 'patrol':
                    u.killCountChange = (u.killCountChange || 0) + 3; u.fatigueChange = (u.fatigueChange || 0) + 30;
                    events.push(`⚔️ [계획] ${c.name}은(는) 은신처 근처의 좀비들을 적극적으로 소탕했습니다.`);
                    break;
            }
        });
    };

    const processPersonalEvents = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings, globalLoot: string[]) => {
        characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing' && c.status !== 'Zombie' && !c.plannedAction).forEach(c => {
            const u = getCharacterUpdate(updates, c.id);
            if (PRODUCTION_JOBS.includes(c.job) && Math.random() < 0.3) {
                const found = Math.random() < 0.5 ? '통조림' : '붕대';
                found && globalLoot.push(found);
                events.push(`🛠️ [직업 특기] ${c.job}인 ${c.name}이(가) 능숙한 솜씨로 ${found}을(를) 확보했습니다.`);
            }
            if (c.mentalState !== 'Normal' && Math.random() < 0.3) {
                const effect = MENTAL_ILLNESS_ACTIONS[c.mentalState](c);
                applyEffectToUpdate(u, effect, globalLoot);
                events.push(sanitizeForMinors(effect.text, characters, settings) + generateEffectLog(effect, characters, settings.showEventEffects, c.id));
                return;
            }
            if (c.fatigue >= 80 && Math.random() < 0.4) {
                const effect = FATIGUE_EVENTS[Math.floor(Math.random() * FATIGUE_EVENTS.length)](c.name);
                applyEffectToUpdate(u, effect, globalLoot);
                events.push(sanitizeForMinors(effect.text, characters, settings) + generateEffectLog(effect, characters, settings.showEventEffects, c.id));
                return;
            }
            const rand = Math.random();
            if (rand < 0.5) {
                const effect = getJobMbtiEvent(c.job, c.mbti, c.name);
                applyEffectToUpdate(u, effect, globalLoot);
                events.push(sanitizeForMinors(effect.text, characters, settings) + generateEffectLog(effect, characters, settings.showEventEffects, c.id));
            } else if (rand < 0.8) {
                const pool = MBTI_EVENT_POOL[c.mbti];
                const effect = pool[Math.floor(Math.random() * pool.length)](c.name, c.gender === 'Female' ? '그녀' : '그');
                applyEffectToUpdate(u, effect, globalLoot);
                events.push(`🧩 [${c.mbti}] ${sanitizeForMinors(effect.text, characters, settings)}${generateEffectLog(effect, characters, settings.showEventEffects, c.id)}`);
            }
        });
    };

    processPlannedActions(characters, updates, events, globalLoot);
    processPersonalEvents(characters, updates, events, settings, globalLoot);
    processInteractionPhase(characters, settings, updates, events, globalLoot);
    processStatusChanges(characters, updates, events, settings);
    const babyEvent = processRelationshipEvolution(characters, updates, events, settings);

    characters.filter(c => c.status === 'Dead').forEach(d => {
        characters.filter(l => l.status !== 'Dead' && l.status !== 'Missing' && (l.relationships[d.id] || 0) > 50).forEach(l => {
            if (Math.random() < 0.2) {
                const u = getCharacterUpdate(updates, l.id);
                const ev = GHOST_EVENTS[Math.floor(Math.random() * GHOST_EVENTS.length)](d.name, l.name);
                applyEffectToUpdate(u, ev, globalLoot); 
                events.push(ev.text);
            }
        });
    });

    let triggeredEnding: Ending | null = null;
    const finalLiving = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing').length;
    if (finalLiving === 0 && characters.length > 0) {
        triggeredEnding = { id: 'extinction', title: '인류의 황혼', description: '모든 생존자가 사망했습니다. 고요한 폐허 속에 인류의 흔적만이 바람에 흩날립니다.', icon: '💀', type: 'BAD' };
    } else if (day == 365) {
        triggeredEnding = { id: 'survival_1year', title: '새로운 시작', description: '1년이라는 긴 시간 동안 지옥에서 살아남았습니다. 당신들은 이제 단순한 생존자가 아닌, 새로운 세계의 개척자입니다.', icon: '🌅', type: 'GOOD' };
    } else if (storyNode.id.includes('rescue')) {
        triggeredEnding = { id: 'rescue_success', title: '안전 지대로', description: '극적인 구조 끝에 안전한 곳으로 이송되었습니다. 지옥 같던 날들은 이제 기억 속에만 남을 것입니다.', icon: '🚁', type: 'GOOD' };
    }

    // Daily Hunger Loss: Only apply to Zombies
    characters.filter(c => c.status === 'Zombie').forEach(c => {
        getCharacterUpdate(updates, c.id).hungerChange = (getCharacterUpdate(updates, c.id).hungerChange || 0) - DAILY_HUNGER_LOSS;
    });

    return {
        narrative: storyNode.text,
        events,
        updates,
        loot: globalLoot,
        inventoryRemove,
        nextStoryNodeId,
        babyEvent,
        tarotEvent,
        ending: triggeredEnding
    };
};
