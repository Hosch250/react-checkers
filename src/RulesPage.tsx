function RulesPage() {
  return (
    <div>
      <h2 className="fw-bold text-center">American Checkers</h2>
      <h3 className="fw-bold">Moving</h3>
      <p>Checkers move forward diagonally one square.</p>
      <p>Kings move diagonally one square in any direction.</p>
      <h3 className="fw-bold">Capturing</h3>
      <p className="fw-italic">Capturing is required in this variant.</p>
      <p>
        Checkers jump forward diagonally two squares; they may only jump over an
        opponent's piece onto a blank square and continue jumping until there
        are no more pieces to jump, or until they reach the king row.
      </p>
      <p>
        King jumps follow the same pattern as checkers jumps, but do not have
        the restriction on moving forward.
      </p>
      <h3 className="fw-bold">Winning</h3>
      <p>
        The game is won when one player has no more pieces or cannot make any
        more moves.
      </p>
      <h3 className="fw-bold">Draws</h3>
      <p>
        The game is drawn when a position has been reached 3 times, or when a
        checker has not been advanced and no captures have been made by either
        player for 40 turns.
      </p>
      <hr />
      <h2 className="fw-bold text-center">Pool Checkers</h2>
      <h3 className="fw-bold">Moving</h3>
      <p>Checkers move forward diagonally one square.</p>
      <p>Kings move diagonally one square in any direction.</p>
      <h3 className="fw-bold">Capturing</h3>
      <p>Capturing is required in this variant.</p>
      <p>
        Checkers jump diagonally two squares in any direction; they may only
        jump over an opponent's piece onto a blank square and continue jumping
        until there are no more pieces to jump. They are not crowned during a
        jump unless the ending square is the king row.
      </p>
      <p>
        King jumps follow the same pattern as checkers jumps, and can also make
        a flying jump. A flying jump in this variant allows the king to jump
        over any blank squares in a diagonal path, over a single opponent's
        piece, and and onto a blank square directly behind the jumped piece.
      </p>
      <h3 className="fw-bold">Winning</h3>
      <p>
        The game is won when one player has no more pieces or cannot make any
        more moves.
      </p>
      <h3 className="fw-bold">Draws</h3>
      <p>
        The game is drawn when a position has been reached 3 times, or when one
        player has three or more kings vs an opponent with one king and is not
        able to win in 13 moves.
      </p>
    </div>
  )
}

export default RulesPage
