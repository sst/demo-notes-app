import React, { useState } from "react";
import config from "../config";
import { onError } from "../lib/error";
import { formCs } from "../lib/styles";
import Button from "../components/Button";
import { useAuthFetch } from "../lib/fetch";
import { useAccount } from "../AccountContext";

const formContainerCs =
  `mx-auto md:max-w-md md:pt-15 flex flex-col gap-6`;
const labelCs = `text-center`;

export default function Settings() {
  const account = useAccount();
  const authFetch = useAuthFetch();
  const [units, setUnits] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function isSubscribed() {
    return account.user && account.user.customerId !== undefined;
  }

  async function initCheckout(units: number) {
    const res = await authFetch(`${config.API_URL}/checkout`, {
      method: "POST",
      body: JSON.stringify({ units, redirect: window.location.origin }),
    });

    return res.url;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const url = await initCheckout(Number(units));
      window.location.href = url;
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={formContainerCs}>
        <div className={formCs.field}>
          <label htmlFor="units" className={formCs.label}>Storage</label>
          <input
            min="0"
            id="units"
            type="number"
            value={units}
            className={formCs.input}
            placeholder="Number of notes to store"
            onChange={(e) => setUnits(e.target.value)}
          />
        </div>

        <div className={formCs.controls}>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={units === ""}
          >
            Purchase
          </Button>
          {isSubscribed() && <p className={labelCs}>You are already subscribed.</p>}
        </div>
      </form>
    </div>
  );
}
