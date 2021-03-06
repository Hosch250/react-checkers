import { cloneDeep } from 'lodash'
import React, { Dispatch, SetStateAction } from 'react'
import { GameController, newAmericanCheckersGame } from './models/game-controller'

const GameControllerContext = React.createContext<
  [GameController, Dispatch<SetStateAction<GameController>>]
>(null!)

const useGameController = () => {
  const [gameController, setGameController] = React.useContext(GameControllerContext)

  const handleGameController = (value: GameController) => {
    setGameController(value)
  }

  return { value: gameController, onChange: handleGameController }
}

function GameControllerProvider({ children }: { children: any }) {
  const [gameController, setGameController] = React.useState(cloneDeep(newAmericanCheckersGame))

  return (
    <GameControllerContext.Provider value={[gameController, setGameController]}>
      {children}
    </GameControllerContext.Provider>
  )
}

export { useGameController }
export default GameControllerProvider
