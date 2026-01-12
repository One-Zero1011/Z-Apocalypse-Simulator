
import { CampState, Character, CharacterUpdate, GameSettings, FacilityType, RationingPolicy, WorkPolicy, SecurityPolicy } from '../../types';
import { getCharacterUpdate, addLootToGlobal } from './utils';
import { FACILITY_JOB_BONUS_MAPPING, FOOD_ITEMS } from '../camp/constants';

// --- Helper: Get Assigned Bonus ---
const getAssignmentBonus = (type: FacilityType, camp: CampState, characters: Character[], updates: CharacterUpdate[]) => {
    const assignedIds = camp.assignments?.[type] || [];
    if (assignedIds.length === 0) return 0;

    let bonusScore = 0;
    const bonusJobs = FACILITY_JOB_BONUS_MAPPING[type] || [];

    // 작업 강도에 따른 보너스 효율
    const workload = camp.policies?.workLoad || 'Normal';
    let efficiencyMultiplier = 1.0;
    let fatiguePenalty = 10;

    if (workload === 'Relaxed') {
        efficiencyMultiplier = 0.8;
        fatiguePenalty = 5;
    } else if (workload === 'Hard') {
        efficiencyMultiplier = 1.2;
        fatiguePenalty = 20;
    }

    assignedIds.forEach(id => {
        const char = characters.find(c => c.id === id);
        if (char && char.status === 'Alive') {
            const u = getCharacterUpdate(updates, id);
            // 작업 피로도 추가
            u.fatigueChange = (u.fatigueChange || 0) + fatiguePenalty;
            
            // 기본 효율
            let contribution = 1;
            
            // 직업 보너스 (효율 2배)
            if (bonusJobs.includes(char.job)) {
                contribution = 2;
            }
            
            bonusScore += contribution;
        }
    });

    return bonusScore * efficiencyMultiplier;
};

// 식량 소비 및 배급 정책 처리
export const processDailyConsumption = (
    camp: CampState, 
    characters: Character[], 
    updates: CharacterUpdate[], 
    events: string[], 
    currentInventory: string[],
    inventoryRemove: string[]
) => {
    const livingHumans = characters.filter(c => c.status === 'Alive' || c.status === 'Infected');
    if (livingHumans.length === 0) return;

    const rationing = camp.policies?.rationing || 'Normal';
    let foodPerPerson = 1;
    let sanityBonus = 0;
    let hpBonus = 2;

    if (rationing === 'Generous') {
        foodPerPerson = 2;
        sanityBonus = 5;
        hpBonus = 5;
    } else if (rationing === 'Tight') {
        foodPerPerson = 0.5;
        sanityBonus = -5;
        hpBonus = 0;
    }

    const totalFoodNeeded = Math.ceil(livingHumans.length * foodPerPerson);
    let foodConsumed = 0;

    // 인벤토리에서 식량 차감 (우선순위 적용)
    // 인벤토리는 simulation.ts에서 currentInventory로 넘어옴. 
    // inventoryRemove 배열에 제거할 아이템을 추가해야 함.
    // 주의: 이미 제거 예정인 아이템은 currentInventory에서 제외된 상태여야 정확함. 
    // 여기서는 simulation.ts에서 처리 전 인벤토리를 넘겨받으므로 로직상 가상 처리가 필요.
    
    // 가상 인벤토리 (제거된 것 제외)
    const availableInventory = [...currentInventory];
    
    // 식량 찾기 및 소모
    for (let i = 0; i < totalFoodNeeded; i++) {
        let foundFood = false;
        for (const foodType of FOOD_ITEMS) {
            const idx = availableInventory.indexOf(foodType);
            if (idx > -1) {
                availableInventory.splice(idx, 1);
                inventoryRemove.push(foodType);
                foodConsumed++;
                foundFood = true;
                break;
            }
        }
        if (!foundFood) break; // 식량 고갈
    }

    if (foodConsumed >= totalFoodNeeded) {
        // 배급 성공
        livingHumans.forEach(c => {
            const u = getCharacterUpdate(updates, c.id);
            u.sanityChange = (u.sanityChange || 0) + sanityBonus;
            if (c.hp < c.maxHp) {
                u.hpChange = (u.hpChange || 0) + hpBonus;
            }
        });
        if (rationing === 'Generous') events.push(`🍖 [풍족한 배급] 모두가 배불리 먹고 기운을 차렸습니다. (HP+5, 정신력+5)`);
        else if (rationing === 'Tight') events.push(`🥣 [긴축 배급] 부족한 식사량에 모두가 불만을 가집니다. (정신력-5)`);
        else events.push(`🍲 [식사] 정해진 양의 식사를 마쳤습니다. (HP+2)`);
    } else {
        // 식량 부족 (기아 상태)
        livingHumans.forEach(c => {
            const u = getCharacterUpdate(updates, c.id);
            u.hpChange = (u.hpChange || 0) - 10;
            u.sanityChange = (u.sanityChange || 0) - 10;
        });
        events.push(`⚠️ [기아] 식량이 부족하여 생존자들이 굶주리고 있습니다! (전원 HP-10, 정신력-10)`);
    }
};

