import {
  Navbar,
  Center,
  Tooltip,
  UnstyledButton,
  createStyles,
  Stack,
  Avatar,
  Tabs,
} from "@mantine/core";
import {
  TablerIcon,
  IconHome2,
  IconLogout,
  IconSwitchHorizontal,
  IconNotification,
  IconSettings,
  IconPencil,
  IconShoppingCart,
  IconMessage,
} from "@tabler/icons";
import { useRefetchProfile } from "hooks/useRefetchProfile";
import { useUser } from "hooks/useUser";
import { useRouter } from "next/router";
import sidebarStyles from "./sidebar.module.scss";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { DashboardNavbar } from "./Navbar";
const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionDuration={0}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Dashboard", path: "/dashboard" },
  {
    icon: IconNotification,
    label: "Notifications",
    path: "/dashboard/notifications",
  },
  {
    icon: IconPencil,
    label: "Posts",
    path: "/dashboard/post?tab=create",
  },
  {
    icon: IconShoppingCart,
    label: "Orders",
    path: "/orders",
  },
  {
    icon: IconMessage,
    label: "Chat",
    path: "/chat?type=seller",
  },
  {
    icon: IconSettings,
    label: "Settings",
    path: "/dashboard/profile/settings",
  },
];

export function DashboardSidebar() {
  const { asPath, push } = useRouter();
  const { user } = useUser();
  const router = useRouter();
  const media = useMediaQuery("(max-width:768px)", false);
  const [value, setValue] = useState("/dashboard");
  useRefetchProfile();
  const links = mockdata.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.path === asPath}
      onClick={() => push(link.path)}
    />
  ));
  const tabs = mockdata.map((link) => (
    <Tabs.Tab
      value={link.path}
      icon={<link.icon />}
      key={link.path}
      className={media ? "" : "flex-[0.05]"}
    >
      {link.label}
    </Tabs.Tab>
  ));

  return (
    <>
      {/* <Navbar width={{ base: 80 }} p="md" className={sidebarStyles.sidebar}>
        <Center>
          <Avatar src={"/brand/icon-transparent.png"} />
        </Center>
        <Navbar.Section grow mt={50}>
          <Stack justify="center" spacing={0}>
            <>{links}</>
          </Stack>
        </Navbar.Section>
        <Navbar.Section>
          <Stack justify="center" spacing={0}>
            <NavbarLink
              label="My Postings"
              icon={IconPencil}
              onClick={() => push(`/u/${user.username}?tab=postings`)}
            />
          </Stack>
        </Navbar.Section>
      </Navbar> */}
      <DashboardNavbar />
      {/* <Tabs
        onTabChange={(value) => {
          setValue(value as string);
          router.push(value as string);
        }}
        variant="pills"
        value={value}
        className={sidebarStyles.tabs}
      >
        <Tabs.List
          grow
          mt="xl"
          sx={{
            overflowX: "scroll",
            flexWrap: "wrap",
          }}
        >
          {tabs}
        </Tabs.List>
      </Tabs> */}
    </>
  );
}
