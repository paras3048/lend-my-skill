import { Hero } from "components";
import { MetaTags } from "components/Meta";
import dynamic from "next/dynamic";
import type { NextPage } from "next";
import styles from "styles/Home.module.scss";

const Footer = dynamic(
  () => import("components").then((m) => m.Footer as any),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center">
        Loading...
      </div>
    ),
  }
);

const Home: NextPage = () => {
  return (
    <div>
      <MetaTags description="A Platform For Everyone." title="Lend My Skill" />
      <Hero />
      {/* <section className={styles.section}>
        <h3 className={styles.heading}>
          Getting Work Done Has Never Been
          <span className={styles.span}>Easier</span>
        </h3>
      </section> */}
      <Footer />
    </div>
  );
};
export default Home;
