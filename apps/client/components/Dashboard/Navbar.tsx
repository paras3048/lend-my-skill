import { createStyles, UnstyledButton, Badge } from "@mantine/core";
import {
  IconSelector,
  IconNotification,
  IconAlertTriangle,
  IconPencil,
  IconStar,
  IconSettings,
  IconShoppingCart,
  IconMessage,
  IconDashboard,
  IconTrash,
} from "@tabler/icons";
import { eraseCookie } from "helpers/cookies";
import { useUser } from "hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserButton } from "../UserButton/UserButton";

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
    // ["@media (max-width:768px)"]: {
    //   display: "none",
    // },
  },

  section: {
    marginLeft: "unset",
    marginRight: "unset",
    marginBottom: "unset",

    "&:not(:last-of-type)": {
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },

  searchCode: {
    fontWeight: 700,
    fontSize: 10,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2]
    }`,
  },

  mainLinks: {
    paddingLeft: theme.spacing.md - theme.spacing.xs,
    paddingRight: theme.spacing.md - theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `8px ${theme.spacing.xs}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",

    span: {
      fontSize: theme.fontSizes.sm,
    },
    flex: "unset",
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: 20,
    height: 20,
    pointerEvents: "none",

    marginLeft: "auto",
  },

  collections: {
    paddingLeft: theme.spacing.md - 6,
    paddingRight: theme.spacing.md - 6,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: theme.spacing.md + 2,
    paddingRight: theme.spacing.md,
    marginBottom: 5,
  },

  collectionLink: {
    display: "block",
    padding: `8px ${theme.spacing.xs}px`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

interface NavbarProps {
  drawerOpened?: boolean;
  onDrawerStateChange?: () => void;
}

export function DashboardNavbar(props: NavbarProps) {
  return null;
}

export function NavbarDrawerContent() {
  const { classes } = useStyles();
  const { user, setUser } = useUser();
  const { push, replace } = useRouter();
  const mainLinks = (
    <>
      <UnstyledButton
        className={classes.mainLink}
        onClick={() => push("/dashboard")}
      >
        <div className={classes.mainLinkInner}>
          <IconDashboard
            size={20}
            className={classes.mainLinkIcon}
            stroke={1.5}
          />
          <span>Dashboard</span>
        </div>
      </UnstyledButton>
      <UnstyledButton
        className={classes.mainLink}
        onClick={() => push("/dashboard/notifications")}
      >
        <div className={classes.mainLinkInner}>
          <IconNotification
            size={20}
            className={classes.mainLinkIcon}
            stroke={1.5}
          />
          <span>Notifications</span>
        </div>

        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {user.notifications || 0}
        </Badge>
      </UnstyledButton>

      <UnstyledButton
        className={classes.mainLink}
        onClick={() => push(`/u/${user.username}?tab=postings`)}
      >
        <div className={classes.mainLinkInner}>
          <IconPencil size={20} className={classes.mainLinkIcon} stroke={1.5} />
          <span>Postings</span>
        </div>

        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {user.postings || 0}
        </Badge>
      </UnstyledButton>
      <UnstyledButton
        className={classes.mainLink}
        onClick={() => push(`/u/${user.username}?tab=reviews`)}
      >
        <div className={classes.mainLinkInner}>
          <IconStar size={20} className={classes.mainLinkIcon} stroke={1.5} />
          <span>Reviews</span>
        </div>

        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {user.reviews || 0}
        </Badge>
      </UnstyledButton>
      <UnstyledButton
        className={classes.mainLink}
        onClick={() => push("/warnings")}
      >
        <div className={classes.mainLinkInner}>
          <IconAlertTriangle
            size={20}
            className={classes.mainLinkIcon}
            stroke={1.5}
          />
          <span>Warnings</span>
        </div>

        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {user.Warnings || 0}
        </Badge>
      </UnstyledButton>
      <UnstyledButton
        className={classes.mainLink}
        onClick={() => push("/dashboard/profile/settings")}
      >
        <div className={classes.mainLinkInner}>
          <IconSettings
            size={20}
            className={classes.mainLinkIcon}
            stroke={1.5}
          />
          <span>Update Profile</span>
        </div>

        {/* <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {user.Warnings || 0}
        </Badge> */}
      </UnstyledButton>
      <UnstyledButton
        className={classes.mainLink}
        onClick={() => push("/dashboard/post")}
      >
        <div className={classes.mainLinkInner}>
          <IconPencil size={20} className={classes.mainLinkIcon} stroke={1.5} />
          <span>Create Postings</span>
        </div>

        {/* <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {user.Warnings || 0}
        </Badge> */}
      </UnstyledButton>
      <UnstyledButton
        className={classes.mainLink}
        onClick={() => push("/orders")}
      >
        <div className={classes.mainLinkInner}>
          <IconShoppingCart
            size={20}
            className={classes.mainLinkIcon}
            stroke={1.5}
          />
          <span>Orders</span>
        </div>

        {/* <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {user.Warnings || 0}
        </Badge> */}
      </UnstyledButton>
      <UnstyledButton
        className={classes.mainLink}
        onClick={() => push("/chat")}
      >
        <div className={classes.mainLinkInner}>
          <IconMessage
            size={20}
            className={classes.mainLinkIcon}
            stroke={1.5}
          />
          <span>Chat</span>
        </div>

        {/* <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {user.Warnings || 0}
        </Badge> */}
      </UnstyledButton>
      <UnstyledButton
        className={`${classes.mainLink} mt-xl`}
        onClick={() => {
          eraseCookie("token");
          setUser({ type: "Logout", payload: {} });
          replace("/");
        }}
      >
        <div className={classes.mainLinkInner}>
          <IconTrash size={20} className={classes.mainLinkIcon} stroke={1.5} />
          <span>LogOut</span>
        </div>

        {/* <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {user.Warnings || 0}
        </Badge> */}
      </UnstyledButton>
    </>
  );

  return (
    <>
      <div className={`${classes.section} items-center justify-center text-xl`}>
        <Link href={`/u/${user.username}`} passHref>
          <a>
            <UserButton
              image={`/api/${user.profileURL}`}
              name={user.name}
              email={`@${user.username}`}
              icon={<IconSelector size={14} stroke={1.5} />}
              position="center"
            />
          </a>
        </Link>
        <div className={classes.section}>
          <div className={classes.mainLinks}>{mainLinks}</div>
        </div>
      </div>
    </>
  );
}
