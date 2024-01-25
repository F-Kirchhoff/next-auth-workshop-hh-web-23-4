import { useSession, signIn, signOut } from "next-auth/react";
import { StyledButton } from "./StyledButton";

export default function Login() {
  const session = useSession();

  if (session.status === "authenticated") {
    return (
      <>
        <pre>{JSON.stringify(session.data, null, 2)}</pre>
        <p>Logged in as {session.data.user.name}</p>
        <img src={session.data.user.image} alt="" style={{ width: "100px" }} />
        <StyledButton onClick={() => signOut()}>Sign out</StyledButton>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <StyledButton onClick={() => signIn()}>Sign in</StyledButton>
    </>
  );
}
