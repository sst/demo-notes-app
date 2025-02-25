import * as uuid from "uuid";
import { Resource } from "sst";
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export module Users {

  export async function create(email: string) {
    const params = {
      TableName: Resource.Users.name,
      Item: {
        email,
        userId: uuid.v1(),
        createdAt: Date.now(),
      },
    };

    await dynamoDb.send(new PutCommand(params));

    return params.Item;
  }

  export async function getById(userId: string) {
    const params = {
      TableName: Resource.Users.name,
      Key: {
        userId,
      },
    };

    const result = await dynamoDb.send(new GetCommand(params));
    if (!result.Item) {
      throw new Error("User not found.");
    }

    return result.Item;
  }

  export async function getByEmail(email: string) {
    const command = new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: "emailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    });

    const result = await dynamoDb.send(command);

    if (!result.Items || result.Items.length === 0) {
      throw new Error("User not found.");
    }

    return result.Items[0];
  }

}
