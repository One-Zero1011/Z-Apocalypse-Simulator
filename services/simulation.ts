
import { Character, SimulationResult, CharacterUpdate, MBTI, MentalState, ForcedEvent, ActionEffect } from "../types";
import { FATIGUE_THRESHOLD, MAX_HUNGER, MAX_INFECTION } from "../constants";

// Import separated events
import { getNextStoryNode } from "./events/globalEvents";
import { STORY_NODES } from "./events/storyNodes"; 
import { FATIGUE_EVENTS } from "./events/fatigueEvents";
import { GHOST_EVENTS } from "./events/ghostEvents"; 
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
    EX_LOVER_EVENTS
} from "./events/interactionEvents";
import { MBTI_SPECIFIC_ACTIONS, MBTI_EVENT_POOL, ANALYSTS, DIPLOMATS, SENTINELS, EXPLORERS } from "./events/mbtiEvents";

// Loot table updated
const LOOT_TABLE = [
    { name: '붕대', chance: 0.20 },
    { name: '항생제', chance: 0.1 },
    { name: '통조림', chance: 0.2 },
    { name: '초콜릿', chance: 0.15 },
    { name: '비타민', chance: 0.1 },
    { name: '정신병약', chance: 0.1 },
    { name: '백신', chance: 0.05 }, 
    { name: '입마개', chance: 0.05 }, 
    { name: '고기', chance: 0.05 }
];

const MENTAL_STATES_LIST: MentalState[] = ['PTSD', 'Depression', 'Schizophrenia', 'Paranoia', 'DID'];

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

    // Mental State
    if (voter.mentalState === 'Paranoia') score -= 30; 
    if (voter.mentalState === 'Schizophrenia') score -= 10; 
    if (voter.mentalState === 'Depression') score += 10; 

    // Target Value (KillCount)
    if (target.killCount > 10 && isThinker) score += 10;

    return score >= 50 ? 'KEEP' : 'KILL';
};

