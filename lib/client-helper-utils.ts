import { GAME_CONFIG } from '@/app/page'
import { responseToEnemy } from './dialog-text'
import { ResponseOption } from './game-types'
import { findOptimalPalindrome, getGuardianDialog } from './game-utils'
import { isPalindrome } from './palindrome-utils'

// helper function for the toggleBlockSelection function on the main page
export function gettoggleBlockSelection(
  index: number,
  gameState: string,
  selectedIndices: number[],
  setSelectedIndices: (newSelection: number[]) => void,
  setGameText: (message: string) => void
) {
  if (gameState !== 'userTurn') return

  const currentSelection = [...selectedIndices]
  const position = currentSelection.indexOf(index)

  if (position === -1) {
    // Adding a new block
    if (
      currentSelection.length === 0 ||
      currentSelection.includes(index - 1) ||
      currentSelection.includes(index + 1)
    ) {
      setSelectedIndices([...currentSelection, index].sort((a, b) => a - b))
    } else {
      setGameText('Selections must be continuous! Select adjacent blocks only.')
    }
  } else {
    // Removing a block, ensuring continuity
    if (
      index === currentSelection[0] ||
      index === currentSelection[currentSelection.length - 1]
    ) {
      const newSelection = [...currentSelection]
      newSelection.splice(position, 1)
      setSelectedIndices(newSelection)
    } else {
      setGameText(
        'You can only remove blocks from the ends to maintain continuity.'
      )
    }
  }
}
//helper function for the get response options on the main component
export const fetchresponseOptions = (turnCount: number): ResponseOption[] => {
  switch (turnCount) {
    case 0:
      return responseToEnemy.firstRound
    case 1:
      return responseToEnemy.secondRound
    case 2:
      return responseToEnemy.thirdRound
    case 3:
      return responseToEnemy.fourthRound
    case 4:
      return responseToEnemy.fifthRound
    case 5:
    default:
      return responseToEnemy.default
  }
}

// helper function for the color sequence UseEffect
export const determineOptimalPalindrome = (sequence: string[]) => {
  try {
    const longest = findOptimalPalindrome(sequence)

    // Validate the palindrome result
    if (longest.length > 0 && isPalindrome(longest.sequence)) {
      return longest
    } else {
      console.error('Invalid palindrome result:', longest)
      return {
        start: 0,
        length: 1,
        sequence: [sequence[0]],
      }
    }
  } catch (error) {
    console.error('Error finding optimal palindrome:', error)
    return {
      start: 0,
      length: 1,
      sequence: [sequence[0]],
    }
  }
}

export const determineSelectionisContinuous = (
  selectedIndices: number[]
): boolean => {
  if (selectedIndices.length <= 1) return true

  // Sort the indices first
  const sortedIndices = [...selectedIndices].sort((a, b) => a - b)

  // Check if each index is exactly one more than the previous
  for (let i = 1; i < sortedIndices.length; i++) {
    if (sortedIndices[i] !== sortedIndices[i - 1] + 1) {
      return false
    }
  }

  return true
}

/*
THIS SECTION IS FOR THE HANDLE TALK FUNCTION
*/
export const generateTalkDialog = (
  gameState: string,
  hasTalkedThisRound: boolean,
  npcName: string,
  enemyStats: { amiability: number },
  turnCount: number
) => {
  // Handle home dialog
  if (gameState === 'home') {
    return {
      title: 'Your Thoughts',
      content: [
        `You reflect on your encounter with  ${npcName}.`,
        'The patterns of colors and palindromes seem to hold deeper meaning.',
        'Perhaps with more practice, you can master this ancient art.',
      ],
      isHomeDialog: true,
    }
  }

  // Prevent talking if not idle or already talked
  if (gameState !== 'idle' || hasTalkedThisRound) return null

  // Determine NPC name based on amiability
  let updatedNpcName = 'Friendly Guardian'
  if (enemyStats.amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.HOSTILE) {
    updatedNpcName = 'Hostile Guardian'
  } else if (
    enemyStats.amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
  ) {
    updatedNpcName = 'Ancient Guardian'
  }

  return {
    title: updatedNpcName,
    content: getGuardianDialog(turnCount, enemyStats.amiability),
    responseOptions: fetchresponseOptions(turnCount),
    healing:
      enemyStats.amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.HOSTILE
        ? null // No healing
        : enemyStats.amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
        ? { mp: 8 } // Restore MP
        : { hp: 10, mp: 10 }, // Restore HP & MP
  }
}

/*
THIS SECTION IS FOR THE HANDLE MAGIC FUNCTION
*/
export const performMagicAction = (
  gameState: string,
  stats: { mp: number },
  GAME_CONFIG: { MAGIC_COST: number },
  optimalPalindrome: { start: number; length: number },
  currentColorSequence: string[]
): { success: boolean; message: string; selectedIndices?: number[] } => {
  // Check if the player has enough MP to cast the spell
  if (gameState !== 'userTurn' || stats.mp < GAME_CONFIG.MAGIC_COST) {
    return {
      success: false,
      message: `You don't have enough MP to cast this spell! (Requires ${GAME_CONFIG.MAGIC_COST} MP)`,
    }
  }

  // Select the optimal palindrome indices
  const indices = []
  for (
    let i = optimalPalindrome.start;
    i < optimalPalindrome.start + optimalPalindrome.length;
    i++
  ) {
    indices.push(i)
  }

  // Verify that the selected indices form a palindrome
  const selectedColors = indices.map((index) => currentColorSequence[index])
  if (isPalindrome(selectedColors)) {
    return {
      success: true,
      message: `You cast a spell of revelation! The optimal palindrome of length ${optimalPalindrome.length} is now visible.`,
      selectedIndices: indices,
    }
  } else {
    return {
      success: false,
      message:
        'You cast a spell of revelation, but the magic seems to flicker. Try selecting the palindrome yourself.',
    }
  }
}
