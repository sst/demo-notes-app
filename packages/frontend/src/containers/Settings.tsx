import { useState } from "react";
import config from "../config";
import { onError } from "../lib/errorLib";
import { useAuthFetch } from "../lib/hooksLib";
import { useNavigate } from "react-router-dom";
import { BillingType } from "../types/billing";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { BillingForm, BillingFormType } from "../components/BillingForm";
import "./Settings.css";

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
    <div className="Settings">
      <Elements
        stripe={stripePromise}
        options={{
          fonts: [
            {
              cssSrc:
                "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
            },
          ],
        }}
      >
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );
}
