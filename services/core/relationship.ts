
import { Character, CharacterUpdate, GameSettings, BabyEventData } from '../../types';
import { BREAKUP_EVENTS, REUNION_EVENTS, CONFESSION_EVENTS } from '../events/interaction/index';
import { getCharacterUpdate } from './utils';

export const processRelationshipEvolution = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings): BabyEventData | null => {
    if (settings.friendshipMode) return null;
    let newBaby: BabyEventData | null = null;
    const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing' && c.status !== 'Zombie');
    const newlyCoupledIds = new Set<string>();
    const isStudent = (job: string) => ['초등학생', '중학생', '고등학생', '아기'].includes(job);
    const isBaby = (job: string) => job === '아기';

    living.forEach(c1 => {
        living.forEach(c2 => {
            if (c1.id >= c2.id) return;
            
            // 아기는 연애 불가 (절대 규칙) - 학생 연애 제한 설정과 무관하게 적용
            if (isBaby(c1.job) || isBaby(c2.job)) return;

            const currentStatus = c1.relationshipStatuses[c2.id] || 'None';
            const affinity = c1.relationships[c2.id] || 0;
            const duration = c1.relationshipDurations[c2.id] || 0;

            if (settings.friendshipMode) return;

            // 1. Breakup
            if ((currentStatus === 'Lover' || currentStatus === 'Spouse') && affinity <= 10 && Math.random() < 0.2) {
                const res = BREAKUP_EVENTS[Math.floor(Math.random() * BREAKUP_EVENTS.length)](c1.name, c2.name) as any;
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: -10, newStatus: 'Ex' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: -10, newStatus: 'Ex' }];
                if (res.actorSanity) u1.sanityChange = (u1.sanityChange || 0) + res.actorSanity;
                if (res.targetSanity) u2.sanityChange = (u2.sanityChange || 0) + res.targetSanity;
                events.push(`💔 [이별] ${typeof res === 'string' ? res : res.text}`);
                return; 
            }

            // 2. Reunion
            if (currentStatus === 'Ex' && affinity >= 60 && Math.random() < 0.1) {
                if (settings.pureLoveMode) {
                    const c1HasLover = Object.values(c1.relationshipStatuses).some(s => s === 'Lover' || s === 'Spouse');
                    const c2HasLover = Object.values(c2.relationshipStatuses).some(s => s === 'Lover' || s === 'Spouse');
                    if (c1HasLover || c2HasLover || newlyCoupledIds.has(c1.id) || newlyCoupledIds.has(c2.id)) return;
                }

                const res = REUNION_EVENTS[Math.floor(Math.random() * REUNION_EVENTS.length)](c1.name, c2.name) as any;
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 15, newStatus: 'Lover' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 15, newStatus: 'Lover' }];
                if (res.actorSanity) u1.sanityChange = (u1.sanityChange || 0) + res.actorSanity;
                if (res.targetSanity) u2.sanityChange = (u2.sanityChange || 0) + res.targetSanity;
                events.push(`💖 [재결합] ${typeof res === 'string' ? res : res.text}`);
                newlyCoupledIds.add(c1.id);
                newlyCoupledIds.add(c2.id);
            }
            
            // 3. Confession
            else if (currentStatus !== 'Lover' && currentStatus !== 'Spouse' && affinity >= 75 && Math.random() < 0.15) {
                const isSameSex = c1.gender === c2.gender;
                if (isSameSex && !settings.allowSameSexCouples) return;
                if (!isSameSex && !settings.allowOppositeSexCouples) return;

                const isFamily = ['Parent', 'Child', 'Sibling', 'Family'].includes(currentStatus);
                if (isFamily && !settings.allowIncest) return;

                if (settings.restrictStudentDating) {
                    const c1Student = isStudent(c1.job);
                    const c2Student = isStudent(c2.job);
                    if (c1Student !== c2Student) return;
                }
                
                if (settings.pureLoveMode) {
                    const c1HasLover = Object.values(c1.relationshipStatuses).some(s => s === 'Lover' || s === 'Spouse');
                    const c2HasLover = Object.values(c2.relationshipStatuses).some(s => s === 'Lover' || s === 'Spouse');
                    if (c1HasLover || c2HasLover || newlyCoupledIds.has(c1.id) || newlyCoupledIds.has(c2.id)) return;
                }

                const res = CONFESSION_EVENTS[Math.floor(Math.random() * CONFESSION_EVENTS.length)](c1.name, c2.name) as any;
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 10, newStatus: 'Lover' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 10, newStatus: 'Lover' }];
                if (res.actorSanity) u1.sanityChange = (u1.sanityChange || 0) + res.actorSanity;
                if (res.targetSanity) u2.sanityChange = (u2.sanityChange || 0) + res.targetSanity;
                events.push(`💘 [고백] ${typeof res === 'string' ? res : res.text}`);
                newlyCoupledIds.add(c1.id);
                newlyCoupledIds.add(c2.id);
            }
            
            // 4. Marriage
            else if (currentStatus === 'Lover' && duration >= 7 && Math.random() < (0.01 + duration * 0.005)) {
                const u1 = getCharacterUpdate(updates, c1.id); const u2 = getCharacterUpdate(updates, c2.id);
                u1.relationshipUpdates = [...(u1.relationshipUpdates || []), { targetId: c2.id, change: 20, newStatus: 'Spouse' }];
                u2.relationshipUpdates = [...(u2.relationshipUpdates || []), { targetId: c1.id, change: 20, newStatus: 'Spouse' }];
                events.push(`💍 [결혼] ${c1.name}와(과) ${c2.name}은(는) 영원한 사랑을 맹세하며 부부가 되었습니다!`);
            }
            
            // 5. Pregnancy
            else if (settings.enablePregnancy && currentStatus === 'Spouse' && !newBaby && Math.random() < (settings.pregnancyChance / 100)) {
                const isHetero = (c1.gender === 'Male' && c2.gender === 'Female') || (c1.gender === 'Female' && c2.gender === 'Male');
                if (isHetero) {
                    newBaby = { fatherId: c1.gender === 'Male' ? c1.id : c2.id, motherId: c1.gender === 'Female' ? c1.id : c2.id };
                }
            }
        });
    });
    return newBaby;
};
