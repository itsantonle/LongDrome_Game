/**
 * Game Utilities for Palindrome Guardian
 * --------------------------------------
 *
 * This file contains utility functions for game mechanics, dialog management,
 * and palindrome operations specific to the game.
 *
 * UTILITY FUNCTIONS OVERVIEW:
 *
 * 1. Dialog Management:
 *    - getGuardianDialog(): Returns appropriate dialog based on turn count and amiability
 *    - getKeywordsForTurn(): Gets positive/negative keywords for the current turn
 *    - calculateAmiabilityChange(): Calculates how player responses affect Guardian's amiability
 *
 * 2. Palindrome Operations:
 *    - findOptimalPalindrome(): Finds the longest palindrome in a sequence
 *    - userFoundOptimalPalindrome(): Checks if user found the optimal palindrome
 *
 * 3. Game Mechanics:
 *    - calculateDamage(): Determines damage based on palindrome comparison
 *    - canAccessHome(): Checks if player can access home
 *    - getHomeAccessMessage(): Gets message about home accessibility
 *
 * HOW TO MODIFY:
 *
 * 1. To change dialog content:
 *    - Edit the guardianDialogs array below
 *    - Each entry has hostile, neutral, and friendly dialog options
 *    - You can add more entries for additional turns
 *
 * 2. To adjust amiability impact:
 *    - Modify the positiveKeywords and negativeKeywords arrays in guardianDialogs
 *    - Change the amiability values in calculateAmiabilityChange()
 *
 * 3. To change damage calculation:
 *    - Modify the calculateDamage() function
 *    - Adjust the base damage formula or the turn multiplier
 *
 * 4. To adjust home access requirements:
 *    - Modify the canAccessHome() function
 *    - Change the amiability threshold (currently 70)
 *
 * EXAMPLE MODIFICATIONS:
 *
 * 1. To make the Guardian more forgiving:
 *    - Reduce the negative impact in calculateAmiabilityChange()
 *    - Lower the amiability threshold in canAccessHome()
 *
 * 2. To make the game harder:
 *    - Increase the damage in calculateDamage()
 *    - Add more negative keywords to guardianDialogs
 *    - Increase the amiability threshold in canAccessHome()
 */

import { GAME_CONFIG } from '@/app/page'
import type { GuardianDialog } from './game-types'
import {
  findLongestPalindromeBruteForce,
  findLongestPalindromeManacher,
  isPalindrome,
} from './palindrome-utils'

// Export guardianDialogs so it can be imported in DialogWithInput
/**
 * HOW TO EDIT GUARDIAN DIALOG:
 *
 * The guardianDialogs array contains dialog options for each turn of the game.
 * Each entry in the array represents one turn and has these properties:
 *
 * 1. hostile: Array of dialog lines shown when amiability is low (<30)
 * 2. neutral: Array of dialog lines shown when amiability is medium (30-69)
 * 3. friendly: Array of dialog lines shown when amiability is high (>=70)
 * 4. positiveKeywords: Words that increase amiability when used in player responses
 * 5. negativeKeywords: Words that decrease amiability when used in player responses
 *
 * To edit dialog:
 * - Find the turn you want to modify (index 0 is turn 1, index 1 is turn 2, etc.)
 * - Edit the dialog strings in hostile, neutral, or friendly arrays
 * - You can add more dialog options to each array
 * - The game will randomly select one dialog from the appropriate array
 *
 * To add a new turn:
 * - Add a new object to the guardianDialogs array with all required properties
 * - Make sure to update MAX_TURNS in GAME_CONFIG if needed
 *
 * EXAMPLE:
 * To change the first neutral dialog of turn 1:
 * guardianDialogs[0].neutral[0] = "Your new dialog text here";
 *
 * IMPORTANT: Use normal, modern English for all dialog text. Do not use archaic language
 * or special accents. Write dialog as you would normal conversation.
 */
