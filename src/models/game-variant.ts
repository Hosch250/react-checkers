import { Coord, Board, Player, Move, Variant, PdnTurn } from './types'
import * as AmericanCheckersVariant from '../variants/american-checkers'
import * as PoolCheckersVariant from '../variants/pool-checkers'

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

// with
// static member AmericanCheckers =
//     {
//         pdnBoard = Variants.AmericanCheckers.pdnBoard
//         pdnBoardCoords = Variants.AmericanCheckers.pdnBoardCoords
//     }
// static member AmericanCheckersOptionalJump =
//     {
//         pdnBoard = Variants.AmericanCheckers.pdnBoard
//         pdnBoardCoords = Variants.AmericanCheckers.pdnBoardCoords
//     }
// static member PoolCheckers =
//     {
//         pdnBoard = Variants.PoolCheckers.pdnBoard
//         pdnBoardCoords = Variants.PoolCheckers.pdnBoardCoords
//     }

export type ApiMembers = {
  isValidMove: (startCoord: Coord, endCoord: Coord, board: Board) => boolean
  movePiece: (
    startCoord: Coord,
    endCoord: Coord,
    board: Board,
  ) => Board | undefined
  moveSequence: (moves: Coord[], board: Board | undefined) => Board | undefined
  isJump: (move: Move, board: Board) => boolean
  startingPlayer: Player
  winningPlayer: (
    board: Board,
    player: Player | undefined,
  ) => Player | undefined
  isDrawn: (fen: string, pdnTurn: PdnTurn[]) => boolean
  playerTurnEnds: (
    move: Move,
    startingBoard: Board,
    finalBoard: Board,
  ) => boolean
}
export const ApiMembersAmericanCheckers: ApiMembers = {
  isValidMove: AmericanCheckersVariant.isValidMove,
  movePiece: AmericanCheckersVariant.movePiece,
  moveSequence: AmericanCheckersVariant.moveSequence,
  isJump: AmericanCheckersVariant.isJump,
  startingPlayer: AmericanCheckersVariant.StartingPlayer,
  winningPlayer: AmericanCheckersVariant.winningPlayer,
  isDrawn: AmericanCheckersVariant.isDrawn,
  playerTurnEnds: AmericanCheckersVariant.playerTurnEnds,
}
export const ApiMembersPoolCheckers: ApiMembers = {
  isValidMove: PoolCheckersVariant.isValidMove,
  movePiece: PoolCheckersVariant.movePiece,
  moveSequence: PoolCheckersVariant.moveSequence,
  isJump: PoolCheckersVariant.isJump,
  startingPlayer: PoolCheckersVariant.StartingPlayer,
  winningPlayer: PoolCheckersVariant.winningPlayer,
  isDrawn: PoolCheckersVariant.isDrawn,
  playerTurnEnds: PoolCheckersVariant.playerTurnEnds,
}

// with
// static member AmericanCheckers =
//     {
//         isValidMove = Variants.AmericanCheckers.isValidMove true
//         movePiece = Variants.AmericanCheckers.movePiece true
//         moveSequence = Variants.AmericanCheckers.moveSequence true
//         isJump = Variants.AmericanCheckers.isJump
//         startingPlayer = Variants.AmericanCheckers.StartingPlayer
//         winningPlayer = Variants.AmericanCheckers.winningPlayer
//         isDrawn = Variants.AmericanCheckers.isDrawn
//         playerTurnEnds = Variants.AmericanCheckers.playerTurnEnds
//     }
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
// static member PoolCheckers =
//     {
//         isValidMove = Variants.PoolCheckers.isValidMove
//         movePiece = Variants.PoolCheckers.movePiece
//         moveSequence = Variants.PoolCheckers.moveSequence
//         isJump = Variants.PoolCheckers.isJump
//         startingPlayer = Variants.PoolCheckers.StartingPlayer
//         winningPlayer = Variants.PoolCheckers.winningPlayer
//         isDrawn = Variants.PoolCheckers.isDrawn
//         playerTurnEnds = Variants.PoolCheckers.playerTurnEnds
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
export const GameVariantPoolCheckers: GameVariant = {
  variant: Variant.PoolCheckers,
  pdnMembers: PdnMembersPoolCheckers,
  apiMembers: ApiMembersPoolCheckers
}
// with
// static member AmericanCheckers =
//     {
//         variant = AmericanCheckers
//         aiMembers = AiMembers.AmericanCheckers
//         pdnMembers = PdnMembers.AmericanCheckers
//         apiMembers = ApiMembers.AmericanCheckers
//     }
// static member AmericanCheckersOptionalJump =
//     {
//         variant = AmericanCheckersOptionalJump
//         aiMembers = AiMembers.AmericanCheckersOptionalJump
//         pdnMembers = PdnMembers.AmericanCheckersOptionalJump
//         apiMembers = ApiMembers.AmericanCheckersOptionalJump
//     }
// static member PoolCheckers =
//     {
//         variant = PoolCheckers
//         aiMembers = AiMembers.PoolCheckers
//         pdnMembers = PdnMembers.PoolCheckers
//         apiMembers = ApiMembers.PoolCheckers
//     }
