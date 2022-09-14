import styles from "./Hero.module.scss";
import { Button } from "@mantine/core";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";

const Features = [
  {
    title: "Ease Of Use",
    description:
      "Our platform is very easy to use, it has all the features needed by a user.",
  },
  {
    title: "Low Comission",
    description:
      "We take very less comission out of your pay. You get almost full amount.",
  },
  {
    title: "Multiple Payment Methods",
    description:
      "We support multiple payment methods including UPI and Paytm Wallet.",
  },
];

export function Hero() {
  const isSmallScreen = useMediaQuery("(max-width:700px)", false);
  return (
    <div className={styles.heroContainer}>
      <h1 data-aos="zoom-y-out" data-aos-delay="300">
        A Platform For
        <span
          data-aos="zoom-y-out"
          data-aos-delay="300"
          className={styles.gradientText}
        >
          Everyone.
        </span>
      </h1>
      <div className={styles.buttonContainer} data-aos="zoom-in">
        <Link href="/dashboard" passHref>
          <Button
            variant="filled"
            className="hover:bg-black bg-gray-900"
            color="dark"
          >
            Discover Dashboard
          </Button>
        </Link>
      </div>
      <div className={styles.featuresContainer} data-aos="zoom-in">
        <h2 className={styles.feature}>Features</h2>
        <div
          className={styles.featureContainer}
          style={{
            minWidth: isSmallScreen === false ? "614px" : "unset",
          }}
        >
          <h2 className={styles.featureTitle}>Open Source</h2>
          <p className={styles.featureDescription}>
            {" "}
            Our platform is Open Source. You can read the source code{" "}
            <a
              href="https://github.com/phantomknight287/lend-my-skill"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 cursor-pointer"
            >
              Here.
            </a>
          </p>
        </div>
        {Features.map((f) => (
          <div key={f.title} className={styles.featureContainer}>
            <h2 className={styles.featureTitle}>{f.title}</h2>
            <p className={styles.featureDescription}> {f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
