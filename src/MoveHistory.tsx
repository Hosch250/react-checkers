import { last } from 'lodash'
import React from 'react'
import Button from 'react-bootstrap/esm/Button'
import { useGameController } from './GameControllerContext'
import { GameController } from './models/game-controller'
import { controllerFromFen } from './models/pdn'
import { PdnTurn } from './models/types'
import { MoveContextMenu } from './MoveContextMenu'
import './MoveHistory.css'
import MoveHistoryModal from './MoveHistoryModal'

function getLastFen(turn: PdnTurn) {
  if (!!turn.whiteMove) {
    return turn.whiteMove.resultingFen
  } else if (!!turn.blackMove) {
    return turn.blackMove.resultingFen
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
    let board = controllerFromFen(controller.variant, fen).board
    updateController({ ...controller, board: board })

    if (
      controller.moveHistory.length === moveNumber &&
      getLastFen(last(controller.moveHistory)!) === fen
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
  const [showContextMenu, setShowContextMenu] = React.useState<{
    show: boolean
    moveNumber?: number
    fen?: string
    x?: number
    y?: number
  }>({ show: false })
  const { value, onChange } = useGameController()
  let viewBoardAtTurn = getViewBoardAtTurn(value, onChange, setState)

  function handleOnRightClick(
    ev: React.MouseEvent,
    moveNumber: number,
    fen: string,
  ) {
    ev.preventDefault()
    setShowContextMenu({
      show: true,
      moveNumber,
      fen,
      x: ev.pageX,
      y: ev.pageY,
    })
    setState({
      moveNumber,
      fen,
    })
  }

  return (
    <div className="MoveHistory">
      <fieldset>
        <legend className="visually-hidden">Move History</legend>
        {value.moveHistory.map((m, i) => (
          <div className="row" key={m.moveNumber}>
            <div className="col-1 text-start">{m.moveNumber}.</div>
            {m.blackMove?.displayString ? (
              <div className="col-5">
                <label
                  className="col-5 text-start"
                  title={m.blackMove.displayString}
                  onContextMenu={(ev) =>
                    handleOnRightClick(
                      ev,
                      m.moveNumber,
                      m.blackMove!.resultingFen,
                    )
                  }
                >
                  <input
                    className="d-none"
                    value={m.blackMove.resultingFen}
                    type="radio"
                    role="button"
                    name="move"
                    onClick={(_) => {
                      setState({
                        moveNumber: m.moveNumber,
                        fen: m.blackMove!.resultingFen,
                      })

                      viewBoardAtTurn(m.moveNumber, m.blackMove!.resultingFen)
                    }}
                    onChange={(_) => {}}
                    checked={
                      (!state && m.moveNumber === i + 1) ||
                      (state?.moveNumber === m.moveNumber &&
                        m.blackMove.resultingFen === state.fen)
                    }
                  />
                  <span
                    className="d-inline-block px-1"
                    data-movenumber={m.moveNumber}
                    data-fen={m.blackMove.resultingFen}
                  >
                    {m.blackMove.move.length > 3
                      ? `${m.blackMove.move[0]}…${last(m.blackMove.move)}`
                      : m.blackMove.displayString}
                  </span>
                </label>
              </div>
            ) : (
              <div className="col-5" />
            )}
            {m.whiteMove?.displayString ? (
              <div className="col-5">
                <label
                  className="text-start"
                  title={m.whiteMove.displayString}
                  onContextMenu={(ev) =>
                    handleOnRightClick(
                      ev,
                      m.moveNumber,
                      m.whiteMove!.resultingFen,
                    )
                  }
                >
                  <input
                    className="d-none"
                    value={m.whiteMove.resultingFen}
                    type="radio"
                    role="button"
                    name="move"
                    onClick={(_) => {
                      setState({
                        moveNumber: m.moveNumber,
                        fen: m.whiteMove!.resultingFen,
                      })
                      viewBoardAtTurn(m.moveNumber, m.whiteMove!.resultingFen)
                    }}
                    onChange={(_) => {}}
                    checked={
                      (!state && m.moveNumber === i + 1) ||
                      (state?.moveNumber === m.moveNumber &&
                        m.whiteMove.resultingFen === state.fen)
                    }
                  />
                  <span
                    className="d-inline-block px-1"
                    data-movenumber={m.moveNumber}
                    data-fen={m.whiteMove.resultingFen}
                  >
                    {m.whiteMove.move.length > 3
                      ? `${m.whiteMove.move[0]}…${last(m.whiteMove.move)}`
                      : m.whiteMove.displayString}
                  </span>
                </label>
              </div>
            ) : (
              <div className="col-5" />
            )}
          </div>
        ))}
      </fieldset>
      <MoveContextMenu
        showContextMenu={showContextMenu}
        setShowContextMenu={setShowContextMenu}
      />
    </div>
  )
}

export default MoveHistory

export function MoveHistoryCollapsed() {
  const { value } = useGameController()
  let lastMove = last(value.moveHistory)
  const showState = React.useState(false)

  return (
    <div className="MoveHistory">
      {!!lastMove ? (
        <>
          <Button
            variant="secondary"
            className="w-100 text-start"
            onClick={(_) => showState[1](true)}
          >
            <i className="bi-list" />
            &nbsp;
            {lastMove.moveNumber}:&nbsp;{lastMove.blackMove?.displayString}{' '}
            &nbsp;{lastMove.whiteMove?.displayString}
          </Button>
          <MoveHistoryModal showState={showState} />
        </>
      ) : null}
    </div>
  )
}
