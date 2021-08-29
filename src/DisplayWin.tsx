import { last } from 'lodash'
import { useGameController } from './GameControllerContext'
import { Player } from './models/types'

function DisplayWin() {
  const { value } = useGameController()

  let winningPlayer = value.Variant.apiMembers.winningPlayer(
    value.Board,
    value.CurrentPlayer,
  )
  if (winningPlayer !== undefined) {
    let playerName = winningPlayer === Player.Black ? 'Black' : 'White'
    return <div className="DisplayWin">{playerName} has won</div>
  }

  if (value.MoveHistory.length > 0) {
    let lastTurn =
      last(value.MoveHistory)!.WhiteMove?.ResultingFen ||
      last(value.MoveHistory)!.BlackMove!.ResultingFen
    if (value.Variant.apiMembers.isDrawn(lastTurn, value.MoveHistory)) {
      return <div className="DisplayWin">Game is drawn!</div>
    }
  }
  return null
}

export default DisplayWin
