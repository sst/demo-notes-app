import { users } from "./storage";
import { domain } from "./constants";

export const email = new sst.aws.Email("Email", {
  sender: "jay@sst.dev",
});

export const auth = new sst.aws.Auth("Auth", {
  issuer: {
    link: [users, email],
    handler: "packages/functions/src/auth.handler",
    environment: {
      FRONTEND_URL: $dev ? "http://localhost:5173" : `https://${domain}`,
    },
  },
});
