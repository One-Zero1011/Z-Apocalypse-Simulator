
import React, { useMemo, useState } from 'react';
import { STORY_NODES } from '../services/events/storyNodes';
import { MBTI_EVENT_POOL, ANALYSTS, DIPLOMATS, SENTINELS, EXPLORERS } from '../services/events/mbtiEvents';
import { INTERACTION_POOL } from '../services/events/interaction/index';

type EventType = 'STORY' | 'MBTI' | 'INTERACTION';

interface Props {
    type: EventType;
    activeId?: string; // For highlighting active story
    onSelectStory: (id: string, text: string) => void;
    onOpenModal: (type: 'MBTI' | 'INTERACTION', key: string, index: number, preview: string) => void;
}

const DevEventLists: React.FC<Props> = ({ type, activeId, onSelectStory, onOpenModal }) => {
    // Internal State for Sub-tabs
    const [activeStoryTab, setActiveStoryTab] = useState<string>('HOSPITAL (병원)');
    const [activeMbtiGroup, setActiveMbtiGroup] = useState<string>('ANALYSTS (분석가형)');
    const [activeInteractionTab, setActiveInteractionTab] = useState<string>('POSITIVE');
    const [searchTerm, setSearchTerm] = useState('');

    // --- Data Helpers ---
    const groupedStoryNodes = useMemo(() => {
        return Object.entries(STORY_NODES).reduce((acc, [id, node]) => {
            const prefix = id.split('_')[0];
            let groupName = 'ONE-OFF / WORLD';
            switch(prefix) {
                case 'hospital': groupName = 'HOSPITAL (병원)'; break;
                case 'winter': groupName = 'WINTER (겨울)'; break;
                case 'metro': groupName = 'METRO (지하철)'; break;
                case 'radio': groupName = 'RADIO (방송국)'; break;
                case 'wander': groupName = 'WANDERER (조우)'; break;
                case 'cult': groupName = 'CULT (광신도)'; break;
                case 'bunker': groupName = 'BUNKER (지하 벙커)'; break;
                case 'school': groupName = 'SCHOOL (학교)'; break; // New
                case 'prison': groupName = 'PRISON (교도소)'; break; // New
                case 'amusement': groupName = 'AMUSEMENT (놀이공원)'; break; // New
            }
            if (!acc[groupName]) acc[groupName] = [];
            acc[groupName].push({ id, text: node.text, effect: node.effect });
            return acc;
        }, {} as Record<string, {id: string, text: string, effect?: any}[]>);
    }, []);
    
    const storyCategories = Object.keys(groupedStoryNodes).sort();

    const mbtiGroups = {
        'ANALYSTS (분석가형)': ANALYSTS,
        'DIPLOMATS (외교관형)': DIPLOMATS,
        'SENTINELS (관리자형)': SENTINELS,
        'EXPLORERS (탐험가형)': EXPLORERS
    };

    const interactionGroups = Object.keys(INTERACTION_POOL);

    // Search Filter Helper
    const matchesSearch = (text: string, id: string = '') => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        return text.toLowerCase().includes(lower) || id.toLowerCase().includes(lower);
    };

    // --- Stat Formatter ---
    const formatStats = (effect: any) => {
        if (!effect) return null;
        const changes = [];
        // HP
        if (effect.hp || effect.actorHp || effect.targetHp) {
            const val = (effect.hp || 0) + (effect.actorHp || 0) + (effect.targetHp || 0);
            if (val !== 0) changes.push({ icon: '❤️', val, color: val > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' });
        }
        // Sanity
        if (effect.sanity || effect.actorSanity || effect.targetSanity || effect.victimSanityChange) {
            const val = (effect.sanity || 0) + (effect.actorSanity || 0) + (effect.targetSanity || 0) + (effect.victimSanityChange || 0);
            if (val !== 0) changes.push({ icon: '🧠', val, color: val > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400' });
        }
        // Fatigue (Low is good)
        if (effect.fatigue || effect.actorFatigue || effect.targetFatigue) {
            const val = (effect.fatigue || 0) + (effect.actorFatigue || 0) + (effect.targetFatigue || 0);
            if (val !== 0) changes.push({ icon: '💤', val, color: val < 0 ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400' });
        }
        // Infection
        if (effect.infection) {
            changes.push({ icon: '🦠', val: effect.infection, color: effect.infection > 0 ? 'text-lime-600 dark:text-lime-400' : 'text-blue-500' });
        }
        // Hunger
        if (effect.hunger) {
            changes.push({ icon: '🍖', val: effect.hunger, color: 'text-orange-600 dark:text-orange-400' });
        }
        // Kill
        if (effect.kill) {
            changes.push({ icon: '💀', val: effect.kill, color: 'text-slate-500 dark:text-slate-400' });
        }
        // Affinity
        if (effect.affinity || effect.affinityChange) {
            const val = effect.affinity || effect.affinityChange;
            changes.push({ icon: '💞', val, color: val > 0 ? 'text-pink-500 dark:text-pink-400' : 'text-slate-500' });
        }
        // Loot
        if (effect.loot && effect.loot.length > 0) {
            changes.push({ icon: '📦', text: effect.loot.join(', '), color: 'text-amber-600 dark:text-amber-400' });
        }
        // Inventory Remove
        if (effect.inventoryRemove && effect.inventoryRemove.length > 0) {
            changes.push({ icon: '🗑️', text: effect.inventoryRemove.join(', '), color: 'text-slate-500' });
        }

        if (changes.length === 0) return null;

        return (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
                {changes.map((c, i) => (
                    <span key={i} className={`text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 ${c.color}`}>
                        {c.icon} {c.text ? c.text : (c.val > 0 ? `+${c.val}` : c.val)}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="flex h-full animate-fade-in">
            {/* Sidebar */}
            <div className="w-1/3 md:w-1/4 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
                <div className="p-2 space-y-1">
                    {type === 'STORY' && storyCategories.map(cat => (
                        <button key={cat} onClick={() => setActiveStoryTab(cat)} className={`w-full text-left px-3 py-3 text-xs md:text-sm font-bold rounded-lg transition-all ${activeStoryTab === cat ? 'bg-zombie-green text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>{cat}</button>
                    ))}
                    {type === 'MBTI' && Object.keys(mbtiGroups).map(cat => (
                        <button key={cat} onClick={() => setActiveMbtiGroup(cat)} className={`w-full text-left px-3 py-3 text-xs md:text-sm font-bold rounded-lg transition-all ${activeMbtiGroup === cat ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>{cat}</button>
                    ))}
                    {type === 'INTERACTION' && interactionGroups.map(cat => (
                        <button key={cat} onClick={() => setActiveInteractionTab(cat)} className={`w-full text-left px-3 py-3 text-xs md:text-sm font-bold rounded-lg transition-all ${activeInteractionTab === cat ? 'bg-pink-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>{cat}</button>
                    ))}
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex flex-col h-full overflow-hidden">
                
                {/* Search Bar */}
                <div className="p-4 pb-2 bg-slate-100 dark:bg-slate-950 shrink-0">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="이벤트 검색 (ID 또는 내용)..."
                            className="w-full p-2 pl-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-2.5 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 pt-0">
                    {/* STORY LIST */}
                    {type === 'STORY' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {groupedStoryNodes[activeStoryTab]?.filter(node => matchesSearch(node.text, node.id)).map(node => (
                                <button
                                    key={node.id}
                                    onClick={() => onSelectStory(node.id, node.text)}
                                    className={`group flex flex-col text-left p-3 rounded-xl border-2 transition-all ${
                                        activeId === node.id ? 'bg-blue-50 border-blue-500' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <span className="text-[10px] font-mono mb-1 px-1 bg-slate-200 dark:bg-slate-700 rounded w-fit text-slate-600 dark:text-slate-300">{node.id}</span>
                                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{node.text}</p>
                                    {formatStats(node.effect)}
                                </button>
                            ))}
                            {groupedStoryNodes[activeStoryTab]?.filter(node => matchesSearch(node.text, node.id)).length === 0 && (
                                <p className="col-span-2 text-center text-slate-400 text-sm py-4">검색 결과가 없습니다.</p>
                            )}
                        </div>
                    )}

                    {/* MBTI LIST */}
                    {type === 'MBTI' && (
                        <div className="space-y-6">
                             {mbtiGroups[activeMbtiGroup as keyof typeof mbtiGroups].map((mbtiType) => {
                                const filteredEvents = MBTI_EVENT_POOL[mbtiType]
                                    .map((gen, idx) => ({ idx, preview: gen('OOO', '그') }))
                                    .filter(item => matchesSearch(item.preview.text));
                                
                                if (filteredEvents.length === 0) return null;

                                return (
                                    <div key={mbtiType} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                                        <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-3 border-b pb-2 dark:border-slate-700">{mbtiType}</h3>
                                        <ul className="space-y-2">
                                            {filteredEvents.map(({ idx, preview }) => (
                                                <li key={idx}>
                                                    <button 
                                                        onClick={() => onOpenModal('MBTI', mbtiType, idx, preview.text)}
                                                        className="w-full text-left text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-transparent hover:border-purple-300 group"
                                                    >
                                                        <div>{preview.text}</div>
                                                        {formatStats(preview)}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                             })}
                        </div>
                    )}

                    {/* INTERACTION LIST */}
                    {type === 'INTERACTION' && (
                        <div className="grid grid-cols-1 gap-3">
                            {INTERACTION_POOL[activeInteractionTab]?.map((item, idx) => {
                                let preview = { text: "" };
                                if (typeof item === 'function') {
                                    const result = item('Actor', 'Target');
                                    if (typeof result === 'string') preview.text = result;
                                    else preview = result;
                                }
                                return { idx, preview };
                            }).filter(item => matchesSearch(item.preview.text)).map(({ idx, preview }) => (
                                <button
                                    key={idx}
                                    onClick={() => onOpenModal('INTERACTION', activeInteractionTab, idx, preview.text)}
                                    className="w-full text-left bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-300 transition-colors group"
                                >
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{preview.text}</p>
                                    {formatStats(preview)}
                                </button>
                            ))}
                             {INTERACTION_POOL[activeInteractionTab]?.filter((item) => {
                                let text = "";
                                if (typeof item === 'function') {
                                    const result = item('Actor', 'Target');
                                    text = typeof result === 'string' ? result : result.text;
                                }
                                return matchesSearch(text);
                            }).length === 0 && (
                                <p className="text-center text-slate-400 text-sm py-4">검색 결과가 없습니다.</p>
                            )}
                        </div>
                    )}
                    
                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    );
};

export default DevEventLists;
