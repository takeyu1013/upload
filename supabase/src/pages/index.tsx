import type { NextPage } from "next";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image";

const Home: NextPage = () => {
  const auth = supabase.auth;
  const [email, setEmail] = useState<User["email"]>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email);
    });
    setEmail(auth.user()?.email);
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
