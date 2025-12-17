
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Character, Gender, MBTI, DayLog, CharacterUpdate, RelationshipUpdate, RelationshipStatus, GameState, MentalState, GameSettings, ForcedEvent, BabyEventData } from './types';
import { MAX_HP, MAX_SANITY, MAX_FATIGUE, MAX_INFECTION, MAX_HUNGER, INITIAL_INVENTORY, DEFAULT_RELATIONSHIP_VALUE, MBTI_TYPES } from './constants';
import { simulateDay } from './services/simulation';
import { STORY_NODES } from './services/events/storyNodes';

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
import TutorialModal from './components/TutorialModal';
import StoryChoiceModal from './components/StoryChoiceModal'; 
import BabyNamingModal from './components/BabyNamingModal'; 
import EditCharacterModal from './components/EditCharacterModal'; 
import PlannedActionModal from './components/PlannedActionModal';
import ProbabilityModal from './components/ProbabilityModal';
import TarotModal from './components/TarotModal'; // New Import

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

const DEV_ITEM_LIST = Array.from(new Set([...Object.keys(ITEM_EFFECTS), '생수 500ml', '맥가이버 칼', '권총', '지도', '무전기'])).sort();

interface ConfirmState { title: string; message: string; action: () => void; isDangerous?: boolean; }
type MobileTab = 'logs' | 'survivors' | 'manage';

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
  const [showProbabilities, setShowProbabilities] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false); 
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [inventory, setInventory] = useState<string[]>(INITIAL_INVENTORY); // INITIAL_INVENTORY 반영
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [storyNodeId, setStoryNodeId] = useState<string | null>(null);
  const [forcedEvents, setForcedEvents] = useState<ForcedEvent[]>([]);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
      allowSameSexCouples: true, allowIncest: false, pureLoveMode: false, restrictStudentDating: true, friendshipMode: false, 
      restrictMinorAdultActions: true, developerMode: false, useMentalStates: true, enableInteractions: true, enableStoryChoices: true, enablePregnancy: true, showEventEffects: false 
  });
  const [storySelection, setStorySelection] = useState<{ id: string, text: string } | null>(null);
  const [pendingBaby, setPendingBaby] = useState<BabyEventData | null>(null);
  const [activeTarot, setActiveTarot] = useState(false); // Tarot Event State
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [planningCharacter, setPlanningCharacter] = useState<Character | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('logs');
  const rosterInputRef = useRef<HTMLInputElement>(null);
  const gameSaveInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark'); }, [darkMode]);
  useEffect(() => { if (window.innerWidth >= 768) window.scrollTo({ top: 0, behavior: 'smooth' }); }, [day]);
  useEffect(() => { if (localStorage.getItem('z-sim-tutorial-complete') !== 'true') setShowTutorial(true); }, []);

  const closeTutorial = (neverShowAgain: boolean) => { setShowTutorial(false); if (neverShowAgain) localStorage.setItem('z-sim-tutorial-complete', 'true'); };
  const openTutorial = () => { setShowSystemMenu(false); setShowTutorial(true); };
  
  const handleNewGame = () => {
      const executeReset = () => { setDay(0); setCharacters([]); setLogs([]); setInventory(INITIAL_INVENTORY); setSelectedItem(null); setStoryNodeId(null); setForcedEvents([]); setStorySelection(null); setPendingBaby(null); setEditingCharacter(null); setPlanningCharacter(null); setActiveTarot(false); setError(null); setConfirmState(null); };
      setShowSystemMenu(false);
      if (characters.length > 0 || day > 0) setConfirmState({ title: "새 게임 시작", message: "모든 데이터가 초기화됩니다.", action: executeReset, isDangerous: true });
      else executeReset();
  };
  
  const handleSaveGame = () => {
      const gameState: GameState = { type: 'FULL_SAVE', version: 1, timestamp: new Date().toISOString(), day, characters, inventory, logs, storyNodeId, settings: gameSettings };
      const blob = new Blob([JSON.stringify(gameState, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `z-save-day${day}.json`; a.click(); URL.revokeObjectURL(url); setShowSystemMenu(false);
  };
  
  const handleLoadGameTrigger = () => { if (gameSaveInputRef.current) { gameSaveInputRef.current.value = ''; gameSaveInputRef.current.click(); } };
  
  const handleLoadGameFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]; if (!file) return; setShowSystemMenu(false); const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const content = e.target?.result as string;
              const parsed = JSON.parse(content);
              if (parsed.type === 'FULL_SAVE') {
                  const executeLoad = () => {
                      setDay(parsed.day); setCharacters(parsed.characters); setInventory(parsed.inventory); setLogs(parsed.logs); setStoryNodeId(parsed.storyNodeId); setGameSettings(parsed.settings || gameSettings);
                  };
                  if (characters.length > 0 || day > 0) setConfirmState({ title: "불러오기", message: "현재 데이터를 덮어씁니다.", action: executeLoad, isDangerous: true });
                  else executeLoad();
              }
          } catch (err) { setError("파일 오류"); }
      }; reader.readAsText(file);
  };

  const handleSaveRoster = () => {
      const rosterData = characters.map(c => ({ ...c, hp: MAX_HP, sanity: MAX_SANITY, fatigue: 0, infection: 0, hunger: MAX_HUNGER, status: 'Alive', killCount: 0, plannedAction: null, mentalState: 'Normal', hasMuzzle: false }));
      const blob = new Blob([JSON.stringify(rosterData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `z-roster.json`; a.click(); URL.revokeObjectURL(url); setShowSystemMenu(false);
  };

  const handleLoadRosterTrigger = () => { if (rosterInputRef.current) { rosterInputRef.current.value = ''; rosterInputRef.current.click(); } };

  const handleLoadRosterFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]; if (!file) return; setShowSystemMenu(false); const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const content = e.target?.result as string;
              const parsed = JSON.parse(content);
              if (Array.isArray(parsed)) {
                  setCharacters(parsed.map(c => ({ ...c, status: 'Alive', hp: MAX_HP, sanity: MAX_SANITY, plannedAction: null })));
                  setDay(0); setLogs([]); setInventory(INITIAL_INVENTORY);
              }
          } catch (err) { setError("파일 오류"); }
      }; reader.readAsText(file);
  };

  const addCharacter = (name: string, gender: Gender, mbti: MBTI, job: string, mentalState: MentalState, initialRelations: { targetId: string, type: string }[] = []) => {
    const newId = crypto.randomUUID();
    const newChar: Character = { id: newId, name, gender, mbti, job, hp: MAX_HP, sanity: MAX_SANITY, fatigue: 0, infection: 0, hunger: MAX_HUNGER, hasMuzzle: false, status: 'Alive', mentalState: mentalState, inventory: [], relationships: {}, relationshipStatuses: {}, relationshipDurations: {}, killCount: 0, plannedAction: null };
    
    const getReverseStatus = (status: string): RelationshipStatus => {
        if (status === 'Parent') return 'Child'; if (status === 'Child') return 'Parent'; if (status === 'Guardian') return 'Ward'; if (status === 'Ward') return 'Guardian';
        if (status === 'Spouse') return 'Spouse'; if (status === 'Lover') return 'Lover'; if (status === 'Sibling') return 'Sibling'; if (status === 'Family') return 'Family';
        if (status === 'BestFriend') return 'BestFriend'; if (status === 'Friend') return 'Friend'; return 'None';
    };

    setCharacters(prev => {
        const updatedPrev = prev.map(existingChar => {
            const relDef = initialRelations.find(r => r.targetId === existingChar.id);
            if (relDef) {
                const affinity = 50; 
                newChar.relationships[existingChar.id] = affinity; 
                newChar.relationshipStatuses[existingChar.id] = relDef.type as RelationshipStatus;
                newChar.relationshipDurations[existingChar.id] = 0;
                return { 
                    ...existingChar, 
                    relationships: { ...existingChar.relationships, [newId]: affinity }, 
                    relationshipStatuses: { ...existingChar.relationshipStatuses, [newId]: getReverseStatus(relDef.type) },
                    relationshipDurations: { ...existingChar.relationshipDurations, [newId]: 0 }
                };
            }
            return existingChar;
        });
        return [...updatedPrev, newChar];
    });
  };

  const deleteCharacter = (id: string) => { setCharacters(prev => prev.filter(c => c.id !== id).map(c => { const nR = { ...c.relationships }; delete nR[id]; return { ...c, relationships: nR }; })); };
  const handleUpdateCharacter = (updatedChar: Character) => { setCharacters(prev => prev.map(c => c.id === updatedChar.id ? updatedChar : c)); };
  const handleSetPlannedAction = (charId: string, actionId: string | null) => { setCharacters(prev => prev.map(c => c.id === charId ? { ...c, plannedAction: actionId } : c)); };
  
  const handleSaveEditedCharacter = (updatedChar: Character, relations: { targetId: string, status: RelationshipStatus, affinity: number }[]) => {
      setCharacters(prev => prev.map(c => {
          if (c.id === updatedChar.id) return { ...updatedChar };
          const rel = relations.find(r => r.targetId === c.id);
          if (rel) return { ...c, relationships: { ...c.relationships, [updatedChar.id]: rel.affinity }, relationshipStatuses: { ...c.relationshipStatuses, [updatedChar.id]: rel.status } };
          return c;
      }));
      setEditingCharacter(null);
  };

  const handleBabyBorn = (babyName: string) => {
      if (!pendingBaby) return;
      const father = characters.find(c => c.id === pendingBaby.fatherId);
      const mother = characters.find(c => c.id === pendingBaby.motherId);
      if (father && mother) {
          const babyGender: Gender = Math.random() > 0.5 ? 'Male' : 'Female';
          const babyMbti: MBTI = MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)];
          const siblings = characters.filter(c => c.relationshipStatuses[father.id] === 'Parent' || c.relationshipStatuses[mother.id] === 'Parent');
          const initialRelations = [{ targetId: father.id, type: 'Parent' }, { targetId: mother.id, type: 'Parent' }, ...siblings.map(s => ({ targetId: s.id, type: 'Sibling' }))];
          addCharacter(babyName, babyGender, babyMbti, '아기', 'Normal', initialRelations);
      }
      setPendingBaby(null);
  };

  const handleTarotResult = (updates: CharacterUpdate[], log: string) => {
    setActiveTarot(false);
    setCharacters(prev => {
        const nextChars = [...prev];
        updates.forEach(update => {
            const idx = nextChars.findIndex(c => c.id === update.id);
            if (idx === -1) return;
            const char = { ...nextChars[idx] };
            if (update.hpChange !== undefined) char.hp = Math.max(0, Math.min(MAX_HP, Math.round(char.hp + update.hpChange)));
            if (update.sanityChange !== undefined) char.sanity = Math.max(0, Math.min(MAX_SANITY, Math.round(char.sanity + update.sanityChange)));
            if (update.fatigueChange !== undefined) char.fatigue = Math.max(0, Math.min(MAX_FATIGUE, Math.round(char.fatigue + update.fatigueChange)));
            if (update.infectionChange !== undefined) char.infection = Math.max(0, Math.min(MAX_INFECTION, Math.round(char.infection + update.infectionChange)));
            
            if (update.relationshipUpdates) {
                const nR = { ...char.relationships };
                update.relationshipUpdates.forEach(r => { nR[r.targetId] = Math.max(-100, Math.min(100, (nR[r.targetId] || 0) + r.change)); });
                char.relationships = nR;
            }
            if (char.hp <= 0 && char.status !== 'Dead' && char.status !== 'Missing') char.status = 'Dead';
            nextChars[idx] = char;
        });
        return nextChars;
    });
    setLogs(prev => {
        const nextLogs = [...prev];
        if (nextLogs.length > 0) {
            nextLogs[nextLogs.length - 1].events.push(log);
        }
        return nextLogs;
    });
  };

  const handleNextDay = useCallback(async () => {
    if (loading) return;
    const living = characters.filter(c => c.status === 'Alive' || c.status === 'Infected' || c.status === 'Zombie');
    if (living.length === 0 && characters.length > 0) { setError("살아남은 생존자가 없습니다."); return; }
    
    setLoading(true); setError(null); setActiveMobileTab('logs');
    try {
      const nextDay = day + 1;
      const result = await simulateDay(nextDay, characters, storyNodeId, gameSettings, forcedEvents, storySelection?.id);
      setForcedEvents([]); setStorySelection(null); 
      
      setCharacters(prev => {
        const nextChars = prev.map(c => {
            const newDurations = { ...c.relationshipDurations };
            Object.keys(c.relationshipStatuses).forEach(tId => {
                newDurations[tId] = (newDurations[tId] || 0) + 1;
            });
            return { ...c, relationshipDurations: newDurations };
        });

        result.updates.forEach((update: CharacterUpdate) => {
          const index = nextChars.findIndex(c => c.id === update.id);
          if (index === -1) return;
          const char = { ...nextChars[index] };
          
          if (update.hpChange !== undefined) char.hp = Math.max(0, Math.min(MAX_HP, Math.round(char.hp + update.hpChange)));
          if (update.sanityChange !== undefined) char.sanity = Math.max(0, Math.min(MAX_SANITY, Math.round(char.sanity + update.sanityChange)));
          if (update.fatigueChange !== undefined) char.fatigue = Math.max(0, Math.min(MAX_FATIGUE, Math.round(char.fatigue + update.fatigueChange)));
          if (update.infectionChange !== undefined) char.infection = Math.max(0, Math.min(MAX_INFECTION, Math.round(char.infection + update.infectionChange)));
          if (update.hungerChange !== undefined) char.hunger = Math.max(0, Math.min(MAX_HUNGER, Math.round(char.hunger + update.hungerChange)));
          if (update.status) char.status = update.status;
          if (update.mentalState) char.mentalState = update.mentalState;
          if (update.hasMuzzle !== undefined) char.hasMuzzle = update.hasMuzzle;
          if (update.killCountChange !== undefined) char.killCount += update.killCountChange;
          
          if (update.inventoryAdd) char.inventory = [...char.inventory, ...update.inventoryAdd];
          if (update.inventoryRemove) {
              const newCharInv = [...char.inventory];
              update.inventoryRemove.forEach(remItem => { const idx = newCharInv.indexOf(remItem); if (idx > -1) newCharInv.splice(idx, 1); });
              char.inventory = newCharInv;
          }

          if (update.relationshipUpdates) {
             const newRels = { ...char.relationships }; 
             const newStatuses = { ...char.relationshipStatuses };
             update.relationshipUpdates.forEach((rel: RelationshipUpdate) => {
                 const currentVal = newRels[rel.targetId] || 0;
                 newRels[rel.targetId] = Math.max(-100, Math.min(100, currentVal + rel.change));
                 if (rel.newStatus) newStatuses[rel.targetId] = rel.newStatus;
             });
             char.relationships = newRels; char.relationshipStatuses = newStatuses;
          }

          if (update.plannedAction === null) char.plannedAction = null;
          
          if (char.hp <= 0 && char.status !== 'Dead' && char.status !== 'Missing') char.status = 'Dead';
          if (char.status === 'Zombie' && char.hunger <= 0) char.status = 'Dead';

          nextChars[index] = char;
        });
        return nextChars;
      });

      if (result.loot && result.loot.length > 0) setInventory(prev => [...prev, ...result.loot]);
      if (result.inventoryRemove && result.inventoryRemove.length > 0) {
          setInventory(prev => {
              const newInv = [...prev];
              result.inventoryRemove!.forEach(remItem => { const idx = newInv.indexOf(remItem); if (idx > -1) newInv.splice(idx, 1); });
              return newInv;
          });
      }

      setLogs(prev => [...prev, { day: nextDay, narrative: result.narrative, events: result.events }]);
      setDay(nextDay); setStoryNodeId(result.nextStoryNodeId); 
      if (result.babyEvent) setPendingBaby(result.babyEvent);
      if (result.tarotEvent) setActiveTarot(true); 
    } catch (err) { console.error(err); setError("시뮬레이션 오류 발생"); } finally { setLoading(false); }
  }, [day, characters, loading, storyNodeId, gameSettings, forcedEvents, storySelection]);

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
              
              const pIdx = updatedChar.inventory.indexOf(selectedItem);
              if (pIdx > -1) {
                  const newPInv = [...updatedChar.inventory];
                  newPInv.splice(pIdx, 1);
                  updatedChar.inventory = newPInv;
              }
              return updatedChar;
          }
          return char;
      }));

      const idx = inventory.indexOf(selectedItem);
      if (idx > -1) { const newInv = [...inventory]; newInv.splice(idx, 1); setInventory(newInv); }
      setSelectedItem(null);
  };

  const currentStoryHasChoices = gameSettings.enableStoryChoices && storyNodeId && STORY_NODES[storyNodeId]?.next?.some(n => n.choiceText);
  // 타로용 캐릭터 리스트: 시뮬레이션 직후의 실시간 생존자(HP 0 이하 제외) 리스트 사용
  const livingCharIdsAfterSim = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing' && c.hp > 0).map(c => c.id);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto transition-colors duration-300 pb-20 md:pb-8">
      <GameHeader day={day} survivorsCount={characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing').length} totalCount={characters.length} darkMode={darkMode} setDarkMode={setDarkMode} developerMode={gameSettings.developerMode} />
      <div className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-dark-slate/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 -mx-4 px-4 mb-6 flex justify-between shadow-sm">
          <button onClick={() => setActiveMobileTab('logs')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeMobileTab === 'logs' ? 'border-zombie-green text-zombie-green' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>📜 생존 일지</button>
          <button onClick={() => setActiveMobileTab('survivors')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeMobileTab === 'survivors' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>👥 생존자 목록</button>
          <button onClick={() => setActiveMobileTab('manage')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeMobileTab === 'manage' ? 'border-purple-500 text-purple-500' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>🎒 정비/영입</button>
      </div>
      <div className="flex flex-wrap justify-end gap-4 mb-4">
            {gameSettings.developerMode && (
              <>
                <button onClick={() => setShowDevMenu(true)} className="px-3 py-2 rounded font-bold text-sm border border-zombie-green text-zombie-green hover:bg-zombie-green hover:text-white">디버그</button>
                <button onClick={() => setShowProbabilities(true)} className="px-3 py-2 rounded font-bold text-sm border border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white">확률표</button>
              </>
            )}
            <button onClick={() => setShowSystemMenu(true)} className="px-4 py-2 rounded font-bold text-sm border border-slate-300 dark:border-slate-700 dark:text-slate-300">시스템</button>
            <button onClick={() => setShowRelationshipMap(true)} disabled={characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing').length < 2} className="px-4 py-2 rounded font-bold text-sm border border-blue-500 text-blue-600 dark:text-blue-400">관계도</button>
      </div>
      {error && <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded">{error}</div>}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className={`md:col-span-5 lg:col-span-4 ${activeMobileTab === 'logs' ? 'block' : 'hidden'} md:block`}><EventLog logs={logs} /></div>
        <div className={`md:col-span-7 lg:col-span-8 space-y-8 ${activeMobileTab !== 'logs' ? 'block' : 'hidden'} md:block`}>
          <div className={`${activeMobileTab === 'manage' ? 'flex flex-col' : 'hidden'} md:grid md:grid-cols-1 xl:grid-cols-2 gap-8`}>
             <CharacterForm onAdd={addCharacter} disabled={loading} existingCharacters={characters} useMentalStates={gameSettings.useMentalStates} friendshipMode={gameSettings.friendshipMode} />
             <InventoryPanel inventory={inventory} onSelectItem={setSelectedItem} />
          </div>
          <div className={`${activeMobileTab === 'survivors' ? 'block' : 'hidden'} md:block`}><SurvivorList characters={characters} onDelete={deleteCharacter} onEdit={setEditingCharacter} onPlan={setPlanningCharacter} /></div>
        </div>
      </main>
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden"><button onClick={handleNextDay} disabled={loading || characters.length === 0} className="w-full py-4 rounded-xl font-bold bg-red-600 text-white shadow-lg">{loading ? '진행 중...' : '다음 날'}</button></div>
      <div className="fixed bottom-10 right-10 z-40 hidden md:block"><button onClick={handleNextDay} disabled={loading || characters.length === 0} className="px-8 py-4 rounded-full font-bold text-xl bg-red-600 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">{loading ? '진행 중...' : '다음 날'}</button></div>
      {showTutorial && <TutorialModal onClose={closeTutorial} />}
      {currentStoryHasChoices && storyNodeId && (
          <StoryChoiceModal node={STORY_NODES[storyNodeId]} onSelect={(id, text) => setStorySelection({ id, text })} currentSelection={storySelection} characters={characters} inventory={inventory} />
      )}
      {pendingBaby && characters.find(c => c.id === pendingBaby.fatherId) && characters.find(c => c.id === pendingBaby.motherId) && (
          <BabyNamingModal father={characters.find(c => c.id === pendingBaby.fatherId)!} mother={characters.find(c => c.id === pendingBaby.motherId)!} onConfirm={handleBabyBorn} onCancel={() => setPendingBaby(null)} />
      )}
      {activeTarot && <TarotModal livingCharIds={livingCharIdsAfterSim} onResult={handleTarotResult} />}
      <ItemUseModal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} onUseItem={handleUseItem} survivors={characters.filter(c => c.status === 'Alive' || c.status === 'Infected' || c.status === 'Zombie')} itemEffects={ITEM_EFFECTS} />
      {confirmState && <ConfirmationModal title={confirmState.title} message={confirmState.message} onConfirm={confirmState.action} onCancel={() => setConfirmState(null)} isDangerous={confirmState.isDangerous} />}
      {showRelationshipMap && <RelationshipMap characters={characters} onClose={() => setShowRelationshipMap(false)} />}
      {editingCharacter && <EditCharacterModal character={editingCharacter} allCharacters={characters} onSave={handleSaveEditedCharacter} onClose={() => setEditingCharacter(null)} friendshipMode={gameSettings.friendshipMode} />}
      {planningCharacter && <PlannedActionModal character={planningCharacter} onSelect={(actionId) => handleSetPlannedAction(planningCharacter.id, actionId)} onClose={() => setPlanningCharacter(null)} />}
      {showProbabilities && <ProbabilityModal characters={characters} settings={gameSettings} onClose={() => setShowProbabilities(false)} />}
      {showSystemMenu && <SystemMenu onClose={() => setShowSystemMenu(false)} onNewGame={handleNewGame} onSaveRoster={handleSaveRoster} onLoadRoster={handleLoadRosterTrigger} onSaveGame={handleSaveGame} onLoadGame={handleLoadGameTrigger} allowSameSex={gameSettings.allowSameSexCouples} onToggleSameSex={() => setGameSettings(p => ({...p, allowSameSexCouples: !p.allowSameSexCouples}))} allowIncest={gameSettings.allowIncest} onToggleIncest={() => setGameSettings(p => ({...p, allowIncest: !p.allowIncest}))} pureLoveMode={gameSettings.pureLoveMode} onTogglePureLove={() => setGameSettings(p => ({...p, pureLoveMode: !p.pureLoveMode}))} restrictStudentDating={gameSettings.restrictStudentDating} onToggleStudentDating={() => setGameSettings(p => ({...p, restrictStudentDating: !p.restrictStudentDating}))} friendshipMode={gameSettings.friendshipMode} onToggleFriendshipMode={() => setGameSettings(p => ({...p, friendshipMode: !p.friendshipMode}))} restrictMinorAdultActions={gameSettings.restrictMinorAdultActions} onToggleRestrictMinorAdultActions={() => setGameSettings(p => ({...p, restrictMinorAdultActions: !p.restrictMinorAdultActions}))} developerMode={gameSettings.developerMode} onToggleDeveloperMode={() => setGameSettings(p => ({...p, developerMode: !p.developerMode}))} useMentalStates={gameSettings.useMentalStates} onToggleMentalStates={() => setGameSettings(p => ({...p, useMentalStates: !p.useMentalStates}))} allowInteractions={gameSettings.enableInteractions} onToggleInteractions={() => setGameSettings(p => ({...p, enableInteractions: !p.enableInteractions}))} enableStoryChoices={gameSettings.enableStoryChoices} onToggleStoryChoices={() => setGameSettings(p => ({...p, enableStoryChoices: !p.enableStoryChoices}))} enablePregnancy={gameSettings.enablePregnancy} onTogglePregnancy={() => setGameSettings(p => ({...p, enablePregnancy: !p.enablePregnancy}))} showEventEffects={gameSettings.showEventEffects} onToggleEventEffects={() => setGameSettings(p => ({...p, showEventEffects: !p.showEventEffects}))} onShowTutorial={openTutorial} />}
      {showDevMenu && <DeveloperMenu onClose={() => setShowDevMenu(false)} forcedEvents={forcedEvents} setForcedEvents={setForcedEvents} characters={characters} onUpdateCharacter={handleUpdateCharacter} onAddInventory={(item, count) => setInventory(prev => [...prev, ...Array(count).fill(item)])} availableItems={DEV_ITEM_LIST} />}
      <input type="file" ref={rosterInputRef} style={{ display: 'none' }} onChange={handleLoadRosterFile} />
      <input type="file" ref={gameSaveInputRef} style={{ display: 'none' }} onChange={handleLoadGameFile} />
    </div>
  );
};

export default App;
