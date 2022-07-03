import type { NextPage } from "next";
import { useState } from "react";

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
      <button onClick={() => {}}>Upload</button>
    </main>
  );
};

export default Home;
