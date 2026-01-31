
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

// 식량 소비 및 배급 정책 처리 (포만감 시스템 적용)
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
    let foodItemsPerPerson = 1.0;
    let hungerRestoreValue = 40;
    let sanityBonus = 0;
    let hpBonus = 2;

    if (rationing === 'Generous') {
        foodItemsPerPerson = 2.0;
        hungerRestoreValue = 60;
        sanityBonus = 5;
        hpBonus = 5;
    } else if (rationing === 'Tight') {
        foodItemsPerPerson = 0.5;
        hungerRestoreValue = 20;
        sanityBonus = -5;
        hpBonus = 0;
    }

    // 가상 인벤토리 (제거된 것 제외)
    const availableInventory = [...currentInventory];
    let totalFoodConsumed = 0;
    let fedCount = 0;

    // 배고픈 순서대로 정렬하여 공평하게 배급 시도
    const sortedHumans = [...livingHumans].sort((a, b) => (a.hunger || 0) - (b.hunger || 0));

    sortedHumans.forEach(c => {
        const u = getCharacterUpdate(updates, c.id);
        let itemsNeeded = foodItemsPerPerson;
        let itemsActuallyFound = 0;

        // 필요한 아이템 개수만큼 인벤토리에서 찾기
        // 긴축 배급(0.5)인 경우 2명당 1개 소모 로직이 필요하나, 단순화를 위해 
        // 각 개인에게 확률적으로 1개를 주거나 0.5개를 누적하는 방식 대신
        // 전체 소모량을 먼저 계산하지 않고 순차적으로 처리
        
        // 0.5개 정책일 경우 50% 확률로 1개 소모 또는 소모 안 함 처리로 근사치 계산
        if (itemsNeeded === 0.5) {
            if (Math.random() < 0.5) itemsNeeded = 1;
            else itemsNeeded = 0;
        }

        for (let i = 0; i < itemsNeeded; i++) {
            let found = false;
            for (const foodType of FOOD_ITEMS) {
                const idx = availableInventory.indexOf(foodType);
                if (idx > -1) {
                    availableInventory.splice(idx, 1);
                    inventoryRemove.push(foodType);
                    itemsActuallyFound++;
                    totalFoodConsumed++;
                    found = true;
                    break;
                }
            }
            if (!found) break;
        }

        // 배급 결과 적용
        if (itemsActuallyFound >= Math.floor(itemsNeeded)) {
            // 배급 성공 (혹은 아이템이 필요 없는 긴축 정책의 운 좋은 케이스)
            u.hungerChange = (u.hungerChange || 0) + hungerRestoreValue;
            u.sanityChange = (u.sanityChange || 0) + sanityBonus;
            u.hpChange = (u.hpChange || 0) + hpBonus;
            fedCount++;
        } else {
            // 배급 실패 (식량 부족)
            u.sanityChange = (u.sanityChange || 0) - 5; // 배고픈데 못 먹으면 실망
        }
    });

    // 로그 출력
    if (fedCount === livingHumans.length) {
        if (rationing === 'Generous') events.push(`🍖 [풍족한 배급] 모두가 배불리 먹고 포만감을 느낍니다. (허기 대폭 회복, 정신력+5)`);
        else if (rationing === 'Tight') events.push(`🥣 [긴축 배급] 부족한 식사지만 일단 배를 채웠습니다. (허기 소폭 회복, 정신력-5)`);
        else events.push(`🍲 [식사] 표준 배급이 이루어졌습니다. (허기 회복, HP+2)`);
    } else if (fedCount > 0) {
        events.push(`⚠️ [식량 부족] 일부 생존자들이 식량을 배급받지 못했습니다! (${fedCount}/${livingHumans.length}명 식사 완료)`);
    } else {
        events.push(`🚨 [기아 위기] 보관된 식량이 전혀 없어 전원이 굶주리고 있습니다!`);
    }
};

