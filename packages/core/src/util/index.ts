import { Resource } from "sst";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export module Util {

  export async function presignDownload(fileName: string) {
    const command = new GetObjectCommand({
      Key: fileName,
      Bucket: Resource.Uploads.name,
    });

    return {
      url: await getSignedUrl(new S3Client({}), command)
    };
  }

  export async function presignUpload(
    userId: string, fileName: string, fileType: string
  ) {
    const path = `${userId}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Key: path,
      ContentType: fileType,
      Bucket: Resource.Uploads.name,
    });

    return {
      path,
      url: await getSignedUrl(new S3Client({}), command),
    };
  }

}
