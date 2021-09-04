import { useBoardEditor } from "./BoardEditorContext"
import { newAmericanCheckersGame, newPoolCheckersGame } from "./models/game-controller"
import { PdnMembers } from "./models/game-variant"
import { createFen } from "./models/pdn"
import { Variant } from "./models/types"

function FenViewer() {
  const { value } = useBoardEditor()

  let pdnMembers: PdnMembers
  switch (value.variant) {
    case Variant.AmericanCheckers:
      pdnMembers = newAmericanCheckersGame.Variant.pdnMembers
      break
    case Variant.PoolCheckers:
      pdnMembers = newPoolCheckersGame.Variant.pdnMembers
      break
  }
  const fen = createFen(pdnMembers!, value.player, value.board)

  function copyFen() {
    navigator.clipboard.writeText(fen);
  };

  return (
    <div className="input-group mb-3">
      <span className="input-group-text">FEN:</span>
      <input type="text" className="form-control" aria-label="FEN" value={fen} readOnly />
      <button className="btn btn-outline-secondary" type="button" onClick={copyFen}>
        <i className="bi-clipboard" />
        <span className="visually-hidden">Copy FEN</span>
      </button>
    </div>
  )
}

export default FenViewer