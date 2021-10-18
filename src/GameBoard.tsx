import React from 'react'
import { cloneDeep, last } from 'lodash'
import { GameController } from './models/game-controller'
import { ApiMembers } from './models/game-variant'
import { createFen } from './models/pdn'
import {
  Coord,
  Move,
  Color,
  square,
  Board as BoardType,
  PdnTurn,
  PlayerType,
} from './models/types'
import { useGameController } from './GameControllerContext'
import Board from './Board'
import axios from 'axios'

function getDisplayString(
  variant: ApiMembers,
  pdnTurn: number[],
  move: Move,
  board: BoardType,
) {
  return pdnTurn.join(variant.isJump(move, board) ? 'x' : '-')
}

function getLastFen(turn: PdnTurn) {
  if (!!turn.whiteMove) {
    return turn.whiteMove.resultingFen
  } else if (!!turn.blackMove) {
    return turn.blackMove.resultingFen
  } else {
    return undefined
  }
}

function getPdnForMove(
  gameController: GameController,
  move: Move,
  boardFen: string,
  originalBoard: BoardType,
) {
  let gameHistory = gameController.moveHistory
  let pdnMove = move.map(
    (m) => square(m, gameController.variant.pdnMembers.pdnBoard)!,
  )

  let lastTurn = last(gameHistory)
  let moveNumber =
    gameController.currentPlayer === Color.Black
      ? gameHistory.length + 1
      : gameHistory.length === 0 // check if we're starting from a white-turn position
      ? 1
      : gameHistory.length

  let piece = square(move[0], originalBoard)

  let blackMove =
    gameController.currentPlayer === Color.Black
      ? {
          move: pdnMove,
          resultingFen: boardFen,
          displayString: getDisplayString(
            gameController.variant.apiMembers,
            pdnMove,
            move,
            originalBoard,
          ),
          pieceTypeMoved: piece!.pieceType,
          player: Color.Black,
          isJump: gameController.variant.apiMembers.isJump(move, originalBoard),
        }
      : !!lastTurn && lastTurn.moveNumber === moveNumber
      ? last(gameHistory)!.blackMove
      : undefined

  let whiteMove =
    gameController.currentPlayer === Color.White
      ? {
          move: pdnMove,
          resultingFen: boardFen,
          displayString: getDisplayString(
            gameController.variant.apiMembers,
            pdnMove,
            move,
            originalBoard,
          ),
          pieceTypeMoved: piece!.pieceType,
          player: Color.White,
          isJump: gameController.variant.apiMembers.isJump(move, originalBoard),
        }
      : !!lastTurn && lastTurn.moveNumber === moveNumber
      ? last(gameHistory)!.whiteMove
      : undefined

  return { moveNumber: moveNumber, blackMove: blackMove, whiteMove: whiteMove }
}

function getPdnForContinuedMove(
  gameController: GameController,
  move: Move,
  boardFen: string,
  originalBoard: BoardType,
) {
  let gameHistory = gameController.moveHistory

  let lastMovePdn = last(gameHistory)!
  let pdnMove = move.map(
    (m) => square(m, gameController.variant.pdnMembers.pdnBoard)!,
  )

  let moveNumber = lastMovePdn.moveNumber

  let piece = square(move[0], originalBoard)

  let blackMove
  if (gameController.currentPlayer === Color.Black) {
    let newPdnMove = [...lastMovePdn.blackMove!.move, ...pdnMove.slice(1)]
    blackMove = {
      move: newPdnMove,
      resultingFen: boardFen,
      displayString: getDisplayString(
        gameController.variant.apiMembers,
        newPdnMove,
        move,
        originalBoard,
      ),
      pieceTypeMoved: piece!.pieceType,
      player: Color.Black,
      isJump: gameController.variant.apiMembers.isJump(move, originalBoard),
    }
  } else {
    blackMove = lastMovePdn.blackMove
  }

  let whiteMove
  if (gameController.currentPlayer === Color.White) {
    let newPdnMove = [...lastMovePdn.whiteMove!.move, ...pdnMove.slice(1)]
    whiteMove = {
      move: newPdnMove,
      resultingFen: boardFen,
      displayString: getDisplayString(
        gameController.variant.apiMembers,
        newPdnMove,
        move,
        originalBoard,
      ),
      pieceTypeMoved: piece!.pieceType,
      player: Color.White,
      isJump: gameController.variant.apiMembers.isJump(move, originalBoard),
    }
  } else {
    whiteMove = lastMovePdn.whiteMove
  }

  return { moveNumber: moveNumber, blackMove: blackMove, whiteMove: whiteMove }
}

function updateGameHistory(
  gameController: GameController,
  move: Move,
  boardFen: string,
  originalBoard: BoardType,
) {
  let isContinuedMove = !!gameController.currentCoord

  let newTurnValue = isContinuedMove
    ? getPdnForContinuedMove(gameController, move, boardFen, originalBoard)
    : getPdnForMove(gameController, move, boardFen, originalBoard)

  if (gameController.currentPlayer === Color.Black && !isContinuedMove) {
    return [...gameController.moveHistory, newTurnValue]
  } else if (gameController.moveHistory.length === 0) {
    return [newTurnValue]
  } else {
    gameController.moveHistory.splice(
      gameController.moveHistory.length - 1,
      1,
      newTurnValue,
    )
    return [...gameController.moveHistory]
  }
}

function makeMove(
  move: Move,
  controller: GameController,
  setState: (coord: Coord | undefined) => void,
  updateController: (value: GameController) => void,
) {
  let newBoard = controller.variant.apiMembers.moveSequence(
    move,
    controller.board,
  )!

  let turnHasEnded = controller.variant.apiMembers.playerTurnEnds(
    move,
    controller.board,
    newBoard,
  )
  let nextPlayer = !turnHasEnded
    ? controller.currentPlayer
    : controller.currentPlayer === Color.White
    ? Color.Black
    : Color.White

  let history = updateGameHistory(
    controller,
    move,
    createFen(controller.variant.pdnMembers, nextPlayer, newBoard),
    controller.board,
  )
  let newController = {
    ...controller,
    board: newBoard,
    currentPlayer: nextPlayer,
    currentCoord: turnHasEnded ? undefined : last(move),
    moveHistory: history,
  }

  updateController(newController)
  setState(newController.currentCoord)
}

export function getOnSquareClicked(
  controller: GameController,
  state: Coord | undefined,
  setState: (coord: Coord | undefined) => void,
  updateController: (value: GameController) => void,
) {
  function onclick(row: number, column: number) {
    const clickedCoord: Coord = {
      row: row,
      column: column,
    }

    if (
      (controller.currentPlayer === Color.White &&
        controller.whiteInfo.player === PlayerType.Computer) ||
      (controller.currentPlayer === Color.Black &&
        controller.blackInfo.player === PlayerType.Computer)
    ) {
      setState(undefined)
      return
    }

    if (
      controller.currentPlayer ===
      square(clickedCoord, controller.board)?.player
    ) {
      if (state?.row === row && state.column === column) {
        setState(undefined)
      } else {
        setState(clickedCoord)
      }
      return
    }

    if (!state) {
      return
    }

    if (
      controller.moveHistory.length !== 0 &&
      getLastFen(last(controller.moveHistory)!) !==
        createFen(
          controller.variant.pdnMembers,
          controller.currentPlayer,
          controller.board,
        )
    ) {
      return
    }

    if (
      controller.variant.apiMembers.isValidMove(
        state,
        clickedCoord,
        controller.board,
      )
    ) {
      makeMove([state, clickedCoord], controller, setState, updateController)
    }
  }

  return onclick
}

export function GameBoard() {
  const [state, setState] = React.useState<Coord | undefined>(undefined)
  const { value, onChange } = useGameController()

  let memo = React.useCallback(
    getOnSquareClicked(value, state, setState, onChange),
    [state, value],
  )
  React.useEffect(() => {
    if (
      (value.currentPlayer === Color.White &&
        value.whiteInfo.player === PlayerType.Computer) ||
      (value.currentPlayer === Color.Black &&
        value.blackInfo.player === PlayerType.Computer)
    ) {
      let dto = cloneDeep(value) as any
      dto.variant = value.variant.variant
      delete dto.blackInfo
      delete dto.whiteInfo

      let level =
        value.currentPlayer === Color.White
          ? value.whiteInfo.aiLevel!
          : value.blackInfo.aiLevel!

      const endpoint = `${process.env.REACT_APP_URL}/CheckersAi_GetMove/${level}?code=HT9j95pjEil4NSTBqSYIeLYgeemuasljnBZ3YaMAzL3BTpgQEP9Etg==`
      axios
        .post<Move>(endpoint, dto)
        .then((move) => {
          makeMove(move.data, value, setState, onChange)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [value])

  return <Board board={value.board} selectedCoord={state} onclick={memo} />
}

export default GameBoard
