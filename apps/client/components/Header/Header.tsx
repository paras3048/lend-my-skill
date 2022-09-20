import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  Avatar,
} from "@mantine/core";
import Logo from "../../public/brand/icon-transparent.png";
import { useDisclosure } from "@mantine/hooks";
import {
  IconTrash,
  IconLayoutDashboard,
  IconUserCircle,
  IconSearch,
} from "@tabler/icons";
import Link from "next/link";
import styles from "./Header.module.scss";
import { useUser } from "hooks/useUser";
import { NavbarContent } from "./content";
import { useRouter } from "next/router";
import { eraseCookie } from "helpers/cookies";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.md,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
    fontFamily: "Whyte",
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: -theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

export function Navbar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const { user, setUser } = useUser();
  const { push } = useRouter();

  // const links = mockdata.map((item) => (
  //   <UnstyledButton className={classes.subLink} key={item.title}>
  //     <Group noWrap align="flex-start">
  //       <ThemeIcon size={34} variant="default" radius="md">
  //         <item.icon size={22} color={theme.fn.primaryColor()} />
  //       </ThemeIcon>
  //       <div>
  //         <Text size="sm" weight={500}>
  //           {item.title}
  //         </Text>
  //         <Text size="xs" color="dimmed">
  //           {item.description}
  //         </Text>
  //       </div>
  //     </Group>
  //   </UnstyledButton>
  // ));

  return (
    <Box>
      <Header height={60} px={user.id ? undefined : "md"} pr="md">
        <Group position="apart" sx={{ height: "100%" }}>
          <div className={styles.brandName}>
            <Link href="/" passHref>
              <h2 className="transition-all duration-300">
                <img
                  src={"/brand/icon-transparent.png"}
                  className={styles.logo}
                />
                <span>Lend My Skill</span>
              </h2>
            </Link>
          </div>
          <Group
            sx={{ height: "100%", opacity: user.id ? "0" : undefined }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link href="/">
              <a className={classes.link}>Home</a>
            </Link>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <Link href="/search">
                  <a className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Hire A Talent
                      </Box>
                      {/* <IconChevronDown
                        size={16}
                        color={theme.fn.primaryColor()}
                      /> */}
                    </Center>
                  </a>
                </Link>
              </HoverCard.Target>
            </HoverCard>
          </Group>
          {user.id ? (
            <div className={classes.hiddenMobile}>
              <NavbarContent />
            </div>
          ) : (
            <Group className={classes.hiddenMobile}>
              <Link href="/auth/login" passHref>
                <Button variant="default">Log in</Button>
              </Link>
              <Link href={"/auth/signup"} passHref>
                <Button color="dark" className="customButton">
                  Sign up
                </Button>
              </Link>
            </Group>
          )}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
          />
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
        closeOnEscape
        closeOnClickOutside
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          {user.id ? (
            <>
              <Link href="/dashboard">
                <a className={classes.link}>
                  <IconLayoutDashboard size={24} className="mr-2" />
                  Dashboard
                </a>
              </Link>
              <Link href="/search">
                <a className={classes.link}>
                  <IconSearch size={24} className="mr-2" />
                  Search
                </a>
              </Link>
              <Link href={`/u/${user.username}`}>
                <a className={classes.link}>
                  <IconUserCircle size={24} className="mr-2" />
                  Profile
                </a>
              </Link>
              <Divider
                my="sm"
                color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
              />
              <Group position="center" grow pb="xl" px="md">
                <Button
                  color="dark"
                  className="customButton"
                  onClick={() => {
                    eraseCookie("token");
                    setUser({ type: "Logout", payload: {} });
                    push("/");
                  }}
                >
                  <IconTrash size={24} className="mr-2" />
                  Log Out
                </Button>
              </Group>
            </>
          ) : (
            <>
              <Link href="/">
                <a className={classes.link}>Home</a>
              </Link>
              <HoverCard
                width={600}
                position="bottom"
                radius="md"
                shadow="md"
                withinPortal
              >
                <HoverCard.Target>
                  <Link href="/search">
                    <a className={classes.link}>
                      <Center inline>
                        <Box component="span" mr={5}>
                          Hire A Talent
                        </Box>
                        {/* <IconChevronDown
                        size={16}
                        color={theme.fn.primaryColor()}
                      /> */}
                      </Center>
                    </a>
                  </Link>
                </HoverCard.Target>
              </HoverCard>
              <Divider
                my="sm"
                color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
              />

              <Group position="center" grow pb="xl" px="md">
                <Link href="/auth/login" passHref>
                  <Button variant="default">Log in</Button>
                </Link>
                <Link href={"/auth/signup"} passHref>
                  <Button color="dark" className="customButton">
                    Sign up
                  </Button>
                </Link>
              </Group>
            </>
          )}
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
