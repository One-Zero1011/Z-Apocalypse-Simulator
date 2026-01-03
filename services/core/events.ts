
import { Character, CharacterUpdate, GameSettings } from '../../types';
import { PRODUCTION_JOBS } from '../../constants';
import { REST_EVENTS } from '../events/restEvents';
import { MENTAL_ILLNESS_ACTIONS } from '../events/mentalEvents';
import { FATIGUE_EVENTS } from '../events/fatigueEvents';
import { getJobMbtiEvent } from '../events/jobEvents/index';
import { MBTI_EVENT_POOL } from '../events/mbtiEvents';
import { getCharacterUpdate, sanitizeForMinors, generateEffectLog, applyEffectToUpdate } from './utils';

export const processPlannedActions = (characters: Character[], updates: CharacterUpdate[], events: string[], globalLoot: string[]) => {
    characters.filter(c => c.status === 'Alive' && c.plannedAction).forEach(c => {
        const u = getCharacterUpdate(updates, c.id);
        u.plannedAction = null; 
        switch(c.plannedAction) {
            case 'rest':
                const restEffect = REST_EVENTS[Math.floor(Math.random() * REST_EVENTS.length)](c.name); 
                u.hpChange = (u.hpChange || 0) + 15;        
                u.fatigueChange = (u.fatigueChange || 0) - 35;
                u.sanityChange = (u.sanityChange || 0) + 5;
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

export const processPersonalEvents = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings, globalLoot: string[]) => {
    characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing' && c.status !== 'Zombie' && !c.plannedAction).forEach(c => {
        const u = getCharacterUpdate(updates, c.id);
        
        // 1. Production Job Loot
        if (PRODUCTION_JOBS.includes(c.job) && Math.random() < 0.3) {
            const found = Math.random() < 0.5 ? '통조림' : '붕대';
            found && globalLoot.push(found);
            events.push(`🛠️ [직업 특기] ${c.job}인 ${c.name}이(가) 능숙한 솜씨로 ${found}을(를) 확보했습니다.`);
        }

        // 2. Mental Illness Action
        if (c.mentalState !== 'Normal' && Math.random() < 0.3) {
            const effect = MENTAL_ILLNESS_ACTIONS[c.mentalState](c);
            applyEffectToUpdate(u, effect, globalLoot);
            events.push(sanitizeForMinors(effect.text, characters, settings) + generateEffectLog(effect, characters, settings.showEventEffects, c.id));
            return;
        }

        // 3. Fatigue Event
        if (c.fatigue >= 80 && Math.random() < 0.4) {
            const effect = FATIGUE_EVENTS[Math.floor(Math.random() * FATIGUE_EVENTS.length)](c.name);
            applyEffectToUpdate(u, effect, globalLoot);
            events.push(sanitizeForMinors(effect.text, characters, settings) + generateEffectLog(effect, characters, settings.showEventEffects, c.id));
            return;
        }

        // 4. Job/MBTI Event
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
