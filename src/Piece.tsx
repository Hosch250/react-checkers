import wp from './Assets/WhitePiece.svg'
import bp from './Assets/BlackPiece.svg'
import wk from './Assets/WhiteKing.svg'
import bk from './Assets/BlackKing.svg'
import {
  Piece as PieceModel,
  whiteChecker,
  blackChecker,
  whiteKing,
  blackKing,
} from './models/types'
import { isEqual } from 'lodash'

export function Piece({ piece }: { piece: PieceModel }) {
  let domPiece = null
  switch (true) {
    case isEqual(whiteChecker, piece):
      domPiece = <img src={wp} style={{ padding: 5 }} alt="white checker" />
      break
    case isEqual(blackChecker, piece):
      domPiece = <img src={bp} style={{ padding: 5 }} alt="black checker" />
      break
    case isEqual(whiteKing, piece):
      domPiece = <img src={wk} style={{ padding: 5 }} alt="white king" />
      break
    case isEqual(blackKing, piece):
      domPiece = <img src={bk} style={{ padding: 5 }} alt="black king" />
      break
  }
  return domPiece
}

export default Piece
