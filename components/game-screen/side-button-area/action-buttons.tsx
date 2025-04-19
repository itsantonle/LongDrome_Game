import React from 'react'

import { MessageSquare, Sword } from 'lucide-react' // Ensure proper icon imports
import { Button } from '@/components/ui/button'
import { GAME_CONFIG } from '@/app/page'

interface ActionsButtonsProps {
  gameState: string
  handleRest: () => void
  handleRead: () => void
  handleTalk: () => void
  handleMagic: () => void
  startTurn: () => void
  hasRestedThisTurn: boolean
  hasTalkedThisRound: boolean
  areButtonsDisabled: () => boolean
  gameText: string
  stats: { mp: number }
}

function ActionsButtons(props: ActionsButtonsProps) {
  const {
    gameState,
    handleRest,
    handleRead,
    handleTalk,
    handleMagic,
    startTurn,
    hasRestedThisTurn,
    hasTalkedThisRound,
    areButtonsDisabled,
    gameText,
    stats,
  } = props

  return (
    <div className="flex flex-row justify-center gap-2 md:flex-col md:justify-start">
      {gameState === 'home' ? (
        <>
          <Button
            variant="outline"
            size="lg"
            onClick={handleRest}
            disabled={hasRestedThisTurn || areButtonsDisabled()}
            className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
          >
            <div className="flex h-6 w-6 items-center justify-center text-blue-500">
              <span className="text-lg">💤</span>
            </div>
            <span className="text-xs">Rest</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleRead}
            disabled={areButtonsDisabled()}
            className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
          >
            <div className="flex h-6 w-6 items-center justify-center text-amber-500">
              <span className="text-lg">📚</span>
            </div>
            <span className="text-xs">Read</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleTalk}
            disabled={areButtonsDisabled()}
            className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
          >
            <MessageSquare className="h-6 w-6 text-green-500" />
            <span className="text-xs">Think</span>
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            size="lg"
            onClick={startTurn}
            disabled={gameState !== 'idle' || areButtonsDisabled()}
            className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
          >
            <Sword className="h-6 w-6 text-red-500" />
            <span className="text-xs">Fight</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleTalk}
            disabled={
              gameState !== 'idle' || hasTalkedThisRound || areButtonsDisabled()
            }
            className={`flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 ${
              gameState === 'idle' &&
              !hasTalkedThisRound &&
              gameText.includes('Talk to the Guardian')
                ? 'border-green-500 animate-pulse'
                : 'border-primary/30'
            } p-0 md:h-20 md:w-20`}
          >
            <MessageSquare className="h-6 w-6 text-green-500" />
            <span className="text-xs">Talk</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleMagic}
            disabled={
              gameState !== 'userTurn' ||
              stats.mp < GAME_CONFIG.MAGIC_COST ||
              areButtonsDisabled()
            }
            className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
          >
            <div className="flex h-6 w-6 items-center justify-center text-blue-500">
              <span className="text-lg">✨</span>
            </div>
            <span className="text-xs">Magic</span>
          </Button>
        </>
      )}
    </div>
  )
}

export default ActionsButtons
