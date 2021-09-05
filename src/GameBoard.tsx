import React from 'react'
import { last } from 'lodash'
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
  if (!!turn.WhiteMove) {
    return turn.WhiteMove.ResultingFen
  } else if (!!turn.BlackMove) {
    return turn.BlackMove.ResultingFen
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
  let gameHistory = gameController.MoveHistory
  let pdnMove = move.map(
    (m) => square(m, gameController.Variant.pdnMembers.pdnBoard)!,
  )

  let lastTurn = last(gameHistory)
  let moveNumber =
    gameController.CurrentPlayer === Player.Black
      ? gameHistory.length + 1
      : gameHistory.length

  let piece = square(move[0], originalBoard)

  let blackMove =
    gameController.CurrentPlayer === Player.Black
      ? {
          Move: pdnMove,
          ResultingFen: boardFen,
          DisplayString: getDisplayString(
            gameController.Variant.apiMembers,
            pdnMove,
            move,
            originalBoard,
          ),
          PieceTypeMoved: piece!.PieceType,
          Player: Player.Black,
          IsJump: gameController.Variant.apiMembers.isJump(move, originalBoard),
        }
      : !!lastTurn && lastTurn.MoveNumber === moveNumber
      ? last(gameHistory)!.BlackMove
      : undefined

  let whiteMove =
    gameController.CurrentPlayer === Player.White
      ? {
          Move: pdnMove,
          ResultingFen: boardFen,
          DisplayString: getDisplayString(
            gameController.Variant.apiMembers,
            pdnMove,
            move,
            originalBoard,
          ),
          PieceTypeMoved: piece!.PieceType,
          Player: Player.White,
          IsJump: gameController.Variant.apiMembers.isJump(move, originalBoard),
        }
      : !!lastTurn && lastTurn.MoveNumber === moveNumber
      ? last(gameHistory)!.WhiteMove
      : undefined

  return { MoveNumber: moveNumber, BlackMove: blackMove, WhiteMove: whiteMove }
}

function getPdnForContinuedMove(
  gameController: GameController,
  move: Move,
  boardFen: string,
  originalBoard: BoardType,
) {
  let gameHistory = gameController.MoveHistory

  let lastMovePdn = last(gameHistory)!
  let pdnMove = move.map(
    (m) => square(m, gameController.Variant.pdnMembers.pdnBoard)!,
  )

  let moveNumber = lastMovePdn.MoveNumber

  let piece = square(move[0], originalBoard)

  let blackMove
  if (gameController.CurrentPlayer === Player.Black) {
    let newPdnMove = [...lastMovePdn.BlackMove!.Move, ...pdnMove.slice(1)]
    blackMove = {
      Move: newPdnMove,
      ResultingFen: boardFen,
      DisplayString: getDisplayString(
        gameController.Variant.apiMembers,
        newPdnMove,
        move,
        originalBoard,
      ),
      PieceTypeMoved: piece!.PieceType,
      Player: Player.Black,
      IsJump: gameController.Variant.apiMembers.isJump(move, originalBoard),
    }
  } else {
    blackMove = lastMovePdn.BlackMove
  }

  let whiteMove
  if (gameController.CurrentPlayer === Player.White) {
    let newPdnMove = [...lastMovePdn.WhiteMove!.Move, ...pdnMove.slice(1)]
    whiteMove = {
      Move: newPdnMove,
      ResultingFen: boardFen,
      DisplayString: getDisplayString(
        gameController.Variant.apiMembers,
        newPdnMove,
        move,
        originalBoard,
      ),
      PieceTypeMoved: piece!.PieceType,
      Player: Player.White,
      IsJump: gameController.Variant.apiMembers.isJump(move, originalBoard),
    }
  } else {
    whiteMove = lastMovePdn.WhiteMove
  }

  return { MoveNumber: moveNumber, BlackMove: blackMove, WhiteMove: whiteMove }
}

function updateGameHistory(
  gameController: GameController,
  move: Move,
  boardFen: string,
  originalBoard: BoardType,
) {
  let isContinuedMove = !!gameController.CurrentCoord

  let newTurnValue = isContinuedMove
    ? getPdnForContinuedMove(gameController, move, boardFen, originalBoard)
    : getPdnForMove(gameController, move, boardFen, originalBoard)

  if (gameController.CurrentPlayer === Player.Black && !isContinuedMove) {
    return [...gameController.MoveHistory, newTurnValue]
  } else if (gameController.MoveHistory.length === 0) {
    return [newTurnValue]
  } else {
    gameController.MoveHistory.splice(
      gameController.MoveHistory.length - 1,
      1,
      newTurnValue,
    )
    return [...gameController.MoveHistory]
  }
}

export function getOnSquareClicked(
  controller: GameController,
  state: Coord | undefined,
  setState: React.Dispatch<React.SetStateAction<Coord | undefined>>,
  updateController: (value: GameController) => void,
) {
  let onclick = (row: number, column: number) => {
    const clickedCoord: Coord = {
      Row: row,
      Column: column,
    }

    if (
      controller.CurrentPlayer ===
      square(clickedCoord, controller.Board)?.Player
    ) {
      if (state?.Row === row && state.Column === column) {
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
      controller.MoveHistory.length !== 0 &&
      getLastFen(last(controller.MoveHistory)!) !==
        createFen(
          controller.Variant.pdnMembers,
          controller.CurrentPlayer,
          controller.Board,
        )
    ) {
      return
    }

    if (
      controller.Variant.apiMembers.isValidMove(
        state,
        clickedCoord,
        controller.Board,
      )
    ) {
      let move = [state, clickedCoord]
      let newBoard = controller.Variant.apiMembers.moveSequence(
        move,
        controller.Board,
      )!

      let turnHasEnded = controller.Variant.apiMembers.playerTurnEnds(
        [state, clickedCoord],
        controller.Board,
        newBoard,
      )
      let nextPlayer = !turnHasEnded
        ? controller.CurrentPlayer
        : controller.CurrentPlayer === Player.White
        ? Player.Black
        : Player.White

      let history = updateGameHistory(
        controller,
        move,
        createFen(controller.Variant.pdnMembers, nextPlayer, newBoard),
        controller.Board,
      )
      let newController = {
        ...controller,
        Board: newBoard,
        CurrentPlayer: nextPlayer,
        CurrentCoord: turnHasEnded ? undefined : clickedCoord,
        MoveHistory: history,
      }

      updateController(newController)
      setState(newController.CurrentCoord)
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
      board={value.Board}
      selectedCoord={state}
      onclick={memo(value, state, setState, onChange)}
    />
  )
}

export default GameBoard
