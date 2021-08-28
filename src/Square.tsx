import { Color, Piece as PieceModel } from './models/types'
import { Piece } from './Piece'

export function Square({
  color,
  piece,
  row,
  col,
  onclick,
}: {
  color: Color
  piece?: PieceModel
  row: number
  col: number
  onclick: (row: number, col: number) => void
}) {
  const styles = {
    backgroundColor: color,
    height: 50,
    width: 50,
    display: 'inline-block',
  }

  let domPiece = piece ? <Piece piece={piece} /> : null
  return (
    <div style={styles} role="button" onClick={() => onclick(row, col)}>
      {domPiece}
    </div>
  )
}

export default Square