export const guardianDialogs: GuardianDialog[] = [
  {
    hostile: [
      'Your attempts to communicate are interesting, mortal.',
      'Only those who truly understand palindromes may proceed.',
      'Show me your worth through your actions, not just words.',
      'Your presence disturbs the ancient energies of this place.',
    ],
    neutral: [
      'You show potential, seeker of knowledge.',
      'The patterns of colors hold great power. Do you see it?',
      'Each palindrome is a key to understanding the balance of the universe.',
      'Few mortals have ventured this far into the temple. What drives you?',
    ],
    friendly: [
      'Your understanding of palindromes intrigues me.',
      "The symmetry you've shown reflects the harmony of all things.",
      'Perhaps there is more to you than I first perceived.',
      'Your mind has a certain resonance with the ancient patterns.',
    ],
    positiveKeywords: ['wisdom', 'harmony', 'balance', 'respect'],
    negativeKeywords: ['power', 'demand', 'force', 'control'],
  },
  {
    hostile: [
      'You continue to stand before me. Bold.',
      'Your approach to the patterns is unconventional.',
      'Few have survived this long. Interesting.',
      'The temple grows restless with your presence.',
    ],
    neutral: [
      'Interesting approach to the patterns.',
      'You begin to see the symmetry, but there is more to learn.',
      'The colors speak to those who truly listen.',
      'What do you hope to gain from these trials, traveler?',
    ],
    friendly: [
      'Your progress is noteworthy.',
      'The colors respond to your understanding.',
      'Continue this path, and knowledge shall be yours.',
      'I sense a growing connection between you and the ancient patterns.',
    ],
    positiveKeywords: ['patience', 'learn', 'symmetry', 'listen'],
    negativeKeywords: ['strength', 'take', 'quick', 'shortcut'],
  },
  {
    hostile: [
      'Your persistence is remarkable.',
      'Many have tried to master these patterns. Most have failed.',
      'The true test approaches, mortal.',
      'The temple has seen countless seekers come and go. Most leave in despair.',
    ],
    neutral: [
      'The ancient ones created these patterns as tests.',
      'Balance in all things - this is the key to palindromes.',
      'Your understanding grows, but is it enough?',
      'What do you see when you look at these patterns? Mere colors, or something more?',
    ],
    friendly: [
      'Few have shown such aptitude with the color patterns.',
      'The ancient knowledge begins to reveal itself to you.',
      'Our meeting was perhaps not coincidental.',
      'The temple itself seems to respond differently to your presence now.',
    ],
    positiveKeywords: ['balance', 'patience', 'harmony', 'respect'],
    negativeKeywords: ['power', 'mastery', 'control', 'dominate'],
  },
  {
    hostile: [
      'Your approach is different from others who came before.',
      'The patterns grow more complex. Your mind must adapt.',
      'Soon, we will see your true potential.',
      'The ancient energies stir. They sense your ambition.',
    ],
    neutral: [
      'These palindromes have existed since time immemorial.',
      'The symmetry of colors reflects the symmetry of the universe.',
      'You are beginning to see beyond the surface.',
      'What drives you to continue these trials? Knowledge? Power? Or something else?',
    ],
    friendly: [
      'Your intuition for palindromes is noteworthy.',
      'Perhaps you were meant to discover these ancient secrets.',
      'I find our exchanges educational.',
      "The temple's energies seem to flow more harmoniously in your presence now.",
    ],
    positiveKeywords: ['learn', 'understand', 'harmony', 'balance'],
    negativeKeywords: ['conquer', 'defeat', 'force', 'demand'],
  },
  {
    hostile: [
      'The final patterns await your attempt.',
      'The deepest secrets test even the strongest minds.',
      'Prepare to demonstrate your true understanding.',
      'Many have reached this point. Few have proceeded further.',
    ],
    neutral: [
      'We approach the final trials.',
      'The deepest secrets of palindromes await those who persevere.',
      'Show me what you have truly learned.',
      'What will you do with the knowledge you seek, I wonder?',
    ],
    friendly: [
      'We have come far in our understanding.',
      'The final patterns will reveal the ultimate truth.',
      'I believe you may be ready for what comes next.',
      'The temple has accepted you. I can feel its ancient energies resonating with your presence.',
    ],
    positiveKeywords: ['together', 'understand', 'learn', 'respect'],
    negativeKeywords: ['power', 'challenge', 'defeat', 'overcome'],
  },
  {
    hostile: [
      'This is your final test. Do not disappoint me.',
      'The culmination of your journey is at hand.',
      'Few reach this point. Even fewer succeed.',
      'Your determination is admirable, if misguided.',
    ],
    neutral: [
      'The final challenge awaits you.',
      'All you have learned will be tested now.',
      'The true nature of palindromes is about to be revealed.',
      'Are you prepared for what comes next?',
    ],
    friendly: [
      'You stand at the threshold of understanding.',
      'I have watched your progress with great interest.',
      'The ancient knowledge is almost within your grasp.',
      'Perhaps you are the one the prophecies spoke of.',
    ],
    positiveKeywords: ['harmony', 'balance', 'respect', 'wisdom'],
    negativeKeywords: ['power', 'control', 'dominate', 'force'],
  },
]

