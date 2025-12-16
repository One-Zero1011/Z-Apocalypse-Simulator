
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Character, Gender, MBTI, DayLog, CharacterUpdate, RelationshipUpdate, RelationshipStatus, GameState, MentalState, GameSettings, ForcedEvent } from './types';
import { MAX_HP, MAX_SANITY, MAX_FATIGUE, MAX_INFECTION, MAX_HUNGER, INITIAL_INVENTORY, DEFAULT_RELATIONSHIP_VALUE } from './constants';
import { simulateDay } from './services/simulation';

// Components
import GameHeader from './components/GameHeader';
import CharacterForm from './components/CharacterForm';
import EventLog from './components/EventLog';
import InventoryPanel from './components/InventoryPanel';
import SurvivorList from './components/SurvivorList';
import ItemUseModal from './components/ItemUseModal';
import RelationshipMap from './components/RelationshipMap'; 
import SystemMenu from './components/SystemMenu'; 
import DeveloperMenu from './components/DeveloperMenu'; 
import ConfirmationModal from './components/ConfirmationModal'; 
import TutorialModal from './components/TutorialModal'; // New Import

// Define Item Effects
const ITEM_EFFECTS: Record<string, { desc: string, hp?: number, sanity?: number, fatigue?: number, cureMental?: boolean, cureInfection?: number, muzzle?: boolean, feed?: number }> = {
    '붕대': { desc: '체력 +15', hp: 15 },
    '항생제': { desc: '체력 +25', hp: 25 },
    '통조림': { desc: '피로도 -20', fatigue: -20 },
    '초콜릿': { desc: '정신력 +15', sanity: 15 },
    '비타민': { desc: '피로도 -10, 정신력 +5', fatigue: -10, sanity: 5 },
    '안정제': { desc: '불안정한 정신 상태 회복, 정신력 +25', sanity: 25, cureMental: true },
    '백신': { desc: '감염도 치료 (-50)', cureInfection: 50 },
    '입마개': { desc: '좀비에게 착용 시 물기 방지', muzzle: true },
    '고기': { desc: '좀비 허기 회복 (+30)', feed: 30 },
    '인육': { desc: '좀비 허기 완전 회복 (+100)', feed: 100 }
};

