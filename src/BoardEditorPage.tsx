import wp from './Assets/WhitePiece.svg'
import bp from './Assets/BlackPiece.svg'
import wk from './Assets/WhiteKing.svg'
import bk from './Assets/BlackKing.svg'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import { PieceType, Player, Piece as PieceModel, blackChecker, blackKing, whiteChecker, whiteKing } from './models/types'
import Board from './Board'
import GameControllerProvider from './GameControllerContext'
import { isEqual } from 'lodash'
import FenViewer from './FenViewer'
import EditorOptions from './EditorOptions'

function BoardEditorPage() {
  return (
    <GameControllerProvider>
      <div className="BoardEditorPage">
        <Row>
          <Col md="auto" sm={12}>
          <div className="text-center d-inline-block d-md-block m-sm-1">
              <Piece
                piece={{ PieceType: PieceType.Checker, Player: Player.White }}
              />
              <div>White Checker</div>
            </div>
            <div className="text-center d-inline-block d-md-block m-sm-1">
              <Piece
                piece={{ PieceType: PieceType.King, Player: Player.White }}
              />
              <div>White King</div>
            </div>
            <div className="text-center d-inline-block d-md-block m-sm-1">
              <Piece
                piece={{ PieceType: PieceType.Checker, Player: Player.Black }}
              />
              <div>Black Checker</div>
            </div>
            <div className="text-center d-inline-block d-md-block m-sm-1">
              <Piece
                piece={{ PieceType: PieceType.King, Player: Player.Black }}
              />
              <div>Black King</div>
            </div>
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
    </GameControllerProvider>
  )
}

export default BoardEditorPage

function Piece({ piece }: { piece: PieceModel }) {
    let domPiece = null
    switch (true) {
      case isEqual(whiteChecker, piece):
        domPiece = <img src={wp} style={{ margin: 5, verticalAlign: "unset", width: 40 }} alt="white checker" />
        break
      case isEqual(blackChecker, piece):
        domPiece = <img src={bp} style={{ margin: 5, verticalAlign: "unset", width: 40 }} alt="black checker" />
        break
      case isEqual(whiteKing, piece):
        domPiece = <img src={wk} style={{ margin: 5, verticalAlign: "unset", width: 40 }} alt="white king" />
        break
      case isEqual(blackKing, piece):
        domPiece = <img src={bk} style={{ margin: 5, verticalAlign: "unset", width: 40 }} alt="black king" />
        break
    }
    return domPiece
  }