// 캠프 시설 효과 처리 메인 함수
export const processCampEffects = (
    camp: CampState,
    characters: Character[],
    updates: CharacterUpdate[],
    events: string[],
    globalLoot: string[],
    currentInventory: string[], // Added for consumption logic
    inventoryRemove: string[], // Added for consumption logic
    settings: GameSettings
) => {
    if (!camp) return;

    // 0. Daily Consumption (Food)
    processDailyConsumption(camp, characters, updates, events, currentInventory, inventoryRemove);

    // Facilities
    processLounge(camp, characters, updates, events);
    processInfirmary(camp, characters, updates, events);
    processGarden(camp, globalLoot, events, characters, updates);
    processWorkshop(camp, globalLoot, events, characters, updates);
    processBarricade(camp, characters, updates, events);
};

// 1. 휴게실: 정신력 및 피로도 회복 (배치 시 다른 사람 회복량 증가)
const processLounge = (camp: CampState, characters: Character[], updates: CharacterUpdate[], events: string[]) => {
    const level = camp.facilities['Lounge'] || 0;
    if (level === 0) return;

    const assignmentBonus = getAssignmentBonus('Lounge', camp, characters, updates);
    
    // 배치된 인원은 일을 하므로 본인은 회복 보너스를 못 받거나 적게 받음 (getAssignmentBonus에서 피로도 이미 추가됨)
    // 보너스 점수 1점당 전체 회복량 +1
    
    let sanityBonus = (level * 2) + assignmentBonus; 
    let fatigueReduction = (level * 3) + assignmentBonus;

    // 정책 영향 (치안이 엄격하면 정신력 회복 감소)
    if (camp.policies?.security === 'Strict') {
        sanityBonus -= 2;
    } else if (camp.policies?.security === 'None') {
        sanityBonus += 2;
    }

    let recoveredCount = 0;
    characters.forEach(c => {
        // 배치된 인원은 휴게실 효과(휴식)를 온전히 누리지 못함 (노동 중)
        const isAssigned = (camp.assignments['Lounge'] || []).includes(c.id);
        
        if (c.status !== 'Dead' && c.status !== 'Missing' && c.status !== 'Zombie' && !isAssigned) {
            const u = getCharacterUpdate(updates, c.id);
            u.sanityChange = (u.sanityChange || 0) + Math.max(0, sanityBonus);
            u.fatigueChange = (u.fatigueChange || 0) - Math.max(0, fatigueReduction);
            recoveredCount++;
        }
    });

    if (recoveredCount > 0) {
        if (level >= 3 || assignmentBonus > 0) {
            const extraText = assignmentBonus > 0 ? ` (관리자 ${camp.assignments['Lounge'].length}명 활동 중)` : "";
            events.push(`🛋️ [휴게실 Lv.${level}]${extraText} 편안한 휴식 공간 덕분에 생존자들의 정신력이 회복되고 피로가 풀렸습니다.`);
        }
    }
};

// 2. 양호실: 부상 및 감염 치료 (배치 시 치료량 증가)
const processInfirmary = (camp: CampState, characters: Character[], updates: CharacterUpdate[], events: string[]) => {
    const level = camp.facilities['Infirmary'] || 0;
    if (level === 0) return;

    const assignmentBonus = getAssignmentBonus('Infirmary', camp, characters, updates);

    // 보너스 1점당 회복량 +2, 감염치료 +1
    const hpHeal = (level * 3) + (assignmentBonus * 3); 
    const infectionCure = (level * 2) + (assignmentBonus * 2);

    let treatedNames: string[] = [];

    characters.forEach(c => {
        // 배치된 의사도 자가 치료는 가능하지만 효율은 시스템상 일괄 적용
        if (c.status === 'Alive' || c.status === 'Infected') {
            const u = getCharacterUpdate(updates, c.id);
            const currentHp = c.hp + (u.hpChange || 0);
            const currentInf = c.infection + (u.infectionChange || 0);
            let treated = false;

            // 부상 치료
            if (currentHp < c.maxHp) {
                u.hpChange = (u.hpChange || 0) + hpHeal;
                treated = true;
            }

            // 감염 억제
            if (currentInf > 0) {
                u.infectionChange = (u.infectionChange || 0) - infectionCure;
                treated = true;
            }

            if (treated) treatedNames.push(c.name);
        }
    });

    if (treatedNames.length > 0) {
        const extraText = assignmentBonus > 0 ? ` (의료진 ${camp.assignments['Infirmary'].length}명 활동)` : "";
        events.push(`🏥 [양호실 Lv.${level}]${extraText} ${treatedNames.length}명의 부상과 감염을 치료했습니다.`);
    }
};

