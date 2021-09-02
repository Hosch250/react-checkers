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
  Player,
  promote,
  square,
} from '../models/types'
import { cloneDeep, countBy, drop, keys, last, tail } from 'lodash'

const Rows = 7
const Columns = 7
export const StartingPlayer = Player.Black

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
  { Row: -1, Column: -1 }, // adjust for FEN's 1-based indexing
  { Row: 0, Column: 1 },
  { Row: 0, Column: 3 },
  { Row: 0, Column: 5 },
  { Row: 0, Column: 7 },
  { Row: 1, Column: 0 },
  { Row: 1, Column: 2 },
  { Row: 1, Column: 4 },
  { Row: 1, Column: 6 },
  { Row: 2, Column: 1 },
  { Row: 2, Column: 3 },
  { Row: 2, Column: 5 },
  { Row: 2, Column: 7 },
  { Row: 3, Column: 0 },
  { Row: 3, Column: 2 },
  { Row: 3, Column: 4 },
  { Row: 3, Column: 6 },
  { Row: 4, Column: 1 },
  { Row: 4, Column: 3 },
  { Row: 4, Column: 5 },
  { Row: 4, Column: 7 },
  { Row: 5, Column: 0 },
  { Row: 5, Column: 2 },
  { Row: 5, Column: 4 },
  { Row: 5, Column: 6 },
  { Row: 6, Column: 1 },
  { Row: 6, Column: 3 },
  { Row: 6, Column: 5 },
  { Row: 6, Column: 7 },
  { Row: 7, Column: 0 },
  { Row: 7, Column: 2 },
  { Row: 7, Column: 4 },
  { Row: 7, Column: 6 },
]

function kingRowIndex(player: Player | undefined) {
  switch (player) {
    case Player.Black:
      return Rows
    case Player.White:
      return 0
    default:
      return undefined
  }
}

function coordExists(coord: Coord) {
  return (
    !!coord &&
    coord.Row >= 0 &&
    coord.Row <= Rows &&
    coord.Column >= 0 &&
    coord.Column <= Columns
  )
}

function getJumpedCoord(startCoord: Coord, endCoord: Coord) {
  return {
    Row: startCoord.Row - Math.sign(startCoord.Row - endCoord.Row),
    Column: startCoord.Column - Math.sign(startCoord.Column - endCoord.Column),
  }
}

export function isJump(move: Move, originalBoard: Board) {
  return Math.abs(move[0].Row - move[1].Row) === 2
}

function checkMoveDirection(
  piece: Piece | undefined,
  startCoord: Coord,
  endCoord: Coord,
) {
  switch (piece?.PieceType) {
    case PieceType.Checker:
      return (
        (piece.Player === Player.Black && startCoord.Row < endCoord.Row) ||
        (piece.Player === Player.White && startCoord.Row > endCoord.Row)
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
    jumpedPiece.Player !== piece?.Player
  )
}

function isValidKingJump(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)

  let jumpedCoord = getJumpedCoord(startCoord, endCoord)
  let jumpedPiece = square(jumpedCoord, board)

  return (
    !square(endCoord, board) &&
    !!jumpedPiece &&
    jumpedPiece.Player !== piece?.Player
  )
}

function isValidHop(startCoord: Coord, endCoord: Coord, board: Board) {
  switch (square(startCoord, board)?.PieceType) {
    case PieceType.Checker:
      return isValidCheckerHop(startCoord, endCoord, board)
    case PieceType.King:
      return isValidKingHop(endCoord, board)
    default:
      return false
  }
}

