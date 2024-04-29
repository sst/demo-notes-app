/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "ion-notes",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const infra = await import("./infra");

    return {
      UserPool: infra.userPool.id,
      Region: aws.getRegionOutput().name,
      IdentityPool: infra.identityPool.id,
      UserPoolClient: infra.userPoolClient.id,
    };
  },
});
