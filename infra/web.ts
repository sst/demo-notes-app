import { api } from "./api";
import { auth } from "./auth";
import { bucket } from "./storage";
import { domain } from "./constants";

const region = aws.getRegionOutput().name;

export const frontend = new sst.aws.StaticSite("Frontend", {
  domain,
  path: "packages/frontend",
  build: {
    output: "dist",
    command: "npm run build",
  },
  environment: {
    VITE_REGION: region,
    VITE_API_URL: api.url,
    VITE_AUTH_URL: auth.url,
    VITE_BUCKET: bucket.name,
  },
});
