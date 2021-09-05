import {
  cloneDeep,
  countBy,
  last,
  tail,
  keys,
  dropWhile,
  isEqual,
} from 'lodash'
import {
  Board,
  Coord,
  Move,
  moveIsDiagonal,
  nextPoint,
  offset,
  PdnTurn,
  Piece,
  PieceType,
  Player,
  promote,
  square,
} from '../models/types'

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

function getJumpedCoord(startCoord: Coord, endCoord: Coord) {
  return {
    Row: endCoord.Row + Math.sign(startCoord.Row - endCoord.Row),
    Column: endCoord.Column + Math.sign(startCoord.Column - endCoord.Column),
  }
}

function kingRowIndex(player: Player) {
  return player === Player.Black ? Rows : 0
}

function coordExists(coord: Coord) {
  return (
    coord.Row >= 0 &&
    coord.Row <= Rows &&
    coord.Column >= 0 &&
    coord.Column <= Columns
  )
}

export function isJump(move: Move, originalBoard: Board) {
  if (Math.abs(move[0].Row - move[1].Row) === 1) {
    return false
  } else {
    let rowSign = Math.sign(move[0].Row - move[1].Row)
    let colSign = Math.sign(move[0].Column - move[1].Column)

    let targetCoord = {
      Row: last(move)!.Row + rowSign,
      Column: last(move)!.Column + colSign,
    }

    return !coordExists(targetCoord)
      ? false
      : square(targetCoord, originalBoard) === undefined
      ? false
      : true
  }
}

export function getJumpTarget(
  currentPlayer: Player,
  currentCoord: Coord,
  rowSign: number,
  colSign: number,
  board: Board,
): Coord | undefined {
  let nextCoord = offset(currentCoord, { Row: rowSign, Column: colSign })

  if (!coordExists(nextCoord)) {
    return undefined
  }

  let currentSquare = square(currentCoord, board)
  let nextSquare = square(nextCoord, board)
  if (
    (!!currentSquare && currentSquare.Player === currentPlayer) ||
    (!!currentSquare && !!nextSquare)
  ) {
    return undefined
  } else if (
    !!currentSquare &&
    currentSquare.Player !== currentPlayer &&
    !nextSquare
  ) {
    return nextCoord
  } else {
    return getJumpTarget(currentPlayer, nextCoord, rowSign, colSign, board)
  }
}

export function getHopTargets(
  currentPlayer: Player,
  currentCoord: Coord,
  rowSign: number,
  colSign: number,
  board: Board,
) {
  function getTargets(
    targets: Coord[],
    currentPlayer: Player,
    currentCoord: Coord,
    rowSign: number,
    colSign: number,
    board: Board,
  ): Coord[] {
    if (!coordExists(currentCoord) || !!square(currentCoord, board)) {
      return targets
    } else {
      targets.push(currentCoord)
      let nextCoord = offset(currentCoord, { Row: rowSign, Column: colSign })
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

function checkMoveDirection(
  piece: Piece,
  startCoord: Coord,
  endCoord: Coord,
  board: Board,
) {
  let moveIsJump = isJump([startCoord, endCoord], board)

  if (piece.PieceType === PieceType.Checker && !moveIsJump) {
    return piece.Player === Player.Black
      ? startCoord.Row < endCoord.Row
      : startCoord.Row > endCoord.Row
  } else {
    return true
  }
}

function isValidCheckerHop(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)!

  return (
    Math.abs(startCoord.Row - endCoord.Row) === 1 &&
    checkMoveDirection(piece, startCoord, endCoord, board) &&
    !square(endCoord, board)
  )
}

function isValidKingHop(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)!
  let rowSign = Math.sign(endCoord.Row - startCoord.Row)
  let colSign = Math.sign(endCoord.Column - startCoord.Column)
  let nextCoord = offset(startCoord, { Row: rowSign, Column: colSign })

  let hopTargets = getHopTargets(
    piece.Player,
    nextCoord,
    rowSign,
    colSign,
    board,
  )

  return hopTargets.some((s) => isEqual(s, endCoord))
}

function isValidCheckerJump(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)!

  let jumpedCoord = getJumpedCoord(startCoord, endCoord)
  let jumpedPiece = square(jumpedCoord, board)

  return (
    Math.abs(startCoord.Row - endCoord.Row) === 2 &&
    !square(endCoord, board) &&
    !!jumpedPiece &&
    jumpedPiece.Player !== piece.Player
  )
}

