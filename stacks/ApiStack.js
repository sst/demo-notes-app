import { Api, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
  const { table } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    customDomain: app.stage === "prod" ? "notes-api.seed-demo.club" : undefined,
    defaults: {
      authorizer: "iam",
      function: {
        bind: [table],
        environment: {
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        },
      },
    },
    routes: {
      "GET /notes": "packages/functions/src/list.main",
      "POST /notes": "packages/functions/src/create.main",
      "GET /notes/{id}": "packages/functions/src/get.main",
      "PUT /notes/{id}": "packages/functions/src/update.main",
      "DELETE /notes/{id}": "packages/functions/src/delete.main",
      "POST /billing": "packages/functions/src/billing.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.customDomainUrl || api.url,
  });

  // Return the API resource
  return {
    api,
  };
}