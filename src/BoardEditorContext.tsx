import { cloneDeep } from 'lodash'
import React, { Dispatch, SetStateAction } from 'react'
import { newAmericanCheckersGame } from './models/game-controller'
import { PdnMembers } from './models/game-variant'
import { Board, Color, Variant } from './models/types'

export type BoardEditorInfo = {
  board: Board,
  variant: Variant,
  player: Color,
  pdnMembers: PdnMembers
}

const BoardEditorContext = React.createContext<
  [BoardEditorInfo, Dispatch<SetStateAction<BoardEditorInfo>>]
>(null!)

const useBoardEditor = () => {
  const [boardEditor, setBoardEditor] = React.useContext(BoardEditorContext)

  const handleBoardEditor = (value: BoardEditorInfo) => {
    setBoardEditor(value)
  }

  return { value: boardEditor, onChange: handleBoardEditor }
}

function BoardEditorProvider({ children }: { children: any }) {
  let data = cloneDeep(newAmericanCheckersGame)
  const [boardEditor, setBoardEditor] = React.useState({
    board: data.board,
    variant: data.variant.variant,
    player: data.currentPlayer,
    pdnMembers: data.variant.pdnMembers
  })

  return (
    <BoardEditorContext.Provider value={[boardEditor, setBoardEditor]}>
      {children}
    </BoardEditorContext.Provider>
  )
}

export { useBoardEditor }
export default BoardEditorProvider
