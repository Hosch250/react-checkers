import { Color, Coord, Piece as PieceModel } from './models/types'
import Piece from './Piece'
import './Square.css'

function Square({
  color,
  piece,
  coord,
  hasBorder,
  isSelected,
  onclick,
}: {
  color: Color
  piece?: PieceModel
  coord: Coord
  hasBorder: boolean
  isSelected: boolean
  onclick: (row: number, col: number) => void
}) {
  let domPiece = piece ? <Piece piece={piece} /> : null
  let backgroundColor = color === Color.Black ? 'black' : 'white'
  let borderClasses = hasBorder
    ? `border-end border-bottom ${coord.row === 0 ? 'border-top' : ''} ${
        coord.column === 0 ? 'border-start' : ''
      } border-2 border-secondary`
    : ''
  return (
    <div
      style={{ backgroundColor }}
      className={`Square ${borderClasses} row${coord.row} col${coord.column} ${
        isSelected ? 'selected' : ''
      }`}
      role="button"
      onClick={() => onclick(coord.row, coord.column)}
    >
      {domPiece}
    </div>
  )
}

export default Square
