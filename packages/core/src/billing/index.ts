import Stripe from "stripe";
import { Resource } from "sst";

export module Billing {

  export function compute(storage: number) {
    const rate = storage <= 10 ? 4 : storage <= 100 ? 2 : 1;
    return rate * storage;
  }

  export async function charge(storage: number, source: string) {
    const stripe = new Stripe(
      Resource.StripeSecretKey.value,
      { apiVersion: "2024-06-20" }
    );

    await stripe.charges.create({
      source,
      currency: "usd",
      amount: compute(storage),
      description: "Scratch charge",
    });
  }

}
