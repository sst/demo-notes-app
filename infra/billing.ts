export const stripeKey = new sst.Secret("StripeSecretKey");

export const stripeProduct = new stripe.Product("Notes", {
  name: "Notes Pro Plan",
  description: "A pro plan for the Notes app",
});

export const stripeSubscription = new stripe.Price("NotesSubscription", {
  product: stripeProduct.id,
  unitAmount: 1000,
  currency: "usd",
  recurring: {
    interval: "month",
    intervalCount: 1,
  },
});

export const stripeInfo = new sst.Linkable("Stripe", {
  properties: {
    secretKey: stripeKey.value,
    product: stripeProduct.id,
    subscription: stripeSubscription.id,
  }
});
