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
  Variant: GameVariant
  Board: Board
  CurrentPlayer: Player
  InitialPosition: string
  MoveHistory: PdnTurn[]
  CurrentCoord: Coord | undefined
}

export const newAmericanCheckersGame: GameController = {
  Variant: GameVariantAmericanCheckers,
  Board: defaultBoard,
  CurrentPlayer: Player.Black,
  InitialPosition: defaultFen,
  MoveHistory: [],
  CurrentCoord: undefined,
}
export const newAmericanCheckersOptionalJumpGame: GameController = {
  Variant: GameVariantAmericanCheckersOptionalJump,
  Board: defaultBoard,
  CurrentPlayer: Player.Black,
  InitialPosition: defaultFen,
  MoveHistory: [],
  CurrentCoord: undefined,
}
export const newPoolCheckersGame: GameController = {
  Variant: GameVariantPoolCheckers,
  Board: defaultBoard,
  CurrentPlayer: Player.Black,
  InitialPosition: defaultFen,
  MoveHistory: [],
  CurrentCoord: undefined,
}
