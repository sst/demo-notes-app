import { Context, APIGatewayProxyEvent } from "aws-lambda";

export module Util {
  export function handler(
    lambda: (evt: APIGatewayProxyEvent, context: Context) => Promise<string>
  ) {
    return async function(event: APIGatewayProxyEvent, context: Context) {
      let body: string, statusCode: number;

      try {
        // Run the Lambda
        body = await lambda(event, context);
        statusCode = 200;
      } catch (error) {
        statusCode = 500;
        body = JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
        });
      }

      // Return HTTP response
      return {
        body,
        statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      };
    };
  }
}
