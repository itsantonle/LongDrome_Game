'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { AnimatedWord } from '@/components/game-mechanics/animated-word'

export interface SceneTransitionProps<T> {
  scenes: T[]
  duration?: number
  component: React.ComponentType<{ content: T }>
  transitionAnimation?:
    | 'fadeIn'
    | 'fadeOut'
    | 'jumpIn'
    | 'bounceIn'
    | 'spinIn'
    | 'spinOut'
  onComplete?: () => void
  autoRestart?: boolean
  className?: string
}

export function SceneTransition<T>({
  scenes,
  duration = 2000,
  component: Component,
  transitionAnimation = 'fadeIn',
  onComplete,
  autoRestart = false,
  className,
}: SceneTransitionProps<T>) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [key, setKey] = useState(0) // Used to force re-render of component
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Reset function
  const resetTransition = () => {
    setCurrentSceneIndex(0)
    setIsTransitioning(false)
    setIsComplete(false)
    setKey((prev) => prev + 1) // Force re-render
  }

  // Check if we're on the last scene
  const isLastScene = currentSceneIndex === scenes.length - 1

  // Handle scene transitions
  useEffect(() => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (scenes.length <= 1) {
      setIsComplete(true)
      if (onComplete) onComplete()
      return
    }

    // Don't set a new timer if we're complete and not auto-restarting
    if (isComplete && !autoRestart) {
      return
    }

    timerRef.current = setTimeout(() => {
      if (isLastScene) {
        setIsComplete(true)
        if (onComplete) onComplete()

        // If autoRestart is true, go back to the first scene after completing
        if (autoRestart) {
          timerRef.current = setTimeout(() => {
            resetTransition()
          }, duration / 2)
        }
      } else {
        setIsTransitioning(true)

        // Wait for transition animation to complete before showing next scene
        timerRef.current = setTimeout(() => {
          setCurrentSceneIndex((prev) => prev + 1)
          setIsTransitioning(false)
          setKey((prev) => prev + 1) // Force re-render
        }, 500) // Half a second for transition
      }
    }, duration)

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [
    currentSceneIndex,
    duration,
    isLastScene,
    onComplete,
    scenes.length,
    autoRestart,
    isComplete,
  ])

  return (
    <div className={className}>
      <Component key={key} content={scenes[currentSceneIndex]} />

      {/* Optional: Display transition progress */}
      {scenes.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {scenes.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                index === currentSceneIndex
                  ? 'bg-primary'
                  : index < currentSceneIndex
                  ? 'bg-primary/40'
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      )}

      {/* Optional: Display completion status */}
      {isComplete && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Transition complete
        </div>
      )}
    </div>
  )
}

// Specialized version for AnimatedWord
export interface WordSceneTransitionProps {
  words: string[]
  duration?: number
  variant?:
    | 'default'
    | 'dark'
    | 'blood'
    | 'bone'
    | 'poison'
    | 'wildcard'
    | 'special'
    | 'bonus'
    | 'selected'
  size?: 'sm' | 'md' | 'lg'
  animation?:
    | 'fadeIn'
    | 'fadeOut'
    | 'jumpIn'
    | 'bounceIn'
    | 'spinIn'
    | 'spinOut'
  staggerDelay?: number
  onComplete?: () => void
  autoRestart?: boolean
  className?: string
}

export function WordSceneTransition({
  words,
  duration = 2000,
  variant = 'default',
  size = 'md',
  animation = 'fadeIn',
  staggerDelay = 100,
  onComplete,
  autoRestart = false,
  className,
}: WordSceneTransitionProps) {
  return (
    <SceneTransition
      scenes={words}
      duration={duration}
      component={({ content }) => (
        <AnimatedWord
          word={content}
          variant={variant as any}
          size={size}
          animation={animation as any}
          staggerDelay={staggerDelay}
          isSelectable={false}
        />
      )}
      transitionAnimation={animation}
      onComplete={onComplete}
      autoRestart={autoRestart}
      className={className}
    />
  )
}
