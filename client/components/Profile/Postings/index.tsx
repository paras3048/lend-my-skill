import { Spoiler, Text } from "@mantine/core";
import { GetFilteredHTML } from "helpers";
import styles from "./posting.module.scss";
import dashboardStyles from "styles/scss/dashboard.module.scss";
import Link from "next/link";
import { useUser } from "hooks/useUser";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";

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
  const { postings } = props;
  const { query } = useRouter();
  const {
    user: { username },
  } = useUser();
  return (
    <>
      {props.postings !== undefined && props.postings.length > 0 ? (
        <>
          {postings.map((post) => (
            <div key={post.id} className={styles.container}>
              <Link passHref href={`/u/${query.username}/${post.slugifiedTitle}`}>
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
        </>
      ) : (
        <Text>No Posting Available By The User.</Text>
      )}
    </>
  );
}
