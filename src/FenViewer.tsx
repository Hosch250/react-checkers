function FenViewer() {
  return (
    <div className="input-group mb-3">
      <span className="input-group-text">FEN:</span>
      <input type="text" className="form-control" aria-label="FEN" />
      <button className="btn btn-outline-secondary" type="button">
        <i className="bi-clipboard" />
        <span className="visually-hidden">Copy FEN</span>
      </button>
    </div>
  )
}

export default FenViewer