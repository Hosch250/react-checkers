import { last } from 'lodash'
import { useGameController } from './GameControllerContext'
import './MoveHistory.css'

function MoveHistory() {
  const { value } = useGameController()

  return (
    <div className="MoveHistory">
      <fieldset>
        <legend className="visually-hidden">Move History</legend>
        {value.MoveHistory.map((m) => (
          <div key={m.MoveNumber}>
            <div style={{ display: 'inline-block', width: '2rem' }}>
              {m.MoveNumber}.
            </div>
            {m.BlackMove?.DisplayString ? (
              <label style={{ display: 'inline-block', width: '5rem' }}>
                <input
                  value={m.BlackMove.DisplayString}
                  type="radio"
                  role="button"
                  name="move"
                />
                <span>{m.BlackMove.Move.length > 3 ? `${m.BlackMove.Move[0]}…${last(m.BlackMove.Move)}` : m.BlackMove.DisplayString}</span>
              </label>
            ) : null}
            {m.WhiteMove?.DisplayString ? (
              <label style={{ display: 'inline-block', width: '5rem' }}>
                <input
                  value={m.WhiteMove.DisplayString}
                  type="radio"
                  role="button"
                  name="move"
                />
                <span>{m.WhiteMove.Move.length > 3 ? `${m.WhiteMove.Move[0]}…${last(m.WhiteMove.Move)}` : m.WhiteMove.DisplayString}</span>
              </label>
            ) : null}
          </div>
        ))}
      </fieldset>
    </div>
  )
}

export default MoveHistory
