import { users, notes, secret, bucket } from "./storage";
import { auth } from "./auth";

// Create the API
export const api = new sst.aws.Function("Api", {
  url: true,
  link: [auth, users, notes, secret, bucket],
  handler: "packages/functions/src/api.handler",
});
//
// export const api = new sst.aws.ApiGatewayV2("Api", {
//   transform: {
//     route: {
//       handler: {
//         link: [users, notes, secret],
//       },
//       args: {
//         auth: { iam: true }
//       },
//     }
//   }
// });
//
// api.route("GET /notes", "packages/functions/src/list.main");
// api.route("POST /notes", "packages/functions/src/create.main");
// api.route("GET /notes/{id}", "packages/functions/src/get.main");
// api.route("PUT /notes/{id}", "packages/functions/src/update.main");
// api.route("DELETE /notes/{id}", "packages/functions/src/delete.main");
// api.route("POST /billing", "packages/functions/src/billing.main");
