import { Resource } from "sst";
import { subjects } from "../subjects";
import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { createClient } from "@openauthjs/openauth/client";

const client = createClient({
  subjects,
  clientID: "jwt-api",
  issuer: Resource.Auth.url,
});

export const auth: MiddlewareHandler = async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (token) {
    const verified = await client.verify(token);

    if (!verified.err) {
      c.set("userId", verified.subject.properties.id);
    }
  }

  await next();
};

export const makePrivate: MiddlewareHandler = async (c, next) => {
  if (!c.get("userId")) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  await next();
};
