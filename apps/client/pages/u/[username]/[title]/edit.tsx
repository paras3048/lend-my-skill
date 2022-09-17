import { Container, Loader, MultiSelect, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { MetaTags } from "components/Meta";
import { GetFilteredHTML, URLGenerator } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Root } from "types/posting";
import { Select, Textarea, Tabs, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { readCookie } from "helpers/cookies";
import styles from "styles/scss/dashboard.module.scss";
import { IconPencil, IconPhoto } from "@tabler/icons";
import { BACKEND_URL } from "constants/index";

export default function EditAPosting() {
  const [loading, setLoading] = useState(true);
  const { query, isReady, replace } = useRouter();
  const [posting, setPosting] = useState<Root>();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [categoriesFetched, setCategoriesFetched] = useState(false);
  const form = useForm({
    initialValues: {
      acceptingOrders: posting?.acceptingOrders === false ? "Yes" : "No",
      description: posting?.description,
      categories: posting?.category.map((c) => c.id),
    },
  });

  const fetchCategories = () => {
    axios
      .get(URLGenerator("FetchAllCategories"))
      .then(({ data }) => data)
      .then(setCategories)
      .then(() => setCategoriesFetched(true))
      .catch((err) => {
        showNotification({
          message: err.response?.data?.message || "An Error Occured",
          color: "red",
          autoClose: 10000,
        });
      });
  };
  const fetchPostData = () => {
    axios
      .post(`${URLGenerator("FetchPost")}`, { ...query })
      .then((res) => res.data)
      .then((data: Root) => {
        setPosting(data);
        setLoading(false);
        form.setFieldValue("description", data.description);
        form.setFieldValue(
          "acceptingOrders",
          data.acceptingOrders === true ? "Yes" : "No"
        );
        form.setFieldValue(
          "categories",
          data.category.map((c) => c.id)
        );
      })
      .catch((err) => {
        return showNotification({
          message: err.response?.data?.message || "An Error Occured",
          color: "red",
          autoClose: 5000,
        });
      });
  };

  const handleFormSubmit = (values: typeof form.values) => {
    const cookie = readCookie("token");
    if (!cookie) {
      showNotification({
        message: "No Valid Authentication Method Found, Please Login Again",
        color: "red",
        autoClose: 5000,
      });
      return replace("/auth/login");
    }
    if (!values.acceptingOrders)
      return showNotification({
        message: "Please Choose If You want to Get Orders From This Postings",
        color: "red",
        autoClose: 5000,
      });
    if (!values.categories)
      return showNotification({
        message: "Please Choose Some Categories",
        color: "red",
        autoClose: 5000,
      });
    if (!values.description)
      return showNotification({
        message: "Please Enter Description",
        color: "red",
        autoClose: 5000,
      });
    axios
      .patch(
        `${BACKEND_URL}/postings/edit/bulk/${posting?.id}`,
        {

          acceptingOrder:
            values.acceptingOrders!.toLowerCase() === "yes" ? true : false,
            description:values.description,
            categories:values.categories
        },
        { headers: { authorization: cookie } }
      )
      .then(() => {
        showNotification({
          message: "Details Updated Successfully",
          color: "green",
          autoClose: 5000,
        });
        return fetchPostData();
      })
      .catch((err) => {
        return showNotification({
          message: err.response?.data?.message || "An Error Occured",
          color: "red",
          autoClose: 5000,
        });
      });
  };

  useEffect(() => {
    if (isReady === false) return;
    fetchPostData();
    fetchCategories();
  }, [isReady]);

  return (
    <>
      <MetaTags description="Edit Your Posting" title="Edit Your Posting" />
      <Container>
        {loading === true ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader variant="bars" size="xl" />
          </div>
        ) : (
          <>
            {posting !== undefined ? (
              <>
                <div className={styles.contentContainer}>
                  <Text className="text-center text-2xl mt-4">
                    Edit Your Posting Details
                  </Text>

                  <form
                    onSubmit={form.onSubmit((data) => handleFormSubmit(data))}
                  >
                    <div className={styles.inputs}>
                      <Select
                        data={["Yes", "No"]}
                        label="Accept Orders"
                        {...form.getInputProps("acceptingOrders")}
                      />
                      {categoriesFetched === true && categories.length > 0 ? (
                        <MultiSelect
                          label="Categories"
                          data={categories.map((c) => ({
                            value: c.id,
                            label: c.name,
                          }))}
                          max={10}
                          {...form.getInputProps("categories")}
                        />
                      ) : null}
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
                            <Tabs.Tab
                              value="edit"
                              icon={<IconPencil size={14} />}
                            >
                              Edit
                            </Tabs.Tab>
                            <Tabs.Tab
                              value="preview"
                              icon={<IconPhoto size={14} />}
                            >
                              Preview
                            </Tabs.Tab>
                          </div>
                          <Tabs.Panel value="preview" pt="xl">
                            <div
                              className={styles.markdown}
                              dangerouslySetInnerHTML={{
                                __html: GetFilteredHTML(
                                  form.values.description || "**Loading...**"
                                ),
                              }}
                            />
                          </Tabs.Panel>
                          <Tabs.Panel value="edit" pt="xl">
                            <Textarea
                              label="About Me"
                              {...form.getInputProps("description")}
                              autosize
                            />
                          </Tabs.Panel>
                        </Tabs.List>
                      </Tabs>
                      <Group position="center" mt="xl" mb="xl">
                        <Button
                          className="customButton"
                          color="dark"
                          type="submit"
                        >
                          Update
                        </Button>
                      </Group>
                    </div>
                  </form>
                </div>
              </>
            ) : null}
          </>
        )}
      </Container>
    </>
  );
}
