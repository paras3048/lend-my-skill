import styles from "./Hero.module.scss";
import { Button, Divider } from "@mantine/core";
import Link from "next/link";

const Features = [
  {
    title: "Ease Of Use",
    description:
      "Our Platform is Very Easy to Use, It has All The Features Needed By A User.",
  },
  {
    title: "Low Comission",
    description:
      "We Take Very Less Comission out of Your Pay. You Get Almost Full Amount.",
  },
  {
    title: "Multiple Payment Methods",
    description:
      "We Support Multiple Payment Methods including UPI and Paytm Wallet.",
  },
];

export function Hero() {
  return (
    <div className={styles.heroContainer}>
      <h1 data-aos="zoom-y-out" data-aos-delay="300">
        A Platform For
      </h1>
      <h1
        data-aos="zoom-y-out"
        data-aos-delay="300"
        className={styles.gradientText}
      >
        Everyone.
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
