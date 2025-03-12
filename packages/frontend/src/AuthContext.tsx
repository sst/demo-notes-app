import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Context as OAuthContextType } from "./OAuthContext";
import { OpenAuthProvider, useOpenAuth } from "./OAuthContext";
import config from "./config";

type User = Record<string, string>;

// Define the enhanced context type
interface AuthContextType extends OAuthContextType {
  user?: User;
  loaded: boolean;
}

// Create a new context with the enhanced type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function CombinedAuthProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  // Use the original useOpenAuth hook to get the OAuth context values
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
    console.log("fetching user", auth.subject);
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

  // Combine the original context with the additional properties
  const context: AuthContextType = {
    ...auth,
    user,
    loaded,
    logout,
  };

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the enhanced auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

// Combined provider that wraps both providers
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <OpenAuthProvider issuer={config.AUTH_URL} clientID="web">
      <CombinedAuthProvider>
        {children}
      </CombinedAuthProvider>
    </OpenAuthProvider>
  );
}
