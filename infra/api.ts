import { table, secret } from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api")
api.route(
  "GET /notes",
  {
    handler: "packages/functions/src/list.main",
    link: [table, secret],
  },
  { auth: { iam: true } }
)
api.route(
  "POST /notes",
  {
    handler: "packages/functions/src/create.main",
    link: [table, secret],
  },
  { auth: { iam: true } }
)
api.route(
  "GET /notes/{id}",
  {
    handler: "packages/functions/src/get.main",
    link: [table, secret],
  },
  { auth: { iam: true } }
)
api.route(
  "PUT /notes/{id}",
  {
    handler: "packages/functions/src/update.main",
    link: [table, secret],
  },
  { auth: { iam: true } }
)
api.route(
  "DELETE /notes/{id}",
  {
    handler: "packages/functions/src/delete.main",
    link: [table, secret],
  },
  { auth: { iam: true } }
)
api.route(
  "POST /billing",
  {
    handler: "packages/functions/src/billing.main",
    link: [table, secret],
  },
  { auth: { iam: true } }
);
