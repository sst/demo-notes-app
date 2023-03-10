import { Template } from "aws-cdk-lib/assertions";
import { initProject } from "sst/project";
import { App, getStack } from "sst/constructs";
import { StorageStack } from "../StorageStack";
import { it } from "vitest";

it("Test StorageStack", async () => {
  await initProject({});
  const app = new App({ mode: "deploy" });
  // WHEN
  app.stack(StorageStack);
  // THEN
  const template = Template.fromStack(getStack(StorageStack));
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST",
  });
});