// Developer Item List (Effects + Starter Items)
const DEV_ITEM_LIST = Array.from(new Set([
    ...Object.keys(ITEM_EFFECTS),
    '생수 500ml',
    '맥가이버 칼',
    '권총',
    '지도',
    '무전기'
])).sort();

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
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false); // Tutorial State
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [inventory, setInventory] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [storyNodeId, setStoryNodeId] = useState<string | null>(null);
  const [forcedEvents, setForcedEvents] = useState<ForcedEvent[]>([]);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
      allowSameSexCouples: true, // Default ON
      developerMode: false, // Default OFF
      useMentalStates: true // Default ON
  });

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

  useEffect(() => {
    // 모바일 환경(768px 미만)에서는 스크롤 위치 유지, 데스크탑에서는 맨 위로 스크롤
    if (window.innerWidth >= 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [day]);

  // Initial Tutorial Check
  useEffect(() => {
      const tutorialSeen = localStorage.getItem('z-sim-tutorial-complete');
      if (tutorialSeen !== 'true') {
          setShowTutorial(true);
      }
  }, []);

  // --- Tutorial Handlers ---
  const closeTutorial = (neverShowAgain: boolean) => {
      setShowTutorial(false);
      if (neverShowAgain) {
          localStorage.setItem('z-sim-tutorial-complete', 'true');
      }
  };

  const openTutorial = () => {
      setShowSystemMenu(false);
      setShowTutorial(true);
  };

  // --- New Game System ---
  const handleNewGame = () => {
      const executeReset = () => {
          setDay(0);
          setCharacters([]);
          setLogs([]);
          setInventory([]);
          setSelectedItem(null);
          setStoryNodeId(null);
          setForcedEvents([]);
          setError(null);
          setConfirmState(null);
          
          setTimeout(() => {
              alert("새 게임이 시작되었습니다. 생존자를 등록해주세요.");
          }, 100);
      };

      setShowSystemMenu(false);

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

  // --- Save/Load Logic ---
  const handleSaveGame = () => {
      if (characters.length === 0 && day === 0) {
          setError("저장할 데이터가 없습니다.");
          return;
      }
      const gameState: GameState = {
          type: 'FULL_SAVE',
          version: 1,
          timestamp: new Date().toISOString(),
          day, characters, inventory, logs, storyNodeId, settings: gameSettings
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
      setShowSystemMenu(false);
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const content = e.target?.result as string;
              const parsed = JSON.parse(content);
              if (parsed.type === 'FULL_SAVE' && Array.isArray(parsed.characters)) {
                  const executeLoad = () => {
                      setDay(parsed.day || 0);
                      const loadedChars = parsed.characters.map((c: any) => ({
                          ...c,
                          mentalState: c.mentalState || 'Normal',
                          infection: c.infection || 0,
                          hunger: c.hunger || 0,
                          hasMuzzle: c.hasMuzzle || false,
                          job: c.job || ''
                      }));
                      setCharacters(loadedChars || []);
                      setInventory(parsed.inventory || []);
                      setLogs(parsed.logs || []);
                      setStoryNodeId(parsed.storyNodeId || null);
                      if (parsed.settings) {
                          setGameSettings({ 
                              allowSameSexCouples: true, 
                              developerMode: false, 
                              useMentalStates: true,
                              ...parsed.settings 
                          });
                      }
                      setError(null);
                      setConfirmState(null);
                      setForcedEvents([]);
                      setTimeout(() => alert(`${parsed.day}일차 게임 데이터를 성공적으로 불러왔습니다.`), 100);
                  };
                  if (characters.length > 0 || day > 0) {
                      setConfirmState({
                          title: "게임 불러오기",
                          message: "현재 데이터를 덮어쓰고 불러오시겠습니까?",
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

  const handleSaveRoster = () => {
      if (characters.length === 0) {
          setError("저장할 생존자가 없습니다.");
          return;
      }
      const rosterData = characters.map(c => ({
          id: c.id, name: c.name, gender: c.gender, mbti: c.mbti, job: c.job,
          hp: MAX_HP, sanity: MAX_SANITY, fatigue: 0, infection: 0, hunger: 0, hasMuzzle: false,
          status: 'Alive', mentalState: 'Normal', inventory: [...INITIAL_INVENTORY],
          relationships: c.relationships, relationshipStatuses: c.relationshipStatuses, killCount: 0
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
              if (Array.isArray(parsed) && parsed.length > 0) {
                  const executeLoadRoster = () => {
                      const initializedCharacters = parsed.map((c: any) => ({
                          ...c, hp: MAX_HP, sanity: MAX_SANITY, fatigue: 0, infection: 0, hunger: 0, hasMuzzle: false,
                          status: 'Alive', mentalState: 'Normal', inventory: [...INITIAL_INVENTORY], killCount: 0,
                          relationships: c.relationships || {}, relationshipStatuses: c.relationshipStatuses || {},
                          job: c.job || ''
                      })) as Character[];
                      setCharacters(initializedCharacters);
                      setDay(0); setLogs([]); setInventory([]); setSelectedItem(null); setStoryNodeId(null); setForcedEvents([]); setError(null); setConfirmState(null);
                      setTimeout(() => alert(`${parsed.length}명의 생존자 명단을 불러왔습니다.`), 100);
                  };
                  if (characters.length > 0 || day > 0) {
                       setConfirmState({
                          title: "명단 불러오기",
                          message: "현재 진행 중인 게임이 초기화됩니다. 계속하시겠습니까?",
                          action: executeLoadRoster,
                          isDangerous: true
                      });
                  } else {
                      executeLoadRoster();
                  }
              } else {
                  setError("올바르지 않은 명단 파일입니다.");
              }
          } catch (err) {
              console.error(err);
              setError("파일을 불러오는 중 오류가 발생했습니다.");
          }
      };
      reader.readAsText(file);
  };

  // --- Character Logic ---
  const addCharacter = (name: string, gender: Gender, mbti: MBTI, job: string, mentalState: MentalState, initialRelations: { targetId: string, type: string }[] = []) => {
    const newChar: Character = {
      id: crypto.randomUUID(), name, gender, mbti, job, hp: MAX_HP, sanity: MAX_SANITY, fatigue: 0, infection: 0, hunger: MAX_HUNGER, hasMuzzle: false,
      status: 'Alive', mentalState: mentalState, inventory: [...INITIAL_INVENTORY], relationships: {}, relationshipStatuses: {}, killCount: 0
    };

    setCharacters(prev => {
        // Step 1: Update existing characters with relationship to the NEW character
        // Step 2: Update NEW character with relationship to EXISTING characters
        
        const getReverseStatus = (status: string): RelationshipStatus => {
            if (status === 'Parent') return 'Child';
            if (status === 'Child') return 'Parent';
            if (status === 'Spouse') return 'Spouse';
            if (status === 'Lover') return 'Lover';
            if (status === 'Sibling') return 'Sibling';
            if (status === 'Rival') return 'Rival';
            if (status === 'Enemy') return 'Enemy';
            if (status === 'BestFriend') return 'BestFriend';
            if (status === 'Family') return 'Family';
            if (status === 'Colleague') return 'Colleague';
            if (status === 'Ex') return 'Ex';
            return 'None'; // Default or asymmetric (e.g. Savior)
        };

        const updatedPrev = prev.map(existingChar => {
            const relationDef = initialRelations.find(r => r.targetId === existingChar.id);
            if (relationDef) {
                // affinity calculation
                let affinity = DEFAULT_RELATIONSHIP_VALUE;
                switch (relationDef.type) {
                    case 'Spouse': affinity = 90; break;
                    case 'Child': affinity = 80; break;
                    case 'Parent': affinity = 80; break;
                    case 'Sibling': affinity = 70; break;
                    case 'Lover': affinity = 80; break;
                    case 'Family': affinity = 60; break;
                    case 'BestFriend': affinity = 60; break;
                    case 'Savior': affinity = 50; break;
                    case 'Friend': affinity = 30; break;
                    case 'Colleague': affinity = 15; break;
                    case 'Rival': affinity = -15; break;
                    case 'Ex': affinity = -20; break;
                    case 'Enemy': affinity = -50; break;
                }

                const newToExistingStatus = relationDef.type as RelationshipStatus;
                const existingToNewStatus = getReverseStatus(relationDef.type);

                newChar.relationships[existingChar.id] = affinity;
                newChar.relationshipStatuses[existingChar.id] = newToExistingStatus;

                return {
                    ...existingChar,
                    relationships: { ...existingChar.relationships, [newChar.id]: affinity },
                    relationshipStatuses: { ...existingChar.relationshipStatuses, [newChar.id]: existingToNewStatus }
                };
            }
            return existingChar;
        });

        return [...updatedPrev, newChar];
    });
  };

  const deleteCharacter = (id: string) => {
    setCharacters(prev => {
      const remaining = prev.filter(c => c.id !== id);
      return remaining.map(c => {
        const newRels = { ...c.relationships };
        const newStatuses = { ...c.relationshipStatuses };
        if (id in newRels) delete newRels[id];
        if (id in newStatuses) delete newStatuses[id];
        return { ...c, relationships: newRels, relationshipStatuses: newStatuses };
      });
    });
  };

  const handleUpdateCharacter = (updatedChar: Character) => {
      setCharacters(prev => prev.map(c => c.id === updatedChar.id ? updatedChar : c));
  };

  const handleDevAddInventory = (item: string, count: number) => {
      if (count <= 0) return;
      setInventory(prev => [...prev, ...Array(count).fill(item)]);
  };

  // --- Simulation Logic ---
  const handleNextDay = useCallback(async () => {
    if (loading) return;
    const living = characters.filter(c => c.status === 'Alive' || c.status === 'Infected' || c.status === 'Zombie');
    if (living.length === 0) {
        setError("더 이상 활동 가능한 생존자가 없습니다.");
        return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const nextDay = day + 1;
      const result = await simulateDay(nextDay, characters, storyNodeId, gameSettings, forcedEvents);
      setForcedEvents([]);

      setCharacters(prev => {
        const nextChars = [...prev];
        result.updates.forEach((update: CharacterUpdate) => {
          const index = nextChars.findIndex(c => c.id === update.id);
          if (index === -1) return;
          const char = { ...nextChars[index] };
          
          if (update.hpChange) char.hp = Math.max(0, Math.min(MAX_HP, char.hp + update.hpChange));
          if (update.sanityChange) char.sanity = Math.max(0, Math.min(MAX_SANITY, char.sanity + update.sanityChange));
          if (update.fatigueChange) char.fatigue = Math.max(0, Math.min(MAX_FATIGUE, char.fatigue + update.fatigueChange));
          if (update.infectionChange) char.infection = Math.max(0, Math.min(MAX_INFECTION, char.infection + update.infectionChange));
          if (update.hungerChange) char.hunger = Math.max(0, Math.min(MAX_HUNGER, char.hunger + update.hungerChange));
          if (update.hasMuzzle !== undefined) char.hasMuzzle = update.hasMuzzle;
          if (update.status) char.status = update.status;
          if (update.mentalState) char.mentalState = update.mentalState; 
          if (update.killCountChange) char.killCount += update.killCountChange;
          if (update.status === 'Zombie' && nextChars[index].status !== 'Zombie') char.hunger = MAX_HUNGER;
          if (update.inventoryAdd) char.inventory = [...char.inventory, ...update.inventoryAdd];
          if (update.inventoryRemove) char.inventory = char.inventory.filter(item => !update.inventoryRemove?.includes(item));

          if (update.relationshipUpdates) {
             const newRels = { ...char.relationships };
             const newStatuses = { ...char.relationshipStatuses };
             update.relationshipUpdates.forEach((rel: RelationshipUpdate) => {
                 const currentVal = newRels[rel.targetId] || 0;
                 newRels[rel.targetId] = Math.max(-100, Math.min(100, currentVal + rel.change));
                 if (rel.newStatus) newStatuses[rel.targetId] = rel.newStatus;
             });
             char.relationships = newRels;
             char.relationshipStatuses = newStatuses;
          }
          nextChars[index] = char;
        });
        return nextChars;
      });

      if (result.loot && result.loot.length > 0) setInventory(prev => [...prev, ...result.loot]);
      setLogs(prev => [...prev, { day: nextDay, narrative: result.narrative, events: result.events }]);
      setDay(nextDay);
      setStoryNodeId(result.nextStoryNodeId); 

    } catch (err) {
      console.error(err);
      setError("시뮬레이션 오류 발생. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [day, characters, loading, storyNodeId, gameSettings, forcedEvents]);

  const handleUseItem = (targetId: string) => {
      if (!selectedItem) return;
      const effect = ITEM_EFFECTS[selectedItem];
      if (!effect) return;

      setCharacters(prev => prev.map(char => {
          if (char.id === targetId) {
              const updatedChar = { ...char };
              const isZombie = char.status === 'Zombie';
              if (isZombie) {
                   if (effect.feed) updatedChar.hunger = Math.min(MAX_HUNGER, updatedChar.hunger + effect.feed);
                   else if (effect.muzzle) updatedChar.hasMuzzle = true;
                   else { if (effect.hp) updatedChar.hp = Math.min(MAX_HP, updatedChar.hp + effect.hp); }
                   return updatedChar;
              }
              if (effect.hp) updatedChar.hp = Math.min(MAX_HP, updatedChar.hp + effect.hp);
              if (effect.sanity) updatedChar.sanity = Math.min(MAX_SANITY, updatedChar.sanity + effect.sanity);
              if (effect.fatigue) updatedChar.fatigue = Math.max(0, updatedChar.fatigue + effect.fatigue);
              if (effect.cureInfection && updatedChar.infection > 0) {
                  updatedChar.infection = Math.max(0, updatedChar.infection - effect.cureInfection);
                  if (updatedChar.status === 'Infected' && updatedChar.infection === 0) updatedChar.status = 'Alive';
              }
              if (effect.cureMental && updatedChar.mentalState !== 'Normal') updatedChar.mentalState = 'Normal';
              return updatedChar;
          }
          return char;
      }));

      const idx = inventory.indexOf(selectedItem);
      if (idx > -1) {
          const newInv = [...inventory];
          newInv.splice(idx, 1);
          setInventory(newInv);
      }
      setSelectedItem(null);
  };

  const activeSurvivors = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing').length;
  const uiSurvivors = characters.filter(c => c.status === 'Alive' || c.status === 'Infected' || c.status === 'Zombie');

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto transition-colors duration-300 pb-20 md:pb-8">
      
      <GameHeader 
        day={day}
        survivorsCount={activeSurvivors}
        totalCount={characters.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        loading={loading}
        onNextDay={handleNextDay}
        developerMode={gameSettings.developerMode}
      />
        
      {/* Invisible inputs for file operations */}
      <input type="file" ref={rosterInputRef} style={{ display: 'none' }} accept=".json" onChange={handleLoadRosterFile} />
      <input type="file" ref={gameSaveInputRef} style={{ display: 'none' }} accept=".json" onChange={handleLoadGameFile} />

      {/* Control Buttons */}
      <div className="flex flex-wrap justify-end items-center gap-4 mb-4">
            {gameSettings.developerMode && (
                <button onClick={() => setShowDevMenu(true)} className="flex items-center gap-2 px-3 py-2 rounded font-bold text-sm transition-all border border-zombie-green text-zombie-green hover:bg-zombie-green hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>
                    디버그 {forcedEvents.length > 0 && <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">{forcedEvents.length}</span>}
                </button>
            )}
            <button onClick={() => setShowSystemMenu(true)} className="flex items-center gap-2 px-4 py-2 rounded font-bold text-sm transition-all border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                시스템(저장/불러오기)
            </button>
            <button onClick={() => setShowRelationshipMap(true)} disabled={activeSurvivors < 2} className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm transition-all border ${activeSurvivors < 2 ? 'border-slate-300 text-slate-400 cursor-not-allowed dark:border-slate-700 dark:text-slate-600' : 'border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
                관계도
            </button>
      </div>

      {/* Global Error Display */}
      {error && <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 rounded">{error}</div>}

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Logs */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <EventLog logs={logs} />
        </div>

        {/* Right Column: Game Interactive Area */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <CharacterForm 
                onAdd={addCharacter} 
                disabled={loading} 
                existingCharacters={characters} 
                useMentalStates={gameSettings.useMentalStates}
             />
             <InventoryPanel inventory={inventory} onSelectItem={setSelectedItem} />
          </div>
          <SurvivorList characters={characters} onDelete={deleteCharacter} />
        </div>
      </main>

      {/* Mobile Fixed Next Day Button */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <button onClick={handleNextDay} disabled={loading || characters.length === 0} className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all shadow-lg flex justify-center items-center gap-2 ${loading ? 'bg-slate-700 text-slate-400' : characters.length === 0 ? 'bg-slate-700 text-slate-500' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/50'}`}>
            {loading ? '진행 중...' : <>다음 날 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></>}
        </button>
      </div>

      {/* --- Modals & Overlays --- */}
      {showTutorial && <TutorialModal onClose={closeTutorial} />}
      
      <ItemUseModal 
        selectedItem={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onUseItem={handleUseItem}
        survivors={uiSurvivors}
        itemEffects={ITEM_EFFECTS}
      />

      {confirmState && <ConfirmationModal title={confirmState.title} message={confirmState.message} onConfirm={confirmState.action} onCancel={() => setConfirmState(null)} isDangerous={confirmState.isDangerous} />}
      {showRelationshipMap && <RelationshipMap characters={characters} onClose={() => setShowRelationshipMap(false)} />}
      
      {showSystemMenu && (
        <SystemMenu 
            onClose={() => setShowSystemMenu(false)} 
            onNewGame={handleNewGame} 
            onSaveRoster={handleSaveRoster} 
            onLoadRoster={handleLoadRosterTrigger} 
            onSaveGame={handleSaveGame} 
            onLoadGame={handleLoadGameTrigger} 
            allowSameSex={gameSettings.allowSameSexCouples} 
            onToggleSameSex={() => setGameSettings(prev => ({...prev, allowSameSexCouples: !prev.allowSameSexCouples}))} 
            developerMode={gameSettings.developerMode} 
            onToggleDeveloperMode={() => setGameSettings(prev => ({...prev, developerMode: !prev.developerMode}))}
            useMentalStates={gameSettings.useMentalStates}
            onToggleMentalStates={() => setGameSettings(prev => ({...prev, useMentalStates: !prev.useMentalStates}))} 
            onShowTutorial={openTutorial} 
        />
      )}
      
      {showDevMenu && <DeveloperMenu onClose={() => setShowDevMenu(false)} forcedEvents={forcedEvents} setForcedEvents={setForcedEvents} characters={characters} onUpdateCharacter={handleUpdateCharacter} onAddInventory={handleDevAddInventory} availableItems={DEV_ITEM_LIST} />}
    </div>
  );
};

export default App;