// Double-check all dialog content to ensure NO archaic language remains
// Update any dialog that might still contain archaic terms or phrasing

// For example, ensure these dialogs in the guardianDialogs array:

// Ensure all dialog is in normal, modern English with no "thee", "thou", "hast", etc.
// Check every single dialog entry to ensure it uses completely modern, normal language

// Make sure every entry in all arrays (hostile, neutral, friendly) for all turn counts
// uses plain modern English

// For Turn 1 (index 0), verify these are all modern English:
guardianDialogs[0].hostile = [
  'Your attempts to communicate are interesting, mortal.',
  'Only those who truly understand palindromes may proceed.',
  'Show me your worth through your actions, not just words.',
  'Your presence disturbs the ancient energies of this place.',
]

guardianDialogs[0].neutral = [
  'You show potential, seeker of knowledge.',
  'The patterns of colors hold great power. Do you see it?',
  'Each palindrome is a key to understanding the balance of the universe.',
  'Few mortals have ventured this far into the temple. What drives you?',
]

guardianDialogs[0].friendly = [
  'Your understanding of palindromes intrigues me.',
  "The symmetry you've shown reflects the harmony of all things.",
  'Perhaps there is more to you than I first perceived.',
  'Your mind has a certain resonance with the ancient patterns.',
]

// For all other turns, make sure all dialog uses clear, modern English

/**
 * Get the appropriate dialog based on turn count and amiability
 * @param turnCount Current turn count (0-based)
 * @param amiability Guardian's amiability (0-100)
 * @returns Array of dialog strings appropriate for the current state
 */
export function getGuardianDialog(
  turnCount: number,
  amiability: number
): string[] {
  const dialogIndex = Math.min(turnCount, guardianDialogs.length - 1)
  const currentDialog = guardianDialogs[dialogIndex]

  if (amiability < 30) {
    return currentDialog.hostile
  } else if (amiability < 70) {
    return currentDialog.neutral
  } else {
    return currentDialog.friendly
  }
}

/**
 * Get keywords for current turn
 * @param turnCount Current turn count (0-based)
 * @returns Object containing positive and negative keywords
 */
export function getKeywordsForTurn(turnCount: number): {
  positive: string[]
  negative: string[]
} {
  const dialogIndex = Math.min(turnCount, guardianDialogs.length - 1)
  return {
    positive: guardianDialogs[dialogIndex].positiveKeywords,
    negative: guardianDialogs[dialogIndex].negativeKeywords,
  }
}

// Update the calculateAmiabilityChange function to make it more reliable and obvious

