import React from 'react'
import { Button } from '@/components/ui/button' // Ensure correct casing
import { HomeIcon } from 'lucide-react' // Adjust path if needed

interface HomeTempleButtonsProps {
  gameState: string
  checkHomeAccess: () => void
  returnToTemple: () => void
  areButtonsDisabled: () => boolean
  canGoHome: boolean
  btnName?: string
}

function HomeTempleButtons(props: HomeTempleButtonsProps) {
  const {
    gameState,
    checkHomeAccess,
    returnToTemple,
    areButtonsDisabled,
    canGoHome,
    btnName = 'Ancient Temple',
  } = props

  return (
    <div className="mb-2 flex justify-center gap-2">
      <Button
        variant={gameState === 'home' ? 'default' : 'outline'}
        size="sm"
        onClick={checkHomeAccess}
        className={`flex items-center gap-1 rounded-t-md rounded-b-none border-b-0 px-4 py-2 ${
          canGoHome ? 'border-2 border-primary pulse-border' : ''
        }`}
        disabled={areButtonsDisabled()}
      >
        <HomeIcon className="h-4 w-4" />
        <span>Home</span>
      </Button>
      <Button
        variant={gameState !== 'home' ? 'default' : 'outline'}
        size="sm"
        onClick={returnToTemple}
        disabled={gameState !== 'home' || areButtonsDisabled()}
        className="flex items-center gap-1 rounded-t-md rounded-b-none border-b-0 px-4 py-2"
      >
        {btnName}
      </Button>
    </div>
  )
}

export default HomeTempleButtons
