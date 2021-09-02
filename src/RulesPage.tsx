function RulesPage() {
  return (
    <div>
      <h2 className="fw-bold text-center">American Checkers</h2>
      <h3 className="fw-bold">Moving</h3>
      <div>
        <p>Checkers move forward diagonally one square.</p>
        <p>Kings move diagonally one square in any direction.</p>
      </div>
      <h3 className="fw-bold">Capturing</h3>
      <div>
        <p className="fw-italic">Capturing is required in this variant.</p>
        <p>
          Checkers jump forward diagonally two squares; they may only jump over
          an opponent's piece onto a blank square and continue jumping until
          there are no more pieces to jump, or until they reach the king row.
        </p>
        <p>
          King jumps follow the same pattern as checkers jumps, but do not have
          the restriction on moving forward.
        </p>
      </div>
      <h3 className="fw-bold">Winning</h3>
      <div>
        <p>
          The game is won when one player has no more pieces or cannot make any
          more moves.
        </p>
      </div>
      <hr />
      <h2 className="fw-bold text-center">Pool Checkers</h2>
      <h3 className="fw-bold">Moving</h3>
      <div>
        <p>Checkers move forward diagonally one square.</p>
        <p>Kings move diagonally one square in any direction.</p>
      </div>
      <h3 className="fw-bold">Capturing</h3>
      <div>
        <p>Capturing is required in this variant.</p>
        <p>
          Checkers jump diagonally two squares in any direction; they may only
          jump over an opponent's piece onto a blank square and continue jumping
          until there are no more pieces to jump. They are not crowned during a
          jump unless the ending square is the king row.
        </p>
        <p>
          King jumps follow the same pattern as checkers jumps, and can also
          make a flying jump. A flying jump in this variant allows the king to
          jump over any blank squares in a diagonal path, over a single
          opponent's piece, and and onto a blank square directly behind the
          jumped piece.
        </p>
      </div>
      <h3 className="fw-bold">Winning</h3>
      <div>
        <p>
          The game is won when one player has no more pieces or cannot make any
          more moves.
        </p>
      </div>
    </div>
  )
}

export default RulesPage
