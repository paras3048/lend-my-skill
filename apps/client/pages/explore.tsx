import { Carousel } from "@mantine/carousel";
import { Center, Container, Title } from "@mantine/core";
import { MetaTags } from "components/Meta";

const Items = [
  {
    name: "Web Developer",
    image: "/explore/webdev.jpg",
    id: "cl7voss9v0048i5abitywwyaf",
  },
  {
    name: "Blog Writing",
    image: "/explore/blog.jpg",
    id: "cl82osjow00661labfrdf1ahx",
  },
  {
    name: "Data Entry",
    image: "/explore/dataentry.jpg",
    id: "cl82ouvto00771labhel2f4a5",
  },
];

export default function Explore() {
  return (
    <Container mt="xl">
      <MetaTags
        title="Explore | Lend My Skills"
        description="Explore Some Featured Categories and Hire Freelancers based on your needs."
      />
      <Center>
        <Title
          style={{
            fontFamily: "Whyte",
          }}
        >
          Find Talents Based On Your Requirements
        </Title>
      </Center>
      <Carousel
        withIndicators
        height={200}
        slideSize="33.333333%"
        slideGap="md"
        loop
        align="start"
        slidesToScroll={3}
      >
        {Items.map((i) => (
          <Carousel.Slide key={i.id}>
            <div className="" style={{ isolation: "isolate" }}>
              <img src={i.image} className="z-[-20]" />
              <span className="text-xl text-black relative">{i.name}</span>
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  );
}
