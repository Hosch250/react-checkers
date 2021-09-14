import { cloneDeep, isEqual, last, some, tail } from 'lodash'
import { blackChecker, Board, Color, Coord, Move, moveIsOrthogonal, nextPoint, offset, PdnTurn, Piece, PieceType, promote, square, whiteChecker } from '../models/types'

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

export const defaultFen = '[FEN "B:W41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56:B9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24"]'

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

export const pdnBoardCoords = [
  { row: -1, column: -1 }, // adjust for FEN's 1-based indexing
  { row: 0, column: 0 },
  { row: 0, column: 1 },
  { row: 0, column: 2 },
  { row: 0, column: 3 },
  { row: 0, column: 4 },
  { row: 0, column: 5 },
  { row: 0, column: 6 },
  { row: 0, column: 7 },
  { row: 1, column: 0 },
  { row: 1, column: 1 },
  { row: 1, column: 2 },
  { row: 1, column: 3 },
  { row: 1, column: 4 },
  { row: 1, column: 5 },
  { row: 1, column: 6 },
  { row: 1, column: 7 },
  { row: 2, column: 0 },
  { row: 2, column: 1 },
  { row: 2, column: 2 },
  { row: 2, column: 3 },
  { row: 2, column: 4 },
  { row: 2, column: 5 },
  { row: 2, column: 6 },
  { row: 2, column: 7 },
  { row: 3, column: 0 },
  { row: 3, column: 1 },
  { row: 3, column: 2 },
  { row: 3, column: 3 },
  { row: 3, column: 4 },
  { row: 3, column: 5 },
  { row: 3, column: 6 },
  { row: 3, column: 7 },
  { row: 4, column: 0 },
  { row: 4, column: 1 },
  { row: 4, column: 2 },
  { row: 4, column: 3 },
  { row: 4, column: 4 },
  { row: 4, column: 5 },
  { row: 4, column: 6 },
  { row: 4, column: 7 },
  { row: 5, column: 0 },
  { row: 5, column: 1 },
  { row: 5, column: 2 },
  { row: 5, column: 3 },
  { row: 5, column: 4 },
  { row: 5, column: 5 },
  { row: 5, column: 6 },
  { row: 5, column: 7 },
  { row: 6, column: 0 },
  { row: 6, column: 1 },
  { row: 6, column: 2 },
  { row: 6, column: 3 },
  { row: 6, column: 4 },
  { row: 6, column: 5 },
  { row: 6, column: 6 },
  { row: 6, column: 7 },
  { row: 7, column: 0 },
  { row: 7, column: 1 },
  { row: 7, column: 2 },
  { row: 7, column: 3 },
  { row: 7, column: 4 },
  { row: 7, column: 5 },
  { row: 7, column: 6 },
  { row: 7, column: 7 },
]

function kingRowIndex(player: Color) {
  return player === Color.Black ? Rows : 0
}

function getJumpedCoord(startCoord: Coord, endCoord: Coord, board: Board) {
  let rowSign = Math.sign(startCoord.row - endCoord.row)
  let colSign = Math.sign(startCoord.column - endCoord.column)

  let targetCoord = endCoord
  do {
    targetCoord = {
      row: targetCoord.row + rowSign,
      column: targetCoord.column + colSign,
    }

    if (!!square(targetCoord, board)) {
      return targetCoord
    }
  } while (coordExists(targetCoord) && !isEqual(targetCoord, startCoord))

  return undefined
}

function coordExists(coord: Coord) {
  return (
    coord.row >= 0 &&
    coord.row <= Rows &&
    coord.column >= 0 &&
    coord.column <= Columns
  )
}

export function getJumpTargets(
  currentPlayer: Color,
  currentCoord: Coord,
  rowSign: number,
  colSign: number,
  board: Board,
): Coord[] {
  let nextCoord = offset(currentCoord, { row: rowSign, column: colSign })

  if (!coordExists(nextCoord)) {
    return []
  }

  let currentSquare = square(currentCoord, board)
  let nextSquare = square(nextCoord, board)
  if (
    (!!currentSquare && currentSquare.player === currentPlayer) ||
    (!!currentSquare && !!nextSquare)
  ) {
    return []
  } else if (
    !!currentSquare &&
    currentSquare.player !== currentPlayer &&
    !nextSquare
  ) {
    let targets = [nextCoord]
    do {
      let targetN = offset(last(targets)!, { row: rowSign, column: colSign })
      if (coordExists(targetN) && !square(targetN, board)) {
        targets.push(targetN)
      } else {
        break
      }
    } while (true)

    return targets
  } else {
    return getJumpTargets(currentPlayer, nextCoord, rowSign, colSign, board)
  }
}

