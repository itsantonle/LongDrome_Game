import React from 'react'
import { AlertCircle } from 'lucide-react'

interface GameAlertProps {
  gameState: string
}

function GameAlert(props: GameAlertProps) {
  const { gameState } = props

  // Define game status messages
  const gameMessage =
    gameState === 'idle'
      ? "Click 'Start Turn' to begin"
      : gameState === 'userTurn'
      ? 'Select a palindromic sequence'
      : gameState === 'enemyTurn'
      ? 'Enemy is taking their turn'
      : gameState === 'home'
      ? 'You are at home. Rest, read, or talk'
      : gameState === 'gameOver'
      ? 'Game Over'
      : gameState === 'victory'
      ? 'You have won!'
      : 'Tutorial in progress'

  return (
    <div className="mt-4">
      <div className="text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          <span>{gameMessage}</span>
        </div>
      </div>
    </div>
  )
}

export default GameAlert
