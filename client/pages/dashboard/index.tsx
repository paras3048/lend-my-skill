import { Button, Group, Modal, SimpleGrid, Title } from "@mantine/core";
import { IconPencil, IconStar } from "@tabler/icons";
import { ProfileCard } from "components/Dashboard/Profile";
import { DashboardSidebar } from "components/Dashboard/Sidebar";
import { InfoCard } from "components/Info/Card";
import { MetaTags } from "components/Meta";
import { useUser } from "hooks/useUser";
import { useRouter } from "next/router";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import styles from "styles/scss/dashboard.module.scss";
import { readCookie } from "helpers/cookies";
import { DropzoneSingle } from "components/DropZone/single";
import { showNotification } from "@mantine/notifications";
import { UploadImages, URLGenerator } from "helpers";
import axios from "axios";

export default function Dashboard() {
  const { user, setUser } = useUser();
  const { push } = useRouter();
  const [opened, setOpened] = useState(!Boolean(user.profileURL));
  const [file, setFile] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (readCookie("token") === null) return void push("/auth/login");
    if (!user.username) return void push("/auth/login");
  }, []);

  const handleFormSubmit = async () => {
    setLoading(true);
    if (!file) {
      setLoading(false);
      return showNotification({
        message: "Please Select A Profile Picture.",
        color: "red",
        autoClose: 5000,
      });
    }
    const fileURL = await UploadImages([file]);
    if ("error" in fileURL) {
      setLoading(false);
      return showNotification({
        message: "An Error Occured while Uploading Image",
        color: "red",
        autoClose: 5000,
      });
    }
    const cookie = readCookie("token");
    if (!cookie) {
      setLoading(false);
      return showNotification({
        color: "red",
        autoClose: 5000,
        message: "No Valid Authentication Method Found",
      });
    }
    axios
      .patch(
        URLGenerator("UpdateProfilePicture"),
        { url: fileURL[0] },
        {
          headers: {
            authorization: cookie!,
          },
        }
      )
      .then(() => {
        setUser({
          type: "SetUser",
          payload: {
            profileURL: fileURL[0]!,
          },
        });
        setOpened(false);
      })
      .catch((err) => {
        return showNotification({
          message: err?.response?.data?.message || "An Error Occured",
          color: "red",
          autoClose: 5000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <MetaTags
        description={`Manage Your Profile and Check New Orders.`}
        title={`${user.name || "User"}'s Dashboard`}
      />
      <DashboardSidebar />

      <div className={styles.cardsContainer}>
        <div onClick={() => push(`/u/${user.username}`)}>
          <div className={styles.profileCard}>
            <ProfileCard {...user} />
          </div>
        </div>
        <SimpleGrid
          cols={3}
          spacing={"md"}
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: "md" },
            { maxWidth: 755, cols: 2, spacing: "sm" },
            { maxWidth: 600, cols: 1, spacing: "sm" },
          ]}
        >
          <InfoCard
            props={{
              desc: "Rating",
              value: (
                <>
                  {user.rating!}
                  <IconStar size={20} strokeWidth={1} />
                </>
              ),
            }}
          />
          <InfoCard
            props={{
              desc: "Posts",
              value: (
                <>
                  {user.postings!}
                  <IconPencil size={20} strokeWidth={1} />
                </>
              ),
            }}
          />
          <InfoCard
            props={{
              desc: "Reviews",
              value: (
                <>
                  {user.reviews!}
                  <IconStar size={20} strokeWidth={1} />
                </>
              ),
            }}
          />
        </SimpleGrid>
      </div>
      <Modal
        opened={opened}
        onClose={() => {}}
        centered
        title="Choose A Profile Picture"
      >
        <Title
          order={6}
          sx={{
            fontWeight: "lighter",
            marginTop: 12,
            marginBottom: 3,
          }}
        >
          Profile Picture
          <span
            style={{
              color: "#fa5252",
              boxSizing: "border-box",
            }}
          >
            *
          </span>
        </Title>
        <DropzoneSingle file={file} setFile={setFile} />
        <Group mt="xl" position="center">
          <Button
            className="customButton"
            color="dark"
            disabled={file === undefined}
            loading={loading}
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
