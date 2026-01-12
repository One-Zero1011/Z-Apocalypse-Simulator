
import { useState, useEffect, useCallback } from 'react';
import { Character, GameSettings, DayLog, ForcedEvent, GameState, BabyEventData, Ending, CharacterUpdate, RelationshipStatus, Stats, RelationshipUpdate, MBTI, Gender, MentalState, CustomStoryArc, CampState, FacilityType, CampPolicies } from '../types';
import { INITIAL_INVENTORY, MAX_HUNGER, MAX_FATIGUE, MAX_INFECTION } from '../constants';
import { simulateDay } from '../services/simulation';
import { getInitialSkills } from '../services/skillData';
import { ensureIntegrity, ensureCampIntegrity } from '../utils/fileSystem';
import { CAMP_FACILITIES } from '../services/camp/constants';

const INITIAL_SETTINGS: GameSettings = {
    allowSameSexCouples: true, allowOppositeSexCouples: true, allowIncest: false, pureLoveMode: false, restrictStudentDating: true, friendshipMode: false, 
    restrictMinorAdultActions: true, developerMode: false, useMentalStates: true, enableInteractions: true, enableStoryChoices: true, 
    enablePregnancy: true, pregnancyChance: 5, showEventEffects: false, enableEndings: true
};

const INITIAL_AFFINITY: Record<string, number> = {
    'Spouse': 90, 'Lover': 80, 'Parent': 80, 'Child': 80, 'Guardian': 80, 'Ward': 80,
    'Sibling': 70, 'Family': 60, 'BestFriend': 60, 'Savior': 50, 'Friend': 30,
    'Colleague': 15, 'Rival': -15, 'Ex': -20, 'Enemy': -50, 'Fan': 60
};

const INVERSE_RELATIONS: Record<string, RelationshipStatus> = {
    'Parent': 'Child', 'Child': 'Parent', 'Guardian': 'Ward', 'Ward': 'Guardian',
    'Lover': 'Lover', 'Spouse': 'Spouse', 'Sibling': 'Sibling', 'Friend': 'Friend',
    'BestFriend': 'BestFriend', 'Colleague': 'Colleague', 'Rival': 'Rival',
    'Enemy': 'Enemy', 'Ex': 'Ex', 'Savior': 'Friend', 'Family': 'Family'
};

const INITIAL_CAMP: CampState = {
    facilities: {
        'Barricade': 0,
        'Infirmary': 0,
        'Garden': 0,
        'Workshop': 0,
        'Lounge': 0
    },
    assignments: {
        'Barricade': [],
        'Infirmary': [],
        'Garden': [],
        'Workshop': [],
        'Lounge': []
    },
    policies: {
        rationing: 'Normal',
        workLoad: 'Normal',
        security: 'Standard'
    }
};

