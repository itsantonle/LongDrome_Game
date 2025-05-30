/**
 * Palindrome Utilities for LONGEDROME
 * --------------------------------------------
 *
 * This file contains utility functions for palindrome operations in the game.
 * It includes algorithms for finding palindromes, checking if a sequence is a palindrome,
 * and generating random color sequences with palindromes.
 *
 * UTILITY FUNCTIONS OVERVIEW:
 *
 * 1. Palindrome Detection:
 *    - isPalindrome(): Checks if a sequence is a palindrome
 *    - findLongestPalindromeManacher(): Uses Manacher's algorithm to find the longest palindrome
 *    - findLongestPalindromeBruteForce(): Fallback method using brute force approach
 *
 * 2. Sequence Generation:
 *    - generateRandomSequence(): Creates a random color sequence with at least one palindrome
 *    - COLORS: Array of available colors for the game
 *
 * HOW TO MODIFY:
 *
 * 1. To change available colors:
 *    - Modify the COLORS array below
 *    - Each color needs a name and a value (hex code)
 *
 * 2. To adjust sequence generation difficulty:
 *    - Modify the generateRandomSequence() function
 *    - Change the min/max length parameters
 *    - Adjust the difficultyFactor calculation
 *    - Change the palindrome length or positioning
 *
 * 3. To optimize palindrome detection:
 *    - The current implementation uses Manacher's algorithm (O(n) time complexity)
 *    - A brute force approach is available as fallback (O(n³) time complexity)
 *    - You can optimize the Manacher's algorithm implementation if needed
 *
 * EXAMPLE MODIFICATIONS:
 *
 * 1. To add a new color:
 *    - Add a new entry to the COLORS array: { name: "pink", value: "#FFC0CB" }
 *
 * 2. To make sequences easier:
 *    - In generateRandomSequence(), reduce the difficultyFactor
 *    - Increase the palindrome length relative to the sequence length
 *
 * 3. To make sequences harder:
 *    - In generateRandomSequence(), increase the difficultyFactor
 *    - Add more noise to the sequence
 *    - Make palindromes shorter or less obvious
 */

// Define available colors
export const COLORS = [
  { name: 'black', value: '#000000' },
  { name: 'red', value: '#FF0000' },
  { name: 'blue', value: '#0000FF' },
  { name: 'green', value: '#00FF00' },
  { name: 'yellow', value: '#FFFF00' },
  { name: 'purple', value: '#800080' },
  { name: 'orange', value: '#FFA500' },
  { name: 'white', value: '#FFFFFF' },
]

/**
 * Implementation of Manacher's Algorithm to find the longest palindromic substring
 * This algorithm runs in O(n) time complexity, making it much more efficient than
 * the brute force approach which runs in O(n²) time.
 *
 * HOW IT WORKS:
 * 1. Transform the input by adding special markers between elements
 * 2. Initialize an array to track palindrome lengths at each position
 * 3. Use previously computed results to avoid redundant comparisons
 * 4. Expand around centers to find palindromes
 * 5. Return the longest palindrome found
 *
 * FALLBACK MECHANISM:
 * - If this algorithm fails for any reason, the code will fall back to the brute force approach
 * - This ensures the game always finds a palindrome, even if the optimized algorithm encounters an edge case
 * - The fallback is implemented in the findOptimalPalindrome function in game-utils.ts
 *
 * @param colors Array of color strings
 * @returns Object containing the start index and length of the longest palindrome
 */
export function findLongestPalindromeManacher(colors: string[]): {
  start: number
  length: number
} {
  const n = colors.length
  if (n === 0) return { start: 0, length: 0 }
  if (n === 1) return { start: 0, length: 1 }

  // Step 1: Transform the input array
  // We insert special markers (null) between each element and at the boundaries
  // This handles both odd and even length palindromes uniformly
  const transformed: (string | null)[] = [null]
  for (let i = 0; i < n; i++) {
    transformed.push(colors[i])
    transformed.push(null)
  }
  const len = transformed.length

  // Step 2: Initialize the palindrome length array (P)
  // P[i] represents the length of the palindrome centered at position i
  const P: number[] = new Array(len).fill(0)

  // Step 3: Find all palindromes
  let center = 0 // Current center of palindrome
  let right = 0 // Right boundary of current palindrome

  for (let i = 1; i < len - 1; i++) {
    // Step 3a: Use symmetry to avoid redundant comparisons
    // If i is within the current palindrome, we can use the mirror value
    if (right > i) {
      // Mirror of i with respect to center
      const mirror = 2 * center - i

      // Take the minimum of the mirror's palindrome length and the distance to right boundary
      // This is a key optimization in Manacher's algorithm
      P[i] = Math.min(right - i, P[mirror])
    }

    // Step 3b: Expand around center i
    // Try to expand the palindrome centered at position i
    // We start from the current known length (which might be 0 or derived from the mirror)
    let a = i + (1 + P[i])
    let b = i - (1 + P[i])

    // Expand as long as we're within bounds and elements match
    while (a < len && b >= 0 && transformed[a] === transformed[b]) {
      P[i]++
      a++
      b--
    }

    // Step 3c: Update center and right boundary if needed
    // If this palindrome extends beyond the current right boundary,
    // update the center and right boundary
    if (i + P[i] > right) {
      center = i
      right = i + P[i]
    }
  }

  // Step 4: Find the maximum palindrome length and its center
  let maxLen = 0
  let centerIndex = 0

  for (let i = 1; i < len - 1; i++) {
    if (P[i] > maxLen) {
      maxLen = P[i]
      centerIndex = i
    }
  }

  // Step 5: Convert back to original array indices
  // The start position in the original array is (centerIndex - maxLen) / 2
  // because each position in the original array corresponds to 2 positions in the transformed array
  const start = Math.floor((centerIndex - maxLen) / 2)

  // The length in the original array is maxLen
  // (we need to handle both odd and even length palindromes)
  return { start, length: maxLen }
}

