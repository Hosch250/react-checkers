import {
  GameVariant,
  GameVariantAmericanCheckers,
  GameVariantAmericanCheckersOptionalJump,
  GameVariantPoolCheckers,
} from './game-variant'
import {
  Board,
  Coord,
  defaultBoard,
  defaultFen,
  PdnTurn,
  Player,
} from './types'

export type GameController = {
  variant: GameVariant
  board: Board
  currentPlayer: Player
  initialPosition: string
  moveHistory: PdnTurn[]
  currentCoord: Coord | undefined
}

export const newAmericanCheckersGame: GameController = {
  variant: GameVariantAmericanCheckers,
  board: defaultBoard,
  currentPlayer: Player.Black,
  initialPosition: defaultFen,
  moveHistory: [],
  currentCoord: undefined,
}
export const newAmericanCheckersOptionalJumpGame: GameController = {
  variant: GameVariantAmericanCheckersOptionalJump,
  board: defaultBoard,
  currentPlayer: Player.Black,
  initialPosition: defaultFen,
  moveHistory: [],
  currentCoord: undefined,
}
export const newPoolCheckersGame: GameController = {
  variant: GameVariantPoolCheckers,
  board: defaultBoard,
  currentPlayer: Player.Black,
  initialPosition: defaultFen,
  moveHistory: [],
  currentCoord: undefined,
}
