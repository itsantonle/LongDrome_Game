"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Volume2, VolumeX, Music, Music2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const soundButtonVariants = cva("relative transition-all duration-200", {
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    },
    variant: {
      default: "",
      circle: "rounded-full",
      square: "rounded-md",
    },
    mode: {
      minimal: "",
      labeled: "flex items-center gap-2 px-3 w-auto",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "circle",
    mode: "minimal",
  },
})

export interface SoundButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof soundButtonVariants> {
  type?: "sfx" | "music" | "master"
  defaultOn?: boolean
  showTooltip?: boolean
  onChange?: (isOn: boolean) => void
  label?: string
}

export function SoundButton({
  type = "sfx",
  defaultOn = true,
  showTooltip = true,
  onChange,
  label,
  className,
  size,
  variant,
  mode,
  ...props
}: SoundButtonProps) {
  const [isOn, setIsOn] = useState(defaultOn)

  // Call onChange when sound state changes
  useEffect(() => {
    if (onChange) {
      onChange(isOn)
    }
  }, [isOn, onChange])

  // Toggle sound state
  const toggleSound = () => {
    setIsOn(!isOn)
  }

  // Determine which icon to use based on type and state
  const Icon = isOn ? (type === "music" ? Music : Volume2) : type === "music" ? Music2 : VolumeX

  // Determine tooltip text
  const tooltipText = isOn
    ? `${type === "music" ? "Music" : "Sound"} On`
    : `${type === "music" ? "Music" : "Sound"} Off`

  // Determine label text if not provided
  const displayLabel = label || (type === "music" ? "Music" : "Sound Effects")

  const button = (
    <Button
      type="button"
      variant={isOn ? "default" : "outline"}
      size={size === "lg" ? "lg" : size === "sm" ? "sm" : "default"}
      className={cn(soundButtonVariants({ size, variant, mode }), mode === "labeled" && "justify-start", className)}
      onClick={toggleSound}
      {...props}
    >
      <Icon className={cn("h-4 w-4", size === "sm" && "h-3 w-3", size === "lg" && "h-5 w-5")} />

      {mode === "labeled" && <span className="ml-2">{displayLabel}</span>}

      {/* Visual indicator for on/off state */}
      {variant === "circle" && mode === "minimal" && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
            isOn ? "bg-green-500" : "bg-red-500",
          )}
        />
      )}
    </Button>
  )

  // Wrap with tooltip if showTooltip is true
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}

