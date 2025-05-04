import React from 'react'
import Image from 'next/image'

function GameBackground(props: { gameState: string }) {
  const { gameState } = props

  // Define image source and alt text based on game state
  let imageSrc = '/ldrome_bg_temple.jpg'
  let altText = 'Ancient Temple'

  if (gameState === 'home') {
    imageSrc = '/ldrome_bg_home.jpg'
    altText = 'Home'
  } else if (gameState === 'victory') {
    imageSrc = '/ldrome_bg_victory.jpg'
    altText = 'Victory'
  } else if (gameState === 'gameOver') {
    imageSrc = '/ldrome_bg_defeat.jpg'
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
