'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Heart,
  Sword,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  HomeIcon,
  Info,
  Github,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { GameDialog } from '@/components/modals/game-dialog'
import { DialogWithInput } from '@/components/modals/dialog-with-input'
import { TutorialTransition } from '@/components/tutorial/tutorial-transition'
import { ModeToggle } from '@/components/nav/mode-toggle'

// Import types, utilities, and constants
import type {
  GameState,
  CharacterStats,
  EnemyStats,
  ResponseOption,
} from '@/lib/game-types'
import {
  COLORS,
  isPalindrome,
  generateRandomSequence,
} from '@/lib/palindrome-utils'
import {
  getGuardianDialog,
  calculateAmiabilityChange,
  findOptimalPalindrome,
  userFoundOptimalPalindrome,
  calculateDamage,
  canAccessHome,
  getHomeAccessMessage,
} from '@/lib/game-utils'

/**
 * RPGThree - Palindrome Guardian Game
 *
 * CUSTOMIZATION GUIDE:
 *
 * 1. CHANGING IMAGES:
 *    - Replace placeholder images by modifying the src attributes in Image components
 *    - For Guardian images: Update the conditional src in the "Enemy" section
 *    - For character images: Update the conditional src in the "Character" section
 *    - For home/temple backgrounds: Update the src in the Game Screen Background section
 *
 * 2. MODIFYING DIALOG SYSTEM:
 *    - To change dialog content: Edit the guardianDialogs array in game-utils.ts
 *    - To change response options: Modify the getResponseOptions function below
 *    - To change dialog appearance: Edit the DialogWithInput component
 *    - To add new dialog triggers: Create new handler functions similar to handleTalk()
 *
 * 3. GAME BALANCE:
 *    - Adjust GAME_CONFIG values at the top of this file to change:
 *      - MAX_TURNS: Number of turns before game end
 *      - AMIABILITY_THRESHOLDS: When Guardian becomes hostile/friendly
 *      - MAGIC_COST: MP cost for using magic
 *      - REST_HEALING: HP/MP restored when resting
 *
 * 4. ADDING NEW FEATURES:
 *    - Add new game states to the GameState type in game-types.ts
 *    - Add new UI elements by creating components in the components directory
 *    - Add new game mechanics by creating functions in game-utils.ts
 *
 * 5. VISUAL CUSTOMIZATION:
 *    - Modify the CSS classes and Tailwind styles throughout the component
 *    - Change colors by updating the color values in tailwind.config.js
 *    - Add animations by defining new keyframes in the style tag at the bottom
 */

// GAME CONFIGURATION
// ------------------
// You can modify these values to change the game's behavior

