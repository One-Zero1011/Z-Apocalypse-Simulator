
import React from 'react';
import { Character } from '../types';
import CharacterCard from './CharacterCard';

interface Props {
    characters: Character[];
    onDelete: (id: string) => void;
    onEdit?: (character: Character) => void; 
    onPlan?: (character: Character) => void;
    onShowDetail?: (character: Character) => void; 
}

const SurvivorList: React.FC<Props> = ({ characters, onDelete, onEdit, onPlan, onShowDetail }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                생존자 목록 <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">{characters.length}</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {characters.map(char => (
                    <CharacterCard 
                        key={char.id} 
                        character={char} 
                        allCharacters={characters}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onPlan={onPlan}
                        onShowDetail={onShowDetail}
                    />
                ))}
            </div>
        </div>
    );
};

export default SurvivorList;
