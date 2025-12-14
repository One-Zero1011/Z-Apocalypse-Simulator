import React, { useState, useCallback, useEffect } from 'react';
import { Character, Gender, MBTI, DayLog, CharacterUpdate, RelationshipUpdate, RelationshipStatus } from './types';
import { MAX_HP, MAX_SANITY, INITIAL_INVENTORY, DEFAULT_RELATIONSHIP_VALUE } from './constants';
import CharacterForm from './components/CharacterForm';
import CharacterCard from './components/CharacterCard';
import EventLog from './components/EventLog';
import RelationshipMap from './components/RelationshipMap'; // Import
import { simulateDay } from './services/simulation';

const App: React.FC = () => {
  const [day, setDay] = useState(0);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showRelationshipMap, setShowRelationshipMap] = useState(false); // New State

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addCharacter = (name: string, gender: Gender, mbti: MBTI) => {
    const newChar: Character = {
      id: crypto.randomUUID(),
      name,
      gender,
      mbti,
      hp: MAX_HP,
      sanity: MAX_SANITY,
      status: 'Alive',
      inventory: [...INITIAL_INVENTORY],
      relationships: {},
      relationshipStatuses: {},
      killCount: 0
    };

    // Initialize relationships with existing characters
    setCharacters(prev => {
      const updatedPrev = prev.map(c => ({
        ...c,
        relationships: {
          ...c.relationships,
          [newChar.id]: DEFAULT_RELATIONSHIP_VALUE
        },
        relationshipStatuses: {
           ...c.relationshipStatuses,
           [newChar.id]: 'None' as RelationshipStatus
        }
      }));
      
      // Initialize new char relationships
      prev.forEach(c => {
        newChar.relationships[c.id] = DEFAULT_RELATIONSHIP_VALUE;
        newChar.relationshipStatuses[c.id] = 'None';
      });

      return [...updatedPrev, newChar];
    });
  };

  const deleteCharacter = (id: string) => {
    setCharacters(prev => {
      const remaining = prev.filter(c => c.id !== id);
      // Clean up relationships in remaining characters
      return remaining.map(c => {
        const newRels = { ...c.relationships };
        const newStatuses = { ...c.relationshipStatuses };
        if (id in newRels) delete newRels[id];
        if (id in newStatuses) delete newStatuses[id];
        return { ...c, relationships: newRels, relationshipStatuses: newStatuses };
      });
    });
  };

  const handleNextDay = useCallback(async () => {
    if (loading) return;
    if (characters.filter(c => c.status === 'Alive').length === 0) {
        setError("No survivors left to continue simulation.");
        return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const nextDay = day + 1;
      const result = await simulateDay(nextDay, characters);

      // Apply Updates
      setCharacters(prev => {
        const nextChars = [...prev];
        
        result.updates.forEach((update: CharacterUpdate) => {
          const index = nextChars.findIndex(c => c.id === update.id);
          if (index === -1) return;

          const char = { ...nextChars[index] };
          
          // Apply basic stats
          if (update.hpChange) char.hp = Math.max(0, Math.min(MAX_HP, char.hp + update.hpChange));
          if (update.sanityChange) char.sanity = Math.max(0, Math.min(MAX_SANITY, char.sanity + update.sanityChange));
          if (update.status) char.status = update.status;
          if (update.killCountChange) char.killCount += update.killCountChange;

          // Apply Inventory
          if (update.inventoryAdd) char.inventory = [...char.inventory, ...update.inventoryAdd];
          if (update.inventoryRemove) {
             char.inventory = char.inventory.filter(item => !update.inventoryRemove?.includes(item));
          }

          // Apply Relationships & Statuses
          if (update.relationshipUpdates) {
             const newRels = { ...char.relationships };
             const newStatuses = { ...char.relationshipStatuses };
             
             update.relationshipUpdates.forEach((rel: RelationshipUpdate) => {
                 // Update Score
                 const currentVal = newRels[rel.targetId] || 0;
                 newRels[rel.targetId] = Math.max(-100, Math.min(100, currentVal + rel.change));
                 
                 // Update Status (Lover/Ex)
                 if (rel.newStatus) {
                     newStatuses[rel.targetId] = rel.newStatus;
                 }
             });
             char.relationships = newRels;
             char.relationshipStatuses = newStatuses;
          }

          nextChars[index] = char;
        });

        return nextChars;
      });

      // Add Log
      setLogs(prev => [...prev, {
        day: nextDay,
        narrative: result.narrative,
        events: result.events
      }]);

      setDay(nextDay);

    } catch (err) {
      console.error(err);
      setError("Simulation Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [day, characters, loading]);

  const activeSurvivors = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing').length;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto transition-colors duration-300">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-300 dark:border-slate-700 pb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-slate-800 dark:text-slate-100">
              <span className="text-red-600">Z</span>-SIMULATOR
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Personality-Driven Apocalypse Engine</p>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="flex flex-wrap justify-end items-center gap-4">
            <button
                onClick={() => setShowRelationshipMap(true)}
                disabled={activeSurvivors < 2}
                className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm transition-all border
                    ${activeSurvivors < 2 
                        ? 'border-slate-300 text-slate-400 cursor-not-allowed dark:border-slate-700 dark:text-slate-600'
                        : 'border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
                    }
                `}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
                관계도 (Map)
            </button>

          <div className="text-right pl-4 border-l border-slate-300 dark:border-slate-700 hidden sm:block">
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">Day</div>
            <div className="text-3xl font-mono font-bold text-zombie-green">{day}</div>
          </div>
          <div className="text-right pl-4 border-l border-slate-300 dark:border-slate-700 hidden sm:block">
             <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">Survivors</div>
             <div className="text-3xl font-mono font-bold text-slate-800 dark:text-white">{activeSurvivors}/{characters.length}</div>
          </div>
          <button
            onClick={handleNextDay}
            disabled={loading || characters.length === 0}
            className={`
              ml-2 px-6 py-3 rounded font-bold text-lg uppercase tracking-wide transition-all shadow-md flex items-center gap-2
              ${loading 
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-wait' 
                : characters.length === 0 
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20'
              }
            `}
          >
            {loading ? 'Thinking...' : (
                <>
                Next Day
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
                </>
            )}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      {/* Relationship Map Modal */}
      {showRelationshipMap && (
          <RelationshipMap 
            characters={characters} 
            onClose={() => setShowRelationshipMap(false)} 
          />
      )}

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Log */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <EventLog logs={logs} />
        </div>

        {/* Right Column: Game State */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">
          
          {/* Add Character Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <CharacterForm onAdd={addCharacter} disabled={loading} />
             
             <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center shadow-sm">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Simulation Status</h3>
                {characters.length === 0 ? (
                  <p className="text-slate-500">Add survivors to begin the simulation.</p>
                ) : (
                  <div className="space-y-1">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {activeSurvivors > 0 
                          ? "The group is currently surviving. Interactions are generated based on MBTI traits." 
                          : "All survivors have perished."}
                      </p>
                      {day > 0 && (
                          <p className="text-xs text-slate-400 italic">
                             Check the "Relationship Map" to see how they feel about each other.
                          </p>
                      )}
                  </div>
                )}
             </div>
          </div>

          {/* Survivors Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              Survivors <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">{characters.length}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {characters.map(char => (
                <CharacterCard 
                  key={char.id} 
                  character={char} 
                  allCharacters={characters}
                  onDelete={deleteCharacter}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;