import wp from './Assets/WhitePiece.svg'
import bp from './Assets/BlackPiece.svg'
import wk from './Assets/WhiteKing.svg'
import bk from './Assets/BlackKing.svg'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import {
  Piece as PieceModel,
  blackChecker,
  blackKing,
  whiteChecker,
  whiteKing,
  Variant,
} from './models/types'
import Board from './Board'
import { isEqual } from 'lodash'
import FenViewer from './FenViewer'
import EditorOptions from './EditorOptions'
import { BoardEditorInfo, useBoardEditor } from './BoardEditorContext'
import React from 'react'
import Button from 'react-bootstrap/esm/Button'

function setPieceAt(
  editor: BoardEditorInfo,
  piece: PieceModel | undefined,
  updateEditor: (editor: BoardEditorInfo) => void,
  setSelectedPiece: (piece: PieceModel | undefined) => void
) {
  function squareClicked(row: number, col: number) {
    if (!editor.pdnMembers.pdnBoard[row][col]) {
      setSelectedPiece(undefined)
      return
    }

    editor.board[row][col] = piece
    updateEditor({
      ...editor,
    })
  }

  return squareClicked
}

function BoardEditorPage() {
  let { value, onChange } = useBoardEditor()
  let [selectedPiece, setSelectedPiece] = React.useState<
    PieceModel | undefined
  >(undefined)

  let memo = React.useCallback(setPieceAt(value, selectedPiece, onChange, setSelectedPiece), [
    value, selectedPiece,
  ])

  let isBoardMonoColor = value.variant === Variant.TurkishDraughts

  return (
    <div className="BoardEditorPage">
      <Row>
        <Col md="auto" sm={12}>
          <Piece
            piece={whiteChecker}
            isSelected={isEqual(selectedPiece, whiteChecker)}
            onclick={setSelectedPiece}
          />
          <Piece
            piece={whiteKing}
            isSelected={isEqual(selectedPiece, whiteKing)}
            onclick={setSelectedPiece}
          />
          <Piece
            piece={blackChecker}
            isSelected={isEqual(selectedPiece, blackChecker)}
            onclick={setSelectedPiece}
          />
          <Piece
            piece={blackKing}
            isSelected={isEqual(selectedPiece, blackKing)}
            onclick={setSelectedPiece}
          />
          <Button className="w-100 mt-3" variant="secondary" onClick={() => setSelectedPiece(undefined)}>Clear</Button>
        </Col>
        <Col md="auto" sm={12}>
          <Board board={value.board} selectedCoord={undefined} onclick={memo} isMonoColor={isBoardMonoColor} />
          <FenViewer />
        </Col>
        <Col md="auto" sm={12}>
          <EditorOptions />
        </Col>
      </Row>
    </div>
  )
}

export default BoardEditorPage

function Piece({
  piece,
  isSelected,
  onclick,
}: {
  piece: PieceModel,
  isSelected: boolean,
  onclick: (piece: PieceModel | undefined) => void
}) {
  let pieceImage = null
  let pieceLabel
  switch (true) {
    case isEqual(whiteChecker, piece):
      pieceImage = (
        <img
          src={wp}
          style={{ margin: 5, verticalAlign: 'unset', width: 40 }}
          alt="white checker"
        />
      )
      pieceLabel = 'White Checker'
      break
    case isEqual(blackChecker, piece):
      pieceImage = (
        <img
          src={bp}
          style={{ margin: 5, verticalAlign: 'unset', width: 40 }}
          alt="black checker"
        />
      )
      pieceLabel = 'Black Checker'
      break
    case isEqual(whiteKing, piece):
      pieceImage = (
        <img
          src={wk}
          style={{ margin: 5, verticalAlign: 'unset', width: 40 }}
          alt="white king"
        />
      )
      pieceLabel = 'White King'
      break
    case isEqual(blackKing, piece):
      pieceImage = (
        <img
          src={bk}
          style={{ margin: 5, verticalAlign: 'unset', width: 40 }}
          alt="black king"
        />
      )
      pieceLabel = 'Black King'
      break
  }

  return (
    <div
      className="text-center d-inline-block d-md-block m-sm-1"
      onClick={() => onclick(piece)}
    >
      {pieceImage}
      <div className={(isSelected ? 'fw-bold' : '')}>{pieceLabel}</div>
    </div>
  )
}
