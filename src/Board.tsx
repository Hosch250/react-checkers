import React from 'react'
import './Board.css'
import { useBoard } from './BoardContext'
import {
  Board as BoardType,
  Color,
  Coord,
  defaultBoard,
  Piece,
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
  board: BoardType,
  state: Coord | undefined,
  setState: React.Dispatch<React.SetStateAction<Coord | undefined>>,
  setBoard: (value: BoardType) => void,
) {
  let onclick = React.useCallback((row: number, column: number) => {
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

    if (isValidMove(state, clickedCoord, board)) {
      let coords = [state, clickedCoord]
      let newBoard = moveSequence(coords, board)!

      setBoard(newBoard)
    }

    setState(clickedCoord)
  }, [])

  return onclick
}

function getSquare(
  row: number,
  col: number,
  piece: Piece | undefined,
  onclick: any
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

  const { value, onChange } = useBoard()
  let board = value.map((_, row) => {
    return (
      <div className="row" key={`row_${row}`}>
        {defaultBoard[row].map((piece, col) => {
          return getSquare(row, col, piece, getOnSquareClicked(value, state, setState, onChange))
        })}
      </div>
    )
  })

  return <div className="Board">{board}</div>
}

export default Board
