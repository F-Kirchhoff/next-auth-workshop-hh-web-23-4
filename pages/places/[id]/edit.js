import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import Form from "../../../components/Form.js";
import { StyledLink } from "../../../components/StyledLink.js";
import { useSession } from "next-auth/react";

export default function EditPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;
  const { data: place, isLoading, error } = useSWR(`/api/places/${id}`);
  const session = useSession();

  async function editPlace(place) {
    await fetch(`/api/places/${id}`, {
      method: "PATCH",
      body: JSON.stringify(place),
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push("/");
  }

  if (session.status !== "authenticated") {
    return <h1>Noth Authorized</h1>;
  }

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  return (
    <>
      <h2 id="edit-place">Edit Place</h2>
      <Link href={`/places/${id}`} passHref legacyBehavior>
        <StyledLink $justifySelf="start">back</StyledLink>
      </Link>
      <Form onSubmit={editPlace} formName={"edit-place"} defaultData={place} />
    </>
  );
}
