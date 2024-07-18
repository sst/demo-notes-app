/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Api: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
    MyIdentityPool: {
      id: string
      type: "sst.aws.CognitoIdentityPool"
    }
    MyUserPool: {
      id: string
      type: "sst.aws.CognitoUserPool"
    }
    MyUserPoolClient: {
      id: string
      secret: string
      type: "sst.aws.CognitoUserPoolClient"
    }
    Notes: {
      name: string
      type: "sst.aws.Dynamo"
    }
    StripeSecretKey: {
      type: "sst.sst.Secret"
      value: string
    }
    Uploads: {
      name: string
      type: "sst.aws.Bucket"
    }
    Web: {
      type: "sst.aws.StaticSite"
      url: string
    }
  }
}
export {}
