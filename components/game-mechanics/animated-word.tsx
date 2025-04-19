'use client'

import { useState, useEffect } from 'react'
import { ScrabbleTile } from '@/components/game-mechanics/scrabble-tile'

export interface AnimatedWordProps {
  word: string
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
    | 'none'
  staggerDelay?: number
  autoAnimate?: boolean
  autoAnimateDelay?: number
  isSelectable?: boolean
  onWordSelect?: () => void
  className?: string
}

export function AnimatedWord({
  word,
  variant = 'default',
  size = 'md',
  animation = 'fadeIn',
  staggerDelay = 100,
  autoAnimate = false,
  autoAnimateDelay = 3000,
  isSelectable = false,
  onWordSelect,
  className,
}: AnimatedWordProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [currentAnimation, setCurrentAnimation] = useState<string>(animation)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle auto animation
  useEffect(() => {
    if (!autoAnimate) return

    const interval = setInterval(() => {
      // Toggle between fadeIn and fadeOut
      setIsAnimating(true)
      setCurrentAnimation('fadeOut')

      setTimeout(() => {
        setCurrentAnimation('jumpIn')
        setTimeout(() => {
          setIsAnimating(false)
        }, word.length * staggerDelay + 500)
      }, 1000)
    }, autoAnimateDelay)

    return () => clearInterval(interval)
  }, [autoAnimate, autoAnimateDelay, word.length, staggerDelay])

  // Handle tile selection
  const handleTileSelect = (index: number) => {
    if (isAnimating) return

    if (isSelectable) {
      if (selectedIndex === index) {
        setSelectedIndex(null)
      } else {
        setSelectedIndex(index)
      }

      if (onWordSelect) {
        onWordSelect()
      }
    }
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      {word.split('').map((letter, index) => (
        <ScrabbleTile
          key={`${letter}-${index}`}
          letter={letter}
          variant={variant as any}
          size={size}
          animation={currentAnimation as any}
          animationDelay={index * staggerDelay}
          isSelectable={isSelectable}
          isSelected={selectedIndex === index}
          onSelect={() => handleTileSelect(index)}
        />
      ))}
    </div>
  )
}
