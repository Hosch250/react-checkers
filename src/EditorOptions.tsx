import { cloneDeep } from 'lodash'
import React from 'react'
import { useBoardEditor } from './BoardEditorContext'
import {
  GameController,
  newAmericanCheckersGame,
  newPoolCheckersGame,
  newTurkishDraughtsGame,
} from './models/game-controller'
import { emptyBoardList, Color, Variant } from './models/types'

function EditorOptions() {
  const { value, onChange } = useBoardEditor()

  function setBoard(state: string, variant: Variant) {
    if (state === 'initial') {
      let newGame: GameController
      switch (variant) {
        case Variant.AmericanCheckers:
          newGame = cloneDeep(newAmericanCheckersGame)
          break
        case Variant.PoolCheckers:
          newGame = cloneDeep(newPoolCheckersGame)
          break
        case Variant.TurkishDraughts:
          newGame = cloneDeep(newTurkishDraughtsGame)
          break
      }

      onChange({ board: newGame!.board, variant: variant, player: newGame!.currentPlayer, pdnMembers: newGame!.variant.pdnMembers })
    }

    if (state === 'empty') {
      onChange({ ...value, board: emptyBoardList() })
    }
  }

  let [position, setPosition] = React.useState('initial')

  return (
    <>
      <div className="form-floating mb-2">
        <select
          className="form-select"
          id="variant"
          onChange={(_) => {
            onChange({ ...value, variant: parseInt(_.target.value) })
            setBoard(position, parseInt(_.target.value))
          }}
        >
          <option value={Variant.AmericanCheckers}>American Checkers</option>
          <option value={Variant.PoolCheckers}>Pool Checkers</option>
          <option value={Variant.TurkishDraughts}>Turkish Draughts</option>
        </select>
        <label htmlFor="variant">Variant</label>
      </div>
      <div className="form-floating mb-2">
        <select
          className="form-select"
          id="turn"
          onChange={(_) =>
            onChange({ ...value, player: parseInt(_.target.value) as Color })
          }
          value={value.player}
        >
          <option value={Color.Black}>Black</option>
          <option value={Color.White}>White</option>
        </select>
        <label htmlFor="turn">First Move</label>
      </div>
      <div className="form-floating">
        <select
          className="form-select"
          id="position"
          value={position}
          onChange={(_) => {
            setPosition(_.target.value)
            setBoard(_.target.value, value.variant)
          }}
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
