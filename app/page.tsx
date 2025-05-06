'use client'

import type React from 'react'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GameDialog } from '@/components/modals/game-dialog'
import { DialogWithInput } from '@/components/modals/dialog-with-input'
import { TutorialTransition } from '@/components/tutorial/tutorial-transition'

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
  calculateAmiabilityChange,
  userFoundOptimalPalindrome,
  calculateDamage,
  canAccessHome,
} from '@/lib/game-utils'

import {
  defaultCharacterStats,
  defaultConfig,
  defaultEnemeyStats,
  defaultNPCname,
} from '@/lib/default-config'
import {
  alreadySubmittedForThisTurnDialog,
  automaticWinGameDialog,
  automaticWinGameText,
  canGoHomeDialog,
  enemeyPreparingDialog,
  failedFinalChallengeDialog,
  gameOverDialog,
  getEnemyResponse,
  oneFinalChallegeGameDialog,
  // oneFinalChallegeGameText,
  prepareForBattleDialog,
  selectionNotContinuosDialog,
  selectionNotPalindromic,
  tutorialCompletedDialog,
  wonFinalChallengeDialog,
} from '@/lib/dialog-text'
import {
  determineOptimalPalindrome,
  determineSelectionisContinuous,
  generateTalkDialog,
  performMagicAction,
  gettoggleBlockSelection,
} from '@/lib/client-helper-utils'
import HomeAccessModal from '@/components/modals/home-access-modal'
import ReadingBookModal from '@/components/modals/reading-books-modal'
import HomeTempleButtons from '@/components/game-screen/home-temple-buttons'
import EnemyStatusBar from '@/components/game-screen/enemy-status-bar'
import GameBackground from '@/components/game-screen/game-background'
import EnemyImage from '@/components/game-screen/enemy-image'
import ColorSequence from '@/components/game-screen/selection-area/color-sequence'
import SelectedSequence from '@/components/game-screen/selection-area/selected-sequence'
import CharacterImage from '@/components/game-screen/character-image'
import GameStatus from '@/components/game-screen/game-control-area/game-status'
import PlayerHPMP from '@/components/game-screen/game-control-area/player-hp-mp'
import GameAlert from '@/components/game-screen/game-control-area/game-alert'
import ExternalSelectedSequence from '@/components/game-screen/game-control-area/external-selected-sequence'
import ActionsButtons from '@/components/game-screen/side-button-area/action-buttons'
import { Footer } from '@/components/nav/footer'

/** DOCUMENTATION
 * DOCUMENTATION NOTES FOR LONGDROME
 * @author Anton Legayada (c) 2025
 * @version 1.0
 *
 * This guide shows how to use the component for the main page.tsx under the app directory
 * CUSTOMIZATION GUIDE:
 *
 * 1. CHANGING IMAGES:
 *    -
 *
 * 2. MODIFYING DIALOG SYSTEM:
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

/* Export Game config, you can choose to use the spread operator*/
export const GAME_CONFIG = {
  ...defaultConfig,
}

