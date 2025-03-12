import { auth } from "./auth";
import { stripeInfo } from "./billing";
import { users, notes, bucket } from "./storage";

export const api = new sst.aws.Function("Api", {
  url: true,
  handler: "packages/functions/src/api/index.handler",
  link: [auth, users, notes, bucket, stripeInfo],
});

export const stripeWebhook = new stripe.WebhookEndpoint("StripeWebhook", {
  url: $interpolate`${api.url}webhook`,
  enabledEvents: ["customer.subscription.created"],
  description: "Webhook for Stripe subscription created event",
});

new sst.aws.OpenControl("OpenControl", {
  server: {
    handler: "packages/opencontrol/src/server.handler",
    link: [notes, users, bucket, stripeInfo],
    transform: {
      role: (args) => {
        args.managedPolicyArns = $output(args.managedPolicyArns).apply(
          (v) => [...(v ?? []), "arn:aws:iam::aws:policy/ReadOnlyAccess"]
        );
      },
    },
  },
});
