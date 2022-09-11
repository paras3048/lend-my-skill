import {
  Accordion,
  Button,
  Container,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Tabs,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconEye, IconPencil } from "@tabler/icons";
import { DropzoneSingle } from "components/DropZone/single";
import { MetaTags } from "components/Meta";
import { useUser } from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "components/Dashboard/Sidebar";
import styles from "styles/scss/dashboard.module.scss";
import { DropZonePreview } from "components";
import { useMediaQuery } from "@mantine/hooks";
import { UploadImages, URLGenerator } from "helpers";
import axios from "axios";
import { readCookie } from "helpers/cookies";

export default function PostPage() {
  const { query } = useRouter();
  const { user } = useUser();

  const baseFormState = useForm({
    initialValues: {
      title: "",
      description: "",
      offers: [
        {
          deliveryTime: 0,
          description: "",
          name: "",
          price: 0,
        },
        {
          deliveryTime: 0,
          description: "",
          name: "",
          price: 0,
        },
      ],
      categories: [],
    },
    validate: {
      categories: (e) =>
        e.length === 0
          ? "Please Select A Category"
          : e.length > 10
          ? "Max Number of Categories You Can Select is 10"
          : null,
    },
  });

  const [heroImage, setHeroImage] = useState<File | undefined>();
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const media = useMediaQuery("(min-width:900px)", false);
  const [categoryModal, setCategoryModal] = useState(false);
  const fetchCategories = () => {
    axios
      .get(URLGenerator("FetchAllCategories"))
      .then(({ data }) => data)
      .then(setCategories)
      .catch(() => {
        return showNotification({
          color: "red",
          message: "An Error Occured While Fetching Categories",
        });
      });
  };
  const categoryFormState = useForm({
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (n) =>
        /^[A-Z a-z]+$/.test(n) ? null : "Name Can Only Contain Alphabets",
      description: (d) =>
        /^[A-Z a-z]+$/.test(d)
          ? null
          : "Description Can Only Contain Alphabets",
    },
  });
  useEffect(() => {
    fetchCategories();
  }, []);

  const addNewOffer = () => {
    if (baseFormState.values.offers.length >= 3)
      return showNotification({
        message: `You're only allowed to Have 3 Offers Per Post.`,
        color: "red",
      });
    return baseFormState.insertListItem("offers", {
      deliveryTime: 0,
      description: "",
      name: "",
      price: 0,
    });
  };
  const removeOffer = (index: number) => {
    if (baseFormState.values.offers.length - 1 === 1)
      return showNotification({
        message: `Your Post Must Have 2 Offers.`,
        color: "red",
      });
    baseFormState.removeListItem("offers", index);
  };
  const handleFormSubmit = async (values: typeof baseFormState.values) => {
    
    if (!heroImage)
      return showNotification({
        message: "Please Select A Banner Image.",
        color: "red",
        autoClose: 10000,
      });
    if (images.length === 0)
      return showNotification({
        message: "Please Select Some Images.",
        color: "red",
        autoClose: 10000,
      });
    const heroImageURL = await UploadImages([heroImage]);
    if ("error" in heroImageURL) {
      return showNotification({
        color: "red",
        autoClose: 10000,
        message:
          "An Error Occured While Uploading Files. Please Try Again Later",
      });
    }
    const imagesURL = await UploadImages(images);
    if ("error" in imagesURL) {
      return showNotification({
        color: "red",
        autoClose: 10000,
        message:
          "An Error Occured While Uploading Files. Please Try Again Later",
      });
    }
    const data = await axios
      .post(
        URLGenerator("CreateNewPost"),
        {
          ...values,
          heroImage: heroImageURL![0],
          images: imagesURL!,
          categories: values.categories,
        },
        {
          headers: {
            authorization: readCookie("token")!,
          },
        }
      )
      .catch((err) => {
        console.log(err);
        if (err && err.response && err.response.data) {
          showNotification({
            message: err.response.data.message,
            color: "red",
          });
          return null;
        }
        showNotification({
          color: "red",
          message: "An Error Occured",
        });
        return null;
      });
    if (data !== null)
      return showNotification({ message: "New Post Created", color: "green" });
  };
  return (
    <div className={styles.container}>
      <MetaTags
        description="Create A New Post To Get Hired"
        title="Post | Lend My Skill"
      />
      <DashboardSidebar />
      <Container className="w-full">
        <Tabs defaultValue={"create"}>
          <Tabs.List grow>
            <Tabs.Tab value="create" icon={<IconPencil size={14} />}>
              Create
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="create">
            <Container
              p="xl"
              pt="sm"
              className={media === true ? styles.formContainer : ""}
            >
              <form
                onSubmit={baseFormState.onSubmit((e) => handleFormSubmit(e))}
              >
                <TextInput
                  label="Title"
                  required
                  placeholder="A Nice Title for Your Post"
                  {...baseFormState.getInputProps("title")}
                />
                <Textarea
                  label="Description"
                  placeholder="Description Of Your Posting(supports markdown)"
                  required
                  minLength={100}
                  {...baseFormState.getInputProps("description")}
                  autosize
                  spellCheck={false}
                />

                <>
                  <MultiSelect
                    data={
                      categories
                        ? categories.map((c) => ({
                            value: c.id,
                            label: c.name,
                          }))
                        : []
                    }
                    label="Select Categories"
                    max={10}
                    min={1}
                    {...baseFormState.getInputProps("categories")}
                  />
                </>

                <Title order={6} mt="sm">
                  Banner Image
                  <span className={"text-[#fa5252]"}>*</span>
                </Title>
                <div className={"mt-2"}>
                  <DropzoneSingle
                    file={heroImage}
                    setFile={setHeroImage}
                    title={"Select A Banner Image"}
                  />
                </div>
                {baseFormState.values.offers.map((offer, index) => (
                  <Accordion key={index}>
                    <Accordion.Item value={`offers${index}`}>
                      <Accordion.Control>
                        {offer.name || `Offer - ${index + 1}`}
                      </Accordion.Control>
                      <Accordion.Panel>
                        <>
                          <TextInput
                            required
                            label="Name"
                            placeholder="Name of This Offer. Maybe Basic?"
                            {...baseFormState.getInputProps(
                              `offers.${index}.name`
                            )}
                          />
                          <Textarea
                            required
                            label="Description"
                            placeholder="Description For This Offer(supports Markdown)"
                            {...baseFormState.getInputProps(
                              `offers.${index}.description`
                            )}
                            spellCheck={false}
                            autosize
                          />
                          <NumberInput
                            required
                            label="Delivery Time"
                            placeholder="Time In Days."
                            {...baseFormState.getInputProps(
                              `offers.${index}.deliveryTime`
                            )}
                          />
                          <NumberInput
                            required
                            label="Price"
                            placeholder="Price Of This Offer. In INR"
                            {...baseFormState.getInputProps(
                              `offers.${index}.price`
                            )}
                          />
                          {baseFormState.values.offers.length === 2 ? null : (
                            <Group position="center" mt="xl">
                              <Button
                                color="dark"
                                className="customButton"
                                type="button"
                                onClick={() => removeOffer(index)}
                              >
                                Remove This Offer
                              </Button>
                            </Group>
                          )}
                        </>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                ))}
                <Title order={6} mt="sm">
                  Images
                  <span className={"text-[#fa5252]"}>*</span>
                </Title>
                <div className={"mt-2"}>
                  <DropZonePreview
                    files={images}
                    setFiles={setImages}
                    title="Click Here or Drop Some Catchy Images"
                  />
                </div>
                {baseFormState.values.offers.length === 3 ? null : (
                  <Group position="center" mt="xl">
                    <Button color="dark" className="customButton" type="submit">
                      Create
                    </Button>
                    <Button
                      color="dark"
                      className="customButton"
                      type="button"
                      onClick={addNewOffer}
                    >
                      Add New Offer
                    </Button>
                    <Button
                      color="dark"
                      className="customButton"
                      type="button"
                      onClick={() => setCategoryModal((o) => !o)}
                    >
                      Create New Category
                    </Button>
                  </Group>
                )}
              </form>
            </Container>
          </Tabs.Panel>
        </Tabs>
        <Modal
          onClose={() => setCategoryModal((o) => !o)}
          opened={categoryModal}
          centered
          title="Create New Category"
        >
          <form
            onSubmit={categoryFormState.onSubmit((e) => {
              const cookie = readCookie("token");
              axios
                .post(
                  URLGenerator("CreateCategories"),
                  {
                    ...e,
                  },
                  {
                    headers: {
                      authorization: cookie!,
                    },
                  }
                )
                .then(() => {
                  fetchCategories();
                  setCategoryModal(false);
                })
                .catch((err) => {
                  return showNotification({
                    message: err.response?.data?.message || "An Error Occured",
                    color: "red",
                    autoClose: 5000,
                  });
                });
            })}
          >
            <TextInput
              label="Name"
              required
              {...categoryFormState.getInputProps("name")}
            />
            <Textarea
              label="Description"
              required
              {...categoryFormState.getInputProps("description")}
              autosize
              spellCheck={false}
            />

            <Group mt="xl">
              <Button className="customButton" type="submit" color="dark">
                Create
              </Button>
            </Group>
          </form>
        </Modal>
      </Container>
    </div>
  );
}
