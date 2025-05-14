import React from 'react'
import { Button } from '@/components/ui/button' // Adjust path if needed
import { getHomeAccessMessage } from '@/lib/game-utils'

interface HomeAccessModalProps {
  npcName: string
  gameState: string
  enemyAmiability: number
  isOpen: boolean
  onClose: () => void
}

function HomeAccessModal(props: HomeAccessModalProps) {
  const { gameState, enemyAmiability, isOpen, onClose, npcName } = props

  if (!isOpen) {
    return null // Prevent rendering when modal is closed
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-md rounded-lg border-2 border-primary/30 bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Home Access</h2>
        <p className="mb-6 text-center">
          {/* get the message based on enemy amiability, will only really show if game_config amiabiity threshold.friendly is not reached */}
          {getHomeAccessMessage(gameState, enemyAmiability, npcName)}
        </p>
        <div className="flex justify-center">
          <Button onClick={onClose}>Understood</Button>
        </div>
      </div>
    </div>
  )
}

export default HomeAccessModal
