
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Character, Gender, MBTI, DayLog, CharacterUpdate, RelationshipUpdate, RelationshipStatus, GameState, MentalState } from './types';
import { MAX_HP, MAX_SANITY, MAX_FATIGUE, INITIAL_INVENTORY, DEFAULT_RELATIONSHIP_VALUE } from './constants';
import CharacterForm from './components/CharacterForm';
import CharacterCard from './components/CharacterCard';
import EventLog from './components/EventLog';
import RelationshipMap from './components/RelationshipMap'; 
import SystemMenu from './components/SystemMenu'; 
import ConfirmationModal from './components/ConfirmationModal'; 
import { simulateDay } from './services/simulation';

// Define Item Effects
const ITEM_EFFECTS: Record<string, { desc: string, hp?: number, sanity?: number, fatigue?: number, cureMental?: boolean }> = {
    '붕대': { desc: '체력 +20', hp: 20 },
    '항생제': { desc: '체력 +30', hp: 30 },
    '통조림': { desc: '피로도 -20', fatigue: -20 },
    '초콜릿': { desc: '정신력 +15', sanity: 15 },
    '비타민': { desc: '피로도 -10, 정신력 +5', fatigue: -10, sanity: 5 },
    '정신병약': { desc: '정신병 치료, 정신력 +30', sanity: 30, cureMental: true } // New Item Effect
};

// Confirmation State Type
interface ConfirmState {
    title: string;
    message: string;
    action: () => void;
    isDangerous?: boolean;
}

