import Board from './Board'
import { BoardProvider } from './BoardContext'

function App() {
  return (
    <BoardProvider>
      <div className="App">
        <Board />
      </div>
    </BoardProvider>
  )
}

export default App
