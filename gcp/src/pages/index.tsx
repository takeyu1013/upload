import type { NextPage } from "next";

import { useState } from "react";

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
          const res = await fetch(`/api/upload?file=image`);
          const { url, fields } = await res.json();
          if (typeof url !== "string") return;
          const body = new FormData();
          Object.entries({ ...fields, file }).forEach(([key, value]) => {
            if (typeof value !== "string" && !(value instanceof Blob)) return;
            body.append(key, value);
          });
          const upload = await fetch(url, { method: "POST", body });
          console.log(upload);
        }}
      >
        Upload
      </button>
    </main>
  );
};

export default Home;
