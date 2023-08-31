import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";

export const main = handler(async (event) => {
  const params = {
    TableName: Table.Notes.tableName,
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      noteId: event?.pathParameters?.id, // The id of the note from the path
    },
  };

  await dynamoDb.delete(params);

  return JSON.stringify({ status: true });
});
