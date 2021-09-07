import { Coord, Board, Color, Move, Variant, PdnTurn } from './types'
import * as AmericanCheckersVariant from '../variants/american-checkers'
import * as PoolCheckersVariant from '../variants/pool-checkers'
import { curry } from 'lodash'

// export type AiMembers = {
//   uncheckedMoveSequence: (coord: Coord[], board: Board) => Board
//   calculateMoves: (player: Player, board: Board) => Move[]
//   winningPlayer: (
//     board: Board,
//     player: Player | undefined,
//   ) => Player | undefined
//   calculateWeightDifference: (board: Board) => number
// }
// with
// static member AmericanCheckers =
//     {
//         uncheckedMoveSequence = Variants.AmericanCheckers.uncheckedMoveSequence
//         calculateMoves = AIs.AmericanCheckersAI.calculateMoves true
//         winningPlayer = Variants.AmericanCheckers.winningPlayer
//         calculateWeightDifference = AIs.AmericanCheckersAI.calculateWeightDifference
//     }
// static member AmericanCheckersOptionalJump =
//     {
//         uncheckedMoveSequence = Variants.AmericanCheckers.uncheckedMoveSequence
//         calculateMoves = AIs.AmericanCheckersAI.calculateMoves false
//         winningPlayer = Variants.AmericanCheckers.winningPlayer
//         calculateWeightDifference = AIs.AmericanCheckersAI.calculateWeightDifference
//     }
// static member PoolCheckers =
//     {
//         uncheckedMoveSequence = Variants.PoolCheckers.uncheckedMoveSequence
//         calculateMoves = AIs.PoolCheckersAI.calculateMoves
//         winningPlayer = Variants.PoolCheckers.winningPlayer
//         calculateWeightDifference = AIs.PoolCheckersAI.calculateWeightDifference
//     }

export type PdnMembers = {
  pdnBoard: (number | undefined)[][]
  pdnBoardCoords: Coord[]
}
const PdnMembersAmericanCheckers: PdnMembers = {
  pdnBoard: AmericanCheckersVariant.pdnBoard,
  pdnBoardCoords: AmericanCheckersVariant.pdnBoardCoords,
}
const PdnMembersPoolCheckers: PdnMembers = {
  pdnBoard: PoolCheckersVariant.pdnBoard,
  pdnBoardCoords: PoolCheckersVariant.pdnBoardCoords,
}

export type ApiMembers = {
  isValidMove: (startCoord: Coord, endCoord: Coord, board: Board) => boolean
  movePiece: (
    startCoord: Coord,
    endCoord: Coord,
    board: Board,
  ) => Board | undefined
  moveSequence: (moves: Coord[], board: Board | undefined) => Board | undefined
  isJump: (move: Move, board: Board) => boolean
  startingPlayer: Color
  winningPlayer: (
    board: Board,
    player: Color | undefined,
  ) => Color | undefined
  isDrawn: (fen: string, pdnTurn: PdnTurn[]) => boolean
  playerTurnEnds: (
    move: Move,
    startingBoard: Board,
    finalBoard: Board,
  ) => boolean
}
const ApiMembersAmericanCheckers: ApiMembers = {
  isValidMove: curry(AmericanCheckersVariant.isValidMove)(true),
  movePiece: curry(AmericanCheckersVariant.movePiece)(true),
  moveSequence: curry(AmericanCheckersVariant.moveSequence)(true),
  isJump: AmericanCheckersVariant.isJump,
  startingPlayer: AmericanCheckersVariant.StartingPlayer,
  winningPlayer: AmericanCheckersVariant.winningPlayer,
  isDrawn: AmericanCheckersVariant.isDrawn,
  playerTurnEnds: AmericanCheckersVariant.playerTurnEnds,
}
const ApiMembersAmericanCheckersOptionalJump: ApiMembers = {
  isValidMove: curry(AmericanCheckersVariant.isValidMove)(false),
  movePiece: curry(AmericanCheckersVariant.movePiece)(false),
  moveSequence: curry(AmericanCheckersVariant.moveSequence)(false),
  isJump: AmericanCheckersVariant.isJump,
  startingPlayer: AmericanCheckersVariant.StartingPlayer,
  winningPlayer: AmericanCheckersVariant.winningPlayer,
  isDrawn: AmericanCheckersVariant.isDrawn,
  playerTurnEnds: AmericanCheckersVariant.playerTurnEnds,
}
const ApiMembersPoolCheckers: ApiMembers = {
  isValidMove: PoolCheckersVariant.isValidMove,
  movePiece: PoolCheckersVariant.movePiece,
  moveSequence: PoolCheckersVariant.moveSequence,
  isJump: PoolCheckersVariant.isJump,
  startingPlayer: PoolCheckersVariant.StartingPlayer,
  winningPlayer: PoolCheckersVariant.winningPlayer,
  isDrawn: PoolCheckersVariant.isDrawn,
  playerTurnEnds: PoolCheckersVariant.playerTurnEnds,
}

// static member AmericanCheckersOptionalJump =
//     {
//         isValidMove = Variants.AmericanCheckers.isValidMove false
//         movePiece = Variants.AmericanCheckers.movePiece false
//         moveSequence = Variants.AmericanCheckers.moveSequence false
//         isJump = Variants.AmericanCheckers.isJump
//         startingPlayer = Variants.AmericanCheckers.StartingPlayer
//         winningPlayer = Variants.AmericanCheckers.winningPlayer
//         isDrawn = Variants.AmericanCheckers.isDrawn
//         playerTurnEnds = Variants.AmericanCheckers.playerTurnEnds
//     }

export type GameVariant = {
  variant: Variant
  //aiMembers: AiMembers
  pdnMembers: PdnMembers
  apiMembers: ApiMembers
}
export const GameVariantAmericanCheckers: GameVariant = {
  variant: Variant.AmericanCheckers,
  pdnMembers: PdnMembersAmericanCheckers,
  apiMembers: ApiMembersAmericanCheckers
}
export const GameVariantAmericanCheckersOptionalJump: GameVariant = {
  variant: Variant.AmericanCheckersOptionalJump,
  pdnMembers: PdnMembersAmericanCheckers,
  apiMembers: ApiMembersAmericanCheckersOptionalJump
}
export const GameVariantPoolCheckers: GameVariant = {
  variant: Variant.PoolCheckers,
  pdnMembers: PdnMembersPoolCheckers,
  apiMembers: ApiMembersPoolCheckers
}