/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "notes",
      removal: "remove",
      home: "aws",
    };
  },
  async run() {
    await import("./infra/api");
    await import("./infra/web");
    await import("./infra/storage");
    await import("./infra/auth");
  },
});
