
import { StoryNode } from "../../types";
import { HOSPITAL_NODES } from "./stories/hospital";
import { WINTER_NODES } from "./stories/winter";
import { METRO_NODES } from "./stories/metro";
import { RADIO_NODES } from "./stories/radio";
import { WANDER_NODES } from "./stories/wander";
import { CULT_NODES } from "./stories/cult";
import { ONE_OFF_NODES } from "./stories/oneOffs";
import { BUNKER_NODES } from "./stories/bunker";
import { SCHOOL_NODES } from "./stories/school";
import { PRISON_NODES } from "./stories/prison";
import { AMUSEMENT_NODES } from "./stories/amusement";

// =================================================================
// Story Arcs Aggregation
// =================================================================

export const STORY_NODES: Record<string, StoryNode> = {
    ...HOSPITAL_NODES,
    ...WINTER_NODES,
    ...METRO_NODES,
    ...RADIO_NODES,
    ...WANDER_NODES,
    ...CULT_NODES,
    ...ONE_OFF_NODES,
    ...BUNKER_NODES,
    ...SCHOOL_NODES,
    ...PRISON_NODES,
    ...AMUSEMENT_NODES
};

// 시작 가능한 메인 아크의 첫 번째 노드 ID 목록
export const STARTER_NODE_IDS = [
    // Main Arcs (10)
    'hospital_0_start',
    'winter_0_start',
    'metro_0_start',
    'radio_0_start',
    'wander_0_start',
    'cult_0_start',
    'bunker_0_signal',
    'school_0_start', 
    'prison_0_start', 
    'amusement_0_start', 
    
    // One-offs (Environmental/Atmospheric) (15)
    'tarot_start', 
    'sunny_day',
    'foggy_day',
    'heavy_rain',
    'heatwave',
    'thunderstorm',
    'full_moon',
    'starry_night',
    'quiet_day',
    'horde_pass',
    'helicopter',
    'nightmare_shared',
    'old_music',
    'board_game',
    'stray_dog',
    'rat_swarm',
    'creepy_doll',
    'flower_field',
    'weapon_maintenance',

    // Dice Challenge One-offs (Existing 20)
    'dice_tripwire',
    'dice_locked_pharmacy',
    'dice_sleeping_horde',
    'dice_heavy_gate',
    'dice_suspicious_trader',
    'dice_broken_generator',
    'dice_precarious_bridge',
    'dice_stuck_crate',
    'dice_infected_scratch',
    'dice_dark_crawlspace',
    'dice_bracing_wall',
    'dice_rooftop_jump',
    'dice_calm_panic',
    'dice_radio_alignment',
    'dice_patch_leak',
    'dice_disarm_mine',
    'dice_icy_climb',
    'dice_wolf_encounter',
    'dice_bandit_checkpoint',
    'dice_rusty_fire_escape',

    // New Additional Dice Challenge One-offs (20 More)
    'dice_plane_crash',
    'dice_rusty_pump',
    'dice_bully_scare',
    'dice_logic_puzzle',
    'dice_tightrope',
    'dice_wall_push',
    'dice_old_lock',
    'dice_honey_tongue',
    'dice_cluttered_attic',
    'dice_heavy_debris',
    'dice_circuit_board',
    'dice_emotional_plea',
    'dice_river_leap',
    'dice_iron_door',
    'dice_chemical_mix',
    'dice_street_performance',
    'dice_slippery_ledge',
    'dice_boulder_roll',
    'dice_ancient_script',
    'dice_group_cheer',

    // Loot Events
    'abandoned_truck',
    'pharmacy_ruin',
    'vaccine_drop',
    'cannibal_meal',
    'military_convoy',
    
    // Duplicates for Probability Boost
    'abandoned_truck',
    'pharmacy_ruin',
    'vaccine_drop',
    'dice_tripwire',
    'dice_sleeping_horde',
    'dice_locked_pharmacy',

    // Interactive Item Events
    'oneoff_locked_box',
    'oneoff_confusing_path',
    'oneoff_zombie_dog',
    'oneoff_faint_signal',
    'oneoff_broken_bridge'
];
