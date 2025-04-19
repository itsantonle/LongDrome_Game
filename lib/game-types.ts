/**
 * Game Types for Palindrome Guardian
 * ----------------------------------
 *
 * This file contains all the type definitions used throughout the game.
 * These types provide structure and type safety for the game's state management.
 *
 * TYPE DEFINITIONS OVERVIEW:
 *
 * 1. GameState:
 *    - Defines all possible game states: "idle" | "userTurn" | "enemyTurn" | etc.
 *    - Used to control game flow and UI rendering
 *
 * 2. CharacterStats:
 *    - Defines player character statistics (HP, MP, etc.)
 *    - Used to track player status and capabilities
 *
 * 3. EnemyStats:
 *    - Defines enemy statistics (HP, amiability, etc.)
 *    - Used to track the Guardian's status and disposition
 *
 * 4. GuardianDialog:
 *    - Defines structure for dialog options based on amiability
 *    - Includes positive/negative keywords for response analysis
 *
 * 5. PalindromeResult:
 *    - Defines the structure for palindrome detection results
 *    - Used by the palindrome finding algorithms
 *
 * HOW TO MODIFY:
 *
 * 1. To add a new game state:
 *    - Add it to the GameState type union
 *    - Handle the new state in the game component's rendering logic
 *
 * 2. To add new character stats:
 *    - Add new properties to the CharacterStats interface
 *    - Initialize and update them in the game component
 *
 * 3. To add new enemy properties:
 *    - Add new properties to the EnemyStats interface
 *    - Initialize and update them in the game component
 *
 * 4. To extend dialog features:
 *    - Modify the GuardianDialog interface
 *    - Update the dialog handling logic in the game component
 *
 * EXAMPLE MODIFICATIONS:
 *
 * 1. To add a "paused" game state:
 *    - Add "paused" to the GameState type
 *    - Add logic to handle pausing/resuming in the game component
 *
 * 2. To add player experience points:
 *    - Add "xp" and "level" properties to CharacterStats
 *    - Add logic to award XP and handle leveling up
 *
 * 3. To add Guardian special abilities:
 *    - Add "specialAbilities" array to EnemyStats
 *    - Implement logic to use these abilities during enemy turns
 */

// Game states
export type GameState = "idle" | "userTurn" | "enemyTurn" | "tutorial" | "gameOver" | "home" | "victory"

// Character stats type
export interface CharacterStats {
  hp: number
  maxHp: number
  mp: number
  maxMp: number
}

// Enemy stats type
export interface EnemyStats {
  hp: number
  maxHp: number
  amiability: number // 0-100 scale, 0 is hostile, 100 is friendly
}

// Guardian dialog structure
export interface GuardianDialog {
  hostile: string[] // Dialog options when amiability is low (<30)
  neutral: string[] // Dialog options when amiability is medium (30-69)
  friendly: string[] // Dialog options when amiability is high (>=70)
  positiveKeywords: string[] // Keywords that increase amiability when used in player responses
  negativeKeywords: string[] // Keywords that decrease amiability when used in player responses
}

// Palindrome result type
export interface PalindromeResult {
  start: number // Starting index of the palindrome in the original sequence
  length: number // Length of the palindrome
  sequence: string[] // The actual palindrome sequence
}

// Response option type for dialog choices
export interface ResponseOption {
  text: string
  type: "positive" | "negative" | "neutral"
  keywords?: string[] // Optional specific keywords this response contains
}

