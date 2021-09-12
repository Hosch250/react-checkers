import { Coord, Board, Color, Move, Variant, PdnTurn, Piece } from './types'
import * as AmericanCheckersVariant from '../variants/american-checkers'
import * as PoolCheckersVariant from '../variants/pool-checkers'
import * as TurkishDraughtsVariant from '../variants/turkish-draughts'
import { curry } from 'lodash'

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
const PdnMembersTurkishDraughts: PdnMembers = {
  pdnBoard: TurkishDraughtsVariant.pdnBoard,
  pdnBoardCoords: TurkishDraughtsVariant.pdnBoardCoords,
}

export type ApiMembers = {
  defaultBoard: (Piece | undefined)[][]
  defaultFen: string
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
  defaultBoard: AmericanCheckersVariant.defaultBoard,
  defaultFen: AmericanCheckersVariant.defaultFen,
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
  defaultBoard: AmericanCheckersVariant.defaultBoard,
  defaultFen: AmericanCheckersVariant.defaultFen,
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
  defaultBoard: PoolCheckersVariant.defaultBoard,
  defaultFen: PoolCheckersVariant.defaultFen,
  isValidMove: PoolCheckersVariant.isValidMove,
  movePiece: PoolCheckersVariant.movePiece,
  moveSequence: PoolCheckersVariant.moveSequence,
  isJump: PoolCheckersVariant.isJump,
  startingPlayer: PoolCheckersVariant.StartingPlayer,
  winningPlayer: PoolCheckersVariant.winningPlayer,
  isDrawn: PoolCheckersVariant.isDrawn,
  playerTurnEnds: PoolCheckersVariant.playerTurnEnds,
}
const ApiMembersTurkishDraughts: ApiMembers = {
  defaultBoard: TurkishDraughtsVariant.defaultBoard,
  defaultFen: TurkishDraughtsVariant.defaultFen,
  isValidMove: TurkishDraughtsVariant.isValidMove,
  movePiece: TurkishDraughtsVariant.movePiece,
  moveSequence: TurkishDraughtsVariant.moveSequence,
  isJump: TurkishDraughtsVariant.isJump,
  startingPlayer: TurkishDraughtsVariant.StartingPlayer,
  winningPlayer: TurkishDraughtsVariant.winningPlayer,
  isDrawn: TurkishDraughtsVariant.isDrawn,
  playerTurnEnds: TurkishDraughtsVariant.playerTurnEnds,
}

export type GameVariant = {
  variant: Variant
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
export const GameVariantTurkishDraughts: GameVariant = {
  variant: Variant.TurkishDraughts,
  pdnMembers: PdnMembersTurkishDraughts,
  apiMembers: ApiMembersTurkishDraughts
}