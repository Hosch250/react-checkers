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
import { Variant } from './models/types'
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

    onChange(controller)
    setShow(false)
    resetForm()
  }

  function resetForm() {
    setForm({
      variant: Variant.AmericanCheckers,
      position: 'default',
      fen: '',
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
