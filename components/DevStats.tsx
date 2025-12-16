
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
                    <p className="text-sm text-slate-500 dark:text-slate-400">{character.gender} | {character.mbti}</p>
                </div>
            </div>

            {/* Status & Mental */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Status</label>
                    <select 
                        value={character.status} 
                        onChange={(e) => onUpdate(character, 'status', e.target.value as Status)}
                        className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                    >
                        <option value="Alive">Alive</option>
                        <option value="Infected">Infected</option>
                        <option value="Zombie">Zombie</option>
                        <option value="Dead">Dead</option>
                        <option value="Missing">Missing</option>
                    </select>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Mental State</label>
                    <select 
                        value={character.mentalState || 'Normal'} 
                        onChange={(e) => onUpdate(character, 'mentalState', e.target.value as MentalState)}
                        className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                    >
                        <option value="Normal">Normal</option>
                        <option value="PTSD">PTSD</option>
                        <option value="Depression">Depression</option>
                        <option value="Schizophrenia">Schizophrenia</option>
                        <option value="Paranoia">Paranoia</option>
                        <option value="DID">DID</option>
                    </select>
                </div>
            </div>

            {/* Core Attributes */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold border-b pb-2 dark:text-slate-200">Attributes</h4>
                
                {[{key: 'hp', label: 'HP (체력)', max: 100, color: 'accent-red-500'}, 
                  {key: 'sanity', label: 'Sanity (정신력)', max: 100, color: 'accent-blue-500'}, 
                  {key: 'fatigue', label: 'Fatigue (피로도)', max: 100, color: 'accent-purple-500'}, 
                  {key: 'infection', label: 'Infection (감염도)', max: 100, color: 'accent-green-500'},
                  {key: 'hunger', label: 'Hunger (허기 - 좀비용)', max: 100, color: 'accent-orange-500'}].map((attr) => (
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
                <h4 className="font-bold border-b pb-2 dark:text-slate-200">Relationships (호감도)</h4>
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
                {allCharacters.length <= 1 && <p className="text-xs text-slate-400 italic">No other characters to relate with.</p>}
            </div>
        </div>
    );
};

export default DevStats;
