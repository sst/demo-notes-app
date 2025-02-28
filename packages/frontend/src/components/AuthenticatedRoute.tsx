import { ReactElement, useEffect } from "react";
import { useAuth } from "../AuthContext";

export default function AuthenticatedRoute({
  children,
}: {
  children: ReactElement;
}) {
  const auth = useAuth();

  useEffect(() => {
    async function onLoad() {
      if (!auth.loggedIn) {
        await auth.login();
      }
    }

    onLoad();
  }, [auth.loggedIn]);

  return auth.loggedIn && children;
}
