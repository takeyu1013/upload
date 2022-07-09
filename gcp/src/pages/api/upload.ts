import { Storage } from "@google-cloud/storage";

export default async function handler(req: any, res: any) {
  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
  const bucket = storage.bucket(process.env.BUCKET_NAME ?? "");
  const file = bucket.file(req.query.file);
  const [response] = await file.generateSignedPostPolicyV4({
    expires: Date.now() + 1 * 60 * 1000,
    fields: { "x-goog-meta-test": "data" },
  });
  res.status(200).json(response);
}
