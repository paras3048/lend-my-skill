import { Accordion, Container, createStyles, Title } from "@mantine/core";
import axios from "axios";
import { DashboardSidebar } from "components/Dashboard/Sidebar";
import { MetaTags } from "components/Meta";
import { Notification } from "components/Notifications";
import { URLGenerator } from "helpers";
import { readCookie } from "helpers/cookies";
import { useUser } from "hooks/useUser";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import sidebarfixStyles from "styles/scss/sidebar-fix.module.scss";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderRadius: theme.radius.sm,
  },

  item: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    border: "1px solid transparent",
    position: "relative",
    zIndex: 0,
    transition: "transform 150ms ease",

    "&[data-active]": {
      transform: "scale(1.03)",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      boxShadow: theme.shadows.md,
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2],
      borderRadius: theme.radius.md,
      zIndex: 1,
    },
  },

  chevron: {
    "&[data-rotate]": {
      transform: "rotate(-90deg)",
    },
  },
}));

const NotificationsPage: NextPage = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<
    { name: string; id: string; description: string }[]
  >([]);
  const { classes } = useStyles();
  const { push } = useRouter();
  async function fetchNotifications(cookie: string) {
    const data = await axios
      .get(URLGenerator("FetchAllNotifications", [`${user.id}`]), {
        headers: {
          authorization: cookie!,
        },
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    return data === null ? null : data.data;
  }
  function messWithNotifications() {
    const cookie = readCookie("token");
    if (!cookie) return void push("/auth/login");
    fetchNotifications(cookie).then((d) => {
      if (d !== null) setNotifications(d);
    });
  }
  useEffect(() => {
    messWithNotifications();
  }, []);

  return (
    <div className={sidebarfixStyles.container}>
      <MetaTags
        description={`View All Notifications of ${user.name}`}
        title={`${user.name}'s Notifications`}
      />
      <DashboardSidebar />
      <div className={sidebarfixStyles.content}>
        <Container>
          {notifications.length > 0 ? (
            <Accordion
              variant="separated"
              radius="md"
              disableChevronRotation
              classNames={classes}
              className={classes.root}
            >
              {notifications.map((notif) => (
                <Notification
                  description={notif.description}
                  name={notif.name}
                  key={notif.id}
                  messWithNotifications={messWithNotifications}
                  id={notif.id}
                />
              ))}
            </Accordion>
          ) : (
            <>
              <Title align="center" order={5}>
                You Currenly Have No Unread Notifications.
              </Title>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};
export default NotificationsPage;
