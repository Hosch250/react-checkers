import Board from './Board'
import GameControllerProvider from './GameControllerContext'
import MoveHistory from './MoveHistory'
import DisplayWin from './DisplayWin'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import GameInfo from './GameInfo'

function GamePage() {
  return (
    <GameControllerProvider>
      <div className="GamePage">
        <Row className="justify-content-center">
          <Col xs="auto"><DisplayWin /></Col>
        </Row>
        <Row>
          <Col lg="auto" md={12} className="order-3 order-lg-1">
            <GameInfo />
          </Col>
          <Col md="auto" sm={12} className="order-1 order-md-3">
            <Board />
          </Col>
          <Col md="auto" sm={12} className="d-none d-md-block order-2 order-md-4 overflow-auto" style={{maxHeight: 400}}>
            <MoveHistory />
          </Col>
        </Row>
      </div>
    </GameControllerProvider>
  )
}

export default GamePage