export function isJump(move: Move, originalBoard: Board) {
  if (Math.abs(move[0].row - move[1].row) === 1 || Math.abs(move[0].column - move[1].column) === 1) {
    return false
  } else {
    let rowSign = Math.sign(move[0].row - move[1].row)
    let colSign = Math.sign(move[0].column - move[1].column)

    let targetCoord = move[1]
    let pieceJumpedCount = 0
    do {
      targetCoord = {
        row: targetCoord.row + rowSign,
        column: targetCoord.column + colSign,
      }

      if (coordExists(targetCoord) && !!square(targetCoord, originalBoard) && !isEqual(targetCoord, move[0])) {
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
  endCoord: Coord
) {
  switch (piece?.pieceType) {
    case PieceType.Checker:
      return (
        (piece.player === Color.Black && startCoord.row <= endCoord.row) ||
        (piece.player === Color.White && startCoord.row >= endCoord.row)
      )
    case PieceType.King:
      return true
    default:
      return false
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
    checkMoveDirection(piece, startCoord, endCoord) &&
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

function isValidCheckerJump(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)!

  let jumpedCoord = getJumpedCoord(startCoord, endCoord, board)
  let jumpedPiece = square(jumpedCoord!, board)

  return (
    checkMoveDirection(piece, startCoord, endCoord) &&
    (Math.abs(startCoord.row - endCoord.row) === 2 || Math.abs(startCoord.column - endCoord.column) === 2) &&
    !square(endCoord, board) &&
    !!jumpedPiece &&
    jumpedPiece.player !== piece.player
  )
}

function isValidKingJump(startCoord: Coord, endCoord: Coord, board: Board) {
  let piece = square(startCoord, board)!

  let jumpedCoord = getJumpedCoord(startCoord, endCoord, board)
  let jumpedPiece = square(jumpedCoord!, board)

  let rowSign = Math.sign(endCoord.row - startCoord.row)
  let colSign = Math.sign(endCoord.column - startCoord.column)
  let nextCoord = offset(startCoord, { row: rowSign, column: colSign })

  let jumpTarget = getJumpTargets(
    piece.player,
    nextCoord,
    rowSign,
    colSign,
    board,
  )

  return (
    !!jumpTarget &&
    some(jumpTarget, endCoord) &&
    !square(endCoord, board) &&
    !!jumpedPiece &&
    jumpedPiece.player !== piece.player
  )
}

function isValidHop(startCoord: Coord, endCoord: Coord, board: Board) {
  return square(startCoord, board)!.pieceType === PieceType.Checker
    ? isValidCheckerHop(startCoord, endCoord, board)
    : isValidKingHop(startCoord, endCoord, board)
}

function isValidJump(startCoord: Coord, endCoord: Coord, board: Board) {
  return square(startCoord, board)!.pieceType === PieceType.Checker
    ? isValidCheckerJump(startCoord, endCoord, board)
    : isValidKingJump(startCoord, endCoord, board)
}

function hasValidHop(startCoord: Coord, board: Board) {
  let hopCoords = [
    offset(startCoord, { row: 0, column: 1 }),
    offset(startCoord, { row: 0, column: -1 }),
    offset(startCoord, { row: 1, column: 0 }),
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
    offset(startCoord, { row: 0, column: 2 }),
    offset(startCoord, { row: 0, column: -2 }),
    offset(startCoord, { row: 2, column: 0 }),
    offset(startCoord, { row: -2, column: 0 }),
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
    { row: 0, column: 2 },
    { row: 0, column: -2 },
    { row: 2, column: 0 },
    { row: -2, column: 0 },
  ]

  let currentPlayer = square(startCoord, board)!.player

  function getJumps(acc: Coord[], jumpOffsets: Coord[]): Coord[] {
    let head = jumpOffsets[0]
    let jumpOffsetsTail = tail(jumpOffsets)
    let jumpCoords = getJumpTargets(
      currentPlayer,
      offset(startCoord, { row: head.row, column: head.column }),
      head.row,
      head.column,
      board,
    )
    let currentJumps = !jumpCoords ? acc : [...acc, ...jumpCoords]

    return jumpOffsetsTail.length === 0
      ? currentJumps
      : getJumps(currentJumps, jumpOffsetsTail)
  }

  return getJumps([], jumpCoordOffsets).length !== 0
}

function hasValidJump(startCoord: Coord, board: Board) {
  let piece = square(startCoord, board)!
  return piece.pieceType === PieceType.Checker
    ? hasValidCheckerJump(startCoord, board)
    : hasValidKingJump(startCoord, board)
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
    return !coord
      ? false
      : pieceHasJump(coord.row, coord.column)
      ? true
      : loop(nextPoint(coord, Rows, Columns))
  }

  return loop({ row: 0, column: 0 })
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
    return !coord
      ? false
      : pieceHasMove(coord.row, coord.column)
      ? true
      : loop(nextPoint(coord, Rows, Columns))
  }

  return loop({ row: 0, column: 0 })
}

export function winningPlayer(board: Board, currentPlayer: Color | undefined) {
  return undefined
  // const blackHasMove = moveAvailable(board, Color.Black)
  // const whiteHasMove = moveAvailable(board, Color.White)

  // if (!blackHasMove && !whiteHasMove) {
  //   return currentPlayer
  // } else if (!whiteHasMove) {
  //   return Color.Black
  // } else if (!blackHasMove) {
  //   return Color.White
  // } else {
  //   return undefined
  // }
}

export function isDrawn(initialFen: string, moveHistory: PdnTurn[]) {
  return false 
  // let fens = [
  //   initialFen,
  //   ...moveHistory.flatMap((f) => {
  //     if (
  //       !!f.blackMove &&
  //       !!f.whiteMove &&
  //       f.blackMove.move.length !== 0 &&
  //       f.whiteMove.move.length !== 0
  //     ) {
  //       return [f.blackMove.resultingFen, f.whiteMove.resultingFen]
  //     } else if (
  //       !!f.blackMove &&
  //       f.blackMove.move.length !== 0 &&
  //       (!f.whiteMove || f.whiteMove.move.length === 0)
  //     ) {
  //       return [f.blackMove.resultingFen]
  //     } else if (
  //       !!f.whiteMove &&
  //       f.whiteMove.move.length !== 0 &&
  //       (!f.blackMove || f.blackMove.move.length === 0)
  //     ) {
  //       return [f.whiteMove.resultingFen]
  //     } else {
  //       return []
  //     }
  //   }),
  // ]

  // let positionsByTimesReached = countBy(fens)
  // let hasReachedPositionThreeTimes =
  //   Math.max(
  //     ...keys(positionsByTimesReached).map((m) => positionsByTimesReached[m]),
  //   ) >= 3

  // let movesSinceOneVsThreeRule = dropWhile(fens, (f) => !oneVsThreeKingRule(f))

  // return hasReachedPositionThreeTimes || movesSinceOneVsThreeRule.length === 26
}

function setPieceAt(coord: Coord, piece: Piece | undefined, board: Board) {
  let newBoard: Board = (cloneDeep(board) as unknown) as Board
  newBoard[coord.row][coord.column] = piece

  return newBoard
}

export function playerTurnEnds(
  move: Move,
  originalBoard: Board,
  currentBoard: Board,
) {
  let lastMoveWasJump = isJump(move, originalBoard)
  let pieceWasPromoted =
    square(last(move)!, currentBoard)!.pieceType === PieceType.King &&
    square(move[0], originalBoard)!.pieceType === PieceType.Checker

  return (
    pieceWasPromoted ||
    !(lastMoveWasJump && hasValidJump(last(move)!, currentBoard))
  )
}

function jump(startCoord: Coord, endCoord: Coord, board: Board) {
  let kri = kingRowIndex(square(startCoord, board)!.player)

  let piece = square(startCoord, board)
  let jumpedCoord = getJumpedCoord(startCoord, endCoord, board)

  let newBoard = setPieceAt(startCoord, undefined, board)
  newBoard = setPieceAt(endCoord, piece, newBoard)
  newBoard = setPieceAt(jumpedCoord!, undefined, newBoard)

  if (
    playerTurnEnds([startCoord, endCoord], board, newBoard) &&
    endCoord.row === kri
  ) {
    return setPieceAt(endCoord, promote(piece!), newBoard)
  } else {
    return newBoard
  }
}

function hop(startCoord: Coord, endCoord: Coord, board: Board) {
  let kri = kingRowIndex(square(startCoord, board)!.player)

  let piece =
    endCoord.row === kri
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
    moveIsOrthogonal(startCoord, endCoord) &&
    !!square(startCoord, board) &&
    (isValidJump(startCoord, endCoord, board) ||
      (isValidHop(startCoord, endCoord, board) &&
        !jumpAvailable(square(startCoord, board)!.player, board)))
  return isValidMove
}

export function movePiece(startCoord: Coord, endCoord: Coord, board: Board) {
  if (!isValidMove(startCoord, endCoord, board)) {
    return undefined
  } else {
    return Math.abs(startCoord.row - endCoord.row) === 1
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

// todo: implement king vs checker win rule
// todo: implement max piece count jump rule