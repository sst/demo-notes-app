import { useCallback } from "react";
import { useOpenAuth } from "../OAuthContext";

interface AuthFetchOptions extends RequestInit {
  headers?: HeadersInit;
}

type AuthFetchFunction = (url: string, options?: AuthFetchOptions) => Promise<any>;

export function useAuthFetch(): AuthFetchFunction {
  const auth = useOpenAuth();

  const authFetch = useCallback(
    async (url: string, options: AuthFetchOptions = {}): Promise<any> => {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            "Authorization": `Bearer ${await auth.access()}`,
            ...options.headers,
          }
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
