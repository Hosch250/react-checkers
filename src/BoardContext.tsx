import React, { Dispatch, SetStateAction } from 'react'
import { Board, defaultBoard } from './models/types'

const BoardContext = React.createContext<
  [Board, Dispatch<SetStateAction<Board>>]
>(null!)

const useBoard = () => {
  const [board, setBoard] = React.useContext(BoardContext)

  const handleBoard = (value: Board) => {
    setBoard(value)
  }

  return { value: board, onChange: handleBoard }
}

function BoardProvider({ children }: { children: any }) {
  const [board, setBoard] = React.useState(defaultBoard)

  return (
    <BoardContext.Provider value={[board, setBoard]}>
      {children}
    </BoardContext.Provider>
  )
}

export { BoardProvider, useBoard }
