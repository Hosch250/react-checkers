import { Color, Coord, Piece as PieceModel } from './models/types'
import Piece from './Piece'
import './Square.css'

function Square({
  color,
  piece,
  coord,
  isSelected,
  onclick,
}: {
  color: Color
  piece?: PieceModel
  coord: Coord,
  isSelected: boolean,
  onclick: (row: number, col: number) => void
}) {

  let domPiece = piece ? <Piece piece={piece} /> : null
  return (
    <div style={{backgroundColor: color}} className={`Square ${isSelected ? 'selected' : ''}`} role="button" onClick={() => onclick(coord.row, coord.column)}>
      {domPiece}
    </div>
  )
}

export default Square
