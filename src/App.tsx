import Board from './Board'
import { GameControllerProvider } from './GameControllerContext'

function App() {
  return (
    <GameControllerProvider>
      <div className="App">
        <Board />
      </div>
    </GameControllerProvider>
  )
}

export default App
