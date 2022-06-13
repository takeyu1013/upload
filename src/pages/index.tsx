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

import { app } from "../firebase";
import Image from "next/image";

const Home: NextPage = () => {
  const auth = getAuth(app);
  const [name, setName] = useState<User["displayName"]>(null);
  const [image, setImage] = useState<User["photoURL"]>("/vercel.svg");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setName(user && user.displayName);
      setImage(user && user?.photoURL);
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
      <p>{name}</p>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={(event) => {
          event.preventDefault();
          if (!event.target.files) {
            return;
          }
          setImage(window.URL.createObjectURL(event.target.files[0]));
        }}
      />
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
  );
};

export default Home;
