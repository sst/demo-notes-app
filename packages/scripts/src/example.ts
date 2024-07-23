import { Resource } from "sst";
import { Example } from "@demo-notes-app/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
