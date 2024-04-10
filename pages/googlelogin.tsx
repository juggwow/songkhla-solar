import { getSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function GoogleLogin() {
  useEffect(() => {
    signIn("google", { callbackUrl: "/" });
    return;
  }, []);
  return <div>sign in...</div>;
}