/**
 * Calculate amiability change based on player response
 * @param response Player's response text
 * @param turnCount Current turn count (0-based)
 * @returns Number representing amiability change (-20 to +20)
 */
export function calculateAmiabilityChange(
  response: string,
  turnCount: number
): number {
  const keywords = getKeywordsForTurn(turnCount)
  let amiabilityChange = 0
  let positiveMatches = 0
  let negativeMatches = 0
  const responseLower = response.toLowerCase()

  // Check for positive keywords - make matches more impactful
  for (const keyword of keywords.positive) {
    if (responseLower.includes(keyword.toLowerCase())) {
      amiabilityChange += 8
      positiveMatches++
      console.log(`Positive keyword matched: ${keyword}`)
    }
  }

  // Check for negative keywords - make them have a stronger negative impact
  for (const keyword of keywords.negative) {
    if (responseLower.includes(keyword.toLowerCase())) {
      amiabilityChange -= 12
      negativeMatches++
      console.log(`Negative keyword matched: ${keyword}`)
    }
  }

  // If both positive and negative keywords are found, the negative ones should have more weight
  if (positiveMatches > 0 && negativeMatches > 0) {
    amiabilityChange -= 5 // Additional penalty for mixed messages
  }

  // Add small randomness to make it less predictable, but keep it small
  const randomFactor = Math.floor(Math.random() * 3) - 1
  amiabilityChange += randomFactor

  // If no keywords matched, small random change
  if (positiveMatches === 0 && negativeMatches === 0) {
    amiabilityChange = Math.floor(Math.random() * 5) - 2
  }

  // Ensure negative options actually decrease amiability
  // If the response is from a negative option but amiability is positive, fix it
  if (negativeMatches > 0 && amiabilityChange >= 0) {
    amiabilityChange = -5 - Math.floor(Math.random() * 5) // Ensure negative change
  }

  // Similarly, ensure positive options increase amiability
  if (positiveMatches > 0 && negativeMatches === 0 && amiabilityChange <= 0) {
    amiabilityChange = 5 + Math.floor(Math.random() * 5) // Ensure positive change
  }

  // Log the final change for debugging
  console.log(
    `Amiability change: ${amiabilityChange} (positive matches: ${positiveMatches}, negative matches: ${negativeMatches})`
  )

  return amiabilityChange
}

/**
 * Find the longest palindrome in a sequence
 * @param colorSequence Array of color strings
 * @returns Object containing start index, length, and the palindrome sequence
 *
 * FALLBACK MECHANISM:
 * This function implements a robust fallback system:
 * 1. First tries Manacher's algorithm (efficient O(n) solution)
 * 2. If Manacher's fails, falls back to brute force approach
 * 3. If brute force fails, falls back to simple palindrome search
 * 4. If all else fails, returns a single element (which is always a palindrome)
 *
 * This ensures the game always finds a valid palindrome, even in edge cases.
 */
export function findOptimalPalindrome(colorSequence: string[]): {
  start: number
  length: number
  sequence: string[]
} {
  // Use Manacher's algorithm for better performance
  // This is more efficient than the brute force approach
  try {
    const result = findLongestPalindromeManacher(colorSequence)

    // Extract the sequence
    const sequence = colorSequence.slice(
      result.start,
      result.start + result.length
    )

    // Double-check that the sequence is actually a palindrome
    if (!isPalindrome(sequence)) {
      console.error("Manacher's algorithm returned a non-palindrome:", sequence)
      // Fall back to brute force if Manacher's algorithm fails
      return findOptimalPalindromeWithBruteForce(colorSequence)
    }

    return {
      start: result.start,
      length: result.length,
      sequence,
    }
  } catch (error) {
    console.error("Error in Manacher's algorithm:", error)
    // Fall back to brute force if Manacher's algorithm throws an error
    return findOptimalPalindromeWithBruteForce(colorSequence)
  }
}

