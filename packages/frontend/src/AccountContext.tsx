import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useOpenAuth } from "./OAuthContext";
import config from "./config";

type User = Record<string, string>;

interface AccountContextType {
  user?: User;
  userId?: string;
  loaded: boolean;
}

const AuthContext = createContext({} as AccountContextType);

export function AccountProvider({ children }: { children: ReactNode }) {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loaded,
        userId: user?.userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
}
