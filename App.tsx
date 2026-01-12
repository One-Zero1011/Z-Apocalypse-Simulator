
import React, { useState, useRef, useEffect } from 'react';
import { Character, CharacterUpdate, GameState } from './types';
import { MAX_HUNGER } from './constants';
import { useGameEngine } from './hooks/useGameEngine';
import { saveToFile, parseSaveFile, parseRosterFile, createRosterData } from './utils/fileSystem';

// Components
import GameHeader from './components/GameHeader';
import CharacterForm from './components/CharacterForm';
import EventLog from './components/EventLog';
import InventoryPanel from './components/InventoryPanel';
import SurvivorList from './components/SurvivorList';
import GameModals from './components/GameModals';
import CampManagementModal from './components/CampManagementModal'; 

const ITEM_EFFECTS: Record<string, { desc: string, hp?: number, sanity?: number, fatigue?: number, cureMental?: boolean, cureInfection?: number, muzzle?: boolean, feed?: number }> = {
    '붕대': { desc: '체력 +15', hp: 15 },
    '항생제': { desc: '체력 +25', hp: 25 },
    '통조림': { desc: '피로도 -20', fatigue: -20 },
    '생수 500ml': { desc: '피로도 -10, 정신력 +5', fatigue: -10, sanity: 5 },
    '초콜릿': { desc: '정신력 +15', sanity: 15 },
    '비타민': { desc: '피로도 -10, 정신력 +5', fatigue: -10, sanity: 5 },
    '안정제': { desc: '불안정한 정신 상태 회복, 정신력 +25', sanity: 25, cureMental: true },
    '백신': { desc: '감염도 치료 (-50)', cureInfection: 50 },
    '입마개': { desc: '좀비에게 착용 시 물기 방지', muzzle: true },
    '고기': { desc: '좀비 허기 회복 (+30)', feed: 30 },
    '인육': { desc: '좀비 허기 완전 회복 (+100)', feed: 100 },
    '채소': { desc: '건강한 식량. 체력 +10, 좀비 허기 +20', hp: 10, feed: 20 }
};

interface ConfirmState { title: string; message: string; action: () => void; isDangerous?: boolean; }
type MobileTab = 'logs' | 'survivors' | 'manage';

