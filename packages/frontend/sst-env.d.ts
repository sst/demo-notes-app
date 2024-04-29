import "sst"
declare module "sst" {
  export interface Resource {
    StripeSecretKey: {
      type: "sst.sst.Secret"
      value: string
    }
    Notes: {
      name: string
      type: "sst.aws.Dynamo"
    }
  }
}
export {}