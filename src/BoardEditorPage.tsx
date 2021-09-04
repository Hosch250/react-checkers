import wp from './Assets/WhitePiece.svg'
import bp from './Assets/BlackPiece.svg'
import wk from './Assets/WhiteKing.svg'
import bk from './Assets/BlackKing.svg'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import {
  PieceType,
  Player,
  Piece as PieceModel,
  blackChecker,
  blackKing,
  whiteChecker,
  whiteKing,
} from './models/types'
import Board from './Board'
import GameControllerProvider from './GameControllerContext'
import { isEqual } from 'lodash'
import FenViewer from './FenViewer'
import EditorOptions from './EditorOptions'
import BoardEditorProvider from './BoardEditorContext'

function BoardEditorPage() {
  return (
    <GameControllerProvider><BoardEditorProvider>
      <div className="BoardEditorPage">
        <Row>
          <Col md="auto" sm={12}>
            <Piece
              piece={{ PieceType: PieceType.Checker, Player: Player.White }}
            />
            <Piece
              piece={{ PieceType: PieceType.King, Player: Player.White }}
            />
            <Piece
              piece={{ PieceType: PieceType.Checker, Player: Player.Black }}
            />
            <Piece
              piece={{ PieceType: PieceType.King, Player: Player.Black }}
            />
          </Col>
          <Col md="auto" sm={12}>
            <Board />
            <FenViewer />
          </Col>
          <Col md="auto" sm={12}>
            <EditorOptions />
          </Col>
        </Row>
      </div>
    </BoardEditorProvider></GameControllerProvider>
  )
}

export default BoardEditorPage

function Piece({ piece }: { piece: PieceModel }) {
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
    <div className="text-center d-inline-block d-md-block m-sm-1">
      {pieceImage}
      <div>{pieceLabel}</div>
    </div>
  )
}
