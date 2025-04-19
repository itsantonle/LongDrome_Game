"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tileVariants = cva(
  "relative flex items-center justify-center select-none font-bold text-center text-zinc-800 border-b-4 rounded shadow-md",
  {
    variants: {
      size: {
        sm: "w-8 h-8 text-lg",
        md: "w-12 h-12 text-2xl",
        lg: "w-16 h-16 text-3xl",
      },
      variant: {
        default: "bg-gradient-to-b from-amber-200 to-amber-100 border-amber-800",
        special: "bg-gradient-to-b from-indigo-200 to-indigo-100 border-indigo-800",
        bonus: "bg-gradient-to-b from-red-200 to-red-100 border-red-800",
        selected: "bg-gradient-to-b from-yellow-200 to-yellow-100 border-yellow-800 ring-2 ring-yellow-500",
        dark: "bg-gradient-to-b from-zinc-700 to-zinc-800 border-black text-red-500 shadow-inner shadow-red-900/20",
        blood: "bg-gradient-to-b from-red-900 to-red-950 border-black text-red-400 shadow-inner shadow-red-500/20",
        bone: "bg-gradient-to-b from-stone-300 to-stone-200 border-stone-800 text-stone-800 shadow-inner shadow-amber-500/10",
        poison:
          "bg-gradient-to-b from-green-800 to-green-900 border-black text-green-400 shadow-inner shadow-green-500/20",
        wildcard:
          "bg-gradient-to-b from-purple-700 to-purple-900 border-black text-white shadow-inner shadow-purple-500/30",
      },
      animation: {
        none: "transition-transform hover:translate-y-[-2px] active:translate-y-[0px] active:border-b-2",
        fadeIn: "animate-in fade-in duration-500 slide-in-from-bottom-4",
        fadeOut: "animate-out fade-out duration-500 slide-out-to-bottom-4",
        jumpIn: "animate-in fade-in duration-500 slide-in-from-bottom-8 zoom-in-95",
        bounceIn: "animate-in fade-in duration-500 slide-in-from-bottom-4 zoom-in-95",
        spinIn: "animate-in fade-in duration-500 spin-in",
        spinOut: "animate-out fade-out duration-500 spin-out",
      },
      isSelectable: {
        true: "cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all active:scale-95",
        false: "",
      },
      isSelected: {
        true: "ring-2 ring-primary scale-110 z-10",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      animation: "none",
      isSelectable: false,
      isSelected: false,
    },
  },
)

export interface ScrabbleTileProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tileVariants> {
  letter: string
  showValue?: boolean
  animationDelay?: number
  onSelect?: () => void
}

export function ScrabbleTile({
  letter,
  showValue = false,
  animationDelay = 0,
  onSelect,
  className,
  size,
  variant,
  animation,
  isSelectable,
  isSelected,
  style,
  onClick,
  ...props
}: ScrabbleTileProps) {
  const [currentAnimation, setCurrentAnimation] = useState(animation)
  const [isVisible, setIsVisible] = useState(animation !== "fadeOut" && animation !== "spinOut")

  // Handle animation delay
  useEffect(() => {
    if (animationDelay > 0 && animation !== "none") {
      const timer = setTimeout(() => {
        setCurrentAnimation(animation)
      }, animationDelay)

      return () => clearTimeout(timer)
    } else {
      setCurrentAnimation(animation)
    }
  }, [animation, animationDelay])

  // Handle visibility based on animation
  useEffect(() => {
    if (animation === "fadeOut" || animation === "spinOut") {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 500) // Match the duration of the animation

      return () => clearTimeout(timer)
    } else {
      setIsVisible(true)
    }
  }, [animation])

  // Ensure we only use the first character if multiple are provided
  const displayLetter = letter.charAt(0)

  if (!isVisible) return null

  // Handle click event
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Call the provided onClick handler if it exists
    if (onClick) {
      onClick(e)
    }

    // Call onSelect if it exists and the tile is selectable
    if (isSelectable && onSelect) {
      onSelect()
    }
  }

  return (
    <div
      className={cn(
        tileVariants({
          size,
          variant,
          animation: currentAnimation,
          isSelectable,
          isSelected,
        }),
        className,
      )}
      style={{
        ...style,
        animationDelay: animationDelay > 0 ? `${animationDelay}ms` : undefined,
      }}
      onClick={handleClick}
      {...props}
    >
      {displayLetter}

      {/* Visual feedback for active state */}
      {isSelectable && (
        <div className="absolute inset-0 rounded bg-white opacity-0 transition-opacity active:opacity-10"></div>
      )}
    </div>
  )
}