function isValidKingJump(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)!

  let jumpedCoord = getJumpedCoord(startCoord, endCoord)
  let jumpedPiece = square(jumpedCoord, board)

  let rowSign = Math.sign(endCoord.Row - startCoord.Row)
  let colSign = Math.sign(endCoord.Column - startCoord.Column)
  let nextCoord = offset(startCoord, { Row: rowSign, Column: colSign })

  let jumpTarget = getJumpTarget(
    piece.Player,
    nextCoord,
    rowSign,
    colSign,
    board,
  )

  return (
    !!jumpTarget &&
    isEqual(jumpTarget, endCoord) &&
    !square(endCoord, board) &&
    !!jumpedPiece &&
    jumpedPiece.Player !== piece.Player
  )
}

function isValidHop(startCoord: Coord, endCoord: Coord, board: Board) {
  return square(startCoord, board)!.PieceType === PieceType.Checker
    ? isValidCheckerHop(startCoord, endCoord, board)
    : isValidKingHop(startCoord, endCoord, board)
}

function isValidJump(startCoord: Coord, endCoord: Coord, board: Board) {
  return square(startCoord, board)!.PieceType === PieceType.Checker
    ? isValidCheckerJump(startCoord, endCoord, board)
    : isValidKingJump(startCoord, endCoord, board)
}

function hasValidHop(startCoord: Coord, board: Board) {
  let hopCoords = [
    offset(startCoord, { Row: -1, Column: 1 }),
    offset(startCoord, { Row: -1, Column: -1 }),
    offset(startCoord, { Row: 1, Column: 1 }),
    offset(startCoord, { Row: 1, Column: -1 }),
  ]

  function anyHopIsValid(hops: Coord[]): boolean {
    let coord = hops[0]
    let hopsTail = tail(hops)

    if (coordExists(coord) && isValidHop(startCoord, coord, board)) {
      return true
    } else if (hopsTail.length === 0) {
      return false
    } else {
      return anyHopIsValid(hopsTail)
    }
  }

  return anyHopIsValid(hopCoords)
}

function hasValidCheckerJump(startCoord: Coord, board: Board) {
  let jumpCoords = [
    offset(startCoord, { Row: -2, Column: 2 }),
    offset(startCoord, { Row: -2, Column: -2 }),
    offset(startCoord, { Row: 2, Column: 2 }),
    offset(startCoord, { Row: 2, Column: -2 }),
  ]

  function anyJumpIsValid(jumps: Coord[]): boolean {
    let coord = jumps[0]
    let jumpsTail = tail(jumps)

    if (coordExists(coord) && isValidJump(startCoord, coord, board)) {
      return true
    } else if (jumpsTail.length === 0) {
      return false
    } else {
      return anyJumpIsValid(jumpsTail)
    }
  }

  return anyJumpIsValid(jumpCoords)
}

function hasValidKingJump(startCoord: Coord, board: Board) {
  let jumpCoordOffsets = [
    { Row: -1, Column: 1 },
    { Row: -1, Column: -1 },
    { Row: 1, Column: 1 },
    { Row: 1, Column: -1 },
  ]

  let currentPlayer = square(startCoord, board)!.Player

  function getJumps(acc: Coord[], jumpOffsets: Coord[]): Coord[] {
    let head = jumpOffsets[0]
    let jumpOffsetsTail = tail(jumpOffsets)
    let jumpCoord = getJumpTarget(
      currentPlayer,
      offset(startCoord, { Row: head.Row, Column: head.Column }),
      head.Row,
      head.Column,
      board,
    )
    let currentJumps = !jumpCoord ? acc : [...acc, jumpCoord]

    return jumpOffsetsTail.length === 0
      ? currentJumps
      : getJumps(currentJumps, jumpOffsetsTail)
  }

  return getJumps([], jumpCoordOffsets).length !== 0
}

