import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Button,
  Anchor,
  Container,
  Title,
  Checkbox,
} from "@mantine/core";
import styles from "../../styles/scss/signup.module.scss";
import Head from "next/head";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { URLGenerator } from "helpers";
import axios from "axios";
import { useUser } from "hooks/useUser";
import { User } from "types/context";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUp() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      username: "",
      name: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
      username: (us) =>
        us.length > 1 ? null : "Username Must be of Min 1 Character",
    },
  });
  const { user, setUser } = useUser();
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const handleFormSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const { email, name, password, username } = values;
    const data = await axios
      .post(URLGenerator("SignUp"), {
        email,
        password,
        username,
        name,
      })
      .catch((err) => {
        if (err && err.response) {
          showNotification({
            message: err?.response?.data?.message || "An Error Occured",
            color: "red",
          });
        } else {
          showNotification({ message: "An Error Occured", color: "red" });
        }
        setLoading(false);
        return null;
      });
    if (data !== null) {
      document.cookie = `token=${data.data.token};SameSite=None`;
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
    }
  };
  const [checked, setChecked] = useState(false);
  return (
    <div className={styles.container}>
      <Head>
        <title>Sign Up</title>
        <meta
          content="Lets Get Started by Creating A New Account."
          name="description"
        />
      </Head>

      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Create An Account
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already Have An Account?{" "}
          <Anchor href="/auth/login" size="sm" component={Link}>
            <span className="text-blue-600 cursor-pointer">Login</span>
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit((e) => handleFormSubmit(e))}>
            <TextInput
              label="Username"
              placeholder="JohnDoe123"
              required
              type={"text"}
              {...form.getInputProps("username")}
              onChange={(e) => {
                form.setFieldValue(
                  "username",
                  e.target.value.replace(" ", "").replace(/[^a-zA-Z0-9 ]/g, "")
                );
              }}
              mt="md"
            />
            <TextInput
              label="Email"
              placeholder="johndoe@mail.com"
              required
              mt="md"
              type="email"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps("password")}
            />
            <TextInput
              label="Name"
              placeholder="John Doe"
              required
              mt="md"
              mb="md"
              {...form.getInputProps("name")}
            />

            {/* <Title
              order={6}
              sx={{
                fontWeight: "lighter",
                marginTop: 12,
                marginBottom: 3,
              }}
            >
              KYC Documents
              <span className={styles.asterisk}>*</span>
            </Title>
            <DropZonePreview files={kycDocs} setFiles={setKYCDocs} />
            */}
            <Checkbox
              label={
                <>
                  I Agree to{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="norefferer noopener"
                    className="text-blue-600 cursor-pointer"
                  >
                    {" "}
                    Terms and Conditions
                  </a>{" "}
                  to Use This Platform
                </>
              }
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <Button
              fullWidth
              mt="xl"
              color="dark"
              variant="filled"
              type="submit"
              className="bg-gray-900 hover:bg-black"
              disabled={!checked}
              loading={loading}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
