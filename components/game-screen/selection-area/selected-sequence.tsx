import React from 'react'

interface SelectedSequenceProps {
  selectedIndices: number[]
  currentColorSequence: string[]
  COLORS: { name: string; value: string }[]
  isPalindrome: (colors: string[]) => boolean
  getSelectedColors: () => string[]
}

function SelectedSequence(props: SelectedSequenceProps) {
  const {
    selectedIndices,
    currentColorSequence,
    COLORS,
    isPalindrome,
    getSelectedColors,
  } = props

  if (selectedIndices.length === 0) return null

  return (
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
                  COLORS.find((c) => c.name === currentColorSequence[index])
                    ?.value || currentColorSequence[index],
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
  )
}

export default SelectedSequence