function hasValidJump(startCoord: Coord, board: Board) {
  let piece = square(startCoord, board)!
  return piece.PieceType === PieceType.Checker
    ? hasValidCheckerJump(startCoord, board)
    : hasValidKingJump(startCoord, board)
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
    return !coord
      ? false
      : pieceHasJump(coord.Row, coord.Column)
      ? true
      : loop(nextPoint(coord, Rows, Columns))
  }

  return loop({ Row: 0, Column: 0 })
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
    return !coord
      ? false
      : pieceHasMove(coord.Row, coord.Column)
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

function oneVsThreeKingRule(fen: string) {
  let fenValue = fen.split('"')[1]
  let fenSubsections = fenValue.split(':')

  let whiteKings = fenSubsections[1]
    .substring(1)
    .split(',')
    .filter((f) => f !== '' && f[0] === 'K')

  let blackKings = fenSubsections[2]
    .substring(1)
    .split(',')
    .filter((f) => f !== '' && f[0] === 'K')

  return (
    (whiteKings.length === 1 && blackKings.length >= 3) ||
    (whiteKings.length >= 3 && blackKings.length === 1)
  )
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
        !!f.WhiteMove &&
        f.WhiteMove.Move.length !== 0 &&
        (!f.BlackMove || f.BlackMove.Move.length === 0)
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

  let movesSinceOneVsThreeRule = dropWhile(fens, (f) => !oneVsThreeKingRule(f))

  return hasReachedPositionThreeTimes || movesSinceOneVsThreeRule.length === 26
}

function setPieceAt(coord: Coord, piece: Piece | undefined, board: Board) {
  let newBoard: Board = (cloneDeep(board) as unknown) as Board
  newBoard[coord.Row][coord.Column] = piece

  return newBoard
}

export function playerTurnEnds(
  move: Move,
  originalBoard: Board,
  currentBoard: Board,
) {
  let lastMoveWasJump = isJump(move, originalBoard)
  let pieceWasPromoted =
    square(last(move)!, currentBoard)!.PieceType === PieceType.King &&
    square(move[0], originalBoard)!.PieceType === PieceType.Checker

  return (
    pieceWasPromoted ||
    !(lastMoveWasJump && hasValidJump(last(move)!, currentBoard))
  )
}

function jump(startCoord: Coord, endCoord: Coord, board: Board) {
  let kri = kingRowIndex(square(startCoord, board)!.Player)

  let piece = square(startCoord, board)
  let jumpedCoord = getJumpedCoord(startCoord, endCoord)

  let newBoard = setPieceAt(startCoord, undefined, board)
  newBoard = setPieceAt(endCoord, piece, newBoard)
  newBoard = setPieceAt(jumpedCoord, undefined, newBoard)

  if (
    playerTurnEnds([startCoord, endCoord], board, newBoard) &&
    endCoord.Row === kri
  ) {
    return setPieceAt(endCoord, promote(piece!), newBoard)
  } else {
    return newBoard
  }
}

function hop(startCoord: Coord, endCoord: Coord, board: Board) {
  let kri = kingRowIndex(square(startCoord, board)!.Player)

  let piece =
    endCoord.Row === kri
      ? promote(square(startCoord, board)!)
      : square(startCoord, board)

  let newBoard = setPieceAt(startCoord, undefined, board)
  newBoard = setPieceAt(endCoord, piece, newBoard)
  return newBoard
}

export function isValidMove(startCoord: Coord, endCoord: Coord, board: Board) {
  let isValidMove =
    coordExists(startCoord) &&
    coordExists(endCoord) &&
    moveIsDiagonal(startCoord, endCoord) &&
    !!square(startCoord, board) &&
    (isValidJump(startCoord, endCoord, board) ||
      (isValidHop(startCoord, endCoord, board) &&
        !jumpAvailable(square(startCoord, board)!.Player, board)))
  return isValidMove
}

export function movePiece(startCoord: Coord, endCoord: Coord, board: Board) {
  if (!isValidMove(startCoord, endCoord, board)) {
    return undefined
  } else {
    return Math.abs(startCoord.Row - endCoord.Row) === 1
      ? hop(startCoord, endCoord, board)
      : jump(startCoord, endCoord, board)
  }
}

export function moveSequence(
  move: Move,
  board: Board | undefined,
): Board | undefined {
  if (!board) {
    return undefined
  } else if (move.length >= 3) {
    let newBoard = movePiece(move[0], move[1], board)
    return moveSequence(tail(move), newBoard)
  } else {
    return movePiece(move[0], move[1], board)
  }
}
