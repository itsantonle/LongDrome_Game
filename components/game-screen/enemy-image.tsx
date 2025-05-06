import React from 'react'
import Image from 'next/image'
import { GAME_CONFIG } from '@/app/page'

interface EnemyImageProps {
  amiability: number
}

function EnemyImage(props: EnemyImageProps) {
  const { amiability } = props

  // Determine the enemy image based on amiability levels
  let imageSrc = '/ldrome_guardian_friendly.jpg'
  let imageClass = 'filter brightness-110'

  if (amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.HOSTILE) {
    imageSrc = '/ldrome_guardian_hostile.jpg'
    imageClass = 'filter hue-rotate-180'
  } else if (amiability < GAME_CONFIG.AMIABILITY_THRESHOLDS.FRIENDLY) {
    imageSrc = '/ldrome_guardian.jpg'
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
          className={`object-contain ${imageClass} rounded-md`}
        />
      </div>
    </div>
  )
}

export default EnemyImage
