import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { MetaTags } from "components/Meta";
import { URLGenerator } from "helpers";
import { useUser } from "hooks/useUser";

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { User } from "types/context";

export default function LoginRoute() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
    },
  });
  const { setUser } = useUser();
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: typeof form.values) => {
    setLoading(true);
    const data = await axios
      .post(URLGenerator("Login"), { ...e })
      .catch((err) => {
        if (err && err.response) {
          console.log(err.response.data.message);
          showNotification({
            message: err.response.data.message,
            color: "red",
          });
        } else {
          showNotification({ message: "An Error Occured", color: "red" });
        }
        return null;
      });
    if (data === null) return setLoading(false);
    document.cookie = `token=${data.data.token};Secure;SameSite=None`;
    const { user: responseUser } = data.data as { user: Partial<User> };
    setUser({
      type: "SetUser",
      payload: {
        username: responseUser.username,
        name: responseUser.name,
        id: responseUser.id,
        profileURL: responseUser.profileURL,
        verified: responseUser.verified,
        bannerURL: responseUser.bannerURL,
        bannerColor: responseUser.bannerColor,
        acceptingOrders: responseUser.acceptingOrders,
      },
    });
    showNotification({
      message: `Welcome ${responseUser.name}`,
      color: "green",
      autoClose: 4000,
    });
    setLoading(false);
    return push("/dashboard");
  };

  return (
    <Container size={420} my={40}>
      <MetaTags
        description="Login To Your Account."
        title="Login | Lend My Skill"
      />
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor href="/auth/signup" size="sm" component={Link}>
          <span className="text-blue-600 cursor-pointer hover:underline">
            Sign Up
          </span>
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((e) => handleFormSubmit(e))}>
          <TextInput
            label="Email"
            placeholder="you@me.dev"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />

          <Button
            fullWidth
            mt="xl"
            type="submit"
            className="bg-gray-900 hover:bg-black"
            loading={loading}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