export const simulateDay = async (
  day: number,
  characters: Character[],
  currentStoryNodeId: string | null,
  allowSameSexCouples: boolean = true,
  forcedEvents: ForcedEvent[] = [] // Updated to accept array
): Promise<SimulationResult> => {
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
          // Hunger Decay
          const hungerLoss = -20;
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
      if (char.mentalState === 'Normal' && char.sanity <= 10 && Math.random() < 0.1) {
           const newState = MENTAL_STATES_LIST[Math.floor(Math.random() * MENTAL_STATES_LIST.length)];
           update.mentalState = newState;
           events.push(`🧠⚠️ ${char.name}은(는) 극심한 스트레스로 인해 [${newState}] 증세를 보이기 시작했습니다.`);
      } else if (char.mentalState !== 'Normal' && char.sanity >= 90 && Math.random() < 0.1) {
           update.mentalState = 'Normal';
           events.push(`✨ ${char.name}은(는) 안정을 되찾고 정신적 고통에서 벗어났습니다.`);
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

      if (currentMentalState !== 'Normal' && Math.random() < 0.7) {
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
  // Filter activeHumans to exclude busy ones for ghost targets
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

  // 5. Interactions (Random)
  if (livingCharacters.length > 1) {
      // Filter livingCharacters for interaction candidates (Exclude Busy)
      const availableForInteraction = livingCharacters.filter(c => !busyCharacterIds.has(c.id));

      if (availableForInteraction.length > 1) {
          // Random Selection from available
          let actorIndex = Math.floor(Math.random() * availableForInteraction.length);
          let targetIndex = Math.floor(Math.random() * availableForInteraction.length);
          while (actorIndex === targetIndex) {
              targetIndex = Math.floor(Math.random() * availableForInteraction.length);
          }

          if (actorIndex !== -1 && targetIndex !== -1) {
              const actor = availableForInteraction[actorIndex];
              const target = availableForInteraction[targetIndex];
              
              // Zombie Interaction Check
              if (actor.status === 'Zombie' || target.status === 'Zombie') {
                 // Skip standard interactions for zombies
              } else {
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
                  const isRomanceAllowed = allowSameSexCouples || 
                      (actor.gender === 'Male' && target.gender === 'Female') || 
                      (actor.gender === 'Female' && target.gender === 'Male');

                  // STANDARD RANDOM LOGIC
                  // Priority 1: Mental Illness
                  if (actorMental !== 'Normal' && Math.random() < 0.5) {
                      if (isLover && Math.random() < 0.5) {
                            const eventsPool = LOVER_MENTAL_EVENTS[actorMental] || LOVER_MENTAL_EVENTS['Normal'];
                            if (eventsPool.length > 0) {
                                const mentalEvent = eventsPool[Math.floor(Math.random() * eventsPool.length)](actor.name, target.name);
                                triggeredEvent = mentalEvent.text;
                                affinityChange = mentalEvent.affinityChange;
                                targetUpdate.sanityChange = (targetUpdate.sanityChange || 0) + (mentalEvent.victimSanityChange || 0);
                                targetUpdate.hpChange = (targetUpdate.hpChange || 0) + (mentalEvent.victimHpChange || 0);
                            }
                      } else {
                            const mentalEventFunc = MENTAL_INTERACTIONS[Math.floor(Math.random() * MENTAL_INTERACTIONS.length)];
                            const mentalEvent = mentalEventFunc(actor.name, target.name);
                            triggeredEvent = mentalEvent.text;
                            affinityChange = mentalEvent.affinityChange;
                            targetUpdate.sanityChange = (targetUpdate.sanityChange || 0) + (mentalEvent.victimSanityChange || 0);
                            targetUpdate.hpChange = (targetUpdate.hpChange || 0) + (mentalEvent.victimHpChange || 0);
                      }
                      if (triggeredEvent) events.push(triggeredEvent);
                  } 
                  // Priority 2: Fatigue Relief
                  else if (targetFatigue >= 40 && affinity > 0 && status !== 'Enemy' && Math.random() < 0.4) {
                      const reliefEventFunc = FATIGUE_RELIEF_INTERACTIONS[Math.floor(Math.random() * FATIGUE_RELIEF_INTERACTIONS.length)];
                      const reliefEvent = reliefEventFunc(actor.name, target.name);
                      triggeredEvent = reliefEvent.text;
                      affinityChange = reliefEvent.affinity;
                      targetUpdate.fatigueChange = (targetUpdate.fatigueChange || 0) + reliefEvent.targetFatigue;
                      actorUpdate.fatigueChange = (actorUpdate.fatigueChange || 0) + reliefEvent.actorFatigue;
                      const statLog = ` (피로 ${reliefEvent.targetFatigue})`;
                      events.push(`${triggeredEvent}${statLog}`);
                  }
                  // Priority 3: Normal
                  else {
                      if (isLover && (affinity < 40 || Math.random() < 0.05)) {
                           triggeredEvent = BREAKUP_EVENTS[Math.floor(Math.random() * BREAKUP_EVENTS.length)](actor.name, target.name);
                           affinityChange = -30; newStatus = 'Ex'; events.push(`💔 ${triggeredEvent}`);
                      }
                      else if (isEx && affinity >= 70 && isRomanceAllowed && Math.random() < 0.1) {
                          triggeredEvent = REUNION_EVENTS[Math.floor(Math.random() * REUNION_EVENTS.length)](actor.name, target.name);
                          affinityChange = 15; newStatus = 'Lover'; events.push(`💞 ${triggeredEvent}`);
                      }
                      else if (isRomanceAllowed && !isLover && !isEx && status !== 'Family' && status !== 'Sibling' && status !== 'Parent' && status !== 'Child' && status !== 'Enemy' && affinity >= 80 && Math.random() < 0.1) {
                           if (Math.random() > 0.6) {
                               triggeredEvent = CONFESSION_EVENTS[Math.floor(Math.random() * CONFESSION_EVENTS.length)](actor.name, target.name);
                               affinityChange = 10; newStatus = 'Lover'; events.push(`💘 ${triggeredEvent}`);
                           } else {
                               events.push(`💬 ${actor.name}은(는) ${target.name}에게 고백하려 했지만, 타이밍을 놓쳐 어색해졌습니다.`);
                               affinityChange = -5;
                           }
                      }
                      else {
                          let eventPool: ((a: string, b: string) => string)[] = [];
                          if (status === 'Spouse') { eventPool = SPOUSE_EVENTS; affinityChange = 5; }
                          else if (isLover) { eventPool = LOVER_EVENTS; affinityChange = 5; } 
                          else if (status === 'Sibling') { eventPool = SIBLING_EVENTS; affinityChange = 5; }
                          else if (status === 'Parent' || status === 'Child') { eventPool = PARENT_CHILD_EVENTS; affinityChange = 5; }
                          else if (status === 'Family') { eventPool = FAMILY_EVENTS; affinityChange = 5; } 
                          else if (status === 'BestFriend') { eventPool = BEST_FRIEND_EVENTS; affinityChange = 5; } 
                          else if (status === 'Colleague') { eventPool = COLLEAGUE_EVENTS; affinityChange = 2; } 
                          else if (status === 'Rival') { eventPool = RIVAL_EVENTS; affinityChange = 2; } 
                          else if (status === 'Savior') { eventPool = SAVIOR_EVENTS; affinityChange = 5; } 
                          else if (status === 'Enemy') { eventPool = ENEMY_EVENTS; affinityChange = -5; } 
                          else if (status === 'Ex') { eventPool = EX_LOVER_EVENTS; affinityChange = -2; }
                          
                          if (eventPool.length > 0 && Math.random() < 0.7) { 
                              triggeredEvent = eventPool[Math.floor(Math.random() * eventPool.length)](actor.name, target.name);
                              // Set Icon
                              let icon = '💬';
                              if (status === 'Spouse') icon = '💍';
                              else if (isLover) icon = '💕';
                              else if (status === 'Sibling') icon = '👫';
                              else if (status === 'Parent' || status === 'Child') icon = '👪';
                              else if (status === 'Family') icon = '🏠';
                              else if (status === 'BestFriend') icon = '🤞';
                              else if (status === 'Enemy') icon = '⚔️';

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
                               const templates = isPositive ? INTERACTION_TEMPLATES.POSITIVE : INTERACTION_TEMPLATES.NEGATIVE;
                               const interactionText = templates[Math.floor(Math.random() * templates.length)](actor.name, target.name);
                               const icon = isPositive ? '🤝' : '🗯️';
                               events.push(`${icon} ${interactionText}`);
                          }
                      }
                  }

                  if (triggeredEvent) {
                      if (!actorUpdate.relationshipUpdates) actorUpdate.relationshipUpdates = [];
                      actorUpdate.relationshipUpdates.push({ targetId: target.id, change: affinityChange, newStatus });
                      if (!targetUpdate.relationshipUpdates) targetUpdate.relationshipUpdates = [];
                      targetUpdate.relationshipUpdates.push({ targetId: actor.id, change: affinityChange, newStatus });
                  }
              }
          }
      }
  }
  
  if (activeHumans.length > 0 && Math.random() < 0.02) {
      loot.push('인육');
      events.push(`⚠️ ...우리는 끔찍한 것을 발견했습니다. 이것이 [인육]이라는 것을 직감적으로 알 수 있었습니다.`);
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
