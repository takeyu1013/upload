import type { NextPage } from "next";

import { useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";

import { app } from "../firebase";
import Image from "next/image";

const Home: NextPage = () => {
  const auth = getAuth(app);
  const [name, setName] = useState<User["displayName"]>(null);
  const [image, setImage] = useState<User["photoURL"]>(null);

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
      <div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(event) => {
            event.preventDefault();
            if (!event.target.files) {
              return;
            }
            const file = event.target.files[0];
            setImage(window.URL.createObjectURL(file));
            uploadBytes(ref(getStorage(), "image"), file);
          }}
        />
      </div>
      <p>{name}</p>
      <div>
        {image && (
          <Image
            loader={() => {
              return image;
            }}
            src={image}
            alt="image"
            width={100}
            height={100}
          />
        )}
      </div>
      <button
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        Upload
      </button>
    </div>
  );
};

export default Home;
