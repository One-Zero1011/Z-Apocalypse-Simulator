
import React from 'react';
import { Character, MentalState, Status } from '../types';

interface Props {
    character: Character;
    allCharacters: Character[];
    onUpdate: (character: Character, field: keyof Character | 'relationship', value: any, targetId?: string) => void;
}

const DevStats: React.FC<Props> = ({ character, allCharacters, onUpdate }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Profile Header */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold">
                    {character.name.slice(0, 1)}
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">{character.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{character.gender} | {character.mbti} | {character.job || '직업 없음'}</p>
                </div>
            </div>

            {/* Status & Mental & Job */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">상태 (Status)</label>
                    <select 
                        value={character.status} 
                        onChange={(e) => onUpdate(character, 'status', e.target.value as Status)}
                        className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                    >
                        <option value="Alive">생존 (Alive)</option>
                        <option value="Infected">감염됨 (Infected)</option>
                        <option value="Zombie">좀비 (Zombie)</option>
                        <option value="Dead">사망 (Dead)</option>
                        <option value="Missing">실종 (Missing)</option>
                    </select>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">정신 상태 (Mental)</label>
                    <select 
                        value={character.mentalState || 'Normal'} 
                        onChange={(e) => onUpdate(character, 'mentalState', e.target.value as MentalState)}
                        className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                    >
                        <option value="Normal">평온 (Normal)</option>
                        <option value="Trauma">트라우마 (Trauma)</option>
                        <option value="Despair">절망 (Despair)</option>
                        <option value="Delusion">망상 (Delusion)</option>
                        <option value="Anxiety">불안 (Anxiety)</option>
                        <option value="Madness">광기 (Madness)</option>
                    </select>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">직업 (Job - 직접 입력)</label>
                    <input 
                        type="text"
                        value={character.job || ''} 
                        onChange={(e) => onUpdate(character, 'job', e.target.value)}
                        className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                        placeholder="직업 입력"
                    />
                </div>
            </div>

            {/* Core Attributes */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold border-b pb-2 dark:text-slate-200">속성 (Attributes)</h4>
                
                {[{key: 'hp', label: '체력 (HP)', max: 100, color: 'accent-red-500'}, 
                  {key: 'sanity', label: '정신력 (Sanity)', max: 100, color: 'accent-blue-500'}, 
                  {key: 'fatigue', label: '피로도 (Fatigue)', max: 100, color: 'accent-purple-500'}, 
                  {key: 'infection', label: '감염도 (Infection)', max: 100, color: 'accent-green-500'},
                  {key: 'hunger', label: '허기 (Hunger - 좀비용)', max: 100, color: 'accent-orange-500'}].map((attr) => (
                    <div key={attr.key}>
                        <div className="flex justify-between text-xs font-bold mb-1 dark:text-slate-400">
                            <label>{attr.label}</label>
                            <span>{character[attr.key as keyof Character] as number}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max={attr.max} 
                            value={character[attr.key as keyof Character] as number} 
                            onChange={(e) => onUpdate(character, attr.key as keyof Character, parseInt(e.target.value))}
                            className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${attr.color}`}
                        />
                    </div>
                ))}
            </div>

            {/* Relationships */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold border-b pb-2 dark:text-slate-200">관계도 (Relationships)</h4>
                {allCharacters.filter(c => c.id !== character.id).map(target => (
                    <div key={target.id} className="flex items-center gap-3">
                        <span className="text-xs font-bold w-16 truncate dark:text-slate-300" title={target.name}>{target.name}</span>
                        <input 
                            type="range" 
                            min="-100" 
                            max="100" 
                            value={character.relationships[target.id] || 0} 
                            onChange={(e) => onUpdate(character, 'relationship', parseInt(e.target.value), target.id)}
                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                        />
                        <input 
                            type="number"
                            value={character.relationships[target.id] || 0}
                            onChange={(e) => onUpdate(character, 'relationship', parseInt(e.target.value), target.id)}
                            className="w-14 p-1 text-xs border rounded text-center dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                    </div>
                ))}
                {allCharacters.length <= 1 && <p className="text-xs text-slate-400 italic">관계 맺을 다른 캐릭터가 없습니다.</p>}
            </div>
        </div>
    );
};

export default DevStats;
