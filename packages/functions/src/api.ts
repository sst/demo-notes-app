import { Hono } from "hono";
import { Resource } from "sst";
import { subjects } from "./subjects";
import { Util } from "@notes/core/util";
import { handle } from "hono/aws-lambda";
import { Notes } from "@notes/core/notes";
import { Users } from "@notes/core/users";
import { Billing } from "@notes/core/billing";
import { bearerAuth } from "hono/bearer-auth";
import { createClient } from "@openauthjs/openauth/client";

export type Variables = {
  userId: string;
}

const client = createClient({
  clientID: "jwt-api",
  issuer: Resource.Auth.url,
});

const app = new Hono<{ Variables: Variables }>();

app.use(bearerAuth({
  verifyToken: async (token, c) => {
    const verified = await client.verify(subjects, token);

    if (verified.err) {
      return false;
    }

    c.set("userId", verified.subject.properties.id);

    return true;
  }
}));

app.get("/me", async (c) => {
  return c.json(await Users.getById(c.get("userId")));
});

app.get("/notes", async (c) => {
  return c.json(await Notes.list(c.get("userId")));
});

app.post("/notes", async (c) => {
  const body = await c.req.json();
  return c.json(await Notes.create(c.get("userId"), body.content, body.attachment));
});

app.get("/notes/:id", async (c) => {
  return c.json(await Notes.get(c.get("userId"), c.req.param("id")));
});

app.put("/notes/:id", async (c) => {
  const body = await c.req.json();
  await Notes.update(
    c.get("userId"),
    c.req.param("id"),
    body.content,
    body.attachment
  );

  return c.json({ status: true });
});

app.delete("/notes/:id", async (c) => {
  await Notes.remove(c.get("userId"), c.req.param("id"));

  return c.json({ status: true });
});

app.post("/billing", async (c) => {
  const body = await c.req.json();
  await Billing.charge(body.storage, body.source);

  return c.json({ status: true });
});

app.get("/presign", async (c) => {
  const path = c.req.query("path") ?? "";
  return c.json(await Util.presignDownload(path));
});

app.post("/presign", async (c) => {
  const body = await c.req.json();
  const res = await Util.presignUpload(c.get("userId"), body.fileName, body.fileType);

  return c.json(res);
});

export const handler = handle(app);