// 3. 텃밭: 식량 생산
const processGarden = (camp: CampState, globalLoot: string[], events: string[], characters: Character[], updates: CharacterUpdate[]) => {
    const level = camp.facilities['Garden'] || 0;
    if (level === 0) return;

    const assignmentBonus = getAssignmentBonus('Garden', camp, characters, updates);

    // 기본 확률 + 보너스 확률 (1점당 10%)
    const chance = (level * 0.25) + (assignmentBonus * 0.15); 
    
    // 생산 횟수 시도 (100% 넘어가면 확정 1개 + 나머지 확률로 추가)
    let guaranteed = Math.floor(chance);
    let remainder = chance - guaranteed;
    
    let totalProduced = 0;
    totalProduced += guaranteed;
    if (Math.random() < remainder) totalProduced++;

    if (totalProduced > 0) {
        for (let i = 0; i < totalProduced; i++) {
            addLootToGlobal(['채소'], globalLoot);
        }
        const extraText = assignmentBonus > 0 ? ` (농부 ${camp.assignments['Garden'].length}명 활동)` : "";
        events.push(`🌱 [텃밭 Lv.${level}]${extraText} 정성껏 가꾼 작물로 [채소] ${totalProduced}개를 수확했습니다.`);
    }
};

// 4. 작업실: 자재 생산
const processWorkshop = (camp: CampState, globalLoot: string[], events: string[], characters: Character[], updates: CharacterUpdate[]) => {
    const level = camp.facilities['Workshop'] || 0;
    if (level === 0) return;

    const assignmentBonus = getAssignmentBonus('Workshop', camp, characters, updates);

    // 레벨별 자재 발견 확률
    const chance = (level * 0.2) + (assignmentBonus * 0.15); 
    
    let guaranteed = Math.floor(chance);
    let remainder = chance - guaranteed;
    
    let totalProduced = 0;
    totalProduced += guaranteed;
    if (Math.random() < remainder) totalProduced++;

    if (totalProduced > 0) {
        for (let i = 0; i < totalProduced; i++) {
            const materials = ['목재', '고철', '부품'];
            // 레벨이 높을수록, 전문가가 있을수록 고급 자재 확률 증가
            let item = '목재';
            const itemRoll = Math.random() * (level + assignmentBonus);
            
            if (itemRoll > 4) item = '부품';
            else if (itemRoll > 2) item = '고철';
            
            addLootToGlobal([item], globalLoot);
            events.push(`🛠️ [작업실 Lv.${level}] 쓸만한 [${item}]을(를) 가공해냈습니다.`);
        }
    }
};

// 5. 방벽: 야간 습격 방어
const processBarricade = (camp: CampState, characters: Character[], updates: CharacterUpdate[], events: string[]) => {
    const level = camp.facilities['Barricade'] || 0;
    const assignmentBonus = getAssignmentBonus('Barricade', camp, characters, updates);
    
    // 기본 습격 확률 15% - (레벨 * 2%) - (보너스 * 3%)
    let raidChance = Math.max(0.02, 0.15 - (level * 0.02) - (assignmentBonus * 0.03)); 
    
    // 치안 정책 반영
    if (camp.policies?.security === 'Strict') raidChance -= 0.10;
    if (camp.policies?.security === 'None') raidChance += 0.10;
    raidChance = Math.max(0, raidChance); // 음수 방지

    if (Math.random() < raidChance) {
        // 습격 발생!
        const living = characters.filter(c => c.status === 'Alive' || c.status === 'Infected');
        if (living.length === 0) return;

        // 방어력: 레벨 * 10 + 보너스 * 15
        const defense = (level * 10) + (assignmentBonus * 15);
        const damage = Math.max(0, 20 - defense + (Math.random() * 20)); // 기본 20~40 데미지

        if (damage <= 0) {
            const guardText = assignmentBonus > 0 ? `경비병들의 활약과 ` : "";
            events.push(`🛡️ [방벽 Lv.${level}] ${guardText}튼튼한 방벽 덕분에 좀비 무리의 습격을 피해 없이 막아냈습니다.`);
        } else {
            events.push(`🧟 [습격] 좀비들이 방벽 틈을 뚫고 들어왔습니다! (방어력으로 피해 ${defense} 경감)`);
            
            // 랜덤 타겟 1~3명 피해
            const targets = [...living].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(Math.random() * 3));
            targets.forEach(t => {
                const u = getCharacterUpdate(updates, t.id);
                u.hpChange = (u.hpChange || 0) - Math.floor(damage);
                u.fatigueChange = (u.fatigueChange || 0) + 10;
                events.push(`⚔️ ${t.name}이(가) 방어 도중 부상을 입었습니다. (HP -${Math.floor(damage)})`);
            });
        }
    } else if (level > 0 && Math.random() < 0.1) {
        const extraText = assignmentBonus > 0 ? `경계 근무 중인 동료들이 든든합니다.` : `이곳은 안전합니다.`;
        events.push(`🚧 [방벽 Lv.${level}] 방벽 너머로 좀비들의 울음소리가 들리지만, ${extraText}`);
    }
};
