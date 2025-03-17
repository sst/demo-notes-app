import { Hono } from "hono";
import Stripe from "stripe";
import { Util } from "@notes/core/util";
import { handle } from "hono/aws-lambda";
import { Notes } from "@notes/core/notes";
import { Users } from "@notes/core/users";
import { auth, makePrivate } from "./auth";
import { Billing } from "@notes/core/billing";

export type Variables = {
  userId?: string;
}

const privateRoutes = new Hono<{ Variables: Variables }>()
  .use(makePrivate)
  .get("/me", async (c) => {
    return c.json(await Users.getById(c.get("userId")!));
  })
  .get("/notes", async (c) => {
    return c.json(await Notes.list(c.get("userId")!));
  })
  .post("/notes", async (c) => {
    const body = await c.req.json();
    return c.json(
      await Notes.create(c.get("userId")!, body.content, body.attachment)
    );
  })
  .get("/notes/:id", async (c) => {
    return c.json(await Notes.get(c.get("userId")!, c.req.param("id")));
  })
  .put("/notes/:id", async (c) => {
    const body = await c.req.json();
    await Notes.update(
      c.get("userId")!,
      c.req.param("id"),
      body.content,
      body.attachment || null
    );

    return c.json({ status: true });
  })
  .delete("/notes/:id", async (c) => {
    await Notes.remove(c.get("userId")!, c.req.param("id"));
    return c.json({ status: true });
  })
  .post("/checkout", async (c) => {
    const body = await c.req.json();
    const url = await Billing.initCheckout(
      c.get("userId")!, body.units, body.redirect
    );

    return c.json({ url });
  })
  .get("/presign", async (c) => {
    const path = c.req.query("path") ?? "";
    return c.json(await Util.presignDownload(path));
  })
  .post("/presign", async (c) => {
    const body = await c.req.json();
    const res = await Util.presignUpload(
      c.get("userId")!, body.fileName, body.fileType
    );

    return c.json(res);
  });

const publicRoutes = new Hono<{ Variables: Variables }>()
  .post("/webhook", async (c) => {
    const rawBody = Buffer.from(await c.req.arrayBuffer());
    const sig = c.req.header("Stripe-Signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET!;
    const event = Stripe.webhooks.constructEvent(rawBody, sig!, secret);
    const subscription = event.data.object as Stripe.Subscription;

    await Billing.createCustomer(subscription);

    return c.json({ status: true });
  });

const app = new Hono<{ Variables: Variables }>()
  .use(auth)
  .route("/", publicRoutes)
  .route("/", privateRoutes);

export const handler = handle(app);
