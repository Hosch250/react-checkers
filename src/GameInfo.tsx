import { useGameController } from './GameControllerContext'
import { Color, PlayerType, Variant } from './models/types'
import wpi from './Assets/WhitePlayerIcon.svg'
import bpi from './Assets/BlackPlayerIcon.svg'
import Button from 'react-bootstrap/esm/Button'
import NewGameModal from './NewGameModal'
import { useState } from 'react'

function GameInfo() {
  const { value } = useGameController()

  let winningPlayer = value.variant.apiMembers.winningPlayer(
    value.board,
    value.currentPlayer,
  )

  let winStatus = '*'
  if (winningPlayer === Color.Black && value.currentPlayer === Color.White) {
    winStatus = '0-1'
  } else if (winningPlayer === Color.White && value.currentPlayer === Color.Black) {
    winStatus = '1-0'
  } else if (
    value.variant.apiMembers.isDrawn(value.initialPosition, value.moveHistory)
  ) {
    winStatus = '½-½'
  }

  let variantName
  switch (value.variant.variant) {
    case Variant.AmericanCheckers:
      variantName = 'American Checkers'
      break
    case Variant.PoolCheckers:
      variantName = 'Pool Checkers'
      break
    case Variant.AmericanCheckersOptionalJump:
      variantName = 'American Checkers Optional Jump'
      break
  }

  let blackPlayerLabel = value.blackInfo.player === PlayerType.Human ? 'Human' : `Computer Level ${value.blackInfo.aiLevel}`
  let whitePlayerLabel = value.whiteInfo.player === PlayerType.Human ? 'Human' : `Computer Level ${value.whiteInfo.aiLevel}`
  
  const showState = useState(false)

  return (
    <div className="border border-dark">
      <div className="fw-bold px-2">{variantName}</div>
      <div
        className={`px-2 ${
          value.currentPlayer === Color.White ? 'fw-bold' : ''
        }`}
      >
        <img
          src={wpi}
          style={{ verticalAlign: 'middle', height: 15 }}
          alt="white"
        />{' '}
        {whitePlayerLabel}
      </div>
      <div
        className={`px-2 ${
          value.currentPlayer === Color.Black ? 'fw-bold' : ''
        }`}
      >
        <img
          src={bpi}
          style={{ verticalAlign: 'middle', height: 15 }}
          alt="black"
        />{' '}
        {blackPlayerLabel}
      </div>
      <div className="text-center">{winStatus}</div>
      <Button
        variant="secondary"
        onClick={(_) => showState[1](true)}
        className="w-100"
      >
        <i className="bi-plus-circle me-2"></i>
        <span>New Game</span>
      </Button>
      <NewGameModal showState={showState} />
    </div>
  )
}

export default GameInfo
