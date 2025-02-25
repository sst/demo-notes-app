import {
  useRef,
  useState,
  ReactNode,
  useEffect,
  useContext,
  createContext,
} from "react";
import { createClient } from "@openauthjs/openauth/client";

const client = createClient({
  clientID: "web",
  issuer: import.meta.env.VITE_AUTH_URL,
});

interface AuthContextType {
  userId?: string;
  loaded: boolean;
  loggedIn: boolean;
  logout: () => void;
  login: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const initializing = useRef(true);
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const token = useRef<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    async function auth() {
      const token = await refreshTokens();

      if (token) {
        await user();
      }

      setLoaded(true);
    }

    const hash = new URLSearchParams(location.search.slice(1));
    const code = hash.get("code");
    const state = hash.get("state");

    if (!initializing.current) {
      return;
    }

    initializing.current = false;

    if (code && state) {
      callback(code, state);
      return;
    }

    auth();
  }, []);

  async function refreshTokens() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return;
    const next = await client.refresh(refresh, {
      access: token.current,
    });
    if (next.err) return;
    if (!next.tokens) return token.current;

    localStorage.setItem("refresh", next.tokens.refresh);
    token.current = next.tokens.access;

    return next.tokens.access;
  }

  async function getToken() {
    const token = await refreshTokens();

    if (!token) {
      await login();
      return;
    }

    return token;
  }

  async function login() {
    const redirect = `${window.location.pathname}${window.location.search}`;

    const { challenge, url } = await client.authorize(
      window.location.origin,
      "code",
      { pkce: true }
    );

    sessionStorage.setItem("redirect", redirect);
    sessionStorage.setItem("challenge", JSON.stringify(challenge));

    window.location.href = url;
  }

  async function callback(code: string, state: string) {
    const redirect = sessionStorage.getItem("redirect");
    const challenge = JSON.parse(sessionStorage.getItem("challenge")!);
    if (code) {
      if (state === challenge.state && challenge.verifier) {
        const exchanged = await client.exchange(
          code!,
          location.origin,
          challenge.verifier,
        );
        if (!exchanged.err) {
          token.current = exchanged.tokens?.access;
          localStorage.setItem("refresh", exchanged.tokens.refresh);
        }
      }
      window.location.replace(redirect || "/");
    }
  }

  async function user() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}me`, {
      headers: {
        Authorization: `Bearer ${token.current}`,
      },
    });

    if (res.ok) {
      const user = await res.json();

      setUserId(user.userId);
      setLoggedIn(true);
    }
  }

  function logout() {
    localStorage.removeItem("refresh");
    token.current = undefined;

    window.location.replace("/");
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        userId,
        loaded,
        loggedIn,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
