import Board from './Board'
import GameControllerProvider from './GameControllerContext'
import MoveHistory from './MoveHistory'
import DisplayWin from './DisplayWin'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import 'bootstrap/dist/css/bootstrap.min.css'
import GameInfo from './GameInfo'

function App() {
  return (
    <GameControllerProvider>
      <Container className="App">
        <Row className="justify-content-center">
          <Col xs="auto"><DisplayWin /></Col>
        </Row>
        <Row>
          <Col lg="auto" md={12} className="offset-xl-3 order-3 order-lg-1">
            <GameInfo />
          </Col>
          <Col md="auto" sm={12} className="order-1 order-md-3">
            <Board />
          </Col>
          <Col md="auto" sm={12} className="d-none d-md-block order-2 order-md-4">
            <MoveHistory />
          </Col>
        </Row>
      </Container>
    </GameControllerProvider>
  )
}

export default App
