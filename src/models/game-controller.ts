import { GameVariant, GameVariantAmericanCheckers } from './game-variant'
import { Board, Coord, defaultBoard, defaultFen, PdnTurn, Player } from './types'

export type GameController = {
  Variant: GameVariant
  Board: Board
  CurrentPlayer: Player
  InitialPosition: string
  MoveHistory: PdnTurn[]
  CurrentCoord: Coord | undefined
}

export const newAmericanCheckersGame: GameController =
  { Variant: GameVariantAmericanCheckers, Board: defaultBoard, CurrentPlayer: Player.Black, InitialPosition: defaultFen, MoveHistory: [], CurrentCoord: undefined }
// with
//     static member newAmericanCheckersGame =
//         { Variant = GameVariant.AmericanCheckers; Board = Checkers.Board.defaultBoard; CurrentPlayer = Black; InitialPosition = Checkers.Board.defaultFen; MoveHistory = []; CurrentCoord = None }
//     static member newAmericanCheckersOptionalJumpGame =
//         { Variant = GameVariant.AmericanCheckersOptionalJump; Board = Checkers.Board.defaultBoard; CurrentPlayer = Black; InitialPosition = Checkers.Board.defaultFen; MoveHistory = []; CurrentCoord = None }
//     static member newPoolCheckersGame =
//         { Variant = GameVariant.PoolCheckers; Board = Checkers.Board.defaultBoard; CurrentPlayer = Black; InitialPosition = Checkers.Board.defaultFen; MoveHistory = []; CurrentCoord = None }
