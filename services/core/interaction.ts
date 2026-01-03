
import { Character, CharacterUpdate, GameSettings, ActionEffect } from '../../types';
import { INTERACTION_POOL, InteractionFunction } from '../events/interaction/index';
import { LOVER_MENTAL_EVENTS, MENTAL_INTERACTIONS } from '../events/mentalEvents';
import { getCharacterUpdate, sanitizeForMinors, addLootToGlobal, applyEffectToUpdate, generateEffectLog } from './utils';

export const processInteractionPhase = (characters: Character[], settings: GameSettings, updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
    if (!settings.enableInteractions) return;

    const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
    if (living.length < 2) return;
    
    const shuffled = [...living].sort(() => 0.5 - Math.random());
    for (let i = 0; i < shuffled.length - 1; i += 2) {
        const a = shuffled[i]; const b = shuffled[i+1];
        const uA = getCharacterUpdate(updates, a.id); const uB = getCharacterUpdate(updates, b.id);
        const relStatus = a.relationshipStatuses[b.id] || 'None';

        // Zombie Interaction
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

        // Mental & Normal Interaction
        let pool: InteractionFunction[];
        if (a.mentalState !== 'Normal' && Math.random() < 0.3) {
            if ((relStatus === 'Lover' || relStatus === 'Spouse') && LOVER_MENTAL_EVENTS[a.mentalState]) {
                pool = LOVER_MENTAL_EVENTS[a.mentalState];
            } else {
                pool = MENTAL_INTERACTIONS;
            }
        } else if (b.fatigue >= 80 && Math.random() < 0.3) {
            pool = INTERACTION_POOL['FATIGUE_RELIEF'];
        } else {
            if (relStatus && relStatus !== 'None' && INTERACTION_POOL[relStatus]) {
                pool = INTERACTION_POOL[relStatus];
            } else {
                pool = Math.random() < 0.5 ? INTERACTION_POOL['NEGATIVE'] : INTERACTION_POOL['POSITIVE'];
            }
        }

        const effect = pool[Math.floor(Math.random() * pool.length)](a.name, b.name) as any;
        
        if (typeof effect === 'string') {
          events.push(`💬 ${sanitizeForMinors(effect, [a, b], settings)}`);
        } else {
          if (effect.loot) addLootToGlobal(effect.loot, globalLoot);
          const effectNoLoot = { ...effect, loot: undefined };

          applyEffectToUpdate(uA, { ...effectNoLoot, hp: effect.actorHp, sanity: effect.actorSanity, fatigue: effect.actorFatigue } as any, globalLoot);
          applyEffectToUpdate(uB, { ...effectNoLoot, hp: effect.targetHp, sanity: effect.targetSanity, fatigue: effect.targetFatigue } as any, globalLoot);
          
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
