import "sst"
declare module "sst" {
  export interface Resource {
    StripeSecretKey: {
      type: "sst.sst.Secret"
      value: string
    }
    Notes: {
      type: "sst.aws.Dynamo"
      name: string
    }
  }
}
export {}