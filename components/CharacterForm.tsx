import React, { useState } from 'react';
import { MBTI, Gender } from '../types';
import { MBTI_TYPES } from '../constants';

interface Props {
  onAdd: (name: string, gender: Gender, mbti: MBTI) => void;
  disabled?: boolean;
}

const CharacterForm: React.FC<Props> = ({ onAdd, disabled }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [mbti, setMbti] = useState<MBTI>('ISTJ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name, gender, mbti);
      setName('');
      // Keep previous gender/mbti for faster batch entry
    }
  };

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