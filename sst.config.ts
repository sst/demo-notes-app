/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "notes",
      removal: "remove",
      home: "aws",
      providers: { stripe: "0.0.24" },
    };
  },
  async run() {
    await import("./infra/storage");
    await import("./infra/billing");
    await import("./infra/auth");
    await import("./infra/api");
    await import("./infra/web");
  },
});
