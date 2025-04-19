/**
 * Game Dialog Component
 *
 * This component displays a dialog box with text content and optional portrait.
 * It's used for non-interactive dialogs in the Palindrome Guardian game.
 *
 * HOW TO USE:
 * - Import this component in your game page
 * - Control visibility with the isOpen prop
 * - Provide dialog content as a string or array of strings
 * - Handle dialog completion with the onComplete callback
 *
 * HOW TO MODIFY:
 * - To change dialog appearance: Edit the CSS classes and layout
 * - To adjust typewriter effect: Modify the typeSpeed prop or autoType logic
 * - To change dialog navigation: Edit the handleNext function
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const dialogVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity",
  {
    variants: {
      position: {
        center: "items-center",
        top: "items-start pt-16",
        bottom: "items-end pb-16",
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-full",
      },
    },
    defaultVariants: {
      position: "center",
      size: "md",
    },
  },
)

export interface GameDialogProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dialogVariants> {
  isOpen: boolean
  onClose: () => void
  title?: string
  content: string | string[]
  portrait?: string
  autoType?: boolean
  typeSpeed?: number
  hasNextButton?: boolean
  onComplete?: () => void
}

export function GameDialog({
  isOpen,
  onClose,
  title,
  content,
  portrait,
  autoType = true,
  typeSpeed = 30,
  hasNextButton = true,
  onComplete,
  className,
  position,
  size,
  ...props
}: GameDialogProps) {
  const [visible, setVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const contentArray = Array.isArray(content) ? content : [content]
  const currentContent = contentArray[currentPage]
  const isLastPage = currentPage === contentArray.length - 1

  // Handle dialog open/close
  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      // Only reset to first page when initially opening
      if (!visible) {
        setCurrentPage(0)
        if (autoType) {
          setDisplayedText("")
          setIsTyping(true)
        } else {
          setDisplayedText(contentArray[0])
        }
      }
    } else {
      setVisible(false)
    }
  }, [isOpen, autoType, contentArray, visible])

  // Handle typewriter effect
  useEffect(() => {
    if (!autoType || !isTyping || !visible) return

    let currentIndex = 0
    const maxLength = currentContent.length
    setDisplayedText("")

    const typingInterval = setInterval(() => {
      if (currentIndex < maxLength) {
        setDisplayedText((prev) => prev + currentContent.charAt(currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, typeSpeed)

    return () => clearInterval(typingInterval)
  }, [currentContent, autoType, isTyping, typeSpeed, visible])

  // Fix the useEffect for changing pages to properly update the displayed text
  useEffect(() => {
    // Only reset typing when the page actually changes
    if (visible) {
      if (autoType) {
        setDisplayedText("")
        setIsTyping(true)
      } else {
        setDisplayedText(currentContent)
      }
    }
  }, [currentPage, currentContent, autoType, visible])

  // Fix the handleNext function to properly advance pages
  const handleNext = () => {
    // If still typing, show full text immediately
    if (isTyping) {
      setDisplayedText(currentContent)
      setIsTyping(false)
      return
    }

    if (isLastPage) {
      onClose()
      if (onComplete) onComplete()
    } else {
      // Explicitly increment the page counter
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
    }
  }

  if (!visible) return null

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", className)} {...props}>
      <div
        className={cn(
          "w-full max-w-lg rounded-lg border-2 border-primary/30 bg-background p-0 shadow-lg",
          size === "sm" && "max-w-sm",
          size === "md" && "max-w-md",
          size === "lg" && "max-w-lg",
          size === "xl" && "max-w-xl",
          size === "full" && "max-w-full",
        )}
      >
        {/* Dialog Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
            <h3 className="font-semibold">{title}</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        )}

        {/* Dialog Content */}
        <div className="flex min-h-[150px] p-4">
          {portrait && (
            <div className="mr-4 h-20 w-20 shrink-0 overflow-hidden rounded-md border">
              <img
                src={portrait || "/placeholder.svg"}
                alt="Character portrait"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Dialog Content */}
          <div className="flex-1 font-medium">
            {displayedText}
            {isTyping && <span className="animate-pulse">▌</span>}
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="flex justify-between border-t border-border bg-muted/50 px-4 py-2">
          {/* Page indicator for multi-page dialogs */}
          {contentArray.length > 1 && (
            <div className="flex gap-1">
              {contentArray.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    index === currentPage ? "bg-primary" : "bg-muted-foreground/30",
                  )}
                />
              ))}
            </div>
          )}

          <div className="flex gap-2">
            {/* Close button always available */}
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>

            {/* Next button (only shown when not on last page) */}
            {!isLastPage && hasNextButton && (
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleNext}>
                {isTyping ? "Skip" : "Next"}
                {!isTyping && <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

