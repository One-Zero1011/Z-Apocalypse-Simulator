
import React, { useState, useRef, useEffect } from 'react';
import { CustomStoryArc, StoryNode, StoryOption, StoryEffect, Stats, MBTI, MentalState, Status } from '../types';

interface Props {
    onClose: () => void;
    customArcs: CustomStoryArc[];
    onUpdateArcs: (arcs: CustomStoryArc[]) => void;
}

const DEFAULT_NODE: StoryNode = {
    id: '',
    text: '',
    next: [],
    effect: { target: 'ALL' },
    position: { x: 100, y: 100 }
};

const STAT_LABELS: Record<string, string> = {
    str: '근력(STR)', agi: '민첩(AGI)', con: '체력(CON)', int: '지능(INT)', cha: '매력(CHA)'
};

const CustomEventManager: React.FC<Props> = ({ onClose, customArcs, onUpdateArcs }) => {
    const [view, setView] = useState<'LIST' | 'EDIT_ARC' | 'EDIT_NODE'>('LIST');
    const [editorMode, setEditorMode] = useState<'LIST' | 'GRID'>('LIST'); 
    const [currentArc, setCurrentArc] = useState<CustomStoryArc | null>(null);
    const [currentNode, setCurrentNode] = useState<StoryNode>(DEFAULT_NODE);

    // --- Grid View States ---
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [dragNodeId, setDragNodeId] = useState<string | null>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const graphRef = useRef<HTMLDivElement>(null);

    // --- Arc Management ---
    const handleCreateArc = () => {
        const newArc: CustomStoryArc = {
            id: `custom_${Date.now()}`,
            title: '새로운 이야기',
            description: '설명을 입력하세요',
            nodes: {},
            starterNodeId: '',
            author: 'User',
            version: 1
        };
        setCurrentArc(newArc);
        setView('EDIT_ARC');
        setEditorMode('LIST');
    };

    const handleDeleteArc = (id: string) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            onUpdateArcs(customArcs.filter(a => a.id !== id));
        }
    };

    const handleSaveCurrentArc = () => {
        if (!currentArc) return;
        if (!currentArc.title || !currentArc.starterNodeId) {
            alert("제목과 시작 노드 ID는 필수입니다.");
            return;
        }
        
        const idx = customArcs.findIndex(a => a.id === currentArc.id);
        const newArcs = [...customArcs];
        if (idx >= 0) newArcs[idx] = currentArc;
        else newArcs.push(currentArc);
        
        onUpdateArcs(newArcs);
        setView('LIST');
        setCurrentArc(null);
    };

    // --- Node Management ---
    const handleEditNode = (nodeId: string) => {
        if (!currentArc) return;
        const node = currentArc.nodes[nodeId];
        if (node) {
            setCurrentNode(node);
            setView('EDIT_NODE');
        }
    };

    const handleCreateNode = () => {
        const newX = -pan.x + 200 + (Math.random() * 50);
        const newY = -pan.y + 200 + (Math.random() * 50);

        setCurrentNode({
            id: `node_${Date.now()}`,
            text: '',
            next: [],
            effect: { target: 'ALL' },
            position: { x: newX, y: newY }
        });
        setView('EDIT_NODE');
    };

    const handleSaveNode = () => {
        if (!currentArc || !currentNode.id) return;
        
        const updatedNodes = { ...currentArc.nodes, [currentNode.id]: currentNode };
        let updatedStarter = currentArc.starterNodeId;
        if (!updatedStarter || Object.keys(updatedNodes).length === 1) {
            updatedStarter = currentNode.id;
        }

        setCurrentArc({ ...currentArc, nodes: updatedNodes, starterNodeId: updatedStarter });
        setView('EDIT_ARC');
    };

    const handleDeleteNode = (id: string) => {
        if (!currentArc) return;
        const updatedNodes = { ...currentArc.nodes };
        delete updatedNodes[id];
        setCurrentArc({ ...currentArc, nodes: updatedNodes });
    };

    // --- Import / Export ---
    const handleExport = (arc: CustomStoryArc) => {
        const json = JSON.stringify(arc, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${arc.title.replace(/\s+/g, '_')}_event.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string);
                if (parsed.nodes && parsed.starterNodeId) {
                    const importedArc = { ...parsed, id: `imported_${Date.now()}` };
                    onUpdateArcs([...customArcs, importedArc]);
                    alert("이벤트 불러오기 성공!");
                } else {
                    alert("유효하지 않은 이벤트 파일입니다.");
                }
            } catch (err) {
                alert("파일 파싱 실패");
            }
        };
        reader.readAsText(file);
    };

    // --- Graph Interaction Handlers ---
    const handleMouseDown = (e: React.MouseEvent, nodeId?: string) => {
        if (nodeId) {
            e.stopPropagation();
            setDragNodeId(nodeId);
        } else {
            setIsPanning(true);
        }
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        if (dragNodeId && currentArc) {
            const node = currentArc.nodes[dragNodeId];
            const newPos = { 
                x: (node.position?.x || 0) + dx, 
                y: (node.position?.y || 0) + dy 
            };
            const updatedNode = { ...node, position: newPos };
            setCurrentArc({
                ...currentArc,
                nodes: { ...currentArc.nodes, [dragNodeId]: updatedNode }
            });
        } else if (isPanning) {
            setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        }
    };

    const handleMouseUp = () => {
        setDragNodeId(null);
        setIsPanning(false);
    };

    // --- Helper Components for Editor ---
    const EffectEditor = ({ effect, onChange }: { effect: StoryEffect, onChange: (e: StoryEffect) => void }) => (
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-2 border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">✨ 결과 효과 (Effect) 설정</h4>
                <div className="text-[10px] text-slate-500 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-yellow-800 dark:text-yellow-200">
                    💡 <strong>도움말:</strong> 양수(+)는 회복/획득, 음수(-)는 피해/감소입니다. (예: HP -10은 피해)
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. 기본 수치 변화 */}
                <div className="space-y-2">
                    <label className="font-bold text-slate-600 dark:text-slate-400">대상 및 수치 변화</label>
                    <div className="flex gap-2 items-center mb-2">
                        <span className="w-16">대상:</span>
                        <select 
                            value={effect.target} 
                            onChange={(e) => onChange({...effect, target: e.target.value as any})}
                            className="flex-1 p-1.5 rounded border bg-white text-slate-900 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="ALL">전원 (All)</option>
                            <option value="RANDOM_1">무작위 1명</option>
                            <option value="RANDOM_HALF">무작위 절반</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1"><span className="w-16">❤️ HP:</span><input type="number" className="flex-1 p-1.5 border rounded bg-white text-slate-900" value={effect.hp || 0} onChange={(e) => onChange({...effect, hp: parseInt(e.target.value)})} /></div>
                        <div className="flex items-center gap-1"><span className="w-16">🧠 멘탈:</span><input type="number" className="flex-1 p-1.5 border rounded bg-white text-slate-900" value={effect.sanity || 0} onChange={(e) => onChange({...effect, sanity: parseInt(e.target.value)})} /></div>
                        <div className="flex items-center gap-1"><span className="w-16">💤 피로:</span><input type="number" className="flex-1 p-1.5 border rounded bg-white text-slate-900" value={effect.fatigue || 0} onChange={(e) => onChange({...effect, fatigue: parseInt(e.target.value)})} /></div>
                        <div className="flex items-center gap-1"><span className="w-16">🦠 감염:</span><input type="number" className="flex-1 p-1.5 border rounded bg-white text-slate-900" value={effect.infection || 0} onChange={(e) => onChange({...effect, infection: parseInt(e.target.value)})} /></div>
                        <div className="flex items-center gap-1"><span className="w-16">🍖 허기:</span><input type="number" className="flex-1 p-1.5 border rounded bg-white text-slate-900" value={effect.hunger || 0} onChange={(e) => onChange({...effect, hunger: parseInt(e.target.value)})} /></div>
                        <div className="flex items-center gap-1"><span className="w-16">💞 호감:</span><input type="number" className="flex-1 p-1.5 border rounded bg-white text-slate-900" value={effect.affinity || 0} onChange={(e) => onChange({...effect, affinity: parseInt(e.target.value)})} /></div>
                    </div>
                </div>

                {/* 2. 아이템 및 스탯 */}
                <div className="space-y-2">
                    <label className="font-bold text-slate-600 dark:text-slate-400">아이템 및 능력치</label>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-16">아이템 획득:</span>
                            <input type="text" className="flex-1 p-1.5 border rounded bg-white text-slate-900" value={effect.loot?.join(',') || ''} onChange={(e) => onChange({...effect, loot: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} placeholder="예: 통조림, 붕대" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-16">아이템 제거:</span>
                            <input type="text" className="flex-1 p-1.5 border rounded bg-white text-slate-900" value={effect.inventoryRemove?.join(',') || ''} onChange={(e) => onChange({...effect, inventoryRemove: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} placeholder="예: 권총" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-16">스탯 변화:</span>
                            <div className="flex gap-1 flex-1">
                                {Object.keys(STAT_LABELS).map(statKey => (
                                    <input 
                                        key={statKey}
                                        type="number" 
                                        placeholder={statKey.toUpperCase()} 
                                        className="w-full p-1 border rounded bg-white text-slate-900 text-center"
                                        title={STAT_LABELS[statKey]}
                                        value={effect.statChanges?.[statKey as keyof Stats] || ''}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            const newStats = { ...effect.statChanges, [statKey]: isNaN(val) ? undefined : val };
                                            onChange({...effect, statChanges: newStats});
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. 심화 설정 (상태이상, 스킬) */}
            <div className="border-t pt-2 border-slate-200 dark:border-slate-700">
                <label className="font-bold text-slate-600 dark:text-slate-400 mb-2 block">심화 설정 (고급)</label>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <span>상태 변경:</span>
                        <select 
                            className="p-1.5 border rounded bg-white text-slate-900"
                            value={effect.status || ''}
                            onChange={(e) => onChange({...effect, status: e.target.value ? e.target.value as Status : undefined})}
                        >
                            <option value="">(변경 없음)</option>
                            <option value="Alive">생존 (Alive)</option>
                            <option value="Infected">감염됨 (Infected)</option>
                            <option value="Dead">사망 (Dead)</option>
                            <option value="Zombie">좀비화 (Zombie)</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>정신 상태:</span>
                        <select 
                            className="p-1.5 border rounded bg-white text-slate-900"
                            value={effect.mentalState || ''}
                            onChange={(e) => onChange({...effect, mentalState: e.target.value ? e.target.value as MentalState : undefined})}
                        >
                            <option value="">(변경 없음)</option>
                            <option value="Normal">평온 (Normal)</option>
                            <option value="Anxiety">불안 (Anxiety)</option>
                            <option value="Trauma">트라우마 (Trauma)</option>
                            <option value="Despair">절망 (Despair)</option>
                            <option value="Madness">광기 (Madness)</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px] flex items-center gap-2">
                        <span>스킬 추가:</span>
                        <input 
                            type="text" 
                            className="flex-1 p-1.5 border rounded bg-white text-slate-900" 
                            placeholder="예: 전술 사격 (아이콘은 자동)"
                            value={effect.skillsAdd?.map(s => s.name).join(',') || ''}
                            onChange={(e) => {
                                const names = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                                onChange({...effect, skillsAdd: names.map(n => ({ name: n, description: '커스텀 스킬', icon: '⭐' }))});
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const OptionEditor = ({ option, idx, onChange, onDelete }: { option: StoryOption, idx: number, onChange: (o: StoryOption) => void, onDelete: () => void }) => {
        // 타입 결정: choiceText가 있으면 'CHOICE'(선택지), 없으면 'AUTO'(자동 진행)
        const [mode, setMode] = useState<'AUTO' | 'CHOICE'>(option.choiceText ? 'CHOICE' : 'AUTO');
        const [isDice, setIsDice] = useState(!!option.dice);

        useEffect(() => {
            setMode(option.choiceText ? 'CHOICE' : 'AUTO');
            setIsDice(!!option.dice);
        }, [option]);

        const updateDice = (field: string, val: any) => {
            const newDice = { ...option.dice, [field]: val } as any;
            if (!newDice.stat) newDice.stat = 'str';
            if (!newDice.threshold) newDice.threshold = 50;
            onChange({ ...option, dice: newDice });
        };

        const handleTypeChange = (newType: 'AUTO' | 'CHOICE') => {
            setMode(newType);
            if (newType === 'AUTO') {
                // 자동 진행: 텍스트 제거, 주사위 제거
                onChange({ ...option, choiceText: undefined, dice: undefined });
                setIsDice(false);
            } else {
                // 선택지: 기본 텍스트 추가
                onChange({ ...option, choiceText: '선택지 입력' });
            }
        };

        return (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-600 space-y-3 shadow-sm transition-all">
                {/* Header & Type Selector */}
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-bold text-slate-500">#{idx + 1}</div>
                        <div className="flex bg-slate-100 dark:bg-slate-900 rounded p-0.5">
                            <button 
                                onClick={() => handleTypeChange('AUTO')}
                                className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${mode === 'AUTO' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
                            >
                                ⚡ 자동 진행
                            </button>
                            <button 
                                onClick={() => handleTypeChange('CHOICE')}
                                className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${mode === 'CHOICE' ? 'bg-white dark:bg-slate-700 shadow text-green-600 dark:text-green-400' : 'text-slate-400'}`}
                            >
                                👆 선택지 버튼
                            </button>
                        </div>
                    </div>
                    <button onClick={onDelete} className="text-red-500 font-bold px-2 hover:bg-red-50 rounded text-xs">삭제</button>
                </div>

                <div className="space-y-3">
                    {/* Common Field: Next Node ID */}
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold w-16 text-slate-500">이동할 노드 ID</label>
                        <input 
                            className="flex-1 p-1.5 border rounded bg-white text-slate-900 font-mono text-xs" 
                            value={option.id} 
                            onChange={(e) => onChange({ ...option, id: e.target.value })} 
                            placeholder="예: story_next_chapter"
                        />
                    </div>

                    {/* Auto Mode Specific */}
                    {mode === 'AUTO' && (
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold w-16 text-slate-500">확률 가중치</label>
                            <input 
                                type="number"
                                className="w-20 p-1.5 border rounded bg-white text-slate-900 text-xs" 
                                value={option.weight} 
                                onChange={(e) => onChange({ ...option, weight: parseFloat(e.target.value) || 1 })} 
                            />
                            <span className="text-[10px] text-slate-400">* 여러 자동 진행이 있을 때 선택될 확률 (기본 1)</span>
                        </div>
                    )}

                    {/* Choice Mode Specific */}
                    {mode === 'CHOICE' && (
                        <>
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold w-16 text-slate-500">버튼 텍스트</label>
                                <input 
                                    className="flex-1 p-1.5 border rounded bg-white text-slate-900 text-xs font-bold" 
                                    value={option.choiceText || ''} 
                                    onChange={(e) => onChange({ ...option, choiceText: e.target.value })} 
                                    placeholder="예: 문을 연다"
                                />
                            </div>

                            {/* Dice Toggle */}
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={isDice} 
                                        onChange={(e) => {
                                            setIsDice(e.target.checked);
                                            if (e.target.checked) onChange({ ...option, dice: { stat: 'str', threshold: 50, successId: option.id, failId: '' } });
                                            else onChange({ ...option, dice: undefined });
                                        }}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">🎲 주사위 판정 추가</span>
                                </label>
                            </div>

                            {/* Dice Config */}
                            {isDice && (
                                <div className="space-y-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800 mt-2">
                                    <div className="flex gap-2 text-xs">
                                        <span className="font-bold pt-1">판정 스탯:</span>
                                        <select className="p-1 border rounded bg-white text-slate-900" value={option.dice?.stat} onChange={(e) => updateDice('stat', e.target.value)}>
                                            {Object.keys(STAT_LABELS).map(k => <option key={k} value={k}>{STAT_LABELS[k]}</option>)}
                                        </select>
                                        <input type="number" className="w-16 p-1 border rounded bg-white text-slate-900" placeholder="난이도" value={option.dice?.threshold} onChange={(e) => updateDice('threshold', parseInt(e.target.value))} />
                                        <span className="text-slate-400 self-center">(0~100)</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <label className="block font-bold text-green-600 mb-1">성공 시 이동 ID</label>
                                            <input className="w-full p-1 border rounded bg-white text-slate-900 font-mono" value={option.dice?.successId || ''} onChange={(e) => updateDice('successId', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block font-bold text-red-600 mb-1">실패 시 이동 ID</label>
                                            <input className="w-full p-1 border rounded bg-white text-slate-900 font-mono" value={option.dice?.failId || ''} onChange={(e) => updateDice('failId', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 text-xs items-center">
                                        <span className="font-bold text-red-500">실패 패널티:</span>
                                        <span>HP</span> <input type="number" className="w-12 p-1 border rounded bg-white text-slate-900" value={option.dice?.hpPenalty || 0} onChange={(e) => updateDice('hpPenalty', parseInt(e.target.value))} />
                                        <span>멘탈</span> <input type="number" className="w-12 p-1 border rounded bg-white text-slate-900" value={option.dice?.sanityPenalty || 0} onChange={(e) => updateDice('sanityPenalty', parseInt(e.target.value))} />
                                    </div>
                                </div>
                            )}

                            {/* Requirements */}
                            <div className="flex gap-2 items-center text-xs bg-slate-50 dark:bg-slate-900/50 p-2 rounded mt-2">
                                <span className="font-bold text-slate-500">조건(선택):</span>
                                <input className="w-20 p-1 border rounded bg-white text-slate-900" placeholder="스킬명" value={option.req?.skill || ''} onChange={(e) => onChange({...option, req: {...option.req, skill: e.target.value}})} />
                                <input className="w-20 p-1 border rounded bg-white text-slate-900" placeholder="아이템명" value={option.req?.item || ''} onChange={(e) => onChange({...option, req: {...option.req, item: e.target.value}})} />
                                <input type="number" className="w-12 p-1 border rounded bg-white text-slate-900" placeholder="인원" value={option.req?.minSurvivors || ''} onChange={(e) => onChange({...option, req: {...option.req, minSurvivors: parseInt(e.target.value)}})} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[120] bg-white dark:bg-slate-900 flex flex-col animate-fade-in text-slate-800 dark:text-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-100 dark:bg-slate-950">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    🛠️ 커스텀 이벤트 제작소
                    {view !== 'LIST' && <span className="text-sm font-normal text-slate-500"> &gt; {view === 'EDIT_ARC' ? '시나리오 편집' : '노드 편집'}</span>}
                </h2>
                <div className="flex gap-2">
                    {view === 'LIST' && (
                        <label className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded cursor-pointer hover:bg-slate-300 transition-colors text-sm font-bold">
                            📂 불러오기
                            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                        </label>
                    )}
                    <button onClick={onClose} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-bold text-sm transition-colors">닫기</button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden max-w-5xl mx-auto w-full relative">
                
                {/* VIEW: LIST */}
                {view === 'LIST' && (
                    <div className="space-y-4 h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-slate-500">나만의 이벤트를 만들어 게임에 추가하거나, 다른 사람의 이벤트를 불러오세요.</p>
                            <button onClick={handleCreateArc} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-md">+ 새 시나리오 만들기</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                            {customArcs.map(arc => (
                                <div key={arc.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col">
                                    <h3 className="font-bold text-lg mb-1 truncate">{arc.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex-1 line-clamp-2">{arc.description}</p>
                                    <div className="text-[10px] text-slate-400 mb-4 bg-slate-100 dark:bg-slate-900 p-2 rounded">
                                        ID: {arc.id}<br/>
                                        Nodes: {Object.keys(arc.nodes).length}개
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-auto">
                                        <button onClick={() => { setCurrentArc(arc); setView('EDIT_ARC'); }} className="py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded text-xs font-bold hover:bg-blue-200">편집</button>
                                        <button onClick={() => handleExport(arc)} className="py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded text-xs font-bold hover:bg-green-200">내보내기</button>
                                        <button onClick={() => handleDeleteArc(arc.id)} className="py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded text-xs font-bold hover:bg-red-200">삭제</button>
                                    </div>
                                </div>
                            ))}
                            {customArcs.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center text-slate-400 h-64 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                    <span className="text-4xl mb-2">📝</span>
                                    <p>생성된 커스텀 이벤트가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* VIEW: EDIT_ARC */}
                {view === 'EDIT_ARC' && currentArc && (
                    <div className="h-full flex flex-col">
                        {/* Editor Toolbar */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-end z-10 shadow-sm">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-xs font-bold mb-1">시나리오 제목</label>
                                <input 
                                    className="w-full p-2 border rounded bg-white text-slate-900 dark:border-slate-600" 
                                    value={currentArc.title} 
                                    onChange={(e) => setCurrentArc({...currentArc, title: e.target.value})}
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-xs font-bold mb-1">시작 노드</label>
                                <select 
                                    className="w-full p-2 border rounded bg-white text-slate-900 dark:border-slate-600"
                                    value={currentArc.starterNodeId}
                                    onChange={(e) => setCurrentArc({...currentArc, starterNodeId: e.target.value})}
                                >
                                    <option value="">(선택)</option>
                                    {Object.keys(currentArc.nodes).map(id => <option key={id} value={id}>{id}</option>)}
                                </select>
                            </div>
                            <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                                <button 
                                    onClick={() => setEditorMode('LIST')}
                                    className={`px-3 py-2 text-xs font-bold ${editorMode === 'LIST' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}
                                >
                                    ☰ 목록 보기
                                </button>
                                <button 
                                    onClick={() => setEditorMode('GRID')}
                                    className={`px-3 py-2 text-xs font-bold ${editorMode === 'GRID' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}
                                >
                                    ⛶ 그리드 보기
                                </button>
                            </div>
                            <button onClick={handleSaveCurrentArc} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow text-sm ml-auto">
                                저장 완료
                            </button>
                        </div>

                        {/* Editor Content Area */}
                        <div className="flex-1 overflow-hidden relative">
                            
                            {/* 1. LIST MODE */}
                            {editorMode === 'LIST' && (
                                <div className="h-full overflow-y-auto p-4 custom-scrollbar">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center rounded-t-lg">
                                        <h3 className="font-bold text-sm">노드 목록 (Nodes)</h3>
                                        <button onClick={handleCreateNode} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700">+ 노드 추가</button>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-b-lg p-4 space-y-2">
                                        {Object.values(currentArc.nodes).map(node => (
                                            <div key={node.id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-600">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-blue-600">{node.id}</span>
                                                        {node.id === currentArc.starterNodeId && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded">START</span>}
                                                    </div>
                                                    <p className="text-xs text-slate-500 truncate mt-1">{node.text}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditNode(node.id)} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">수정</button>
                                                    <button onClick={() => handleDeleteNode(node.id)} className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 px-2 py-1 rounded">삭제</button>
                                                </div>
                                            </div>
                                        ))}
                                        {Object.keys(currentArc.nodes).length === 0 && <p className="text-center text-slate-400 text-sm py-10">노드를 추가하여 스토리를 구성하세요.</p>}
                                    </div>
                                </div>
                            )}

                            {/* 2. GRID MODE */}
                            {editorMode === 'GRID' && (
                                <div 
                                    ref={graphRef}
                                    className="h-full w-full bg-[#1a1a2e] relative overflow-hidden cursor-grab active:cursor-grabbing"
                                    onMouseDown={(e) => handleMouseDown(e)}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                >
                                    {/* Grid Background Pattern */}
                                    <div 
                                        className="absolute inset-0 opacity-20 pointer-events-none"
                                        style={{
                                            backgroundSize: '40px 40px',
                                            backgroundImage: 'linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)',
                                            backgroundPosition: `${pan.x}px ${pan.y}px`
                                        }}
                                    ></div>

                                    {/* Graph Container */}
                                    <div 
                                        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
                                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                    >
                                        {/* Connections Layer (SVG) */}
                                        <svg className="absolute top-0 left-0 w-[5000px] h-[5000px] overflow-visible pointer-events-none" style={{transform: 'translate(-2500px, -2500px)'}}>
                                            {Object.values(currentArc.nodes).map(node => (
                                                node.next?.map((opt, i) => {
                                                    const targetNode = opt.dice ? (currentArc.nodes[opt.dice.successId] || currentArc.nodes[opt.dice.failId]) : currentArc.nodes[opt.id];
                                                    // Note: Dice logic splits into two paths, visualizing simplified logic here to target primary ID for now or successId
                                                    const realTarget = currentArc.nodes[opt.id] || (opt.dice ? currentArc.nodes[opt.dice.successId] : null);
                                                    
                                                    if (!realTarget) return null;
                                                    
                                                    const startX = (node.position?.x || 0) + 2500 + 180; // Card Width 180
                                                    const startY = (node.position?.y || 0) + 2500 + 40; // Card Height ~80 / 2
                                                    const endX = (realTarget.position?.x || 0) + 2500;
                                                    const endY = (realTarget.position?.y || 0) + 2500 + 40;

                                                    // Bezier Curve
                                                    const c1x = startX + 50;
                                                    const c1y = startY;
                                                    const c2x = endX - 50;
                                                    const c2y = endY;

                                                    return (
                                                        <g key={`${node.id}-${i}`}>
                                                            <path 
                                                                d={`M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`}
                                                                stroke={opt.dice ? "#a855f7" : (opt.choiceText ? "#3b82f6" : "#64748b")} 
                                                                strokeWidth={opt.choiceText ? "2" : "1"} 
                                                                strokeDasharray={opt.choiceText ? "" : "5,5"}
                                                                fill="none" 
                                                                opacity="0.6"
                                                            />
                                                            <polygon points={`${endX},${endY} ${endX-10},${endY-5} ${endX-10},${endY+5}`} fill={opt.dice ? "#a855f7" : (opt.choiceText ? "#3b82f6" : "#64748b")} />
                                                        </g>
                                                    );
                                                })
                                            ))}
                                        </svg>

                                        {/* Nodes Layer */}
                                        {Object.values(currentArc.nodes).map(node => (
                                            <div
                                                key={node.id}
                                                onMouseDown={(e) => handleMouseDown(e, node.id)}
                                                onDoubleClick={() => handleEditNode(node.id)}
                                                className={`absolute w-[180px] p-2 rounded shadow-lg border-2 cursor-pointer pointer-events-auto transition-shadow hover:shadow-xl hover:border-white group flex flex-col gap-1
                                                    ${node.id === currentArc.starterNodeId ? 'bg-amber-900/80 border-amber-500' : 'bg-slate-800/90 border-slate-600'}
                                                `}
                                                style={{
                                                    left: node.position?.x || 0,
                                                    top: node.position?.y || 0,
                                                }}
                                            >
                                                <div className="flex justify-between items-start text-[10px] text-slate-400 font-mono mb-1">
                                                    <span className="truncate w-2/3" title={node.id}>{node.id}</span>
                                                    {node.id === currentArc.starterNodeId && <span className="text-amber-400 font-bold">START</span>}
                                                </div>
                                                <div className="text-xs text-white line-clamp-3 leading-tight h-[45px] overflow-hidden">
                                                    {node.text || "(내용 없음)"}
                                                </div>
                                                <div className="mt-1 flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => { e.stopPropagation(); handleEditNode(node.id); }} className="px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded">Edit</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Floating Add Button */}
                                    <button 
                                        onClick={handleCreateNode}
                                        className="absolute bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-2xl z-50"
                                        title="노드 추가"
                                    >
                                        +
                                    </button>
                                    
                                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] p-2 rounded pointer-events-none">
                                        드래그: 이동 | 더블클릭: 편집
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* VIEW: EDIT_NODE */}
                {view === 'EDIT_NODE' && (
                    <div className="h-full flex flex-col space-y-4 p-6 overflow-y-auto custom-scrollbar">
                        <div>
                            <label className="block text-xs font-bold mb-1">노드 ID (고유값)</label>
                            <input 
                                className="w-full p-2 border rounded bg-white text-slate-900 dark:border-slate-600 font-mono text-sm" 
                                value={currentNode.id} 
                                onChange={(e) => setCurrentNode({...currentNode, id: e.target.value})}
                                placeholder="예: my_story_start"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">스토리 텍스트</label>
                            <textarea 
                                className="w-full p-2 border rounded bg-white text-slate-900 dark:border-slate-600 text-sm h-24" 
                                value={currentNode.text}
                                onChange={(e) => setCurrentNode({...currentNode, text: e.target.value})}
                                placeholder="이벤트 내용을 입력하세요..."
                            />
                        </div>

                        <EffectEditor 
                            effect={currentNode.effect || { target: 'ALL' }} 
                            onChange={(ef) => setCurrentNode({...currentNode, effect: ef})}
                        />

                        <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 overflow-y-auto max-h-[400px]">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-sm">다음 단계 연결 (Next)</h4>
                                <button 
                                    onClick={() => setCurrentNode({
                                        ...currentNode, 
                                        next: [...(currentNode.next || []), { id: '', weight: 1 }] // 기본: 자동 진행 (choiceText 없음)
                                    })}
                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                                >
                                    + 연결 추가
                                </button>
                            </div>
                            <div className="space-y-3">
                                {currentNode.next?.map((opt, idx) => (
                                    <OptionEditor 
                                        key={idx} 
                                        idx={idx} 
                                        option={opt} 
                                        onChange={(newOpt) => {
                                            const newNext = [...(currentNode.next || [])];
                                            newNext[idx] = newOpt;
                                            setCurrentNode({ ...currentNode, next: newNext });
                                        }}
                                        onDelete={() => {
                                            const newNext = currentNode.next?.filter((_, i) => i !== idx);
                                            setCurrentNode({ ...currentNode, next: newNext });
                                        }}
                                    />
                                ))}
                                {(!currentNode.next || currentNode.next.length === 0) && (
                                    <p className="text-xs text-slate-400 text-center">연결된 노드가 없으면 이벤트가 종료됩니다.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            <button onClick={() => setView('EDIT_ARC')} className="px-4 py-2 text-slate-500 text-sm font-bold">취소</button>
                            <button onClick={handleSaveNode} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold shadow">노드 저장</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomEventManager;
