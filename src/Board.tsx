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
  piece: Piece | undefined,
  onclick: (row: number, col: number) => void,
) {
  return (
    <Square
      key={`col_${row}${col}`}
      color={getSquareColor(row, col)}
      piece={piece}
      coord={{ Row: row, Column: col }}
      isSelected={isSelected}
      onclick={onclick}
    />
  )
}

function Board({
  board,
  selectedCoord,
  onclick,
}: {
  board: BoardType
  selectedCoord: Coord | undefined
  onclick: (row: number, col: number) => void
}) {
  let jsx = board.map((row, rowIndex) => {
    return (
      <div className="board-row" key={`row_${rowIndex}`}>
        {row.map((piece, col) => {
          return getSquare(
            rowIndex,
            col,
            selectedCoord?.Row === rowIndex && selectedCoord.Column === col,
            piece,
            onclick,
          )
        })}
      </div>
    )
  })

  return <div className="Board">{jsx}</div>
}

export default Board
