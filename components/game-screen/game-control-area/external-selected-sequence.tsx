import React from 'react'

interface ExternalSelectedSequenceProps {
  gameState: string
  finalBattle: boolean
  selectedIndices: number[]
  currentColorSequence: string[]
  COLORS: { name: string; value: string }[]
  isPalindrome: (colors: string[]) => boolean
  getSelectedColors: () => string[]
}

function ExternalSelectedSequence(props: ExternalSelectedSequenceProps) {
  const {
    gameState,
    finalBattle,
    selectedIndices,
    currentColorSequence,
    COLORS,
    isPalindrome,
    getSelectedColors,
  } = props

  if (
    !(gameState === 'userTurn' || finalBattle) ||
    selectedIndices.length === 0
  ) {
    return null
  }

  return (
    <div className="mt-4 p-2 bg-muted/50 rounded-md">
      <div className="text-sm font-medium mb-1">Selected Sequence:</div>
      <div className="flex justify-center space-x-1 mb-2">
        {selectedIndices.map((index) => (
          <div
            key={`status-${index}`}
            className="w-6 h-6"
            style={{
              backgroundColor:
                COLORS.find((c) => c.name === currentColorSequence[index])
                  ?.value || currentColorSequence[index],
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
  )
}

export default ExternalSelectedSequence