export default function Game() {
  /** USE StATE BLOCK
   * USE STATE BLOCK GUIDE
   *  - defines the initial state of the game.
   *  1. gmmeState is of @type {GameState}, sets the current state of the game
   *  2. gameText is of @type {string}, sets the current text in the gameText area below
   *  3. dialogOpen is of @type {boolean} , sets if the GaT is visible or not
   *  4. dialogConent is of @type {string |string[]}, sets the content for the GameDialog component
   *  5. dialogTitle is of @type {string} sets the title of the GameDialog component
   *  6. npcName is of @type {string} is the NPC name set dynaimcally throughout the game
   *  7. tutorial is of @type {boolean}, is false by default and is true when the tutorialTransition comonent is completed @see components\tutorial
   *  8. finalBattle is of @type {boolean}, sets true if the MAX_TURNS is reached and amiability THRESHOLD.FRIENDLY is not reached
   *  9. readingBook is of @type {boolean} is true when the reading book button is clicked
   *  10. hasTalkedThisRound is of @type {boolean}, checks whether the user has talked with the enemy for a specific round
   *  10. hasRestedThisTurn is of @type {boolean}, checks whether the user has gone home and rested for this round
   *  11  HomeAccessModal is of @type {boolean} , sets true if the user is allowed to go home
   *  12. canGoHome is of @type {boolean} , checks if the user is alloed to go home
   *  13. responseOptions is of @type {ResponseOption[]}, are the response options to the DialogwithInput component @see fetchResponseOptions in client-helper.ts and @see responseToEnemy in dialog-text to change the config
   *  14. hasSubmittedThisTurn is of @type {boolean} , checks if the user has submitted their chosen palindromic blocks for this round
   *  15. amiabilityChangeIndicator is of @type {number}, is dynamically set through the game to affect eneey amiability, @see calculateAmiabilityChange in lib\game-utils.ts @see guardianDialogs in lib\game-utils.ts to modify positive and negative keywords and enemyDialogs
   *  16. stats is of @type {CharacterStats}, is the stats the player has  @see defaultCharacterStats in lib\default-config.ts
   *  16. enemyStats is of @type {EnemyStats}, is the stats the player has  @see defaultEnemeyStats in lib\default-config.ts
   *  17. currentColorSequence is of @type {string[]}, displays the color blocks with the string mapped
   *  18. selectedIndices is of @type {number[]}, is a list of all the indices selected by user in the sequence @see gettoggleBlockSelection in lib\client-helper-utils.ts
   *  19. optimalPalindrom is of @type {  start: number , length: number, sequence: string[]}, holds the information about the optimal palindrome in the current round
   *  20 showOptimalPalindrome is of @type {boolean}, sets whether to show the optimal palindrome or not
   *  21. turnCount is of @type {number}, keeps track of the turn count
   */
  const [gameState, setGameState] = useState<GameState>('tutorial')
  const [gameText, setGameText] = useState('Welcome to Longdrome!')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputDialogOpen, setInputDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<string[]>([])
  const [dialogTitle, setDialogTitle] = useState('')
  const [npcName, setNpcName] = useState(defaultNPCname)
  const [tutorialComplete, setTutorialComplete] = useState(false)
  const [finalBattle, setFinalBattle] = useState(false)
  const [readingBook, setReadingBook] = useState(false)
  const [hasTalkedThisRound, setHasTalkedThisRound] = useState(false)
  const [hasRestedThisTurn, setHasRestedThisTurn] = useState(false)
  const [homeAccessModal, setHomeAccessModal] = useState(false)
  const [canGoHome, setCanGoHome] = useState(false)
  const [homePromptShown, setHomePromptShown] = useState(false)
  const [responseOptions, setResponseOptions] = useState<ResponseOption[]>([])
  const [hasSubmittedThisTurn, setHasSubmittedThisTurn] = useState(false)
  const [amiabilityChangeIndicator, setAmiabilityChangeIndicator] = useState(0)
  const [stats, setStats] = useState<CharacterStats>({
    ...defaultCharacterStats,
  })
  const [enemyStats, setEnemyStats] = useState<EnemyStats>({
    ...defaultEnemeyStats,
  })
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
  const { MAX_TURNS } = GAME_CONFIG

  /**  GENERATE SEQUENCE USEEFFECT BLOCK
   * - generates a sequence if the game state is not tutorial or home and if the currecnt colorSequence is 0
   * - useeffect takes the gameState and currentColorSequence.length as dependencies
   * - if you want to see how a random palindromic block is generated @see generateRandomSequence
   * - note that colors refers to an array of strings that are predefined @see COLORS
   */
  useEffect(() => {
    if (
      gameState !== 'tutorial' &&
      gameState !== 'home' &&
      currentColorSequence.length === 0
    ) {
      generateNewSequence()
    }
  }, [gameState, currentColorSequence.length])

  const generateNewSequence = () => {
    const newSequence = generateRandomSequence(5, 12, turnCount)
    setCurrentColorSequence(newSequence)
    setSelectedIndices([])
    setShowOptimalPalindrome(false)
    setHasSubmittedThisTurn(false) // Reset submission state for new sequence
  }

  /**  HOME ACCESS USEEFFECT BLOCK
   * the canAccessHome in the game-utils will return turn if  amiabiliy >=  @see GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
   * the homeAccess if of @type {boolean}
   * the conditional if below ensures conditions when the home dialog pops up @see canGoHomeDialog in ./dialog-test.ts
   */
  useEffect(() => {
    const homeAccess = canAccessHome(gameState, enemyStats.amiability)

    if (homeAccess && !canGoHome && !homePromptShown && gameState !== 'home') {
      setDialogTitle(npcName)
      setDialogContent(canGoHomeDialog)
      setDialogOpen(true)
      setHomePromptShown(true)
    }

    setCanGoHome(homeAccess)
  }, [gameState, enemyStats.amiability, canGoHome, homePromptShown])

  /**  OPTIMAL PALINDROME USEEFFECT BLOCK
   * this heavily relies on the client helper function @see determineOptimalPalindrome which must be supplied with @param currentColorSequence
   * the dependency array means that the useEffect fires everytime the @see currentColorSequence changes
   */
  useEffect(() => {
    if (currentColorSequence.length > 0) {
      setOptimalPalindrome(determineOptimalPalindrome(currentColorSequence))
    }
  }, [currentColorSequence])

  /**  TUTORIAL COMPLETE FUNCTION BLOCK
   *  this function @see handleTutorialComplete runs when @see TutorialTransition @prop {onComplete} is called is of type @function
   *  this sets the game state to idle
   *  this also forces a new sequence to regenerate using the @see generateNewSequence handler function
   */
  const handleTutorialComplete = () => {
    setTutorialComplete(true)
    setGameState('idle')
    generateNewSequence()
    setGameText(tutorialCompletedDialog)
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
  // const getResponseOptions = (turnCount: number): ResponseOption[] => {
  //   // Different dialog options for each round
  //   return fetchresponseOptions(turnCount)
  // }

  /**  START TURN HANDLER BLOCK
   * @type {GameState} should be idle, the conditional if statement imposes this
   * the idle @type {GameState} will now be shifted to the userTurn state
   * the turncount starts at 0 so add + 1 to reflect changes in natural counting order
   * @see prepareForBattleDialog to edit the text set in teh gameText
   * the following codes are to reset the states for each round by setting them to false
   * affected are @see hasTalkedThisRound @see hasRestedThisTurn @see hasSubmittedThisTurn
   */

  const startTurn = () => {
    if (gameState !== 'idle') return

    setGameState('userTurn')
    setSelectedIndices([])
    setShowOptimalPalindrome(false)
    setGameText(`Turn ${turnCount + 1}: ${prepareForBattleDialog}`)
    setTurnCount((prev) => prev + 1)
    setHasTalkedThisRound(false) // Reset the talk state for the new round
    setHasRestedThisTurn(false) // Reset the resting state for the new turn
    setHasSubmittedThisTurn(false) // Reset the submission state for the new turn
  }

  // Handle block selection
  // const toggleBlockSelection = (index: number) => {
  //   if (gameState !== 'userTurn') return

  //   setSelectedIndices((prev) => {
  //     const newSelection = [...prev]
  //     const position = newSelection.indexOf(index)

  //     if (position === -1) {
  //       // Add to selection
  //       newSelection.push(index)
  //     } else {
  //       // Remove from selection
  //       newSelection.splice(position, 1)
  //     }

  //     // Sort indices to maintain order
  //     return newSelection.sort((a, b) => a - b)
  //   })
  // }

  /**  BLOCK SELECTION HANDLER BLOCK
   *  this handler relies heavily on the @see gettoggleBlockSelection which takes the following params:
   *  @param index @type {number}
   *  @param gameState @type {GameState}
   *  @param selectedIndices @type {number[]}
   *  @param setSelectedIndices @function
   *  @param setGameText @function
   * this handler is called by the @see ColorSequence component
   */
  const toggleBlockSelection = (index: number) => {
    gettoggleBlockSelection(
      index,
      gameState,
      selectedIndices,
      setSelectedIndices,
      setGameText
    )
  }

  /**  ISSELECTIONCONTINUOS HANDLER BLOCK
   *  this handler relies heavily on the @see determineSelectionisContinuous helper function
   *  has the @param selectedIndices of @type {number[]}
   *  this is called by the handler @see submitSelection
   */
  const isSelectionContinuous = () => {
    return determineSelectionisContinuous(selectedIndices)
  }

  /**  SELECTEDCOlORS HANDLER BLOCK
   * <START HERE>
   *  this handler takes the @param index provided and returns a array of @type {string[]} containing the colors selected found by their array index
   *  this is used to analyze if two adjacent colors are 'palindromic' by saying 'green, green' is palindromic when next to each other @see isPalindrome
   * this is called by the handler @see submitSelection
   */
  const getSelectedColors = () => {
    return selectedIndices.map((index) => currentColorSequence[index])
  }

  /**  SUBMIT SELECTION HANDLER BLOCK
   * relies on @see getSelectedColors @see isSelectionContinuous @see isPalindrome to ensure that the selection is continuos and palindromic
   * when not palindromic sets gameText as @see selectionNotPalindromic
   * when not continuous sets gameText as @see selectionNotContinuosDialog
   * relies on the @see userFoundOptimalPalindrome to determine if the user has found the optimal palindrome
   * the if conditional with the @type {GameState} === 'final battle' is crucial as the user needs to find the optimal palindrome to win or lose otherwise
   * sets the gameState to victory if optimal and gameOver if not @see GameState
   * if the user submits and it's not the final battle then the gameState userTurn is shifted to enemyTurn
   * if the user does not find the optimal palindrome it wiill show it by setting @see setShowOptimalPalindrome to true and return a dialog
   * if the user does find it it will return a dialog
   * will move on to set the gameState to enemey turn and call the @see enemyTurn which is documented after this block
   */
  const submitSelection = () => {
    // Check if user has already submitted this turn
    if (hasSubmittedThisTurn) {
      setGameText(alreadySubmittedForThisTurnDialog)
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
      setGameText(selectionNotContinuosDialog)
      return
    }

    if (!isPalindromic) {
      setGameText(selectionNotPalindromic)
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
          `You found a palindrome of length ${userPalindromeLength}, but the optimal one was length ${optimalPalindromeLength}.  ${npcName} defeats you!`
        )
        // Immediately set game state to game over
        setGameState('gameOver')
        setDialogTitle('Defeat')
        setDialogContent(failedFinalChallengeDialog)
        setDialogOpen(true)
        return // Exit early
      } else {
        // User won the final challenge
        setGameText(
          `Excellent! You found the optimal palindrome of length ${userPalindromeLength}! ${npcName} is impressed!`
        )
        // Immediately set victory state
        setGameState('victory')
        setDialogTitle('Victory')
        setDialogContent(wonFinalChallengeDialog)
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
    }

    // Move to enemy turn
    setTimeout(() => {
      setGameState('enemyTurn')
      enemyTurn()
    }, 2000)
  }
  // end of handle submit

  /**  ENEMY TURN  HANDLER BLOCK
   * since the enemy will always choose the optimal palindrome, will set showOptimalPalindrome to true
   * the state gameTexxt will be set to the @see enemeyPreparingDialog
   * if the user has found the optimal palindrome previously, the user will take no damage
   * otherwise the damage factor relies on the @see calculateDamage which will dispatch the setStats and change the characteer hp characters stats @see CharacterStats
   * this also checks if the user health is <= 0 on the next user turn, that means the user has one more extra chance before losing and calls aupon the gameOverDialog @see gameOverDialog
   * if the user has exceeded MAX-TURNS @see MAX_TURNS , the final battle enemy turn plays. This is checked by seeing if the current amiabliity is >= to the @see GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
   * if it is, then it is an automatic victory and the final battle sequence is skipped.
   * If not, then sets the FinalBattle to true, generating a new sequence and setting the gameState to userTurn
   * Else, it will end the turn and set the gameState to idle, generating a new sequence as well as prompting the user to use the 'Talk' option
   */

  const enemyTurn = () => {
    setGameText(enemeyPreparingDialog)

    // Show the optimal palindrome
    setShowOptimalPalindrome(true)

    setTimeout(() => {
      // Enemy always chooses the optimal palindrome
      const enemyPalindromeLength = optimalPalindrome.length

      setGameText(
        `${npcName} identifies a palindrome of length ${enemyPalindromeLength}!`
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
            `You found the optimal palindrome! ${npcName}'s attack has no effect on you this turn.`
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
            `${npcName} attacks with a palindrome of length ${enemyPalindromeLength}! You take ${damage} damage.`
          )
        }

        // Check if game over
        if (stats.hp <= 0) {
          // Immediately set game state to game over
          setGameState('gameOver')
          setGameText(`You have been defeated by  ${npcName}!`)
          setDialogTitle('Defeat')
          setDialogContent(gameOverDialog)
          setDialogOpen(true)
          return // Exit the function early
        } else if (turnCount >= MAX_TURNS) {
          // Final confrontation
          if (
            enemyStats.amiability >= GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
          ) {
            // Good relationship - automatic win
            setGameState('victory')
            setGameText(automaticWinGameText)
            setDialogTitle('Victory')
            setDialogContent(automaticWinGameDialog)
            setDialogOpen(true)
          } else {
            // Bad relationship - final challenge
            setGameText(
              `${npcName} seems unimpressed. 'One final test to prove your worth!'`
            )
            setDialogTitle('Final Challenge')
            setDialogContent(oneFinalChallegeGameDialog)
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
              `Round ${turnCount} complete. Talk to ${npcName} before starting the next round! Click the Talk button to interact.`
            )
          }, 1500)
        }
      }, 1500)
    }, 1500)
  }

  //end of enemy turn

  /**  HANDLETALK  HANDLER BLOCK
   * this relies on the helper function generateTalkDialog  @see generateTalkDialog to return appropriate dialog elements
   * if there an isHomeDialog property then it means the game state is home
   * if there is a healing property then apply healing and increase mp using spread operator then modify hp and mp
   * setInputDialog and hasTalkedthisRound to true
   */
  const handleTalk = () => {
    const dialogData = generateTalkDialog(
      gameState,
      hasTalkedThisRound,
      npcName,
      enemyStats,
      turnCount
    )

    if (!dialogData) return

    // Handle home dialog
    if (dialogData.isHomeDialog) {
      setDialogTitle(dialogData.title)
      setDialogContent(dialogData.content)
      setDialogOpen(true)
      return
    }

    // Set NPC name and dialog based on the amiablity
    setNpcName(dialogData.title)
    setDialogTitle(dialogData.title)
    setDialogContent(dialogData.content)
    setResponseOptions(dialogData!.responseOptions!)

    // Apply healing if needed
    if (dialogData.healing) {
      setStats((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + (dialogData!.healing!.hp || 0)),
        mp: Math.min(prev.maxMp, prev.mp + (dialogData!.healing!.mp || 0)),
      }))
    }

    setInputDialogOpen(true)
    setHasTalkedThisRound(true)
  }

  /**  HANDLEDIALOGRESPONSE HANDLER BLOCK
   * @see calculateAmiabilityChange relies on the caculateAmiabilityChange helper function to get amiabilty change for different dialog responses
   * @see enemyStats sets the amiabilty of the enemy to add the amiability change
   * @see amiabilityChangeIndicator sets the amiability change to the amiabiltychange return from calculateAmiablityChange then clears it after a delay
   * @see getEnemyResponse to get the enemy response based on amiability
   * the last part amiabilty the amiabilty text to the current gametext
   */
  const handleDialogResponse = (response: string) => {
    const amiabilityChange = calculateAmiabilityChange(response, turnCount)

    // Update amiability
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

    // Use helper function to determine game text
    setGameText(getEnemyResponse(amiabilityChange, npcName))

    // Append amiability change to feedback
    if (amiabilityChange !== 0) {
      setGameText(
        (prev) =>
          `${prev} [Amiability ${
            amiabilityChange > 0 ? '+' : ''
          }${amiabilityChange.toFixed(1)}]`
      )
    }

    setInputDialogOpen(false)
  }

  /**  CHECKHOMECCESS HANDLER BLOCK
   * @see canAccessHome = relies on this function to see if the user can access home
   * @see goHome- is called when the user can go home
   * @see homeAccessModal - is called to inform the user if they cannot go home instead
   */
  const checkHomeAccess = () => {
    if (canAccessHome(gameState, enemyStats.amiability)) {
      goHome()
    } else {
      setHomeAccessModal(true)
    }
  }
  /**  GOHOME HANDLER BLOCK
   * @see checkHomeAccess - calls this helper function to see the state to home
   */
  const goHome = () => {
    setGameState('home')
    setGameText(
      'You have returned home safely. You can rest, read, or reflect on your journey.'
    )
    setCurrentColorSequence([])
    setHomeAccessModal(false)
  }

  /**  RETURNTOTEMPLE HANDLER BLOCK
   * @see gameState if the gamestate is not home, then returns nothing
   * othwrwise generate a new sequence and welcome the user  back to the temple (might change this location idk)
   */
  const returnToTemple = () => {
    if (gameState !== 'home') return

    setGameState('idle')
    generateNewSequence()
    setGameText(
      `You have returned to the Ancient Temple. ${npcName} acknowledges your presence.`
    )
  }

  /**  RETURNTOTEMPLE HANDLER BLOCK
   * @see hasRestedThisTurn - a boolean that is true if the user has already rested,
   * else recover some of the hp by referencing the game_config
   * @see GAME_CONFIG.REST_HEALING.HP @see GAME_CONFIG.REST_HEALING.MP - the configurations that affect the increase of mp and hp
   * set the hasRestedThisTurn to true after doing so
   */
  const handleRest = () => {
    if (hasRestedThisTurn) {
      setGameText(
        `You have already rested during this turn. You must face ${npcName} again before resting.`
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

  /**  HANDLEREAD HANDLER BLOCK
   @see setReadingBook - the dispatch called to set the Reading book to true. Is used to denote that the user is reading the book. 
   */
  const handleRead = () => {
    setReadingBook(true)
  }

  /**  HANDLEREAD HANDLER BLOCK
   * <start here>
   * @see performMagicAction - the helper function that the result variable relies on.
   * if the result is not sucessful, display the result.message
   * @see stats.mp - will be changed depending on the game config's magic cost
   * @see GAME_CONFIG.MAGIC_COST - the basis for magic cost deduction in stats.mp
   * @see showOptimalPalindrome - if the result is successful and has selected indices, then sets the current selected indices to the
   *  result.selectedIncdices (which are always the optimal palindrome indices) and the result.message as gameText
   */
  const handleMagic = () => {
    const result = performMagicAction(
      gameState,
      stats,
      GAME_CONFIG,
      optimalPalindrome,
      currentColorSequence
    )

    if (!result.success) {
      setGameText(result.message)
      return
    }

    // Deduct MP for spell casting
    setStats((prev) => ({
      ...prev,
      mp: prev.mp - GAME_CONFIG.MAGIC_COST,
    }))

    setShowOptimalPalindrome(true)
    setSelectedIndices(result.selectedIndices!)
    setGameText(result.message)
  }

  /**  HANDLEMODALCLOSE HANDLER BLOCK
   * @see homeAccessModal - sets false when the function is ran
   */
  const handleHomeModalClose = () => {
    setHomeAccessModal(false)
  }

  /**  AREBUTTONSDISABLEE HANDLER BLOCK
   * @returns {true} - if the gameState is either gameOver or victory, this ensure that action buttons cannot be clicked in this state
   */
  const areButtonsDisabled = () => {
    return gameState === 'gameOver' || gameState === 'victory'
  }

  /* ACTUAL COMPONENT RETURN BLOCK
    start here 
   */

  return (
    <>
      <div className="container flex min-h-screen flex-col items-center justify-center py-10">
        <div className="mb-16"></div>

        {/* TUTORIAL DIALOG */}
        {gameState === 'tutorial' && !tutorialComplete && (
          <TutorialTransition onComplete={handleTutorialComplete} />
        )}

        {/* GO HOME OPTION */}

        {homeAccessModal && (
          <>
            <HomeAccessModal
              gameState={gameState}
              enemyAmiability={enemyStats.amiability}
              isOpen={homeAccessModal}
              onClose={handleHomeModalClose}
              npcName={npcName}
            />
          </>
        )}

        {/* // remove this && because the thing itself has conditional rendering */}
        {readingBook && (
          <ReadingBookModal
            isOpen={readingBook}
            onClose={() => setReadingBook(false)}
          />
        )}

        <div className="w-full max-w-4xl">
          {/* Game Container */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
            {/* Main Game Area */}
            <div className="flex flex-col">
              {/* Home/Temple buttons */}
              <HomeTempleButtons
                gameState={gameState}
                checkHomeAccess={checkHomeAccess}
                returnToTemple={returnToTemple}
                areButtonsDisabled={areButtonsDisabled}
                canGoHome={canGoHome}
                btnName="Ancient Temple"
              />
              {/* Game Screen */}
              <Card className="relative overflow-hidden border-2 border-primary/30 p-0">
                {/* Enemy stats bar */}
                {gameState !== 'home' && (
                  <EnemyStatusBar
                    gameState={gameState}
                    enemyStats={enemyStats}
                    amiabilityChangeIndicator={amiabilityChangeIndicator} // Changes dynamically
                    npcName={npcName} // Displayed as the enemy’s name
                  />
                )}
                {/* Game Screen Background */}
                <div className="relative h-[360px] w-full overflow-hidden bg-black">
                  <GameBackground gameState={gameState} />

                  {gameState !== 'home' && (
                    <>
                      {/* Enemy */}
                      <EnemyImage amiability={enemyStats.amiability} />

                      {/* Color Sequence Area - Positioned at the bottom of the screen */}
                      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md">
                        {currentColorSequence.length > 0 && (
                          <div className="space-y-4">
                            {/* Current Color Sequence */}
                            <ColorSequence
                              currentColorSequence={currentColorSequence}
                              selectedIndices={selectedIndices}
                              showOptimalPalindrome={showOptimalPalindrome}
                              optimalPalindrome={optimalPalindrome}
                              COLORS={COLORS}
                              toggleBlockSelection={(index) =>
                                toggleBlockSelection(index)
                              }
                            />

                            {/* Selected Sequence */}
                            {selectedIndices.length > 0 && (
                              <SelectedSequence
                                selectedIndices={selectedIndices}
                                currentColorSequence={currentColorSequence}
                                COLORS={COLORS}
                                isPalindrome={isPalindrome}
                                getSelectedColors={getSelectedColors}
                              />
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
                  <CharacterImage hp={stats.hp} maxHp={stats.maxHp} />
                </div>

                {/* Game Text Box */}
                <div className="border-t-2 border-primary/30 bg-muted/80 p-4">
                  <p className="font-mono text-sm leading-relaxed">
                    {gameText}
                  </p>
                </div>
              </Card>

              {/* Game Controls */}
              <Card className="mt-4 border-2 border-primary/30 p-4">
                {/* Game Status */}
                <GameStatus gameState={gameState} startTurn={startTurn} />

                {/* Health and MP BAR */}

                <PlayerHPMP
                  hp={stats.hp}
                  maxHp={stats.maxHp}
                  mp={stats.mp}
                  maxMp={stats.maxMp}
                />

                {/* Always show color sequence in game controls when in user turn */}
                {/* {(gameState === 'userTurn' || finalBattle) &&
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
                )} */}
                {/* Game alert for the status  */}
                <GameAlert gameState={gameState} />

                {/* Show color selection status when in user turn */}
                <ExternalSelectedSequence
                  gameState={gameState}
                  finalBattle={finalBattle}
                  selectedIndices={selectedIndices}
                  currentColorSequence={currentColorSequence}
                  COLORS={COLORS}
                  isPalindrome={isPalindrome}
                  getSelectedColors={getSelectedColors}
                />
              </Card>
            </div>

            {/* Action Buttons */}
            <ActionsButtons
              gameState={gameState}
              handleRest={handleRest}
              handleRead={handleRead}
              handleTalk={handleTalk}
              handleMagic={handleMagic}
              startTurn={startTurn}
              hasRestedThisTurn={hasRestedThisTurn}
              hasTalkedThisRound={hasTalkedThisRound}
              areButtonsDisabled={areButtonsDisabled}
              gameText={gameText}
              stats={stats}
            />
          </div>
        </div>

        {/* MODAL THAT POPS UP WHEN GO HOME IS TRUE and during the final challenge */}
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
            dialogTitle === npcName
              ? `/ldrome_guardian.jpg`
              : gameState === 'victory'
              ? '/ldrome_guardian_friendly.jpg'
              : gameState === 'home'
              ? '/ldrome_char.jpg'
              : '/ldrome_guardian_hostile.jpg'
          }
          autoType={true}
        />

        {/* Dialog With Input Component when talking with enemy */}
        <DialogWithInput
          isOpen={inputDialogOpen}
          onClose={() => setInputDialogOpen(false)}
          title={dialogTitle}
          content={dialogContent}
          portrait={
            enemyStats.amiability >= GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY
              ? `/ldrome_guardian_friendly.jpg`
              : enemyStats.amiability <=
                GAME_CONFIG.AMIABILITY_THRESHOLDS.HOSTILE
              ? `/ldrome_guardian_hostile.jpg`
              : `/ldrome_guardian.jpg`
          }
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
      <Footer />
    </>
  )
}
