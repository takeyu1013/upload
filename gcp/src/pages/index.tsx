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
          const fileName = "imgfile2";
          const res = await fetch(`/api/upload?file=${fileName}`);
          const { url, fields } = await res.json();
          if (!file) return;
          const body = new FormData();
          Object.entries({ ...fields, file }).forEach(([key, value]) => {
            body.append(key, value as string | Blob);
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
