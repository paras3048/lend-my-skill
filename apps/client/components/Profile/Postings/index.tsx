import { Button, Group, Spoiler, Text } from "@mantine/core";
import { GetFilteredHTML } from "helpers";
import styles from "./posting.module.scss";
import dashboardStyles from "styles/scss/dashboard.module.scss";
import Link from "next/link";
import { useUser } from "hooks/useUser";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "constants/index";
import { showNotification } from "@mantine/notifications";

dayjs.extend(relative);

interface PostingsTypes {
  postings: {
    id: string;
    description: string;
    title: string;
    postedAt: string;
    slugifiedTitle: string;
  }[];
}

export function Postings(props: PostingsTypes) {
  const [postings, setPostings] = useState(props.postings);
  const { query } = useRouter();
  const [skip, setSkip] = useState(0);
  const [showButton, setShowButton] = useState(postings.length === 5);
  const refetchPostings = () => {
    axios
      .get(
        `${BACKEND_URL}/postings/fetch/${query.username}/all?take=5&skip=${
          skip + 5
        }`
      )
      .then(({ data }) => data)
      .then((d) => {
        if (d.length < 5) {
          setShowButton(false);
        }
        setPostings((old) => [...old, ...d]);
        setSkip((n) => n + 5);
      })
      .catch((err) => {
        return showNotification({
          message: err.response?.data?.message || "An Error Occured",
          color: "red",
          autoClose: 4000,
        });
      });
  };

  const {
    user: { username },
  } = useUser();
  return (
    <>
      {props.postings !== undefined && props.postings.length > 0 ? (
        <>
          {postings.map((post) => (
            <div key={post.id} className={styles.container}>
              <Link
                passHref
                href={`/u/${query.username}/${post.slugifiedTitle}`}
              >
                <a className={styles.title}>{post.title}</a>
              </Link>
              <Spoiler maxHeight={50} showLabel="Expand" hideLabel="Collapse">
                <p
                  className={`${styles.description} ${dashboardStyles.markdown}`}
                  dangerouslySetInnerHTML={{
                    __html: GetFilteredHTML(post.description),
                  }}
                ></p>
              </Spoiler>
              <p className={styles.date}>
                Posted {dayjs(post.postedAt).fromNow()}
              </p>
            </div>
          ))}
          {showButton ? (
            <Group position="center" mt="xl" mb="xl">
              <Button
                color="dark"
                className="customButton"
                onClick={refetchPostings}
              >
                Load More
              </Button>
            </Group>
          ) : null}
        </>
      ) : (
        <Text>No Posting Available By The User.</Text>
      )}
    </>
  );
}
