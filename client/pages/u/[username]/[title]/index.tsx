import { Avatar, Badge, Button, Group, Tabs } from "@mantine/core";
import axios from "axios";
import { ProfileCard } from "components/Dashboard/Profile";
import { MetaTags } from "components/Meta";
import { StarRating } from "components/Stars";
import { GetFilteredHTML, URLGenerator } from "helpers";
import { useUser } from "hooks/useUser";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import styles from "styles/scss/title.module.scss";
import { Carousel } from "@mantine/carousel";
import Image from "next/future/image";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PaymentModal } from "components/Modals/Payment";
dayjs.extend(relativeTime);
interface Props {
  post: {
    id: string;
    postedAt: string;
    description: string;
    title: string;
    User: {
      username: string;
      acceptingOrders: boolean;
      bio: string;
      name: string;
      profileURL: string;
      rating: number;
      ratedBy: string;
      verified: boolean;
      createdAt: string;
      id: string;
    };
    offers: {
      deliveryTime: number;
      price: number;
      name: string;
      description: string;
      id: string;
    }[];
    heroImage: string;
    images: string[];
    category?: { id: string; name: string }[];
  };
}

export default function Post(props: Props) {
  const { query } = useRouter();
  const [modalOpened, setModalOpened] = useState(false);
  const { post } = props;
  const [value, setValue] = useState(post.offers[0].name);
  const { user } = useUser();
  const [amount, setAmount] = useState(0);

  const messWithModal = (price: number) => {
    setAmount(price);
    setModalOpened(true);
  };

  return (
    <>
      <MetaTags
        description={``}
        title={post.title}
        ogImage={`/api/${post.heroImage}`}
      />
      <div className={styles.container}>
        <div className={styles.information}>
          <div className={styles.title}>
            <h2 className={styles.title}>{post.title}</h2>
          </div>

          <div className={styles.userinfo}>
            {/* <ProfileCard
              acceptingOrders={post.User.acceptingOrders}
              bannerColor=""
              id=""
              name={post.User.name}
              profileURL={post.User.profileURL}
              username={post.User.username}
              verified={post.User.verified}
            /> */}
            <Avatar
              src={`/api/${post.User.profileURL}`}
              alt={`${post.User.username}`}
              className={styles.avatar}
              size="md"
              radius="xl"
            />
            <span className={styles.username}>{post.User.username}</span>
            <div className={styles.rating}>
              <StarRating rating={post.User.rating} />
              {/* <span className={styles.ratingNumber}>{post.User.rating}</span> */}
              <span className={styles.ratedBy}>({post.User.ratedBy})</span>
            </div>
          </div>
          {post.category && post.category.length > 0 ? (
            <p className="mt-4">
              {post.category.map((c) => (
                <Badge color="yellow" variant="filled" key={c.id}>
                  {c.name}
                </Badge>
              ))}
            </p>
          ) : null}
          <div className={styles.carousel}>
            <Carousel
              withIndicators
              height={400}
              slideGap="md"
              align="start"
              slidesToScroll={1}
              className={styles.carouselRoot}
              draggable
            >
              <Carousel.Slide>
                <Image
                  src={`/api/${post.heroImage}`}
                  loading="eager"
                  placeholder="blur"
                  width={200}
                  height={200}
                  alt={`Banner Image`}
                  blurDataURL="/brand/logo.png"
                />
              </Carousel.Slide>
              <Carousel.Slide>
                {post.images.map((image) => (
                  <Image
                    src={`/api/${image}`}
                    key={image}
                    loading="lazy"
                    width={200}
                    alt={`image`}
                    height={200}
                    blurDataURL="/brand/logo.png"
                  />
                ))}
              </Carousel.Slide>
            </Carousel>
          </div>
          <div className={`${styles.offerHiddenForBigScreen} ${styles.offers}`}>
            <div>
              <Tabs value={value} onTabChange={(val) => setValue(val as any)}>
                <Tabs.List grow defaultValue={post.offers[0].name}>
                  {post.offers.map((offer) => (
                    <Tabs.Tab
                      className={styles.tab}
                      value={offer.name}
                      key={offer.name}
                    >
                      {offer.name}
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
                {post.offers.map((offer) => (
                  <Tabs.Panel
                    value={offer.name}
                    key={offer.id}
                    pt="md"
                    className="p-4"
                  >
                    <div className={styles.offer}>
                      <div className={styles.offerNameAndPrice}>
                        <span className={styles.offerName}>{offer.name}</span>
                        <span className={styles.offerPrice}>
                          ₹
                          {offer.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                      </div>
                      <div
                        className={styles.offerDescription}
                        dangerouslySetInnerHTML={{
                          __html: GetFilteredHTML(offer.description),
                        }}
                      />
                      {post.User.id !== user.id && user.verified === true ? (
                        <Group position="center" mt="xl">
                          <Button
                            className={`${styles.button} customButton`}
                            onClick={() => messWithModal(offer.price)}
                          >
                            Continue
                          </Button>
                        </Group>
                      ) : null}
                    </div>
                  </Tabs.Panel>
                ))}
              </Tabs>
            </div>
          </div>
          <article
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: GetFilteredHTML(post.description),
            }}
          ></article>
          <h2 className={styles.aboutTheSellerHeading}>About The User</h2>
          <section className={styles.aboutTheSeller}>
            <div className={styles.sellerBox}>
              <div className={styles.leftDetail}>
                <div>
                  <span>Name</span>
                  <span>{post.User.name}</span>
                </div>
                <div>
                  <span>Joined</span>
                  <span>{dayjs(post.User.createdAt).fromNow()}</span>
                </div>
              </div>
              <div className={styles.rightDetail}>
                <div>
                  <span>Verified</span>
                  <span>{post.User.verified ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span>Accepting Orders</span>
                  <span>{post.User.acceptingOrders ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className={styles.offers}>
          <div>
            <Tabs value={value} onTabChange={(val) => setValue(val as any)}>
              <Tabs.List grow defaultValue={post.offers[0].name}>
                {post.offers.map((offer) => (
                  <Tabs.Tab
                    className={styles.tab}
                    value={offer.name}
                    key={offer.name}
                  >
                    {offer.name}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              {post.offers.map((offer) => (
                <Tabs.Panel
                  value={offer.name}
                  key={offer.id}
                  pt="md"
                  className="p-4"
                >
                  <div className={styles.offer}>
                    <div className={styles.offerNameAndPrice}>
                      <span className={styles.offerName}>{offer.name}</span>
                      <span className={styles.offerPrice}>
                        ₹
                        {offer.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                    <div
                      className={styles.offerDescription}
                      dangerouslySetInnerHTML={{
                        __html: GetFilteredHTML(offer.description),
                      }}
                    />
                    {post.User.id !== user.id ? (
                      <Group position="center" mt="xl">
                        <Button
                          className={`${styles.button} customButton`}
                          onClick={() => messWithModal(offer.price)}
                        >
                          Continue
                        </Button>
                      </Group>
                    ) : null}
                  </div>
                </Tabs.Panel>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
      <PaymentModal
        props={{
          opened: modalOpened,
          setOpened: setModalOpened,
          buyerId: user.id,
          sellerId: post.User.id,
          orderType: "SERVICE_PURCHASE",
          price: amount,
          sellerName: post.User.name,
          packageName: value,
        }}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await axios
    .post(URLGenerator("FetchPost"), {
      username: query.username,
      title: query.title,
    })
    .catch((err) => {
      console.log(err);
      return err.response?.data?.statusCode || 500;
    });
  if (data === 404 || data === 500)
    return {
      redirect: {
        destination: `/error/${data}`,
        permanent: false,
      },
    };
  if (data === null) {
    return {
      redirect: {
        destination: "/error/500",
        permanent: false,
      },
    };
  }
  return {
    props: {
      post: data.data,
    },
  };
};
