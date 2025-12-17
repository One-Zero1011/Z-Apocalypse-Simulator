
import React, { useState, useEffect } from 'react';
import { Character, Gender, MBTI, RelationshipStatus, MentalState } from '../types';
import { MBTI_TYPES, JOB_CATEGORIES } from '../constants';

interface Props {
    character: Character;
    allCharacters: Character[];
    onSave: (updatedChar: Character, relationshipUpdates: { targetId: string, status: RelationshipStatus, affinity: number }[]) => void;
    onClose: () => void;
}

const EditCharacterModal: React.FC<Props> = ({ character, allCharacters, onSave, onClose }) => {
    const [name, setName] = useState(character.name);
    const [gender, setGender] = useState<Gender>(character.gender);
    const [mbti, setMbti] = useState<MBTI>(character.mbti);
    const [job, setJob] = useState(character.job || '');
    const [mentalState, setMentalState] = useState<MentalState>(character.mentalState || 'Normal');
    
    // Manage relationships for editing
    // isFixed: true for relationships that existed before opening the modal
    const [relations, setRelations] = useState<{ targetId: string, status: RelationshipStatus, affinity: number, isFixed: boolean }[]>([]);

    useEffect(() => {
        const initialRelations = Object.keys(character.relationships).map(targetId => ({
            targetId,
            status: character.relationshipStatuses[targetId] || 'None',
            affinity: character.relationships[targetId] || 0,
            isFixed: true // Mark existing relationships as fixed
        }));
        setRelations(initialRelations);
    }, [character]);

    const handleRelationChange = (index: number, field: 'status' | 'affinity', value: any) => {
        const newRelations = [...relations];
        newRelations[index] = { ...newRelations[index], [field]: value };
        setRelations(newRelations);
    };

    const handleRemoveRelation = (index: number) => {
        const newRelations = relations.filter((_, i) => i !== index);
        setRelations(newRelations);
    };

    const handleAddRelation = () => {
        // Find a character not already in relations and not self
        const availableTargets = allCharacters.filter(c => 
            c.id !== character.id && !relations.some(r => r.targetId === c.id)
        );
        
        if (availableTargets.length > 0) {
            setRelations([...relations, { 
                targetId: availableTargets[0].id, 
                status: 'Friend', 
                affinity: 30,
                isFixed: false // New relations are editable
            }]);
        } else {
            alert("더 이상 관계를 추가할 대상이 없습니다.");
        }
    };

    const handleTargetChange = (index: number, newTargetId: string) => {
        const newRelations = [...relations];
        newRelations[index].targetId = newTargetId;
        setRelations(newRelations);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedChar: Character = {
            ...character,
            name,
            gender,
            mbti,
            job,
            mentalState,
            // We don't update relationships directly here, App.tsx handles the sync
        };
        // Pass relations (extra isFixed prop is harmless)
        onSave(updatedChar, relations);
    };

    const availableTargets = allCharacters.filter(c => c.id !== character.id);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
                
                <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        ✏️ 생존자 정보 수정
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">이름</label>
                                <input 
                                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">직업</label>
                                <select
                                    value={job}
                                    onChange={(e) => setJob(e.target.value)}
                                    className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white focus:border-blue-500"
                                >
                                    <option value="">(직업 없음/모름)</option>
                                    {Object.entries(JOB_CATEGORIES).map(([category, jobs]) => (
                                        <optgroup key={category} label={category}>
                                            {jobs.map(j => (
                                                <option key={j} value={j}>{j}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                    {/* 만약 기존 직업이 목록에 없다면 표시 */}
                                    {job && !Object.values(JOB_CATEGORIES).flat().includes(job) && (
                                        <option value={job}>{job} (기존 직업)</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">성별</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value as Gender)}
                                    className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                >
                                    <option value="Male">남성</option>
                                    <option value="Female">여성</option>
                                    <option value="Non-Binary">논바이너리</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">MBTI</label>
                                <select value={mbti} onChange={(e) => setMbti(e.target.value as MBTI)}
                                    className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                >
                                    {MBTI_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">정신 상태</label>
                                <select value={mentalState} onChange={(e) => setMentalState(e.target.value as MentalState)}
                                    className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                >
                                    <option value="Normal">평온</option>
                                    <option value="Trauma">트라우마</option>
                                    <option value="Despair">절망</option>
                                    <option value="Delusion">망상</option>
                                    <option value="Anxiety">불안</option>
                                    <option value="Madness">광기</option>
                                </select>
                            </div>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700" />

                        {/* Relationships */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">관계 설정 (호감도는 수정 불가)</label>
                                <button type="button" onClick={handleAddRelation} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300">
                                    + 관계 추가
                                </button>
                            </div>
                            
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {relations.map((rel, idx) => (
                                    <div key={idx} className={`flex gap-2 items-center p-2 rounded border ${rel.isFixed ? 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'}`}>
                                        <select 
                                            value={rel.targetId} 
                                            onChange={(e) => handleTargetChange(idx, e.target.value)}
                                            className="flex-1 text-xs p-1 rounded border bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:text-gray-500"
                                            disabled={rel.isFixed}
                                        >
                                            {availableTargets.map(t => (
                                                <option key={t.id} value={t.id} disabled={relations.some((r, i) => i !== idx && r.targetId === t.id)}>{t.name}</option>
                                            ))}
                                        </select>
                                        
                                        <select 
                                            value={rel.status} 
                                            onChange={(e) => handleRelationChange(idx, 'status', e.target.value)}
                                            className="w-24 text-xs p-1 rounded border bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                                        >
                                            <option value="None">관계없음</option>
                                            <optgroup label="긍정">
                                                <option value="Friend">친구</option>
                                                <option value="BestFriend">절친</option>
                                                <option value="Colleague">동료</option>
                                                <option value="Savior">은인</option>
                                                <option value="Lover">연인</option>
                                                <option value="Spouse">부부</option>
                                            </optgroup>
                                            <optgroup label="가족">
                                                <option value="Family">가족</option>
                                                <option value="Parent">부모</option>
                                                <option value="Child">자식</option>
                                                <option value="Sibling">형제/자매</option>
                                            </optgroup>
                                            <optgroup label="부정">
                                                <option value="Rival">라이벌</option>
                                                <option value="Ex">전 애인</option>
                                                <option value="Enemy">원수</option>
                                            </optgroup>
                                        </select>

                                        <input 
                                            type="number" 
                                            value={rel.affinity} 
                                            onChange={(e) => handleRelationChange(idx, 'affinity', parseInt(e.target.value))}
                                            className="w-14 text-xs p-1 rounded border bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white text-center disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:text-gray-500"
                                            placeholder="호감도"
                                            disabled={rel.isFixed}
                                        />

                                        {!rel.isFixed ? (
                                            <button type="button" onClick={() => handleRemoveRelation(idx)} className="text-red-500 hover:text-red-700 px-1">
                                                ×
                                            </button>
                                        ) : (
                                            <span className="px-1 text-gray-400 text-xs cursor-not-allowed" title="초기 관계는 삭제/대상변경/호감도수정 불가">🔒</span>
                                        )}
                                    </div>
                                ))}
                                {relations.length === 0 && <p className="text-xs text-slate-400 text-center py-2">설정된 관계가 없습니다.</p>}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition-colors">
                                취소
                            </button>
                            <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors">
                                저장 (Save)
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCharacterModal;
