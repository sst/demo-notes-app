import * as uuid from "uuid";
import { Resource } from "sst";
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export module Notes {

  export async function create(userId: string, content: string, attachment: string) {
    const params = {
      TableName: Resource.Notes.name,
      Item: {
        userId,
        content,
        attachment,
        noteId: uuid.v1(),
        createdAt: Date.now(),
      },
    };

    await dynamoDb.send(new PutCommand(params));

    return params.Item;
  }

  export async function get(userId: string, noteId: string) {
    const params = {
      TableName: Resource.Notes.name,
      Key: {
        userId,
        noteId,
      },
    };

    const result = await dynamoDb.send(new GetCommand(params));
    if (!result.Item) {
      throw new Error("Item not found.");
    }

    return result.Item;
  }

  export async function remove(userId: string, noteId: string) {
    const params = {
      TableName: Resource.Notes.name,
      Key: {
        userId: userId,
        noteId: noteId,
      },
    };

    await dynamoDb.send(new DeleteCommand(params));
  }

  export async function list(userId: string) {
    const params = {
      TableName: Resource.Notes.name,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const result = await dynamoDb.send(new QueryCommand(params));

    return result.Items;
  }

  export async function update(
    userId: string, noteId: string, content: string, attachment: string
  ) {
    const params = {
      TableName: Resource.Notes.name,
      Key: {
        userId,
        noteId,
      },
      UpdateExpression: "SET content = :content, attachment = :attachment",
      ExpressionAttributeValues: {
        ":content": content,
        ":attachment": attachment,
      },
    };

    await dynamoDb.send(new UpdateCommand(params));
  }

}
