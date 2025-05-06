import React from 'react'

interface ColorSequenceProps {
  currentColorSequence: string[]
  selectedIndices: number[]
  showOptimalPalindrome: boolean
  optimalPalindrome: { start: number; length: number }
  COLORS: { name: string; value: string }[]
  toggleBlockSelection: (index: number) => void
}

function ColorSequence(props: ColorSequenceProps) {
  const {
    currentColorSequence,
    selectedIndices,
    showOptimalPalindrome,
    optimalPalindrome,
    COLORS,
    toggleBlockSelection,
  } = props

  if (currentColorSequence.length === 0) return null

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md overflow-auto">
      <div className="space-y-4">
        {/* Current Color Sequence */}
        <div className="flex justify-center">
          <div className="flex space-x-1 p-2 bg-black/40 rounded-md">
            {currentColorSequence.map((color, index) => {
              const isSelected = selectedIndices.includes(index)
              const isPartOfPalindrome =
                showOptimalPalindrome &&
                index >= optimalPalindrome.start &&
                index < optimalPalindrome.start + optimalPalindrome.length

              return (
                <div
                  key={index}
                  className={`w-8 h-8 cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-violet-400 scale-110' : ''
                  } ${isPartOfPalindrome ? 'ring-2 ring-yellow-500' : ''}`}
                  style={{
                    backgroundColor:
                      COLORS.find((c) => c.name === color)?.value || color,
                  }}
                  onClick={() => toggleBlockSelection(index)}
                ></div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorSequence
