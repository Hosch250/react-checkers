import './Board.css'
import { Coord, Piece, Board as BoardType, Color } from './models/types'
import Square from './Square'

function getSquareColor(row: number, col: number) {
  if ((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
    return Color.White
  }

  return Color.Black
}

export function getSquare(
  row: number,
  col: number,
  isSelected: boolean,
  isMonoColor: boolean,
  piece: Piece | undefined,
  onclick: (row: number, col: number) => void,
) {
  return (
    <Square
      key={`col_${row}${col}`}
      color={isMonoColor ? Color.White : getSquareColor(row, col)}
      hasBorder={isMonoColor}
      piece={piece}
      coord={{ row: row, column: col }}
      isSelected={isSelected}
      onclick={onclick}
    />
  )
}

function Board({
  board,
  selectedCoord,
  isMonoColor,
  onclick,
}: {
  board: BoardType
  selectedCoord: Coord | undefined,
  isMonoColor: boolean,
  onclick: (row: number, col: number) => void
}) {
  let jsx = board.map((row, rowIndex) => {
    return (
      <>
        {row.map((piece, col) => {
          return getSquare(
            rowIndex,
            col,
            selectedCoord?.row === rowIndex && selectedCoord.column === col,
            isMonoColor,
            piece,
            onclick,
          )
        })}
        </>
    )
  })

  return <div className="Board">{jsx}</div>
}

export default Board
