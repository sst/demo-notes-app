import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Context as OAuthContextType } from "./OAuthContext";
import { OpenAuthProvider, useOpenAuth } from "./OAuthContext";
import config from "./config";

type User = Record<string, string>;

interface AuthContextType extends OAuthContextType {
  user?: User;
  userId?: string;
  loaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const auth = useOpenAuth();

  useEffect(() => {
    async function load() {
      if (auth.subject) {
        await fetchUser();
      }

      setLoaded(true);
    }

    load();
  }, [auth.subject && auth.subject.id]);

  async function fetchUser() {
    const res = await fetch(`${config.API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${await auth.access()}`,
      },
    });

    if (res.ok) {
      const user = await res.json();

      setUser(user);
    }
  }

  function logout() {
    auth.logout();
    window.location.assign("/");
  }

  const context: AuthContextType = {
    ...auth,
    user,
    loaded,
    logout,
    userId: user?.userId,
  };

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <OpenAuthProvider issuer={config.AUTH_URL} clientID="web">
      <AuthUserProvider>
        {children}
      </AuthUserProvider>
    </OpenAuthProvider>
  );
}
