import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "./AuthContext";
import AppRoutes from "./Routes";
import "./App.css";

function App() {
  const auth = useAuth();

  return (
    auth.loaded && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
          <LinkContainer to="/">
            <Navbar.Brand className="fw-bold text-muted">Scratch</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {auth.loggedIn ? (
                <>
                  <LinkContainer to="/settings">
                    <Nav.Link>Settings</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={auth.login}>Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppRoutes />
      </div>
    )
  );
}

export default App;
