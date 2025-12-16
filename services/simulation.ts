
import { Character, SimulationResult, CharacterUpdate, MBTI, MentalState, ForcedEvent, ActionEffect, RelationshipStatus, GameSettings } from "../types";
import { FATIGUE_THRESHOLD, MAX_HUNGER, MAX_INFECTION, DAILY_HUNGER_LOSS } from "../constants";

// Import separated events
import { getNextStoryNode } from "./events/globalEvents";
import { STORY_NODES } from "./events/storyNodes"; 
import { FATIGUE_EVENTS } from "./events/fatigueEvents";
import { GHOST_EVENTS } from "./events/ghostEvents"; 
import { REST_EVENTS } from "./events/restEvents"; // New Import
import { MENTAL_ILLNESS_ACTIONS, MENTAL_INTERACTIONS, LOVER_MENTAL_EVENTS } from "./events/mentalEvents"; 
import { 
    INTERACTION_POOL,
    INTERACTION_TEMPLATES,
    FATIGUE_RELIEF_INTERACTIONS,
    LOVER_EVENTS,
    CONFESSION_EVENTS,
    BREAKUP_EVENTS,
    REUNION_EVENTS,
    SPOUSE_EVENTS,
    SIBLING_EVENTS,
    PARENT_CHILD_EVENTS,
    FAMILY_EVENTS,
    BEST_FRIEND_EVENTS,
    COLLEAGUE_EVENTS,
    RIVAL_EVENTS,
    SAVIOR_EVENTS,
    ENEMY_EVENTS,
    EX_LOVER_EVENTS,
    ZOMBIE_HUMAN_INTERACTIONS
} from "./events/interactionEvents";
import { MBTI_SPECIFIC_ACTIONS, MBTI_EVENT_POOL, ANALYSTS, DIPLOMATS, SENTINELS, EXPLORERS } from "./events/mbtiEvents";

// Loot table updated
const LOOT_TABLE = [
    { name: '붕대', chance: 0.20 },
    { name: '항생제', chance: 0.1 },
    { name: '통조림', chance: 0.2 },
    { name: '초콜릿', chance: 0.15 },
    { name: '비타민', chance: 0.1 },
    { name: '안정제', chance: 0.1 },
    { name: '백신', chance: 0.05 }, 
    { name: '입마개', chance: 0.05 }, 
    { name: '고기', chance: 0.05 }
];

// Updated Mental States List
const MENTAL_STATES_LIST: MentalState[] = ['Trauma', 'Despair', 'Delusion', 'Anxiety', 'Madness'];

const formatStatChange = (hp?: number, sanity?: number, fatigue?: number, infection?: number) => {
    const parts = [];
    if (hp) parts.push(`체력 ${hp > 0 ? '+' : ''}${hp}`);
    if (sanity) parts.push(`정신 ${sanity > 0 ? '+' : ''}${sanity}`);
    if (fatigue) parts.push(`피로 ${fatigue > 0 ? '+' : ''}${fatigue}`);
    if (infection) parts.push(`감염 ${infection > 0 ? '+' : ''}${infection}`);
    
    if (parts.length === 0) return '';
    return ` (${parts.join(', ')})`;
};

const getPronoun = (gender: any) => {
    if (gender === 'Male') return '그';
    if (gender === 'Female') return '그녀';
    return '그들';
};

// Vote Logic Helper
const calculateVote = (voter: Character, target: Character): 'KEEP' | 'KILL' => {
    let score = 50; // Base score (50+ = Keep)

    // Relationship
    const affinity = voter.relationships[target.id] || 0;
    const status = voter.relationshipStatuses[target.id];

    score += affinity;

    if (status === 'Lover' || status === 'Spouse' || status === 'Child' || status === 'Parent' || status === 'Sibling') score += 50;
    if (status === 'Family') score += 40;
    if (status === 'BestFriend' || status === 'Savior') score += 30;
    if (status === 'Enemy' || status === 'Rival') score -= 40;

    // MBTI Factor
    const isThinker = voter.mbti[2] === 'T';
    score += isThinker ? -20 : 20;

    // Mental State Influence (Updated Keys)
    if (voter.mentalState === 'Anxiety') score -= 30; // Was Paranoia
    if (voter.mentalState === 'Delusion') score -= 10; // Was Schizophrenia
    if (voter.mentalState === 'Despair') score += 10; // Was Depression

    // Target Value (KillCount)
    if (target.killCount > 10 && isThinker) score += 10;

    return score >= 50 ? 'KEEP' : 'KILL';
};

