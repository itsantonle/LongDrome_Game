/**
 * Color Block Component
 *
 * This component displays a sequence of colored blocks.
 * It's used in the Palindrome Guardian game to visualize color sequences.
 *
 * HOW TO USE:
 * - Import this component in your game components
 * - Pass an array of color names to the colors prop
 * - Customize appearance with size, spacing, and border props
 * - Optionally show color labels with showLabels prop
 *
 * HOW TO MODIFY:
 * - To add new colors: Add them to the COLORS object
 * - To change block appearance: Modify the colorBlockVariants
 * - To adjust sizing: Edit the getBlockWidth function
 */

"use client"

import type React from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Define available colors
const COLORS = {
  black: "#000000",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#00FF00",
  yellow: "#FFFF00",
  purple: "#800080",
  orange: "#FFA500",
  white: "#FFFFFF",
}

const colorBlockVariants = cva("flex rounded-md overflow-hidden", {
  variants: {
    size: {
      sm: "h-6",
      md: "h-10",
      lg: "h-16",
    },
    spacing: {
      none: "gap-0",
      sm: "gap-0.5",
      md: "gap-1",
      lg: "gap-2",
    },
    border: {
      none: "border-0",
      thin: "border border-border",
      medium: "border-2 border-border",
    },
  },
  defaultVariants: {
    size: "md",
    spacing: "none",
    border: "none",
  },
})

export interface ColorBlockProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof colorBlockVariants> {
  colors: string[]
  showLabels?: boolean
}

export function ColorBlock({
  colors,
  showLabels = false,
  className,
  size,
  spacing,
  border,
  ...props
}: ColorBlockProps) {
  // Function to get the color value from the name
  const getColorValue = (colorName: string) => {
    return COLORS[colorName.toLowerCase() as keyof typeof COLORS] || colorName
  }

  // Determine block width based on the number of colors
  const getBlockWidth = () => {
    const blockCount = colors.length
    if (size === "sm") return `${blockCount * 20}px`
    if (size === "lg") return `${blockCount * 40}px`
    return `${blockCount * 30}px` // Default for medium
  }

  return (
    <div
      className={cn(colorBlockVariants({ size, spacing, border }), className)}
      style={{ width: getBlockWidth() }}
      {...props}
    >
      {colors.map((color, index) => (
        <div key={index} className="flex-1 relative" style={{ backgroundColor: getColorValue(color) }}>
          {showLabels && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              <span className={`${color.toLowerCase() === "black" ? "text-white" : "text-black"}`}>{color}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

