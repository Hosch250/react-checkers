import { useGameController } from './GameControllerContext'
import { Player, Variant } from './models/types'
import wpi from './Assets/WhitePlayerIcon.svg'
import bpi from './Assets/BlackPlayerIcon.svg'
import Button from 'react-bootstrap/esm/Button'
import NewGameModal from './NewGameModal'
import { useState } from 'react'

function GameInfo() {
  const { value } = useGameController()

  let winningPlayer = value.Variant.apiMembers.winningPlayer(
    value.Board,
    value.CurrentPlayer,
  )

  let winStatus = '*'
  if (winningPlayer === Player.Black) {
    winStatus = '0-1'
  } else if (winningPlayer === Player.White) {
    winStatus = '1-0'
  } else if (
    value.Variant.apiMembers.isDrawn(value.InitialPosition, value.MoveHistory)
  ) {
    winStatus = '½-½'
  }

  let variantName
  switch (value.Variant.variant) {
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
  
  const showState = useState(false)

  return (
    <div className="border border-dark">
      <div className="fw-bold px-2">{variantName}</div>
      <div
        className={`px-2 ${
          value.CurrentPlayer === Player.White ? 'fw-bold' : ''
        }`}
      >
        <img
          src={wpi}
          style={{ verticalAlign: 'middle', height: 15 }}
          alt="white"
        />{' '}
        Human
      </div>
      <div
        className={`px-2 ${
          value.CurrentPlayer === Player.Black ? 'fw-bold' : ''
        }`}
      >
        <img
          src={bpi}
          style={{ verticalAlign: 'middle', height: 15 }}
          alt="black"
        />{' '}
        Human
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
