import React from 'react'
import './Board.css'
import { useGameController } from './GameControllerContext'
import { GameController } from './models/game-controller'
import {
  Color,
  Coord,
  defaultBoard,
  Piece,
  PieceType,
  Player,
  square,
} from './models/types'
import { Square } from './Square'
import { isValidMove, moveSequence } from './variants/american-checkers'

function getSquareColor(row: number, col: number) {
  if ((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
    return Color.White
  }

  return Color.Black
}

function getOnSquareClicked(
  controller: GameController,
  state: Coord | undefined,
  setState: React.Dispatch<React.SetStateAction<Coord | undefined>>,
  updateController: (value: GameController) => void,
) {
  let onclick = (row: number, column: number) => {
    const clickedCoord: Coord = {
      Row: row,
      Column: column,
    }

    if (!state) {
      setState(clickedCoord)
      return
    }

    if (state.Row === row && state.Column === column) {
      setState(undefined)
      return
    }

    if (controller.CurrentPlayer !== square(state, controller.Board)?.Player) {
      setState(undefined)
      return
    }

    if (isValidMove(state, clickedCoord, controller.Board)) {
      let coords = [state, clickedCoord]
      let newBoard = moveSequence(coords, controller.Board)!

      let turnHasEnded = controller.Variant.apiMembers.playerTurnEnds(
        [state, clickedCoord],
        controller.Board,
        newBoard,
      )
      let nextPlayer = !turnHasEnded
        ? controller.CurrentPlayer
        : controller.CurrentPlayer === Player.White
        ? Player.Black
        : Player.White
      let newController = {
        ...controller,
        Board: newBoard,
        CurrentPlayer: nextPlayer,
        MoveHistory: [], // PdnTurn[]  // todo: add the move
        CurrentCoord: turnHasEnded ? undefined : clickedCoord,
      }
      updateController(newController)
      setState(newController.CurrentCoord)
    }
  }

  return onclick
}

function getSquare(
  row: number,
  col: number,
  piece: Piece | undefined,
  onclick: any,
) {
  return (
    <Square
      key={`col_${row}${col}`}
      color={getSquareColor(row, col)}
      piece={piece}
      row={row}
      col={col}
      onclick={onclick}
    />
  )
}

function Board() {
  const [state, setState] = React.useState<Coord | undefined>(undefined)
  const { value, onChange } = useGameController()

  let memo = React.useCallback(getOnSquareClicked, [])

  let jsx = value.Board.map((row, rowIndex) => {
    return (
      <div className="row" key={`row_${rowIndex}`}>
        {row.map((piece, col) => {
          return getSquare(
            rowIndex,
            col,
            piece,
            memo(value, state, setState, onChange),
          )
        })}
      </div>
    )
  })

  return <div className="Board">{jsx}</div>
}

export default Board
