/**
 * GAME CONFIGURATION PARAMETERS
 * NOTE: THIS WILL ALWAYS EXPORT THE DEFAULT CONFIG.. MAKING A NEW CONFIG IS RECOMMENDED IF TWEARKING
 * SETTINGS. DO NOT DELETE THE DEFAULT CONFIG.
 *
 * MAX_TURNS: Number of turns before the game ends or triggers the final battle
 *   - Decrease for shorter games, increase for longer games
 *   - Affects difficulty as later turns have stronger enemies
 *
 * AMIABILITY_THRESHOLDS: Thresholds for different Guardian behaviors
 *   - HOSTILE: Below this value, Guardian is hostile (default: 30)
 *   - FRIENDLY: Above this value, Guardian is friendly (default: 70)
 *   - These values affect dialog, healing, and win conditions
 *
 * HEALTH_THRESHOLDS: Thresholds for player appearance changes
 *   - WEAKENED: Below this percentage, player appears weakened (default: 0.5 or 50%)
 *   - CRITICAL: Below this percentage, player appears critical (default: 0.1 or 10%)
 *
 * MAGIC_COST: MP cost for using the magic ability (default: 20)
 *   - Increase to make magic more valuable, decrease to make it more accessible
 *
 * To modify these values, simply change the numbers below
 */

// this is to set the maximum number of turns and the boundaries of the game
export const defaultConfig = {
  MAX_TURNS: 6, // Default: 6 - Number of turns before game end or final battle
  AMIABILITY_THRESHOLDS: {
    HOSTILE: 30, // Below this value, Guardian is hostile
    FRIENDLY: 70, // Above this value, Guardian is friendly
  },
  HEALTH_THRESHOLDS: {
    WEAKENED: 0.5, // Below 50% health, player appears weakened
    CRITICAL: 0.1, // Below 10% health, player appears critical
  },
  MAGIC_COST: 20, // MP cost for using magic ability
  REST_HEALING: {
    HP: 30, // HP restored when resting at home
    MP: 30, // MP restored when resting at home
  },
}

export const defaultCharacterStats = {
  hp: 100, // the current hp of the character
  maxHp: 100, // max HP of the character
  mp: 50, // the current hp of the character
  maxMp: 50, // max MP of the character
}

export const defaultEnemeyStats = {
  hp: 100,
  maxHp: 100,
  amiability: 50, // 0-100 scale, 0 is hostile, 100 is friendly
}

export const defaultNPCname = 'Ancient Guardian'