export const useGameEngine = () => {
    const [day, setDay] = useState(0);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [logs, setLogs] = useState<DayLog[]>([]);
    const [inventory, setInventory] = useState<string[]>(INITIAL_INVENTORY);
    const [storyNodeId, setStoryNodeId] = useState<string | null>(null);
    const [gameSettings, setGameSettings] = useState<GameSettings>(INITIAL_SETTINGS);
    const [customArcs, setCustomArcs] = useState<CustomStoryArc[]>([]); 
    const [viewedEndings, setViewedEndings] = useState<string[]>([]);
    const [camp, setCamp] = useState<CampState>(INITIAL_CAMP); // New Camp State
    
    // UI/Interaction States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [forcedEvents, setForcedEvents] = useState<ForcedEvent[]>([]);
    const [storySelection, setStorySelection] = useState<{ id: string, text: string, penalty?: { charId: string, hp?: number, sanity?: number } } | null>(null);
    const [pendingBaby, setPendingBaby] = useState<BabyEventData | null>(null);
    const [activeTarot, setActiveTarot] = useState(false);
    const [activeEnding, setActiveEnding] = useState<Ending | null>(null);

    // Auto-save & Load Logic
    useEffect(() => {
        const savedData = localStorage.getItem('z_sim_autosave');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setDay(parsed.day ?? 0);
                setCharacters(ensureIntegrity(parsed.characters ?? []));
                setInventory(parsed.inventory ?? INITIAL_INVENTORY);
                setLogs(parsed.logs ?? []);
                setStoryNodeId(parsed.storyNodeId ?? null);
                setGameSettings(prev => ({ ...prev, ...(parsed.settings || {}) }));
                setCustomArcs(parsed.customArcs || []);
                setViewedEndings(parsed.viewedEndings || []);
                setCamp(ensureCampIntegrity(parsed.camp));
            } catch (e) {
                console.error("Failed to load autosave", e);
            }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const gameState = { day, characters, inventory, logs, storyNodeId, settings: gameSettings, customArcs, viewedEndings, camp };
            localStorage.setItem('z_sim_autosave', JSON.stringify(gameState));
        }, 1000);
        return () => clearTimeout(timer);
    }, [day, characters, inventory, logs, storyNodeId, gameSettings, customArcs, viewedEndings, camp]);

    // Core Actions
    const resetGame = useCallback(() => {
        localStorage.removeItem('z_sim_autosave');
        setDay(0);
        setCharacters([]);
        setLogs([]);
        setInventory(INITIAL_INVENTORY);
        setStoryNodeId(null);
        setForcedEvents([]);
        setStorySelection(null);
        setPendingBaby(null);
        setActiveTarot(false);
        setActiveEnding(null);
        setViewedEndings([]);
        setCamp(INITIAL_CAMP);
    }, []);

    const loadGame = useCallback((parsed: GameState) => {
        setDay(parsed.day);
        setCharacters(ensureIntegrity(parsed.characters));
        setInventory(parsed.inventory);
        setLogs(parsed.logs);
        setStoryNodeId(parsed.storyNodeId);
        setGameSettings(parsed.settings || INITIAL_SETTINGS);
        if (parsed.customArcs) setCustomArcs(parsed.customArcs);
        if (parsed.viewedEndings) setViewedEndings(parsed.viewedEndings);
        if (parsed.camp) setCamp(ensureCampIntegrity(parsed.camp));
    }, []);

    const loadRoster = useCallback((newCharacters: Character[]) => {
        setCharacters(newCharacters);
        setDay(0);
        setLogs([]);
        setInventory(INITIAL_INVENTORY);
        setActiveEnding(null);
        setViewedEndings([]);
        setCamp(INITIAL_CAMP);
    }, []);

    const addCharacter = (name: string, gender: Gender, mbti: MBTI, job: string, mentalState: MentalState, stats: Stats, initialRelations: { targetId: string, type: string }[] = []) => {
        const newId = crypto.randomUUID();
        const maxHp = 100 + (stats.con * 10);
        const maxSanity = 100 + (stats.int * 10);
        const skills = getInitialSkills(job); 
        
        const newChar: Character = { 
            id: newId, name, gender, mbti, job, stats, skills,
            hp: maxHp, maxHp, 
            sanity: mentalState !== 'Normal' ? 50 + (stats.int * 10) : maxSanity, 
            maxSanity, 
            fatigue: 0, infection: 0, hunger: MAX_HUNGER, hasMuzzle: false, status: 'Alive', mentalState: mentalState, inventory: [], relationships: {}, relationshipStatuses: {}, relationshipDurations: {}, killCount: 0, plannedAction: null, griefLogs: [] 
        };
        
        setCharacters(prev => {
            const updatedPrev = prev.map(existingChar => {
                const relDef = initialRelations.find(r => r.targetId === existingChar.id);
                if (relDef) {
                    const affinity = INITIAL_AFFINITY[relDef.type] || 0; 
                    const statusForNew = relDef.type as RelationshipStatus;
                    const statusForExisting = INVERSE_RELATIONS[relDef.type] || relDef.type as RelationshipStatus;
    
                    newChar.relationships[existingChar.id] = affinity; 
                    newChar.relationshipStatuses[existingChar.id] = statusForNew;
                    newChar.relationshipDurations[existingChar.id] = 0;
                    
                    return { 
                        ...existingChar, 
                        relationships: { ...existingChar.relationships, [newId]: affinity }, 
                        relationshipStatuses: { ...existingChar.relationshipStatuses, [newId]: statusForExisting },
                        relationshipDurations: { ...existingChar.relationshipDurations, [newId]: 0 }
                    };
                }
                return existingChar;
            });
            return [...updatedPrev, newChar];
        });
    };

    const nextDay = useCallback(async () => {
        if (loading || activeEnding) return;
        const living = characters.filter(c => c.status === 'Alive' || c.status === 'Infected' || c.status === 'Zombie');
        
        if (living.length === 0 && characters.length > 0 && !viewedEndings.includes('extinction_manual')) { 
            const ending = { 
                id: 'extinction_manual', 
                title: '인류의 황혼', 
                description: '모든 생존자가 사망했습니다. 고요한 폐허 속에 인류의 흔적만이 바람에 흩날립니다.', 
                icon: '💀', 
                type: 'BAD' 
            } as Ending;
            setActiveEnding(ending);
            setViewedEndings(prev => [...prev, ending.id]);
            return; 
        }
        
        setLoading(true); setError(null);
        try {
          const nextDayVal = day + 1;
          const result = await simulateDay(
              nextDayVal, 
              characters, 
              storyNodeId, 
              gameSettings, 
              forcedEvents, 
              inventory,
              storySelection?.id, 
              customArcs,
              viewedEndings, // Pass currently viewed endings
              camp // Pass camp state
          );
          
          if (storySelection?.penalty) {
              const p = storySelection.penalty;
              let update = result.updates.find(u => u.id === p.charId);
              if (!update) { update = { id: p.charId }; result.updates.push(update); }
              if (p.hp) update.hpChange = (update.hpChange || 0) + p.hp;
              if (p.sanity) update.sanityChange = (update.sanityChange || 0) + p.sanity;
          }
    
          setForcedEvents([]); setStorySelection(null); 
          
          setCharacters(prev => {
            const nextChars = prev.map(c => {
                const newDurations = { ...(c.relationshipDurations || {}) };
                Object.keys(c.relationshipStatuses || {}).forEach(tId => { newDurations[tId] = (newDurations[tId] || 0) + 1; });
                return { ...c, relationshipDurations: newDurations };
            });
    
            result.updates.forEach((update: CharacterUpdate) => {
              const index = nextChars.findIndex(c => c.id === update.id);
              if (index === -1) return;
              const char = { ...nextChars[index] };
              
              if (update.statChanges) {
                  const currentStats = char.stats || { str: 5, agi: 5, con: 5, int: 5, cha: 5 };
                  Object.entries(update.statChanges).forEach(([stat, change]) => {
                      const sKey = stat as keyof Stats;
                      if (sKey in currentStats) {
                          currentStats[sKey] = Math.max(0, Math.min(10, (currentStats[sKey] || 0) + (change || 0)));
                          if (sKey === 'con') char.maxHp = 100 + (currentStats.con * 10);
                          if (sKey === 'int') char.maxSanity = 100 + (currentStats.int * 10);
                      }
                  });
                  char.stats = currentStats;
              }
    
              if (update.skillsAdd) {
                  const currentSkills = Array.isArray(char.skills) ? char.skills : [];
                  update.skillsAdd.forEach(newSkill => {
                      if (!currentSkills.some(s => s.name === newSkill.name)) {
                          currentSkills.push(newSkill);
                      }
                  });
                  char.skills = currentSkills;
              }
              if (update.skillsRemove && Array.isArray(char.skills)) {
                  char.skills = char.skills.filter(s => !update.skillsRemove!.includes(s.name));
              }
    
              if (update.hpChange !== undefined) char.hp = Math.max(0, Math.min(char.maxHp, Math.round(char.hp + update.hpChange)));
              if (update.sanityChange !== undefined) char.sanity = Math.max(0, Math.min(char.maxSanity, Math.round(char.sanity + update.sanityChange)));
              if (update.fatigueChange !== undefined) char.fatigue = Math.max(0, Math.min(MAX_FATIGUE, Math.round(char.fatigue + update.fatigueChange)));
              if (update.infectionChange !== undefined) char.infection = Math.max(0, Math.min(MAX_INFECTION, Math.round(char.infection + update.infectionChange)));
              if (update.hungerChange !== undefined) char.hunger = Math.max(0, Math.min(MAX_HUNGER, Math.round(char.hunger + update.hungerChange)));
              if (update.status) char.status = update.status;
              if (update.mentalState) char.mentalState = update.mentalState;
              if (update.hasMuzzle !== undefined) char.hasMuzzle = update.hasMuzzle;
              if (update.killCountChange !== undefined) char.killCount += update.killCountChange;
              
              if (update.griefLogAdd) {
                  char.griefLogs = [...(char.griefLogs || []), update.griefLogAdd];
              }
    
              if (update.relationshipUpdates) {
                 const newRels = { ...(char.relationships || {}) }; 
                 const newStatuses = { ...(char.relationshipStatuses || {}) };
                 update.relationshipUpdates.forEach((rel: RelationshipUpdate) => {
                     const currentVal = newRels[rel.targetId] || 0;
                     newRels[rel.targetId] = Math.max(-100, Math.min(100, currentVal + rel.change));
                     if (rel.newStatus) newStatuses[rel.targetId] = rel.newStatus;
                 });
                 char.relationships = newRels; char.relationshipStatuses = newStatuses;
              }
              if (update.plannedAction === null) char.plannedAction = null;
              if (char.hp <= 0 && char.status !== 'Dead' && char.status !== 'Missing') char.status = 'Dead';
              nextChars[index] = char;
            });
            return nextChars;
          });
    
          if (result.loot && result.loot.length > 0) {
              setInventory(prev => [...prev, ...result.loot]);
          }
          if (result.inventoryRemove && result.inventoryRemove.length > 0) {
              setInventory(prev => {
                  let nextInv = [...prev];
                  result.inventoryRemove!.forEach(item => {
                      const idx = nextInv.indexOf(item);
                      if (idx > -1) nextInv.splice(idx, 1);
                  });
                  return nextInv;
              });
          }
    
          setLogs(prev => [...prev, { day: nextDayVal, narrative: result.narrative, events: result.events }]);
          setDay(nextDayVal); setStoryNodeId(result.nextStoryNodeId); 
          if (result.babyEvent) setPendingBaby(result.babyEvent);
          if (result.tarotEvent) setActiveTarot(true); 
          
          if (result.ending) {
              setActiveEnding(result.ending);
              setViewedEndings(prev => [...prev, result.ending!.id]);
          }

        } catch (err) { console.error(err); setError("시뮬레이션 오류 발생"); } finally { setLoading(false); }
    }, [day, characters, loading, storyNodeId, gameSettings, forcedEvents, storySelection, activeEnding, customArcs, inventory, viewedEndings, camp]); 

    const updateCharacter = (updatedChar: Character) => setCharacters(prev => prev.map(c => c.id === updatedChar.id ? updatedChar : c));
    const deleteCharacter = (id: string) => { 
        setCharacters(prev => prev.filter(c => c.id !== id).map(c => { 
            const nR = { ...c.relationships }; 
            const nS = { ...c.relationshipStatuses };
            const nD = { ...c.relationshipDurations };
            delete nR[id]; 
            delete nS[id];
            delete nD[id];
            return { 
                ...c, 
                relationships: nR, 
                relationshipStatuses: nS,
                relationshipDurations: nD 
            }; 
        })); 
    };
    const setPlannedAction = (charId: string, actionId: string | null) => { setCharacters(prev => prev.map(c => { if (c.id === charId) return { ...c, plannedAction: actionId }; return c; })); };
    
    // Camp Upgrade Function
    const upgradeFacility = (type: FacilityType) => {
        const config = CAMP_FACILITIES[type];
        const nextLevel = (camp.facilities[type] || 0) + 1;
        if (nextLevel > config.maxLevel) return;

        const cost = config.costPerLevel[nextLevel];
        if (!cost) return;

        // Check Inventory
        const inventoryCounts: Record<string, number> = {};
        inventory.forEach(item => { inventoryCounts[item] = (inventoryCounts[item] || 0) + 1; });

        for (const [item, count] of Object.entries(cost)) {
            if ((inventoryCounts[item] || 0) < count) {
                alert(`자원이 부족합니다! (${item} ${count - (inventoryCounts[item] || 0)}개 부족)`);
                return;
            }
        }

        // Deduct Items
        setInventory(prev => {
            const nextInv = [...prev];
            for (const [item, count] of Object.entries(cost)) {
                for (let i = 0; i < count; i++) {
                    const idx = nextInv.indexOf(item);
                    if (idx > -1) nextInv.splice(idx, 1);
                }
            }
            return nextInv;
        });

        // Upgrade
        setCamp(prev => ({
            ...prev,
            facilities: {
                ...prev.facilities,
                [type]: nextLevel
            }
        }));
    };

    // Assignment Logic
    const toggleFacilityAssignment = (type: FacilityType, charId: string) => {
        const facilityLevel = camp.facilities[type] || 0;
        if (facilityLevel === 0) {
            alert("건설되지 않은 시설에는 배치할 수 없습니다.");
            return;
        }

        const currentAssignments = camp.assignments[type] || [];
        if (currentAssignments.includes(charId)) {
            // Unassign
            setCamp(prev => ({
                ...prev,
                assignments: {
                    ...prev.assignments,
                    [type]: prev.assignments[type].filter(id => id !== charId)
                }
            }));
            return;
        }

        // Check Capacity
        const capacity = facilityLevel >= 5 ? 3 : facilityLevel >= 3 ? 2 : 1;
        if (currentAssignments.length >= capacity) {
            alert(`이 시설의 배치 인원이 꽉 찼습니다 (최대 ${capacity}명). 시설 레벨을 올리면 슬롯이 늘어납니다.`);
            return;
        }

        // Check assigned elsewhere
        for (const fType of Object.keys(camp.assignments)) {
            if (camp.assignments[fType as FacilityType].includes(charId)) {
                alert("이 생존자는 이미 다른 시설에 배치되어 있습니다.");
                return;
            }
        }

        // Assign
        setCamp(prev => ({
            ...prev,
            assignments: {
                ...prev.assignments,
                [type]: [...(prev.assignments[type] || []), charId]
            }
        }));
    };

    // Policy Change Handler
    const changePolicy = (category: keyof CampPolicies, value: string) => {
        setCamp(prev => ({
            ...prev,
            policies: {
                ...prev.policies,
                [category]: value
            }
        }));
    };

    return {
        day, characters, logs, inventory, gameSettings, setGameSettings,
        loading, error,
        forcedEvents, setForcedEvents,
        storyNodeId, storySelection, setStorySelection,
        pendingBaby, setPendingBaby,
        activeTarot, setActiveTarot,
        activeEnding, setActiveEnding,
        customArcs, setCustomArcs, 
        nextDay, addCharacter, updateCharacter, deleteCharacter, setPlannedAction,
        resetGame, loadGame, loadRoster, setInventory,
        camp, upgradeFacility, toggleFacilityAssignment, changePolicy // Added changePolicy
    };
};
