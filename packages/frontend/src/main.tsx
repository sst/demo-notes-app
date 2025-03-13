import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AccountProvider } from "./AccountContext";
import { OpenAuthProvider } from "./OAuthContext";
import config from "./config";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OpenAuthProvider issuer={config.AUTH_URL} clientID="web">
      <AccountProvider>
        <Router>
          <App />
        </Router>
      </AccountProvider>
    </OpenAuthProvider>
  </StrictMode>
);
