
import React, { useState } from 'react';
import { Character, MentalState, Status, Stats, Skill } from '../types';
import { JOB_CATEGORIES } from '../constants';
import { SKILLS } from '../services/skillData';

interface Props {
    character: Character;
    allCharacters: Character[];
    onUpdate: (character: Character, field: keyof Character | 'relationship' | 'stats', value: any, targetId?: string) => void;
}

const DevStats: React.FC<Props> = ({ character, allCharacters, onUpdate }) => {
    const [skillToAdd, setSkillToAdd] = useState<string>('');
    
    if (!character) return <div className="text-slate-500 italic p-4 text-center">데이터를 불러오는 중...</div>;

    const handleStatUpdate = (stat: keyof Stats, val: number) => {
        const newStats = { ...character.stats, [stat]: val };
        onUpdate(character, 'stats', newStats);
        
        if (stat === 'con') {
            onUpdate({ ...character, stats: newStats }, 'maxHp', 100 + (val * 10));
        } else if (stat === 'int') {
            onUpdate({ ...character, stats: newStats }, 'maxSanity', 100 + (val * 10));
        }
    };

    const handleAddSkill = () => {
        if (!skillToAdd) return;
        const skillObj = SKILLS[skillToAdd];
        if (!skillObj) return;

        if (character.skills.some(s => s.name === skillObj.name)) {
            alert("이미 보유한 스킬입니다.");
            return;
        }

        const newSkills = [...character.skills, skillObj];
        onUpdate(character, 'skills', newSkills);
        setSkillToAdd('');
    };

    const handleRemoveSkill = (skillName: string) => {
        const newSkills = character.skills.filter(s => s.name !== skillName);
        onUpdate(character, 'skills', newSkills);
    };

    // 사용 가능한 스킬 목록 (이미 가진 스킬 제외)
    const availableSkills = Object.entries(SKILLS)
        .filter(([key, skill]) => !character.skills.some(s => s.name === skill.name))
        .sort((a, b) => a[1].name.localeCompare(b[1].name));

    return (
        <div className="space-y-6 animate-fade-in pb-10 custom-scrollbar overflow-y-auto max-h-full pr-2">
            {/* Profile Header */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold">
                    {character.name?.slice(0, 1) || '?'}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold dark:text-white">{character.name || '알 수 없음'}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{character.id}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{character.gender} | {character.mbti} | {character.job || '직업 없음'}</p>
                </div>
            </div>

            {/* Status & Mental */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">상태 (Status)</label>
                    <select 
                        value={character.status || 'Alive'} 
                        onChange={(e) => onUpdate(character, 'status', e.target.value as Status)}
                        className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="Alive">생존 (Alive)</option>
                        <option value="Infected">감염됨 (Infected)</option>
                        <option value="Zombie">좀비 (Zombie)</option>
                        <option value="Dead">사망 (Dead)</option>
                        <option value="Missing">실종 (Missing)</option>
                    </select>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">정신 상태 (Mental)</label>
                    <select 
                        value={character.mentalState || 'Normal'} 
                        onChange={(e) => onUpdate(character, 'mentalState', e.target.value as MentalState)}
                        className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="Normal">평온 (Normal)</option>
                        <option value="Trauma">트라우마 (Trauma)</option>
                        <option value="Despair">절망 (Despair)</option>
                        <option value="Delusion">망상 (Delusion)</option>
                        <option value="Anxiety">불안 (Anxiety)</option>
                        <option value="Madness">광기 (Madness)</option>
                    </select>
                </div>
            </div>

            {/* Stats Editor */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">능력치 편집 (Stats)</h4>
                <div className="grid grid-cols-5 gap-3">
                    {[
                        { id: 'str' as keyof Stats, label: 'STR', color: 'text-red-500' },
                        { id: 'agi' as keyof Stats, label: 'AGI', color: 'text-green-500' },
                        { id: 'con' as keyof Stats, label: 'CON', color: 'text-amber-500' },
                        { id: 'int' as keyof Stats, label: 'INT', color: 'text-blue-500' },
                        { id: 'cha' as keyof Stats, label: 'CHA', color: 'text-pink-500' }
                    ].map(s => (
                        <div key={s.id} className="flex flex-col items-center">
                            <label className={`text-[10px] font-black ${s.color} mb-1`}>{s.label}</label>
                            <input 
                                type="number" min="0" max="15"
                                value={character.stats?.[s.id] ?? 5}
                                onChange={(e) => handleStatUpdate(s.id, parseInt(e.target.value) || 0)}
                                className="w-full p-1.5 text-sm border rounded-lg text-center bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white font-mono shadow-inner"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Attributes Editor */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">상태 수치 (Attributes)</h4>
                
                {[{key: 'hp', label: '체력 (HP)', max: character.maxHp || 100, color: 'accent-red-500'}, 
                  {key: 'sanity', label: '정신력 (Sanity)', max: character.maxSanity || 100, color: 'accent-blue-500'}, 
                  {key: 'fatigue', label: '피로도 (Fatigue)', max: 100, color: 'accent-purple-500'}, 
                  {key: 'infection', label: '감염도 (Infection)', max: 100, color: 'accent-green-500'},
                  {key: 'hunger', label: '허기 (Hunger)', max: 100, color: 'accent-orange-500'}].map((attr) => (
                    <div key={attr.key}>
                        <div className="flex justify-between text-[10px] font-bold mb-1 dark:text-slate-400 uppercase">
                            <label>{attr.label}</label>
                            <span>{(character[attr.key as keyof Character] as number) ?? 0} / {attr.max}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max={attr.max} 
                            value={(character[attr.key as keyof Character] as number) ?? 0} 
                            onChange={(e) => onUpdate(character, attr.key as keyof Character, parseInt(e.target.value) || 0)}
                            className={`w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer ${attr.color}`}
                        />
                    </div>
                ))}
            </div>

            {/* Skill Manager */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">보유 스킬 관리 (Skills)</h4>
                
                {/* Current Skills List */}
                <div className="flex flex-wrap gap-2">
                    {character.skills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full text-[10px] font-bold text-amber-800 dark:text-amber-300 shadow-sm">
                            <span>{skill.icon} {skill.name}</span>
                            <button 
                                onClick={() => handleRemoveSkill(skill.name)}
                                className="hover:text-red-500 font-black ml-1 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {character.skills.length === 0 && <p className="text-[10px] text-slate-400 italic">보유한 스킬이 없습니다.</p>}
                </div>

                {/* Add Skill Controls */}
                <div className="flex gap-2">
                    <select 
                        value={skillToAdd}
                        onChange={(e) => setSkillToAdd(e.target.value)}
                        className="flex-1 p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                    >
                        <option value="">-- 추가할 스킬 선택 --</option>
                        {availableSkills.map(([key, skill]) => (
                            <option key={key} value={key}>{skill.icon} {skill.name}</option>
                        ))}
                    </select>
                    <button 
                        onClick={handleAddSkill}
                        disabled={!skillToAdd}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                        추가
                    </button>
                </div>
            </div>

            {/* Relationships Editor */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">관계도 (Relationships)</h4>
                {allCharacters.filter(c => c.id !== character.id).map(target => (
                    <div key={target.id} className="flex items-center gap-3">
                        <span className="text-xs font-bold w-20 truncate dark:text-slate-300" title={target.name}>{target.name}</span>
                        <input 
                            type="range" 
                            min="-100" 
                            max="100" 
                            value={character.relationships?.[target.id] ?? 0} 
                            onChange={(e) => onUpdate(character, 'relationship', parseInt(e.target.value) || 0, target.id)}
                            className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <input 
                            type="number"
                            value={character.relationships?.[target.id] ?? 0}
                            onChange={(e) => onUpdate(character, 'relationship', parseInt(e.target.value) || 0, target.id)}
                            className="w-14 p-1 text-xs border rounded-lg text-center bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white font-mono shadow-sm"
                        />
                    </div>
                ))}
                {allCharacters.length <= 1 && <p className="text-xs text-slate-400 italic text-center py-2">관계 맺을 다른 캐릭터가 없습니다.</p>}
            </div>
        </div>
    );
};

export default DevStats;
