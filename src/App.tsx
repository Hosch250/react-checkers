import Board from './Board'
import GameControllerProvider from './GameControllerContext'
import MoveHistory from './MoveHistory'
import './App.css'
import DisplayWin from './DisplayWin'

function App() {
  return (
    <GameControllerProvider>
      <div className="App">
        <DisplayWin />
        <Board />
        <MoveHistory />
      </div>
    </GameControllerProvider>
  )
}

export default App