const App: React.FC = () => {
  const [day, setDay] = useState(0);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showRelationshipMap, setShowRelationshipMap] = useState(false);
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  
  // Custom Confirmation Modal State
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  
  // New Inventory State
  const [inventory, setInventory] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Story Chain State
  const [storyNodeId, setStoryNodeId] = useState<string | null>(null);

  // File Input Refs
  const rosterInputRef = useRef<HTMLInputElement>(null);
  const gameSaveInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll to top whenever the day changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [day]);

  // --- New Game System ---
  const handleNewGame = () => {
      // 1. Logic to execute
      const executeReset = () => {
          setDay(0);
          setCharacters([]);
          setLogs([]);
          setInventory([]);
          setSelectedItem(null);
          setStoryNodeId(null); // Reset story chain
          setError(null);
          setConfirmState(null); // Close modal
          
          setTimeout(() => {
              alert("새 게임이 시작되었습니다. 생존자를 등록해주세요.");
          }, 100);
      };

      setShowSystemMenu(false); // Close menu first

      // 2. Check conditions
      if (characters.length > 0 || day > 0) {
          setConfirmState({
              title: "새 게임 시작",
              message: "정말로 새 게임을 시작하시겠습니까?\n현재 진행 중인 모든 데이터가 삭제되고 초기화됩니다.",
              action: executeReset,
              isDangerous: true
          });
      } else {
          executeReset();
      }
  };

  // --- Full Game Save/Load System ---

  const handleSaveGame = () => {
      if (characters.length === 0 && day === 0) {
          setError("저장할 데이터가 없습니다.");
          return;
      }

      const gameState: GameState = {
          type: 'FULL_SAVE',
          version: 1,
          timestamp: new Date().toISOString(),
          day,
          characters,
          inventory,
          logs,
          storyNodeId // Save story state
      };

      const blob = new Blob([JSON.stringify(gameState, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `z-save-day${day}-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowSystemMenu(false);
  };

  const handleLoadGameTrigger = () => {
      if (gameSaveInputRef.current) {
          gameSaveInputRef.current.value = '';
          gameSaveInputRef.current.click();
      }
  };

  const handleLoadGameFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Close system menu if open
      setShowSystemMenu(false);

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const content = e.target?.result as string;
              const parsed = JSON.parse(content);
              
              if (parsed.type === 'FULL_SAVE' && Array.isArray(parsed.characters)) {
                  
                  const executeLoad = () => {
                      setDay(parsed.day || 0);
                      // Fallback for mentalState for old save files
                      const loadedChars = parsed.characters.map((c: any) => ({
                          ...c,
                          mentalState: c.mentalState || 'Normal'
                      }));
                      setCharacters(loadedChars || []);
                      setInventory(parsed.inventory || []);
                      setLogs(parsed.logs || []);
                      setStoryNodeId(parsed.storyNodeId || null); // Load story state
                      setError(null);
                      setConfirmState(null);
                      
                      setTimeout(() => {
                          alert(`${parsed.day}일차 게임 데이터를 성공적으로 불러왔습니다.`);
                      }, 100);
                  };

                  if (characters.length > 0 || day > 0) {
                      setConfirmState({
                          title: "게임 불러오기",
                          message: "현재 진행 중인 게임을 중단하고 선택한 파일을 불러오시겠습니까?\n'확인'을 누르면 현재 데이터가 덮어씌워집니다.",
                          action: executeLoad,
                          isDangerous: true
                      });
                  } else {
                      executeLoad();
                  }

              } else {
                  setError("올바르지 않은 세이브 파일입니다.");
              }
          } catch (err) {
              console.error(err);
              setError("파일을 불러오는 중 오류가 발생했습니다.");
          }
      };
      reader.readAsText(file);
  };


  // --- Roster Save/Load System ---

  const handleSaveRoster = () => {
      if (characters.length === 0) {
          setError("저장할 생존자가 없습니다.");
          return;
      }

      const rosterData = characters.map(c => ({
          id: c.id, 
          name: c.name,
          gender: c.gender,
          mbti: c.mbti,
          hp: MAX_HP,
          sanity: MAX_SANITY,
          fatigue: 0,
          status: 'Alive',
          mentalState: 'Normal', // Reset Mental
          inventory: [...INITIAL_INVENTORY],
          relationships: c.relationships,
          relationshipStatuses: c.relationshipStatuses,
          killCount: 0
      }));

      const blob = new Blob([JSON.stringify(rosterData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `z-roster-export-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowSystemMenu(false);
  };

  const handleLoadRosterTrigger = () => {
      if (rosterInputRef.current) {
          rosterInputRef.current.value = '';
          rosterInputRef.current.click();
      }
  };

  const handleLoadRosterFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setShowSystemMenu(false);

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const content = e.target?.result as string;
              const parsed = JSON.parse(content);
              
              if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name && parsed[0].mbti) {
                  
                  const executeLoadRoster = () => {
                      const initializedCharacters = parsed.map((c: any) => ({
                          ...c,
                          hp: MAX_HP,
                          sanity: MAX_SANITY,
                          fatigue: 0,
                          status: 'Alive', 
                          mentalState: 'Normal', // Initialize
                          inventory: [...INITIAL_INVENTORY],
                          killCount: 0,
                          relationships: c.relationships || {},
                          relationshipStatuses: c.relationshipStatuses || {}
                      })) as Character[];

                      setCharacters(initializedCharacters);
                      setDay(0);
                      setLogs([]);
                      setInventory([]); 
                      setSelectedItem(null);
                      setStoryNodeId(null);
                      setError(null);
                      setConfirmState(null);
                      
                      setTimeout(() => {
                          alert(`${parsed.length}명의 생존자 명단을 불러왔습니다. 모든 상태가 1일차로 초기화되었습니다.`);
                      }, 100);
                  };

                  if (characters.length > 0 || day > 0) {
                       setConfirmState({
                          title: "명단 불러오기",
                          message: "현재 진행 중인 게임을 중단하고 생존자 명단을 불러오시겠습니까?\n'확인'을 누르면 현재 게임이 초기화되고 새 게임이 시작됩니다.",
                          action: executeLoadRoster,
                          isDangerous: true
                      });
                  } else {
                      executeLoadRoster();
                  }

              } else {
                  setError("올바르지 않은 생존자 명단 파일입니다.");
              }
          } catch (err) {
              console.error(err);
              setError("파일을 불러오는 중 오류가 발생했습니다.");
          }
      };
      reader.readAsText(file);
  };

  // ---------------------------

  const addCharacter = (name: string, gender: Gender, mbti: MBTI, mentalState: MentalState, initialRelation?: { targetId: string, type: string }) => {
    const newChar: Character = {
      id: crypto.randomUUID(),
      name,
      gender,
      mbti,
      hp: MAX_HP,
      sanity: MAX_SANITY,
      fatigue: 0, 
      status: 'Alive',
      mentalState: mentalState, // Apply selected mental state
      inventory: [...INITIAL_INVENTORY],
      relationships: {},
      relationshipStatuses: {},
      killCount: 0
    };

    // Initialize relationships with existing characters
    setCharacters(prev => {
      const updatedPrev = prev.map(c => {
        let affinity = DEFAULT_RELATIONSHIP_VALUE;
        let status: RelationshipStatus = 'None';

        // Check if this existing character is the target of the initial relation
        if (initialRelation && c.id === initialRelation.targetId) {
            switch (initialRelation.type) {
                case 'Lover':
                    affinity = 80;
                    status = 'Lover';
                    break;
                case 'Family':
                    affinity = 60;
                    status = 'Family';
                    break;
                case 'BestFriend':
                    affinity = 60;
                    status = 'BestFriend';
                    break;
                case 'Savior':
                    affinity = 50;
                    status = 'Savior';
                    break;
                case 'Friend':
                    affinity = 30;
                    // Friend is generic, keep status None or maybe treat as None for now to allow evolution
                    break;
                case 'Colleague':
                    affinity = 15;
                    status = 'Colleague';
                    break;
                case 'Rival':
                    affinity = -15;
                    status = 'Rival';
                    break;
                case 'Ex':
                    affinity = -20;
                    status = 'Ex';
                    break;
                case 'Enemy':
                    affinity = -50;
                    status = 'Enemy';
                    break;
            }
        }

        return {
          ...c,
          relationships: {
            ...c.relationships,
            [newChar.id]: affinity // Symmetric initialization for simplicity
          },
          relationshipStatuses: {
             ...c.relationshipStatuses,
             [newChar.id]: status
          }
        };
      });
      
      // Initialize new char relationships from the other side
      updatedPrev.forEach(c => {
        let affinity = DEFAULT_RELATIONSHIP_VALUE;
        let status: RelationshipStatus = 'None';

        if (initialRelation && c.id === initialRelation.targetId) {
            switch (initialRelation.type) {
                case 'Lover':
                    affinity = 80;
                    status = 'Lover';
                    break;
                case 'Family':
                    affinity = 60;
                    status = 'Family';
                    break;
                case 'BestFriend':
                    affinity = 60;
                    status = 'BestFriend';
                    break;
                case 'Savior':
                    affinity = 50;
                    status = 'Savior';
                    break;
                case 'Friend':
                    affinity = 30;
                    break;
                case 'Colleague':
                    affinity = 15;
                    status = 'Colleague';
                    break;
                case 'Rival':
                    affinity = -15;
                    status = 'Rival';
                    break;
                case 'Ex':
                    affinity = -20;
                    status = 'Ex';
                    break;
                case 'Enemy':
                    affinity = -50;
                    status = 'Enemy';
                    break;
            }
        }
        
        newChar.relationships[c.id] = affinity;
        newChar.relationshipStatuses[c.id] = status;
      });

      return [...updatedPrev, newChar];
    });
  };

  const deleteCharacter = (id: string) => {
    setCharacters(prev => {
      const remaining = prev.filter(c => c.id !== id);
      // Clean up relationships in remaining characters
      return remaining.map(c => {
        const newRels = { ...c.relationships };
        const newStatuses = { ...c.relationshipStatuses };
        if (id in newRels) delete newRels[id];
        if (id in newStatuses) delete newStatuses[id];
        return { ...c, relationships: newRels, relationshipStatuses: newStatuses };
      });
    });
  };

  const handleNextDay = useCallback(async () => {
    if (loading) return;
    if (characters.filter(c => c.status === 'Alive').length === 0) {
        setError("더 이상 생존자가 없습니다.");
        return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const nextDay = day + 1;
      // Pass storyNodeId to simulateDay
      const result = await simulateDay(nextDay, characters, storyNodeId);

      // Apply Updates
      setCharacters(prev => {
        const nextChars = [...prev];
        
        result.updates.forEach((update: CharacterUpdate) => {
          const index = nextChars.findIndex(c => c.id === update.id);
          if (index === -1) return;

          const char = { ...nextChars[index] };
          
          // Apply basic stats
          if (update.hpChange) char.hp = Math.max(0, Math.min(MAX_HP, char.hp + update.hpChange));
          if (update.sanityChange) char.sanity = Math.max(0, Math.min(MAX_SANITY, char.sanity + update.sanityChange));
          if (update.fatigueChange) char.fatigue = Math.max(0, Math.min(MAX_FATIGUE, char.fatigue + update.fatigueChange)); // Fatigue
          
          if (update.status) char.status = update.status;
          if (update.mentalState) char.mentalState = update.mentalState; // Update Mental State

          if (update.killCountChange) char.killCount += update.killCountChange;

          // Apply Inventory (Character private inventory logic preserved but not main focus)
          if (update.inventoryAdd) char.inventory = [...char.inventory, ...update.inventoryAdd];
          if (update.inventoryRemove) {
             char.inventory = char.inventory.filter(item => !update.inventoryRemove?.includes(item));
          }

          // Apply Relationships & Statuses
          if (update.relationshipUpdates) {
             const newRels = { ...char.relationships };
             const newStatuses = { ...char.relationshipStatuses };
             
             update.relationshipUpdates.forEach((rel: RelationshipUpdate) => {
                 // Update Score
                 const currentVal = newRels[rel.targetId] || 0;
                 newRels[rel.targetId] = Math.max(-100, Math.min(100, currentVal + rel.change));
                 
                 // Update Status (Lover/Ex)
                 if (rel.newStatus) {
                     newStatuses[rel.targetId] = rel.newStatus;
                 }
             });
             char.relationships = newRels;
             char.relationshipStatuses = newStatuses;
          }

          nextChars[index] = char;
        });

        return nextChars;
      });

      // Update Global Inventory with loot
      if (result.loot && result.loot.length > 0) {
          setInventory(prev => [...prev, ...result.loot]);
      }

      // Add Log
      setLogs(prev => [...prev, {
        day: nextDay,
        narrative: result.narrative,
        events: result.events
      }]);

      setDay(nextDay);
      setStoryNodeId(result.nextStoryNodeId); // Update story chain

    } catch (err) {
      console.error(err);
      setError("시뮬레이션 오류 발생. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [day, characters, loading, storyNodeId]); // Add storyNodeId to dependency

  const handleUseItem = (targetId: string) => {
      if (!selectedItem) return;

      const effect = ITEM_EFFECTS[selectedItem];
      if (!effect) return;

      setCharacters(prev => prev.map(char => {
          if (char.id === targetId) {
              const updatedChar = { ...char };
              if (effect.hp) updatedChar.hp = Math.min(MAX_HP, updatedChar.hp + effect.hp);
              if (effect.sanity) updatedChar.sanity = Math.min(MAX_SANITY, updatedChar.sanity + effect.sanity);
              if (effect.fatigue) updatedChar.fatigue = Math.max(0, updatedChar.fatigue + effect.fatigue);
              
              // Mental Illness Cure Logic
              if (effect.cureMental && updatedChar.mentalState !== 'Normal') {
                  updatedChar.mentalState = 'Normal';
              }

              return updatedChar;
          }
          return char;
      }));

      // Remove item from inventory
      const idx = inventory.indexOf(selectedItem);
      if (idx > -1) {
          const newInv = [...inventory];
          newInv.splice(idx, 1);
          setInventory(newInv);
      }

      setSelectedItem(null);
  };

  const activeSurvivors = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing').length;
  const livingCharacters = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto transition-colors duration-300">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-300 dark:border-slate-700 pb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-slate-800 dark:text-slate-100">
              <span className="text-red-600">Z</span>-SIMULATOR
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">MBTI 성격 기반 생존 시뮬레이터</p>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            title="다크 모드 전환"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Hidden File Inputs */}
        <input 
            type="file" 
            ref={rosterInputRef} 
            style={{ display: 'none' }} 
            accept=".json" 
            onChange={handleLoadRosterFile} 
        />
        <input 
            type="file" 
            ref={gameSaveInputRef} 
            style={{ display: 'none' }} 
            accept=".json" 
            onChange={handleLoadGameFile} 
        />

        <div className="flex flex-wrap justify-end items-center gap-4">
            {/* System Menu Button */}
            <button
                onClick={() => setShowSystemMenu(true)}
                className="flex items-center gap-2 px-4 py-2 rounded font-bold text-sm transition-all border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                시스템 (저장/불러오기)
            </button>

            <button
                onClick={() => setShowRelationshipMap(true)}
                disabled={activeSurvivors < 2}
                className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm transition-all border
                    ${activeSurvivors < 2 
                        ? 'border-slate-300 text-slate-400 cursor-not-allowed dark:border-slate-700 dark:text-slate-600'
                        : 'border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
                    }
                `}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
                관계도 (Map)
            </button>

          <div className="text-right pl-4 border-l border-slate-300 dark:border-slate-700 hidden sm:block">
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">생존 일수</div>
            <div className="text-3xl font-mono font-bold text-zombie-green">{day}</div>
          </div>
          <div className="text-right pl-4 border-l border-slate-300 dark:border-slate-700 hidden sm:block">
             <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">생존자</div>
             <div className="text-3xl font-mono font-bold text-slate-800 dark:text-white">{activeSurvivors}/{characters.length}</div>
          </div>
          <button
            onClick={handleNextDay}
            disabled={loading || characters.length === 0}
            className={`
              ml-2 px-6 py-3 rounded font-bold text-lg uppercase tracking-wide transition-all shadow-md items-center gap-2 hidden md:flex
              ${loading 
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-wait' 
                : characters.length === 0 
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20'
              }
            `}
          >
            {loading ? '진행 중...' : (
                <>
                다음 날
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
                </>
            )}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      {/* Item Use Modal */}
      {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-600">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{selectedItem} 사용</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      {ITEM_EFFECTS[selectedItem]?.desc || '효과 없음'}
                  </p>
                  
                  <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                      <p className="text-xs font-bold uppercase text-slate-400 mb-1">대상 선택</p>
                      {livingCharacters.length > 0 ? livingCharacters.map(char => (
                          <button
                              key={char.id}
                              onClick={() => handleUseItem(char.id)}
                              className="w-full text-left p-3 rounded bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-transparent hover:border-blue-300 transition-colors flex justify-between items-center"
                          >
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                    {char.name}
                                    {char.mentalState !== 'Normal' && <span className="text-[10px] bg-red-100 text-red-800 px-1 rounded">{char.mentalState}</span>}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 space-x-2">
                                  <span>HP: {char.hp}</span>
                                  <span className={char.sanity <= 10 ? 'text-red-500 font-bold' : ''}>멘탈: {char.sanity}</span>
                              </div>
                          </button>
                      )) : (
                          <p className="text-center text-slate-500 py-4">사용할 수 있는 생존자가 없습니다.</p>
                      )}
                  </div>
                  
                  <button 
                      onClick={() => setSelectedItem(null)}
                      className="w-full py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                      취소
                  </button>
              </div>
          </div>
      )}

      {/* Confirmation Modal (New) */}
      {confirmState && (
          <ConfirmationModal
            title={confirmState.title}
            message={confirmState.message}
            onConfirm={confirmState.action}
            onCancel={() => setConfirmState(null)}
            isDangerous={confirmState.isDangerous}
          />
      )}

      {/* Relationship Map Modal */}
      {showRelationshipMap && (
          <RelationshipMap 
            characters={characters} 
            onClose={() => setShowRelationshipMap(false)} 
          />
      )}
      
      {/* System Menu Modal */}
      {showSystemMenu && (
        <SystemMenu 
            onClose={() => setShowSystemMenu(false)}
            onNewGame={handleNewGame} // Pass function
            onSaveRoster={handleSaveRoster}
            onLoadRoster={handleLoadRosterTrigger}
            onSaveGame={handleSaveGame}
            onLoadGame={handleLoadGameTrigger}
        />
      )}

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Log */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <EventLog logs={logs} />
          
          <button
            onClick={handleNextDay}
            disabled={loading || characters.length === 0}
            className={`
              mt-6 w-full py-4 rounded-xl font-bold text-xl uppercase tracking-wide transition-all shadow-lg flex justify-center items-center gap-2 md:hidden
              ${loading 
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-wait' 
                : characters.length === 0 
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20'
              }
            `}
          >
            {loading ? '진행 중...' : (
                <>
                다음 날
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
                </>
            )}
          </button>
        </div>

        {/* Right Column: Game State */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">
          
          {/* Add Character Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <CharacterForm 
                onAdd={addCharacter} 
                disabled={loading} 
                existingCharacters={characters} // Passed existing characters
             />
             
             {/* Shared Inventory Panel (Replaced Status Panel) */}
             <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col shadow-sm h-full">
                <div className="flex justify-between items-center mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        📦 캠프 인벤토리 
                        <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">{inventory.length}</span>
                    </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto min-h-[120px]">
                    {inventory.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                            <p>보관된 아이템이 없습니다.</p>
                            <p className="text-xs mt-1">시뮬레이션을 진행하여 물자를 확보하세요.</p>
                            <p className="text-xs mt-1"> 아이템은 터치해 사용이 가능합니다.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {inventory.map((item, idx) => (
                                <button
                                    key={`${item}-${idx}`}
                                    onClick={() => setSelectedItem(item)}
                                    className="bg-slate-100 dark:bg-slate-700 p-2 rounded border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-blue-900 hover:border-blue-300 transition-all flex flex-col items-center justify-center gap-1 group relative"
                                    title="클릭하여 사용"
                                >
                                    {/* Simple Icon Mapping */}
                                    <span className="text-lg">
                                        {item === '붕대' ? '🩹' : 
                                         item === '통조림' ? '🥫' : 
                                         item === '항생제' ? '💊' : 
                                         item === '초콜릿' ? '🍫' : 
                                         item === '비타민' ? '🍋' : 
                                         item === '정신병약' ? '💊' : '📦'}
                                    </span>
                                    <span>{item}</span>
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
             </div>
          </div>

          {/* Survivors Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              생존자 목록 <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">{characters.length}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {characters.map(char => (
                <CharacterCard 
                  key={char.id} 
                  character={char} 
                  allCharacters={characters}
                  onDelete={deleteCharacter}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
