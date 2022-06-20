import type { NextPage } from "next";
import type { User } from "firebase/auth";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { app } from "../firebase";

const Home: NextPage = () => {
  const auth = getAuth(app);
  const [name, setName] = useState<User["displayName"]>(null);
  const [image, setImage] = useState<User["photoURL"]>(null);
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setName(null);
        setImage(null);
        return;
      }
      setName(user.displayName);
      setImage(user.photoURL);
    });
    (async () => {
      setSrc(
        await getDownloadURL(
          ref(
            getStorage(),
            `gs://${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/images/image.jpg`
          )
        )
      );
    })();
  });

  return (
    <div>
      {!name ? (
        <button
          onClick={(event) => {
            event.preventDefault();
            signInWithRedirect(auth, new GoogleAuthProvider());
          }}
        >
          Login
        </button>
      ) : (
        <button
          onClick={(event) => {
            event.preventDefault();
            signOut(auth);
          }}
        >
          Logout
        </button>
      )}
      <p>{name}</p>
      <div>
        {image && (
          <Image
            loader={({ src }) => {
              return src;
            }}
            src={image}
            alt="image"
            width={100}
            height={100}
          />
        )}
      </div>
      <div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(event) => {
            event.preventDefault();
            const { files } = event.target;
            if (!files) {
              return;
            }
            setFile(files[0]);
          }}
        />
      </div>
      <button
        onClick={(event) => {
          event.preventDefault();
          if (!file) {
            return;
          }
          uploadBytes(ref(getStorage(), "images/image.jpg"), file);
        }}
      >
        Upload
      </button>
      <div>
        <Image
          src={(file && URL.createObjectURL(file)) || "/no_image.png"}
          alt="No Image"
          width={100}
          height={100}
          unoptimized
        />
      </div>
      <div>
        <Image
          src={src || "/no_image.png"}
          alt="image"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
};

export default Home;
