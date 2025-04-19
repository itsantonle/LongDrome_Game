import React from 'react'
import { Button } from '@/components/ui/button' // Ensure correct casing
import { AnimatedWord } from '../game-mechanics/animated-word'

interface ReadingBookModalProps {
  isOpen: boolean
  onClose: () => void
}

function ReadingBookModal(props: ReadingBookModalProps) {
  const { isOpen, onClose } = props

  if (!isOpen) {
    return null // Prevent rendering when modal is closed
  }

  return (
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

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="space-y-4">
            <p>
              Manacher's Algorithm is an efficient way to find all palindromic
              substrings in a sequence. It works in linear time O(n), making it
              much faster than naive approaches which run in O(n²) or O(n³)
              time.
            </p>

            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-2 font-medium">Key Steps:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Transform the input:</strong> Insert markers to handle
                  both odd/even length palindromes.
                </li>
                <li>
                  <strong>Initialize arrays:</strong> Create an array to store
                  palindrome lengths.
                </li>
                <li>
                  <strong>Use symmetry:</strong> Leverage palindrome symmetry to
                  reduce computations.
                </li>
                <li>
                  <strong>Expand around centers:</strong> Expand outward from
                  each position to find longest palindromes.
                </li>
                <li>
                  <strong>Track boundaries:</strong> Maintain a right boundary
                  for optimization.
                </li>
                <li>
                  <strong>Find the maximum:</strong> Identify the longest
                  palindrome across all centers.
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

            {/* Example walkthrough */}
            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-2 font-medium">Example Walkthrough:</h4>
              <p className="mb-2">For the sequence "RACECAR":</p>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                <li>Transform to "#R#A#C#E#C#A#R#" (adding markers).</li>
                <li>Initialize palindrome length array P.</li>
                <li>For each position, calculate palindrome length.</li>
                <li>
                  When reaching 'E', identify it as the center of the longest
                  palindrome.
                </li>
                <li>Algorithm efficiently determines P[center] = 7.</li>
                <li>Corresponds to full "RACECAR" in the original string.</li>
              </ol>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-2 font-medium">Time Complexity Analysis:</h4>
              <p>
                Despite having nested loops, Manacher’s Algorithm achieves O(n)
                time complexity due to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Each position is the center of at most one expansion.</li>
                <li>
                  Algorithm reuses previous calculations via the mirror
                  property.
                </li>
                <li>The right boundary only moves forward, never backward.</li>
                <li>Each character is processed at most twice.</li>
              </ul>
              <p className="mt-2">
                This makes it dramatically faster than naive approaches checking
                every substring in O(n³).
              </p>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-2 font-medium">Practical Applications:</h4>
              <p>Palindrome detection is used in:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Computational biology (DNA sequence analysis).</li>
                <li>Text processing and pattern matching.</li>
                <li>Natural language processing.</li>
                <li>Data compression algorithms.</li>
                <li>Cryptography and security.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fixed footer */}
        <div className="border-t p-4 flex justify-center">
          <Button onClick={onClose}>Close Book</Button>
        </div>
      </div>
    </div>
  )
}

export default ReadingBookModal
