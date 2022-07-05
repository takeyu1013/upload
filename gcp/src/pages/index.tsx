import type { NextPage } from "next";

import { useEffect, useState } from "react";
import { Storage, UploadOptions } from "@google-cloud/storage";

const Home: NextPage = () => {
  const [file, setFile] = useState<File | undefined>(undefined);

  return (
    <main>
      <input
        type="file"
        accept="image/png, image/jpg"
        onChange={(event) => {
          const { files } = event.target;
          if (!files) return;
          setFile(files[0]);
        }}
      />
      <button
        onClick={async () => {
          const storage = new Storage({
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
            keyFilename: "../../login-352313-6280095090fc.json",
          });
          const bucket = storage.bucket("bucket20220705");
          if (!file || !file.name) return;
          const bucketFile = bucket.file(file.name);

          const options = {
            expires: Date.now() + 1 * 60 * 1000,
            fields: { "x-goog-meta-test": "data" },
          };
          const [response] = await bucketFile.generateSignedPostPolicyV4(
            options
          );
          console.log(response);
        }}
      >
        Upload
      </button>
    </main>
  );
};

export default Home;
