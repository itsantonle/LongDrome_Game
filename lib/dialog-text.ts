import { ResponseOption } from './game-types'
/*
THIS SECTION IS FOR THE MENU TYPES
    1. CanGoHomeDialog - the dialog that appears when amiability level for amiable is reached
    2. tutorialCompletedDialog = the dialog that appears on the GameText Component after completing the tutorial
*/
export const canGoHomeDialog: string[] = [
  'You have earned my respect, traveler.',
  'You may return to your home if you wish.',
  'You are welcome to continue our challenges, or rest and return later.',
]

export const tutorialCompletedDialog: string =
  'The Ancient Guardian awaits your challenge. Prepare your strategy!'

/*
THIS SECTION IS FOR THE ENEMY DIALOG OPTIONS
    1. You can change the types all to neutral to make it harder for the user to know what type of response it is
    2. this works in tandem with the positive, negative keywords in game-utils
    3. adding more turns in game config might require you to add more dialogs here
*/
interface ResponsesToEnemy {
  firstRound: ResponseOption[]
  secondRound: ResponseOption[]
  thirdRound: ResponseOption[]
  fourthRound: ResponseOption[]
  fifthRound: ResponseOption[]

  default: ResponseOption[]
}
export const responseToEnemy: ResponsesToEnemy = {
  firstRound: [
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
  ],
  secondRound: [
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
  ],
  thirdRound: [
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
  ],
  fourthRound: [
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
  ],
  fifthRound: [
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
  ],
  default: [
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
  ],
}

/*
THIS SECTION IS FOR THE BATTLE DIALOGS
*/
export const enemeyPreparingDialog =
  'The Ancient Guardian is considering its next move...'
export const prepareForBattleDialog =
  'Select a palindromic sequence of colors to defend yourself!'

export const alreadySubmittedForThisTurnDialog =
  "You've already submitted your selection for this turn!"

export const selectionNotContinuosDialog =
  'Your selection must be continuous! Try again.'

export const selectionNotPalindromic =
  'Your selection is not a palindrome! Try again.'

/*
THIS SECTION IS FOR THE SELECLECTION OF PALINDROME DIALOGS
*/

/*
THIS SECTION IS FOR THE FINAL BATTLE DIALOGS
*/

export const failedFinalChallengeDialog = [
  'You have failed the final challenge.',
  'The Ancient Guardian has bested you in the battle of palindromes.',
  'Perhaps with more practice, you can return and challenge it again.',
]

export const wonFinalChallengeDialog = [
  'You have proven yourself worthy in the final challenge!',
  'The Ancient Guardian grants you passage and shares its ancient knowledge with you.',
  'Your name shall be recorded in the annals of palindrome masters!',
]

/*
THIS SECTION IS FOR THE GAME OVER DIALOGS
*/

export const gameOverDialog = [
  'The Ancient Guardian has bested you in the battle of palindromes.',
  'Perhaps with more practice, you can return and challenge it again.',
  'Remember: The key is to find the longest palindromic sequence!',
]

/*
THIS SECTION IS FOR THE PRE-FINAL FIGHT DIALOGS
*/
export const automaticWinGameText =
  'The Ancient Guardian seems impressed with your skills and friendly demeanor!'

export const automaticWinGameDialog = [
  'You have proven yourself worthy, both in skill and character.',
  'I shall grant you passage and share my knowledge with you.',
  'Few have earned my respect as you have. You may return home safely.',
]

export const oneFinalChallegeGameDialog = [
  'You have shown skill, but your attitude leaves much to be desired.',
  'I shall give you one final challenge. Find the optimal palindrome in this sequence.',
  'Succeed, and you may leave. Fail, and you shall remain here forever!',
]

/*
THIS SECTION IS FOR THE HANDLE DUAKIG RESOIBESE THAT DECREASES ON INCREASES THE AMIABILITY LEVEL OF THE ENEMEY
*/

export const getEnemyResponse = (
  amiabilityChange: number,
  npcName: string
): string => {
  if (amiabilityChange > 15) {
    return `${npcName}'s eyes glow with a warm light. Your words have clearly pleased it greatly!`
  } else if (amiabilityChange > 8) {
    return `${npcName} nods with approval. A subtle warmth enters its otherwise stoic expression.`
  } else if (amiabilityChange > 0) {
    return `${npcName} seems mildly pleased by your words.`
  } else if (amiabilityChange < -15) {
    return `${npcName}'s eyes flash with anger! The air around you grows ice cold. It is clearly displeased.`
  } else if (amiabilityChange < -8) {
    return `${npcName}'s gaze hardens. You sense strong disapproval emanating from its ancient presence.`
  } else if (amiabilityChange < 0) {
    return `${npcName} seems irritated by your words.`
  } else {
    return `${npcName} acknowledges your words with an enigmatic tilt of its head.`
  }
}
