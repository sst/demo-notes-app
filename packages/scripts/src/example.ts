import { Resource } from "sst";
import { Example } from "@monorepo-template/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
