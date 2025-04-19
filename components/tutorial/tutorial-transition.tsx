/**
 * Tutorial Transition Component
 *
 * This component displays a step-by-step tutorial for the Palindrome Guardian game.
 * It introduces the player to the game mechanics, palindromes, and the Guardian.
 *
 * HOW TO USE:
 * - Import this component in your game page
 * - Render it when the game state is "tutorial"
 * - Pass an onComplete callback to handle tutorial completion
 *
 * HOW TO MODIFY:
 * - To change tutorial content: Edit the tutorialSteps array
 * - To adjust animations: Modify the motion.div properties
 * - To change the tutorial flow: Edit the useEffect and goToNextStep function
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ColorBlock } from '@/components/game-mechanics/color-block'

interface TutorialTransitionProps {
  onComplete: () => void
}

export function TutorialTransition({ onComplete }: TutorialTransitionProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Tutorial steps with content and examples
  const tutorialSteps = [
    {
      title: 'Welcome to Palindrome Guardian',
      content:
        "In this game, you'll face an Ancient Guardian who can only be defeated through the power of palindromes.",
      example: null,
    },
    {
      title: 'What is a Palindrome?',
      content:
        'A palindrome is a sequence that reads the same forward and backward. In this game, we use color sequences.',
      example: ['red', 'blue', 'red'],
    },
    {
      title: 'Game Mechanics',
      content:
        'Each turn, you must identify and select a palindromic sequence of colors to defend yourself.',
      example: ['green', 'yellow', 'purple', 'yellow', 'green'],
    },
    {
      title: 'Finding Palindromes',
      content:
        'Click on colors to select them. Your goal is to find the longest palindrome in the sequence.',
      example: ['black', 'orange', 'white', 'orange', 'black'],
    },
    {
      title: "The Guardian's Challenge",
      content:
        "The Guardian will always find the longest palindrome. If yours is shorter, you'll take damage!",
      example: ['blue', 'red', 'green', 'red', 'blue', 'yellow'],
    },
    {
      title: 'Using Magic',
      content:
        "If you're stuck, you can use magic (costs 20 MP) to reveal the longest palindrome.",
      example: ['purple', 'orange', 'yellow', 'orange', 'purple'],
    },
    {
      title: 'Talking to the Guardian',
      content:
        'Between turns, you can talk to the Guardian. Being friendly may restore your HP and MP!',
      example: null,
    },
    {
      title: 'Winning the Game',
      content:
        "Survive 10 rounds and maintain a good relationship with the Guardian to win. If your relationship is poor, you'll face a final challenge!",
      example: null,
    },
    {
      title: 'Going Home',
      content:
        "Once you've earned the Guardian's trust, you can return home to rest, read books about palindromes, and recover your strength.",
      example: null,
    },
  ]

  // Handle next step
  const goToNextStep = () => {
    if (isAnimating) return

    setIsAnimating(true)

    setTimeout(() => {
      if (currentStep < tutorialSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        onComplete()
      }
      setIsAnimating(false)
    }, 500)
  }

  // Auto-advance tutorial with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentStep])

  const currentTutorial = tutorialSteps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <motion.div
        className="w-full max-w-2xl rounded-lg border-2 border-primary/30 bg-background p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress indicator */}
        <div className="mb-4 flex justify-center gap-1">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-${
                index === currentStep ? '6' : '3'
              } rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-primary'
                  : index < currentStep
                  ? 'bg-primary/40'
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <h2 className="mb-4 text-center text-2xl font-bold">
          {currentTutorial.title}
        </h2>

        <p className="mb-6 text-center text-lg">{currentTutorial.content}</p>

        {/* Example visualization */}
        {currentTutorial.example && (
          <div className="mb-6">
            <div className="text-center text-sm text-muted-foreground mb-2">
              Example:
            </div>
            <div className="flex justify-center">
              <ColorBlock colors={currentTutorial.example} size="md" />
            </div>
            <div className="mt-2 text-center text-sm text-muted-foreground">
              {currentTutorial.example.join(' - ')}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={goToNextStep}
            disabled={isAnimating}
            className="flex items-center gap-1"
          >
            {currentStep < tutorialSteps.length - 1 ? (
              <>
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              <span>Start Game</span>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
