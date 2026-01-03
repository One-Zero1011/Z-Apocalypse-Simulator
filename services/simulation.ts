
import { 
    Character, SimulationResult, CharacterUpdate, GameSettings, ForcedEvent, Ending, CustomStoryArc
} from '../types';
import { DAILY_HUNGER_LOSS } from '../constants';
import { getNextStoryNode } from './events/globalEvents';
import { GHOST_EVENTS } from './events/ghostEvents';

// Import Logic Modules
import { addLootToGlobal, applyEffectToUpdate, getCharacterUpdate, sanitizeForMinors, generateEffectLog } from './core/utils';
import { processStatusChanges } from './core/status';
import { processInteractionPhase } from './core/interaction';
import { processRelationshipEvolution } from './core/relationship';
import { processPlannedActions, processPersonalEvents } from './core/events';
import { processForcedEvents } from './core/forcedEvents'; 

export const simulateDay = async (
    day: number, 
    characters: Character[], 
    currentStoryNodeId: string | null, 
    settings: GameSettings, 
    forcedEvents: ForcedEvent[], 
    userSelectedNodeId?: string,
    customArcs: CustomStoryArc[] = []
): Promise<SimulationResult> => {
    const events: string[] = []; 
    const updates: CharacterUpdate[] = []; 
    const globalLoot: string[] = [];
    const inventoryRemove: string[] = [];

    // 1. Story Event Logic
    // Check if there is a forced STORY event
    const forcedStoryEvent = forcedEvents.find(e => e.type === 'STORY');
    const effectiveUserSelectedNodeId = forcedStoryEvent ? forcedStoryEvent.key : userSelectedNodeId;

    const storyNode = getNextStoryNode(currentStoryNodeId, effectiveUserSelectedNodeId, customArcs);
    let nextStoryNodeId = storyNode.id;
    
    const tarotEvent = nextStoryNodeId === 'tarot_continue';
    let effectLogString = '';

    if (storyNode.effect) {
        const effect = storyNode.effect;
        let targets: Character[] = [];
        const living = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
        
        if (effect.target === 'ALL') targets = living;
        else if (effect.target === 'RANDOM_1' && living.length > 0) targets = [living[Math.floor(Math.random() * living.length)]];
        else if (effect.target === 'RANDOM_HALF' && living.length > 0) targets = [...living].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(living.length / 2));
        
        if (effect.loot) {
            addLootToGlobal(effect.loot, globalLoot);
        }

        const effectForTargets = { ...effect, loot: undefined };
        targets.forEach(t => {
            const u = getCharacterUpdate(updates, t.id);
            applyEffectToUpdate(u, effectForTargets as any, globalLoot);
        });

        if (effect.inventoryRemove) inventoryRemove.push(...effect.inventoryRemove);
        const targetIdForLog = targets.length === 1 ? targets[0].id : undefined;
        effectLogString = generateEffectLog(storyNode.effect as any, characters, settings.showEventEffects, targetIdForLog);
    }
    
    const sanitizedStoryText = sanitizeForMinors(storyNode.text, characters, settings);
    events.push(`📖 [스토리] ${sanitizedStoryText}${effectLogString}`);

    // 2. Module Execution
    // Handle Forced Events (Non-Story)
    processForcedEvents(characters, forcedEvents, updates, events, globalLoot, settings);

    processPlannedActions(characters, updates, events, globalLoot);
    processPersonalEvents(characters, updates, events, settings, globalLoot);
    processInteractionPhase(characters, settings, updates, events, globalLoot);
    processStatusChanges(characters, updates, events, settings);
    
    // Check Forced Pregnancy
    let babyEvent = processRelationshipEvolution(characters, updates, events, settings);
    const forcedPregnancy = forcedEvents.find(e => e.type === 'SYSTEM' && e.key === 'PREGNANCY');
    if (forcedPregnancy && forcedPregnancy.actorId && forcedPregnancy.targetId) {
        babyEvent = { fatherId: forcedPregnancy.actorId, motherId: forcedPregnancy.targetId };
    }

    // 3. Ghost Events (Specific to this day)
    characters.filter(c => c.status === 'Dead').forEach(d => {
        characters.filter(l => l.status !== 'Dead' && l.status !== 'Missing' && (l.relationships[d.id] || 0) > 50).forEach(l => {
            if (Math.random() < 0.2) {
                const u = getCharacterUpdate(updates, l.id);
                const ev = GHOST_EVENTS[Math.floor(Math.random() * GHOST_EVENTS.length)](d.name, l.name);
                applyEffectToUpdate(u, ev, globalLoot); 
                events.push(ev.text);
            }
        });
    });

    // 4. Ending Check (Logic Fixed: Check updated status)
    let triggeredEnding: Ending | null = null;
    
    // Calculate final living count based on current state + updates
    let finalLivingCount = 0;
    characters.forEach(c => {
        const update = updates.find(u => u.id === c.id);
        const currentStatus = update?.status || c.status;
        if (currentStatus !== 'Dead' && currentStatus !== 'Missing') {
            finalLivingCount++;
        }
    });

    // Pre-check condition: Are there any characters at all?
    if (characters.length > 0) {
        if (finalLivingCount === 0) {
            triggeredEnding = { id: 'extinction', title: '인류의 황혼', description: '모든 생존자가 사망했습니다. 고요한 폐허 속에 인류의 흔적만이 바람에 흩날립니다.', icon: '💀', type: 'BAD' };
        } else if (day >= 365) {
            triggeredEnding = { id: 'survival_1year', title: '새로운 시작', description: '1년이라는 긴 시간 동안 지옥에서 살아남았습니다. 당신들은 이제 단순한 생존자가 아닌, 새로운 세계의 개척자입니다.', icon: '🌅', type: 'GOOD' };
        } else if (storyNode.id.includes('rescue')) {
            triggeredEnding = { id: 'rescue_success', title: '안전 지대로', description: '극적인 구조 끝에 안전한 곳으로 이송되었습니다. 지옥 같던 날들은 이제 기억 속에만 남을 것입니다.', icon: '🚁', type: 'GOOD' };
        }
    }

    // 5. Zombie Hunger Update (Passive)
    characters.filter(c => c.status === 'Zombie').forEach(c => {
        getCharacterUpdate(updates, c.id).hungerChange = (getCharacterUpdate(updates, c.id).hungerChange || 0) - DAILY_HUNGER_LOSS;
    });

    return {
        narrative: storyNode.text,
        events,
        updates,
        loot: globalLoot,
        inventoryRemove,
        nextStoryNodeId,
        babyEvent,
        tarotEvent,
        ending: triggeredEnding
    };
};
