import { cloneDeep } from 'lodash'
import React, { Dispatch, SetStateAction } from 'react'
import { newAmericanCheckersGame } from './models/game-controller'
import { Board, Player, Variant } from './models/types'

export type BoardEditorInfo = {
  board: Board,
  fen: string
  variant: Variant,
  player: Player
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
    board: data.Board,
    fen: data.InitialPosition,
    variant: data.Variant.variant,
    player: data.CurrentPlayer
  })

  return (
    <BoardEditorContext.Provider value={[boardEditor, setBoardEditor]}>
      {children}
    </BoardEditorContext.Provider>
  )
}

export { useBoardEditor }
export default BoardEditorProvider
