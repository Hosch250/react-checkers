import { cloneDeep } from 'lodash'
import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { useGameController } from './GameControllerContext'
import {
  GameController,
  newAmericanCheckersGame,
  newAmericanCheckersOptionalJumpGame,
  newPoolCheckersGame,
} from './models/game-controller'
import { controllerFromFen } from './models/pdn'
import { Variant, Color, PlayerType, Player } from './models/types'
import './NewGameModal.css'

function NewGameModal({
  showState,
}: {
  showState: [boolean, (value: boolean) => void]
}) {
  let [show, setShow] = showState
  const { onChange } = useGameController()

  const [form, setForm] = useState({
    variant: Variant.AmericanCheckers,
    position: 'default',
    fen: '',
    blackPlayer: { color: Color.Black, player: PlayerType.Human, aiLevel: undefined } as Player,
    whitePlayer: { color: Color.White, player: PlayerType.Human, aiLevel: undefined } as Player,
  })

  function createNewGame(ev: React.FormEvent) {
    ev.preventDefault()

    let controller: GameController
    switch (form.variant) {
      case Variant.AmericanCheckers:
        controller = cloneDeep(newAmericanCheckersGame)
        break
      case Variant.AmericanCheckersOptionalJump:
        controller = cloneDeep(newAmericanCheckersOptionalJumpGame)
        break
      case Variant.PoolCheckers:
        controller = cloneDeep(newPoolCheckersGame)
        break
    }

    if (form.position === 'fen') {
      controller = controllerFromFen(controller.variant, form.fen)
    }

    controller.blackInfo = form.blackPlayer
    controller.whiteInfo = form.whitePlayer

    onChange(controller)
    setShow(false)
    resetForm()
  }

  function resetForm() {
    setForm({
      variant: Variant.AmericanCheckers,
      position: 'default',
      fen: '',
      blackPlayer: {color: Color.Black, player: PlayerType.Human},
      whitePlayer: {color: Color.White, player: PlayerType.Human}
    })
  }

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>New Game</Modal.Title>
      </Modal.Header>
      <Form onSubmit={createNewGame}>
        <Modal.Body>
          <div className="form-floating mb-2">
            <select
              id="variant"
              onChange={(ev) =>
                setForm({ ...form, variant: parseInt(ev.target.value) })
              }
              className="form-select"
            >
              <option value={Variant.AmericanCheckers}>
                American Checkers
              </option>
              <option value={Variant.AmericanCheckersOptionalJump}>
                American Checkers w/ Optional Jump
              </option>
              <option value={Variant.PoolCheckers}>Pool Checkers</option>
            </select>
            <label htmlFor="variant">Variant</label>
          </div>
          <fieldset className="border-start ps-3 mt-3">
            <legend>Black Player</legend>
            <label className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="blackPlayerType"
                value={PlayerType.Human}
                defaultChecked
                onChange={(_) =>
                  setForm({ ...form, blackPlayer: {...form.blackPlayer, player: PlayerType.Human }})
                }
              />
              Human
            </label>
            <label className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="blackPlayerType"
                value={PlayerType.Computer}
                onChange={(_) =>
                  setForm({ ...form, blackPlayer: {...form.blackPlayer, player: PlayerType.Computer, aiLevel: 5 }})
                }
              />
              Computer
            </label>
            <div
              className={`input-group mt-2 ${
                form.blackPlayer.player === PlayerType.Human ? 'd-none' : ''
              }`}
            >
              <label htmlFor="blackAiDifficulty" className="form-label">
                AI Difficulty
              </label>
              <input
                type="range"
                className="form-range"
                min="2"
                max="9"
                id="blackAiDifficulty"
                defaultValue={form.blackPlayer.aiLevel}
                onChange={(_) => setForm({ ...form, blackPlayer: {...form.blackPlayer, aiLevel: parseInt(_.target.value) } })}
              />
            </div>
          </fieldset>
          <fieldset className="border-start ps-3 mt-3">
            <legend>White Player</legend>
            <label className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="whitePlayerType"
                value={PlayerType.Human}
                defaultChecked
                onChange={(_) =>
                  setForm({ ...form, whitePlayer: {...form.whitePlayer, player: PlayerType.Human }})
                }
              />
              Human
            </label>
            <label className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="whitePlayerType"
                value={PlayerType.Computer}
                onChange={(_) =>
                  setForm({ ...form, whitePlayer: {...form.whitePlayer, player: PlayerType.Computer, aiLevel: 5 }})
                }
              />
              Computer
            </label>
            <div
              className={`input-group mt-2 ${
                form.whitePlayer.player === PlayerType.Human ? 'd-none' : ''
              }`}
            >
              <label htmlFor="whiteAiDifficulty" className="form-label">
                AI Difficulty
              </label>
              <input
                type="range"
                className="form-range"
                min="2"
                max="9"
                id="whiteAiDifficulty"
                defaultValue={form.whitePlayer.aiLevel}
                onChange={(_) => setForm({ ...form, whitePlayer: {...form.whitePlayer, aiLevel: parseInt(_.target.value) } })}
              />
            </div>
          </fieldset>
          <fieldset className="border-start ps-3 mt-3">
            <legend>Position</legend>
            <label className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="position"
                value="default"
                defaultChecked
                onChange={(_) => setForm({ ...form, position: _.target.value })}
              />
              Default
            </label>
            <label className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="position"
                value="fen"
                onChange={(_) => setForm({ ...form, position: _.target.value })}
              />
              From FEN
            </label>
            <div
              className={`input-group mt-2 ${
                form.position === 'default' ? 'd-none' : ''
              }`}
            >
              <span className="input-group-text" id="basic-addon1">
                FEN
              </span>
              <input
                type="text"
                className="form-control"
                aria-label="FEN"
                aria-describedby="basic-addon1"
                onChange={(_) => setForm({ ...form, fen: _.target.value })}
              />
            </div>
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" type="submit">
            Go
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
export default NewGameModal
