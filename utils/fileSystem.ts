
import { Character, GameSettings, GameState } from '../types';
import { INITIAL_INVENTORY, MAX_HUNGER } from '../constants';
import { getInitialSkills } from '../services/skillData';

export const saveToFile = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

export const createRosterData = (characters: Character[]) => {
    return characters.map(c => ({ 
        ...c, 
        hp: c.maxHp, 
        sanity: c.maxSanity, 
        fatigue: 0, 
        infection: 0, 
        hunger: MAX_HUNGER, 
        status: 'Alive', 
        killCount: 0, 
        plannedAction: null, 
        mentalState: 'Normal', 
        hasMuzzle: false 
    }));
};

export const ensureIntegrity = (chars: any[]): Character[] => {
    return chars.map(c => ({
      ...c,
      stats: c.stats || { str: 5, agi: 5, con: 5, int: 5, cha: 5 },
      skills: Array.isArray(c.skills) ? c.skills : getInitialSkills(c.job || ''),
      relationships: c.relationships || {},
      relationshipStatuses: c.relationshipStatuses || {},
      relationshipDurations: c.relationshipDurations || {},
      inventory: Array.isArray(c.inventory) ? c.inventory : [],
      hp: c.hp ?? 100,
      maxHp: c.maxHp ?? 100,
      sanity: c.sanity ?? 100,
      maxSanity: c.maxSanity ?? 100,
      fatigue: c.fatigue ?? 0,
      infection: c.infection ?? 0,
      hunger: c.hunger ?? 100,
      status: c.status || 'Alive',
      mentalState: c.mentalState || 'Normal',
      killCount: c.killCount ?? 0,
      hasMuzzle: !!c.hasMuzzle,
      griefLogs: Array.isArray(c.griefLogs) ? c.griefLogs : []
    }));
};

export const parseSaveFile = (content: string): GameState | null => {
    try {
        const parsed = JSON.parse(content);
        if (parsed.type === 'FULL_SAVE') {
            return {
                ...parsed,
                characters: ensureIntegrity(parsed.characters)
            };
        }
        return null;
    } catch (e) {
        console.error("Save file parse error", e);
        return null;
    }
};

export const parseRosterFile = (content: string): Character[] | null => {
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
            return ensureIntegrity(parsed).map(c => {
                const stats = c.stats;
                const maxHp = 100 + (stats.con * 10);
                const maxSanity = 100 + (stats.int * 10);
                const skills = c.skills.length > 0 ? c.skills : getInitialSkills(c.job); 
                return { 
                    ...c, 
                    stats,
                    skills,
                    status: 'Alive', 
                    hp: maxHp, 
                    maxHp, 
                    sanity: maxSanity, 
                    maxSanity, 
                    plannedAction: null 
                } as Character;
            });
        }
        return null;
    } catch (e) {
        console.error("Roster file parse error", e);
        return null;
    }
};
