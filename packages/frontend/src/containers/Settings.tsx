import React, { useState, useEffect } from "react";
import config from "../config";
import Button from "../components/Button";
import { onError } from "../lib/errorLib";
import { formCs } from "../lib/stylesLib";
import { useAuthFetch, useFormFields } from "../lib/hooksLib";

const formContainerCs =
  `mx-auto md:max-w-md md:pt-15 flex flex-col gap-6`;
const labelCs = `text-center`;

export default function Settings() {
  const authFetch = useAuthFetch();
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    units: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    async function onLoad() {
      try {
        setSubscribed(await checkSubscription());
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  });

  async function checkSubscription() {
    const user = await authFetch(`${config.API_URL}me`);

    return user.customerId !== undefined;
  }

  async function initCheckout(units: number) {
    const res = await authFetch(`${config.API_URL}checkout`, {
      method: "POST",
      body: JSON.stringify({ units, redirect: window.location.origin }),
    });

    return res.url;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const url = await initCheckout(Number(fields.units));
      window.location.href = url;
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (subscribed !== null &&
    <div>
      <form onSubmit={handleSubmit} className={formContainerCs}>
        <div className={formCs.field}>
          <label htmlFor="units" className={formCs.label}>Storage</label>
          <input
            id="units"
            min="0"
            type="number"
            value={fields.units}
            className={formCs.input}
            onChange={handleFieldChange}
            placeholder="Number of notes to store"
          />
        </div>

        <div className={formCs.controls}>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={fields.units === ""}
          >
            Purchase
          </Button>
          {subscribed && <p className={labelCs}>You are already subscribed.</p>}
        </div>
      </form>
    </div>
  );
}
