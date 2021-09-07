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
  Color,
  Player,
  PlayerType,
} from './types'

export type GameController = {
  variant: GameVariant
  board: Board
  currentPlayer: Color
  initialPosition: string
  moveHistory: PdnTurn[]
  currentCoord: Coord | undefined
  blackInfo: Player,
  whiteInfo: Player
}

export const newAmericanCheckersGame: GameController = {
  variant: GameVariantAmericanCheckers,
  board: defaultBoard,
  currentPlayer: Color.Black,
  initialPosition: defaultFen,
  moveHistory: [],
  currentCoord: undefined,
  blackInfo: {color: Color.Black, player: PlayerType.Human},
  whiteInfo: {color: Color.White, player: PlayerType.Human}
}
export const newAmericanCheckersOptionalJumpGame: GameController = {
  variant: GameVariantAmericanCheckersOptionalJump,
  board: defaultBoard,
  currentPlayer: Color.Black,
  initialPosition: defaultFen,
  moveHistory: [],
  currentCoord: undefined,
  blackInfo: {color: Color.Black, player: PlayerType.Human},
  whiteInfo: {color: Color.White, player: PlayerType.Human}
}
export const newPoolCheckersGame: GameController = {
  variant: GameVariantPoolCheckers,
  board: defaultBoard,
  currentPlayer: Color.Black,
  initialPosition: defaultFen,
  moveHistory: [],
  currentCoord: undefined,
  blackInfo: {color: Color.Black, player: PlayerType.Human},
  whiteInfo: {color: Color.White, player: PlayerType.Human}
}
