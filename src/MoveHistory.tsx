import { last } from 'lodash'
import { useGameController } from './GameControllerContext'
import { Popover } from 'react-bootstrap'
import './MoveHistory.css'

function MoveHistory() {
  const { value } = useGameController()

  return (
    <div className="MoveHistory">
      <fieldset>
        <legend className="visually-hidden">Move History</legend>
        {value.MoveHistory.map((m) => (
          <div className="row" key={m.MoveNumber}>
            <div className="col-2 text-start">
              {m.MoveNumber}.
            </div>
            {m.BlackMove?.DisplayString ? (
              <label className="col-5 text-start" title={m.BlackMove.DisplayString}>
                <input
                  className="d-none"
                  value={m.BlackMove.DisplayString}
                  type="radio"
                  role="button"
                  name="move"
                />
                <span className="d-inline-block px-1">{m.BlackMove.Move.length > 3 ? `${m.BlackMove.Move[0]}…${last(m.BlackMove.Move)}` : m.BlackMove.DisplayString}</span>
              </label>
            ) : null}
            {m.WhiteMove?.DisplayString ? (
              <label className="col-5 text-start" title={m.WhiteMove.DisplayString}>
                <input
                  className="d-none"
                  value={m.WhiteMove.DisplayString}
                  type="radio"
                  role="button"
                  name="move"
                />
                <span className="d-inline-block px-1">{m.WhiteMove.Move.length > 3 ? `${m.WhiteMove.Move[0]}…${last(m.WhiteMove.Move)}` : m.WhiteMove.DisplayString}</span>
              </label>
            ) : null}
          </div>
        ))}
      </fieldset>
    </div>
  )
}

export default MoveHistory
