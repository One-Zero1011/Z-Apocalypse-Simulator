import React, { useState } from 'react';
import { MBTI, Gender, Character } from '../types';
import { MBTI_TYPES } from '../constants';

interface Props {
  onAdd: (name: string, gender: Gender, mbti: MBTI, initialRelation?: { targetId: string, type: string }) => void;
  disabled?: boolean;
  existingCharacters?: Character[];
}

const CharacterForm: React.FC<Props> = ({ onAdd, disabled, existingCharacters = [] }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [mbti, setMbti] = useState<MBTI>('ISTJ');
  
  // Relationship State
  const [targetId, setTargetId] = useState<string>('');
  const [relationType, setRelationType] = useState<string>('Friend');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      let relationPayload = undefined;
      if (targetId && relationType) {
          relationPayload = { targetId, type: relationType };
      }
      onAdd(name, gender, mbti, relationPayload);
      
      setName('');
      // Reset relation
      setTargetId('');
      setRelationType('Friend');
    }
  };

  const livingCharacters = existingCharacters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md">
      <h3 className="text-lg font-bold mb-4 text-zombie-green">New Survivor</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none"
            placeholder="Survivor Name"
            maxLength={20}
            required
            disabled={disabled}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none"
              disabled={disabled}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">MBTI</label>
            <select
              value={mbti}
              onChange={(e) => setMbti(e.target.value as MBTI)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none"
              disabled={disabled}
            >
              {MBTI_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {livingCharacters.length > 0 && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">초기 관계 (선택)</label>
                <div className="grid grid-cols-2 gap-2">
                    <select
                        value={targetId}
                        onChange={(e) => setTargetId(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none"
                        disabled={disabled}
                    >
                        <option value="">(관계 없음)</option>
                        {livingCharacters.map(char => (
                            <option key={char.id} value={char.id}>{char.name}</option>
                        ))}
                    </select>
                    <select
                        value={relationType}
                        onChange={(e) => setRelationType(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none"
                        disabled={!targetId || disabled}
                    >
                        <option value="BestFriend">절친 (+60)</option>
                        <option value="Savior">생명의 은인 (+50)</option>
                        <option value="Friend">친구 (+30)</option>
                        <option value="Colleague">직장 동료 (+15)</option>
                        <option value="Lover">연인 (+80)</option>
                        <option value="Family">가족 (+60)</option>
                        <option value="Rival">라이벌 (-15)</option>
                        <option value="Ex">전 애인 (-20)</option>
                        <option value="Enemy">원수 (-50)</option>
                    </select>
                </div>
            </div>
        )}

        <button
          type="submit"
          disabled={!name.trim() || disabled}
          className="w-full bg-zombie-green hover:bg-lime-600 text-white dark:text-slate-900 font-bold py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Add to Group
        </button>
      </div>
    </form>
  );
};

export default CharacterForm;