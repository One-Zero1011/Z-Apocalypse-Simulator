
import { Character, SimulationResult, CharacterUpdate, MBTI, MentalState } from "../types";
import { FATIGUE_THRESHOLD } from "../constants";

// Import separated events
import { getNextStoryNode } from "./events/globalEvents";
import { FATIGUE_EVENTS } from "./events/fatigueEvents";
import { GHOST_EVENTS } from "./events/ghostEvents"; 
import { MENTAL_ILLNESS_ACTIONS, MENTAL_INTERACTIONS, LOVER_MENTAL_EVENTS } from "./events/mentalEvents"; // New Import
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
} from "./events/mbtiEvents";

// Loot table updated with Antipsychotics
const LOOT_TABLE = [
    { name: '붕대', chance: 0.25 },
    { name: '항생제', chance: 0.1 },
    { name: '통조림', chance: 0.2 },
    { name: '초콜릿', chance: 0.2 },
    { name: '비타민', chance: 0.15 },
    { name: '정신병약', chance: 0.1 } // New Rare Item
];

// Added DID to the list
const MENTAL_STATES_LIST: MentalState[] = ['PTSD', 'Depression', 'Schizophrenia', 'Paranoia', 'DID'];

export const simulateDay = async (
  day: number,
  characters: Character[],
  currentStoryNodeId: string | null
): Promise<SimulationResult> => {
  // 1. Filter living characters
  const livingCharacters = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
  const deadCharacters = characters.filter(c => c.status === 'Dead'); 
  
  if (livingCharacters.length === 0) {
    return {
      narrative: "침묵이 캠프에 내려앉았습니다. 생존자가 더 이상 없습니다.",
      events: ["게임 오버."],
      updates: [],
      loot: [],
      nextStoryNodeId: null
    };
  }

  const events: string[] = [];
  const updates: CharacterUpdate[] = [];
  const loot: string[] = [];

  // Helper to find or create update
  const getUpdate = (id: string) => {
    let u = updates.find(up => up.id === id);
    if (!u) {
        u = { id };
        updates.push(u);
    }
    return u;
  };

  // 2. Generate Global Narrative (Chained Logic)
  const todayNode = getNextStoryNode(currentStoryNodeId);
  const narrative = todayNode.text;

  // Apply Story Node Effects
  if (todayNode.effect) {
      const effect = todayNode.effect;
      let targets: Character[] = [];

      // Determine targets
      if (effect.target === 'ALL') {
          targets = livingCharacters;
      } else if (effect.target === 'RANDOM_1') {
          targets = [livingCharacters[Math.floor(Math.random() * livingCharacters.length)]];
      } else if (effect.target === 'RANDOM_HALF') {
          targets = [...livingCharacters].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(livingCharacters.length / 2));
      }

      // Apply stats change
      targets.forEach(target => {
          const update = getUpdate(target.id);
          if (effect.hp) update.hpChange = (update.hpChange || 0) + effect.hp;
          if (effect.sanity) update.sanityChange = (update.sanityChange || 0) + effect.sanity;
          if (effect.fatigue) update.fatigueChange = (update.fatigueChange || 0) + effect.fatigue;
      });

      // Add Loot from Story
      if (effect.loot) {
          loot.push(...effect.loot);
          events.push(`✨ 스토리 보상으로 [${effect.loot.join(', ')}]을(를) 획득했습니다!`);
      }
  }
  
  let nextStoryNodeId: string | null = null;
  if (todayNode.next && todayNode.next.length > 0) {
      nextStoryNodeId = todayNode.id;
  } else {
      nextStoryNodeId = null;
  }

  // Looting Phase
  if (Math.random() < 0.45) { // Slightly increased chance
      const roll = Math.random();
      let cumulativeChance = 0;
      let foundItem = null;

      const totalWeight = LOOT_TABLE.reduce((sum, item) => sum + item.chance, 0);
      const normalizedRoll = roll * totalWeight;

      for (const item of LOOT_TABLE) {
          cumulativeChance += item.chance;
          if (normalizedRoll < cumulativeChance) {
              foundItem = item.name;
              break;
          }
      }

      if (foundItem) {
          loot.push(foundItem);
          events.push(`📦 주변을 수색하여 [${foundItem}]을(를) 획득했습니다!`);
      }
  }


  // 3. Process Individual Events (Living)
  const shuffledChars = [...livingCharacters].sort(() => Math.random() - 0.5);

  shuffledChars.forEach(char => {
      const update = getUpdate(char.id);

      // --- Mental Illness Checks ---
      
      // Onset (Low Sanity <= 10, 10% chance)
      if (char.mentalState === 'Normal' && char.sanity <= 10) {
          if (Math.random() < 0.1) {
              const newState = MENTAL_STATES_LIST[Math.floor(Math.random() * MENTAL_STATES_LIST.length)];
              update.mentalState = newState;
              events.push(`🧠⚠️ ${char.name}은(는) 극심한 스트레스로 인해 [${newState}] 증세를 보이기 시작했습니다.`);
          }
      }
      // Natural Recovery (High Sanity >= 90, 10% chance)
      else if (char.mentalState !== 'Normal' && char.sanity >= 90) {
           if (Math.random() < 0.1) {
              update.mentalState = 'Normal';
              events.push(`✨ ${char.name}은(는) 안정을 되찾고 정신적 고통에서 벗어났습니다.`);
           }
      }

      // Check current mental state (use updated state if changed)
      const currentMentalState = update.mentalState || char.mentalState;


      // --- Action Priority ---
      // 1. High Fatigue (Fail)
      // 2. Mental Illness Episode (New)
      // 3. Rest
      // 4. MBTI Action

      // 1. Fatigue
      if (char.fatigue >= FATIGUE_THRESHOLD && Math.random() < 0.6) {
          const badEvent = FATIGUE_EVENTS[Math.floor(Math.random() * FATIGUE_EVENTS.length)](char.name);
          update.hpChange = (update.hpChange || 0) + (badEvent.hp || 0);
          update.sanityChange = (update.sanityChange || 0) + (badEvent.sanity || 0);
          update.fatigueChange = (update.fatigueChange || 0) + (badEvent.fatigue || 0);
          
          if ((char.hp + (update.hpChange || 0)) <= 0) {
              update.status = 'Dead';
              update.hpChange = -char.hp;
              events.push(`💀 ${badEvent.text} (사망)`);
          } else {
              events.push(badEvent.text);
          }
          return; 
      }

      // 2. Mental Illness Episode (High chance if afflicted)
      if (currentMentalState !== 'Normal' && Math.random() < 0.7) {
           const illnessActionFunc = MENTAL_ILLNESS_ACTIONS[currentMentalState];
           if (illnessActionFunc) {
               const illnessAction = illnessActionFunc(char);
               
               update.hpChange = (update.hpChange || 0) + (illnessAction.hp || 0);
               update.sanityChange = (update.sanityChange || 0) + (illnessAction.sanity || 0);
               update.fatigueChange = (update.fatigueChange || 0) + (illnessAction.fatigue || 0);
               update.killCountChange = (update.killCountChange || 0) + (illnessAction.kill || 0);

               if ((char.hp + (update.hpChange || 0)) <= 0) {
                  update.status = 'Dead';
                  update.hpChange = -char.hp;
                  events.push(`💀 ${illnessAction.text} (사망)`);
               } else {
                   events.push(illnessAction.text);
               }
               return;
           }
      }

      // 3. Rest (Random)
      if (Math.random() > 0.8) {
           if (Math.random() > 0.5) {
               update.hpChange = (update.hpChange || 0) + 5;
               update.fatigueChange = (update.fatigueChange || 0) - 15; 
               events.push(`💤 ${char.name}은(는) 안전한 곳에서 쪽잠을 자며 체력을 회복했습니다.`);
          } else {
               update.fatigueChange = (update.fatigueChange || 0) - 10; 
               events.push(`🛌 ${char.name}은(는) 잠시 휴식을 취했습니다.`);
          }
          return;
      }

      // 4. MBTI Action
      const action = MBTI_SPECIFIC_ACTIONS[char.mbti](char.name, char.gender);
      update.hpChange = (update.hpChange || 0) + (action.hp || 0);
      update.sanityChange = (update.sanityChange || 0) + (action.sanity || 0);
      update.killCountChange = (update.killCountChange || 0) + (action.kill || 0);
      update.fatigueChange = (update.fatigueChange || 0) + (action.fatigue || 5); 

      if ((char.hp + (update.hpChange || 0)) <= 0) {
          update.status = 'Dead';
          update.hpChange = -char.hp;
          events.push(`💀 ${action.text} 그리고... ${char.name}은(는) 숨을 거두었습니다.`);
      } else {
          events.push(action.text);
      }
  });

  // 4. Ghost Events
  if (deadCharacters.length > 0 && livingCharacters.length > 0) {
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

  // 5. Interactions
  if (livingCharacters.length > 1) {
      const actorIndex = Math.floor(Math.random() * livingCharacters.length);
      let targetIndex = Math.floor(Math.random() * livingCharacters.length);
      while (actorIndex === targetIndex) {
          targetIndex = Math.floor(Math.random() * livingCharacters.length);
      }

      const actor = livingCharacters[actorIndex];
      const target = livingCharacters[targetIndex];
      
      const actorUpdate = getUpdate(actor.id); // Get fresh state if modified above
      const actorMental = actorUpdate.mentalState || actor.mentalState;

      const status = actor.relationshipStatuses[target.id] || 'None';
      const isLover = status === 'Lover';
      const isEx = status === 'Ex';
      const affinity = actor.relationships[target.id] || 0;

      let triggeredEvent = '';
      let affinityChange = 0;
      let newStatus: any = undefined;

      // --- Mental Illness Interaction Override ---
      if (actorMental !== 'Normal' && Math.random() < 0.5) {
          // If Lover, chance for specific tragedy
          if (isLover && Math.random() < 0.5) {
               // Update: LOVER_MENTAL_EVENTS is now an object, not array
               const eventsPool = LOVER_MENTAL_EVENTS[actorMental] || LOVER_MENTAL_EVENTS['Normal'];
               
               if (eventsPool.length > 0) {
                   const mentalEvent = eventsPool[Math.floor(Math.random() * eventsPool.length)](actor.name, target.name);
                   triggeredEvent = mentalEvent.text;
                   affinityChange = mentalEvent.affinityChange;
                   
                   const tUpdate = getUpdate(target.id);
                   tUpdate.sanityChange = (tUpdate.sanityChange || 0) + (mentalEvent.victimSanityChange || 0);
                   tUpdate.hpChange = (tUpdate.hpChange || 0) + (mentalEvent.victimHpChange || 0);
               }
          } else {
               // General Mental Interaction
               const mentalEventFunc = MENTAL_INTERACTIONS[Math.floor(Math.random() * MENTAL_INTERACTIONS.length)];
               const mentalEvent = mentalEventFunc(actor.name, target.name);
               triggeredEvent = mentalEvent.text;
               affinityChange = mentalEvent.affinityChange;

               const tUpdate = getUpdate(target.id);
               tUpdate.sanityChange = (tUpdate.sanityChange || 0) + (mentalEvent.victimSanityChange || 0);
               tUpdate.hpChange = (tUpdate.hpChange || 0) + (mentalEvent.victimHpChange || 0);
          }
          events.push(triggeredEvent);
      } 
      // --- Normal Interaction Logic ---
      else {
          // ... (Existing logic below) ...
          // Priority 1: Status Changes
          if (isLover && (affinity < 40 || Math.random() < 0.05)) {
               triggeredEvent = BREAKUP_EVENTS[Math.floor(Math.random() * BREAKUP_EVENTS.length)](actor.name, target.name);
               affinityChange = -30;
               newStatus = 'Ex';
               events.push(`💔 ${triggeredEvent}`);
          }
          else if (isEx && affinity >= 60 && Math.random() < 0.2) {
              triggeredEvent = REUNION_EVENTS[Math.floor(Math.random() * REUNION_EVENTS.length)](actor.name, target.name);
              affinityChange = 15;
              newStatus = 'Lover';
              events.push(`💞 ${triggeredEvent}`);
          }
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
          else {
              let eventPool: ((a: string, b: string) => string)[] = [];
              
              if (isLover) { eventPool = LOVER_EVENTS; affinityChange = 5; } 
              else if (status === 'Family') { eventPool = FAMILY_EVENTS; affinityChange = 5; } 
              else if (status === 'BestFriend') { eventPool = BEST_FRIEND_EVENTS; affinityChange = 5; } 
              else if (status === 'Colleague') { eventPool = COLLEAGUE_EVENTS; affinityChange = 2; } 
              else if (status === 'Rival') { eventPool = RIVAL_EVENTS; affinityChange = 2; } 
              else if (status === 'Savior') { eventPool = SAVIOR_EVENTS; affinityChange = 5; } 
              else if (status === 'Enemy') { eventPool = ENEMY_EVENTS; affinityChange = -5; } 
              else if (status === 'Ex') { eventPool = EX_LOVER_EVENTS; affinityChange = -2; }
              
              if (eventPool.length > 0 && Math.random() < 0.7) { 
                  triggeredEvent = eventPool[Math.floor(Math.random() * eventPool.length)](actor.name, target.name);
                  const icon = isLover ? '💕' : status === 'Family' ? '🏠' : status === 'BestFriend' ? '🤞' : status === 'Enemy' ? '⚔️' : '💬';
                  events.push(`${icon} ${triggeredEvent}`);
              } 
              else {
                   const getGroup = (m: MBTI) => {
                      if (ANALYSTS.includes(m)) return 'ANALYST';
                      if (DIPLOMATS.includes(m)) return 'DIPLOMAT';
                      if (SENTINELS.includes(m)) return 'SENTINEL';
                      return 'EXPLORER';
                   };
                   const isCompatible = getGroup(actor.mbti) === getGroup(target.mbti);
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
      } // End Normal Interaction

      // Apply Updates Bidirectionally
      if (!actorUpdate.relationshipUpdates) actorUpdate.relationshipUpdates = [];
      actorUpdate.relationshipUpdates.push({ targetId: target.id, change: affinityChange, newStatus });

      const targetUpdate = getUpdate(target.id);
      if (!targetUpdate.relationshipUpdates) targetUpdate.relationshipUpdates = [];
      targetUpdate.relationshipUpdates.push({ targetId: actor.id, change: affinityChange, newStatus });
  }

  await new Promise(resolve => setTimeout(resolve, 800));

  return {
      narrative,
      events,
      updates,
      loot,
      nextStoryNodeId
  };
};