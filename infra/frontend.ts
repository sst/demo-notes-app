import { api } from "./api";
import { bucket } from "./storage";
import { userPool, identityPool, userPoolClient } from "./auth";

const region = aws.getRegionOutput().name;

export const web = new sst.aws.StaticSite("Web", {
  path: "packages/frontend",
  build: {
    command: "npm run build",
    output: "packages/frontend/dist",
  },
  domain: $app.stage === "prod" ? "demo.sst.dev" : undefined,
  environment: {
    VITE_REGION: region,
    VITE_API_URL: api.url,
    VITE_BUCKET: bucket.name,
    VITE_USER_POOL_ID: userPool.id,
    VITE_IDENTITY_POOL_ID: identityPool.id,
    VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
  },
});

