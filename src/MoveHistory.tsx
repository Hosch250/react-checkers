import { useGameController } from "./GameControllerContext"

function MoveHistory() {
  const { value } = useGameController()

  let jsx = value.MoveHistory.map(m => <li>{m.MoveNumber}: {m.BlackMove?.DisplayString} {m.WhiteMove?.DisplayString}</li>)
  return <div className="MoveHistory">
      <ol style={{listStyle: "none"}}>{jsx}</ol>
  </div>
}

export default MoveHistory
