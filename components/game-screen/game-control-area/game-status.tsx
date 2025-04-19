import React from 'react'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GameStatusProps {
  gameState: string
  startTurn: () => void
}

function GameStatus(props: GameStatusProps) {
  const { gameState, startTurn } = props

  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-medium">Game Status</h3>
      {gameState === 'idle' && (
        <Button
          variant="outline"
          size="sm"
          onClick={startTurn}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Start Turn</span>
        </Button>
      )}
      {(gameState === 'gameOver' || gameState === 'victory') && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Restart Game</span>
        </Button>
      )}
    </div>
  )
}

export default GameStatus
