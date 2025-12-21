
import React, { useState } from 'react';
import { MBTI, Gender, Character, MentalState, Stats } from '../types';
import { MBTI_TYPES, JOB_CATEGORIES } from '../constants';

interface Props {
  onAdd: (name: string, gender: Gender, mbti: MBTI, job: string, mentalState: MentalState, stats: Stats, initialRelations?: { targetId: string, type: string }[]) => void;
  disabled?: boolean;
  existingCharacters?: Character[];
  useMentalStates?: boolean;
  friendshipMode?: boolean; // New prop
}

// Random Generation Data
const SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
const MALE_NAMES = ['민준', '서준', '도윤', '예준', '시우', '하준', '지호', '지후', '준우', '현우', '도현', '지훈', '건우', '우진', '선우', '서진', '민재', '연우', '유준', '정우'];
const FEMALE_NAMES = ['서연', '서윤', '지우', '서현', '하은', '민서', '지유', '윤서', '채원', '지아', '지민', '서아', '다은', '예은', '수아', '지안', '소율', '예린', '하윤', '지원'];

const CharacterForm: React.FC<Props> = ({ onAdd, disabled, existingCharacters = [], useMentalStates = true, friendshipMode = false }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [mbti, setMbti] = useState<MBTI>('ISTJ');
  const [job, setJob] = useState<string>('');
  const [mentalState, setMentalState] = useState<MentalState>('Normal');
  const [stats, setStats] = useState<Stats>({ str: 5, agi: 5, con: 5, int: 5, cha: 5 });
  
  // Relationship State
  const [pendingRelations, setPendingRelations] = useState<{ targetId: string, type: string }[]>([]);
  const [tempTargetId, setTempTargetId] = useState<string>('');
  const [tempRelationType, setTempRelationType] = useState<string>('Friend');

  const handleStatChange = (stat: keyof Stats, value: string) => {
    const num = Math.max(0, Math.min(10, parseInt(value) || 0));
    setStats(prev => ({ ...prev, [stat]: num }));
  };

  const generateRandomStats = (): Stats => ({
    str: Math.floor(Math.random() * 11),
    agi: Math.floor(Math.random() * 11),
    con: Math.floor(Math.random() * 11),
    int: Math.floor(Math.random() * 11),
    cha: Math.floor(Math.random() * 11),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name, gender, mbti, job, mentalState, stats, pendingRelations);
      
      setName('');
      setJob('');
      setMentalState('Normal');
      setStats({ str: 5, agi: 5, con: 5, int: 5, cha: 5 });
      // Reset relation
      setPendingRelations([]);
      setTempTargetId('');
      setTempRelationType('Friend');
    }
  };

  const handleRandomAdd = () => {
      const rGender: Gender = Math.random() > 0.5 ? 'Male' : 'Female';
      const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
      const givenName = rGender === 'Male' 
          ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]
          : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
      const rName = `${surname}${givenName}`;
      const rMbti = MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)];
      const allJobs = Object.values(JOB_CATEGORIES).flat();
      const rJob = allJobs[Math.floor(Math.random() * allJobs.length)];
      const rStats = generateRandomStats();

      onAdd(rName, rGender, rMbti, rJob, 'Normal', rStats, []);
  };

  const handleAddRelation = () => {
      if (tempTargetId && tempRelationType) {
          setPendingRelations(prev => [...prev, { targetId: tempTargetId, type: tempRelationType }]);
          setTempTargetId('');
          setTempRelationType('Friend');
      }
  };

  const handleRemoveRelation = (index: number) => {
      setPendingRelations(prev => prev.filter((_, i) => i !== index));
  };

  const getRelationText = (type: string) => {
      switch (type) {
          case 'Spouse': return '부부 (+90)';
          case 'Child': return '자식 (+80)';
          case 'Parent': return '부모 (+80)';
          case 'Sibling': return '형제/자매 (+70)';
          case 'Guardian': return '보호자 (+80)';
          case 'Ward': return '피보호자 (+80)';
          case 'Lover': return '연인 (+80)';
          case 'Family': return '가족/친척 (+60)';
          case 'BestFriend': return '절친 (+60)';
          case 'Savior': return '은인 (+50)';
          case 'Friend': return '친구 (+30)';
          case 'Colleague': return '동료 (+15)';
          case 'Rival': return '라이벌 (-15)';
          case 'Ex': return '전 애인 (-20)';
          case 'Enemy': return '원수 (-50)';
          default: return type;
      }
  };

  const livingCharacters = existingCharacters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
  const availableTargets = livingCharacters.filter(c => !pendingRelations.some(r => r.targetId === c.id));

  // 초등학생, 중학생, 아기 결혼 제한 로직
  const targetJob = livingCharacters.find(c => c.id === tempTargetId)?.job || '';
  const isMarriageForbidden = ['초등학생', '중학생', '아기'].includes(job) || ['초등학생', '중학생', '아기'].includes(targetJob);

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md">
      <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-zombie-green">새로운 생존자</h3>
          <button
            type="button"
            onClick={handleRandomAdd}
            disabled={disabled}
            className="text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full font-bold transition-colors flex items-center gap-1"
            title="랜덤한 이름, 직업, MBTI, 스탯을 가진 생존자를 즉시 추가합니다."
          >
            <span>🎲</span> 랜덤 생존자 추가
          </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">이름</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none"
                placeholder="생존자 이름"
                maxLength={20}
                required
                disabled={disabled}
            />
            </div>
            <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">직업 (선택)</label>
                <select
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none"
                    disabled={disabled}
                >
                    <option value="">(직업 없음/모름)</option>
                    {Object.entries(JOB_CATEGORIES).map(([category, jobs]) => (
                        <optgroup key={category} label={category}>
                            {jobs.map(j => (
                                <option key={j} value={j}>{j}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>
        </div>

        {/* Stat Selection Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">능력치 (Stats 0-10)</label>
            <button 
              type="button" 
              onClick={() => setStats(generateRandomStats())}
              className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded hover:bg-slate-300 transition-colors font-bold"
            >
              스탯 랜덤
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: 'str' as keyof Stats, label: '💪힘' },
              { id: 'agi' as keyof Stats, label: '🏃민첩' },
              { id: 'con' as keyof Stats, label: '🛡️체력' },
              { id: 'int' as keyof Stats, label: '🧠지능' },
              { id: 'cha' as keyof Stats, label: '✨매력' }
            ].map(s => (
              <div key={s.id} className="flex flex-col items-center">
                <span className="text-[10px] mb-1 font-bold text-slate-500">{s.label}</span>
                <input 
                  type="number" min="0" max="10" 
                  value={stats[s.id]} 
                  onChange={(e) => handleStatChange(s.id, e.target.value)}
                  className="w-full text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 text-sm font-mono focus:border-zombie-green outline-none"
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-[9px] text-slate-400 italic leading-tight">
            * 체력(🛡️)은 최대 HP를, 지능(🧠)은 최대 정신력을 증가시킵니다.
          </p>
        </div>
        
        <div className={`grid grid-cols-1 ${useMentalStates ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">성별</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none"
              disabled={disabled}
            >
              <option value="Male">남성</option>
              <option value="Female">여성</option>
              <option value="Non-Binary">논바이너리</option>
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
          {useMentalStates && (
            <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">정신 상태</label>
                <select
                value={mentalState}
                onChange={(e) => setMentalState(e.target.value as MentalState)}
                className={`w-full bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none ${mentalState !== 'Normal' ? 'text-red-600 font-bold' : ''}`}
                disabled={disabled}
                >
                <option value="Normal">평온 (Normal)</option>
                <option value="Trauma">트라우마 (Trauma)</option>
                <option value="Despair">절망 (Despair)</option>
                <option value="Delusion">망상 (Delusion)</option>
                <option value="Anxiety">불안 (Anxiety)</option>
                <option value="Madness">광기 (Madness)</option>
                </select>
            </div>
          )}
        </div>

        {livingCharacters.length > 0 && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">초기 관계 설정 (선택)</label>
                
                {/* Pending Relations List */}
                {pendingRelations.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {pendingRelations.map((rel, idx) => {
                            const targetName = livingCharacters.find(c => c.id === rel.targetId)?.name || 'Unknown';
                            return (
                                <div key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 text-xs px-2 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                                    <span>{targetName}: {getRelationText(rel.type)}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveRelation(idx)}
                                        className="hover:text-red-500 ml-1 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Relation Adder */}
                {availableTargets.length > 0 ? (
                    <div className="flex gap-2">
                        <select
                            value={tempTargetId}
                            onChange={(e) => setTempTargetId(e.target.value)}
                            className="flex-1 bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none"
                            disabled={disabled}
                        >
                            <option value="">(대상 선택)</option>
                            {availableTargets.map(char => (
                                <option key={char.id} value={char.id}>{char.name}</option>
                            ))}
                        </select>
                        <select
                            value={tempRelationType}
                            onChange={(e) => setTempRelationType(e.target.value)}
                            className="flex-1 bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm text-slate-900 dark:text-slate-100 focus:border-zombie-green dark:focus:border-zombie-green focus:outline-none"
                            disabled={!tempTargetId || disabled}
                        >
                            <optgroup label="가족 (Family)">
                                {!friendshipMode && !isMarriageForbidden && <option value="Spouse">부부 (Spouse)</option>}
                                <option value="Child">자식 (Child)</option>
                                <option value="Parent">부모 (Parent)</option>
                                <option value="Sibling">형제/자매 (Sibling)</option>
                                <option value="Guardian">보호자 (Guardian)</option>
                                <option value="Ward">피보호자 (Ward)</option>
                                <option value="Family">친척/기타 가족</option>
                            </optgroup>
                            <optgroup label="사회 (Social)">
                                {!friendshipMode && <option value="Lover">연인 (Lover)</option>}
                                <option value="BestFriend">절친 (Best Friend)</option>
                                <option value="Friend">친구 (Friend)</option>
                                <option value="Colleague">동료 (Colleague)</option>
                                <option value="Fan">팬 (Fan)</option>
                                <option value="Savior">은인 (Savior)</option>
                            </optgroup>
                            <optgroup label="적대 (Hostile)">
                                <option value="Rival">라이벌 (Rival)</option>
                                {!friendshipMode && <option value="Ex">전 애인 (Ex)</option>}
                                <option value="Enemy">원수 (Enemy)</option>
                            </optgroup>
                        </select>
                        <button 
                            type="button"
                            onClick={handleAddRelation}
                            disabled={!tempTargetId || disabled}
                            className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-3 rounded text-sm font-bold disabled:opacity-50"
                        >
                            +
                        </button>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">더 이상 관계를 맺을 생존자가 없습니다.</p>
                )}
            </div>
        )}

        <button
          type="submit"
          disabled={!name.trim() || disabled}
          className="w-full mt-4 bg-zombie-green hover:bg-lime-600 text-white dark:text-slate-900 font-bold py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          그룹에 추가
        </button>
      </div>
    </form>
  );
};

export default CharacterForm;
