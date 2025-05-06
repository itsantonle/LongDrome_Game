import React from 'react'
import Image from 'next/image'
import { GAME_CONFIG } from '@/app/page'
// Assuming it's imported here

interface CharacterImageProps {
  hp: number
  maxHp: number
}

function CharacterImage(props: CharacterImageProps) {
  const { hp, maxHp } = props
  const healthRatio = hp / maxHp

  // Determine character image based on health thresholds
  let imageSrc = '/ldrome_char.jpg'
  let imageClass = ''

  if (healthRatio <= GAME_CONFIG.HEALTH_THRESHOLDS.CRITICAL) {
    imageSrc = '/ldrome_char_critical.jpg'
    imageClass = 'opacity-80'
  } else if (healthRatio <= GAME_CONFIG.HEALTH_THRESHOLDS.WEAKENED) {
    imageSrc = '/ldrome_char_weak.jpg'
    imageClass = 'opacity-80'
  }

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 ">
      <Image
        src={imageSrc}
        alt="Character"
        width={64}
        height={96}
        className={`object-contain ${imageClass} rounded-md`}
      />
    </div>
  )
}

export default CharacterImage
