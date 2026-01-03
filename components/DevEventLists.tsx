
import React, { useMemo, useState, useEffect } from 'react';
import { STORY_NODES } from '../services/events/storyNodes';
import { MBTI_EVENT_POOL, ANALYSTS, DIPLOMATS, SENTINELS, EXPLORERS } from '../services/events/mbtiEvents';
import { INTERACTION_POOL } from '../services/events/interaction/index';
import { ALL_JOB_MBTI_EVENTS } from '../services/events/jobEvents/index';
import { REST_EVENTS } from '../services/events/restEvents';
import { FATIGUE_EVENTS } from '../services/events/fatigueEvents';
import { GHOST_EVENTS } from '../services/events/ghostEvents';
import { MENTAL_ILLNESS_ACTIONS } from '../services/events/mentalEvents';
import { ForcedEvent, StoryNode } from '../types';

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
    const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
    const [expandedChoiceId, setExpandedChoiceId] = useState<string | null>(null);

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
                case 'dice': groupName = 'CHALLENGE (주사위)'; break;
                case 'tarot': groupName = 'TAROT (타로)'; break;
            }
            if (!acc[groupName]) acc[groupName] = [];
            acc[groupName].push({ id, ...node });
            return acc;
        }, {} as Record<string, (StoryNode & {id: string})[]>);
    }, []);

    useEffect(() => {
        if (type === 'STORY') setActiveSubTab('HOSPITAL (병원)');
        else if (type === 'MBTI') setActiveSubTab('ANALYSTS');
        else if (type === 'INTERACTION') setActiveSubTab('POSITIVE');
        else if (type === 'JOB') setActiveSubTab('군인');
        else if (type === 'SYSTEM') setActiveSubTab('REST');
        else setActiveSubTab('');
        setExpandedNodeId(null);
        setExpandedChoiceId(null);
    }, [type]);

    const matchesSearch = (text: string, id: string = '') => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        return text.toLowerCase().includes(lower) || id.toLowerCase().includes(lower);
    };

    const renderEffects = (effect: any) => {
        if (!effect) return null;
        const parts = [];
        if (effect.hp) parts.push(<span key="hp" className="text-red-500">❤️{effect.hp > 0 ? '+' : ''}{effect.hp}</span>);
        if (effect.sanity) parts.push(<span key="sanity" className="text-blue-500">🧠{effect.sanity > 0 ? '+' : ''}{effect.sanity}</span>);
        if (effect.fatigue) parts.push(<span key="fatigue" className="text-purple-500">💤{effect.fatigue > 0 ? '+' : ''}{effect.fatigue}</span>);
        if (effect.infection) parts.push(<span key="infection" className="text-lime-600">🦠{effect.infection > 0 ? '+' : ''}{effect.infection}</span>);
        
        if (effect.statChanges) {
            Object.entries(effect.statChanges).forEach(([stat, val]) => {
                parts.push(<span key={`stat-${stat}`} className="text-amber-600 font-bold">{stat.toUpperCase()}{(val as number) > 0 ? '+' : ''}{val as any}</span>);
            });
        }
        if (effect.skillsAdd) effect.skillsAdd.forEach((s: any, i: number) => {
            parts.push(<span key={`skill-add-${i}`} className="text-green-600">✨{s.name}획득</span>);
        });
        if (effect.skillsRemove) effect.skillsRemove.forEach((s: string, i: number) => {
            parts.push(<span key={`skill-rem-${i}`} className="text-gray-400 line-through">🚫{s}상실</span>);
        });

        if (parts.length === 0) return null;
        return <div className="flex flex-wrap gap-2 text-[10px] mt-1 bg-white dark:bg-slate-900/50 p-1 rounded border border-slate-100 dark:border-slate-800">{parts}</div>;
    };

    return (
        <div className="flex h-full animate-fade-in">
            {/* Sub-Sidebar */}
            <div className="w-1/3 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {type === 'STORY' && Object.keys(groupedStoryNodes).map(cat => (
                    <button key={cat} onClick={() => setActiveSubTab(cat)} className={`w-full text-left p-2 text-[10px] md:text-xs font-bold rounded transition-all ${activeSubTab === cat ? 'bg-zombie-green text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{cat}</button>
                ))}
                {type === 'MBTI' && ['ANALYSTS', 'DIPLOMATS', 'SENTINELS', 'EXPLORERS'].map(cat => (
                    <button key={cat} onClick={() => setActiveSubTab(cat)} className={`w-full text-left p-2 text-[10px] md:text-xs font-bold rounded transition-all ${activeSubTab === cat ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{cat}</button>
                ))}
                {type === 'INTERACTION' && Object.keys(INTERACTION_POOL).map(cat => (
                    <button key={cat} onClick={() => setActiveSubTab(cat)} className={`w-full text-left p-2 text-[10px] md:text-xs font-bold rounded transition-all ${activeSubTab === cat ? 'bg-pink-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{cat}</button>
                ))}
                {type === 'JOB' && Object.keys(ALL_JOB_MBTI_EVENTS).sort().map(cat => (
                    <button key={cat} onClick={() => setActiveSubTab(cat)} className={`w-full text-left p-2 text-[10px] md:text-xs font-bold rounded transition-all ${activeSubTab === cat ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{cat}</button>
                ))}
                {type === 'SYSTEM' && ['REST', 'FATIGUE', 'GHOST', 'MENTAL', 'MISC'].map(cat => (
                    <button key={cat} onClick={() => setActiveSubTab(cat)} className={`w-full text-left p-2 text-[10px] md:text-xs font-bold rounded transition-all ${activeSubTab === cat ? 'bg-slate-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{cat}</button>
                ))}
            </div>

            {/* List Content */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col h-full overflow-hidden">
                <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="검색..." className="w-full p-2 text-xs rounded border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {/* STORY LIST */}
                    {type === 'STORY' && groupedStoryNodes[activeSubTab]?.filter(node => matchesSearch(node.text, node.id)).map(node => {
                        const hasChoices = node.next?.some(n => n.choiceText);
                        const isExpanded = expandedNodeId === node.id;
                        
                        return (
                            <div key={node.id} className="space-y-1">
                                <div className={`w-full flex items-start gap-2 p-3 rounded-lg border-2 transition-all ${activeId === node.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-300'}`}>
                                    <button 
                                        onClick={() => onSelectStory(node.id, node.text)}
                                        className="flex-1 text-left"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="text-[9px] font-mono text-slate-400">{node.id}</div>
                                            {hasChoices && <span className="text-[9px] bg-amber-100 text-amber-600 px-1 rounded font-bold uppercase">Choice</span>}
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{node.text}</p>
                                        {renderEffects(node.effect)}
                                    </button>
                                    
                                    {/* 오직 선택지가 있는 경우에만 화살표 표시 */}
                                    {hasChoices && (
                                        <button 
                                            onClick={() => setExpandedNodeId(isExpanded ? null : node.id)}
                                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 self-center"
                                            title="선택지 목록 보기"
                                        >
                                            {isExpanded ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                    <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                                
                                {isExpanded && (
                                    <div className="ml-4 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in shadow-inner">
                                        <h5 className="text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800 pb-1">분기 및 선택지 (Choices)</h5>
                                        {node.next?.filter(n => n.choiceText).map((opt, i) => {
                                            const optKey = `${node.id}-opt-${i}`;
                                            const isOptExpanded = expandedChoiceId === optKey;
                                            const successNode = opt.dice ? STORY_NODES[opt.dice.successId] : null;
                                            const failNode = opt.dice ? STORY_NODES[opt.dice.failId] : null;

                                            return (
                                                <div key={i} className="flex flex-col gap-1">
                                                    <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                                <span className="text-blue-500">•</span> {opt.choiceText}
                                                                {opt.dice && <span className="text-[9px] bg-purple-100 text-purple-600 px-1 rounded">🎲 {opt.dice.stat.toUpperCase()} 판정({opt.dice.threshold}+)</span>}
                                                            </div>
                                                            {opt.req && (
                                                                <div className="mt-1 flex flex-wrap gap-1">
                                                                    {opt.req.skill && <span className="text-[9px] bg-green-100 text-green-700 px-1 rounded border border-green-200">🛠️ {opt.req.skill} 필요</span>}
                                                                    {opt.req.item && <span className="text-[9px] bg-amber-100 text-amber-700 px-1 rounded border border-amber-200">📦 {opt.req.item} 필요</span>}
                                                                    {opt.req.minSurvivors && <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded border border-slate-200">👥 {opt.req.minSurvivors}명 이상</span>}
                                                                </div>
                                                            )}
                                                            <div className="text-[9px] text-slate-400 mt-1 font-mono">➡ ID: {opt.id} (W:{opt.weight})</div>
                                                        </div>
                                                        
                                                        {/* 주사위 판정 결과 미리보기 폴더 버튼 */}
                                                        {opt.dice && (
                                                            <button 
                                                                onClick={() => setExpandedChoiceId(isOptExpanded ? null : optKey)}
                                                                className="ml-2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400"
                                                                title="판정 결과 미리보기"
                                                            >
                                                                {isOptExpanded ? '▲' : '▼'}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {isOptExpanded && opt.dice && (
                                                        <div className="ml-4 p-2 bg-slate-100 dark:bg-slate-950 rounded border-l-2 border-purple-400 space-y-2 animate-fade-in shadow-inner">
                                                            <div className="space-y-1">
                                                                <div className="text-[9px] font-bold text-green-600 uppercase">판정 성공 시 (Success)</div>
                                                                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight italic">"{successNode?.text || '내용 없음'}"</p>
                                                                {renderEffects(successNode?.effect)}
                                                            </div>
                                                            <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                                                            <div className="space-y-1">
                                                                <div className="text-[9px] font-bold text-red-600 uppercase">판정 실패 시 (Fail)</div>
                                                                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight italic">"{failNode?.text || '내용 없음'}"</p>
                                                                {renderEffects(failNode?.effect)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        
                                        {node.next?.some(n => !n.choiceText) && (
                                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                <h5 className="text-[10px] font-bold text-slate-400 uppercase pb-1">자동/확률적 연결</h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {node.next?.filter(n => !n.choiceText).map((opt, i) => (
                                                        <span key={i} className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-200 dark:border-slate-700">{opt.id}({opt.weight})</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

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
                                        <button key={idx} onClick={() => onOpenModal('MBTI', mbti, idx, preview.text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px] hover:bg-purple-50 group transition-colors">
                                            <div className="text-slate-700 dark:text-slate-300 group-hover:text-purple-700">{preview.text}</div>
                                            {renderEffects(preview)}
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
                            <button key={idx} onClick={() => onOpenModal('INTERACTION', activeSubTab, idx, text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px] hover:bg-pink-50 transition-colors">
                                <div className="text-slate-700 dark:text-slate-300">{text}</div>
                                {typeof result !== 'string' && renderEffects(result)}
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
                                        <button 
                                            key={idx} 
                                            // Fix: Pass composite key to include group info
                                            onClick={() => onOpenModal('JOB', `${activeSubTab}::${group}`, idx, preview.text)} 
                                            className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px] hover:bg-amber-50 transition-colors"
                                        >
                                            <div className="text-slate-700 dark:text-slate-300">{preview.text}</div>
                                            {renderEffects(preview)}
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
                                    <button key={idx} onClick={() => onOpenModal('SYSTEM', 'REST', idx, p.text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 text-[11px] hover:bg-slate-100 transition-colors">
                                        <div className="text-slate-700 dark:text-slate-300">{p.text}</div>
                                        {renderEffects(p)}
                                    </button>
                                );
                            })}
                            {activeSubTab === 'FATIGUE' && FATIGUE_EVENTS.map((gen, idx) => {
                                const p = gen('생존자');
                                return matchesSearch(p.text) && (
                                    <button key={idx} onClick={() => onOpenModal('SYSTEM', 'FATIGUE', idx, p.text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 text-[11px] text-red-600 hover:bg-red-50 transition-colors">
                                        <div className="text-slate-700 dark:text-slate-300 font-bold">{p.text}</div>
                                        {renderEffects(p)}
                                    </button>
                                );
                            })}
                            {activeSubTab === 'GHOST' && GHOST_EVENTS.map((gen, idx) => {
                                const p = gen('망자', '생자');
                                return matchesSearch(p.text) && (
                                    <button key={idx} onClick={() => onOpenModal('SYSTEM', 'GHOST', idx, p.text)} className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 text-[11px] text-indigo-600 hover:bg-indigo-50 transition-colors">
                                        <div className="text-slate-700 dark:text-slate-300">{p.text}</div>
                                        {renderEffects(p)}
                                    </button>
                                );
                            })}
                            {activeSubTab === 'MENTAL' && (
                                <button onClick={() => onOpenModal('SYSTEM', 'MENTAL', 0, "현재 정신 상태에 따른 돌발 행동")} className="w-full text-left p-3 bg-white dark:bg-purple-900/30 rounded border border-purple-200 text-xs font-bold shadow-sm hover:bg-purple-50 transition-colors">🧠 대상 캐릭터의 정신질환 이벤트 즉시 실행</button>
                            )}
                            {activeSubTab === 'MISC' && (
                                <button onClick={() => onOpenModal('SYSTEM', 'PREGNANCY', 0, "임신 발생")} className="w-full text-left p-3 bg-white dark:bg-pink-900/30 rounded border border-pink-200 text-xs font-bold shadow-sm hover:bg-pink-50 transition-colors">🤰 선택한 두 생존자 사이에서 임신 발생 (성별 무관)</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DevEventLists;