/**
 * Fallback function using brute force approach
 * @param colorSequence Array of color strings
 * @returns Object containing start index, length, and the palindrome sequence
 *
 * FALLBACK DETAILS:
 * This function is called when Manacher's algorithm fails and provides multiple layers of fallback:
 * 1. First tries the brute force approach (O(n³) time complexity)
 * 2. If that fails, manually searches for any palindrome by checking all substrings
 * 3. If all else fails, returns a single element (which is always a palindrome)
 *
 * This multi-layered fallback ensures the game never crashes due to palindrome detection issues.
 */
function findOptimalPalindromeWithBruteForce(colorSequence: string[]): {
  start: number
  length: number
  sequence: string[]
} {
  // Use the brute force approach which is guaranteed to work
  const result = findLongestPalindromeBruteForce(colorSequence)

  // Extract the sequence
  const sequence = colorSequence.slice(
    result.start,
    result.start + result.length
  )

  // Double-check that the sequence is actually a palindrome
  if (!isPalindrome(sequence)) {
    console.error('Brute force algorithm returned a non-palindrome:', sequence)

    // Fallback: find a simple palindrome
    for (let len = colorSequence.length; len > 0; len--) {
      for (let start = 0; start <= colorSequence.length - len; start++) {
        const subseq = colorSequence.slice(start, start + len)
        if (isPalindrome(subseq)) {
          return {
            start,
            length: len,
            sequence: subseq,
          }
        }
      }
    }

    // If all else fails, return a single element (which is always a palindrome)
    return {
      start: 0,
      length: 1,
      sequence: [colorSequence[0]],
    }
  }

  return {
    start: result.start,
    length: result.length,
    sequence,
  }
}

/**
 * Check if the user found the optimal palindrome
 * @param selectedIndices Array of indices selected by the user
 * @param longestPalindrome Object containing the optimal palindrome info
 * @returns Boolean indicating if user found optimal palindrome
 */
export function userFoundOptimalPalindrome(
  selectedIndices: number[],
  longestPalindrome: { start: number; length: number }
): boolean {
  // The user found the optimal palindrome if the length matches the longest possible palindrome
  return selectedIndices.length >= longestPalindrome.length
}

/**
 * Calculate damage based on palindrome lengths with increasing difficulty per turn
 * @param enemyPalindromeLength Length of enemy's palindrome
 * @param userPalindromeLength Length of user's palindrome
 * @param turnCount Current turn count (0-based)
 * @returns Number representing damage to be dealt
 */
export function calculateDamage(
  enemyPalindromeLength: number,
  userPalindromeLength: number,
  turnCount = 0
): number {
  // If user found optimal palindrome or longer, no damage
  if (userPalindromeLength >= enemyPalindromeLength) {
    return 0
  }

  // Calculate base damage based on the difference
  const baseDamage = Math.floor(
    (enemyPalindromeLength - userPalindromeLength) * 5
  )

  // Increase damage with turn count (50% more damage at turn 10)
  const damageMultiplier = 1 + turnCount * 0.05

  return Math.floor(baseDamage * damageMultiplier)
}

/**
 * Check if home is accessible
 * @param gameState Current game state
 * @param amiability Guardian's amiability (0-100)
 * @returns Boolean indicating if home is accessible
 */
export function canAccessHome(gameState: string, amiability: number): boolean {
  return (
    gameState === 'victory' ||
    amiability >= GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
  )
}

/**
 * Get a message about home accessibility
 * @param gameState Current game state
 * @param amiability Guardian's amiability (0-100)
 * @returns String message about home accessibility
 */
export function getHomeAccessMessage(
  gameState: string,
  amiability: number,
  npcName: string
): string {
  if (gameState === 'victory') {
    return `You have earned ${npcName}'s respect and can now return home.`
  } else if (amiability >= GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY) {
    return `${npcName} seems to trust you. You may return home if you wish.`
  } else {
    return `${npcName} blocks your path. You cannot leave yet! Continue to improve your relationship with the Guardian.`
  }
}
