import { last } from 'lodash'
import { useGameController } from './GameControllerContext'
import { Player } from './models/types'

function DisplayWin() {
  const { value } = useGameController()

  let winningPlayer = value.variant.apiMembers.winningPlayer(
    value.board,
    value.currentPlayer,
  )
  if (winningPlayer !== undefined) {
    let playerName = winningPlayer === Player.Black ? 'Black' : 'White'
    return <div className="DisplayWin">{playerName} has won</div>
  }

  if (value.moveHistory.length > 0) {
    let lastTurn =
      last(value.moveHistory)!.whiteMove?.resultingFen ||
      last(value.moveHistory)!.blackMove!.resultingFen
    if (value.variant.apiMembers.isDrawn(lastTurn, value.moveHistory)) {
      return <div className="DisplayWin">Game is drawn!</div>
    }
  }
  return null
}

export default DisplayWin
