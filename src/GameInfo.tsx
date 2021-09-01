import { useGameController } from './GameControllerContext'
import { Player, Variant } from './models/types'
import wpi from './Assets/WhitePlayerIcon.svg'
import bpi from './Assets/BlackPlayerIcon.svg'

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

  return (
    <div className="border border-dark p-2 py-1">
      <div className="fw-bold">{variantName}</div>
      <div className={value.CurrentPlayer === Player.White ? 'fw-bold' : ''}>
        <img
          src={wpi}
          style={{ verticalAlign: 'middle', height: 15 }}
          alt="white"
        />{' '}
        Human
      </div>
      <div className={value.CurrentPlayer === Player.Black ? 'fw-bold' : ''}>
        <img
          src={bpi}
          style={{ verticalAlign: 'middle', height: 15 }}
          alt="black"
        />{' '}
        Human
      </div>
      <div className="text-center">{winStatus}</div>
    </div>
  )
}

export default GameInfo
