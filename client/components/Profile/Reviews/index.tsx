import {
  Group,
  Text,
  Button,
  Modal,
  NumberInput,
  TextInput,
  Avatar,
  Spoiler,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { StarRating } from "components/Stars";
import { BACKEND_URL } from "constants/index";
import { GetFilteredHTML } from "helpers";
import { readCookie } from "helpers/cookies";
import { useUser } from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Reviews } from "types";

interface Props {
  User: {
    username: string;
    profileURL: string;
  };
  message: string;
  id: string;
}

export function Reviews(props: { reviews: Props[] }) {
  const { user } = useUser();
  const { query } = useRouter();
  const [modalOpened, setModalOpened] = useState(false);
  const [reviews, setReviews] = useState<Reviews["reviews"]>([]);
  const form = useForm({
    initialValues: {
      message: "",
      stars: 1,
    },
    validate: {
      message: (m) =>
        m.length <= 20 ? "Your Review Should Be More Than 20 Characters" : null,
      stars: (c) =>
        c <= 0
          ? "Rating Can't be 0 or Negative"
          : c > 5
          ? "Rating Can't Exceed 5 Stars"
          : null,
    },
  });

  const createReview = async (data: typeof form.values) => {
    const cookie = readCookie("token");
    if (!cookie)
      return showNotification({
        message: "No Authentication Token Found",
        color: "red",
        autoClose: 5000,
      });
    axios
      .post(
        `${BACKEND_URL}/reviews/create`,
        {
          message: data.message,
          stars: data.stars,
          username: query.username,
        },
        {
          headers: {
            authorization: cookie!,
          },
        }
      )
      .then(({ data }) => data)
      .then(() => {
        return showNotification({
          message: "Thanks For Your Review",
          color: "green",
          autoClose: 5000,
        });
      })
      .catch((err) => {
        console.log(err);
        return showNotification({
          message: err.response?.data?.message || "An Error Occured",
          color: "red",
          autoClose: 5000,
        });
      });
    fetchReviews();
    setModalOpened(false);
  };

  const fetchReviews = () => {
    if (!query.username) return;
    axios
      .get(`${BACKEND_URL}/reviews/${query.username}`)
      .then(({ data }) => data.reviews)
      .then(setReviews)
      .catch((err) => {
        console.log(err);
        return showNotification({
          message: err.response?.data?.messsage || "An Error Occured",
          color: "red",
          autoClose: 5000,
        });
      });
  };
  useEffect(() => {
    fetchReviews();
  }, [query.username]);

  return (
    <>
      {user.username && query.username !== user.username ? (
        <Group position="center" mt="xl">
          <Button
            color="dark"
            className="customButton"
            onClick={() => setModalOpened((O) => !O)}
          >
            Post A Review
          </Button>
        </Group>
      ) : null}
      {reviews && reviews.length > 0 ? (
        <>
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex flex-col pb-4"
              style={{
                borderBottom: "1px solid gray",
                borderBottomWidth: "1px",
                borderBottomStyle: "dotted",
              }}
            >
              <div className="flex flex-row items-center flex-wrap">
                <Avatar
                  size={50}
                  radius={50}
                  src={`/api/${r.creator.profileURL}`}
                />
                <div className="flex flex-col">
                  <span className="ml-4">{r.creator.username}</span>
                  <span className="ml-4">
                    <StarRating rating={r.stars} />
                  </span>
                </div>
              </div>
              <Spoiler hideLabel="Collapse" maxHeight={150} showLabel="Expand">
                <p
                  className="ml-15"
                  dangerouslySetInnerHTML={{
                    __html: GetFilteredHTML(r.message),
                  }}
                />
              </Spoiler>
            </div>
          ))}
        </>
      ) : (
        <Text>No Reviews Available.</Text>
      )}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened((o) => !o)}
        centered
      >
        <form onSubmit={form.onSubmit((e) => createReview(e))}>
          <NumberInput
            label="Rating"
            required
            {...form.getInputProps("stars")}
          />
          <TextInput
            required
            label="Review"
            {...form.getInputProps("message")}
          />

          <Group position="center" mt="xl">
            <Button color="dark" className="customButton" type="submit">
              Post A Review
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
