import type { NextPage } from "next";

import Image from "next/image";
import { useState } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { useAuth, useSignIn, useUser } from "@clerk/nextjs";

const Home: NextPage = () => {
  const { signIn } = useSignIn();
  const { signOut } = useAuth();
  const { user, isSignedIn } = useUser();
  const [file, setFile] = useState<File | undefined>(undefined);

  return (
    <div>
      {isSignedIn ? (
        <div>
          <button
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </button>
          <p>{user.fullName}</p>
          <div>
            <Image
              src={user.profileImageUrl}
              alt="image"
              width={100}
              height={100}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            signIn?.authenticateWithRedirect({
              strategy: "oauth_google",
              redirectUrl: "/",
              redirectUrlComplete: "/",
            });
          }}
        >
          Login
        </button>
      )}
      <div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(event) => {
            const { files } = event.target;
            if (!files) {
              return;
            }
            setFile(files[0]);
          }}
        />
      </div>
      <button
        onClick={async () => {
          if (!file) {
            return;
          }
          const name = encodeURIComponent(file.name);
          const type = encodeURIComponent(file.type);
          const client = new S3Client({
            region: "ap-northeast-1",
            credentials: {
              accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY as string,
              secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY as string,
            },
          });

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
    </div>
  );
};

export default Home;
