import React, { useState } from "react";
import { useFormFields } from "../lib/hooksLib";
import Button from "./Button";
import { Token, StripeError } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./BillingForm.css";

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
    <form
      onSubmit={handleSubmitClick}
      className="mx-auto md:max-w-md md:pt-15 flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="storage"
          className="block font-medium text-gray-700"
        >
          Storage
        </label>
        <input
          id="storage"
          min="0"
          type="number"
          value={fields.storage}
          onChange={handleFieldChange}
          placeholder="Number of notes to store"
          className="w-full px-3 py-2 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <hr className="border-t border-gray-300" />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="block font-medium text-gray-700"
          >
            Cardholder's name
          </label>
          <input
            id="name"
            type="text"
            value={fields.name}
            onChange={handleFieldChange}
            placeholder="Name on the card"
            className="w-full px-3 py-2 text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block font-medium text-gray-700">
            Credit Card Info
          </label>
          <div className="card-element-container">
            <CardElement
              className="px-4 py-3 w-full border border-gray-300 rounded bg-white"
              onChange={(e) => setIsCardComplete(e.complete)}
              options={{
                style: {
                  base: {
                    fontSize: "18px",
                    fontWeight: "400",
                    color: "#000000",
                    fontFamily: "'Open Sans', sans-serif",
                    "::placeholder": {
                      color: "#00000080",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <Button
            type="submit"
            variant="success"
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
