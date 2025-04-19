import React from 'react'
import { Heart } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface PlayerHPMPProps {
  hp: number
  maxHp: number
  mp: number
  maxMp: number
}

function PlayerHPMP(props: PlayerHPMPProps) {
  const { hp, maxHp, mp, maxMp } = props

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* HP Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">HP</span>
          </div>
          <span className="text-sm">
            {hp}/{maxHp}
          </span>
        </div>
        <Progress
          value={(hp / maxHp) * 100}
          className="h-2 bg-muted"
          indicatorClassName="bg-red-500"
        />
      </div>

      {/* MP Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded-full bg-blue-500" />
            <span className="text-sm font-medium">MP</span>
          </div>
          <span className="text-sm">
            {mp}/{maxMp}
          </span>
        </div>
        <Progress
          value={(mp / maxMp) * 100}
          className="h-2 bg-muted"
          indicatorClassName="bg-blue-500"
        />
      </div>
    </div>
  )
}

export default PlayerHPMP
