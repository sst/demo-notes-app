import Stripe from "stripe";
import { Resource } from "sst";
import { Users } from "@notes/core/users";

const stripe = new Stripe(
  Resource.Stripe.secretKey,
  { apiVersion: "2024-06-20" }
);

export module Billing {

  export async function initCheckout(
    userId: string, units: number, redirectUrl: string
  ) {
    const user = await Users.getById(userId);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      payment_method_types: ["card"],
      line_items: [
        { price: Resource.Stripe.subscription, quantity: units },
      ],
      cancel_url: redirectUrl,
      success_url: `${redirectUrl}?status=success`,
    });

    return session.url;
  }

  export async function createCustomer(subsciption: Stripe.Subscription) {
    const customerId = subsciption.customer as string;

    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const user = await Users.getByEmail(customer.email!);

    await Users.update(user.userId, customerId);
  }

}