export const simulateDay = async (
  day: number,
  characters: Character[],
  currentStoryNodeId: string | null,
  settings: GameSettings,
  forcedEvents: ForcedEvent[] = []
): Promise<SimulationResult> => {
  const { allowSameSexCouples, useMentalStates } = settings;
  const livingCharacters = characters.filter(c => c.status === 'Alive' || c.status === 'Infected' || c.status === 'Zombie');
  const activeHumans = livingCharacters.filter(c => c.status !== 'Zombie');
  const deadCharacters = characters.filter(c => c.status === 'Dead'); 
  
  const busyCharacterIds = new Set<string>(); // Track characters involved in forced events

  if (livingCharacters.length === 0) {
    return {
      narrative: "침묵이 캠프에 내려앉았습니다. 움직이는 것은 아무것도 없습니다.",
      events: ["게임 오버."],
      updates: [],
      loot: [],
      nextStoryNodeId: null
    };
  }

  const events: string[] = [];
  const updates: CharacterUpdate[] = [];
  const loot: string[] = [];

  const getUpdate = (id: string) => {
    let u = updates.find(up => up.id === id);
    if (!u) {
        u = { id };
        updates.push(u);
    }
    return u;
  };

  // 0. Zombie Transformation & Voting Logic
  for (const char of activeHumans) {
      if (char.infection >= 100) {
          const voters = activeHumans.filter(v => v.id !== char.id);
          let keepVotes = 0;
          let killVotes = 0;

          if (voters.length === 0) {
              events.push(`🧟 ${char.name}은(는) 감염을 이기지 못하고 좀비가 되었습니다. 남은 생존자가 없어 막을 수 없었습니다.`);
              const update = getUpdate(char.id);
              update.status = 'Zombie';
              update.hungerChange = MAX_HUNGER; 
              update.mentalState = 'Normal'; 
          } else {
              events.push(`⚠️ ${char.name}이(가) 완전히 감염되어 이성을 잃어가고 있습니다! 그룹은 결정을 내려야 합니다.`);
              
              voters.forEach(voter => {
                  const vote = calculateVote(voter, char);
                  if (vote === 'KEEP') keepVotes++;
                  else killVotes++;
              });

              if (keepVotes >= killVotes) {
                  events.push(`⚖️ 투표 결과 (${keepVotes} 대 ${killVotes}): ${char.name}을(를) 데리고 다니기로 결정했습니다. 위험한 동행이 시작됩니다.`);
                  const update = getUpdate(char.id);
                  update.status = 'Zombie';
                  update.hungerChange = MAX_HUNGER;
                  update.infectionChange = 0; 
                  voters.forEach(voter => {
                      if (calculateVote(voter, char) === 'KILL') {
                          const vUpdate = getUpdate(voter.id);
                          vUpdate.sanityChange = (vUpdate.sanityChange || 0) - 10;
                      }
                  });
              } else {
                  events.push(`⚖️ 투표 결과 (${keepVotes} 대 ${killVotes}): ${char.name}을(를) 처치하기로 결정했습니다...`);
                  const update = getUpdate(char.id);
                  update.status = 'Dead';
                  update.hpChange = -char.hp;
                  voters.forEach(voter => {
                      if (calculateVote(voter, char) === 'KEEP') {
                          const vUpdate = getUpdate(voter.id);
                          vUpdate.sanityChange = (vUpdate.sanityChange || 0) - 20;
                      }
                  });
              }
          }
      } else if (char.infection > 0) {
          if (char.status === 'Alive') {
              const update = getUpdate(char.id);
              update.status = 'Infected';
          }
      }
  }

  // 1. Global Narrative & Story
  let todayNode;
  const forcedStoryEvent = forcedEvents.find(e => e.type === 'STORY');
  
  if (forcedStoryEvent && STORY_NODES[forcedStoryEvent.key]) {
      todayNode = STORY_NODES[forcedStoryEvent.key];
      events.push(`🛠️ [DEV] Force Story: ${forcedStoryEvent.key}`);
  } else {
      todayNode = getNextStoryNode(currentStoryNodeId);
  }

  const narrative = todayNode.text;

  // Apply Story Effect
  if (todayNode.effect) {
      const effect = todayNode.effect;
      let targets: Character[] = [];
      const storyTargets = activeHumans; 

      if (effect.target === 'ALL') {
          targets = storyTargets;
      } else if (effect.target === 'RANDOM_1') {
          if (storyTargets.length > 0) targets = [storyTargets[Math.floor(Math.random() * storyTargets.length)]];
      } else if (effect.target === 'RANDOM_HALF') {
          targets = [...storyTargets].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(storyTargets.length / 2));
      }

      targets.forEach(target => {
          const update = getUpdate(target.id);
          if (effect.hp) update.hpChange = (update.hpChange || 0) + effect.hp;
          if (effect.sanity) update.sanityChange = (update.sanityChange || 0) + effect.sanity;
          if (effect.fatigue) update.fatigueChange = (update.fatigueChange || 0) + effect.fatigue;
          if (effect.infection) update.infectionChange = (update.infectionChange || 0) + effect.infection;
          if (effect.status) update.status = effect.status;
          
          if (effect.inventoryRemove) {
             update.inventoryRemove = [...(update.inventoryRemove || []), ...effect.inventoryRemove];
          }
      });

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

  // 1.5 Process Forced MBTI & Interactions (PRE-PROCESSING)
  // Execute these *before* random events so they are guaranteed to happen and visible first.
  const otherForcedEvents = forcedEvents.filter(e => e.type !== 'STORY');
  
  for (const fe of otherForcedEvents) {
      if (fe.type === 'MBTI' && fe.actorId) {
          const actor = livingCharacters.find(c => c.id === fe.actorId);
          if (actor) {
              const pool = MBTI_EVENT_POOL[fe.key as MBTI];
              if (pool && fe.index !== undefined && pool[fe.index]) {
                  const generator = pool[fe.index];
                  const action = generator(actor.name, getPronoun(actor.gender));
                  
                  const update = getUpdate(actor.id);
                  update.hpChange = (update.hpChange || 0) + (action.hp || 0);
                  update.sanityChange = (update.sanityChange || 0) + (action.sanity || 0);
                  update.killCountChange = (update.killCountChange || 0) + (action.kill || 0);
                  update.fatigueChange = (update.fatigueChange || 0) + (action.fatigue || 0); 
                  
                  const statLog = formatStatChange(action.hp, action.sanity, action.fatigue, undefined);
                  events.push(`🛠️ [DEV] ${action.text}${statLog}`);
                  busyCharacterIds.add(actor.id); // Mark actor as busy
              }
          }
      } 
      else if (fe.type === 'INTERACTION' && fe.actorId) {
          const actor = livingCharacters.find(c => c.id === fe.actorId);
          let target = fe.targetId ? livingCharacters.find(c => c.id === fe.targetId) : null;
          
          if (!target && livingCharacters.length > 1) {
              // Fallback random target if not specified
              // Exclude actor AND already busy characters to avoid conflicts
              const others = livingCharacters.filter(c => c.id !== fe.actorId && !busyCharacterIds.has(c.id)); 
              if (others.length > 0) {
                  target = others[Math.floor(Math.random() * others.length)];
              }
          }

          if (actor && target && actor.id !== target.id) {
              const pool = INTERACTION_POOL[fe.key];
              if (pool && fe.index !== undefined && pool[fe.index]) {
                  const item = pool[fe.index];
                  let triggeredEvent = "";
                  let affinityChange = 0;
                  const actorUpdate = getUpdate(actor.id);
                  const targetUpdate = getUpdate(target.id);

                  if (typeof item === 'function') {
                      const result = item(actor.name, target.name);
                      if (typeof result === 'string') {
                            triggeredEvent = result;
                            affinityChange = 5; 
                      } else {
                            triggeredEvent = result.text;
                            affinityChange = result.affinity || 0;
                            if (result.targetFatigue) targetUpdate.fatigueChange = (targetUpdate.fatigueChange || 0) + result.targetFatigue;
                            if (result.actorFatigue) actorUpdate.fatigueChange = (actorUpdate.fatigueChange || 0) + result.actorFatigue;
                            if (result.actorHp) actorUpdate.hpChange = (actorUpdate.hpChange || 0) + result.actorHp;
                            if (result.targetHp) targetUpdate.hpChange = (targetUpdate.hpChange || 0) + result.targetHp;
                            if (result.actorSanity) actorUpdate.sanityChange = (actorUpdate.sanityChange || 0) + result.actorSanity;
                            if (result.targetSanity) targetUpdate.sanityChange = (targetUpdate.sanityChange || 0) + result.targetSanity;
                      }
                  }

                  if (triggeredEvent) {
                      events.push(`🛠️ [DEV] ${triggeredEvent}`);
                      if (!actorUpdate.relationshipUpdates) actorUpdate.relationshipUpdates = [];
                      actorUpdate.relationshipUpdates.push({ targetId: target.id, change: affinityChange });
                      if (!targetUpdate.relationshipUpdates) targetUpdate.relationshipUpdates = [];
                      targetUpdate.relationshipUpdates.push({ targetId: actor.id, change: affinityChange });
                      
                      busyCharacterIds.add(actor.id); // Mark actor as busy
                      busyCharacterIds.add(target.id); // Mark target as busy
                  }
              }
          }
      }
  }

  // 2. Looting
  if (Math.random() < 0.2) { 
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

  // 3. Process Individual Random Events
  const shuffledChars = [...livingCharacters].sort(() => Math.random() - 0.5);

  shuffledChars.forEach(char => {
      // SKIP if character is busy (involved in a forced event)
      if (busyCharacterIds.has(char.id)) return;

      const update = getUpdate(char.id);

      // --- ZOMBIE LOGIC ---
      if (char.status === 'Zombie') {
          // Hunger Decay Reduced
          const hungerLoss = -DAILY_HUNGER_LOSS;
          update.hungerChange = (update.hungerChange || 0) + hungerLoss;
          
          if ((char.hunger + (update.hungerChange || 0)) <= 0) {
              update.status = 'Dead';
              update.hpChange = -char.hp;
              events.push(`💀 좀비가 된 ${char.name}은(는) 굶주림 끝에 완전히 활동을 정지했습니다.`);
              return;
          }

          if (!char.hasMuzzle) {
              if (Math.random() < 0.05 && activeHumans.length > 0) {
                  const victim = activeHumans[Math.floor(Math.random() * activeHumans.length)];
                  const vUpdate = getUpdate(victim.id);
                  vUpdate.infectionChange = (vUpdate.infectionChange || 0) + 15;
                  vUpdate.hpChange = (vUpdate.hpChange || 0) - 10;
                  events.push(`🩸 [경고] 입마개를 하지 않은 좀비 ${char.name}이(가) ${victim.name}을(를) 물었습니다! (감염도 +15)`);
              }
          } else {
              events.push(`🤐 좀비 ${char.name}은(는) 입마개 때문에 사람들을 물지 못하고 그르렁거립니다.`);
          }
          return;
      }

      // --- HUMAN LOGIC ---

      if (Math.random() < 0.05) {
          update.infectionChange = (update.infectionChange || 0) + 5;
          events.push(`🦠 ${char.name}은(는) 이동 중 긁힌 상처로 인해 감염도가 약간 상승했습니다.`);
      }

      const currentMentalState = update.mentalState || char.mentalState;
      
      // Mental State Acquisition (Only if enabled)
      if (useMentalStates) {
          // Acquisition Logic
          if (char.mentalState === 'Normal' && char.sanity <= 10 && Math.random() < 0.1) {
               const newState = MENTAL_STATES_LIST[Math.floor(Math.random() * MENTAL_STATES_LIST.length)];
               update.mentalState = newState;
               
               // Map state to Korean text for event log
               let stateName = '';
               switch(newState) {
                   case 'Trauma': stateName = '트라우마'; break;
                   case 'Despair': stateName = '절망'; break;
                   case 'Delusion': stateName = '망상'; break;
                   case 'Anxiety': stateName = '불안'; break;
                   case 'Madness': stateName = '광기'; break;
                   default: stateName = '혼란';
               }
               events.push(`🧠⚠️ ${char.name}은(는) 극심한 스트레스로 인해 [${stateName}] 증세를 보이기 시작했습니다.`);
          } 
          // Recovery Logic
          else if (char.mentalState !== 'Normal' && char.sanity >= 90 && Math.random() < 0.1) {
               update.mentalState = 'Normal';
               events.push(`✨ ${char.name}은(는) 안정을 되찾고 정신적 평온을 얻었습니다.`);
          }
      }

      if (char.fatigue >= FATIGUE_THRESHOLD && Math.random() < 0.6) {
          const badEvent = FATIGUE_EVENTS[Math.floor(Math.random() * FATIGUE_EVENTS.length)](char.name);
          update.hpChange = (update.hpChange || 0) + (badEvent.hp || 0);
          update.sanityChange = (update.sanityChange || 0) + (badEvent.sanity || 0);
          update.fatigueChange = (update.fatigueChange || 0) + (badEvent.fatigue || 0);
          
          if (badEvent.hp && badEvent.hp < 0) {
              if (Math.random() < 0.2) {
                  update.infectionChange = (update.infectionChange || 0) + 10;
                  badEvent.text += " (감염 위험!)";
              }
          }
          const statLog = formatStatChange(badEvent.hp, badEvent.sanity, badEvent.fatigue, update.infectionChange);
          if ((char.hp + (update.hpChange || 0)) <= 0) {
              update.status = 'Dead';
              update.hpChange = -char.hp;
              events.push(`💀 ${badEvent.text} (사망)`);
          } else {
              events.push(`${badEvent.text}${statLog}`);
          }
          return; 
      }

      // Mental Illness Events (Only if enabled)
      if (useMentalStates && currentMentalState !== 'Normal' && Math.random() < 0.7) {
           const illnessActionFunc = MENTAL_ILLNESS_ACTIONS[currentMentalState];
           if (illnessActionFunc) {
               const illnessAction = illnessActionFunc(char);
               update.hpChange = (update.hpChange || 0) + (illnessAction.hp || 0);
               update.sanityChange = (update.sanityChange || 0) + (illnessAction.sanity || 0);
               update.fatigueChange = (update.fatigueChange || 0) + (illnessAction.fatigue || 0);
               update.killCountChange = (update.killCountChange || 0) + (illnessAction.kill || 0);

               const statLog = formatStatChange(illnessAction.hp, illnessAction.sanity, illnessAction.fatigue);
               if ((char.hp + (update.hpChange || 0)) <= 0) {
                  update.status = 'Dead';
                  update.hpChange = -char.hp;
                  events.push(`💀 ${illnessAction.text} (사망)`);
               } else {
                   events.push(`${illnessAction.text}${statLog}`);
               }
               return;
           }
      }

      // Rest / Recovery Event (New)
      if (Math.random() > 0.8) {
           const restAction = REST_EVENTS[Math.floor(Math.random() * REST_EVENTS.length)](char.name);
           update.hpChange = (update.hpChange || 0) + (restAction.hp || 0);
           update.sanityChange = (update.sanityChange || 0) + (restAction.sanity || 0);
           update.fatigueChange = (update.fatigueChange || 0) + (restAction.fatigue || 0);
           
           const statLog = formatStatChange(restAction.hp, restAction.sanity, restAction.fatigue);
           events.push(`${restAction.text}${statLog}`);
           return;
      }

      const action = MBTI_SPECIFIC_ACTIONS[char.mbti](char.name, char.gender);
      update.hpChange = (update.hpChange || 0) + (action.hp || 0);
      update.sanityChange = (update.sanityChange || 0) + (action.sanity || 0);
      update.killCountChange = (update.killCountChange || 0) + (action.kill || 0);
      update.fatigueChange = (update.fatigueChange || 0) + (action.fatigue || 5); 

      if (action.kill && action.kill > 0 && Math.random() < 0.2) {
           update.infectionChange = (update.infectionChange || 0) + 10;
           action.text += " 그 과정에서 좀비의 피를 뒤집어썼습니다.";
      } else if (action.hp && action.hp < 0 && Math.random() < 0.3) {
           update.infectionChange = (update.infectionChange || 0) + 15;
           action.text += " 상처 부위가 붉게 부어오릅니다.";
      }

      const statLog = formatStatChange(action.hp, action.sanity, action.fatigue || 5, update.infectionChange);

      if ((char.hp + (update.hpChange || 0)) <= 0) {
          update.status = 'Dead';
          update.hpChange = -char.hp;
          events.push(`💀 ${action.text} 그리고... ${char.name}은(는) 숨을 거두었습니다.`);
      } else {
          events.push(`${action.text}${statLog}`);
      }
  });

  // 4. Ghost Events (Standard)
  // Filter active humans to exclude busy ones for ghost targets
  const availableGhostTargets = activeHumans.filter(c => !busyCharacterIds.has(c.id));
  if (deadCharacters.length > 0 && availableGhostTargets.length > 0 && Math.random() < 0.3) {
      const ghost = deadCharacters[Math.floor(Math.random() * deadCharacters.length)];
      const target = availableGhostTargets[Math.floor(Math.random() * availableGhostTargets.length)];
      const ghostEventFunc = GHOST_EVENTS[Math.floor(Math.random() * GHOST_EVENTS.length)];
      const ghostAction = ghostEventFunc(ghost.name, target.name);
      const update = getUpdate(target.id);
      update.sanityChange = (update.sanityChange || 0) + (ghostAction.sanity || 0);
      update.fatigueChange = (update.fatigueChange || 0) + (ghostAction.fatigue || 0);
      if (ghostAction.hp) update.hpChange = (update.hpChange || 0) + ghostAction.hp;
      events.push(`${ghostAction.text}`);
  }

  // 5. Interactions (Random) - Scalable Logic
  let interactionCandidates = livingCharacters.filter(c => !busyCharacterIds.has(c.id));
  
  // Shuffle for random pairing
  interactionCandidates.sort(() => Math.random() - 0.5);

  while (interactionCandidates.length >= 2) {
      const actor = interactionCandidates.pop()!;
      const target = interactionCandidates.pop()!;

      // 40% Chance for an interaction to actually occur between this pair
      if (Math.random() > 0.4) continue;

      // New Zombie-Human Interaction Logic
      if (actor.status === 'Zombie' && target.status === 'Zombie') {
           // Zombies generally ignore each other
      } else if (actor.status === 'Zombie' || target.status === 'Zombie') {
          // Mixed Interaction
          const zombie = actor.status === 'Zombie' ? actor : target;
          const human = actor.status === 'Zombie' ? target : actor;
          
          const eventFunc = ZOMBIE_HUMAN_INTERACTIONS[Math.floor(Math.random() * ZOMBIE_HUMAN_INTERACTIONS.length)];
          const result = eventFunc(zombie.name, human.name);
          
          const text = typeof result === 'string' ? result : result.text;
          
          // Log formatting for Zombie interactions
          let zLogParts = [];
          if (typeof result !== 'string') {
             // Apply stats to human
             const hUpdate = getUpdate(human.id);
             if (result.targetSanity) {
                 hUpdate.sanityChange = (hUpdate.sanityChange || 0) + result.targetSanity;
                 zLogParts.push(`정신 ${result.targetSanity > 0 ? '+' : ''}${result.targetSanity}`);
             }
             if (result.targetHp) {
                 hUpdate.hpChange = (hUpdate.hpChange || 0) + result.targetHp;
                 zLogParts.push(`체력 ${result.targetHp > 0 ? '+' : ''}${result.targetHp}`);
             }
          } else {
             // Fallback
             const u = getUpdate(human.id);
             u.sanityChange = (u.sanityChange || 0) - 2;
             zLogParts.push(`정신 -2`);
          }
          const zLogSuffix = zLogParts.length > 0 ? ` (${zLogParts.join(', ')})` : '';
          events.push(`🧟 ${text}${zLogSuffix}`);

      } else {
          // Both Humans (Existing Logic)
          const actorUpdate = getUpdate(actor.id);
          const targetUpdate = getUpdate(target.id);
          
          const actorMental = actorUpdate.mentalState || actor.mentalState;
          const status = actor.relationshipStatuses[target.id] || 'None';
          const isLover = status === 'Lover' || status === 'Spouse'; // Spouse included
          const isEx = status === 'Ex';
          const affinity = actor.relationships[target.id] || 0;
          const targetFatigue = target.fatigue + (targetUpdate.fatigueChange || 0);
          
          let triggeredEvent = '';
          let affinityChange = 0;
          let newStatus: any = undefined;
          let resultObject: any = null; // Store the full result object if available

          const isRomanceAllowed = allowSameSexCouples || 
              (actor.gender === 'Male' && target.gender === 'Female') || 
              (actor.gender === 'Female' && target.gender === 'Male');

          // STANDARD RANDOM LOGIC
          // Priority 1: Mental Illness (Only if enabled)
          if (useMentalStates && actorMental !== 'Normal' && Math.random() < 0.5) {
              if (isLover && Math.random() < 0.5) {
                    const eventsPool = LOVER_MENTAL_EVENTS[actorMental] || LOVER_MENTAL_EVENTS['Normal'];
                    if (eventsPool.length > 0) {
                        const mentalEvent = eventsPool[Math.floor(Math.random() * eventsPool.length)](actor.name, target.name);
                        resultObject = mentalEvent; // It returns object
                        triggeredEvent = mentalEvent.text;
                    }
              } else {
                    const mentalEventFunc = MENTAL_INTERACTIONS[Math.floor(Math.random() * MENTAL_INTERACTIONS.length)];
                    const mentalEvent = mentalEventFunc(actor.name, target.name);
                    resultObject = mentalEvent;
                    triggeredEvent = mentalEvent.text;
              }
          } 
          // Priority 2: Fatigue Relief
          else if (targetFatigue >= 40 && affinity > 0 && status !== 'Enemy' && Math.random() < 0.4) {
              const reliefEventFunc = FATIGUE_RELIEF_INTERACTIONS[Math.floor(Math.random() * FATIGUE_RELIEF_INTERACTIONS.length)];
              const reliefEvent = reliefEventFunc(actor.name, target.name);
              
              if (typeof reliefEvent === 'string') {
                  triggeredEvent = reliefEvent;
                  affinityChange = 5;
              } else {
                  resultObject = reliefEvent;
                  triggeredEvent = reliefEvent.text;
              }
          }
          // Priority 3: Normal
          else {
              let eventPool: any[] = []; 

              // Special Relationship Checks
              if (isLover && (affinity < 40 || Math.random() < 0.05)) {
                   eventPool = BREAKUP_EVENTS;
                   newStatus = 'Ex';
              }
              else if (isEx && affinity >= 70 && isRomanceAllowed && Math.random() < 0.1) {
                   eventPool = REUNION_EVENTS;
                   newStatus = 'Lover';
              }
              else if (isRomanceAllowed && !isLover && !isEx && status !== 'Family' && status !== 'Sibling' && status !== 'Parent' && status !== 'Child' && status !== 'Enemy' && affinity >= 80 && Math.random() < 0.1) {
                   if (Math.random() > 0.6) {
                       eventPool = CONFESSION_EVENTS;
                       newStatus = 'Lover';
                   } else {
                       events.push(`💬 ${actor.name}은(는) ${target.name}에게 고백하려 했지만, 타이밍을 놓쳐 어색해졌습니다. (호감도 -5)`);
                       affinityChange = -5;
                       // Skip main event processing for this specific failure case
                       if (!actorUpdate.relationshipUpdates) actorUpdate.relationshipUpdates = [];
                       actorUpdate.relationshipUpdates.push({ targetId: target.id, change: -5 });
                       if (!targetUpdate.relationshipUpdates) targetUpdate.relationshipUpdates = [];
                       targetUpdate.relationshipUpdates.push({ targetId: actor.id, change: -5 });
                       continue; 
                   }
              }
              else {
                  if (status === 'Spouse') eventPool = SPOUSE_EVENTS;
                  else if (isLover) eventPool = LOVER_EVENTS; 
                  else if (status === 'Sibling') eventPool = SIBLING_EVENTS;
                  else if (status === 'Parent' || status === 'Child') eventPool = PARENT_CHILD_EVENTS;
                  else if (status === 'Family') eventPool = FAMILY_EVENTS; 
                  else if (status === 'BestFriend') eventPool = BEST_FRIEND_EVENTS; 
                  else if (status === 'Colleague') eventPool = COLLEAGUE_EVENTS; 
                  else if (status === 'Rival') eventPool = RIVAL_EVENTS; 
                  else if (status === 'Savior') eventPool = SAVIOR_EVENTS; 
                  else if (status === 'Enemy') eventPool = ENEMY_EVENTS; 
                  else if (status === 'Ex') eventPool = EX_LOVER_EVENTS;
              }
              
              if (eventPool.length > 0 && !triggeredEvent && Math.random() < 0.7) { 
                  const result = eventPool[Math.floor(Math.random() * eventPool.length)](actor.name, target.name);
                  
                  if (typeof result === 'string') {
                      triggeredEvent = result;
                      if (status === 'Spouse') affinityChange = 5;
                      else if (status === 'Enemy') affinityChange = -10;
                      else affinityChange = 5;
                  } else {
                      resultObject = result;
                      triggeredEvent = result.text;
                  }
              } 
              else if (!triggeredEvent) {
                   const getGroup = (m: MBTI) => {
                      if (ANALYSTS.includes(m)) return 'ANALYST';
                      if (DIPLOMATS.includes(m)) return 'DIPLOMAT';
                      if (SENTINELS.includes(m)) return 'SENTINEL';
                      return 'EXPLORER';
                   };
                   const isCompatible = getGroup(actor.mbti) === getGroup(target.mbti);
                   const isPositive = (affinity + (isCompatible ? 20 : -20) + (Math.random() * 100)) > 50;
                   
                   const templates = isPositive ? INTERACTION_TEMPLATES.POSITIVE : INTERACTION_TEMPLATES.NEGATIVE;
                   const result = templates[Math.floor(Math.random() * templates.length)](actor.name, target.name);
                   
                   if (typeof result === 'string') {
                       triggeredEvent = result;
                       affinityChange = isPositive ? 10 : -10;
                   } else {
                       resultObject = result;
                       triggeredEvent = result.text;
                       if (result.affinity === undefined) affinityChange = (isPositive ? 10 : -10);
                   }
              }
          }

          // Apply Stats from Object Result
          if (resultObject) {
              affinityChange = resultObject.affinity || resultObject.affinityChange || affinityChange;
              if (resultObject.actorHp) actorUpdate.hpChange = (actorUpdate.hpChange || 0) + resultObject.actorHp;
              if (resultObject.targetHp) targetUpdate.hpChange = (targetUpdate.hpChange || 0) + resultObject.targetHp;
              if (resultObject.actorSanity) actorUpdate.sanityChange = (actorUpdate.sanityChange || 0) + resultObject.actorSanity;
              if (resultObject.targetSanity) targetUpdate.sanityChange = (targetUpdate.sanityChange || 0) + resultObject.targetSanity;
              if (resultObject.actorFatigue) actorUpdate.fatigueChange = (actorUpdate.fatigueChange || 0) + resultObject.actorFatigue;
              if (resultObject.targetFatigue) targetUpdate.fatigueChange = (targetUpdate.fatigueChange || 0) + resultObject.targetFatigue;
              if (resultObject.victimHpChange) targetUpdate.hpChange = (targetUpdate.hpChange || 0) + resultObject.victimHpChange;
              if (resultObject.victimSanityChange) targetUpdate.sanityChange = (targetUpdate.sanityChange || 0) + resultObject.victimSanityChange;
          }

          // Build Log Message with Stats
          if (triggeredEvent) {
              // 1. Determine Icon
              let icon = '💬';
              if (status === 'Spouse') icon = '💍';
              else if (isLover) icon = '💕';
              else if (status === 'Sibling') icon = '👫';
              else if (status === 'Parent' || status === 'Child') icon = '👪';
              else if (status === 'Family') icon = '🏠';
              else if (status === 'BestFriend') icon = '🤞';
              else if (status === 'Enemy') icon = '⚔️';
              
              if (newStatus === 'Ex') icon = '💔';
              if (newStatus === 'Lover' && (triggeredEvent.includes('고백') || triggeredEvent.includes('사랑'))) icon = '💘';
              if (newStatus === 'Lover' && triggeredEvent.includes('재결합')) icon = '💞';
              if (!isLover && !newStatus && affinityChange > 0) icon = '🤝';
              if (!isLover && !newStatus && affinityChange < 0) icon = '🗯️';

              // 2. Build Stat String
              const logParts = [];
              if (resultObject) {
                  if (resultObject.actorHp) logParts.push(`${actor.name} 체력 ${resultObject.actorHp > 0 ? '+' : ''}${resultObject.actorHp}`);
                  if (resultObject.targetHp) logParts.push(`${target.name} 체력 ${resultObject.targetHp > 0 ? '+' : ''}${resultObject.targetHp}`);
                  if (resultObject.victimHpChange) logParts.push(`${target.name} 체력 ${resultObject.victimHpChange > 0 ? '+' : ''}${resultObject.victimHpChange}`);
                  
                  if (resultObject.actorSanity) logParts.push(`${actor.name} 정신 ${resultObject.actorSanity > 0 ? '+' : ''}${resultObject.actorSanity}`);
                  if (resultObject.targetSanity) logParts.push(`${target.name} 정신 ${resultObject.targetSanity > 0 ? '+' : ''}${resultObject.targetSanity}`);
                  if (resultObject.victimSanityChange) logParts.push(`${target.name} 정신 ${resultObject.victimSanityChange > 0 ? '+' : ''}${resultObject.victimSanityChange}`);

                  if (resultObject.actorFatigue) logParts.push(`${actor.name} 피로 ${resultObject.actorFatigue > 0 ? '+' : ''}${resultObject.actorFatigue}`);
                  if (resultObject.targetFatigue) logParts.push(`${target.name} 피로 ${resultObject.targetFatigue > 0 ? '+' : ''}${resultObject.targetFatigue}`);
              }
              
              // Add Affinity to Log
              if (affinityChange !== 0) {
                  logParts.push(`호감도 ${affinityChange > 0 ? '+' : ''}${affinityChange}`);
              }

              const logSuffix = logParts.length > 0 ? ` (${logParts.join(', ')})` : '';
              events.push(`${icon} ${triggeredEvent}${logSuffix}`);

              // 3. Apply Relation Updates
              if (!actorUpdate.relationshipUpdates) actorUpdate.relationshipUpdates = [];
              actorUpdate.relationshipUpdates.push({ targetId: target.id, change: affinityChange, newStatus });
              if (!targetUpdate.relationshipUpdates) targetUpdate.relationshipUpdates = [];
              targetUpdate.relationshipUpdates.push({ targetId: actor.id, change: affinityChange, newStatus });
          }
      }
  }
  
  if (activeHumans.length > 0 && Math.random() < 0.02) {
      loot.push('인육');
      events.push(`⚠️ ...우리는 끔찍한 것을 발견했습니다. 이것이 [인육]이라는 것을 직감적으로 알 수 있었습니다.`);
  }

  // --- FINAL: Automatic Status Evolution based on Affinity Thresholds ---
  // This logic runs after all events to ensure status reflects the final affinity of the day.
  
  activeHumans.forEach(char => {
      const update = getUpdate(char.id);
      
      activeHumans.forEach(target => {
          if (char.id === target.id) return;

          // Calculate projected final affinity
          const currentAffinity = char.relationships[target.id] || 0;
          const delta = update.relationshipUpdates?.find(r => r.targetId === target.id)?.change || 0;
          const finalAffinity = Math.max(-100, Math.min(100, currentAffinity + delta));
          
          // Check current Status (considering any pending status change from events)
          const pendingStatus = update.relationshipUpdates?.find(r => r.targetId === target.id)?.newStatus;
          const currentStatus = pendingStatus || char.relationshipStatuses[target.id] || 'None';

          let autoNewStatus: RelationshipStatus | null = null;
          let changeMsg = "";

          // 1. Friend Evolution (None/Colleague -> Friend)
          if ((currentStatus === 'None' || currentStatus === 'Colleague') && finalAffinity >= 40) {
              autoNewStatus = 'Friend';
              changeMsg = `🤝 ${char.name}와(과) ${target.name}은(는) 서로를 믿을 수 있는 [친구]가 되었습니다.`;
          }
          // 2. BestFriend Evolution (Friend -> BestFriend)
          else if (currentStatus === 'Friend' && finalAffinity >= 80) {
              autoNewStatus = 'BestFriend';
              changeMsg = `🤞 ${char.name}와(과) ${target.name}은(는) 둘도 없는 [절친] 사이로 발전했습니다.`;
          }
          // 3. Rival Evolution (None/Friend -> Rival)
          else if ((currentStatus === 'None' || currentStatus === 'Friend') && finalAffinity <= -20) {
              autoNewStatus = 'Rival';
              changeMsg = `⚡ ${char.name}와(과) ${target.name} 사이에 미묘한 [라이벌] 의식이 싹텄습니다.`;
          }
          // 4. Enemy Evolution (Rival/None -> Enemy)
          else if ((currentStatus === 'Rival' || currentStatus === 'None') && finalAffinity <= -60) {
              autoNewStatus = 'Enemy';
              changeMsg = `⚔️ ${char.name}와(과) ${target.name}은(는) 이제 서로를 [원수]로 여깁니다.`;
          }
          // 5. Recover from Enemy (Enemy -> Rival)
          else if (currentStatus === 'Enemy' && finalAffinity >= -20) {
              autoNewStatus = 'Rival';
              changeMsg = `🏳️ ${char.name}와(과) ${target.name}의 적대감이 조금 누그러져 [라이벌] 관계가 되었습니다.`;
          }

          if (autoNewStatus) {
              if (!update.relationshipUpdates) update.relationshipUpdates = [];
              // Check if we already have an update for this target, if so, override status
              const existingRelUpdate = update.relationshipUpdates.find(r => r.targetId === target.id);
              if (existingRelUpdate) {
                  existingRelUpdate.newStatus = autoNewStatus;
              } else {
                  update.relationshipUpdates.push({ targetId: target.id, change: 0, newStatus: autoNewStatus });
              }
              
              // Only push event log once per pair (check if char.id < target.id to avoid duplicate logs)
              if (char.id < target.id) {
                  events.push(changeMsg);
              }
          }
      });
  });

  await new Promise(resolve => setTimeout(resolve, 800));

  return {
      narrative,
      events,
      updates,
      loot,
      nextStoryNodeId
  };
};
