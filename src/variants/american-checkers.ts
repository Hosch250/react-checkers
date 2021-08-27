import {
  Board,
  Coord,
  Move,
  moveIsDiagonal,
  nextPoint,
  offset,
  Piece,
  PieceType,
  Player,
  promote,
  square,
} from '../models/types'
import cloneDeep from 'lodash'

const Rows = 7
const Columns = 7
const StartingPlayer = Player.Black

// let internal pdnBoard =
//     array2D [
//         [None; Some 1; None; Some 2; None; Some 3; None; Some 4];
//         [Some 5; None; Some 6; None; Some 7; None; Some 8; None];
//         [None; Some 9; None; Some 10; None; Some 11; None; Some 12];
//         [Some 13; None; Some 14; None; Some 15; None; Some 16; None];
//         [None; Some 17; None; Some 18; None; Some 19; None; Some 20];
//         [Some 21; None; Some 22; None; Some 23; None; Some 24; None];
//         [None; Some 25; None; Some 26; None; Some 27; None; Some 28];
//         [Some 29; None; Some 30; None; Some 31; None; Some 32; None];
//     ]

// let internal pdnBoardCoords =
//     [
//         {Row = -1; Column = -1};    // adjust for FEN's 1-based indexing
//         {Row = 0; Column = 1}; {Row = 0; Column = 3}; {Row = 0; Column = 5}; {Row = 0; Column = 7};
//         {Row = 1; Column = 0}; {Row = 1; Column = 2}; {Row = 1; Column = 4}; {Row = 1; Column = 6};
//         {Row = 2; Column = 1}; {Row = 2; Column = 3}; {Row = 2; Column = 5}; {Row = 2; Column = 7};
//         {Row = 3; Column = 0}; {Row = 3; Column = 2}; {Row = 3; Column = 4}; {Row = 3; Column = 6};
//         {Row = 4; Column = 1}; {Row = 4; Column = 3}; {Row = 4; Column = 5}; {Row = 4; Column = 7};
//         {Row = 5; Column = 0}; {Row = 5; Column = 2}; {Row = 5; Column = 4}; {Row = 5; Column = 6};
//         {Row = 6; Column = 1}; {Row = 6; Column = 3}; {Row = 6; Column = 5}; {Row = 6; Column = 7};
//         {Row = 7; Column = 0}; {Row = 7; Column = 2}; {Row = 7; Column = 4}; {Row = 7; Column = 6};
//     ]

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

function isJump(move: Move, originalBoard: Board) {
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

  let anyHopIsValid = (hops: Move): boolean => {
    let coord = hops.shift()!
    if (coordExists(coord) && isValidHop(startCoord, coord, board)) {
      return true
    } else if (hops.length === 0) {
      return false
    } else {
      return anyHopIsValid(hops)
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

  let anyJumpIsValid = (jumps: Move): boolean => {
    let coord = jumps.shift()!
    if (coordExists(coord) && isValidJump(startCoord, coord, board)) {
      return true
    } else if (jumps.length === 0) {
      return false
    } else {
      return anyJumpIsValid(jumps)
    }
  }

  return anyJumpIsValid(jumpCoords)
}

function jumpAvailable(player: Player, board: Board) {
  let pieceHasJump = (row: number, column: number): boolean => {
    let piece = board[row][column]
    return (
      !!piece &&
      piece.Player === player &&
      hasValidJump({ Row: row, Column: column }, board)
    )
  }

  let loop = (coord: Coord | undefined): boolean => {
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
  let newBoard: Board = cloneDeep(board).value()

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
    coords.shift()
    return moveSequence(coords, newBoard, requireJumps)
  } else {
    return movePiece(coords[0], coords[1], board, requireJumps)
  }
}
