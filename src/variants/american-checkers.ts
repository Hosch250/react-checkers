import {
  Board,
  Coord,
  Move,
  moveIsDiagonal,
  nextPoint,
  offset,
  PdnMove,
  PdnTurn,
  Piece,
  PieceType,
  Color,
  promote,
  square,
} from '../models/types'
import { cloneDeep, countBy, drop, keys, last, tail } from 'lodash'

const Rows = 7
const Columns = 7
export const StartingPlayer = Color.Black

export const pdnBoard = [
  [undefined, 1, undefined, 2, undefined, 3, undefined, 4],
  [5, undefined, 6, undefined, 7, undefined, 8, undefined],
  [undefined, 9, undefined, 10, undefined, 11, undefined, 12],
  [13, undefined, 14, undefined, 15, undefined, 16, undefined],
  [undefined, 17, undefined, 18, undefined, 19, undefined, 20],
  [21, undefined, 22, undefined, 23, undefined, 24, undefined],
  [undefined, 25, undefined, 26, undefined, 27, undefined, 28],
  [29, undefined, 30, undefined, 31, undefined, 32, undefined],
]

export const pdnBoardCoords = [
  { row: -1, column: -1 }, // adjust for FEN's 1-based indexing
  { row: 0, column: 1 },
  { row: 0, column: 3 },
  { row: 0, column: 5 },
  { row: 0, column: 7 },
  { row: 1, column: 0 },
  { row: 1, column: 2 },
  { row: 1, column: 4 },
  { row: 1, column: 6 },
  { row: 2, column: 1 },
  { row: 2, column: 3 },
  { row: 2, column: 5 },
  { row: 2, column: 7 },
  { row: 3, column: 0 },
  { row: 3, column: 2 },
  { row: 3, column: 4 },
  { row: 3, column: 6 },
  { row: 4, column: 1 },
  { row: 4, column: 3 },
  { row: 4, column: 5 },
  { row: 4, column: 7 },
  { row: 5, column: 0 },
  { row: 5, column: 2 },
  { row: 5, column: 4 },
  { row: 5, column: 6 },
  { row: 6, column: 1 },
  { row: 6, column: 3 },
  { row: 6, column: 5 },
  { row: 6, column: 7 },
  { row: 7, column: 0 },
  { row: 7, column: 2 },
  { row: 7, column: 4 },
  { row: 7, column: 6 },
]

function kingRowIndex(player: Color | undefined) {
  switch (player) {
    case Color.Black:
      return Rows
    case Color.White:
      return 0
    default:
      return undefined
  }
}

function coordExists(coord: Coord) {
  return (
    !!coord &&
    coord.row >= 0 &&
    coord.row <= Rows &&
    coord.column >= 0 &&
    coord.column <= Columns
  )
}

function getJumpedCoord(startCoord: Coord, endCoord: Coord) {
  return {
    row: startCoord.row - Math.sign(startCoord.row - endCoord.row),
    column: startCoord.column - Math.sign(startCoord.column - endCoord.column),
  }
}

export function isJump(move: Move, originalBoard: Board) {
  return Math.abs(move[0].row - move[1].row) === 2
}

function checkMoveDirection(
  piece: Piece | undefined,
  startCoord: Coord,
  endCoord: Coord,
) {
  switch (piece?.pieceType) {
    case PieceType.Checker:
      return (
        (piece.player === Color.Black && startCoord.row < endCoord.row) ||
        (piece.player === Color.White && startCoord.row > endCoord.row)
      )
    case PieceType.King:
      return true
    default:
      return false
  }
}

function isValidCheckerHop(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)

  return (
    checkMoveDirection(piece, startCoord, endCoord) && !square(endCoord, board)
  )
}

function isValidKingHop(endCoord: Coord, board: Board) {
  return !square(endCoord, board)
}

function isValidCheckerJump(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)

  let jumpedCoord = getJumpedCoord(startCoord, endCoord)
  let jumpedPiece = square(jumpedCoord, board)

  return (
    checkMoveDirection(piece, startCoord, endCoord) &&
    !square(endCoord, board) &&
    !!jumpedPiece &&
    jumpedPiece.player !== piece?.player
  )
}

function isValidKingJump(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)

  let jumpedCoord = getJumpedCoord(startCoord, endCoord)
  let jumpedPiece = square(jumpedCoord, board)

  return (
    !square(endCoord, board) &&
    !!jumpedPiece &&
    jumpedPiece.player !== piece?.player
  )
}

