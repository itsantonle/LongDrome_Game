import React from 'react'
import Image from 'next/image'
import { GAME_CONFIG } from '@/app/page'

interface EnemyImageProps {
  amiability: number
}

function EnemyImage(props: EnemyImageProps) {
  const { amiability } = props

  // Determine the enemy image based on amiability levels
  let imageSrc = '/placeholder.svg?text=FriendlyGuardian&width=120&height=120'
  let imageClass = 'filter brightness-110'

  if (amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.HOSTILE) {
    imageSrc = '/placeholder.svg?text=HostileGuardian&width=120&height=120'
    imageClass = 'filter hue-rotate-180'
  } else if (amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY) {
    imageSrc = '/placeholder.svg?text=NeutralGuardian&width=120&height=120'
    imageClass = ''
  }

  return (
    <div className="absolute top-10 left-1/2 -translate-x-1/2">
      <div className="relative">
        <Image
          src={imageSrc}
          alt="Enemy"
          width={120}
          height={120}
          className={`object-contain ${imageClass}`}
        />
      </div>
    </div>
  )
}

export default EnemyImage