const App: React.FC = () => {
  const engine = useGameEngine();
  
  // UI States
  const [darkMode, setDarkMode] = useState(false);
  const [showRelationshipMap, setShowRelationshipMap] = useState(false);
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [showGriefList, setShowGriefList] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false); 
  const [showCustomEvents, setShowCustomEvents] = useState(false); 
  const [showCampModal, setShowCampModal] = useState(false); 
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [planningCharacter, setPlanningCharacter] = useState<Character | null>(null);
  const [detailCharacter, setDetailCharacter] = useState<Character | null>(null);
  const [summaryCharacter, setSummaryCharacter] = useState<Character | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('logs');
  
  const rosterInputRef = useRef<HTMLInputElement>(null);
  const gameSaveInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark'); }, [darkMode]);
  useEffect(() => { if (localStorage.getItem('z-sim-tutorial-complete') !== 'true') setShowTutorial(true); }, []);

  // --- Handlers ---
  const closeTutorial = (neverShowAgain: boolean) => { setShowTutorial(false); if (neverShowAgain) localStorage.setItem('z-sim-tutorial-complete', 'true'); };
  const openTutorial = () => { setShowSystemMenu(false); setShowTutorial(true); };

  const handleNewGame = () => {
      setShowSystemMenu(false);
      if (engine.characters.length > 0 || engine.day > 0) {
          setConfirmState({ 
              title: "새 게임 시작", 
              message: "모든 데이터가 초기화됩니다.", 
              action: engine.resetGame, 
              isDangerous: true 
          });
      } else {
          engine.resetGame();
      }
  };
  
  const handleSaveGame = () => {
      const gameState: GameState = { type: 'FULL_SAVE', version: 1, timestamp: new Date().toISOString(), day: engine.day, characters: engine.characters, inventory: engine.inventory, logs: engine.logs, storyNodeId: engine.storyNodeId, settings: engine.gameSettings, customArcs: engine.customArcs, camp: engine.camp };
      saveToFile(`z-save-day${engine.day}.json`, gameState);
      setShowSystemMenu(false);
  };
  
  const handleLoadGameFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]; if (!file) return; setShowSystemMenu(false); const reader = new FileReader();
      reader.onload = (e) => {
          const loaded = parseSaveFile(e.target?.result as string);
          if (loaded) {
              const executeLoad = () => engine.loadGame(loaded);
              if (engine.characters.length > 0 || engine.day > 0) setConfirmState({ title: "불러오기", message: "현재 데이터를 덮어씁니다.", action: executeLoad, isDangerous: true });
              else executeLoad();
          }
      }; reader.readAsText(file);
  };

  const handleSaveRoster = () => {
      saveToFile(`z-roster.json`, createRosterData(engine.characters));
      setShowSystemMenu(false);
  };

  const handleLoadRosterFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]; if (!file) return; setShowSystemMenu(false); const reader = new FileReader();
      reader.onload = (e) => {
          const loaded = parseRosterFile(e.target?.result as string);
          if (loaded) engine.loadRoster(loaded);
      }; reader.readAsText(file);
  };

  const handleUpdateCharacter = (updatedChar: Character) => { engine.updateCharacter(updatedChar); };
  
  const handleSetPlannedAction = (charId: string, actionId: string | null) => { engine.setPlannedAction(charId, actionId); };
  
  const handleSaveEditedCharacter = (updatedChar: Character, relations: { targetId: string, status: any, affinity: number }[]) => {
      engine.updateCharacter(updatedChar);
      const newRels: Record<string, number> = {};
      const newStatuses: Record<string, any> = {};
      relations.forEach(r => {
          newRels[r.targetId] = r.affinity;
          newStatuses[r.targetId] = r.status;
      });
      engine.updateCharacter({ ...updatedChar, relationships: newRels, relationshipStatuses: newStatuses });
      setEditingCharacter(null);
  };

  const handleStoryChoiceSelected = (nextId: string, choiceText: string, penalty?: { charId: string, hp?: number, sanity?: number }) => {
      engine.setStorySelection({ id: nextId, text: choiceText, penalty });
  };

  const handleBabyBorn = (babyName: string) => {
      if (!engine.pendingBaby) return;
      const father = engine.characters.find(c => c.id === engine.pendingBaby!.fatherId);
      const mother = engine.characters.find(c => c.id === engine.pendingBaby!.motherId);
      if (father && mother) {
          engine.addCharacter(babyName, Math.random() > 0.5 ? 'Male' : 'Female', 'ISTJ', '아기', 'Normal', { str: 1, agi: 1, con: 2, int: 1, cha: 5 }, [{ targetId: father.id, type: 'Parent' }, { targetId: mother.id, type: 'Parent' }]);
      }
      engine.setPendingBaby(null);
  };

  const handleTarotResult = (updates: CharacterUpdate[], log: string) => {
    engine.setActiveTarot(false);
    engine.characters.forEach(c => {
        const u = updates.find(up => up.id === c.id);
        if (u) {
            const nc = { ...c };
            if (u.hpChange) nc.hp = Math.max(0, Math.min(nc.maxHp, nc.hp + u.hpChange));
            if (u.sanityChange) nc.sanity = Math.max(0, Math.min(nc.maxSanity, nc.sanity + u.sanityChange));
            if (u.fatigueChange) nc.fatigue = Math.max(0, Math.min(100, nc.fatigue + u.fatigueChange));
            if (u.infectionChange) nc.infection = Math.max(0, Math.min(100, nc.infection + u.infectionChange));
            if (u.relationshipUpdates) {
                const newRels = { ...nc.relationships };
                u.relationshipUpdates.forEach(r => {
                    newRels[r.targetId] = Math.max(-100, Math.min(100, (newRels[r.targetId] || 0) + r.change));
                });
                nc.relationships = newRels;
            }
            if (nc.hp <= 0 && nc.status !== 'Dead') nc.status = 'Dead';
            engine.updateCharacter(nc);
        }
    });
  };

  const handleUseItem = (targetId: string) => {
      if (!selectedItem) return;
      const effect = ITEM_EFFECTS[selectedItem];
      if (!effect) return;
      
      const target = engine.characters.find(c => c.id === targetId);
      if (target) {
          const updatedChar = { ...target };
          if (effect.hp) updatedChar.hp = Math.min(updatedChar.maxHp, updatedChar.hp + effect.hp);
          if (effect.sanity) updatedChar.sanity = Math.min(updatedChar.maxSanity, updatedChar.sanity + effect.sanity);
          if (effect.fatigue) updatedChar.fatigue = Math.max(0, updatedChar.fatigue + effect.fatigue);
          if (effect.cureMental) updatedChar.mentalState = 'Normal';
          if (effect.cureInfection) {
              updatedChar.infection = Math.max(0, updatedChar.infection - effect.cureInfection);
              if (updatedChar.infection === 0 && updatedChar.status === 'Infected') updatedChar.status = 'Alive';
          }
          if (effect.muzzle) updatedChar.hasMuzzle = true;
          if (effect.feed) updatedChar.hunger = Math.min(MAX_HUNGER, updatedChar.hunger + effect.feed);
          engine.updateCharacter(updatedChar);
      }

      engine.setInventory(prev => {
          const next = [...prev];
          const idx = next.indexOf(selectedItem);
          if (idx > -1) next.splice(idx, 1);
          return next;
      });
      setSelectedItem(null);
  };

  const livingSurvivors = engine.characters.filter(c => c.status === 'Alive' || c.status === 'Infected' || c.status === 'Zombie');

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto transition-colors duration-300 pb-20 md:pb-8">
      <GameHeader day={engine.day} survivorsCount={livingSurvivors.length} totalCount={engine.characters.length} darkMode={darkMode} setDarkMode={setDarkMode} developerMode={engine.gameSettings.developerMode} />
      
      <div className="flex flex-wrap justify-end gap-2 mb-4">
            {engine.gameSettings.developerMode && <button onClick={() => setShowDevMenu(true)} className="px-3 py-1.5 rounded font-bold text-xs border border-zombie-green text-zombie-green hover:bg-zombie-green hover:text-white transition-colors">디버그</button>}
            <button onClick={() => setShowCampModal(true)} className="px-3 py-1.5 rounded font-bold text-xs border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors flex items-center gap-1">
                <span>⛺</span> 거점 관리
            </button>
            <button onClick={() => setShowGriefList(true)} disabled={engine.characters.length === 0} className="px-3 py-1.5 rounded font-bold text-xs border border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-colors disabled:opacity-30">추모 및 감정</button>
            <button onClick={() => setShowRelationshipMap(true)} disabled={livingSurvivors.length < 2} className="px-3 py-1.5 rounded font-bold text-xs border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-30">인물 관계도</button>
            <button onClick={() => setShowSystemMenu(true)} className="px-3 py-1.5 rounded font-bold text-xs border border-slate-300 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">시스템 설정</button>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className={`md:col-span-5 lg:col-span-4 ${activeMobileTab === 'logs' ? 'block' : 'hidden'} md:block`}><EventLog logs={engine.logs} /></div>
        <div className={`md:col-span-7 lg:col-span-8 space-y-8 ${activeMobileTab !== 'logs' ? 'block' : 'hidden'} md:block`}>
          <div className={`${activeMobileTab === 'manage' ? 'flex flex-col' : 'hidden'} md:grid md:grid-cols-1 xl:grid-cols-2 gap-8`}>
             <CharacterForm 
                onAdd={engine.addCharacter} 
                disabled={engine.loading} 
                existingCharacters={engine.characters} 
                useMentalStates={engine.gameSettings.useMentalStates} 
                friendshipMode={engine.gameSettings.friendshipMode} 
             />
             <InventoryPanel inventory={engine.inventory} onSelectItem={setSelectedItem} />
          </div>
          <div className={`${activeMobileTab === 'survivors' ? 'block' : 'hidden'} md:block`}><SurvivorList characters={engine.characters} onDelete={engine.deleteCharacter} onEdit={setEditingCharacter} onPlan={setPlanningCharacter} onShowDetail={setDetailCharacter} onShowSummary={setSummaryCharacter} /></div>
        </div>
      </main>

      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden flex gap-2">
          <button onClick={engine.nextDay} disabled={engine.loading || engine.characters.length === 0} className="flex-1 py-4 rounded-xl font-bold bg-red-600 text-white shadow-lg active:scale-95 transition-transform">{engine.loading ? '진행 중...' : '다음 날'}</button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex md:hidden z-50">
          <button onClick={() => setActiveMobileTab('logs')} className={`flex-1 py-3 text-xs font-bold ${activeMobileTab === 'logs' ? 'text-red-600 border-t-2 border-red-600' : 'text-slate-500'}`}>일지</button>
          <button onClick={() => setActiveMobileTab('survivors')} className={`flex-1 py-3 text-xs font-bold ${activeMobileTab === 'survivors' ? 'text-red-600 border-t-2 border-red-600' : 'text-slate-500'}`}>생존자</button>
          <button onClick={() => setActiveMobileTab('manage')} className={`flex-1 py-3 text-xs font-bold ${activeMobileTab === 'manage' ? 'text-red-600 border-t-2 border-red-600' : 'text-slate-500'}`}>관리</button>
      </div>

      <div className="fixed bottom-10 right-10 z-40 hidden md:block"><button onClick={engine.nextDay} disabled={engine.loading || engine.characters.length === 0} className="px-8 py-4 rounded-full font-bold text-xl bg-red-600 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">{engine.loading ? '진행 중...' : '다음 날'}</button></div>

      <GameModals 
        engine={engine}
        uiState={{
            showRelationshipMap, setShowRelationshipMap,
            showSystemMenu, setShowSystemMenu,
            showDevMenu, setShowDevMenu,
            showGriefList, setShowGriefList,
            showTutorial, setShowTutorial,
            showCustomEvents, setShowCustomEvents,
            selectedItem, setSelectedItem,
            editingCharacter, setEditingCharacter,
            planningCharacter, setPlanningCharacter,
            detailCharacter, setDetailCharacter,
            summaryCharacter, setSummaryCharacter,
            confirmState, setConfirmState
        }}
        handlers={{
            handleNewGame, handleSaveGame, handleLoadGameFile,
            handleSaveRoster, handleLoadRosterFile, handleUpdateCharacter,
            handleSetPlannedAction, handleSaveEditedCharacter,
            handleStoryChoiceSelected, handleBabyBorn, handleTarotResult, handleUseItem,
            openTutorial, closeTutorial
        }}
        refs={{ rosterInputRef, gameSaveInputRef }}
      />

      {showCampModal && (
          <CampManagementModal 
              camp={engine.camp} 
              inventory={engine.inventory} 
              characters={engine.characters} 
              onUpgrade={engine.upgradeFacility} 
              onAssignmentToggle={engine.toggleFacilityAssignment}
              onPolicyChange={engine.changePolicy} // Pass handler
              onClose={() => setShowCampModal(false)} 
          />
      )}
    </div>
  );
};

export default App;
