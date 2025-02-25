import { ReactElement, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.tsx";

export default function AuthenticatedRoute({
  children,
}: {
  children: ReactElement;
}) {
  // const { pathname, search } = useLocation();
  const auth = useAuth();

  useEffect(() => {
    async function onLoad() {
      if (!auth.loggedIn) {
        await auth.login();
      }
    }

    onLoad();
  }, [auth.loggedIn]);

  // if (!auth.loggedIn) {
  //   return <Navigate to={`/login?redirect=${pathname}${search}`} />;
  // }

  return auth.loggedIn && children;
}
