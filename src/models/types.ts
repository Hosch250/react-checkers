export enum Color {
  White = 'white',
  Black = 'black',
}

export enum Player {
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
}

export type Coord = { Row: number; Column: number }

export type Move = Coord[]

export type Board = (Piece | undefined)[][]

export type Piece = { Player: Player; PieceType: PieceType }

export type PdnMove = {
  Move: number[]
  ResultingFen: string
  DisplayString: string
  PieceTypeMoved: PieceType | undefined
  Player: Player | undefined
  IsJump: boolean | undefined
}

export type PdnTurn = {
  MoveNumber: number
  BlackMove: PdnMove | undefined
  WhiteMove: PdnMove | undefined
}

export const whiteChecker: Piece = {
  Player: Player.White,
  PieceType: PieceType.Checker,
}
export const whiteKing: Piece = {
  Player: Player.White,
  PieceType: PieceType.King,
}
export const blackChecker: Piece = {
  Player: Player.Black,
  PieceType: PieceType.Checker,
}
export const blackKing: Piece = {
  Player: Player.Black,
  PieceType: PieceType.King,
}

export const defaultBoard: (Piece | undefined)[][] = [
  [
    undefined,
    blackChecker,
    undefined,
    blackChecker,
    undefined,
    blackChecker,
    undefined,
    blackChecker,
  ],
  [
    blackChecker,
    undefined,
    blackChecker,
    undefined,
    blackChecker,
    undefined,
    blackChecker,
    undefined,
  ],
  [
    undefined,
    blackChecker,
    undefined,
    blackChecker,
    undefined,
    blackChecker,
    undefined,
    blackChecker,
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
    whiteChecker,
    undefined,
    whiteChecker,
    undefined,
    whiteChecker,
    undefined,
    whiteChecker,
    undefined,
  ],
  [
    undefined,
    whiteChecker,
    undefined,
    whiteChecker,
    undefined,
    whiteChecker,
    undefined,
    whiteChecker,
  ],
  [
    whiteChecker,
    undefined,
    whiteChecker,
    undefined,
    whiteChecker,
    undefined,
    whiteChecker,
    undefined,
  ],
]

let emptyBoardList = () =>
  Array(8).fill(new Array(8).fill(undefined))

export const defaultFen =
  '[FEN "B:W21,22,23,24,25,26,27,28,29,30,31,32:B1,2,3,4,5,6,7,8,9,10,11,12"]'

export function offset(c1: Coord, c2: Coord) {
  return { Row: c1.Row + c2.Row, Column: c1.Column + c2.Column }
}

export function square<a>(coord: Coord, board: a[][]) {
  return board[coord.Row][coord.Column]
}

export function promote(piece: Piece) {
  return { Player: piece.Player, PieceType: PieceType.King }
}

export function moveIsDiagonal(startCoord: Coord, endCoord: Coord) {
  return (
    startCoord !== endCoord &&
    Math.abs(startCoord.Row - endCoord.Row) ===
      Math.abs(startCoord.Column - endCoord.Column)
  )
}

export function isPlayerPiece(player: Player, coord: Coord, board: Board) {
  let piece = square(coord, board)
  return !!piece && player === piece.Player
}

export function nextPoint(coord: Coord, rows: number, columns: number) {
  if (coord.Column === columns) {
    if (coord.Row === rows) {
      return undefined
    } else {
      return {
        Row: coord.Row + 1,
        Column: 0,
      }
    }
  } else {
    return {
      ...coord,
      Column: coord.Column + 1,
    }
  }
}
