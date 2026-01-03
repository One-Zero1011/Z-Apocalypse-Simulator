
import { Character, CharacterUpdate, ActionEffect, GameSettings, Skill } from '../../types';

export const addLootToGlobal = (loot: string[] | undefined, globalLoot: string[]) => {
    if (!loot) return;
    const lootCounts: Record<string, number> = {};
    const filteredLoot: string[] = [];
    for (const item of loot) {
        lootCounts[item] = (lootCounts[item] || 0) + 1;
        if (lootCounts[item] <= 2) {
            filteredLoot.push(item);
        }
    }
    globalLoot.push(...filteredLoot);
};

export const applyEffectToUpdate = (update: CharacterUpdate, effect: ActionEffect, globalLoot: string[]) => {
    if (effect.hp || effect.actorHp) update.hpChange = (update.hpChange || 0) + (effect.hp || effect.actorHp || 0);
    if (effect.sanity || effect.actorSanity) update.sanityChange = (update.sanityChange || 0) + (effect.sanity || effect.actorSanity || 0);
    if (effect.fatigue || effect.actorFatigue) update.fatigueChange = (update.fatigueChange || 0) + (effect.fatigue || effect.actorFatigue || 0);
    if (effect.infection) update.infectionChange = (update.infectionChange || 0) + (effect.infection || 0);
    if (effect.hunger) update.hungerChange = (update.hungerChange || 0) + (effect.hunger || 0);
    if (effect.kill) update.killCountChange = (update.killCountChange || 0) + (effect.kill || 0);
    if (effect.status) update.status = effect.status;
    if (effect.mentalState) update.mentalState = effect.mentalState;
    
    if (effect.loot) {
        addLootToGlobal(effect.loot, globalLoot);
    }
    
    if (effect.inventoryRemove) update.inventoryRemove = [...(update.inventoryRemove || []), ...effect.inventoryRemove];
    if (effect.statChanges) update.statChanges = { ...(update.statChanges || {}), ...effect.statChanges };
    if (effect.skillsAdd) update.skillsAdd = [...(update.skillsAdd || []), ...effect.skillsAdd];
    if (effect.skillsRemove) update.skillsRemove = [...(update.skillsRemove || []), ...effect.skillsRemove];
};

export const getCharacterUpdate = (updates: CharacterUpdate[], id: string): CharacterUpdate => {
    let update = updates.find(u => u.id === id);
    if (!update) {
        update = { id };
        updates.push(update);
    }
    return update;
};

export const sanitizeForMinors = (text: string, participants: Character[], settings: GameSettings): string => {
    if (!settings.restrictMinorAdultActions) return text;
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

export const generateEffectLog = (effect: ActionEffect, characters: Character[], showResources: boolean, targetId?: string): string => {
    const target = targetId ? characters.find(c => c.id === targetId) : null;
    const name = target ? target.name : '';
    const parts: string[] = [];
    if (effect.loot && effect.loot.length > 0) parts.push(`🎒+${effect.loot.join(',')}`);
    if (effect.inventoryRemove && effect.inventoryRemove.length > 0) parts.push(`🎒-${effect.inventoryRemove.join(',')}`);

    if (effect.statChanges) {
        Object.entries(effect.statChanges).forEach(([stat, val]) => {
            parts.push(`💪${name ? name + ' ' : ''}${stat.toUpperCase()}${val > 0 ? '+' : ''}${val}`);
        });
    }

    if (effect.skillsAdd && effect.skillsAdd.length > 0) {
        const names = effect.skillsAdd.map(s => s.name).join(',');
        parts.push(`✨Skill${name ? name + ' ' : ''}+(${names})`);
    }
    if (effect.skillsRemove && effect.skillsRemove.length > 0) {
        parts.push(`🚫Skill${name ? name + ' ' : ''}-(${effect.skillsRemove.join(',')})`);
    }
    if (showResources) {
        if (effect.hp || effect.actorHp) parts.push(`❤️${(effect.hp || effect.actorHp || 0) > 0 ? '+' : ''}${effect.hp || effect.actorHp}`);
        if (effect.sanity || effect.actorSanity) parts.push(`🧠${(effect.sanity || effect.actorSanity || 0) > 0 ? '+' : ''}${effect.sanity || effect.actorSanity}`);
        if (effect.fatigue || effect.actorFatigue) parts.push(`💤${(effect.fatigue || effect.actorFatigue || 0) > 0 ? '+' : ''}${effect.fatigue || effect.actorFatigue}`);
        if (effect.infection) parts.push(`🦠${(effect.infection || 0) > 0 ? '+' : ''}${effect.infection}`);
        const affinityVal = (effect as any).affinity || (effect as any).affinityChange;
        if (affinityVal && targetId) {
            const t = characters.find(c => c.id === targetId);
            parts.push(`💞${t?.name || '??'}${affinityVal > 0 ? '+' : ''}${affinityVal}`);
        }
    }
    return parts.length > 0 ? ` [${parts.join(', ')}]` : '';
};