// 캠프 시설 효과 처리 메인 함수
export const processCampEffects = (
    camp: CampState,
    characters: Character[],
    updates: CharacterUpdate[],
    events: string[],
    globalLoot: string[],
    currentInventory: string[],
    inventoryRemove: string[],
    settings: GameSettings
) => {
    if (!camp) return;

    // 0. Daily Consumption (Food) - 포만감 시스템 적용됨
    processDailyConsumption(camp, characters, updates, events, currentInventory, inventoryRemove);

    // Facilities
    processLounge(camp, characters, updates, events);
    processInfirmary(camp, characters, updates, events);
    processGarden(camp, globalLoot, events, characters, updates);
    processWorkshop(camp, globalLoot, events, characters, updates);
    processBarricade(camp, characters, updates, events);
};

// 1. 휴게실: 정신력 및 피로도 회복
const processLounge = (camp: CampState, characters: Character[], updates: CharacterUpdate[], events: string[]) => {
    const level = camp.facilities['Lounge'] || 0;
    if (level === 0) return;

    const assignmentBonus = getAssignmentBonus('Lounge', camp, characters, updates);
    
    let sanityBonus = (level * 2) + assignmentBonus; 
    let fatigueReduction = (level * 3) + assignmentBonus;

    if (camp.policies?.security === 'Strict') {
        sanityBonus -= 2;
    } else if (camp.policies?.security === 'None') {
        sanityBonus += 2;
    }

    let recoveredCount = 0;
    characters.forEach(c => {
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

// 2. 양호실: 부상 및 감염 치료
const processInfirmary = (camp: CampState, characters: Character[], updates: CharacterUpdate[], events: string[]) => {
    const level = camp.facilities['Infirmary'] || 0;
    if (level === 0) return;

    const assignmentBonus = getAssignmentBonus('Infirmary', camp, characters, updates);

    const hpHeal = (level * 3) + (assignmentBonus * 3); 
    const infectionCure = (level * 2) + (assignmentBonus * 2);

    let treatedNames: string[] = [];

    characters.forEach(c => {
        if (c.status === 'Alive' || c.status === 'Infected') {
            const u = getCharacterUpdate(updates, c.id);
            const currentHp = c.hp + (u.hpChange || 0);
            const currentInf = c.infection + (u.infectionChange || 0);
            let treated = false;

            if (currentHp < c.maxHp) {
                u.hpChange = (u.hpChange || 0) + hpHeal;
                treated = true;
            }

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

    const chance = (level * 0.25) + (assignmentBonus * 0.15); 
    
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

    const chance = (level * 0.2) + (assignmentBonus * 0.15); 
    
    let guaranteed = Math.floor(chance);
    let remainder = chance - guaranteed;
    
    let totalProduced = 0;
    totalProduced += guaranteed;
    if (Math.random() < remainder) totalProduced++;

    if (totalProduced > 0) {
        for (let i = 0; i < totalProduced; i++) {
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
    
    let raidChance = Math.max(0.02, 0.15 - (level * 0.02) - (assignmentBonus * 0.03)); 
    
    if (camp.policies?.security === 'Strict') raidChance -= 0.10;
    if (camp.policies?.security === 'None') raidChance += 0.10;
    raidChance = Math.max(0, raidChance); 

    if (Math.random() < raidChance) {
        const living = characters.filter(c => c.status === 'Alive' || c.status === 'Infected');
        if (living.length === 0) return;

        const defense = (level * 10) + (assignmentBonus * 15);
        const damage = Math.max(0, 20 - defense + (Math.random() * 20)); 

        if (damage <= 0) {
            const guardText = assignmentBonus > 0 ? `경비병들의 활약과 ` : "";
            events.push(`🛡️ [방벽 Lv.${level}] ${guardText}튼튼한 방벽 덕분에 좀비 무리의 습격을 피해 없이 막아냈습니다.`);
        } else {
            events.push(`🧟 [습격] 좀비들이 방벽 틈을 뚫고 들어왔습니다! (방어력으로 피해 ${defense} 경감)`);
            
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
