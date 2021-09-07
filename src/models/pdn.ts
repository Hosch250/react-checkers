import { tail } from 'lodash'
import { GameVariant, PdnMembers } from './game-variant'
import {
  blackChecker,
  blackKing,
  Board,
  Coord,
  emptyBoardList,
  isPlayerPiece,
  nextPoint,
  PieceType,
  Color,
  square,
  whiteChecker,
  whiteKing,
  PlayerType,
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
  player: Color,
  board: Board,
  pdnBoardCoords: Coord[],
) {
  let head = fenPieces[0]
  let fenTail = tail(fenPieces)
  let isKing = head[0] === 'K'
  let fenNumber = isKing ? parseInt(head.substring(1)) : parseInt(head)

  let boardCoord = pdnBoardCoords[fenNumber]

  let piece = undefined
  switch (true) {
    case player === Color.White && isKing:
      piece = whiteKing
      break
    case player === Color.White && !isKing:
      piece = whiteChecker
      break
    case player === Color.Black && isKing:
      piece = blackKing
      break
    case player === Color.Black && !isKing:
      piece = blackChecker
      break
  }
  board[boardCoord.row][boardCoord.column] = piece

  if (fenTail.length !== 0) {
    addPieces(fenTail, player, board, pdnBoardCoords)
  }
}

export function controllerFromFen(variant: GameVariant, fen: string) {
  let fenValue = fen.split('"')[1]
  let fenSubsections = fenValue.split(':')
  let playerTurn =
    fenSubsections[0][0] === BlackSymbol ? Color.Black : Color.White

  let whitePieces = getPieceNotation(fenSubsections, WhiteSymbol)
  let blackPieces = getPieceNotation(fenSubsections, BlackSymbol)

  let pdnBoardCoords = variant.pdnMembers.pdnBoardCoords

  let board = emptyBoardList()
  if (whitePieces.length > 0) {
    addPieces(whitePieces, Color.White, board, pdnBoardCoords)
  }
  if (blackPieces.length > 0) {
    addPieces(blackPieces, Color.Black, board, pdnBoardCoords)
  }

  return {
    variant: variant,
    board: board,
    currentPlayer: playerTurn,
    initialPosition: fen,
    moveHistory: [],
    currentCoord: undefined,
    blackInfo: {color: Color.Black, player: PlayerType.Human},
    whiteInfo: {color: Color.White, player: PlayerType.Human}
  }
}

export function createFen(variant: PdnMembers, player: Color, board: Board) {
  let turnSymbol = player === Color.White ? WhiteSymbol : BlackSymbol

  let loop = (fenNumbers: string[], player: Color, coord: Coord): string[] => {
    let next = nextPoint(coord, 7, 7)
    if (next) {
      let piece = square(coord, board)
      if (!!piece && isPlayerPiece(player, coord, board)) {
        let isKing = piece.pieceType === PieceType.King

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

  let whitePieceFEN = loop([], Color.White, { row: 0, column: 0 }).join(',')
  let blackPieceFEN = loop([], Color.Black, { row: 0, column: 0 }).join(',')

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
