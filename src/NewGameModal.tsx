import { cloneDeep } from 'lodash'
import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { useGameController } from './GameControllerContext'
import {
  newAmericanCheckersGame,
  newAmericanCheckersOptionalJumpGame,
  newPoolCheckersGame,
} from './models/game-controller'
import { Variant } from './models/types'

function NewGameModal({
  showState,
}: {
  showState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}) {
  let [show, setShow] = showState
  const { onChange } = useGameController()

  const [selectedVariant, setSelectedVariant] = useState(
    Variant.AmericanCheckers,
  )

  const createNewGame = (ev: React.FormEvent) => {
    ev.preventDefault()

    switch (selectedVariant) {
      case Variant.AmericanCheckers:
        onChange(cloneDeep(newAmericanCheckersGame))
        break
      case Variant.AmericanCheckersOptionalJump:
        onChange(cloneDeep(newAmericanCheckersOptionalJumpGame))
        break
      case Variant.PoolCheckers:
        onChange(cloneDeep(newPoolCheckersGame))
        break
    }

    setShow(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedVariant(Variant.AmericanCheckers)
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
                setSelectedVariant(parseInt(ev.target.value) as Variant)
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
