import { ReactElement, useEffect } from "react";
import { useAccount } from "../AccountContext";
import { useOpenAuth } from "../OAuthContext";

export default function AuthenticatedRoute({
  children,
}: {
  children: ReactElement;
}) {
  const auth = useOpenAuth();
  const account = useAccount();

  useEffect(() => {
    async function onLoad() {
      if (!account.userId) {
        auth.authorize(`${window.location.pathname}${window.location.search}`);
      }
    }

    onLoad();
  }, [account.userId]);

  return account.userId && children;
}
