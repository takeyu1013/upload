import type { NextPage } from "next";
import type { Session, User } from "@supabase/supabase-js";

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image";

const Home: NextPage = () => {
  const auth = supabase.auth;
  const [email, setEmail] = useState<User["email"]>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined);
  const setStates = (user: Session["user"]) => {
    setEmail(user?.email);
    setImage(user?.user_metadata.picture);
  };

  useEffect(() => {
    auth.onAuthStateChange((_event, session) => {
      const user = session && session.user;
      setStates(user);
    });
    const user = auth.user();
    setStates(user);
  }, [auth]);

  return (
    <div>
      {!email ? (
        <button
          onClick={(event) => {
            event.preventDefault();
            auth.signIn({ provider: "google" });
          }}
        >
          Login
        </button>
      ) : (
        <button
          onClick={(event) => {
            event.preventDefault();
            auth.signOut();
          }}
        >
          Logout
        </button>
      )}
      <p>{email}</p>
      <div>
        {image && <Image src={image} alt="image" width={100} height={100} />}
      </div>
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
      <div>
        <Image
          src={(file && URL.createObjectURL(file)) || "/no_image.png"}
          alt="No Image"
          width={100}
          height={100}
        />
      </div>
      <button
        onClick={async (event) => {
          event.preventDefault();
          if (!file) {
            return;
          }
          const { error } = await supabase.storage
            .from("images")
            .upload("public/image.png", file);
          console.log(error);
        }}
      >
        Upload
      </button>
    </div>
  );
};

export default Home;
