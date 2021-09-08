import Modal from 'react-bootstrap/esm/Modal'
import MoveHistory from './MoveHistory'

function MoveHistoryModal({
  showState,
}: {
  showState: [boolean, (value: boolean) => void]
}) {
  let [show, setShow] = showState

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Move History</Modal.Title>
      </Modal.Header>
        <Modal.Body>
            <MoveHistory />
        </Modal.Body>
    </Modal>
  )
}
export default MoveHistoryModal
