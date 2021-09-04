import { cloneDeep } from 'lodash'
import { useBoardEditor } from './BoardEditorContext'
import {
  GameController,
  newAmericanCheckersGame,
  newPoolCheckersGame,
} from './models/game-controller'
import { emptyBoardList, Player, Variant } from './models/types'

function EditorOptions() {
  const { value, onChange } = useBoardEditor()

  function setBoard(state: string) {
    if (state === 'initial') {
      let newGame: GameController
      switch (value.variant) {
        case Variant.AmericanCheckers:
          newGame = cloneDeep(newAmericanCheckersGame)
          break
        case Variant.PoolCheckers:
          newGame = cloneDeep(newPoolCheckersGame)
          break
      }

      onChange({ ...value, board: newGame!.Board })
    }

    if (state === 'empty') {
      onChange({ ...value, board: emptyBoardList() })
    }
  }

  return (
    <>
      <div className="form-floating mb-2">
        <select
          className="form-select"
          id="variant"
          onChange={(_) =>
            onChange({ ...value, variant: parseInt(_.target.value) })
          }
        >
          <option value={Variant.AmericanCheckers}>American Checkers</option>
          <option value={Variant.PoolCheckers}>Pool Checkers</option>
        </select>
        <label htmlFor="variant">Variant</label>
      </div>
      <div className="form-floating mb-2">
        <select
          className="form-select"
          id="turn"
          onChange={(_) =>
            onChange({ ...value, player: parseInt(_.target.value) })
          }
        >
          <option value={Player.Black}>Black</option>
          <option value={Player.White}>White</option>
        </select>
        <label htmlFor="turn">First Move</label>
      </div>
      <div className="form-floating">
        <select
          className="form-select"
          id="position"
          defaultValue="initial"
          onChange={(_) => setBoard(_.target.value)}
        >
          <option value="initial">Initial</option>
          <option value="empty">Empty</option>
        </select>
        <label htmlFor="position">Set Position</label>
      </div>
    </>
  )
}

export default EditorOptions
