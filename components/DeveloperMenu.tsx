
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

type TabType = 'STORY' | 'MBTI' | 'INTERACTION' | 'JOB' | 'SYSTEM' | 'STATS' | 'ITEMS';

const DeveloperMenu: React.FC<Props> = ({ onClose, forcedEvents, setForcedEvents, characters, onUpdateCharacter, onAddInventory, availableItems }) => {
  const [mainTab, setMainTab] = useState<TabType>('STORY');
  const [activeStatCharId, setActiveStatCharId] = useState<string>('');

  // Selection Modal State
  const [selectionModal, setSelectionModal] = useState<{
      isOpen: boolean;
      type: ForcedEvent['type'];
      key: string;
      index: number;
      preview: string;
      requiredMbti?: string;
      requiredJob?: string;
  } | null>(null);

  const [selectedActor, setSelectedActor] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');

  const activeCharacters = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
  const deadCharacters = characters.filter(c => c.status === 'Dead');

  // --- Handlers ---
  const handleStorySelect = (id: string, text: string) => {
      setForcedEvents(prev => {
          const others = prev.filter(e => e.type !== 'STORY');
          const exists = prev.find(e => e.type === 'STORY' && e.key === id);
          if (exists) return others;
          return [...others, { type: 'STORY', key: id, previewText: text }];
      });
  };

  const openSelectionModal = (type: ForcedEvent['type'], key: string, index: number, preview: string) => {
      setSelectionModal({ 
        isOpen: true, 
        type, 
        key, 
        index, 
        preview, 
        requiredMbti: type === 'MBTI' ? key : undefined,
        requiredJob: type === 'JOB' ? key : undefined
      });
      setSelectedActor('');
      setSelectedTarget('');
  };

  const confirmSelection = () => {
      if (!selectionModal) return;
      if (!selectedActor && selectionModal.type !== 'SYSTEM') return;
      
      const actorName = characters.find(c => c.id === selectedActor)?.name || 'Unknown';
      let previewText = `[${selectionModal.key}] ${actorName || '시스템'}`;
      
      if (selectionModal.type === 'INTERACTION' && selectedTarget) {
          const targetName = characters.find(c => c.id === selectedTarget)?.name || 'Target';
          previewText += ` -> ${targetName}`;
      }

      if (selectionModal.key === 'GHOST' && selectedTarget) {
          const targetName = characters.find(c => c.id === selectedTarget)?.name || 'Target';
          previewText = `[유령] ${actorName} -> ${targetName}`;
      }

      if (selectionModal.key === 'PREGNANCY' && selectedTarget) {
          const targetName = characters.find(c => c.id === selectedTarget)?.name || 'Target';
          previewText = `[임신] ${actorName} + ${targetName}`;
      }

      setForcedEvents(prev => [...prev, {
          type: selectionModal.type,
          key: selectionModal.key,
          index: selectionModal.index,
          actorId: selectedActor || undefined,
          targetId: selectedTarget || undefined,
          previewText: `${previewText}: ${selectionModal.preview.substring(0, 15)}...`
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

  const activeStoryId = forcedEvents.find(e => e.type === 'STORY')?.key;

  const getTabLabel = (tab: TabType) => {
      switch(tab) {
          case 'STORY': return '스토리';
          case 'MBTI': return '성격';
          case 'INTERACTION': return '관계';
          case 'JOB': return '직업';
          case 'SYSTEM': return '시스템';
          case 'STATS': return '스탯';
          case 'ITEMS': return '템';
          default: return tab;
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-5xl w-full h-[90vh] overflow-hidden border border-zombie-green dark:border-zombie-green/30 flex flex-col relative">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-zombie-green flex items-center gap-2 font-mono text-sm md:text-xl">
              🛠️ 디버그 센터
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Queue */}
        <div className="bg-slate-100 dark:bg-slate-800 p-2 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-1 min-h-[40px] items-center">
                {forcedEvents.length === 0 ? (
                    <span className="text-xs text-slate-400 dark:text-slate-600 px-2">-- 대기 중인 이벤트 없음 --</span>
                ) : (
                    forcedEvents.map((ev, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-[10px] whitespace-nowrap shadow-sm border border-slate-200 dark:border-slate-600">
                            <span className="font-bold text-blue-500">{ev.type}</span>
                            <span className="opacity-75 truncate max-w-[120px]">{ev.previewText || ev.key}</span>
                            <button onClick={() => removeEvent(idx)} className="ml-1 hover:text-red-600 font-bold">×</button>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shrink-0">
            {(['STORY', 'MBTI', 'INTERACTION', 'JOB', 'SYSTEM', 'STATS', 'ITEMS'] as TabType[]).map(tab => (
                <button
                    key={tab}
                    onClick={() => setMainTab(tab)}
                    className={`flex-1 min-w-[60px] py-3 text-[11px] md:text-sm font-bold transition-colors ${
                        mainTab === tab 
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    {getTabLabel(tab)}
                </button>
            ))}
        </div>

        <div className="flex-1 overflow-hidden relative">
            {/* 리스트 기반 탭 (Story, MBTI 등) 일 때만 DevEventLists 렌더링 */}
            {['STORY', 'MBTI', 'INTERACTION', 'JOB', 'SYSTEM'].includes(mainTab) && (
                <DevEventLists 
                    type={mainTab as any} 
                    activeId={activeStoryId} 
                    onSelectStory={handleStorySelect} 
                    onOpenModal={openSelectionModal} 
                />
            )}

            {mainTab === 'STATS' && (
                <div className="flex h-full">
                    <div className="w-1/4 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-2">
                        {characters.map(char => (
                            <button 
                                key={char.id} 
                                onClick={() => setActiveStatCharId(char.id)} 
                                className={`w-full text-left px-3 py-2 text-xs font-bold rounded mb-1 transition-colors ${activeStatCharId === char.id ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                            >
                                {char.name}
                            </button>
                        ))}
                        {characters.length === 0 && <div className="text-center text-[10px] text-slate-400 py-4">생존자 없음</div>}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-slate-950">
                        {activeStatCharId ? (
                            <DevStats 
                                character={characters.find(c => c.id === activeStatCharId)!} 
                                allCharacters={characters} 
                                onUpdate={handleStatUpdate} 
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 opacity-20">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <p className="text-sm">편집할 생존자를 왼쪽 목록에서 선택하세요.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {mainTab === 'ITEMS' && <div className="h-full overflow-y-auto p-4 bg-white dark:bg-slate-950"><DevItems availableItems={availableItems} onAdd={onAddInventory} /></div>}
        </div>

        {selectionModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-slate-300 dark:border-slate-600">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">실행 옵션 설정</h3>
                    <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded text-xs italic">"{selectionModal.preview}"</div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                                {selectionModal.key === 'GHOST' ? '사망한 생존자 (유령)' : '주체 (Actor)'}
                            </label>
                            <select value={selectedActor} onChange={(e) => setSelectedActor(e.target.value)} className="w-full p-2 text-sm border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white">
                                <option value="">-- 선택하세요 --</option>
                                {(selectionModal.key === 'GHOST' ? deadCharacters : activeCharacters).map(c => {
                                    if (selectionModal.requiredMbti && c.mbti !== selectionModal.requiredMbti) return null;
                                    if (selectionModal.requiredJob && c.job !== selectionModal.requiredJob) return null;
                                    return <option key={c.id} value={c.id}>{c.name} ({c.mbti})</option>
                                })}
                            </select>
                        </div>
                        {(selectionModal.type === 'INTERACTION' || selectionModal.key === 'GHOST' || selectionModal.key === 'PREGNANCY') && (
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">대상 (Target)</label>
                                <select value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)} className="w-full p-2 text-sm border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white">
                                    <option value="">-- 선택하세요 --</option>
                                    {activeCharacters.filter(c => c.id !== selectedActor).map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 mt-6 justify-end">
                        <button onClick={() => setSelectionModal(null)} className="px-4 py-2 text-sm text-slate-500">취소</button>
                        <button onClick={confirmSelection} disabled={!selectedActor && selectionModal.type !== 'SYSTEM'} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold">확인</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperMenu;
