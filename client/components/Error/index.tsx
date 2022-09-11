import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Group,
} from "@mantine/core";
import { MetaTags } from "components/Meta";
import { useUser } from "hooks/useUser";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[5],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

export function BaseError({
  code,
  description,
  title,
}: {
  title: string;
  description: string;
  code: string;
}) {
  const { classes } = useStyles();
  const { push } = useRouter();
  const { user } = useUser();
  return (
    <Container className={classes.root}>
      <MetaTags title={title} description={description} />
      <div className={classes.label}>{code}</div>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        {description}
      </Text>
      <Group position="center">
        <Button
          size="md"
          className="bg-gray-900 hover:bg-black"
          onClick={() => {
            if (user.id) return push("/dashboard");
            return push("/");
          }}
        >
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
