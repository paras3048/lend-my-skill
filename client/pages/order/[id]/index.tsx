import { Button, Container, Group, Loader, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { ProfileCard } from "components/Dashboard/Profile";
import { MetaTags } from "components/Meta";
import { BACKEND_URL } from "constants/index";
import { URLGenerator } from "helpers";
import { readCookie } from "helpers/cookies";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import r from "dayjs/plugin/relativeTime";
dayjs.extend(r);

const payload = {
  order: {
    createdAt: "2022-09-03T07:59:04.428Z",
    price: "0",
    status: "incomplete",
    sellerId: "a6c9535e-0066-40d3-b6b0-4d93abfb9c7d",
    buyerId: "5441e4bc-9128-4da1-b2a0-f0c513e5c2ec",
  },
  secondParty: {
    name: "Gurpal",
    username: "gillsaab",
    profileURL:
      "images/public/1662136749702-b75f75bd-d250-4c98-8790-093cda9d0f5a-logo-transparent.png",
  },
};

export default function DetailedOrderInformation() {
  const { query, push } = useRouter();
  const [details, setDetails] = useState<undefined | typeof payload>(undefined);

  useEffect(() => {
    if (!query.type)
      return showNotification({
        message: "It Looks Like You've Entered The Wrong URL",
        color: "red",
        autoClose: 10000,
      });
    const cookie = readCookie("token")!;
    axios
      .get(`${BACKEND_URL}/orders/${query.type}/${query.id}`, {
        headers: {
          authorization: cookie,
        },
      })
      .then(({ data }) => {
        setDetails(data);
      })
      .catch((err) => {
        console.log(err);
        return showNotification({
          message: "An Error Occured",
          color: "red",
          autoClose: 10000,
        });
      });
  }, []);
  if (!query.id) return null;
  if (details === undefined)
    return (
      <div className={"flex min-h-screen items-center justify-center flex-col"}>
        <Loader variant="bars" color="teal" />
      </div>
    );
  return (
    <>
      <MetaTags description="" title="Order Details" />
      <Container mt="xl" className="flex flex-col items-center">
        <Title order={3} align="center">
          Order Details of Id: {query.id}
        </Title>
        <Text align="center" size="xl">
          Created: {dayjs(details.order.createdAt).fromNow()}
        </Text>
        <Text align="center" size="xl">
          Status:{" "}
          {details.order.status === "incomplete" ? "Incomplete" : "Complete"}
        </Text>
        <Text align="center" size="xl">
          Price: {details.order.price}
        </Text>
        <Text align="center" mt="xl" mb="lg">
          Information About The {query.type === "buyer" ? "Seller" : "Buyer"}
        </Text>
        <div onClick={() => push(`/u/${details.secondParty.username}`)}>
          {/*
 // @ts-ignore */}
          <ProfileCard
            username={details.secondParty.username}
            name={details.secondParty.name}
            profileURL={details.secondParty.profileURL}
            hideOtherDetails
          />
        </div>

        <Group position="center" mt="xl" mb="xl">
          <Button
            color="dark"
            className="customButton"
            onClick={() =>
              push({
                pathname: "/chat",
                query: {
                  type: query.type,
                  id: query.id,
                },
              })
            }
          >
            Open Order&apos;s Chat
          </Button>
        </Group>
      </Container>
    </>
  );
}
