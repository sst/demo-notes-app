import { table, secret } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [table, secret],
      },
      args: {
        auth: { iam: true }
      },
    }
  }
});

api.route("GET /notes", "packages/functions/src/list.main");
api.route("POST /notes", "packages/functions/src/create.main");
api.route("GET /notes/{id}", "packages/functions/src/get.main");
api.route("PUT /notes/{id}", "packages/functions/src/update.main");
api.route("DELETE /notes/{id}", "packages/functions/src/delete.main");
api.route("POST /billing", "packages/functions/src/billing.main");
