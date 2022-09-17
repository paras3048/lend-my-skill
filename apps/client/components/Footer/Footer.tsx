import { createStyles, Container, Group, Anchor } from "@mantine/core";
import Link from "next/link";
const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    backgroundColor: "#fbfbfb",
    marginBottom: theme.spacing.xl,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
    width: "100%",
  },
  link: {
    ":hover": {
      textDecoration: "underline",
    },
    width: "max-content",
    fontFamily: "poppins",
  },
}));

const LINKS = [
  {
    label: "Terms",
    link: "/terms",
  },
  {
    label: "Privacy",
    link: "/privacy",
  },
  {
    label: "Payment Terms",
    link: "/terms/payment",
  },
  // {
  //   label: "About",
  //   link: "/about",
  // },
  // {
  //   label: "Docs",
  //   link: "/docs",
  // },
  {
    label: "Team",
    link: "/team",
  },
];

export function Footer() {
  const { classes } = useStyles();
  const items = LINKS.map((link) => (
    <Link key={link.label} href={link.link}>
      <a className={classes.link}>{link.label}</a>
    </Link>
  ));

  return (
    <footer>
      <div className={classes.footer}>
        <Container className={classes.inner}>
          <Group position="center" className={classes.links}>
            {items}
          </Group>
        </Container>
      </div>
    </footer>
  );
}
