import {
  Button,
  Container,
  Group,
  Loader,
  Select,
  SimpleGrid,
  Tabs,
  Text,
  TextInput,
  Card,
  Image,
  Badge,
  Spoiler,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { MetaTags } from "components/Meta";
import { URLGenerator } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EXAMPLE_PAYLOAD = {
  heroImage:
    "images/public/1661603670449-9939106d-ca97-4c23-aa18-a6e31c71cacb-myself.jpg",
  title: "I will create a website for you using Next.js",
  slugifiedTitle: "i-will-create-a-website-for-you-using-nextjs",
  id: "4c8e8607-5408-4485-8f9f-2a26879c3b63",
  postedAt: "2022-08-29T12:02:33.482Z",
  User: {
    username: "phantomknight287",
    profileURL:
      "images/public/1661603670449-9939106d-ca97-4c23-aa18-a6e31c71cacb-myself.jpg",
  },
};

export type SearchResult = typeof EXAMPLE_PAYLOAD;

export default function SearchPage() {
  const form = useForm<{ searchTerm?: string; categoryId?: string }>({
    initialValues: {
      categoryId: "",
      searchTerm: "",
    },
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [categoriesFetched, setCategoriesFetched] = useState(false);
  const { query, push } = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [value, setValue] = useState((query.tab as string) || "term");
  useEffect(() => {
    axios
      .get(URLGenerator("FetchAllCategories"))
      .then(({ data }) => data)
      .then(setCategories)
      .catch((err) => {
        showNotification({
          message: err.response?.data?.message || "An Error Occured",
          color: "red",
          autoClose: 10000,
        });
      })
      .finally(() => setCategoriesFetched(true));
  }, []);
  const formSubmit = (e: typeof form.values, type: "term" | "category") => {
    if (!e.categoryId && !e.searchTerm)
      return showNotification({
        message: "Please Select A Category or Enter a Search Term.",
        color: "red",
        autoClose: 4000,
      });
    if (type === "term") {
      axios
        .post(URLGenerator("FetchPostsUsingTerms"), {
          term: e.searchTerm,
        })
        .then((data) => data.data)
        .then(setResults)
        .catch((err) => {
          showNotification({
            color: "red",
            autoClose: 4000,
            message: err.response?.data?.message || "An Error Occured",
          });
        });
    } else if (type === "category") {
      axios
        .post(URLGenerator("FetchPostsUsingCategory"), {
          id: e.categoryId,
        })
        .then((data) => data.data)
        .then(setResults)
        .catch((err) => {
          showNotification({
            color: "red",
            autoClose: 4000,
            message: err.response?.data?.message || "An Error Occured",
          });
        });
    }
  };

  return (
    <>
      <div className="mt-10 px-5">
        <MetaTags
          description="Search For Services"
          title="Search | Lend My Skill"
        />
        <Tabs
          value={value}
          onTabChange={(e) => {
            setValue(e as string);
            push({
              pathname: "/search",
              query: {
                tab: e,
              },
            });
          }}
        >
          <Tabs.List grow>
            <Tabs.Tab value="term">Search Using Term</Tabs.Tab>
            <Tabs.Tab value="category">Search Using Category</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="category" mt="xl">
            {categories && categories.length > 0 ? (
              <Container>
                <form
                  onSubmit={form.onSubmit((e) => formSubmit(e, "category"))}
                >
                  <Select
                    data={categories.map((c) => ({
                      label: c.name,
                      value: c.id,
                    }))}
                    label="Select A Category"
                    {...form.getInputProps("categoryId")}
                    required
                  />
                  <Group position="center" mt="xl">
                    <Button color="dark" className="customButton" type="submit">
                      Search
                    </Button>
                  </Group>
                </form>
              </Container>
            ) : (
              <div className="flex flex-col min-h-screen items-center justify-center">
                {categoriesFetched === false ? (
                  <Loader variant="bars" color="teal" />
                ) : (
                  <Text align="center">No Categories Found</Text>
                )}
              </div>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="term" mt="xl">
            <>
              <Container>
                <form onSubmit={form.onSubmit((e) => formSubmit(e, "term"))}>
                  <TextInput
                    label="Enter Few Keywords"
                    required
                    {...form.getInputProps("searchTerm")}
                  />
                  <Group position="center" mt="xl">
                    <Button color="dark" className="customButton" type="submit">
                      Search
                    </Button>
                  </Group>
                </form>
              </Container>
            </>
          </Tabs.Panel>
        </Tabs>
        {results && results.length > 0 ? <Posts posts={results} /> : null}
      </div>
    </>
  );
}

function Posts(props: { posts: SearchResult[] }) {
  const { posts } = props;
  const { push } = useRouter();
  return (
    <SimpleGrid
      cols={4}
      spacing="lg"
      breakpoints={[
        { maxWidth: 980, cols: 3, spacing: "md" },
        { maxWidth: 755, cols: 2, spacing: "sm" },
        { maxWidth: 600, cols: 1, spacing: "sm" },
      ]}
      mt="xl"
    >
      {posts.map((p) => (
        <Card
          shadow="sm"
          p="lg"
          radius="md"
          withBorder
          key={p.id}
          className="flex flex-col "
        >
          <Card.Section>
            <Image
              src={`/api/${p.heroImage}`}
              height={160}
              alt="Banner Image"
            />
          </Card.Section>

          <Group position="apart" mt="md" mb="xs">
            <Spoiler hideLabel="Collapse" maxHeight={50} showLabel="Expand">
              <Text
                weight={500}
                style={{
                  fontFamily: "Whyte",
                }}
              >
                {p.title}
              </Text>
            </Spoiler>
          </Group>

          <Button
            color="dark"
            className="customButton mt-auto"
            fullWidth
            radius="md"
            onClick={() => push(`/u/${p.User.username}/${p.slugifiedTitle}`)}
          >
            Read More
          </Button>
        </Card>
      ))}
    </SimpleGrid>
  );
}
