import { users, notes, secret, bucket } from "./storage";
import { auth } from "./auth";

export const api = new sst.aws.Function("Api", {
  url: true,
  link: [auth, users, notes, secret, bucket],
  handler: "packages/functions/src/api.handler",
});
