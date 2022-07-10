import type { NextPage } from "next";

import { useState } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const Home: NextPage = () => {
  const [file, setFile] = useState<File | undefined>(undefined);

  return (
    <main>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={(event) => {
          const { files } = event.target;
          if (!files) return;
          setFile(files[0]);
        }}
      />
      <button
        onClick={async () => {
          if (!file) return;
          const accessKeyId = process.env.NEXT_PUBLIC_ACCESS_KEY_ID;
          const secretAccessKey = process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY;
          if (!accessKeyId) return;
          if (!secretAccessKey) return;
          const client = new S3Client({
            region: "auto",
            endpoint: "https://storage.googleapis.com",
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          });
          console.log(process.env.NEXT_PUBLIC_BUCKET_NAME);
          console.log(process.env.NEXT_PUBLIC_ACCESS_KEY_ID);
          console.log(process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY);

          const name = encodeURIComponent(file.name);
          const type = encodeURIComponent(file.type);
          const output = await client.send(
            new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
              Key: name,
              ContentType: type,
              Body: file,
            })
          );
          console.log(output);
        }}
      >
        Upload
      </button>
    </main>
  );
};

export default Home;
