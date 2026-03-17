import { z } from "zod";
import AWS from "aws-sdk";
import { Resource } from "sst";
import { create } from "opencontrol";
import { tool } from "opencontrol/tool";
import { tools } from "sst/opencontrol";
import { handle } from "hono/aws-lambda";
import { createAnthropic } from "@ai-sdk/anthropic";


const aws = tool({
  name: "aws",
  description: "Make a call to the AWS SDK for JavaScript v2",
  args: z.object({
    client: z.string().describe("Class name of the client to use"),
    command: z.string().describe("Command to call on the client"),
    args: z
      .record(z.string(), z.any())
      .optional()
      .describe("Arguments to pass to the command"),
  }),
  async run(input) {
    // @ts-ignore
    const client = new AWS[input.client]();
    return await client[input.command](input.args).promise();
  },
});

const stripe = tool({
  name: "stripe",
  description: "make a call to the stripe api",
  args: z.object({
    method: z.string().describe("HTTP method to use"),
    path: z.string().describe("Path to call"),
    query: z.record(z.string()).optional().describe("Query params"),
    contentType: z.string().optional().describe("HTTP content type to use"),
    body: z.string().optional().describe("HTTP body to use if it is not GET"),
  }),
  async run(input) {
    const url = new URL("https://api.stripe.com" + input.path);
    if (input.query) url.search = new URLSearchParams(input.query).toString();
    const response = await fetch(url.toString(), {
      method: input.method,
      headers: {
        Authorization: `Bearer ${Resource.Stripe.secretKey}`,
        ...(input.contentType ? { Authorization: "Content-Type" } : undefined),
      },
      body: input.body ? input.body : undefined,
    });
    if (!response.ok) throw new Error(await response.text());
    return response.text();
  },
});

const app = create({
  model: createAnthropic({
    apiKey: Resource.AnthropicKey.value,
  })("claude-3-7-sonnet-20250219"),
  tools: [aws, stripe],
});

export const handler = handle(app);
