import { Tabs } from "@mantine/core";
import axios from "axios";
import { MetaTags } from "components/Meta";
import { Profile } from "components/Profile";
import { URLGenerator } from "helpers";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import styles from "styles/scss/username.module.scss";
import { IconMessageCircle, IconPencil, IconUser } from "@tabler/icons";
import { useRouter } from "next/router";
import { Reviews } from "components/Profile/Reviews";
import { Postings } from "components/Profile/Postings";
import markdownStyles from "styles/scss/dashboard.module.scss";
import sanitize from "sanitize-html";
import { useEffect, useState } from "react";
import Showdown from "showdown";

interface UserProfile {
  acceptingOrders: boolean;
  bio: string;
  verified: boolean;
  name: string;
  profileURL: string;
  username: string;
  ratedBy: string;
  rating: number;
  postings: {
    id: string;
    description: string;
    title: string;
    postedAt: string;
    slugifiedTitle: string;
  }[];
  detailedBio: string;
  reviews: {
    User: {
      username: string;
      profileURL: string;
    };
    message: string;
    id: string;
  }[];
}

const TABS = ["reviews", "postings", "about"];

const ProfilePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ profile }) => {
  const { query, push } = useRouter();
  const [about, setAbout] = useState("");

  useEffect(() => {
    setAbout(
      sanitize(
        new Showdown.Converter({
          emoji: true,
          customizedHeaderId: true,
          tables: true,
          strikethrough: true,
          ghCodeBlocks: true,
          underline: true,
          ghCompatibleHeaderId: true,
          openLinksInNewWindow: true,
        }).makeHtml(profile.detailedBio),
        {
          allowedTags: [
            "div",
            "span",
            "code",
            "img",
            "a",
            "table",
            "thead",
            "tbody",
            "br",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "ul",
            "li",
            "p",
            "marquee",
            "b",
            "strong",
            "i",
            "u",
            "code",
            "pre",
          ],
          disallowedTagsMode: "escape",
        }
      )
    );
  }, []);

  return (
    <>
      <MetaTags
        description={`${profile.bio}.\n${profile.username} has Rating of ${profile.rating} stars`}
        title={`${profile.username} - Overview`}
        ogImage={`/api/${profile.profileURL}`}
      />
      <div className={styles.container}>
        <Profile {...profile} />
        <div className="flex-1">
          <Tabs
            defaultValue={
              TABS.includes(query.tab as string)
                ? (query.tab as string)
                : "about"
            }
            onTabChange={(e) => push(`/u/${profile.username}?tab=${e}`)}
          >
            <Tabs.List grow>
              <Tabs.Tab
                value="about"
                icon={<IconUser size={14} />}
                color="teal"
              >
                About
              </Tabs.Tab>
              <Tabs.Tab
                value="postings"
                icon={<IconPencil size={14} />}
                color="teal"
              >
                Postings
              </Tabs.Tab>
              <Tabs.Tab
                value="reviews"
                icon={<IconMessageCircle size={14} />}
                color="teal"
              >
                Reviews
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="about" color="teal">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    about || `This User Doesn't Have Any <code>About Me</code>`,
                }}
                className={markdownStyles.markdown}
              ></div>
            </Tabs.Panel>

            <Tabs.Panel value="postings" pt="xs">
              <Postings postings={profile.postings} />
            </Tabs.Panel>

            <Tabs.Panel value="reviews" pt="xs">
              <Reviews reviews={profile.reviews} />
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps<{
  profile: UserProfile;
}> = async ({ query }) => {
  const data = await axios
    .get(URLGenerator("FetchPublicProfile", [query.username! as string]))
    .catch((err) => {
      console.log(err);
      return err?.response?.data?.statusCode || 500;
    });

  if (typeof data === "number") {
    return {
      redirect: {
        destination: `/error/${data || 500}`,
        permanent: false,
      },
    };
  }
  if (data === null)
    return {
      redirect: {
        destination: `/error/${data || 500}`,
        permanent: false,
      },
    };
  if (!data.data.username)
    return {
      redirect: {
        destination: "/error/404",
        permanent: false,
      },
    };
  const profile = data.data as UserProfile;
  return {
    props: {
      profile,
    },
  };
};
