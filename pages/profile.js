import styled from "styled-components";
import Card from "../components/Card.js";
import useSWR from "swr";
import Link from "next/link.js";
import { StyledLink } from "../components/StyledLink.js";
import { useSession } from "next-auth/react";

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-left: 0;
`;

const ListItem = styled.li`
  position: relative;
  width: 100%;
`;
const FixedLink = styled(StyledLink)`
  position: fixed;
  bottom: 50px;
  right: 50px;
`;
export default function Home() {
  const { data } = useSWR("/api/places", { fallbackData: [] });
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";

  if (!isLoggedIn) {
    return <h1>Not Authorized!</h1>;
  }

  if (!data) {
    return <h1>loading...</h1>;
  }

  const userPlaces = data.filter(
    (place) => place.author === session.data.user.name
  );

  return (
    <>
      <List role="list">
        {userPlaces.map((place) => {
          return (
            <ListItem key={place._id}>
              <Card
                name={place.name}
                image={place.image}
                location={place.location}
                id={place._id}
                author={place.author}
              />
            </ListItem>
          );
        })}
      </List>
      <Link href="/create" passHref legacyBehavior>
        <FixedLink>+ place</FixedLink>
      </Link>
    </>
  );
}
