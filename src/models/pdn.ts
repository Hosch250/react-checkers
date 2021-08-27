import { tail, takeWhile } from 'lodash'
import { PdnMembers } from './game-variant'
import {
  blackChecker,
  blackKing,
  Board,
  Coord,
  isPlayerPiece,
  nextPoint,
  PieceType,
  Player,
  square,
  Variant,
  whiteChecker,
  whiteKing,
} from './types'

const BlackSymbol = 'B'
const WhiteSymbol = 'W'

function getPieceNotation(fenSections: string[], playerSymbol: string) {
  let section
  if (fenSections[1][0] === playerSymbol) {
    section = fenSections[1]
  } else {
    section = fenSections[2]
  }

  return section
    .substring(1)
    .split(',')
    .filter((f) => f !== '')
}

function addPieces(
  fenPieces: string[],
  player: Player,
  board: Board,
  pdnBoardCoords: Coord[],
) {
  let head = fenPieces.shift()!
  let isKing = head[0] === 'K'
  let fenNumber = isKing ? parseInt(head.substring(1)) : parseInt(head)

  let boardCoord = pdnBoardCoords[fenNumber]

  let piece
  switch (true) {
    case player === Player.White && isKing:
      piece = whiteKing
      break
    case player === Player.White && !isKing:
      piece = whiteChecker
      break
    case player === Player.Black && isKing:
      piece = blackKing
      break
    case player === Player.Black && !isKing:
      piece = blackChecker
      break
  }
  board[boardCoord.Row][boardCoord.Column] = piece

  if (tail.length !== 0) {
    addPieces(fenPieces, player, board, pdnBoardCoords)
  }
}

// export function controllerFromFen(variant, fen :string) {
//     let fenValue = fen.Split('"').[1]
//     let fenSubsections = fenValue.Split(':')
//     let playerTurn =
//         match fenSubsections.[0].[0] with
//         | BlackSymbol -> Black
//         | WhiteSymbol -> White

//     let whitePieces = getPieceNotation fenSubsections WhiteSymbol
//     let blackPieces = getPieceNotation fenSubsections BlackSymbol

//     let pdnBoardCoords = variant.pdnMembers.pdnBoardCoords

//     let board = emptyBoardList()
//     if whitePieces.Length > 0 then addPieces (List.ofArray whitePieces) White board pdnBoardCoords
//     if blackPieces.Length > 0 then addPieces (List.ofArray blackPieces) Black board pdnBoardCoords

//     return {
//         Variant = variant
//         Board = board;
//         CurrentPlayer = playerTurn;
//         InitialPosition = fen;
//         MoveHistory = []
//         CurrentCoord = None;
//     }
// }

export function createFen(variant: PdnMembers, player: Player, board: Board) {
  let turnSymbol = player === Player.White ? WhiteSymbol : BlackSymbol

  let loop = (fenNumbers: string[], player: Player, coord: Coord): string[] => {
    let next = nextPoint(coord, 7, 7)
    if (next) {
      let piece = square(coord, board)
      if (!!piece && isPlayerPiece(player, coord, board)) {
        let isKing = piece.PieceType === PieceType.King

        let pdnBoard = variant.pdnBoard

        let fenNumber = square(coord, pdnBoard)!
        return loop(
          [...fenNumbers, (isKing ? 'K' : '') + fenNumber.toString()],
          player,
          next,
        )
      } else {
        return loop(fenNumbers, player, next)
      }
    } else {
      return fenNumbers
    }
  }

  let whitePieceFEN = loop([], Player.White, { Row: 0, Column: 0 }).join(',')
  let blackPieceFEN = loop([], Player.Black, { Row: 0, Column: 0 }).join(',')

  return (
    '[FEN "' +
    turnSymbol.toString() +
    ':W' +
    whitePieceFEN +
    ':B' +
    blackPieceFEN +
    '"]'
  )
}
