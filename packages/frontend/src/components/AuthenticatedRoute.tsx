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
      if (!auth.user) {
        auth.authorize(`${window.location.pathname}${window.location.search}`);
      }
    }

    onLoad();
  }, [auth.user]);

  return auth.user && children;
}
