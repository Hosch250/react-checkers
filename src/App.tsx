import Board from './Board'
import GameControllerProvider from './GameControllerContext'
import MoveHistory from './MoveHistory'

function App() {
  return (
    <GameControllerProvider>
      <div className="App">
        <Board />
        <MoveHistory />
      </div>
    </GameControllerProvider>
  )
}

export default App
