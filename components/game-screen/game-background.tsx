import React from 'react'
import Image from 'next/image'

function GameBackground(props: { gameState: string }) {
  const { gameState } = props

  // Define image source and alt text based on game state
  let imageSrc = '/placeholder.svg?text=AncientTemple&width=640&height=360'
  let altText = 'Ancient Temple'

  if (gameState === 'home') {
    imageSrc = '/placeholder.svg?text=Home&width=640&height=360'
    altText = 'Home'
  } else if (gameState === 'victory') {
    imageSrc = '/placeholder.svg?text=Victory&width=640&height=360'
    altText = 'Victory'
  } else if (gameState === 'gameOver') {
    imageSrc = '/placeholder.svg?text=Defeat&width=640&height=360'
    altText = 'Defeat'
  }

  return (
    <Image
      src={imageSrc}
      alt={altText}
      fill
      className="object-cover opacity-50"
    />
  )
}

export default GameBackground
