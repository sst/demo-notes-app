import { api } from "./api";
import { bucket } from "./storage";

const region = aws.getRegionOutput().name;

export const userPool = new sst.aws.CognitoUserPool("MyUserPool", {
  usernames: ["email"]
});

export const userPoolClient = userPool.addClient("MyUserPoolClient");

export const identityPool = new sst.aws.CognitoIdentityPool("MyIdentityPool", {
  userPools: [
    {
      userPool: userPool.id,
      client: userPoolClient.id,
    },
  ],
  permissions: {
    authenticated: [
      {
        actions: ["s3:*"],
        resources: [
          $concat(bucket.arn, "/private/${cognito-identity.amazonaws.com:sub}/*"),
        ],
      },
      {
        actions: [
          "execute-api:*",
        ],
        resources: [
          $concat(
            "arn:aws:execute-api:",
            region,
            ":",
            aws.getCallerIdentityOutput({}).accountId,
            ":",
            api.nodes.api.id,
            "/*/*/*"
          ),
        ],
      },
    ],
  },
});