/**
 * Brute force approach to find the longest palindromic substring
 * This is a fallback method that's guaranteed to work
 * Time complexity: O(n³) where n is the length of the array
 *
 * HOW IT WORKS:
 * 1. Check all possible substrings of the input array
 * 2. For each substring, verify if it's a palindrome
 * 3. Keep track of the longest palindrome found
 *
 * FALLBACK USAGE:
 * - This function is used as a fallback when Manacher's algorithm fails
 * - While less efficient, it's more robust for handling edge cases
 * - The game will automatically switch to this method if needed
 * - This ensures the game always finds a valid palindrome
 *
 * @param colors Array of color strings
 * @returns Object containing the start index and length of the longest palindrome
 */
export function findLongestPalindromeBruteForce(colors: string[]): {
  start: number
  length: number
} {
  const n = colors.length
  if (n === 0) return { start: 0, length: 0 }
  if (n === 1) return { start: 0, length: 1 }

  let maxLength = 1
  let start = 0

  // Check all possible substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let isPal = true

      // Check if substring colors[i..j] is palindrome
      for (let k = 0; k < (j - i + 1) / 2; k++) {
        if (colors[i + k] !== colors[j - k]) {
          isPal = false
          break
        }
      }

      // If palindrome and longer than current max
      if (isPal && j - i + 1 > maxLength) {
        maxLength = j - i + 1
        start = i
      }
    }
  }

  return { start, length: maxLength }
}

/**
 * Function to check if a subsequence is a palindrome
 * Time complexity: O(n) where n is the length of the array
 *
 * @param colors Array of color strings
 * @returns Boolean indicating if the sequence is a palindrome
 */
export function isPalindrome(colors: string[]): boolean {
  if (colors.length <= 1) return true

  for (let i = 0; i < Math.floor(colors.length / 2); i++) {
    if (colors[i] !== colors[colors.length - 1 - i]) {
      return false
    }
  }

  return true
}

/**
 * Function to generate a random color sequence with at least one palindrome
 * @param minLength Minimum length of the sequence
 * @param maxLength Maximum length of the sequence
 * @param turnCount Current turn count (affects difficulty)
 * @returns Array of color strings
 */
export function generateRandomSequence(
  minLength: number,
  maxLength: number,
  turnCount: number
): string[] {
  // Increase difficulty with turn count
  const difficultyFactor = Math.min(5, Math.floor(turnCount / 3))
  const min = Math.max(5, minLength + difficultyFactor)
  const max = Math.max(min, maxLength + difficultyFactor)

  // Randomly determine the length of the sequence
  const length = Math.floor(Math.random() * (max - min + 1)) + min

  // Generate a random sequence
  const colors: string[] = []
  for (let i = 0; i < length; i++) {
    colors.push(COLORS[Math.floor(Math.random() * COLORS.length)].name)
  }

  // Ensure there's at least one palindrome of length 5 or more
  // As difficulty increases, make the palindrome harder to spot
  const palindromeLength = Math.min(7, Math.max(5, Math.floor(length / 2)))
  const palindromeStart = Math.floor(
    Math.random() * (length - palindromeLength)
  )

  // Create a palindrome within the sequence
  for (let i = 0; i < Math.floor(palindromeLength / 2); i++) {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)].name
    colors[palindromeStart + i] = randomColor
    colors[palindromeStart + palindromeLength - 1 - i] = randomColor
  }

  // For higher difficulty, add more noise
  if (difficultyFactor > 2) {
    // Add some similar colors to confuse the player
    for (let i = 0; i < difficultyFactor; i++) {
      const randomIndex = Math.floor(Math.random() * length)
      if (
        randomIndex !== palindromeStart &&
        randomIndex !== palindromeStart + palindromeLength - 1
      ) {
        colors[randomIndex] = colors[Math.floor(Math.random() * length)]
      }
    }
  }

  return colors
}
