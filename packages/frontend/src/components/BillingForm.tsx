import React, { useState } from "react";
import { Token, StripeError } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "./Button";
import { formCs } from "../lib/stylesLib";
import { useFormFields } from "../lib/hooksLib";

const formContainerCs =
  `mx-auto md:max-w-md md:pt-15 flex flex-col gap-6`;
const cardElementCs =
  `px-4 py-3 w-full border border-gray-300 rounded
  [&.StripeElement--focus]:ring-1 [&.StripeElement--focus]:ring-blue-500
  [&.StripeElement--focus]:border-blue-500
  dark:border-gray-700 dark:text-gray-300
  dark:[&.StripeElement--focus]:ring-blue-400 dark:[&.StripeElement--focus]:border-blue-400`;
const cardElementInputStyles = {
  fontSize: "18px",
  fontWeight: "400",
  color: "#000000",
  fontFamily: "'Noto Sans', sans-serif",
  "::placeholder": {
    color: "#00000080",
  },
};

export interface BillingFormType {
  isLoading: boolean;
  onSubmit: (
    storage: string,
    info: { token?: Token; error?: StripeError }
  ) => Promise<void>;
}

export function BillingForm({ isLoading, onSubmit }: BillingFormType) {
  const stripe = useStripe();
  const elements = useElements();
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    storage: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  isLoading = isProcessing || isLoading;

  function validateForm() {
    return (
      stripe &&
      elements &&
      fields.name !== "" &&
      fields.storage !== "" &&
      isCardComplete
    );
  }

  async function handleSubmitClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (!elements.getElement(CardElement)) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { token, error } = await stripe.createToken(cardElement);

    setIsProcessing(false);

    onSubmit(fields.storage, { token, error });
  }

  return (
    <form onSubmit={handleSubmitClick} className={formContainerCs}>
      <div className={formCs.field}>
        <label htmlFor="storage" className={formCs.label}>Storage</label>
        <input
          id="storage"
          min="0"
          type="number"
          value={fields.storage}
          className={formCs.input}
          onChange={handleFieldChange}
          placeholder="Number of notes to store"
        />
      </div>

      <hr className={formCs.separator} />

      <div className={formCs.container}>
        <div className={formCs.field}>
          <label htmlFor="name" className={formCs.label}>
            Cardholder's name
          </label>
          <input
            id="name"
            type="text"
            value={fields.name}
            className={formCs.input}
            onChange={handleFieldChange}
            placeholder="Name on the card"
          />
        </div>

        <div className={formCs.field}>
          <label className={formCs.label}>Credit Card Info</label>
          <CardElement
            className={cardElementCs}
            onChange={(e) => setIsCardComplete(e.complete)}
            options={{
              style: {
                base: cardElementInputStyles
              },
            }}
          />
        </div>

        <div className={formCs.controls}>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!validateForm()}
          >
            Purchase
          </Button>
        </div>
      </div>
    </form>
  );
}
