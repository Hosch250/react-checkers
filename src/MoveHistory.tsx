import { last } from 'lodash'
import React from 'react'
import { useGameController } from './GameControllerContext'
import { GameController } from './models/game-controller'
import { controllerFromFen, createFen } from './models/pdn'
import { PdnTurn } from './models/types'
import './MoveHistory.css'

function getLastFen(turn: PdnTurn) {
  if (!!turn.WhiteMove) {
    return turn.WhiteMove.ResultingFen
  } else if (!!turn.BlackMove) {
    return turn.BlackMove.ResultingFen
  } else {
    return undefined
  }
}

function getViewBoardAtTurn(
  controller: GameController,
  updateController: (value: GameController) => void,
  setState: (value: undefined) => void,
) {
  let viewBoardAtTurn = (moveNumber: number, fen: string) => {
    let board = controllerFromFen(controller.Variant, fen).Board
    updateController({ ...controller, Board: board })

    if (
      controller.MoveHistory.length === moveNumber &&
      getLastFen(last(controller.MoveHistory)!) === fen
    ) {
      setState(undefined)
    }
  }

  return viewBoardAtTurn
}

function MoveHistory() {
  const [state, setState] = React.useState<
    { moveNumber: number; fen: string } | undefined
  >(() => undefined)
  const { value, onChange } = useGameController()
  let viewBoardAtTurn = getViewBoardAtTurn(value, onChange, setState)

  return (
    <div className="MoveHistory">
      <fieldset>
        <legend className="visually-hidden">Move History</legend>
        {value.MoveHistory.map((m, i) => (
          <div className="row" key={m.MoveNumber}>
            <div className="col-1 text-start">{m.MoveNumber}.</div>
            {m.BlackMove?.DisplayString ? (
              <label
                className="col-5 text-start"
                title={m.BlackMove.DisplayString}
              >
                <input
                  className="d-none"
                  value={m.BlackMove.ResultingFen}
                  type="radio"
                  role="button"
                  name="move"
                  onClick={(_) => {
                    setState({
                      moveNumber: m.MoveNumber,
                      fen: m.BlackMove!.ResultingFen,
                    })

                    viewBoardAtTurn(m.MoveNumber, m.BlackMove!.ResultingFen)
                  }}
                  onChange={(_) => {}}
                  checked={
                    (!state && m.MoveNumber === i + 1) ||
                    (state?.moveNumber === m.MoveNumber &&
                      m.BlackMove.ResultingFen === state.fen)
                  }
                />
                <span className="d-inline-block px-1">
                  {m.BlackMove.Move.length > 3
                    ? `${m.BlackMove.Move[0]}…${last(m.BlackMove.Move)}`
                    : m.BlackMove.DisplayString}
                </span>
              </label>
            ) : (
              <div className="col-5" />
            )}
            {m.WhiteMove?.DisplayString ? (
              <label
                className="col-5 text-start"
                title={m.WhiteMove.DisplayString}
              >
                <input
                  className="d-none"
                  value={m.WhiteMove.ResultingFen}
                  type="radio"
                  role="button"
                  name="move"
                  onClick={(_) => {
                    setState({
                      moveNumber: m.MoveNumber,
                      fen: m.WhiteMove!.ResultingFen,
                    })
                    viewBoardAtTurn(m.MoveNumber, m.WhiteMove!.ResultingFen)
                  }}
                  onChange={(_) => {}}
                  checked={
                    (!state && m.MoveNumber === i + 1) ||
                    (state?.moveNumber === m.MoveNumber &&
                      m.WhiteMove.ResultingFen === state.fen)
                  }
                />
                <span className="d-inline-block px-1">
                  {m.WhiteMove.Move.length > 3
                    ? `${m.WhiteMove.Move[0]}…${last(m.WhiteMove.Move)}`
                    : m.WhiteMove.DisplayString}
                </span>
              </label>
            ) : (
              <div className="col-5" />
            )}
          </div>
        ))}
      </fieldset>
    </div>
  )
}

export default MoveHistory
