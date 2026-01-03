
import React from 'react';
import { Character, GameSettings, CharacterUpdate, Ending, ForcedEvent, BabyEventData } from '../types';
import { STORY_NODES } from '../services/events/storyNodes';

// Modals
import ItemUseModal from './ItemUseModal';
import RelationshipMap from './RelationshipMap';
import SystemMenu from './SystemMenu';
import DeveloperMenu from './DeveloperMenu';
import ConfirmationModal from './ConfirmationModal';
import TutorialModal from './TutorialModal';
import StoryChoiceModal from './StoryChoiceModal';
import BabyNamingModal from './BabyNamingModal';
import EditCharacterModal from './EditCharacterModal';
import PlannedActionModal from './PlannedActionModal';
import TarotModal from './TarotModal';
import EndingModal from './EndingModal';
import CharacterDetailModal from './CharacterDetailModal';
import GriefModal from './GriefModal';
import CharacterSummaryModal from './CharacterSummaryModal';
import CustomEventManager from './CustomEventManager';

interface GameModalsProps {
    engine: any; 
    uiState: {
        showRelationshipMap: boolean; setShowRelationshipMap: (v: boolean) => void;
        showSystemMenu: boolean; setShowSystemMenu: (v: boolean) => void;
        showDevMenu: boolean; setShowDevMenu: (v: boolean) => void;
        showGriefList: boolean; setShowGriefList: (v: boolean) => void;
        showTutorial: boolean; setShowTutorial: (v: boolean) => void;
        showCustomEvents: boolean; setShowCustomEvents: (v: boolean) => void; // New
        selectedItem: string | null; setSelectedItem: (v: string | null) => void;
        editingCharacter: Character | null; setEditingCharacter: (v: Character | null) => void;
        planningCharacter: Character | null; setPlanningCharacter: (v: Character | null) => void;
        detailCharacter: Character | null; setDetailCharacter: (v: Character | null) => void;
        summaryCharacter: Character | null; setSummaryCharacter: (v: Character | null) => void;
        confirmState: any; setConfirmState: (v: any) => void;
    };
    handlers: {
        handleNewGame: () => void;
        handleSaveGame: () => void;
        handleLoadGameFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSaveRoster: () => void;
        handleLoadRosterFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleUpdateCharacter: (c: Character) => void;
        handleSetPlannedAction: (cid: string, aid: string | null) => void;
        handleSaveEditedCharacter: (c: Character, rels: any) => void;
        handleStoryChoiceSelected: (nid: string, txt: string, p?: any) => void;
        handleBabyBorn: (name: string) => void;
        handleTarotResult: (u: CharacterUpdate[], log: string) => void;
        handleUseItem: (tid: string) => void;
        openTutorial: () => void;
        closeTutorial: (never: boolean) => void;
    };
    refs: {
        rosterInputRef: React.RefObject<HTMLInputElement>;
        gameSaveInputRef: React.RefObject<HTMLInputElement>;
    }
}

const ITEM_EFFECTS: Record<string, { desc: string, hp?: number, sanity?: number, fatigue?: number, cureMental?: boolean, cureInfection?: number, muzzle?: boolean, feed?: number }> = {
    '붕대': { desc: '체력 +15', hp: 15 },
    '항생제': { desc: '체력 +25', hp: 25 },
    '통조림': { desc: '피로도 -20', fatigue: -20 },
    '초콜릿': { desc: '정신력 +15', sanity: 15 },
    '비타민': { desc: '피로도 -10, 정신력 +5', fatigue: -10, sanity: 5 },
    '안정제': { desc: '불안정한 정신 상태 회복, 정신력 +25', sanity: 25, cureMental: true },
    '백신': { desc: '감염도 치료 (-50)', cureInfection: 50 },
    '입마개': { desc: '좀비에게 착용 시 물기 방지', muzzle: true },
    '고기': { desc: '좀비 허기 회복 (+30)', feed: 30 },
    '인육': { desc: '좀비 허기 완전 회복 (+100)', feed: 100 }
};

const DEV_ITEM_LIST = Array.from(new Set([...Object.keys(ITEM_EFFECTS), '생수 500ml', '맥가이버 칼', '권총', '지도', '무전기'])).sort();

