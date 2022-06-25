import { useAuth, useSignIn, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Image from "next/image";

const Home: NextPage = () => {
  const { signIn } = useSignIn();
  const { signOut } = useAuth();
  const { user, isSignedIn } = useUser();

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
    </div>
  );
};

export default Home;
