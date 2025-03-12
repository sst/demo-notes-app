import { useCallback } from "react";
import { useAuth } from "../AuthContext";

interface AuthFetchOptions extends RequestInit {
  headers?: HeadersInit;
}

type AuthFetchFunction = (url: string, options?: AuthFetchOptions) => Promise<any>;

export function useAuthFetch(): AuthFetchFunction {
  const auth = useAuth();

  const authFetch = useCallback(
    async (url: string, options: AuthFetchOptions = {}): Promise<any> => {
      try {
        const token = await auth.access();

        const headers = {
          "Authorization": `Bearer ${token}`,
          ...options.headers,
        };

        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        throw error;
      }
    }, [auth.subject && auth.subject.id]);

  return authFetch;
}
