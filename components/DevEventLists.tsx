
import React, { useMemo, useState } from 'react';
import { STORY_NODES } from '../services/events/storyNodes';
import { MBTI_EVENT_POOL, ANALYSTS, DIPLOMATS, SENTINELS, EXPLORERS } from '../services/events/mbtiEvents';
import { INTERACTION_POOL } from '../services/events/interactionEvents';

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
            }
            if (!acc[groupName]) acc[groupName] = [];
            acc[groupName].push({ id, text: node.text });
            return acc;
        }, {} as Record<string, {id: string, text: string}[]>);
    }, []);
    
    const storyCategories = Object.keys(groupedStoryNodes).sort();

    const mbtiGroups = {
        'ANALYSTS (분석가형)': ANALYSTS,
        'DIPLOMATS (외교관형)': DIPLOMATS,
        'SENTINELS (관리자형)': SENTINELS,
        'EXPLORERS (탐험가형)': EXPLORERS
    };

    const interactionGroups = Object.keys(INTERACTION_POOL);

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

            {/* List */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-y-auto p-4">
                
                {/* STORY LIST */}
                {type === 'STORY' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {groupedStoryNodes[activeStoryTab]?.map(node => (
                            <button
                                key={node.id}
                                onClick={() => onSelectStory(node.id, node.text)}
                                className={`group flex flex-col text-left p-3 rounded-xl border-2 transition-all ${
                                    activeId === node.id ? 'bg-blue-50 border-blue-500' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-300'
                                }`}
                            >
                                <span className="text-[10px] font-mono mb-1 px-1 bg-slate-200 dark:bg-slate-700 rounded w-fit">{node.id}</span>
                                <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{node.text}</p>
                            </button>
                        ))}
                    </div>
                )}

                {/* MBTI LIST */}
                {type === 'MBTI' && (
                    <div className="space-y-6">
                         {mbtiGroups[activeMbtiGroup as keyof typeof mbtiGroups].map((mbtiType) => (
                            <div key={mbtiType} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-3 border-b pb-2">{mbtiType}</h3>
                                <ul className="space-y-2">
                                    {MBTI_EVENT_POOL[mbtiType].map((generator, idx) => {
                                        const preview = generator('OOO', '그');
                                        return (
                                            <li key={idx}>
                                                <button 
                                                    onClick={() => onOpenModal('MBTI', mbtiType, idx, preview.text)}
                                                    className="w-full text-left text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-transparent hover:border-purple-300"
                                                >
                                                    {preview.text}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {/* INTERACTION LIST */}
                {type === 'INTERACTION' && (
                    <div className="grid grid-cols-1 gap-3">
                        {INTERACTION_POOL[activeInteractionTab]?.map((item, idx) => {
                            let text = "";
                            if (typeof item === 'function') {
                                const result = item('Actor', 'Target');
                                text = typeof result === 'string' ? result : result.text;
                            }
                            return (
                                <button
                                    key={idx}
                                    onClick={() => onOpenModal('INTERACTION', activeInteractionTab, idx, text)}
                                    className="w-full text-left bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-300 transition-colors"
                                >
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{text}</p>
                                </button>
                            );
                        })}
                    </div>
                )}
                
                <div className="h-10"></div>
            </div>
        </div>
    );
};

export default DevEventLists;
