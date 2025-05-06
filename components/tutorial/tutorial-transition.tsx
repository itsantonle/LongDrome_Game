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
import {
  ArrowBigDownIcon,
  ChevronRight,
  HomeIcon,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ColorBlock } from '@/components/game-mechanics/color-block'
import Image from 'next/image'
import SelectedSequence from '../game-screen/selection-area/selected-sequence'
import { COLORS } from '@/lib/palindrome-utils'
import ActionsButtons from '../game-screen/side-button-area/action-buttons'
import PlayerHPMP from '../game-screen/game-control-area/player-hp-mp'
import { cn } from '@/lib/utils'

interface TutorialTransitionProps {
  onComplete: () => void
}

export function TutorialTransition({ onComplete }: TutorialTransitionProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  interface TutorialStepsProps {
    title: string
    content: string
    example: string[] | null
    portrait?: string[] | null
    componenent?: React.ReactNode
  }

  // Tutorial steps with content and examples
  const tutorialSteps: TutorialStepsProps[] = [
    {
      title: 'You have arrived at LongDrome!',
      content:
        "In this game, you'll face an invincible entity, the Ancient Guardian, invincible to attacks and understanding to reason. The guardian may be friendly or hostile depending on your responses.",
      example: null,
      portrait: [
        '/ldrome_guardian.jpg',
        '/ldrome_guardian_friendly.jpg',
        '/ldrome_guardian_hostile.jpg',
      ],
    },
    {
      title: 'The Character? ',
      content:
        "A naive young fellow who seeks to learn the way of the patterns.  Your choice throughout the game affects the character's temperament",
      example: null,
      portrait: [
        '/ldrome_char.jpg',
        '/ldrome_char_weak.jpg',
        '/ldrome_char_critical.jpg',
      ],
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
      example: ['yellow', 'purple', 'yellow'],
      componenent: (
        <>
          <SelectedSequence
            selectedIndices={[1, 2, 3]}
            currentColorSequence={[
              'green',
              'yellow',
              'purple',
              'yellow',
              'green',
            ]}
            COLORS={COLORS}
            isPalindrome={() => {
              return true
            }}
            getSelectedColors={() => {
              return ['yellow', 'purple', 'yellow']
            }}
          />
          <p className="mr-3"></p>
          <SelectedSequence
            selectedIndices={[1, 2]}
            currentColorSequence={[
              'green',
              'yellow',
              'purple',
              'yellow',
              'green',
            ]}
            COLORS={COLORS}
            isPalindrome={() => {
              return false
            }}
            getSelectedColors={() => {
              return ['yellow', 'purple']
            }}
          />
        </>
      ),
    },
    {
      title: 'Action Buttons',
      content:
        'You can click on the actions buttons to do something. They can change based on your current location and perform different things such as heal hp, mp, start the turn or talk to the guardian.',
      example: null,
      componenent: (
        <>
          <div className="mr-5">
            <ActionsButtons
              handleRest={() => {
                console.log('rest')
              }}
              handleMagic={() => {
                console.log('magic')
              }}
              handleRead={() => {
                console.log('read')
              }}
              handleTalk={() => {
                console.log('talk')
              }}
              startTurn={() => {
                console.log('start turn')
              }}
              stats={{ mp: 50 }}
              gameState="idle"
              areButtonsDisabled={() => {
                return false
              }}
              gameText="Text"
              hasRestedThisTurn={false}
              hasTalkedThisRound={false}
            />
          </div>

          <ActionsButtons
            handleRest={() => {
              console.log('rest')
            }}
            handleMagic={() => {
              console.log('magic')
            }}
            handleRead={() => {
              console.log('read')
            }}
            handleTalk={() => {
              console.log('talk')
            }}
            startTurn={() => {
              console.log('start turn')
            }}
            stats={{ mp: 50 }}
            gameState="home"
            areButtonsDisabled={() => {
              return false
            }}
            gameText="Text"
            hasRestedThisTurn={false}
            hasTalkedThisRound={false}
          />
        </>
      ),
    },
    {
      title: 'Losing HP and MP',
      content:
        "The Guardian will always find the longest palindrome. If yours is shorter, you'll take damage! If you're stuck: You can use the Magic Action button but it takes 20 MP! If your health drops to 0, you'll have one last chance!",
      example: null,
      componenent: (
        <div className="flex flex-col gap-4 items-center">
          <div className="mb-2">
            <PlayerHPMP maxHp={100} hp={100} maxMp={50} mp={50} />
          </div>
          <ArrowBigDownIcon className="text-center" />{' '}
          <span className="text-sm text-muted-foreground hidden sm:block">
            {' '}
            Taking damage or using the Magic Action Button
          </span>
          <div>
            <PlayerHPMP maxHp={100} hp={50} maxMp={50} mp={30} />
          </div>
        </div>
      ),
    },

    {
      title: 'Talking to the Guardian',
      content:
        'Between turns, you can talk to the Guardian. Being friendly may restore your HP and MP!',
      example: null,
      componenent: (
        <>
          <Button
            variant="outline"
            size="lg"
            className={`flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 
            border-green-500 animate-pulse p-0 md:h-20 md:w-20`}
          >
            <MessageSquare className="h-6 w-6 text-green-500" />
            <span className="text-xs">Talk</span>
          </Button>
        </>
      ),
    },
    {
      title: 'Going Home',
      content:
        "Once you've earned the Guardian's trust, you can return home to rest, read books about palindromes, and recover your strength! You can try to raise the guardian's amiability by choosing correct  responses!",
      example: null,
      componenent: (
        <>
          <div className="flex flex-col gap-4 items-center">
            <p className="text-muted-foreground text-xs hidden block:sm">
              {' '}
              Response options
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  text: 'This is a somewhat positive option',
                  type: 'positive',
                },
                {
                  text: 'This is a somewhat negative option',
                  type: 'negative',
                },
              ].map((option, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    console.log('clicked option')
                  }}
                  variant={
                    option.type === 'positive'
                      ? 'default'
                      : option.type === 'negative'
                      ? 'outline'
                      : 'secondary'
                  }
                  className={cn(
                    'justify-start text-left',
                    option.type === 'positive' &&
                      'border-l-4 border-l-green-500',
                    option.type === 'negative' && 'border-l-4 border-l-red-500'
                  )}
                >
                  {/* Pass the exact text without any transformation */}
                  {option.text}
                </Button>
              ))}
            </div>
            <ArrowBigDownIcon />
            <p className="text-muted-foreground text-xs hidden block:sm">
              {' '}
              Improve Amiability to be able to Go Home
            </p>
            <Button
              variant="default"
              size="sm"
              className={`flex items-center gap-1 rounded-t-md rounded-b-none border-b-0 px-4 py-2 
            border-2 border-primary pulse-border`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Home</span>
            </Button>
          </div>
        </>
      ),
    },
    {
      title: 'Winning the Game',
      content:
        "Survive 6 rounds and maintain a good relationship with the Guardian to win. If your relationship is poor, you'll face a final challenge!",
      example: null,
      componenent: (
        <div className="border-t-2 border-primary/30 bg-muted/80 p-4">
          <p className="font-mono text-sm leading-relaxed">
            {'Round 6 Complete!'}
          </p>
        </div>
      ),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto overflow-x-clip">
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

        <h2 className="mb-4 text-center text-lg sm:text-2xl  font-bold">
          {currentTutorial.title}
        </h2>

        <p className="mb-6 text-center text-sm sm:text-lg ">
          {currentTutorial.content}
        </p>

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
        {/* Portrait  */}
        {currentTutorial.portrait && (
          <div className="mb-6">
            <div className="text-center text-sm text-muted-foreground mb-2">
              Portraits
            </div>
            <div className="flex justify-center">
              {currentTutorial.portrait.map((link) => {
                return (
                  <Image
                    key={link}
                    src={link}
                    alt="portrait"
                    width={100}
                    height={100}
                    className="mr-2 rounded-sm"
                  />
                )
              })}
            </div>
            <div className="mt-2 text-center text-sm text-muted-foreground">
              {/* {currentTutorial.example.join(' - ')} */}
            </div>
          </div>
        )}

        {/* Component */}
        {currentTutorial.componenent && (
          <div className="mb-6">
            <div className="flex justify-center">
              {currentTutorial.componenent}
              {/* <ColorBlock colors={currentTutorial.example} size="md" /> */}
            </div>
            <div className="mt-2 text-center text-sm text-muted-foreground">
              {/* {currentTutorial.example.join(' - ')} */}
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
