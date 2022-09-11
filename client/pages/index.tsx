import { Footer, Hero } from "components";
import { MetaTags } from "components/Meta";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div>
      <MetaTags description="A Platform For Everyone." title="Lend My Skill" />

      <Hero />
      <Footer />
    </div>
  );
};
export default Home;
