import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  Container,
} from "@mantine/core";
import Logo from "../../public/brand/icon-transparent.png";
import { useDisclosure } from "@mantine/hooks";
import {
  IconTrash,
  IconLayoutDashboard,
  IconUserCircle,
  IconSearch,
  IconHome,
} from "@tabler/icons";
import Link from "next/link";
import styles from "./Header.module.scss";
import { useUser } from "hooks/useUser";
import { useRouter } from "next/router";
import { useRefetchProfile } from "hooks/useRefetchProfile";
import { NavbarDrawerContent } from "components/Dashboard/Navbar";

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
  useRefetchProfile();
  const { classes, theme } = useStyles();
  const { user, setUser } = useUser();
  const { push, asPath } = useRouter();

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
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          ) : (
            <>
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
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                className={classes.hiddenDesktop}
              />
            </>
          )}
        </Group>
      </Header>
      {user.id ? (
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size={"lg"}
          padding="md"
          title="Navigation"
          // className={classes.hiddenDesktop}
          zIndex={1000000}
          closeOnEscape
          closeOnClickOutside
          overlayOpacity={0.55}
          overlayBlur={3}
        >
          <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
            <Divider
              my="sm"
              color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
            />
            <NavbarDrawerContent />
          </ScrollArea>
        </Drawer>
      ) : (
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size={"lg"}
          padding="md"
          title="Navigation"
          // className={classes.hiddenDesktop}
          zIndex={1000000}
          closeOnEscape
          closeOnClickOutside
          overlayOpacity={0.55}
          overlayBlur={3}
        >
          <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
            <Divider
              my="sm"
              color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
            />
            <Container>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  closeDrawer();
                  push("/");
                }}
              >
                <div className="flex flex-row">
                  <IconHome className="mx-2" size={20} />
                  Home
                </div>
              </a>
              <Divider
                my="sm"
                color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
              />
              <a
                onClick={(e) => {
                  e.preventDefault();
                  closeDrawer();
                  push("/search");
                }}
                href="/search"
              >
                <div className="flex flex-row">
                  <IconSearch className="mx-2" size={20} />
                  Hire A Talent
                </div>
              </a>
              <Divider
                my="sm"
                color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
              />
              <Group position="center">
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => {
                    closeDrawer();
                    push("/auth/login");
                  }}
                >
                  Log in
                </Button>

                <Button
                  color="dark"
                  className="customButton"
                  fullWidth
                  onClick={() => {
                    closeDrawer();
                    push("/auth/signup");
                  }}
                >
                  Sign up
                </Button>
              </Group>
            </Container>
          </ScrollArea>
        </Drawer>
      )}
    </Box>
  );
}
