export enum Color {
  Black,
  White,
}

export enum PieceType {
  Checker,
  King,
}

export enum Variant {
  AmericanCheckers,
  PoolCheckers,
  AmericanCheckersOptionalJump,
  TurkishDraughts,
}

export enum PlayerType {
  Human,
  Computer,
}

export type Coord = { row: number; column: number }

export type Move = Coord[]

export type Board = (Piece | undefined)[][]

export type Piece = { player: Color; pieceType: PieceType }

export type Player = { color: Color; player: PlayerType; aiLevel?: number }

export type PdnMove = {
  move: number[]
  resultingFen: string
  displayString: string
  pieceTypeMoved: PieceType | undefined
  player: Color | undefined
  isJump: boolean | undefined
}

export type PdnTurn = {
  moveNumber: number
  blackMove: PdnMove | undefined
  whiteMove: PdnMove | undefined
}

export const whiteChecker: Piece = {
  player: Color.White,
  pieceType: PieceType.Checker,
}
export const whiteKing: Piece = {
  player: Color.White,
  pieceType: PieceType.King,
}
export const blackChecker: Piece = {
  player: Color.Black,
  pieceType: PieceType.Checker,
}
export const blackKing: Piece = {
  player: Color.Black,
  pieceType: PieceType.King,
}

export const emptyBoardList = () => [
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
]

export function offset(c1: Coord, c2: Coord) {
  return { row: c1.row + c2.row, column: c1.column + c2.column }
}

export function square<a>(coord: Coord, board: a[][]) {
  return board[coord.row][coord.column]
}

export function promote(piece: Piece) {
  return { player: piece.player, pieceType: PieceType.King }
}

export function moveIsDiagonal(startCoord: Coord, endCoord: Coord) {
  return (
    startCoord !== endCoord &&
    Math.abs(startCoord.row - endCoord.row) ===
      Math.abs(startCoord.column - endCoord.column)
  )
}

export function moveIsOrthogonal(startCoord: Coord, endCoord: Coord) {
  return (
    startCoord !== endCoord &&
    ((Math.abs(startCoord.row - endCoord.row) === 0 &&
      Math.abs(startCoord.column - endCoord.column) === 1) ||
      (Math.abs(startCoord.row - endCoord.row) === 1 &&
        Math.abs(startCoord.column - endCoord.column) === 0))
  )
}

export function isPlayerPiece(player: Color, coord: Coord, board: Board) {
  let piece = square(coord, board)
  return !!piece && player === piece.player
}

export function nextPoint(coord: Coord, rows: number, columns: number) {
  if (coord.column === columns) {
    if (coord.row === rows) {
      return undefined
    } else {
      return {
        row: coord.row + 1,
        column: 0,
      }
    }
  } else {
    return {
      ...coord,
      column: coord.column + 1,
    }
  }
}