function isValidHop(startCoord: Coord, endCoord: Coord, board: Board) {
  switch (square(startCoord, board)?.pieceType) {
    case PieceType.Checker:
      return isValidCheckerHop(startCoord, endCoord, board)
    case PieceType.King:
      return isValidKingHop(endCoord, board)
    default:
      return false
  }
}

function isValidJump(startCoord: Coord, endCoord: Coord, board: Board) {
  switch (square(startCoord, board)?.pieceType) {
    case PieceType.Checker:
      return isValidCheckerJump(startCoord, endCoord, board)
    case PieceType.King:
      return isValidKingJump(startCoord, endCoord, board)
    default:
      return false
  }
}

function hasValidHop(startCoord: Coord, board: Board) {
  let hopCoords = [
    offset(startCoord, { row: -1, column: 1 }),
    offset(startCoord, { row: -1, column: -1 }),
    offset(startCoord, { row: 1, column: 1 }),
    offset(startCoord, { row: 1, column: -1 }),
  ]

  function anyHopIsValid(hops: Move): boolean {
    let coord = hops[0]
    let hopsTail = tail(hops)
    if (coordExists(coord) && isValidHop(startCoord, coord, board)) {
      return true
    } else if (hops.length === 0) {
      return false
    } else {
      return anyHopIsValid(hopsTail)
    }
  }

  return anyHopIsValid(hopCoords)
}

function hasValidJump(startCoord: Coord, board: Board) {
  let jumpCoords = [
    offset(startCoord, { row: -2, column: 2 }),
    offset(startCoord, { row: -2, column: -2 }),
    offset(startCoord, { row: 2, column: 2 }),
    offset(startCoord, { row: 2, column: -2 }),
  ]

  function anyJumpIsValid(jumps: Move): boolean {
    let coord = jumps[0]
    let jumpsTail = tail(jumps)
    if (coordExists(coord) && isValidJump(startCoord, coord, board)) {
      return true
    } else if (jumps.length === 0) {
      return false
    } else {
      return anyJumpIsValid(jumpsTail)
    }
  }

  return anyJumpIsValid(jumpCoords)
}

function jumpAvailable(player: Color, board: Board) {
  function pieceHasJump(row: number, column: number): boolean {
    let piece = board[row][column]
    return (
      !!piece &&
      piece.player === player &&
      hasValidJump({ row: row, column: column }, board)
    )
  }

  function loop(coord: Coord | undefined): boolean {
    if (!coord) {
      return false
    } else if (pieceHasJump(coord.row, coord.column)) {
      return true
    } else {
      return loop(nextPoint(coord, Rows, Columns))
    }
  }

  return loop({ row: 0, column: 0 })
}

function setPieceAt(coord: Coord, piece: Piece | undefined, board: Board) {
  let newBoard: Board = cloneDeep(board) as unknown as Board
  newBoard[coord.row][coord.column] = piece

  return newBoard
}

function jump(startCoord: Coord, endCoord: Coord, board: Board) {
  let kri = kingRowIndex(square(startCoord, board)?.player)

  let piece =
    endCoord.row === kri
      ? promote(square(startCoord, board)!)
      : square(startCoord, board)

  let jumpedCoord = getJumpedCoord(startCoord, endCoord)

  let newBoard = setPieceAt(startCoord, undefined, board)
  newBoard = setPieceAt(endCoord, piece, newBoard)
  newBoard = setPieceAt(jumpedCoord, undefined, newBoard)
  return newBoard
}

function hop(startCoord: Coord, endCoord: Coord, board: Board) {
  let kri = kingRowIndex(square(startCoord, board)?.player)

  let piece =
    endCoord.row === kri
      ? promote(square(startCoord, board)!)
      : square(startCoord, board)

  let newBoard = setPieceAt(startCoord, undefined, board)
  newBoard = setPieceAt(endCoord, piece, newBoard)
  return newBoard
}

export function isValidMove(
  requireJumps: boolean,
  startCoord: Coord,
  endCoord: Coord,
  board: Board,
) {
  if (!coordExists(startCoord) || !coordExists(endCoord)) {
    return false
  }

  if (!moveIsDiagonal(startCoord, endCoord)) {
    return false
  }

  if (!square(startCoord, board)) {
    return false
  }

  switch (Math.abs(startCoord.row - endCoord.row)) {
    case 1:
      return (
        isValidHop(startCoord, endCoord, board) &&
        !(
          requireJumps &&
          jumpAvailable(square(startCoord, board)!.player, board)
        )
      )
    case 2:
      return isValidJump(startCoord, endCoord, board)
    default:
      return false
  }
}

