import {
  GameVariant,
  GameVariantAmericanCheckers,
  GameVariantAmericanCheckersOptionalJump,
  GameVariantPoolCheckers,
  GameVariantTurkishDraughts,
} from './game-variant'
import {
  Board,
  Coord,
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
  board: GameVariantAmericanCheckers.apiMembers.defaultBoard,
  currentPlayer: Color.Black,
  initialPosition: GameVariantAmericanCheckers.apiMembers.defaultFen,
  moveHistory: [],
  currentCoord: undefined,
  blackInfo: {color: Color.Black, player: PlayerType.Human},
  whiteInfo: {color: Color.White, player: PlayerType.Human}
}
export const newAmericanCheckersOptionalJumpGame: GameController = {
  variant: GameVariantAmericanCheckersOptionalJump,
  board: GameVariantAmericanCheckersOptionalJump.apiMembers.defaultBoard,
  currentPlayer: Color.Black,
  initialPosition: GameVariantAmericanCheckersOptionalJump.apiMembers.defaultFen,
  moveHistory: [],
  currentCoord: undefined,
  blackInfo: {color: Color.Black, player: PlayerType.Human},
  whiteInfo: {color: Color.White, player: PlayerType.Human}
}
export const newPoolCheckersGame: GameController = {
  variant: GameVariantPoolCheckers,
  board: GameVariantPoolCheckers.apiMembers.defaultBoard,
  currentPlayer: Color.Black,
  initialPosition: GameVariantPoolCheckers.apiMembers.defaultFen,
  moveHistory: [],
  currentCoord: undefined,
  blackInfo: {color: Color.Black, player: PlayerType.Human},
  whiteInfo: {color: Color.White, player: PlayerType.Human}
}
export const newTurkishDraughtsGame: GameController = {
  variant: GameVariantTurkishDraughts,
  board: GameVariantTurkishDraughts.apiMembers.defaultBoard,
  currentPlayer: Color.White,
  initialPosition: GameVariantTurkishDraughts.apiMembers.defaultFen,
  moveHistory: [],
  currentCoord: undefined,
  blackInfo: {color: Color.Black, player: PlayerType.Human},
  whiteInfo: {color: Color.White, player: PlayerType.Human}
}
