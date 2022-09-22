import { GetStaticProps } from "next";
import { readdirSync } from "fs";
import { join } from "path";

export default function ChangeLog() {
  return (
    <>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius recusandae
      fuga voluptatem voluptatibus nisi atque, ipsa perferendis blanditiis rerum
      veniam!
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const files = readdirSync(join(process.cwd(), "pages/changelog"));
  console.log(files, __dirname);
  console.log(files.filter((r) => r.endsWith(".mdx")));
  return {
    props: {},
  };
};