export function movePiece(
  requireJumps: boolean,
  startCoord: Coord,
  endCoord: Coord,
  board: Board,
) {
  if (isValidMove(requireJumps, startCoord, endCoord, board)) {
    switch (Math.abs(startCoord.row - endCoord.row)) {
      case 1:
        return hop(startCoord, endCoord, board)
      case 2:
        return jump(startCoord, endCoord, board)
      default:
        return undefined
    }
  }

  return undefined
}

export function moveSequence(
  requireJumps: boolean,
  coords: Move,
  board: Board | undefined,
): Board | undefined {
  if (!board) {
    return undefined
  }

  if (coords.length >= 3) {
    let newBoard = movePiece(requireJumps, coords[0], coords[1], board)
    return moveSequence(requireJumps, tail(coords), newBoard)
  } else {
    return movePiece(requireJumps, coords[0], coords[1], board)
  }
}

function wasCheckerMoved(moves: PdnMove[]) {
  return moves.some((item) => item.pieceTypeMoved === PieceType.Checker)
}

function wasPieceJumped(moves: PdnMove[]) {
  return moves.some((item) => item.isJump)
}

export function isDrawn(initialFen: string, moveHistory: PdnTurn[]) {
  let fens = [
    initialFen,
    ...moveHistory.flatMap((f) => {
      if (
        !!f.blackMove &&
        !!f.whiteMove &&
        f.blackMove.move.length !== 0 &&
        f.whiteMove.move.length !== 0
      ) {
        return [f.blackMove.resultingFen, f.whiteMove.resultingFen]
      } else if (
        !!f.blackMove &&
        f.blackMove.move.length !== 0 &&
        (!f.whiteMove || f.whiteMove.move.length === 0)
      ) {
        return [f.blackMove.resultingFen]
      } else if (
        (!f.blackMove || f.blackMove.move.length === 0) &&
        !!f.whiteMove &&
        f.whiteMove.move.length === 0
      ) {
        return [f.whiteMove.resultingFen]
      } else {
        return []
      }
    }),
  ]

  let positionsByTimesReached = countBy(fens)
  let hasReachedPositionThreeTimes =
    Math.max(
      ...keys(positionsByTimesReached).map((m) => positionsByTimesReached[m]),
    ) >= 3

  let whiteMoves = moveHistory
    .filter((f) => !!f.whiteMove)
    .map((m) => m.whiteMove!)
  let blackMoves = moveHistory
    .filter((f) => !!f.blackMove)
    .map((m) => m.blackMove!)

  let lastFortyWhiteMoves = drop(
    whiteMoves.filter((f) => f.move.length !== 0),
    40,
  )
  let lastFortyBlackMoves = blackMoves
    .filter((f) => f.move.length !== 0)
    .slice(40)

  return (
    hasReachedPositionThreeTimes ||
    (lastFortyWhiteMoves.length === 40 &&
      lastFortyBlackMoves.length === 40 &&
      !wasCheckerMoved(lastFortyWhiteMoves) &&
      !wasCheckerMoved(lastFortyBlackMoves) &&
      !wasPieceJumped(lastFortyWhiteMoves) &&
      !wasPieceJumped(lastFortyBlackMoves))
  )
}

function moveAvailable(board: Board, player: Color) {
  function pieceHasMove(row: number, column: number): boolean {
    let piece = board[row][column]
    return (
      !!piece &&
      piece.player === player &&
      (hasValidJump({ row: row, column: column }, board) ||
        hasValidHop({ row: row, column: column }, board))
    )
  }

  function loop(coord: Coord | undefined): boolean {
    if (!coord) {
      return false
    }

    return pieceHasMove(coord.row, coord.column)
      ? true
      : loop(nextPoint(coord, Rows, Columns))
  }

  return loop({ row: 0, column: 0 })
}

export function winningPlayer(board: Board, currentPlayer: Color | undefined) {
  const blackHasMove = moveAvailable(board, Color.Black)
  const whiteHasMove = moveAvailable(board, Color.White)

  if (!blackHasMove && !whiteHasMove) {
    return currentPlayer
  } else if (!whiteHasMove) {
    return Color.Black
  } else if (!blackHasMove) {
    return Color.White
  } else {
    return undefined
  }
}

export function playerTurnEnds(
  move: Move,
  originalBoard: Board,
  currentBoard: Board,
) {
  let lastMoveWasJump = Math.abs(move[0].row - move[1].row) === 2

  let pieceWasPromoted =
    square(last(move)!, currentBoard)!.pieceType === PieceType.King &&
    square(move[0], originalBoard)!.pieceType === PieceType.Checker

  return (
    pieceWasPromoted ||
    !(lastMoveWasJump && hasValidJump(last(move)!, currentBoard))
  )
}
