function EditorOptions() {
  return (
    <>
      <div className="form-floating mb-2">
        <select className="form-select" id="variant">
          <option>American Checkers</option>
          <option>Pool Checkers</option>
        </select>
        <label htmlFor="variant">Variant</label>
      </div>
      <div className="form-floating mb-2">
        <select className="form-select" id="turn">
          <option>Black</option>
          <option>White</option>
        </select>
        <label htmlFor="turn">First Move</label>
      </div>
      <div className="form-floating">
        <select className="form-select" id="position">
          <option selected>Initial</option>
          <option>Empty</option>
        </select>
        <label htmlFor="position">Set Position</label>
      </div>
    </>
  )
}

export default EditorOptions
