import { uploadData } from "aws-amplify/storage";

export async function s3Upload(file: File) {
  const filename = `${Date.now()}-${file.name}`;

  const result = await uploadData({
    path: `private/${filename}`,
    data: file,
    options: {
      contentType: file.type,
    },
  }).result;

  return result.path;
}
