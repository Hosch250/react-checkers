import { Switch, Route, NavLink } from 'react-router-dom'
import React from 'react'
import GamePage from './GamePage'
import RulesPage from './RulesPage'
import Nav from 'react-bootstrap/esm/Nav'
import Navbar from 'react-bootstrap/esm/Navbar'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import BoardEditorPage from './BoardEditorPage'
import BoardEditorProvider from './BoardEditorContext'
import GameControllerProvider from './GameControllerContext'

function PrimaryLayout() {
  return (
    <div className="PrimaryLayout">
      <Navbar bg="dark" variant="dark">
        <Row className="container">
          <Col className="offset-xl-3">
            <Nav defaultActiveKey="/">
              <Nav.Item>
                <NavLink
                  to="/"
                  className="nav-link"
                  activeClassName="active"
                  exact={true}
                >
                  Game
                </NavLink>
              </Nav.Item>
              <Nav.Item>
                <NavLink
                  to="/editor"
                  className="nav-link"
                  activeClassName="active"
                  exact={true}
                >
                  Board Editor
                </NavLink>
              </Nav.Item>
              <Nav.Item>
                <NavLink
                  to="/rules"
                  className="nav-link"
                  activeClassName="active"
                  exact={true}
                >
                  Rules
                </NavLink>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Navbar>
      <Row className="container">
        <Col className="offset-xl-3">
          <main className="primary-content mt-3">
            <React.Suspense fallback={<div>loading...</div>}>
              <Switch>
                <Route path="/" exact>
                  <GameControllerProvider>
                    <GamePage />
                  </GameControllerProvider>
                </Route>
                <Route path="/editor">
                  <BoardEditorProvider>
                    <BoardEditorPage />
                  </BoardEditorProvider>
                </Route>
                <Route path="/rules">
                  <RulesPage />
                </Route>
              </Switch>
            </React.Suspense>
          </main>
        </Col>
      </Row>
    </div>
  )
}

export default PrimaryLayout
