import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AccountProvider } from "./AccountContext";
import config from "./config";
import App from "./App";
import "./index.css";
import { OpenAuthProvider } from '@openauthjs/react';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OpenAuthProvider
      clientID="web"
      issuer={config.AUTH_URL}
      onExpiry={async (_id, ctx) =>
        ctx.authorize(`${window.location.pathname}${window.location.search}`)
      }
    >
      <AccountProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AccountProvider>
    </OpenAuthProvider>
  </StrictMode>
);
