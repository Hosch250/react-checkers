import GameBoard from "./GameBoard"
import MoveHistory, { MoveHistoryCollapsed } from './MoveHistory'
import DisplayWin from './DisplayWin'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import GameInfo from './GameInfo'

function GamePage() {
  return (
      <div className="GamePage">
        <Row className="justify-content-center">
          <Col xs="auto"><DisplayWin /></Col>
        </Row>
        <Row>
          <Col xs={12} className="d-md-none order-1 order-md-6">
            <MoveHistoryCollapsed />
          </Col>
          <Col lg="auto" md={12} className="order-3 order-lg-1" style={{minWidth: 200}}>
            <GameInfo />
          </Col>
          <Col md={6} sm={12} className="order-1 order-md-3">
            <GameBoard />
          </Col>
          <Col md={3} sm={12} className="d-none d-md-block order-2 order-md-4 overflow-auto" style={{maxHeight: 400}}>
            <MoveHistory />
          </Col>
        </Row>
      </div>
  )
}

export default GamePage