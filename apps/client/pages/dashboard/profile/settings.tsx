import {
  Container,
  Loader,
  Select,
  Textarea,
  Tabs,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { DashboardSidebar } from "components/Dashboard/Sidebar";
import { MetaTags } from "components/Meta";
import { URLGenerator } from "helpers";
import { readCookie } from "helpers/cookies";
import { useEffect, useState } from "react";
import styles from "styles/scss/dashboard.module.scss";
import { IconPencil, IconPhoto } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import sanitize from "sanitize-html";
import Showdown from "showdown";

interface ProfileDetails {
  bio: string;
  /**
   * Markdown Goes brrrr
   */
  detailedBio: string;
  acceptingOrders: boolean;
}

export default function SettingsPage() {
  const form = useForm<
    Omit<ProfileDetails, "acceptingOrders"> & { acceptingOrders: string }
  >({
    initialValues: {
      bio: "",
      acceptingOrders: "",
      detailedBio: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<undefined | ProfileDetails>(undefined);
  const fetchProfile = () => {
    const cookie = readCookie("token");
    if (!cookie) return;
    axios
      .get(URLGenerator("fetchDetails"), {
        headers: {
          authorization: cookie!,
        },
      })
      .then(async ({ data }) => {
        form.setValues(data);
        form.setFieldValue(
          "acceptingOrders",
          data.acceptingOrders === true ? "Yes" : "No"
        );
        setConfig(data);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const handleSubmit = async (e: typeof form.values) => {
    if (JSON.stringify(e) === JSON.stringify(config)) return;
    const cookie = readCookie("token")!;
    axios
      .patch(
        URLGenerator("UpdateAllThings"),
        {
          ...e,
          acceptingOrders: e.acceptingOrders === "Yes" ? true : false,
        },
        {
          headers: {
            authorization: cookie,
          },
        }
      )
      .then(() => {
        showNotification({
          message: "Details Updated Successfully!",
          color: "green",
          autoClose: 10000,
        });
        fetchProfile();
      })
      .catch((err) => {
        return showNotification({
          message: err.response?.data?.message || "An Error Occured",
          color: "red",
          autoClose: 10000,
        });
      });
  };
  return (
    <div className={styles.container}>
      <MetaTags description="" title="Update Your Profile" />
      <DashboardSidebar />
      {loading !== false ? (
        <Container>
          <Loader size="xl" variant="bars" />
        </Container>
      ) : (
        <div className={styles.contentContainer}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <div className={styles.inputs}>
              <Select
                data={["Yes", "No"]}
                label="Accept Orders"
                {...form.getInputProps("acceptingOrders")}
              />
              <Textarea label="Bio" {...form.getInputProps("bio")} />
              <Tabs
                defaultValue={"edit"}
                classNames={{
                  tabsList: "flex flex-col",
                }}
              >
                <Tabs.List>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "2rem",
                      marginTop: "2rem",
                    }}
                  >
                    <Tabs.Tab value="edit" icon={<IconPencil size={14} />}>
                      Edit
                    </Tabs.Tab>
                    <Tabs.Tab value="preview" icon={<IconPhoto size={14} />}>
                      Preview
                    </Tabs.Tab>
                  </div>
                  <Tabs.Panel value="preview" pt="xl">
                    <div
                      className={styles.markdown}
                      dangerouslySetInnerHTML={{
                        __html: sanitize(
                          new Showdown.Converter({
                            emoji: true,
                            customizedHeaderId: true,
                            tables: true,
                            strikethrough: true,
                            ghCodeBlocks: true,
                            underline: true,
                            ghCompatibleHeaderId: true,
                            openLinksInNewWindow: true,
                          }).makeHtml(form.values.detailedBio),
                          {
                            allowedTags: [
                              "div",
                              "span",
                              "code",
                              "img",
                              "a",
                              "table",
                              "thead",
                              "tbody",
                              "br",
                              "h1",
                              "h2",
                              "h3",
                              "h4",
                              "h5",
                              "h6",
                              "ul",
                              "li",
                              "p",
                              "marquee",
                              "b",
                              "strong",
                              "i",
                              "u",
                              "code",
                              "pre",
                            ],
                            disallowedTagsMode: "escape",
                          }
                        ),
                      }}
                    />
                  </Tabs.Panel>
                  <Tabs.Panel value="edit" pt="xl">
                    <Textarea
                      label="About Me"
                      {...form.getInputProps("detailedBio")}
                      autosize
                    />
                  </Tabs.Panel>
                </Tabs.List>
              </Tabs>
              <Group position="center" mt="xl">
                <Button className="customButton" color="dark" type="submit">
                  Update
                </Button>
              </Group>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
