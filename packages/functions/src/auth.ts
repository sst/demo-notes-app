import { Resource } from "sst";
import { handle } from "hono/aws-lambda";
import { Users } from "@notes/core/users";
import { issuer } from "@openauthjs/openauth";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import type { Theme } from "@openauthjs/openauth/ui/theme"
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const MyTheme: Theme = {
  title: "Scratch",
  favicon: `${process.env.FRONTEND_URL}/favicon.ico`,
  logo: `${process.env.FRONTEND_URL}/apple-touch-icon.png`,
  font: {
    scale: "1.14",
    family: "Noto Sans, sans-serif",
  },
  radius: "lg",
  primary: "oklch(0.6 0.118 184.703995)",
  css: `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');`
};

const client = new SESv2Client();

async function getUserId(email: string) {
  let user;

  try {
    user = await Users.getByEmail(email);
  } catch (e) {
    user = await Users.create(email);
  }

  return user.userId;
}

const app = issuer({
  // Remove after setting custom domain
  allow: async () => true,
  theme: MyTheme,
  providers: {
    code: CodeProvider(
      CodeUI({
        sendCode: async (claims, code) => {
          const content = {
            Simple: {
              Subject: { Data: "Notes App Pin Code" },
              Body: {
                Text: { Data: `Your Notes app pin code: ${code}` },
              },
            }
          };
          await client.send(
            new SendEmailCommand({
              FromEmailAddress: Resource.Email.sender,
              Destination: {
                ToAddresses: [claims.email],
              },
              Content: content,
            })
          );
        },
      }),
    ),
  },
  success: async (ctx, value) => {
    if (value.provider === "code") {
      const userId = await getUserId(value.claims.email);

      return ctx.subject("user", userId, { id: userId });
    }
    throw new Error("Invalid provider");
  },
});

export const handler = handle(app);
