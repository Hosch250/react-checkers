import { last } from 'lodash'
import React from 'react'
import './Board.css'
import { useGameController } from './GameControllerContext'
import { GameController } from './models/game-controller'
import { ApiMembers } from './models/game-variant'
import { createFen } from './models/pdn'
import {
  Color,
  Coord,
  Move,
  Piece,
  Player,
  square,
  Board as BoardType,
} from './models/types'
import Square from './Square'
import { isValidMove, moveSequence } from './variants/american-checkers'

function getDisplayString(
  variant: ApiMembers,
  pdnTurn: number[],
  move: Move,
  board: BoardType,
) {
  return pdnTurn.join(variant.isJump(move, board) ? 'x' : '-')
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
      newTurnValue
    )
    return [
      ...gameController.MoveHistory
    ]
  }
}

function getSquareColor(row: number, col: number) {
  if ((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
    return Color.White
  }

  return Color.Black
}

function getOnSquareClicked(
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

    if (!state) {
      setState(clickedCoord)
      return
    }

    if (state.Row === row && state.Column === column) {
      setState(undefined)
      return
    }

    if (controller.CurrentPlayer !== square(state, controller.Board)?.Player) {
      setState(undefined)
      return
    }

    if (isValidMove(state, clickedCoord, controller.Board)) {
      let move = [state, clickedCoord]
      let newBoard = moveSequence(move, controller.Board)!

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

function getSquare(
  row: number,
  col: number,
  isSelected: boolean,
  piece: Piece | undefined,
  onclick: any,
) {
  return (
    <Square
      key={`col_${row}${col}`}
      color={getSquareColor(row, col)}
      piece={piece}
      coord={{Row:row, Column: col}}
      isSelected={isSelected}
      onclick={onclick}
    />
  )
}

function Board() {
  const [state, setState] = React.useState<Coord | undefined>(undefined)
  const { value, onChange } = useGameController()

  let memo = React.useCallback(getOnSquareClicked, [])

  let jsx = value.Board.map((row, rowIndex) => {
    return (
      <div className="board-row" key={`row_${rowIndex}`}>
        {row.map((piece, col) => {
          return getSquare(
            rowIndex,
            col,
            state?.Row === rowIndex && state.Column === col,
            piece,
            memo(value, state, setState, onChange),
          )
        })}
      </div>
    )
  })

  return <div className="Board">{jsx}</div>
}

export default Board
