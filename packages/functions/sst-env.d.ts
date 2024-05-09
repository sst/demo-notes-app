/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Notes: {
      name: string
      type: "sst.aws.Dynamo"
    }
    StripeSecretKey: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
export {}