function isValidJump(startCoord: Coord, endCoord: Coord, board: Board) {
  switch (square(startCoord, board)?.PieceType) {
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
    offset(startCoord, { Row: -1, Column: 1 }),
    offset(startCoord, { Row: -1, Column: -1 }),
    offset(startCoord, { Row: 1, Column: 1 }),
    offset(startCoord, { Row: 1, Column: -1 }),
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
    offset(startCoord, { Row: -2, Column: 2 }),
    offset(startCoord, { Row: -2, Column: -2 }),
    offset(startCoord, { Row: 2, Column: 2 }),
    offset(startCoord, { Row: 2, Column: -2 }),
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

function jumpAvailable(player: Player, board: Board) {
  function pieceHasJump(row: number, column: number): boolean {
    let piece = board[row][column]
    return (
      !!piece &&
      piece.Player === player &&
      hasValidJump({ Row: row, Column: column }, board)
    )
  }

  function loop(coord: Coord | undefined): boolean {
    if (!coord) {
      return false
    } else if (pieceHasJump(coord.Row, coord.Column)) {
      return true
    } else {
      return loop(nextPoint(coord, Rows, Columns))
    }
  }

  return loop({ Row: 0, Column: 0 })
}

function setPieceAt(coord: Coord, piece: Piece | undefined, board: Board) {
  let newBoard: Board = cloneDeep(board) as unknown as Board
  newBoard[coord.Row][coord.Column] = piece

  return newBoard
}

function jump(startCoord: Coord, endCoord: Coord, board: Board) {
  let kri = kingRowIndex(square(startCoord, board)?.Player)

  let piece =
    endCoord.Row === kri
      ? promote(square(startCoord, board)!)
      : square(startCoord, board)

  let jumpedCoord = getJumpedCoord(startCoord, endCoord)

  let newBoard = setPieceAt(startCoord, undefined, board)
  newBoard = setPieceAt(endCoord, piece, newBoard)
  newBoard = setPieceAt(jumpedCoord, undefined, newBoard)
  return newBoard
}

function hop(startCoord: Coord, endCoord: Coord, board: Board) {
  let kri = kingRowIndex(square(startCoord, board)?.Player)

  let piece =
    endCoord.Row === kri
      ? promote(square(startCoord, board)!)
      : square(startCoord, board)

  let newBoard = setPieceAt(startCoord, undefined, board)
  newBoard = setPieceAt(endCoord, piece, newBoard)
  return newBoard
}

export function isValidMove(
  startCoord: Coord,
  endCoord: Coord,
  board: Board,
  requireJumps = true,
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

  switch (Math.abs(startCoord.Row - endCoord.Row)) {
    case 1:
      return (
        isValidHop(startCoord, endCoord, board) &&
        !(
          requireJumps &&
          jumpAvailable(square(startCoord, board)!.Player, board)
        )
      )
    case 2:
      return isValidJump(startCoord, endCoord, board)
    default:
      return false
  }
}

export function movePiece(
  startCoord: Coord,
  endCoord: Coord,
  board: Board,
  requireJumps = true,
) {
  if (isValidMove(startCoord, endCoord, board, requireJumps)) {
    switch (Math.abs(startCoord.Row - endCoord.Row)) {
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
  coords: Move,
  board: Board | undefined,
  requireJumps = true,
): Board | undefined {
  if (!board) {
    return undefined
  }

  if (coords.length >= 3) {
    let newBoard = movePiece(coords[0], coords[1], board, requireJumps)
    return moveSequence(tail(coords), newBoard, requireJumps)
  } else {
    return movePiece(coords[0], coords[1], board, requireJumps)
  }
}

function wasCheckerMoved(moves: PdnMove[]) {
  return moves.some((item) => item.PieceTypeMoved === PieceType.Checker)
}

function wasPieceJumped(moves: PdnMove[]) {
  return moves.some((item) => item.IsJump)
}

export function isDrawn(initialFen: string, moveHistory: PdnTurn[]) {
  let fens = [
    initialFen,
    ...moveHistory.flatMap((f) => {
      if (
        !!f.BlackMove &&
        !!f.WhiteMove &&
        f.BlackMove.Move.length !== 0 &&
        f.WhiteMove.Move.length !== 0
      ) {
        return [f.BlackMove.ResultingFen, f.WhiteMove.ResultingFen]
      } else if (
        !!f.BlackMove &&
        f.BlackMove.Move.length !== 0 &&
        (!f.WhiteMove || f.WhiteMove.Move.length === 0)
      ) {
        return [f.BlackMove.ResultingFen]
      } else if (
        (!f.BlackMove || f.BlackMove.Move.length === 0) &&
        !!f.WhiteMove &&
        f.WhiteMove.Move.length === 0
      ) {
        return [f.WhiteMove.ResultingFen]
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
    .filter((f) => !!f.WhiteMove)
    .map((m) => m.WhiteMove!)
  let blackMoves = moveHistory
    .filter((f) => !!f.BlackMove)
    .map((m) => m.BlackMove!)

  let lastFortyWhiteMoves = drop(
    whiteMoves.filter((f) => f.Move.length !== 0),
    40,
  )
  let lastFortyBlackMoves = blackMoves
    .filter((f) => f.Move.length !== 0)
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

function moveAvailable(board: Board, player: Player) {
  function pieceHasMove(row: number, column: number): boolean {
    let piece = board[row][column]
    return (
      !!piece &&
      piece.Player === player &&
      (hasValidJump({ Row: row, Column: column }, board) ||
        hasValidHop({ Row: row, Column: column }, board))
    )
  }

  function loop(coord: Coord | undefined): boolean {
    if (!coord) {
      return false
    }

    return pieceHasMove(coord.Row, coord.Column)
      ? true
      : loop(nextPoint(coord, Rows, Columns))
  }

  return loop({ Row: 0, Column: 0 })
}

export function winningPlayer(board: Board, currentPlayer: Player | undefined) {
  const blackHasMove = moveAvailable(board, Player.Black)
  const whiteHasMove = moveAvailable(board, Player.White)

  if (!blackHasMove && !whiteHasMove) {
    return currentPlayer
  } else if (!whiteHasMove) {
    return Player.Black
  } else if (!blackHasMove) {
    return Player.White
  } else {
    return undefined
  }
}

export function playerTurnEnds(
  move: Move,
  originalBoard: Board,
  currentBoard: Board,
) {
  let lastMoveWasJump = Math.abs(move[0].Row - move[1].Row) === 2

  let pieceWasPromoted =
    square(last(move)!, currentBoard)!.PieceType === PieceType.King &&
    square(move[0], originalBoard)!.PieceType === PieceType.Checker

  return (
    pieceWasPromoted ||
    !(lastMoveWasJump && hasValidJump(last(move)!, currentBoard))
  )
}
