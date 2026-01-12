
import React, { useState } from 'react';
import { CampState, FacilityType, Character, CampPolicies, RationingPolicy, WorkPolicy, SecurityPolicy } from '../types';
import { CAMP_FACILITIES, CONSTRUCTION_MATERIALS, FACILITY_JOB_BONUS_MAPPING, POLICY_INFO } from '../services/camp/constants';

interface Props {
    camp: CampState;
    inventory: string[];
    characters: Character[]; 
    onUpgrade: (type: FacilityType) => void;
    onAssignmentToggle: (type: FacilityType, charId: string) => void;
    onPolicyChange: (category: keyof CampPolicies, value: string) => void;
    onClose: () => void;
}

const CampManagementModal: React.FC<Props> = ({ camp, inventory, characters, onUpgrade, onAssignmentToggle, onPolicyChange, onClose }) => {
    const [activeTab, setActiveTab] = useState<'FACILITIES' | 'POLICIES'>('FACILITIES');
    const [pickingFor, setPickingFor] = useState<FacilityType | null>(null);

    // 인벤토리 아이템 카운팅 (자재만 필터링)
    const materialCounts = inventory.reduce((acc, item) => {
        if (CONSTRUCTION_MATERIALS.includes(item)) {
            acc[item] = (acc[item] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    // 전체 시설 레벨 합계 (캠프 등급)
    const totalLevel = (Object.values(camp.facilities) as number[]).reduce((a, b) => a + b, 0);
    const livingCharacters = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing' && c.status !== 'Zombie');

    const renderPolicies = () => {
        const policies = camp.policies || { rationing: 'Normal', workLoad: 'Normal', security: 'Standard' };
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {/* Rationing */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">🍖 식량 배급 (Rationing)</h4>
                    <div className="space-y-2">
                        {(['Generous', 'Normal', 'Tight'] as RationingPolicy[]).map(opt => (
                            <button
                                key={opt}
                                onClick={() => onPolicyChange('rationing', opt)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${policies.rationing === opt ? 'bg-amber-900/40 border-amber-500 ring-1 ring-amber-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600 opacity-70'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm text-slate-200">{POLICY_INFO.rationing[opt].label}</span>
                                    {policies.rationing === opt && <span className="text-amber-500 text-xs">●</span>}
                                </div>
                                <p className="text-[10px] text-slate-400">{POLICY_INFO.rationing[opt].desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Workload */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">🔨 노동 강도 (Workload)</h4>
                    <div className="space-y-2">
                        {(['Relaxed', 'Normal', 'Hard'] as WorkPolicy[]).map(opt => (
                            <button
                                key={opt}
                                onClick={() => onPolicyChange('workLoad', opt)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${policies.workLoad === opt ? 'bg-blue-900/40 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600 opacity-70'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm text-slate-200">{POLICY_INFO.workLoad[opt].label}</span>
                                    {policies.workLoad === opt && <span className="text-blue-500 text-xs">●</span>}
                                </div>
                                <p className="text-[10px] text-slate-400">{POLICY_INFO.workLoad[opt].desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Security */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">🛡️ 치안 수준 (Security)</h4>
                    <div className="space-y-2">
                        {(['None', 'Standard', 'Strict'] as SecurityPolicy[]).map(opt => (
                            <button
                                key={opt}
                                onClick={() => onPolicyChange('security', opt)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${policies.security === opt ? 'bg-red-900/40 border-red-500 ring-1 ring-red-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600 opacity-70'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm text-slate-200">{POLICY_INFO.security[opt].label}</span>
                                    {policies.security === opt && <span className="text-red-500 text-xs">●</span>}
                                </div>
                                <p className="text-[10px] text-slate-400">{POLICY_INFO.security[opt].desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-700 flex flex-col text-slate-200 relative">
                
                {/* Header */}
                <div className="bg-slate-950 p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            ⛺ 생존자 거점 (Base Camp)
                            <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full border border-indigo-400">
                                Lv.{Math.floor(totalLevel / 5) + 1}
                            </span>
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 bg-slate-900">
                    <button 
                        onClick={() => setActiveTab('FACILITIES')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'FACILITIES' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        🏗️ 시설 관리 (Facilities)
                    </button>
                    <button 
                        onClick={() => setActiveTab('POLICIES')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'POLICIES' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        📜 정책 설정 (Policies)
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900">
                    {activeTab === 'POLICIES' ? renderPolicies() : (
                        <>
                            {/* Resource Dashboard (Only for Facilities) */}
                            <div className="bg-slate-800/50 p-4 border-b border-slate-700 shrink-0 overflow-x-auto custom-scrollbar">
                                <div className="flex gap-4 min-w-max">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-lg border border-slate-700">
                                        <span className="text-lg">📦</span>
                                        <div className="flex flex-col leading-none">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase">보유 자재</span>
                                            <span className="text-sm font-bold text-slate-300">Materials</span>
                                        </div>
                                    </div>
                                    {CONSTRUCTION_MATERIALS.map(mat => {
                                        const count = materialCounts[mat] || 0;
                                        if (count === 0 && !['목재', '고철', '부품'].includes(mat)) return null; 
                                        return (
                                            <div key={mat} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${count > 0 ? 'bg-slate-800 border-slate-600' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
                                                <span className="text-xs font-bold text-slate-400">{mat}</span>
                                                <span className={`text-sm font-mono font-bold ${count > 0 ? 'text-amber-400' : 'text-slate-600'}`}>
                                                    {count}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Facilities Grid */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(CAMP_FACILITIES).map(([key, config]) => {
                                    const type = key as FacilityType;
                                    const currentLevel = camp.facilities[type] || 0;
                                    const isMaxLevel = currentLevel >= config.maxLevel;
                                    const nextLevel = currentLevel + 1;
                                    const cost = config.costPerLevel[nextLevel];
                                    
                                    const capacity = currentLevel >= 5 ? 3 : currentLevel >= 3 ? 2 : 1;
                                    const assignedIds = camp.assignments?.[type] || [];
                                    const assignedChars = assignedIds.map(id => characters.find(c => c.id === id)).filter(Boolean) as Character[];
                                    
                                    let canAfford = true;
                                    if (cost) {
                                        for (const [item, amount] of Object.entries(cost)) {
                                            if ((materialCounts[item] || 0) < amount) {
                                                canAfford = false;
                                                break;
                                            }
                                        }
                                    }

                                    return (
                                        <div key={type} className={`relative flex flex-col p-4 rounded-xl border-2 transition-all ${
                                            currentLevel > 0 ? 'bg-slate-800 border-slate-600 shadow-lg' : 'bg-slate-900 border-slate-800 opacity-80 hover:opacity-100'
                                        }`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl ${currentLevel > 0 ? 'bg-indigo-900/50 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                                                        {config.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-bold ${currentLevel > 0 ? 'text-white' : 'text-slate-400'}`}>
                                                            {config.name.split('(')[0]}
                                                        </h4>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            {[...Array(config.maxLevel)].map((_, i) => (
                                                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < currentLevel ? 'bg-green-500' : 'bg-slate-700'}`} />
                                                            ))}
                                                            <span className="text-[10px] text-slate-500 ml-1">Lv.{currentLevel}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-400 mb-4 min-h-[32px] line-clamp-2">
                                                {config.description}
                                            </p>

                                            {currentLevel > 0 && (
                                                <div className="mb-4 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Workers ({assignedIds.length}/{capacity})</span>
                                                        {assignedIds.length < capacity && (
                                                            <button onClick={() => setPickingFor(type)} className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded transition-colors">+ 배치</button>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {assignedChars.length > 0 ? assignedChars.map(char => {
                                                            const isBonus = (FACILITY_JOB_BONUS_MAPPING[type] as string[]).includes(char.job);
                                                            return (
                                                                <div key={char.id} className="flex justify-between items-center text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
                                                                    <div className="flex items-center gap-1">
                                                                        <span>{char.name}</span>
                                                                        {isBonus && <span className="text-[10px] text-green-400 font-bold">★</span>}
                                                                    </div>
                                                                    <button onClick={() => onAssignmentToggle(type, char.id)} className="text-red-400 hover:text-red-300 px-1">×</button>
                                                                </div>
                                                            );
                                                        }) : (
                                                            <div className="text-[10px] text-slate-600 italic text-center py-1">배치된 인원 없음</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mb-4 bg-slate-950/50 rounded-lg p-2 space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
                                                    <span>Effect</span>
                                                    {currentLevel < config.maxLevel && <span className="text-green-600">Next &gt;</span>}
                                                </div>
                                                <div className="text-xs text-indigo-300">
                                                    {currentLevel > 0 ? config.effects[currentLevel - 1] : "미건설"}
                                                </div>
                                                {currentLevel < config.maxLevel && (
                                                    <div className="text-xs text-green-500/80 pt-1 border-t border-slate-800 mt-1">
                                                        + {config.effects[currentLevel]}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-auto">
                                                {!isMaxLevel ? (
                                                    <>
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Cost</div>
                                                        <div className="grid grid-cols-2 gap-1 mb-3">
                                                            {Object.entries(cost).map(([item, amount]) => {
                                                                const has = materialCounts[item] || 0;
                                                                return (
                                                                    <div key={item} className={`flex justify-between px-2 py-1 rounded text-xs ${has >= amount ? 'bg-slate-700 text-slate-300' : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
                                                                        <span>{item}</span><span className="font-mono">{has}/{amount}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <button
                                                            onClick={() => onUpgrade(type)}
                                                            disabled={!canAfford}
                                                            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${canAfford ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                                        >
                                                            {canAfford ? <span>🚀 업그레이드</span> : <span>🔒 자재 부족</span>}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="w-full py-2.5 bg-indigo-900/30 border border-indigo-500/50 text-indigo-300 rounded-lg text-center font-bold text-sm">🌟 최대 레벨 도달</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Worker Picker Overlay */}
                {pickingFor && (
                    <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full p-4 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">인원 배치: {CAMP_FACILITIES[pickingFor].name.split('(')[0]}</h3>
                                <button onClick={() => setPickingFor(null)} className="text-slate-400 hover:text-white">✕</button>
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {livingCharacters.map(char => {
                                    const assignedWhere = Object.entries(camp.assignments).find(([_, ids]) => (ids as string[]).includes(char.id))?.[0];
                                    const isAssignedHere = assignedWhere === pickingFor;
                                    const isBonus = (FACILITY_JOB_BONUS_MAPPING[pickingFor!] as string[]).includes(char.job);

                                    return (
                                        <button 
                                            key={char.id}
                                            disabled={!!assignedWhere && !isAssignedHere}
                                            onClick={() => { onAssignmentToggle(pickingFor!, char.id); setPickingFor(null); }}
                                            className={`w-full flex justify-between items-center p-2 rounded text-sm transition-colors ${isAssignedHere ? 'bg-blue-900/50 border border-blue-500 text-white' : assignedWhere ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>{char.name}</span>
                                                <span className="text-[10px] text-slate-500">({char.job})</span>
                                                {isBonus && <span className="text-[10px] bg-green-900 text-green-400 px-1 rounded">⭐</span>}
                                            </div>
                                            {assignedWhere && !isAssignedHere && <span className="text-[10px] text-slate-500">다른 곳 배치됨</span>}
                                        </button>
                                    );
                                })}
                                {livingCharacters.length === 0 && <div className="text-center text-slate-500 text-xs py-4">배치할 생존자가 없습니다.</div>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampManagementModal;
