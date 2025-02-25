import { useAuth } from "../AuthContext";
import { useState, useCallback, ChangeEvent, ChangeEventHandler } from "react";

interface AuthFetchOptions extends RequestInit {
  headers?: HeadersInit;
}

type AuthFetchFunction = (url: string, options?: AuthFetchOptions) => Promise<any>;

export function useAuthFetch(): AuthFetchFunction {
  const auth = useAuth();

  const authFetch = useCallback(
    async (url: string, options: AuthFetchOptions = {}): Promise<any> => {
      try {
        const token = await auth.getToken();

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
    }, [auth]);

  return authFetch;
}

interface FieldsType {
  [key: string | symbol]: string;
}

export function useFormFields(
  initialState: FieldsType
): [FieldsType, ChangeEventHandler] {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function(event: ChangeEvent<HTMLInputElement>) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
      return;
    },
  ];
}
