import "sst"
declare module "sst" {
  export interface Resource {
    Notes: {
      name: string
      type: "sst.aws.Dynamo"
    }
    StripeSecretKey: {
      value: string
      type: "sst.sst.Secret"
    }
  }
}
export {}