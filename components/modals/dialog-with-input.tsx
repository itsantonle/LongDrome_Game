/**
 * Dialog With Input Component
 *
 * This component displays a dialog box with text content and predefined response buttons.
 * It's used for interactive conversations with the Guardian in the Palindrome Guardian game.
 *
 * HOW TO USE:
 * - Import this component in your game page
 * - Control visibility with the isOpen prop
 * - Provide dialog content as a string or array of strings
 * - Handle user responses with the onRespond callback
 * - Customize response options with the responseOptions prop
 *
 * HOW TO MODIFY:
 * - To change dialog appearance: Edit the CSS classes and layout
 * - To adjust typewriter effect: Modify the typeSpeed prop or autoType logic
 * - To change response options: Modify the responseOptions prop
 * - To change button styles: Edit the Button components in the render function
 * - To add images: Add an image prop and render it in the component
 */

'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface DialogWithInputProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  content: string | string[]
  portrait?: string
  autoType?: boolean
  typeSpeed?: number
  onRespond?: (response: string) => void
  turnCount?: number
  // New prop for predefined response options
  responseOptions?: Array<{
    text: string
    type: 'positive' | 'negative' | 'neutral'
  }>
  placeholder?: string
  showCursor?: boolean
}

export function DialogWithInput({
  isOpen,
  onClose,
  title,
  content,
  portrait,
  autoType = true,
  typeSpeed = 30,
  onRespond,
  turnCount = 0,
  // Default response options if none provided
  responseOptions = [
    {
      text: 'I seek to understand the balance of these patterns.',
      type: 'positive',
    },
    { text: 'I need to learn more about this symmetry.', type: 'positive' },
    {
      text: 'I demand to know the power behind these colors!',
      type: 'negative',
    },
    { text: "I'll take whatever knowledge I can get.", type: 'negative' },
  ],
  placeholder = 'What will you say...',
  showCursor = false,
}: DialogWithInputProps) {
  const [visible, setVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
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
          setDisplayedText('')
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
    setDisplayedText('')

    const typingInterval = setInterval(() => {
      if (currentIndex < maxLength) {
        // Create a new string instead of appending to prevent text transformation issues
        const newText = currentContent.substring(0, currentIndex + 1)
        setDisplayedText(newText)
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
        setDisplayedText('')
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

    if (!isLastPage) {
      // Explicitly increment the page counter
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
    }
    // On last page, do nothing - user needs to respond or close
  }

  // Handle user response selection
  const handleResponseSelect = (response: string) => {
    if (onRespond) {
      onRespond(response)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg border-2 border-primary/30 bg-background p-0 shadow-lg max-h-[90vh] flex flex-col">
        {/* Dialog Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
            <h3 className="font-semibold">{title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        )}

        {/* Dialog Content */}
        <div className="flex min-h-[100px] p-4 overflow-auto">
          {portrait && (
            <div className="mr-4 h-20 w-20 shrink-0 overflow-hidden rounded-md border">
              <img
                src={portrait || '/placeholder.svg'}
                alt="Character portrait"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Display text normally without any special formatting */}
          <div className="flex-1 font-medium">
            <div
              className="text-sm sm:text-lg"
              dangerouslySetInnerHTML={{
                __html: displayedText.replace(/\n/g, '<br>'),
              }}
            />
            {isTyping && showCursor && <span className="animate-pulse">▌</span>}
          </div>
        </div>

        {/* Response Options */}
        <div className="border-t border-border bg-muted/30 px-4 py-3 overflow-y-auto overflow-x-hidden">
          {/* Response Buttons */}
          <div className="grid grid-cols-1 gap-2">
            {responseOptions.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleResponseSelect(option.text)}
                variant={
                  option.type === 'positive'
                    ? 'default'
                    : option.type === 'negative'
                    ? 'outline'
                    : 'secondary'
                }
                className={cn(
                  'justify-start text-left overflow-x-auto overflow-y-hidden text-xs sm:text-sm',
                  option.type === 'positive' && 'border-l-4 border-l-green-500',
                  option.type === 'negative' && 'border-l-4 border-l-red-500'
                )}
              >
                {option.text}
              </Button>
            ))}
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
                    'h-1.5 w-1.5 rounded-full',
                    index === currentPage
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30'
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

            {/* Next button (only shown when not on last page or when typing) */}
            {(!isLastPage || isTyping) && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleNext}
              >
                {isTyping ? 'Skip' : 'Next'}
                {!isTyping && <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
