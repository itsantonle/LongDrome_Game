// components/EnemyStatusBar.tsx

import React from 'react'

interface EnemyStats {
  hp: number
  maxHp: number
  amiability: number
}

interface EnemyStatusBarProps {
  gameState: string
  enemyStats: EnemyStats
  amiabilityChangeIndicator: number
  npcName: string
}

function EnemyStatusBar(props: EnemyStatusBarProps) {
  const { gameState, enemyStats, amiabilityChangeIndicator, npcName } = props

  // Render nothing if the game state is "home"
  if (gameState === 'home') {
    return null
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 p-2">
      <div className="flex items-center justify-between">
        <div className="text-xs text-white">{npcName}</div>
        <div className="text-xs text-white">
          {enemyStats.hp}/{enemyStats.maxHp} HP
        </div>
      </div>
      <div className="mt-1 h-2 w-full bg-gray-700 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-red-500"
          style={{
            width: `${(enemyStats.hp / enemyStats.maxHp) * 100}%`,
          }}
        ></div>
        {/* Amiability meter as a small bar at the top */}
        <div
          className="absolute top-0 left-0 h-1/3 bg-blue-500"
          style={{
            width: `${enemyStats.amiability}%`,
            opacity: 0.8,
          }}
        ></div>
        {/* Visual indicator for amiability changes */}
        {amiabilityChangeIndicator !== 0 && (
          <div
            className={`absolute top-0 right-0 px-2 py-0.5 text-xs font-bold rounded-bl-md ${
              amiabilityChangeIndicator > 0
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
            style={{
              animation: 'fadeOut 2s forwards',
            }}
          >
            {amiabilityChangeIndicator > 0
              ? `+${amiabilityChangeIndicator.toFixed(1)}`
              : amiabilityChangeIndicator.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnemyStatusBar
