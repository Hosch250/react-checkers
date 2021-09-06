import React from 'react'
import { cloneDeep, last } from 'lodash'
import { GameController } from './models/game-controller'
import { ApiMembers } from './models/game-variant'
import { createFen } from './models/pdn'
import {
  Coord,
  Move,
  Player,
  square,
  Board as BoardType,
  PdnTurn,
} from './models/types'
import { useGameController } from './GameControllerContext'
import Board from './Board'

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
    gameController.currentPlayer === Player.Black
      ? gameHistory.length + 1
      : gameHistory.length === 0  // check if we're starting from a white-turn position
      ? 1
      : gameHistory.length

  let piece = square(move[0], originalBoard)

  let blackMove =
    gameController.currentPlayer === Player.Black
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
          player: Player.Black,
          isJump: gameController.variant.apiMembers.isJump(move, originalBoard),
        }
      : !!lastTurn && lastTurn.moveNumber === moveNumber
      ? last(gameHistory)!.blackMove
      : undefined

  let whiteMove =
    gameController.currentPlayer === Player.White
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
          player: Player.White,
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
  if (gameController.currentPlayer === Player.Black) {
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
      player: Player.Black,
      isJump: gameController.variant.apiMembers.isJump(move, originalBoard),
    }
  } else {
    blackMove = lastMovePdn.blackMove
  }

  let whiteMove
  if (gameController.currentPlayer === Player.White) {
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
      player: Player.White,
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

  if (gameController.currentPlayer === Player.Black && !isContinuedMove) {
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

export function getOnSquareClicked(
  controller: GameController,
  state: Coord | undefined,
  setState: React.Dispatch<React.SetStateAction<Coord | undefined>>,
  updateController: (value: GameController) => void,
) {
  function onclick(row: number, column: number) {
    const clickedCoord: Coord = {
      row: row,
      column: column,
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
      let move = [state, clickedCoord]
      let newBoard = controller.variant.apiMembers.moveSequence(
        move,
        controller.board,
      )!

      let turnHasEnded = controller.variant.apiMembers.playerTurnEnds(
        [state, clickedCoord],
        controller.board,
        newBoard,
      )
      let nextPlayer = !turnHasEnded
        ? controller.currentPlayer
        : controller.currentPlayer === Player.White
        ? Player.Black
        : Player.White

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
        currentCoord: turnHasEnded ? undefined : clickedCoord,
        moveHistory: history,
      }

      updateController(newController)
      setState(newController.currentCoord)

      let apiValue = cloneDeep(newController) as any
      apiValue.variant = newController.variant.variant
      console.log(JSON.stringify(apiValue))
    }
  }

  return onclick
}

export function GameBoard() {
  const [state, setState] = React.useState<Coord | undefined>(undefined)
  const { value, onChange } = useGameController()

  let memo = React.useCallback(getOnSquareClicked, [])

  return (
    <Board
      board={value.board}
      selectedCoord={state}
      onclick={memo(value, state, setState, onChange)}
    />
  )
}

export default GameBoard
