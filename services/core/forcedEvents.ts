
import { 
    ForcedEvent, Character, CharacterUpdate, GameSettings, ActionEffect, MBTI 
} from '../../types';
import { MBTI_EVENT_POOL } from '../events/mbtiEvents';
import { INTERACTION_POOL } from '../events/interaction/index';
import { ALL_JOB_MBTI_EVENTS } from '../events/jobEvents/index';
import { REST_EVENTS } from '../events/restEvents';
import { FATIGUE_EVENTS } from '../events/fatigueEvents';
import { GHOST_EVENTS } from '../events/ghostEvents';
import { MENTAL_ILLNESS_ACTIONS } from '../events/mentalEvents';
import { applyEffectToUpdate, generateEffectLog } from './utils';

export const processForcedEvents = (
    characters: Character[], 
    forcedEvents: ForcedEvent[], 
    updates: CharacterUpdate[], 
    events: string[], 
    globalLoot: string[],
    settings: GameSettings
) => {
    forcedEvents.forEach(ev => {
        if (ev.type === 'STORY') return; // 스토리 이벤트는 globalEvents.ts 로직에서 메인 스토리 노드를 덮어쓰는 방식으로 처리됨 (simulation.ts에서 확인)

        let actor: Character | undefined;
        if (ev.actorId) actor = characters.find(c => c.id === ev.actorId);
        
        // SYSTEM-GHOST 이벤트의 경우 actorId가 죽은 캐릭터일 수 있음
        // find는 전체 리스트에서 찾으므로 OK

        let effect: ActionEffect | any = null;
        let logPrefix = "🛠️ [강제] ";

        if (ev.type === 'MBTI' && actor) {
             const generator = MBTI_EVENT_POOL[ev.key as MBTI]?.[ev.index || 0];
             if (generator) effect = generator(actor.name, actor.gender === 'Male' ? '그' : '그녀');
        } 
        else if (ev.type === 'INTERACTION') {
             const target = characters.find(c => c.id === ev.targetId);
             if (actor && target) {
                 const generator = INTERACTION_POOL[ev.key]?.[ev.index || 0];
                 if (generator) {
                     effect = generator(actor.name, target.name);
                 }
             }
        } 
        else if (ev.type === 'JOB' && actor) {
             // key format: "JobName::GroupName"
             const [job, group] = ev.key.split('::');
             if (job && group) {
                 const generator = ALL_JOB_MBTI_EVENTS[job]?.[group]?.[ev.index || 0];
                 if (generator) effect = generator(actor.name);
             }
        } 
        else if (ev.type === 'SYSTEM') {
             if (ev.key === 'MENTAL' && actor) {
                 effect = MENTAL_ILLNESS_ACTIONS[actor.mentalState](actor);
             } else if (ev.key === 'PREGNANCY' && actor && ev.targetId) {
                 // 임신 이벤트는 시뮬레이션 결과(babyEvent)로 처리되어야 하지만, 
                 // 강제 이벤트에서는 텍스트 로그와 관계 업데이트 정도만 처리하고 실제 아기 생성은 별도 트리거가 필요할 수 있음.
                 // 여기서는 간단히 상호작용 텍스트만 출력하고, BabyEventData는 simulation.ts 반환값에 추가하는 방식이 좋으나
                 // 현재 구조상 effect로 처리 가능한 범위 내에서 진행.
                 const target = characters.find(c => c.id === ev.targetId);
                 if (target) {
                     effect = { 
                         text: `${actor.name}와(과) ${target.name} 사이에서 새로운 생명이 잉태되었습니다! (강제 발생)`,
                         affinity: 20
                     };
                     // Note: 실제 아기 생성(babyEvent)은 simulation.ts의 반환값에 의존하므로 
                     // 강제 이벤트로는 텍스트만 출력됨. 완벽한 구현을 위해선 simulation result 확장이 필요함.
                 }
             } else if (ev.key === 'REST' && actor) {
                 const generator = REST_EVENTS[ev.index || 0];
                 if (generator) effect = generator(actor.name);
             } else if (ev.key === 'FATIGUE' && actor) {
                 const generator = FATIGUE_EVENTS[ev.index || 0];
                 if (generator) effect = generator(actor.name);
             } else if (ev.key === 'GHOST' && actor && ev.targetId) {
                 const target = characters.find(c => c.id === ev.targetId);
                 if (target) {
                     const generator = GHOST_EVENTS[ev.index || 0];
                     if (generator) effect = generator(actor.name, target.name);
                 }
             }
        }

        // Apply
        if (effect) {
            // Interaction returns string or object.
            const effectObj = typeof effect === 'string' ? { text: effect } : effect;
            
            // Log
            let logText = logPrefix + (effectObj.text || "이벤트가 발생했습니다.");
            
            // Interaction type usually handles updates internally via applyEffectToUpdate logic
            // But applyEffectToUpdate is designed for single actor update mostly.
            // Complex interactions (actor + target updates) need careful handling.
            
            if (actor) {
                // Find or create update for actor
                let actorUpdate = updates.find(u => u.id === actor!.id);
                if (!actorUpdate) { actorUpdate = { id: actor.id }; updates.push(actorUpdate); }
                
                applyEffectToUpdate(actorUpdate, effectObj, globalLoot);
            }

            if (ev.targetId && (effectObj.targetHp || effectObj.targetSanity || effectObj.targetFatigue || effectObj.affinity)) {
                let targetUpdate = updates.find(u => u.id === ev.targetId);
                if (!targetUpdate) { targetUpdate = { id: ev.targetId! }; updates.push(targetUpdate); }
                
                const targetEffect = {
                    hp: effectObj.targetHp,
                    sanity: effectObj.targetSanity,
                    fatigue: effectObj.targetFatigue,
                    // Affinity logic is tricky, handled in relationships usually but here we can try
                };
                applyEffectToUpdate(targetUpdate, targetEffect as ActionEffect, globalLoot);

                if (effectObj.affinity && actor) {
                    // Update relationship for both
                    let aUpdate = updates.find(u => u.id === actor!.id);
                    if (aUpdate) {
                        aUpdate.relationshipUpdates = [...(aUpdate.relationshipUpdates || []), { targetId: ev.targetId, change: effectObj.affinity }];
                    }
                    if (targetUpdate) {
                        targetUpdate.relationshipUpdates = [...(targetUpdate.relationshipUpdates || []), { targetId: actor.id, change: effectObj.affinity }];
                    }
                }
            }

            events.push(logText + generateEffectLog(effectObj, characters, true, ev.targetId));
        }
    });
};