/**
 * GAME CONFIGURATION PARAMETERS
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
const GAME_CONFIG = {
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

// AnimatedWord component (example)
const AnimatedWord = ({
  word,
  animation,
  staggerDelay,
}: {
  word: string
  animation: string
  staggerDelay: number
}) => {
  return (
    <div className="flex">
      {word.split('').map((letter, index) => (
        <span
          key={index}
          style={{ animationDelay: `${index * staggerDelay}ms` }}
          className={`animate-${animation}`}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}

export default function RPGThreePage() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('tutorial')
  const [gameText, setGameText] = useState(
    'Welcome to the Color Palindrome Battle!'
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputDialogOpen, setInputDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<string[]>([])
  const [dialogTitle, setDialogTitle] = useState('')
  const [npcName, setNpcName] = useState('Ancient Guardian')
  const [tutorialComplete, setTutorialComplete] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const [finalBattle, setFinalBattle] = useState(false)
  const [readingBook, setReadingBook] = useState(false)
  const [hasTalkedThisRound, setHasTalkedThisRound] = useState(false)
  const [hasRestedThisTurn, setHasRestedThisTurn] = useState(false)
  const [homeAccessModal, setHomeAccessModal] = useState(false)
  const [canGoHome, setCanGoHome] = useState(false)
  const [homePromptShown, setHomePromptShown] = useState(false)
  const [responseOptions, setResponseOptions] = useState<ResponseOption[]>([])
  // Add state to track if user has submitted their selection this turn
  const [hasSubmittedThisTurn, setHasSubmittedThisTurn] = useState(false)

  // Add state for amiability change indicator
  const [amiabilityChangeIndicator, setAmiabilityChangeIndicator] = useState(0)

  // Character stats
  const [stats, setStats] = useState<CharacterStats>({
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
  })

  // Enemy stats
  const [enemyStats, setEnemyStats] = useState<EnemyStats>({
    hp: 100,
    maxHp: 100,
    amiability: 50, // 0-100 scale, 0 is hostile, 100 is friendly
  })

  // Color sequence state
  const [currentColorSequence, setCurrentColorSequence] = useState<string[]>([])
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [optimalPalindrome, setOptimalPalindrome] = useState<{
    start: number
    length: number
    sequence: string[]
  }>({
    start: 0,
    length: 0,
    sequence: [],
  })
  const [showOptimalPalindrome, setShowOptimalPalindrome] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const { MAX_TURNS } = GAME_CONFIG // Game ends after this many turns

  // Initialize with a random sequence
  useEffect(() => {
    if (
      gameState !== 'tutorial' &&
      gameState !== 'home' &&
      currentColorSequence.length === 0
    ) {
      generateNewSequence()
    }
  }, [gameState, currentColorSequence.length])

  // Check if home is accessible whenever game state or amiability changes
  useEffect(() => {
    const homeAccess = canAccessHome(gameState, enemyStats.amiability)

    // If home just became accessible and we haven't shown the prompt yet
    if (homeAccess && !canGoHome && !homePromptShown && gameState !== 'home') {
      setDialogTitle('Ancient Guardian')
      setDialogContent([
        'You have earned my respect, traveler.',
        'You may return to your home if you wish.',
        'You are welcome to continue our challenges, or rest and return later.',
      ])
      setDialogOpen(true)
      setHomePromptShown(true)
    }

    setCanGoHome(homeAccess)
  }, [gameState, enemyStats.amiability, canGoHome, homePromptShown])

  // Find the longest palindrome whenever the sequence changes
  useEffect(() => {
    if (currentColorSequence.length > 0) {
      try {
        const longest = findOptimalPalindrome(currentColorSequence)

        // Verify that the result is valid
        if (longest.length > 0 && isPalindrome(longest.sequence)) {
          setOptimalPalindrome(longest)
        } else {
          console.error('Invalid palindrome result:', longest)
          // Set a fallback palindrome (first element)
          setOptimalPalindrome({
            start: 0,
            length: 1,
            sequence: [currentColorSequence[0]],
          })
        }
      } catch (error) {
        console.error('Error finding optimal palindrome:', error)
        // Set a fallback palindrome (first element)
        setOptimalPalindrome({
          start: 0,
          length: 1,
          sequence: [currentColorSequence[0]],
        })
      }
    }
  }, [currentColorSequence])

  // Generate a new color sequence
  const generateNewSequence = () => {
    const newSequence = generateRandomSequence(5, 12, turnCount)
    setCurrentColorSequence(newSequence)
    setSelectedIndices([])
    setShowOptimalPalindrome(false)
    setHasSubmittedThisTurn(false) // Reset submission state for new sequence
  }

  // Handle tutorial completion
  const handleTutorialComplete = () => {
    setTutorialComplete(true)
    setGameState('idle')
    generateNewSequence()
    setGameText(
      'The Ancient Guardian awaits your challenge. Prepare your strategy!'
    )
  }

  /**
   * Generate response options based on current turn
   *
   * HOW TO EDIT DIALOG OPTIONS:
   * 1. This function returns different dialog options for each turn (0-5)
   * 2. Each option has:
   *    - text: The actual response text shown to the player
   *    - type: 'positive' or 'negative' (affects styling and amiability)
   * 3. To change dialog options:
   *    - Find the case for the turn you want to modify (case 0 for turn 1, etc.)
   *    - Edit the text for each response option
   *    - Make sure to keep some options 'positive' and some options 'negative'
   * 4. To add more options:
   *    - Add more objects to the array for each turn
   *    - Each turn can have a different number of options
   *
   * EXAMPLE:
   * To change the first turn's first positive option:
   * case 0:
   *   return [
   *     { text: "YOUR NEW TEXT HERE", type: 'positive' },
   *     ...rest of options
   *   ];
   */
  const getResponseOptions = (turnCount: number): ResponseOption[] => {
    // Different dialog options for each round
    switch (turnCount) {
      case 0: // First round dialog options
        return [
          {
            text: 'I seek to understand the balance of these patterns.',
            type: 'positive',
          },
          {
            text: 'I need to learn more about this symmetry.',
            type: 'positive',
          },
          {
            text: 'I demand to know the power behind these colors!',
            type: 'negative',
          },
          { text: "I'll take whatever knowledge I can get.", type: 'negative' },
        ]
      case 1: // Second round dialog options
        return [
          {
            text: "Your wisdom is appreciated. I'm here to learn.",
            type: 'positive',
          },
          {
            text: 'The patterns have a certain beauty to them.',
            type: 'positive',
          },
          {
            text: 'This is taking too long. I need results quickly.',
            type: 'negative',
          },
          {
            text: 'Just tell me how to master these patterns.',
            type: 'negative',
          },
        ]
      case 2: // Third round dialog options
        return [
          {
            text: "I'm beginning to see the harmony in these sequences.",
            type: 'positive',
          },
          {
            text: 'Patience reveals the true nature of palindromes.',
            type: 'positive',
          },
          {
            text: "I'll control these patterns with enough practice.",
            type: 'negative',
          },
          {
            text: 'How can I use this power for my own benefit?',
            type: 'negative',
          },
        ]
      case 3: // Fourth round dialog options
        return [
          {
            text: 'The balance of colors speaks to something deeper.',
            type: 'positive',
          },
          {
            text: 'I respect the ancient knowledge you protect.',
            type: 'positive',
          },
          {
            text: 'I will dominate these challenges eventually.',
            type: 'negative',
          },
          {
            text: 'These tests are merely obstacles to overcome.',
            type: 'negative',
          },
        ]
      case 4: // Fifth round dialog options
        return [
          {
            text: 'We can learn from each other through these challenges.',
            type: 'positive',
          },
          {
            text: 'The journey itself brings understanding.',
            type: 'positive',
          },
          {
            text: "I've come too far to fail now. I will succeed.",
            type: 'negative',
          },
          {
            text: 'The power of these patterns will be mine.',
            type: 'negative',
          },
        ]
      case 5: // Sixth round dialog options
      default:
        return [
          {
            text: 'Thank you for sharing this ancient wisdom with me.',
            type: 'positive',
          },
          {
            text: 'The harmony of palindromes reflects the balance of all things.',
            type: 'positive',
          },
          {
            text: "I've mastered your challenges. What's next?",
            type: 'negative',
          },
          {
            text: "Now I'll show you the true meaning of power.",
            type: 'negative',
          },
        ]
    }
  }

  // Start a new turn
  const startTurn = () => {
    if (gameState !== 'idle') return

    setGameState('userTurn')
    setSelectedIndices([])
    setShowOptimalPalindrome(false)
    setGameText(
      `Turn ${
        turnCount + 1
      }: Select a palindromic sequence of colors to defend yourself!`
    )
    setTurnCount((prev) => prev + 1)
    setHasTalkedThisRound(false) // Reset the talk state for the new round
    setHasRestedThisTurn(false) // Reset the resting state for the new turn
    setHasSubmittedThisTurn(false) // Reset the submission state for the new turn
  }

  // Handle block selection
  const toggleBlockSelection = (index: number) => {
    if (gameState !== 'userTurn') return

    setSelectedIndices((prev) => {
      const newSelection = [...prev]
      const position = newSelection.indexOf(index)

      if (position === -1) {
        // Add to selection
        newSelection.push(index)
      } else {
        // Remove from selection
        newSelection.splice(position, 1)
      }

      // Sort indices to maintain order
      return newSelection.sort((a, b) => a - b)
    })
  }

  // Check if selected blocks form a continuous sequence
  const isSelectionContinuous = () => {
    if (selectedIndices.length <= 1) return true

    for (let i = 1; i < selectedIndices.length; i++) {
      if (selectedIndices[i] !== selectedIndices[i - 1] + 1) {
        return false
      }
    }

    return true
  }

  // Get the selected color sequence
  const getSelectedColors = () => {
    return selectedIndices.map((index) => currentColorSequence[index])
  }

  // Submit the user's selection
  const submitSelection = () => {
    // Check if user has already submitted this turn
    if (hasSubmittedThisTurn) {
      setGameText("You've already submitted your selection for this turn!")
      return
    }

    if (
      (gameState !== 'userTurn' && !finalBattle) ||
      selectedIndices.length === 0
    )
      return

    const selectedColors = getSelectedColors()
    const isContinuous = isSelectionContinuous()
    const isPalindromic = isPalindrome(selectedColors)

    if (!isContinuous) {
      setGameText('Your selection must be continuous! Try again.')
      return
    }

    if (!isPalindromic) {
      setGameText('Your selection is not a palindrome! Try again.')
      return
    }

    // Mark that user has submitted this turn
    setHasSubmittedThisTurn(true)

    // Compare with the optimal palindrome
    const userPalindromeLength = selectedIndices.length
    const optimalPalindromeLength = optimalPalindrome.length
    const userOptimal = userFoundOptimalPalindrome(
      selectedIndices,
      optimalPalindrome
    )

    if (finalBattle) {
      // Final battle logic
      if (!userOptimal) {
        // User failed the final challenge
        setGameText(
          `You found a palindrome of length ${userPalindromeLength}, but the optimal one was length ${optimalPalindromeLength}. The Guardian defeats you!`
        )
        // Immediately set game state to game over
        setGameState('gameOver')
        setDialogTitle('Defeat')
        setDialogContent([
          'You have failed the final challenge.',
          'The Ancient Guardian has bested you in the battle of palindromes.',
          'Perhaps with more practice, you can return and challenge it again.',
        ])
        setDialogOpen(true)
        return // Exit early
      } else {
        // User won the final challenge
        setGameText(
          `Excellent! You found the optimal palindrome of length ${userPalindromeLength}! The Guardian is impressed!`
        )
        // Immediately set victory state
        setGameState('victory')
        setDialogTitle('Victory')
        setDialogContent([
          'You have proven yourself worthy in the final challenge!',
          'The Ancient Guardian grants you passage and shares its ancient knowledge with you.',
          'Your name shall be recorded in the annals of palindrome masters!',
        ])
        setDialogOpen(true)
        return // Exit early
      }
    }

    if (!userOptimal) {
      // User didn't find the optimal solution
      setGameText(
        `You found a palindrome of length ${userPalindromeLength}, but there was a better one of length ${optimalPalindromeLength}!`
      )
      setShowOptimalPalindrome(true)
    } else {
      // User found the optimal solution
      setGameText(
        `Excellent! You found the optimal palindrome of length ${userPalindromeLength}!`
      )
      // Note: Removed the amiability increase that was here previously
    }

    // Move to enemy turn
    setTimeout(() => {
      setGameState('enemyTurn')
      enemyTurn()
    }, 2000)
  }

  // Handle the enemy's turn
  const enemyTurn = () => {
    setGameText('The Ancient Guardian is considering its next move...')

    // Show the optimal palindrome
    setShowOptimalPalindrome(true)

    setTimeout(() => {
      // Enemy always chooses the optimal palindrome
      const enemyPalindromeLength = optimalPalindrome.length

      setGameText(
        `The Ancient Guardian identifies a palindrome of length ${enemyPalindromeLength}!`
      )

      // Check if the user found the optimal palindrome
      const userOptimal = userFoundOptimalPalindrome(
        selectedIndices,
        optimalPalindrome
      )

      setTimeout(() => {
        if (userOptimal) {
          // User found the optimal palindrome, no damage
          setGameText(
            `You found the optimal palindrome! The Ancient Guardian's attack has no effect on you this turn.`
          )
        } else {
          // Deal damage to the player based on the palindrome length difference and turn count
          const damage = calculateDamage(
            enemyPalindromeLength,
            selectedIndices.length,
            turnCount
          )

          setStats((prev) => ({
            ...prev,
            hp: Math.max(0, prev.hp - damage),
          }))

          setGameText(
            `The Ancient Guardian attacks with a palindrome of length ${enemyPalindromeLength}! You take ${damage} damage.`
          )
        }

        // Check if game over
        if (stats.hp <= 0) {
          // Immediately set game state to game over
          setGameState('gameOver')
          setGameText('You have been defeated by the Ancient Guardian!')
          setDialogTitle('Defeat')
          setDialogContent([
            'The Ancient Guardian has bested you in the battle of palindromes.',
            'Perhaps with more practice, you can return and challenge it again.',
            'Remember: The key is to find the longest palindromic sequence!',
          ])
          setDialogOpen(true)
          return // Exit the function early
        } else if (turnCount >= MAX_TURNS) {
          // Final confrontation
          if (
            enemyStats.amiability >= GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
          ) {
            // Good relationship - automatic win
            setGameState('victory')
            setGameText(
              'The Ancient Guardian seems impressed with your skills and friendly demeanor!'
            )
            setDialogTitle('Victory')
            setDialogContent([
              'You have proven yourself worthy, both in skill and character.',
              'I shall grant you passage and share my knowledge with you.',
              'Few have earned my respect as you have. You may return home safely.',
            ])
            setDialogOpen(true)
          } else {
            // Bad relationship - final challenge
            setGameText(
              "The Ancient Guardian seems unimpressed. 'One final test to prove your worth!'"
            )
            setDialogTitle('Final Challenge')
            setDialogContent([
              'You have shown skill, but your attitude leaves much to be desired.',
              'I shall give you one final challenge. Find the optimal palindrome in this sequence.',
              'Succeed, and you may leave. Fail, and you shall remain here forever!',
            ])
            setDialogOpen(true)
            setFinalBattle(true)
            generateNewSequence() // Generate a final, difficult sequence
            setGameState('userTurn') // Ensure the game state is set to userTurn for the final battle
          }
        } else {
          // Continue to next turn
          setTimeout(() => {
            generateNewSequence()
            setGameState('idle')
            setGameText(
              `Round ${turnCount} complete. Talk to the Guardian before starting the next round! Click the Talk button to interact.`
            )
          }, 1500)
        }
      }, 1500)
    }, 1500)
  }

  // Update the handleTalk function to use different dialog for each turn
  const handleTalk = () => {
    if (gameState === 'home') {
      // Talk action when at home
      setDialogTitle('Your Thoughts')
      setDialogContent([
        'You reflect on your encounter with the Ancient Guardian.',
        'The patterns of colors and palindromes seem to hold deeper meaning.',
        'Perhaps with more practice, you can master this ancient art.',
      ])
      setDialogOpen(true)
      return
    }

    if (gameState !== 'idle' || hasTalkedThisRound) return

    if (enemyStats.amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.HOSTILE) {
      setNpcName('Hostile Guardian')
    } else if (
      enemyStats.amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
    ) {
      setNpcName('Ancient Guardian')
    } else {
      setNpcName('Friendly Guardian')
    }
    setDialogTitle(npcName)

    // Get dialog based on turn count and amiability
    const currentDialog = getGuardianDialog(turnCount, enemyStats.amiability)
    setDialogContent(currentDialog)

    // Generate response options based on current turn
    setResponseOptions(getResponseOptions(turnCount))

    // Determine healing based on amiability
    if (enemyStats.amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.HOSTILE) {
      // No healing for low amiability
    } else if (
      enemyStats.amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
    ) {
      // Restore a small amount of MP for medium amiability
      setStats((prev) => ({
        ...prev,
        mp: Math.min(prev.maxMp, prev.mp + 8),
      }))
    } else {
      // Restore small HP and MP for high amiability
      setStats((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + 10),
        mp: Math.min(prev.maxMp, prev.mp + 10),
      }))
    }

    setInputDialogOpen(true)
    setHasTalkedThisRound(true) // Mark that the player has talked this round
  }

  // Handle user response to dialog
  const handleDialogResponse = (response: string) => {
    // Calculate amiability change based on response
    const amiabilityChange = calculateAmiabilityChange(response, turnCount)

    // Update amiability with the calculated change
    setEnemyStats((prev) => ({
      ...prev,
      amiability: Math.max(
        0,
        Math.min(100, prev.amiability + amiabilityChange)
      ),
    }))

    // Set the amiability change indicator
    setAmiabilityChangeIndicator(amiabilityChange)

    // Clear the indicator after a delay
    setTimeout(() => {
      setAmiabilityChangeIndicator(0)
    }, 2000)

    // More obvious and dramatic responses based on amiability change
    if (amiabilityChange > 15) {
      setGameText(
        "The Ancient Guardian's eyes glow with a warm light. Your words have clearly pleased it greatly!"
      )
    } else if (amiabilityChange > 8) {
      setGameText(
        'The Ancient Guardian nods with approval. A subtle warmth enters its otherwise stoic expression.'
      )
    } else if (amiabilityChange > 0) {
      setGameText('The Ancient Guardian seems mildly pleased by your words.')
    } else if (amiabilityChange < -15) {
      setGameText(
        "The Ancient Guardian's eyes flash with anger! The air around you grows ice cold. It is clearly displeased."
      )
    } else if (amiabilityChange < -8) {
      setGameText(
        "The Ancient Guardian's gaze hardens. You sense strong disapproval emanating from its ancient presence."
      )
    } else if (amiabilityChange < 0) {
      setGameText('The Ancient Guardian seems irritated by your words.')
    } else {
      setGameText(
        'The Ancient Guardian acknowledges your words with an enigmatic tilt of its head.'
      )
    }

    // Add additional feedback about amiability change immediately
    if (amiabilityChange > 0) {
      setGameText(
        (prev) => `${prev} [Amiability +${amiabilityChange.toFixed(1)}]`
      )
    } else if (amiabilityChange < 0) {
      setGameText(
        (prev) => `${prev} [Amiability ${amiabilityChange.toFixed(1)}]`
      )
    }

    setInputDialogOpen(false)
  }

  // Handle name submission
  const handleNameSubmit = (name: string) => {
    setPlayerName(name)
    setShowNameInput(false)

    // Show victory dialog
    setGameState('victory')
    setDialogTitle('Victory')
    setDialogContent([
      `Congratulations, ${name}!`,
      'You have proven yourself worthy in the battle of palindromes.',
      'The Ancient Guardian grants you passage and shares its ancient knowledge with you.',
      'Your name shall be recorded in the annals of palindrome masters!',
    ])
    setDialogOpen(true)
  }

  // Check home access and either go home or show modal
  const checkHomeAccess = () => {
    if (canAccessHome(gameState, enemyStats.amiability)) {
      goHome()
    } else {
      setHomeAccessModal(true)
    }
  }

  // Go home (only available after victory or good relationship)
  const goHome = () => {
    setGameState('home')
    setGameText(
      'You have returned home safely. You can rest, read, or reflect on your journey.'
    )
    setCurrentColorSequence([])
    setHomeAccessModal(false)
  }

  // Return to temple
  const returnToTemple = () => {
    if (gameState !== 'home') return

    setGameState('idle')
    generateNewSequence()
    setGameText(
      'You have returned to the Ancient Temple. The Guardian acknowledges your presence.'
    )
  }

  // Handle rest action (when at home)
  const handleRest = () => {
    if (hasRestedThisTurn) {
      setGameText(
        'You have already rested during this turn. You must face the Guardian again before resting.'
      )
      return
    }

    setGameText('You rest and recover some HP and MP.')
    setStats((prev) => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + GAME_CONFIG.REST_HEALING.HP),
      mp: Math.min(prev.maxMp, prev.mp + GAME_CONFIG.REST_HEALING.MP),
    }))
    setHasRestedThisTurn(true)
  }

  // Handle read action (when at home)
  const handleRead = () => {
    setReadingBook(true)
  }

  // Handle magic action - now uses the optimal palindrome
  const handleMagic = () => {
    if (gameState !== 'userTurn' || stats.mp < GAME_CONFIG.MAGIC_COST) {
      setGameText(
        `You don't have enough MP to cast this spell! (Requires ${GAME_CONFIG.MAGIC_COST} MP)`
      )
      return
    }

    // Use MP
    setStats((prev) => ({
      ...prev,
      mp: prev.mp - GAME_CONFIG.MAGIC_COST,
    }))

    // Reveal the optimal palindrome
    setShowOptimalPalindrome(true)

    // Select the optimal palindrome
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
      setSelectedIndices(indices)
      setGameText(
        `You cast a spell of revelation! The optimal palindrome of length ${optimalPalindrome.length} is now visible.`
      )
    } else {
      // Fallback if the algorithm somehow failed
      setGameText(
        'You cast a spell of revelation, but the magic seems to flicker. Try selecting the palindrome yourself.'
      )
    }
  }

  const handleHomeModalClose = () => {
    setHomeAccessModal(false)
  }

  // Check if buttons should be disabled based on game state
  const areButtonsDisabled = () => {
    return gameState === 'gameOver' || gameState === 'victory'
  }

  const inputRef = useRef<HTMLInputElement>(null)
  const [userResponse, setUserResponse] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleRespond()
    }
  }

  const handleRespond = () => {
    if (userResponse.trim()) {
      handleDialogResponse(userResponse)
      setUserResponse('')
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center">
            <h1 className="text-lg font-bold">
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Palindrome Guardian
              </span>
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </a>
            <a
              href="https://github.com/yourusername/palindrome-guardian"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <ModeToggle />
          </nav>
        </div>
      </header>

      {/* Add a top margin to account for the fixed header */}
      <div className="mb-16"></div>

      {gameState === 'tutorial' && !tutorialComplete && (
        <TutorialTransition onComplete={handleTutorialComplete} />
      )}

      {showNameInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md rounded-lg border-2 border-primary/30 bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-bold">Victory!</h2>
            <p className="mb-6 text-center">
              You have defeated the Ancient Guardian! Enter your name to record
              your achievement:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter your name"
              />
              <Button
                onClick={() => handleNameSubmit(playerName)}
                disabled={!playerName.trim()}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {homeAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md rounded-lg border-2 border-primary/30 bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-bold">Home Access</h2>
            <p className="mb-6 text-center">
              {getHomeAccessMessage(gameState, enemyStats.amiability, npcName)}
            </p>
            <div className="flex justify-center">
              <Button onClick={handleHomeModalClose}>Understood</Button>
            </div>
          </div>
        </div>
      )}

      {readingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-2xl rounded-lg border-2 border-primary/30 bg-background shadow-lg flex flex-col max-h-[80vh]">
            {/* Fixed header */}
            <div className="border-b p-4">
              <h2 className="text-center text-2xl font-bold">
                The Art of Palindromes
              </h2>
              <h3 className="text-center text-lg font-medium">
                Manacher's Algorithm
              </h3>
            </div>

            {/* Scrollable content area */}
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="space-y-4">
                <p>
                  Manacher's Algorithm is an efficient way to find all
                  palindromic substrings in a sequence. It works in linear time
                  O(n), making it much faster than naive approaches which run in
                  O(n²) or O(n³) time.
                </p>

                <div className="rounded-md bg-muted p-4">
                  <h4 className="mb-2 font-medium">Key Steps:</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <strong>Transform the input:</strong> Insert special
                      markers between each element to handle both odd and even
                      length palindromes uniformly
                    </li>
                    <li>
                      <strong>Initialize arrays:</strong> Create an array to
                      store the length of palindromes centered at each position
                    </li>
                    <li>
                      <strong>Use symmetry:</strong> Leverage the symmetry of
                      palindromes to avoid redundant comparisons
                    </li>
                    <li>
                      <strong>Expand around centers:</strong> For each position,
                      expand outward to find the longest palindrome
                    </li>
                    <li>
                      <strong>Track boundaries:</strong> Maintain a right
                      boundary to optimize the algorithm
                    </li>
                    <li>
                      <strong>Find the maximum:</strong> Identify the longest
                      palindrome from all centers
                    </li>
                  </ol>
                </div>

                <div className="flex justify-center py-2">
                  <AnimatedWord
                    word="RACECAR"
                    animation="fadeIn"
                    staggerDelay={100}
                  />
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  The word "RACECAR" is a perfect palindrome - it reads the same
                  forward and backward.
                </p>

                <div className="rounded-md bg-muted p-4">
                  <h4 className="mb-2 font-medium">Example Walkthrough:</h4>
                  <p className="mb-2">For the sequence "RACECAR":</p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Transform to "#R#A#C#E#C#A#R#" (adding markers)</li>
                    <li>
                      Initialize palindrome length array P =
                      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    </li>
                    <li>For each position, calculate palindrome length:</li>
                    <li>
                      When we reach 'E' (center), we find it's the center of the
                      entire palindrome
                    </li>
                    <li>The algorithm efficiently determines P[center] = 7</li>
                    <li>
                      This corresponds to the full "RACECAR" in the original
                      string
                    </li>
                  </ol>
                </div>

                <p>
                  The brilliance of Manacher's algorithm is that it avoids
                  recalculating palindromes we've already seen. When we find a
                  palindrome, we can use its symmetry to quickly determine
                  palindromes on the other side of the center, making the
                  algorithm run in linear time.
                </p>

                <div className="rounded-md bg-muted p-4">
                  <h4 className="mb-2 font-medium">
                    Time Complexity Analysis:
                  </h4>
                  <p>
                    Despite having nested loops, Manacher's algorithm achieves
                    O(n) time complexity because:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      Each position in the string is the center of at most one
                      expansion
                    </li>
                    <li>
                      The algorithm reuses previous calculations through the
                      mirror property
                    </li>
                    <li>
                      The right boundary only moves forward, never backward
                    </li>
                    <li>Each character is processed at most twice</li>
                  </ul>
                  <p className="mt-2">
                    This makes it dramatically faster than the naive approach,
                    which would check every possible substring (O(n²)) and then
                    verify if each is a palindrome (another O(n)), resulting in
                    O(n³) time complexity.
                  </p>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <h4 className="mb-2 font-medium">Practical Applications:</h4>
                  <p>Palindrome detection has applications in:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Computational biology (DNA sequence analysis)</li>
                    <li>Text processing and pattern matching</li>
                    <li>Natural language processing</li>
                    <li>Data compression algorithms</li>
                    <li>Cryptography and security</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fixed footer */}
            <div className="border-t p-4 flex justify-center">
              <Button onClick={() => setReadingBook(false)}>Close Book</Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl">
        {/* Game Container */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          {/* Main Game Area */}
          <div className="flex flex-col">
            {/* Home/Temple buttons */}
            <div className="mb-2 flex justify-center gap-2">
              <Button
                variant={gameState === 'home' ? 'default' : 'outline'}
                size="sm"
                onClick={checkHomeAccess}
                className={`flex items-center gap-1 rounded-t-md rounded-b-none border-b-0 px-4 py-2 ${
                  canGoHome ? 'border-2 border-primary pulse-border' : ''
                }`}
                disabled={areButtonsDisabled()}
              >
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </Button>
              <Button
                variant={gameState !== 'home' ? 'default' : 'outline'}
                size="sm"
                onClick={returnToTemple}
                disabled={gameState !== 'home' || areButtonsDisabled()}
                className="flex items-center gap-1 rounded-t-md rounded-b-none border-b-0 px-4 py-2"
              >
                Ancient Temple
              </Button>
            </div>

            {/* Game Screen */}
            <Card className="relative overflow-hidden border-2 border-primary/30 p-0">
              {gameState !== 'home' && (
                <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white">Ancient Guardian</div>
                    <div className="text-xs text-white">
                      {enemyStats.hp}/{enemyStats.maxHp} HP
                    </div>
                  </div>
                  <div className="mt-1 h-2 w-full bg-gray-700 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${(enemyStats.hp / enemyStats.maxHp) * 100}%`,
                      }}
                    ></div>
                    {/* Amiability meter as a small bar at the top */}
                    <div
                      className="absolute top-0 left-0 h-1/3 bg-blue-500"
                      style={{
                        width: `${enemyStats.amiability}%`,
                        opacity: 0.8,
                      }}
                    ></div>
                    {/* Add a visual indicator when amiability changes */}
                    {amiabilityChangeIndicator !== 0 && (
                      <div
                        className={`absolute top-0 right-0 px-2 py-0.5 text-xs font-bold rounded-bl-md ${
                          amiabilityChangeIndicator > 0
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                        style={{
                          animation: 'fadeOut 2s forwards',
                        }}
                      >
                        {amiabilityChangeIndicator > 0
                          ? `+${amiabilityChangeIndicator.toFixed(1)}`
                          : amiabilityChangeIndicator.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Game Screen Background */}
              <div className="relative h-[360px] w-full overflow-hidden bg-black">
                <Image
                  src={
                    gameState === 'home'
                      ? '/placeholder.svg?text=Home&width=640&height=360'
                      : gameState === 'victory'
                      ? '/placeholder.svg?text=Victory&width=640&height=360'
                      : gameState === 'gameOver'
                      ? '/placeholder.svg?text=Defeat&width=640&height=360'
                      : '/placeholder.svg?text=AncientTemple&width=640&height=360'
                  }
                  alt={
                    gameState === 'home'
                      ? 'Home'
                      : gameState === 'victory'
                      ? 'Victory'
                      : gameState === 'gameOver'
                      ? 'Defeat'
                      : 'Ancient Temple'
                  }
                  fill
                  className="object-cover opacity-50"
                />

                {gameState !== 'home' && (
                  <>
                    {/* Enemy */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2">
                      <div className="relative">
                        <Image
                          src={
                            enemyStats.amiability <
                            GAME_CONFIG.AMIABILITY_THRESHOLDS.HOSTILE
                              ? '/placeholder.svg?text=HostileGuardian&width=120&height=120'
                              : enemyStats.amiability <
                                GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
                              ? '/placeholder.svg?text=NeutralGuardian&width=120&height=120'
                              : '/placeholder.svg?text=FriendlyGuardian&width=120&height=120'
                          }
                          alt="Ancient Guardian"
                          width={120}
                          height={120}
                          className={`object-contain ${
                            enemyStats.amiability <
                            GAME_CONFIG.AMIABILITY_THRESHOLDS.HOSTILE
                              ? 'filter hue-rotate-180'
                              : enemyStats.amiability <
                                GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
                              ? ''
                              : 'filter brightness-110'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Color Sequence Area - Positioned at the bottom of the screen */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md">
                      {currentColorSequence.length > 0 && (
                        <div className="space-y-4">
                          {/* Current Color Sequence */}
                          <div className="flex justify-center">
                            <div className="flex space-x-1 p-2 bg-black/40 rounded-md">
                              {currentColorSequence.map((color, index) => (
                                <div
                                  key={index}
                                  className={`w-8 h-8 cursor-pointer transition-all ${
                                    selectedIndices.includes(index)
                                      ? 'ring-2 ring-white scale-110'
                                      : ''
                                  } ${
                                    showOptimalPalindrome &&
                                    index >= optimalPalindrome.start &&
                                    index <
                                      optimalPalindrome.start +
                                        optimalPalindrome.length
                                      ? 'ring-2 ring-yellow-400'
                                      : ''
                                  }`}
                                  style={{
                                    backgroundColor:
                                      COLORS.find((c) => c.name === color)
                                        ?.value || color,
                                  }}
                                  onClick={() => toggleBlockSelection(index)}
                                ></div>
                              ))}
                            </div>
                          </div>

                          {/* Selected Sequence */}
                          {selectedIndices.length > 0 && (
                            <div className="flex justify-center">
                              <div className="bg-gray-800/80 p-2 rounded-md">
                                <div className="text-xs text-white mb-1 text-center">
                                  Selected Sequence
                                </div>
                                <div className="flex space-x-1 justify-center">
                                  {selectedIndices.map((index) => (
                                    <div
                                      key={`selected-${index}`}
                                      className="w-6 h-6"
                                      style={{
                                        backgroundColor:
                                          COLORS.find(
                                            (c) =>
                                              c.name ===
                                              currentColorSequence[index]
                                          )?.value ||
                                          currentColorSequence[index],
                                      }}
                                    ></div>
                                  ))}
                                </div>
                                <div className="mt-1 text-xs text-center text-white">
                                  {isPalindrome(getSelectedColors())
                                    ? '✓ Palindrome'
                                    : '✗ Not a palindrome'}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Submit Button */}
                          {(gameState === 'userTurn' || finalBattle) &&
                            selectedIndices.length > 0 &&
                            !hasSubmittedThisTurn && (
                              <div className="flex justify-center">
                                <Button
                                  size="sm"
                                  onClick={submitSelection}
                                  disabled={
                                    !isSelectionContinuous() ||
                                    !isPalindrome(getSelectedColors())
                                  }
                                >
                                  Submit Selection
                                </Button>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Character */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                  <Image
                    src={
                      stats.hp / stats.maxHp >
                      GAME_CONFIG.HEALTH_THRESHOLDS.WEAKENED
                        ? '/placeholder.svg?text=HealthyHero&width=64&height=96'
                        : stats.hp / stats.maxHp >
                          GAME_CONFIG.HEALTH_THRESHOLDS.CRITICAL
                        ? '/placeholder.svg?text=WeakenedHero&width=64&height=96'
                        : '/placeholder.svg?text=DefeatedHero&width=64&height=96'
                    }
                    alt="Character"
                    width={64}
                    height={96}
                    className={`object-contain ${
                      stats.hp / stats.maxHp >
                      GAME_CONFIG.HEALTH_THRESHOLDS.WEAKENED
                        ? ''
                        : stats.hp / stats.maxHp >
                          GAME_CONFIG.HEALTH_THRESHOLDS.CRITICAL
                        ? 'opacity-80'
                        : 'opacity-60 filter grayscale'
                    }`}
                  />
                </div>
              </div>

              {/* Game Text Box */}
              <div className="border-t-2 border-primary/30 bg-muted/80 p-4">
                <p className="font-mono text-sm leading-relaxed">{gameText}</p>
              </div>
            </Card>

            {/* Game Controls */}
            <Card className="mt-4 border-2 border-primary/30 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Game Status</h3>
                {gameState === 'idle' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startTurn}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Start Turn</span>
                  </Button>
                )}
                {gameState === 'gameOver' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Restart Game</span>
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">HP</span>
                    </div>
                    <span className="text-sm">
                      {stats.hp}/{stats.maxHp}
                    </span>
                  </div>
                  <Progress
                    value={(stats.hp / stats.maxHp) * 100}
                    className="h-2 bg-muted"
                    indicatorClassName="bg-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium">MP</span>
                    </div>
                    <span className="text-sm">
                      {stats.mp}/{stats.maxMp}
                    </span>
                  </div>
                  <Progress
                    value={(stats.mp / stats.maxMp) * 100}
                    className="h-2 bg-muted"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
              </div>

              {/* Always show color sequence in game controls when in user turn */}
              {(gameState === 'userTurn' || finalBattle) &&
                currentColorSequence.length > 0 && (
                  <div className="mt-4 p-2 bg-black/20 rounded-md">
                    <div className="text-sm font-medium mb-2">
                      Color Sequence:
                    </div>
                    <div className="flex flex-wrap justify-center gap-1 mb-2">
                      {currentColorSequence.map((color, index) => (
                        <div
                          key={`control-${index}`}
                          className={`w-6 h-6 cursor-pointer transition-all ${
                            selectedIndices.includes(index)
                              ? 'ring-2 ring-white scale-110'
                              : ''
                          } ${
                            showOptimalPalindrome &&
                            index >= optimalPalindrome.start &&
                            index <
                              optimalPalindrome.start + optimalPalindrome.length
                              ? 'ring-2 ring-yellow-400'
                              : ''
                          }`}
                          style={{
                            backgroundColor:
                              COLORS.find((c) => c.name === color)?.value ||
                              color,
                          }}
                          onClick={() => toggleBlockSelection(index)}
                        ></div>
                      ))}
                    </div>

                    {selectedIndices.length > 0 && (
                      <>
                        <div className="text-xs text-center mb-2">
                          {isPalindrome(getSelectedColors())
                            ? '✓ Valid Palindrome'
                            : '✗ Not a palindrome'}
                        </div>

                        {!hasSubmittedThisTurn && (
                          <div className="flex justify-center">
                            <Button
                              size="sm"
                              onClick={submitSelection}
                              disabled={
                                !isSelectionContinuous() ||
                                !isPalindrome(getSelectedColors())
                              }
                            >
                              Submit Selection
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

              <div className="mt-4">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      {gameState === 'idle'
                        ? "Click 'Start Turn' to begin"
                        : gameState === 'userTurn'
                        ? 'Select a palindromic sequence'
                        : gameState === 'enemyTurn'
                        ? 'Enemy is taking their turn'
                        : gameState === 'home'
                        ? 'You are at home. Rest, read, or talk'
                        : gameState === 'gameOver'
                        ? 'Game Over'
                        : gameState === 'victory'
                        ? 'You have won!'
                        : 'Tutorial in progress'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Show color selection status when in user turn */}
              {(gameState === 'userTurn' || finalBattle) &&
                selectedIndices.length > 0 && (
                  <div className="mt-4 p-2 bg-muted/50 rounded-md">
                    <div className="text-sm font-medium mb-1">
                      Selected Sequence:
                    </div>
                    <div className="flex justify-center space-x-1 mb-2">
                      {selectedIndices.map((index) => (
                        <div
                          key={`status-${index}`}
                          className="w-6 h-6"
                          style={{
                            backgroundColor:
                              COLORS.find(
                                (c) => c.name === currentColorSequence[index]
                              )?.value || currentColorSequence[index],
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="text-xs text-center">
                      {isPalindrome(getSelectedColors())
                        ? '✓ Valid Palindrome'
                        : '✗ Not a palindrome'}
                    </div>
                  </div>
                )}
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-center gap-2 md:flex-col md:justify-start">
            {gameState === 'home' ? (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleRest}
                  disabled={hasRestedThisTurn || areButtonsDisabled()}
                  className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
                >
                  <div className="flex h-6 w-6 items-center justify-center text-blue-500">
                    <span className="text-lg">💤</span>
                  </div>
                  <span className="text-xs">Rest</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleRead}
                  disabled={areButtonsDisabled()}
                  className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
                >
                  <div className="flex h-6 w-6 items-center justify-center text-amber-500">
                    <span className="text-lg">📚</span>
                  </div>
                  <span className="text-xs">Read</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleTalk}
                  disabled={areButtonsDisabled()}
                  className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
                >
                  <MessageSquare className="h-6 w-6 text-green-500" />
                  <span className="text-xs">Think</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={startTurn}
                  disabled={gameState !== 'idle' || areButtonsDisabled()}
                  className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
                >
                  <Sword className="h-6 w-6 text-red-500" />
                  <span className="text-xs">Fight</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleTalk}
                  disabled={
                    gameState !== 'idle' ||
                    hasTalkedThisRound ||
                    areButtonsDisabled()
                  }
                  className={`flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 ${
                    gameState === 'idle' &&
                    !hasTalkedThisRound &&
                    gameText.includes('Talk to the Guardian')
                      ? 'border-green-500 animate-pulse'
                      : 'border-primary/30'
                  } p-0 md:h-20 md:w-20`}
                >
                  <MessageSquare className="h-6 w-6 text-green-500" />
                  <span className="text-xs">Talk</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleMagic}
                  disabled={
                    gameState !== 'userTurn' ||
                    stats.mp < GAME_CONFIG.MAGIC_COST ||
                    areButtonsDisabled()
                  }
                  className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
                >
                  <div className="flex h-6 w-6 items-center justify-center text-blue-500">
                    <span className="text-lg">✨</span>
                  </div>
                  <span className="text-xs">Magic</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Regular Dialog Component */}
      <GameDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          // If this is the final battle dialog, make sure we're in userTurn state
          if (finalBattle && gameState !== 'userTurn') {
            setGameState('userTurn')
          }
        }}
        title={dialogTitle}
        content={dialogContent}
        portrait={
          dialogTitle === 'Ancient Guardian'
            ? `/placeholder.svg?text=${
                enemyStats.amiability <
                GAME_CONFIG.AMIABILITY_THRESHOLDS.HOSTILE
                  ? 'Hostile'
                  : enemyStats.amiability <
                    GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
                  ? 'Neutral'
                  : 'Friendly'
              }Guardian&width=80&height=80`
            : '/placeholder.svg?text=Guardian&width=80&height=80'
        }
        autoType={true}
      />

      {/* Dialog With Input Component */}
      <DialogWithInput
        isOpen={inputDialogOpen}
        onClose={() => setInputDialogOpen(false)}
        title={dialogTitle}
        content={dialogContent}
        portrait={`/placeholder.svg?text=${npcName}&width=80&height=80`}
        autoType={true}
        onRespond={handleDialogResponse}
        turnCount={turnCount}
        responseOptions={responseOptions}
      />

      <style jsx global>{`
        .pulse-border {
          animation: pulse-border 2s infinite;
        }

        @keyframes pulse-border {
          0% {
            border-color: hsl(var(--primary) / 0.3);
          }
          50% {
            border-color: hsl(var(--primary));
          }
          100% {
            border-color: hsl(var(--primary) / 0.3);
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
