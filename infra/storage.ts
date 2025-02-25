// Create an S3 bucket
export const bucket = new sst.aws.Bucket("Uploads");

// Create the DynamoDB users table
export const users = new sst.aws.Dynamo("Users", {
  fields: {
    userId: "string",
    email: "string",
  },
  primaryIndex: { hashKey: "userId" },
  globalIndexes: {
    emailIndex: { hashKey: "email" },
  },
});

// Create the DynamoDB notes table
export const notes = new sst.aws.Dynamo("Notes", {
  fields: {
    userId: "string",
    noteId: "string",
  },
  primaryIndex: { hashKey: "userId", rangeKey: "noteId" },
});

// Create a secret for Stripe
export const secret = new sst.Secret("StripeSecretKey");
