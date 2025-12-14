import { Character, SimulationResult, CharacterUpdate, MBTI } from "../types";
import { FATIGUE_THRESHOLD } from "../constants";

// Import separated events
import { GLOBAL_EVENTS } from "./events/globalEvents";
import { FATIGUE_EVENTS } from "./events/fatigueEvents";
import { GHOST_EVENTS } from "./events/ghostEvents"; // Import Ghost Events
import { 
    INTERACTION_TEMPLATES, 
    LOVER_EVENTS, 
    CONFESSION_EVENTS, 
    BREAKUP_EVENTS,
    REUNION_EVENTS,
    FAMILY_EVENTS,
    BEST_FRIEND_EVENTS,
    COLLEAGUE_EVENTS,
    RIVAL_EVENTS,
    SAVIOR_EVENTS,
    ENEMY_EVENTS,
    EX_LOVER_EVENTS
} from "./events/interactionEvents";
import { 
    MBTI_SPECIFIC_ACTIONS, 
    ANALYSTS, 
    DIPLOMATS, 
    SENTINELS 
    // EXPLORERS is implied as 'rest' in logic
} from "./events/mbtiEvents";

export const simulateDay = async (
  day: number,
  characters: Character[]
): Promise<SimulationResult> => {
  // 1. Filter living characters
  const livingCharacters = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
  const deadCharacters = characters.filter(c => c.status === 'Dead'); // Get dead characters
  
  if (livingCharacters.length === 0) {
    return {
      narrative: "침묵이 캠프에 내려앉았습니다. 생존자가 더 이상 없습니다.",
      events: ["게임 오버."],
      updates: []
    };
  }

  // 2. Generate Global Narrative
  const narrative = GLOBAL_EVENTS[Math.floor(Math.random() * GLOBAL_EVENTS.length)];
  const events: string[] = [];
  const updates: CharacterUpdate[] = [];

  // Helper to find or create update
  const getUpdate = (id: string) => {
    let u = updates.find(up => up.id === id);
    if (!u) {
        u = { id };
        updates.push(u);
    }
    return u;
  };

  // 3. Process Individual Events (Living)
  const shuffledChars = [...livingCharacters].sort(() => Math.random() - 0.5);

  shuffledChars.forEach(char => {
      // High Fatigue Check (Threshold Check)
      // If fatigue is high, there's a chance something bad happens instead of normal action
      if (char.fatigue >= FATIGUE_THRESHOLD && Math.random() < 0.6) {
          const badEvent = FATIGUE_EVENTS[Math.floor(Math.random() * FATIGUE_EVENTS.length)](char.name);
          
          const update = getUpdate(char.id);
          update.hpChange = (update.hpChange || 0) + (badEvent.hp || 0);
          update.sanityChange = (update.sanityChange || 0) + (badEvent.sanity || 0);
          update.fatigueChange = (update.fatigueChange || 0) + (badEvent.fatigue || 0);
          
          // Check death from fatigue event
          const currentHp = char.hp + (update.hpChange || 0);
          if (currentHp <= 0) {
              update.status = 'Dead';
              update.hpChange = -char.hp;
              events.push(`💀 ${badEvent.text} (사망)`);
          } else {
              events.push(badEvent.text);
          }
          return; // Skip normal action
      }

      // Chance to do nothing significant (Rest logic)
      if (Math.random() > 0.8) {
          // Add small chance to heal randomly when resting
          if (Math.random() > 0.5) {
               const update = getUpdate(char.id);
               update.hpChange = (update.hpChange || 0) + 5;
               update.fatigueChange = (update.fatigueChange || 0) - 15; // Resting reduces fatigue
               events.push(`💤 ${char.name}은(는) 안전한 곳에서 쪽잠을 자며 체력을 회복했습니다.`);
          } else {
               const update = getUpdate(char.id);
               update.fatigueChange = (update.fatigueChange || 0) - 10; // Just resting
               events.push(`🛌 ${char.name}은(는) 잠시 휴식을 취했습니다.`);
          }
          return;
      }

      // Execute MBTI specific action
      const action = MBTI_SPECIFIC_ACTIONS[char.mbti](char.name, char.gender);
      
      const update = getUpdate(char.id);
      update.hpChange = (update.hpChange || 0) + (action.hp || 0);
      update.sanityChange = (update.sanityChange || 0) + (action.sanity || 0);
      update.killCountChange = (update.killCountChange || 0) + (action.kill || 0);
      update.fatigueChange = (update.fatigueChange || 0) + (action.fatigue || 5); // Default fatigue cost is 5

      // Check for death logic
      const currentHp = char.hp + (update.hpChange || 0);
      if (currentHp <= 0) {
          update.status = 'Dead';
          update.hpChange = -char.hp;
          events.push(`💀 ${action.text} 그리고... ${char.name}은(는) 숨을 거두었습니다.`);
      } else {
          events.push(action.text);
      }
  });

  // 4. Ghost Events (New Logic)
  // If there are dead characters, there's a chance a ghost event occurs.
  if (deadCharacters.length > 0 && livingCharacters.length > 0) {
      // 30% chance of a ghost event per day if there are dead people
      if (Math.random() < 0.3) {
          const ghost = deadCharacters[Math.floor(Math.random() * deadCharacters.length)];
          const target = livingCharacters[Math.floor(Math.random() * livingCharacters.length)];
          
          const ghostEventFunc = GHOST_EVENTS[Math.floor(Math.random() * GHOST_EVENTS.length)];
          const ghostAction = ghostEventFunc(ghost.name, target.name);

          const update = getUpdate(target.id);
          update.sanityChange = (update.sanityChange || 0) + (ghostAction.sanity || 0);
          update.fatigueChange = (update.fatigueChange || 0) + (ghostAction.fatigue || 0);
          if (ghostAction.hp) update.hpChange = (update.hpChange || 0) + ghostAction.hp;

          events.push(ghostAction.text);
      }
  }

  // 5. Generate Interactions
  if (livingCharacters.length > 1) {
      const actorIndex = Math.floor(Math.random() * livingCharacters.length);
      let targetIndex = Math.floor(Math.random() * livingCharacters.length);
      while (actorIndex === targetIndex) {
          targetIndex = Math.floor(Math.random() * livingCharacters.length);
      }

      const actor = livingCharacters[actorIndex];
      const target = livingCharacters[targetIndex];
      
      const status = actor.relationshipStatuses[target.id] || 'None';
      const isLover = status === 'Lover';
      const isEx = status === 'Ex';
      const affinity = actor.relationships[target.id] || 0;

      // Logic Decision Tree
      let triggeredEvent = '';
      let affinityChange = 0;
      let newStatus: any = undefined;

      // Priority 1: Status Changes (Breakups, Reunions, Confessions)
      
      // Breakup Check
      if (isLover && (affinity < 40 || Math.random() < 0.05)) {
           triggeredEvent = BREAKUP_EVENTS[Math.floor(Math.random() * BREAKUP_EVENTS.length)](actor.name, target.name);
           affinityChange = -30;
           newStatus = 'Ex';
           events.push(`💔 ${triggeredEvent}`);
      }
      // Reunion Check
      else if (isEx && affinity >= 60 && Math.random() < 0.2) {
          triggeredEvent = REUNION_EVENTS[Math.floor(Math.random() * REUNION_EVENTS.length)](actor.name, target.name);
          affinityChange = 15;
          newStatus = 'Lover';
          events.push(`💞 ${triggeredEvent}`);
      }
      // Confession Check (Only if 'Friend', 'BestFriend', 'Colleague', 'Savior' or 'None' and high affinity)
      else if (!isLover && !isEx && status !== 'Family' && status !== 'Enemy' && affinity >= 75 && Math.random() < 0.2) {
           if (Math.random() > 0.4) {
               triggeredEvent = CONFESSION_EVENTS[Math.floor(Math.random() * CONFESSION_EVENTS.length)](actor.name, target.name);
               affinityChange = 10;
               newStatus = 'Lover';
               events.push(`💘 ${triggeredEvent}`);
           } else {
               events.push(`💬 ${actor.name}은(는) ${target.name}에게 고백하려 했지만, 타이밍을 놓쳐 어색해졌습니다.`);
               affinityChange = -5;
           }
      }
      // Priority 2: Status-Specific Interactions (If no status change occurred)
      else {
          let eventPool: ((a: string, b: string) => string)[] = [];
          
          if (isLover) {
              eventPool = LOVER_EVENTS;
              affinityChange = 5;
          } else if (status === 'Family') {
              eventPool = FAMILY_EVENTS;
              affinityChange = 5;
          } else if (status === 'BestFriend') {
              eventPool = BEST_FRIEND_EVENTS;
              affinityChange = 5;
          } else if (status === 'Colleague') {
              eventPool = COLLEAGUE_EVENTS;
              affinityChange = 2;
          } else if (status === 'Rival') {
              eventPool = RIVAL_EVENTS;
              affinityChange = 2; // Rivals can bond through competition
          } else if (status === 'Savior') {
              eventPool = SAVIOR_EVENTS;
              affinityChange = 5;
          } else if (status === 'Enemy') {
              eventPool = ENEMY_EVENTS;
              affinityChange = -5;
          } else if (status === 'Ex') {
              eventPool = EX_LOVER_EVENTS;
              affinityChange = -2;
          }
          
          // If a specific event pool was selected, use it
          if (eventPool.length > 0 && Math.random() < 0.7) { // 70% chance to use status event
              triggeredEvent = eventPool[Math.floor(Math.random() * eventPool.length)](actor.name, target.name);
              // Add icon based on status
              const icon = isLover ? '💕' : status === 'Family' ? '🏠' : status === 'BestFriend' ? '🤞' : status === 'Enemy' ? '⚔️' : '💬';
              events.push(`${icon} ${triggeredEvent}`);
          } 
          // Fallback to Standard Interaction
          else {
               // Determine compatibility
               const getGroup = (m: MBTI) => {
                  if (ANALYSTS.includes(m)) return 'ANALYST';
                  if (DIPLOMATS.includes(m)) return 'DIPLOMAT';
                  if (SENTINELS.includes(m)) return 'SENTINEL';
                  return 'EXPLORER';
               };
               const isCompatible = getGroup(actor.mbti) === getGroup(target.mbti);
               
               // Existing affinity affects probability
               const isPositive = (affinity + (isCompatible ? 20 : -20) + (Math.random() * 100)) > 50;
               
               affinityChange = isPositive ? 10 : -10;

               let interactionText = "";
               if (isPositive) {
                   const templates = INTERACTION_TEMPLATES.POSITIVE;
                   interactionText = templates[Math.floor(Math.random() * templates.length)](actor.name, target.name);
                   events.push(`🤝 ${interactionText}`);
               } else {
                   const templates = INTERACTION_TEMPLATES.NEGATIVE;
                   interactionText = templates[Math.floor(Math.random() * templates.length)](actor.name, target.name);
                   events.push(`🗯️ ${interactionText}`);
               }
          }
      }

      // Apply Updates Bidirectionally
      const actorUpdate = getUpdate(actor.id);
      if (!actorUpdate.relationshipUpdates) actorUpdate.relationshipUpdates = [];
      actorUpdate.relationshipUpdates.push({ targetId: target.id, change: affinityChange, newStatus });

      const targetUpdate = getUpdate(target.id);
      if (!targetUpdate.relationshipUpdates) targetUpdate.relationshipUpdates = [];
      targetUpdate.relationshipUpdates.push({ targetId: actor.id, change: affinityChange, newStatus });
  }

  // Artificial delay to simulate "processing"
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
      narrative,
      events,
      updates
  };
};