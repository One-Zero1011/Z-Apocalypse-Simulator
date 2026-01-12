
import React, { useState, useEffect } from 'react';
import { Character, Gender, MBTI, RelationshipStatus, MentalState } from '../types';
import { MBTI_TYPES, JOB_CATEGORIES } from '../constants';

interface Props {
    character: Character;
    allCharacters: Character[];
    onSave: (updatedChar: Character, relationshipUpdates: { targetId: string, status: RelationshipStatus, affinity: number }[]) => void;
    onClose: () => void;
    friendshipMode?: boolean; 
}

const EditCharacterModal: React.FC<Props> = ({ character, allCharacters, onSave, onClose, friendshipMode = false }) => {
    const [name, setName] = useState(character.name);
    const [gender, setGender] = useState<Gender>(character.gender);
    const [mbti, setMbti] = useState<MBTI>(character.mbti);
    const [job, setJob] = useState(character.job || '');
    const [mentalState, setMentalState] = useState<MentalState>(character.mentalState || 'Normal');
    
    const [relations, setRelations] = useState<{ targetId: string, status: RelationshipStatus, affinity: number, isFixed: boolean }[]>([]);

    useEffect(() => {
        const initialRelations = Object.keys(character.relationships).map(targetId => ({
            targetId,
            status: character.relationshipStatuses[targetId] || 'None',
            affinity: character.relationships[targetId] || 0,
            isFixed: true 
        }));
        setRelations(initialRelations);
    }, [character]);

    const getAffinityByStatus = (status: RelationshipStatus): number => {
        switch (status) {
            case 'Spouse': return 90;
            case 'Child':
            case 'Parent':
            case 'Guardian':
            case 'Ward':
            case 'Lover': return 80;
            case 'Sibling': return 70;
            case 'Family':
            case 'BestFriend': return 60;
            case 'Savior': return 50;
            case 'Friend': return 30;
            case 'Colleague': return 15;
            case 'Fan': return 40;
            case 'Rival': return -15;
            case 'Ex': return -20;
            case 'Enemy': return -50;
            default: return 0;
        }
    };

    const handleRelationChange = (index: number, field: 'status' | 'affinity', value: any) => {
        const newRelations = [...relations];
        if (field === 'status') {
            const newStatus = value as RelationshipStatus;
            newRelations[index] = { 
                ...newRelations[index], 
                status: newStatus,
                affinity: getAffinityByStatus(newStatus) // 유형 변경 시 호감도 자동 설정
            };
        } else {
            newRelations[index] = { ...newRelations[index], [field]: value };
        }
        setRelations(newRelations);
    };

    const handleRemoveRelation = (index: number) => {
        const newRelations = relations.filter((_, i) => i !== index);
        setRelations(newRelations);
    };

    const handleAddRelation = () => {
        const availableTargets = allCharacters.filter(c => 
            c.id !== character.id && !relations.some(r => r.targetId === c.id)
        );
        
        if (availableTargets.length > 0) {
            const defaultStatus: RelationshipStatus = 'Friend';
            setRelations([...relations, { 
                targetId: availableTargets[0].id, 
                status: defaultStatus, 
                affinity: getAffinityByStatus(defaultStatus),
                isFixed: false 
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
        };
        onSave(updatedChar, relations);
    };

    const getRelationText = (type: string) => {
        switch (type) {
            case 'Spouse': return '부부';
            case 'Child': return '자식';
            case 'Parent': return '부모';
            case 'Sibling': return '형제/자매';
            case 'Guardian': return '보호자';
            case 'Ward': return '피보호자';
            case 'Lover': return '연인';
            case 'Family': return '가족';
            case 'BestFriend': return '절친';
            case 'Savior': return '은인';
            case 'Friend': return '친구';
            case 'Colleague': return '동료';
            case 'Fan': return '팬';
            case 'Rival': return '라이벌';
            case 'Ex': return '전 애인';
            case 'Enemy': return '원수';
            default: return type;
        }
    };

    const getRelationDescription = (targetName: string, type: string) => {
        const myName = name || "현재 캐릭터";
        switch (type) {
            case 'Parent': return `👉 ${targetName}이(가) ${myName}의 [부모]가 됩니다.`;
            case 'Child': return `👉 ${targetName}이(가) ${myName}의 [자식]이 됩니다.`;
            case 'Guardian': return `👉 ${targetName}이(가) ${myName}의 [보호자]가 됩니다. (대상이 나를 지킴)`;
            case 'Ward': return `👉 ${targetName}이(가) ${myName}의 [피보호자]가 됩니다. (내가 대상을 지킴)`;
            case 'Spouse': return `👉 ${targetName}이(가) ${myName}의 [배우자]가 됩니다.`;
            case 'Sibling': return `👉 ${targetName}이(가) ${myName}의 [형제/자매]가 됩니다.`;
            case 'Lover': return `👉 ${targetName}이(가) ${myName}의 [연인]이 됩니다.`;
            default: return `👉 ${targetName}이(가) ${myName}의 [${getRelationText(type)}] 관계가 됩니다.`;
        }
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

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">관계 설정 (호감도 자동 계산)</label>
                                <button type="button" onClick={handleAddRelation} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300">
                                    + 관계 추가
                                </button>
                            </div>
                            
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {relations.map((rel, idx) => {
                                    const targetCharJob = allCharacters.find(c => c.id === rel.targetId)?.job || '';
                                    const targetCharName = allCharacters.find(c => c.id === rel.targetId)?.name || '대상';
                                    const isMarriageForbidden = ['초등학생', '중학생'].includes(job) || ['초등학생', '중학생'].includes(targetCharJob);

                                    return (
                                        <div key={idx} className={`flex flex-col gap-1 p-2 rounded border ${rel.isFixed ? 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'}`}>
                                            <div className="flex gap-2 items-center">
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
                                                        <option value="Fan">팬</option>
                                                        <option value="Savior">은인</option>
                                                        {!friendshipMode && <option value="Lover">연인</option>}
                                                        {!friendshipMode && !isMarriageForbidden && <option value="Spouse">부부</option>}
                                                    </optgroup>
                                                    <optgroup label="가족">
                                                        <option value="Family">가족</option>
                                                        <option value="Parent">부모</option>
                                                        <option value="Child">자식</option>
                                                        <option value="Sibling">형제/자매</option>
                                                        <option value="Guardian">보호자</option>
                                                        <option value="Ward">피보호자</option>
                                                    </optgroup>
                                                    <optgroup label="부정">
                                                        <option value="Rival">라이벌</option>
                                                        {!friendshipMode && <option value="Ex">전 애인</option>}
                                                        <option value="Enemy">원수</option>
                                                    </optgroup>
                                                </select>

                                                <div className="w-16 flex flex-col items-center">
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase">Affinity</span>
                                                    <input 
                                                        type="number" 
                                                        value={rel.affinity} 
                                                        readOnly
                                                        className="w-14 text-xs p-1 rounded border bg-gray-100 dark:bg-slate-900 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-center font-mono cursor-not-allowed"
                                                        title="호감도는 관계 유형에 따라 자동 설정됩니다."
                                                    />
                                                </div>

                                                {!rel.isFixed ? (
                                                    <button type="button" onClick={() => handleRemoveRelation(idx)} className="text-red-500 hover:text-red-700 px-1">
                                                        ×
                                                    </button>
                                                ) : (
                                                    <span className="px-1 text-gray-400 text-xs cursor-not-allowed" title="이미 저장된 관계는 유형 변경만 가능합니다.">🔒</span>
                                                )}
                                            </div>
                                            {/* 설명 텍스트 추가 */}
                                            {rel.targetId && rel.status !== 'None' && (
                                                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 pl-1">
                                                    {getRelationDescription(targetCharName, rel.status)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
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
