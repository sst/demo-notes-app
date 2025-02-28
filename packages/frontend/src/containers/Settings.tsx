import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import config from "../config";
import { onError } from "../lib/errorLib";
import { useAuthFetch } from "../lib/hooksLib";
import { BillingType } from "../types/billing";
import { BillingForm, BillingFormType } from "../components/BillingForm";

const stripePromise = loadStripe(config.STRIPE_KEY);

export default function Settings() {
  const nav = useNavigate();
  const authFetch = useAuthFetch();
  const [isLoading, setIsLoading] = useState(false);

  async function billUser(details: BillingType) {
    return authFetch(`${config.API_URL}billing`, {
      method: "POST",
      body: JSON.stringify(details),
    });
  }

  const handleFormSubmit: BillingFormType["onSubmit"] = async (
    storage,
    info
  ) => {
    if (info.error) {
      onError(info.error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: info.token?.id,
      });

      alert("Your card has been charged successfully!");
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Elements
        stripe={stripePromise}
        options={{
          fonts: [{
            cssSrc:
              "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100..900&display=swap",
          }],
        }}
      >
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );
}
