
import React, { useState } from 'react';
import { Character, ForcedEvent } from '../types';
import DevStats from './DevStats';
import DevItems from './DevItems';
import DevEventLists from './DevEventLists';

interface Props {
  onClose: () => void;
  forcedEvents: ForcedEvent[];
  setForcedEvents: React.Dispatch<React.SetStateAction<ForcedEvent[]>>;
  characters: Character[];
  onUpdateCharacter: (character: Character) => void;
  onAddInventory: (item: string, count: number) => void;
  availableItems: string[];
}

type TabType = 'STORY' | 'MBTI' | 'INTERACTION' | 'STATS' | 'ITEMS';

const DeveloperMenu: React.FC<Props> = ({ onClose, forcedEvents, setForcedEvents, characters, onUpdateCharacter, onAddInventory, availableItems }) => {
  const [mainTab, setMainTab] = useState<TabType>('STORY');
  const [activeStatCharId, setActiveStatCharId] = useState<string>('');

  // Selection Modal State
  const [selectionModal, setSelectionModal] = useState<{
      isOpen: boolean;
      type: 'MBTI' | 'INTERACTION';
      key: string;
      index: number;
      preview: string;
      requiredMbti?: string;
  } | null>(null);

  const [selectedActor, setSelectedActor] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');

  const activeCharacters = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');

  // --- Handlers ---
  const handleStorySelect = (id: string, text: string) => {
      setForcedEvents(prev => {
          const others = prev.filter(e => e.type !== 'STORY');
          const exists = prev.find(e => e.type === 'STORY' && e.key === id);
          if (exists) return others;
          return [...others, { type: 'STORY', key: id, previewText: text }];
      });
  };

  const openSelectionModal = (type: 'MBTI' | 'INTERACTION', key: string, index: number, preview: string) => {
      setSelectionModal({ isOpen: true, type, key, index, preview, requiredMbti: type === 'MBTI' ? key : undefined });
      setSelectedActor('');
      setSelectedTarget('');
  };

  const confirmSelection = () => {
      if (!selectionModal || !selectedActor) return;
      
      const actorName = characters.find(c => c.id === selectedActor)?.name || 'Unknown';
      let previewText = `[${selectionModal.key}] ${actorName}`;
      if (selectionModal.type === 'INTERACTION' && selectedTarget) {
          const targetName = characters.find(c => c.id === selectedTarget)?.name || 'Target';
          previewText += ` -> ${targetName}`;
      }
      previewText += `: ${selectionModal.preview.substring(0, 20)}...`;

      setForcedEvents(prev => [...prev, {
          type: selectionModal.type,
          key: selectionModal.key,
          index: selectionModal.index,
          actorId: selectedActor,
          targetId: selectedTarget || undefined,
          previewText
      }]);
      setSelectionModal(null);
  };

  const removeEvent = (idx: number) => {
      setForcedEvents(prev => prev.filter((_, i) => i !== idx));
  };

  const handleStatUpdate = (char: Character, field: keyof Character | 'relationship', value: any, targetId?: string) => {
      if (field === 'relationship' && targetId) {
          const newRels = { ...char.relationships, [targetId]: value };
          onUpdateCharacter({ ...char, relationships: newRels });
      } else {
          onUpdateCharacter({ ...char, [field as keyof Character]: value });
      }
  };

  // Find active story id to highlight
  const activeStoryId = forcedEvents.find(e => e.type === 'STORY')?.key;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-5xl w-full h-[90vh] overflow-hidden border border-zombie-green dark:border-zombie-green/30 flex flex-col relative">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-zombie-green flex items-center gap-2 font-mono">
              🛠️ EVENT CONTROLLER
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Selected Events Queue */}
        <div className="bg-slate-100 dark:bg-slate-800 p-2 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex justify-between items-center mb-1 px-1">
                <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                    Next Turn Events Queue ({forcedEvents.length})
                </span>
                {forcedEvents.length > 0 && (
                    <button onClick={() => setForcedEvents([])} className="text-[10px] text-red-500 hover:text-red-700 underline">
                        Clear All
                    </button>
                )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 min-h-[40px] items-center">
                {forcedEvents.length === 0 ? (
                    <span className="text-sm text-slate-400 dark:text-slate-600 px-2 italic">
                        -- No overrides queued (Standard Simulation) --
                    </span>
                ) : (
                    forcedEvents.map((ev, idx) => (
                        <div key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap shadow-sm border ${
                            ev.type === 'STORY' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700' :
                            ev.type === 'MBTI' ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700' :
                            'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700'
                        }`}>
                            <span className="font-bold">{ev.type}</span>
                            <span className="opacity-75 truncate max-w-[150px]">{ev.previewText || ev.key}</span>
                            <button onClick={() => removeEvent(idx)} className="ml-1 hover:text-red-600 font-bold">×</button>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shrink-0">
            {(['STORY', 'MBTI', 'INTERACTION', 'STATS', 'ITEMS'] as TabType[]).map(tab => (
                <button
                    key={tab}
                    onClick={() => setMainTab(tab)}
                    className={`flex-1 py-3 text-sm font-bold tracking-wide transition-colors ${
                        mainTab === tab 
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {/* --- Content Area --- */}
        <div className="flex-1 overflow-hidden relative">
            
            {/* Event Lists (Story, MBTI, Interaction) */}
            {(mainTab === 'STORY' || mainTab === 'MBTI' || mainTab === 'INTERACTION') && (
                <DevEventLists 
                    type={mainTab} 
                    activeId={activeStoryId} 
                    onSelectStory={handleStorySelect} 
                    onOpenModal={openSelectionModal} 
                />
            )}

            {/* Stats Tab */}
            {mainTab === 'STATS' && (
                <div className="flex h-full">
                    {/* Character Selector */}
                    <div className="w-1/3 md:w-1/4 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-2 space-y-1">
                        {characters.map(char => (
                            <button 
                                key={char.id} 
                                onClick={() => setActiveStatCharId(char.id)} 
                                className={`w-full text-left px-3 py-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-between ${
                                    activeStatCharId === char.id ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                                }`}
                            >
                                <span>{char.name}</span>
                                <span className="text-[10px] opacity-70">{char.mbti}</span>
                            </button>
                        ))}
                    </div>
                    {/* Editor */}
                    <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-y-auto p-4">
                        {activeStatCharId ? (
                            (() => {
                                const char = characters.find(c => c.id === activeStatCharId);
                                return char ? <DevStats character={char} allCharacters={characters} onUpdate={handleStatUpdate} /> : null;
                            })()
                        ) : (
                            <div className="text-center text-slate-400 mt-10">Select a character to edit</div>
                        )}
                        <div className="h-10"></div>
                    </div>
                </div>
            )}

            {/* Items Tab */}
            {mainTab === 'ITEMS' && (
                <div className="h-full bg-slate-100 dark:bg-slate-950 overflow-y-auto p-4">
                    <DevItems availableItems={availableItems} onAdd={onAddInventory} />
                </div>
            )}
        </div>

        {/* Selection Modal Overlay (Global) */}
        {selectionModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-slate-300 dark:border-slate-600">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
                        {selectionModal.type === 'MBTI' ? '이벤트를 실행할 캐릭터 선택' : '상호작용 대상 선택'}
                    </h3>
                    <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded text-sm italic text-slate-600 dark:text-slate-300">
                        "{selectionModal.preview}"
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Actor (주체)</label>
                            <select 
                                value={selectedActor} 
                                onChange={(e) => setSelectedActor(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            >
                                <option value="">-- 선택하세요 --</option>
                                {activeCharacters.map(c => {
                                    if (selectionModal.requiredMbti && c.mbti !== selectionModal.requiredMbti) return null;
                                    return <option key={c.id} value={c.id}>{c.name} ({c.mbti})</option>
                                })}
                            </select>
                            {selectionModal.requiredMbti && <p className="text-xs text-red-500 mt-1">* {selectionModal.requiredMbti} 유형만 선택 가능</p>}
                        </div>
                        {selectionModal.type === 'INTERACTION' && (
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Target (대상)</label>
                                <select 
                                    value={selectedTarget} 
                                    onChange={(e) => setSelectedTarget(e.target.value)}
                                    className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                >
                                    <option value="">-- 랜덤 (Random) --</option>
                                    {activeCharacters.filter(c => c.id !== selectedActor).map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 mt-6 justify-end">
                        <button onClick={() => setSelectionModal(null)} className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:text-slate-400">취소</button>
                        <button onClick={confirmSelection} disabled={!selectedActor} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:opacity-50">추가 (Add to Queue)</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperMenu;