const GameModals: React.FC<GameModalsProps> = ({ engine, uiState, handlers, refs }) => {
    const { characters, inventory, storyNodeId, storySelection, pendingBaby, activeTarot, activeEnding, forcedEvents, setForcedEvents, gameSettings, setGameSettings, customArcs, setCustomArcs } = engine;
    const { 
        showRelationshipMap, setShowRelationshipMap,
        showSystemMenu, setShowSystemMenu,
        showDevMenu, setShowDevMenu,
        showGriefList, setShowGriefList,
        showTutorial,
        showCustomEvents, setShowCustomEvents,
        selectedItem, setSelectedItem,
        editingCharacter, setEditingCharacter,
        planningCharacter, setPlanningCharacter,
        detailCharacter, setDetailCharacter,
        summaryCharacter, setSummaryCharacter,
        confirmState, setConfirmState
    } = uiState;

    const livingSurvivors = characters.filter((c: Character) => c.status === 'Alive' || c.status === 'Infected' || c.status === 'Zombie');
    const survivorsExist = livingSurvivors.length > 0;
    
    // Check custom nodes as well for choices
    const currentStoryHasChoices = !!(survivorsExist && gameSettings.enableStoryChoices && storyNodeId); 
    // Note: StoryChoiceModal handles the node lookup internally via passed props, we just need to ensure the modal opens.
    // The actual node object is tricky because it might be in STORY_NODES or customArcs.
    
    // Helper to find current node from ALL sources
    const getCurrentNode = () => {
        if (!storyNodeId) return null;
        if (STORY_NODES[storyNodeId]) return STORY_NODES[storyNodeId];
        for (const arc of customArcs) {
            if (arc.nodes[storyNodeId]) return arc.nodes[storyNodeId];
        }
        return null;
    };
    
    const currentNode = getCurrentNode();
    const hasChoices = currentNode?.next?.some((opt: any) => opt.choiceText);

    return (
        <>
            {currentStoryHasChoices && !activeEnding && currentNode && hasChoices &&
                <StoryChoiceModal node={currentNode} onSelect={handlers.handleStoryChoiceSelected} currentSelection={storySelection} characters={characters} inventory={inventory} />
            }
            
            {pendingBaby && 
                <BabyNamingModal father={characters.find((c: Character) => c.id === pendingBaby!.fatherId)!} mother={characters.find((c: Character) => c.id === pendingBaby!.motherId)!} onConfirm={handlers.handleBabyBorn} onCancel={() => engine.setPendingBaby(null)} />
            }
            
            {activeTarot && 
                <TarotModal livingCharIds={livingSurvivors.map((c: Character) => c.id)} onResult={handlers.handleTarotResult} />
            }
            
            {activeEnding && 
                <EndingModal ending={activeEnding} day={engine.day} onClose={() => engine.setActiveEnding(null)} onRestart={engine.resetGame} />
            }
            
            {confirmState && 
                <ConfirmationModal title={confirmState.title} message={confirmState.message} onConfirm={() => { confirmState.action(); setConfirmState(null); }} onCancel={() => setConfirmState(null)} isDangerous={confirmState.isDangerous} />
            }
            
            <ItemUseModal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} onUseItem={handlers.handleUseItem} survivors={livingSurvivors} itemEffects={ITEM_EFFECTS} />
            
            {showRelationshipMap && <RelationshipMap characters={characters} onClose={() => setShowRelationshipMap(false)} />}
            {editingCharacter && <EditCharacterModal character={editingCharacter} allCharacters={characters} onSave={handlers.handleSaveEditedCharacter} onClose={() => setEditingCharacter(null)} />}
            {planningCharacter && <PlannedActionModal character={planningCharacter} onSelect={(actionId) => handlers.handleSetPlannedAction(planningCharacter.id, actionId)} onClose={() => setPlanningCharacter(null)} />}
            {detailCharacter && <CharacterDetailModal character={detailCharacter} allCharacters={characters} onClose={() => setDetailCharacter(null)} />}
            {showGriefList && <GriefModal characters={characters} onClose={() => setShowGriefList(false)} />}
            {summaryCharacter && <CharacterSummaryModal character={summaryCharacter} onClose={() => setSummaryCharacter(null)} />}
            
            {showSystemMenu && 
                <SystemMenu 
                    onClose={() => setShowSystemMenu(false)} 
                    onNewGame={handlers.handleNewGame} 
                    onSaveRoster={handlers.handleSaveRoster} 
                    onLoadRoster={() => { if (refs.rosterInputRef.current) { refs.rosterInputRef.current.value = ''; refs.rosterInputRef.current.click(); } }} 
                    onSaveGame={handlers.handleSaveGame} 
                    onLoadGame={() => { if (refs.gameSaveInputRef.current) { refs.gameSaveInputRef.current.value = ''; refs.gameSaveInputRef.current.click(); } }} 
                    settings={gameSettings} 
                    onUpdateSettings={(newSettings) => setGameSettings((prev: any) => ({...prev, ...newSettings}))} 
                    onShowTutorial={handlers.openTutorial}
                    onShowCustomEvents={() => { setShowSystemMenu(false); setShowCustomEvents(true); }} // Connect Button
                />
            }
            
            {showCustomEvents &&
                <CustomEventManager onClose={() => setShowCustomEvents(false)} customArcs={customArcs} onUpdateArcs={setCustomArcs} />
            }

            {showDevMenu && 
                <DeveloperMenu onClose={() => setShowDevMenu(false)} forcedEvents={forcedEvents} setForcedEvents={setForcedEvents} characters={characters} onUpdateCharacter={handlers.handleUpdateCharacter} onAddInventory={(item, count) => engine.setInventory((prev: string[]) => [...prev, ...Array(count).fill(item)])} availableItems={DEV_ITEM_LIST} />
            }
            
            {showTutorial && <TutorialModal onClose={(neverShowAgain) => handlers.closeTutorial(neverShowAgain)} />}
            
            <input type="file" ref={refs.rosterInputRef} style={{ display: 'none' }} onChange={handlers.handleLoadRosterFile} />
            <input type="file" ref={refs.gameSaveInputRef} style={{ display: 'none' }} onChange={handlers.handleLoadGameFile} />
        </>
    );
};

export default GameModals;
