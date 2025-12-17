
import React, { useMemo, useState } from 'react';
import { STORY_NODES } from '../services/events/storyNodes';
import { MBTI_EVENT_POOL, ANALYSTS, DIPLOMATS, SENTINELS, EXPLORERS } from '../services/events/mbtiEvents';
import { INTERACTION_POOL } from '../services/events/interaction/index';
import { ALL_JOB_MBTI_EVENTS } from '../services/events/jobEvents/index';
import { REST_EVENTS } from '../services/events/restEvents';
import { FATIGUE_EVENTS } from '../services/events/fatigueEvents';
import { GHOST_EVENTS } from '../services/events/ghostEvents';
import { MENTAL_ILLNESS_ACTIONS } from '../services/events/mentalEvents';
import { ForcedEvent } from '../types';

type EventType = ForcedEvent['type'];

interface Props {
    type: EventType;
    activeId?: string; 
    onSelectStory: (id: string, text: string) => void;
    onOpenModal: (type: EventType, key: string, index: number, preview: string) => void;
}

const DevEventLists: React.FC<Props> = ({ type, activeId, onSelectStory, onOpenModal }) => {
    const [activeSubTab, setActiveSubTab] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    // --- Story Data Grouping ---
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
                case 'school': groupName = 'SCHOOL (학교)'; break;
                case 'prison': groupName = 'PRISON (교도소)'; break;
                case 'amusement': groupName = 'AMUSEMENT (놀이공원)'; break;
            }
            if (!acc[groupName]) acc[groupName] = [];
            acc[groupName].push({ id, text: node.text, effect: node.effect });
            return acc;
        }, {} as Record<string, {id: string, text: string, effect?: any}[]>);
    }, []);

    // Initial SubTab Setup
    useMemo(() => {
        if (type === 'STORY' && !activeSubTab) setActiveSubTab('HOSPITAL (병원)');
        if (type === 'MBTI' && !activeSubTab) setActiveSubTab('ANALYSTS');
        if (type === 'INTERACTION' && !activeSubTab) setActiveSubTab('POSITIVE');
        if (type === 'JOB' && !activeSubTab) setActiveSubTab('군인');
        if (type === 'SYSTEM' && !activeSubTab) setActiveSubTab('REST');
    }, [type]);

    const matchesSearch = (text: string, id: string = '') => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        return text.toLowerCase().includes(lower) || id.toLowerCase().includes(lower);
    };

    const formatStats = (effect: any) => {
        if (!effect) return null;
        const parts = [];
        if (effect.hp) parts.push(`❤️${effect.hp}`);
        if (effect.sanity) parts.push(`🧠${effect.sanity}`);
        if (effect.fatigue) parts.push(`💤${effect.fatigue}`);
        if (effect.infection) parts.push(`🦠${effect.infection}`);
        if (effect.loot) parts.push(`📦${effect.loot.length}`);
        if (parts.length === 0) return null;
        return <div className="text-[10px] text-blue-500 font-bold mt-1 opacity-70">{parts.join(' ')}</div>;
    };

    return (
        <div className="flex h-full animate-fade-in">
            {/* Sub-Sidebar */}
            <div className="w-1/3 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-2 space-y-1">
                {type === 'STORY' && Object.keys(groupedStoryNodes).map(cat => (
                    <button key={cat} onClick={() => setActiveSubTab(cat)} className={`w-full text-left p-2 text-[10px] md:text-xs font-bold rounded transition-all ${activeSubTab === cat ? 'bg-zombie-green text-white shadow-md' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>{cat}</button>
                ))}
                {type === 'MBTI' && ['ANALYSTS', 'DIPLOMATS', 'SENTINELS', 'EXPLORERS'].map(cat => (
                    <button key={cat} onClick={() => setActiveSubTab(cat)} className={`w-full text-left p-2 text-[10px] md:text-xs font-bold rounded transition-all ${activeSubTab === cat ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>{cat}</button>
                ))}
                {type === 'INTERACTION' && Object.keys(INTERACTION_POOL).map(cat => (
                    <button key={cat} onClick={() => setActiveSubTab(cat)} className={`w-full text-left p-2 text-[10px] md:text-xs font-bold rounded transition-all ${activeSubTab === cat ? 'bg-pink-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>{cat}</button>
                ))}
                {type === 'JOB' && Object.keys(ALL_JOB_MBTI_EVENTS).sort().map(cat => (
                    <button key={cat} onClick={() => setActiveSubTab(cat)} className={`w-full text-left p-2 text-[10px] md:text-xs font-bold rounded transition-all ${activeSubTab === cat ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>{cat}</button>
                ))}
                {type === 'SYSTEM' && ['REST', 'FATIGUE', 'GHOST', 'MENTAL', 'MISC'].map(cat => (
                    <button key={cat} onClick={() => setActiveSubTab(cat)} className={`w-full text-left p-2 text-[10px] md:text-xs font-bold rounded transition-all ${activeSubTab === cat ? 'bg-slate-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>{cat}</button>
                ))}
            </div>

            {/* List Content */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex flex-col h-full overflow-hidden">
                <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="검색..." className="w-full p-2 text-xs rounded border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {/* STORY LIST */}
                    {type === 'STORY' && groupedStoryNodes[activeSubTab]?.filter(node => matchesSearch(node.text, node.id)).map(node => (
                        <button key={node.id} onClick={() => onSelectStory(node.id, node.text)} className={`w-full text-left p-3 rounded-lg border-2 transition-all ${activeId === node.id ? 'bg-blue-50 border-blue-500' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-300'}`}>
                            <div className="text-[9px] font-mono text-slate-400 mb-1">{node.id}</div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{node.text}</p>
                        </button>
                    ))}

                    {/* MBTI LIST */}
                    {type === 'MBTI' && Object.keys(MBTI_EVENT_POOL).filter(mbti => {
                        if (activeSubTab === 'ANALYSTS') return ANALYSTS.includes(mbti as any);
                        if (activeSubTab === 'DIPLOMATS') return DIPLOMATS.includes(mbti as any);
                        if (activeSubTab === 'SENTINELS') return SENTINELS.includes(mbti as any);
                        return EXPLORERS.includes(mbti as any);
                    }).map(mbti => (
                        <div key={mbti} className="mb-4">
                            <h4 className="text-[10px] font-bold text-purple-500 uppercase mb-2 ml-1">{mbti}</h4>
                            <div className="space-y-2">
                                {MBTI_EVENT_POOL[mbti as any].map((gen, idx) => {
                                    const preview = gen('생존자', '그');
                                    if (!matchesSearch(preview.text)) return null;
                                    return (
                                        <button key={idx} onClick={() => onOpenModal('MBTI', mbti, idx, preview.text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px] hover:bg-purple-50">
                                            {preview.text}
                                            {formatStats(preview)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* INTERACTION LIST */}
                    {type === 'INTERACTION' && INTERACTION_POOL[activeSubTab]?.map((gen, idx) => {
                        const result = gen('주체', '대상');
                        const text = typeof result === 'string' ? result : result.text;
                        if (!matchesSearch(text)) return null;
                        return (
                            <button key={idx} onClick={() => onOpenModal('INTERACTION', activeSubTab, idx, text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px] hover:bg-pink-50">
                                {text}
                                {typeof result !== 'string' && formatStats(result)}
                            </button>
                        );
                    })}

                    {/* JOB LIST */}
                    {type === 'JOB' && ALL_JOB_MBTI_EVENTS[activeSubTab] && Object.entries(ALL_JOB_MBTI_EVENTS[activeSubTab]).map(([group, events]) => (
                        <div key={group} className="mb-4">
                            <h4 className="text-[10px] font-bold text-amber-500 uppercase mb-2 ml-1">{group}</h4>
                            <div className="space-y-2">
                                {events.map((gen, idx) => {
                                    const preview = gen('생존자');
                                    if (!matchesSearch(preview.text)) return null;
                                    return (
                                        <button key={idx} onClick={() => onOpenModal('JOB', activeSubTab, idx, preview.text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px] hover:bg-amber-50">
                                            {preview.text}
                                            {formatStats(preview)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* SYSTEM LIST */}
                    {type === 'SYSTEM' && (
                        <div className="space-y-2">
                            {activeSubTab === 'REST' && REST_EVENTS.map((gen, idx) => {
                                const p = gen('생존자');
                                return matchesSearch(p.text) && (
                                    <button key={idx} onClick={() => onOpenModal('SYSTEM', 'REST', idx, p.text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 text-[11px]">{p.text}{formatStats(p)}</button>
                                );
                            })}
                            {activeSubTab === 'FATIGUE' && FATIGUE_EVENTS.map((gen, idx) => {
                                const p = gen('생존자');
                                return matchesSearch(p.text) && (
                                    <button key={idx} onClick={() => onOpenModal('SYSTEM', 'FATIGUE', idx, p.text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 text-[11px] text-red-600">{p.text}{formatStats(p)}</button>
                                );
                            })}
                            {activeSubTab === 'GHOST' && GHOST_EVENTS.map((gen, idx) => {
                                const p = gen('망자', '생자');
                                return matchesSearch(p.text) && (
                                    <button key={idx} onClick={() => onOpenModal('SYSTEM', 'GHOST', idx, p.text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 text-[11px] text-indigo-600">{p.text}{formatStats(p)}</button>
                                );
                            })}
                            {activeSubTab === 'MENTAL' && (
                                <button onClick={() => onOpenModal('SYSTEM', 'MENTAL', 0, "현재 정신 상태에 따른 돌발 행동")} className="w-full text-left p-3 bg-purple-100 dark:bg-purple-900/30 rounded border border-purple-200 text-xs font-bold">🧠 대상 캐릭터의 정신질환 이벤트 즉시 실행</button>
                            )}
                            {activeSubTab === 'MISC' && (
                                <button onClick={() => onOpenModal('SYSTEM', 'PREGNANCY', 0, "임신 발생")} className="w-full text-left p-3 bg-pink-100 dark:bg-pink-900/30 rounded border border-pink-200 text-xs font-bold">🤰 선택한 두 생존자 사이에서 임신 발생 (성별 무관)</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DevEventLists;
