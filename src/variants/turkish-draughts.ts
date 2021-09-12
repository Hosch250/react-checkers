import { isEqual, last } from 'lodash'
import { blackChecker, Board, Color, Coord, Move, offset, Piece, PieceType, square, whiteChecker } from '../models/types'

const Rows = 7
const Columns = 7
export const StartingPlayer = Color.White

export const defaultBoard: (Piece | undefined)[][] = [
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
    blackChecker,
    blackChecker,
    blackChecker,
    blackChecker,
    blackChecker,
    blackChecker,
    blackChecker,
    blackChecker,
  ],
  [
    blackChecker,
    blackChecker,
    blackChecker,
    blackChecker,
    blackChecker,
    blackChecker,
    blackChecker,
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
    whiteChecker,
    whiteChecker,
    whiteChecker,
    whiteChecker,
    whiteChecker,
    whiteChecker,
    whiteChecker,
  ],
  [
    whiteChecker,
    whiteChecker,
    whiteChecker,
    whiteChecker,
    whiteChecker,
    whiteChecker,
    whiteChecker,
    whiteChecker,
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

export const defaultFen = '[FEN "B:W:B"]' // todo

export const pdnBoard = [
  [1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31, 32],
  [33, 34, 35, 36, 37, 38, 39, 40],
  [41, 42, 43, 44, 45, 46, 47, 48],
  [49, 50, 51, 52, 53, 54, 55, 56],
  [57, 58, 59, 60, 61, 62, 63, 64],
]

function coordExists(coord: Coord) {
  return (
    coord.row >= 0 &&
    coord.row <= Rows &&
    coord.column >= 0 &&
    coord.column <= Columns
  )
}

export function isJump(move: Move, originalBoard: Board) {
  if (Math.abs(move[0].row - move[1].row) === 1 || Math.abs(move[0].column - move[1].column) === 1) {
    return false
  } else {
    let rowSign = Math.sign(move[0].row - move[1].row)
    let colSign = Math.sign(move[0].column - move[1].column)

    let targetCoord
    let pieceJumpedCount = 0
    do {
      targetCoord = {
        row: last(move)!.row + rowSign,
        column: last(move)!.column + colSign,
      }

      if (!!square(targetCoord, originalBoard)) {
        pieceJumpedCount += 1
      }
    } while (coordExists(targetCoord) && !isEqual(targetCoord, move[0]))

    return !coordExists(targetCoord)
      ? false
      : pieceJumpedCount !== 1
      ? false
      : true
  }
}

function checkMoveDirection(
  piece: Piece,
  startCoord: Coord,
  endCoord: Coord,
  board: Board,
) {
  let moveIsJump = isJump([startCoord, endCoord], board)

  if (piece.pieceType === PieceType.Checker && !moveIsJump) {
    return piece.player === Color.Black
      ? startCoord.row <= endCoord.row
      : startCoord.row >= endCoord.row
  } else {
    return true
  }
}

export function getHopTargets(
  currentPlayer: Color,
  currentCoord: Coord,
  rowSign: number,
  colSign: number,
  board: Board,
) {
  function getTargets(
    targets: Coord[],
    currentPlayer: Color,
    currentCoord: Coord,
    rowSign: number,
    colSign: number,
    board: Board,
  ): Coord[] {
    if (!coordExists(currentCoord) || !!square(currentCoord, board)) {
      return targets
    } else {
      targets.push(currentCoord)
      let nextCoord = offset(currentCoord, { row: rowSign, column: colSign })
      return getTargets(
        targets,
        currentPlayer,
        nextCoord,
        rowSign,
        colSign,
        board,
      )
    }
  }

  return getTargets([], currentPlayer, currentCoord, rowSign, colSign, board)
}

function isValidCheckerHop(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)!
  let isOrthogonalMove =
    (
      (Math.abs(startCoord.row - endCoord.row) === 1 && Math.abs(startCoord.column - endCoord.column) === 0) ||
      (Math.abs(startCoord.row - endCoord.row) === 0 && Math.abs(startCoord.column - endCoord.column) === 1)
      )
  
  return (isOrthogonalMove &&
    checkMoveDirection(piece, startCoord, endCoord, board) &&
    !square(endCoord, board)
  )
}

function isValidKingHop(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)!
  let rowSign = Math.sign(endCoord.row - startCoord.row)
  let colSign = Math.sign(endCoord.column - startCoord.column)
  let nextCoord = offset(startCoord, { row: rowSign, column: colSign })

  let hopTargets = getHopTargets(
    piece.player,
    nextCoord,
    rowSign,
    colSign,
    board,
  )

  return hopTargets.some((s) => isEqual(s, endCoord))
}

function isValidHop(startCoord: Coord, endCoord: Coord, board: Board) {
  return square(startCoord, board)!.pieceType === PieceType.Checker
    ? isValidCheckerHop(startCoord, endCoord, board)
    : isValidKingHop(startCoord, endCoord, board)
}