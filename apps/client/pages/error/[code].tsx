import { Container } from "@mantine/core";
import { NotFoundImage } from "components/404";
import { BaseError } from "components/Error";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";

const ErrorPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  code,
}) => {
  const { query } = useRouter();

  if (code === "404") return <NotFoundImage />;
  if (code === "403")
    return (
      <BaseError
        code="403"
        description={
          Boolean(query.append) === true
            ? `Unfortunately, You're not allowed to access this Page/Resource. ${query.error}`
            : "Unfortunately, You're not allowed to access this Page/Resource"
        }
        title="403 - Forbidden"
      />
    );
  if (code === "401")
    return (
      <BaseError
        code="401"
        title="401 - UnAuthorized"
        description="We are sorry but we are not able to authenticate you. "
      />
    );
  if (code === "500")
    return (
      <BaseError
        code="500"
        title="500 - Internal Server Error"
        description="Our servers could not handle your request. Don't worry, our development team was already notified."
      />
    );
  return null;
};

export default ErrorPage;
export const getStaticPaths: GetStaticPaths<{ code: string }> = async () => {
  const pathsToGenerate = [401, 403, 404, 500];
  return {
    paths: pathsToGenerate.map((p) => ({
      params: {
        code: `${p}`,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ code: string }> = async (req) => {
  return {
    props: {
      code: req.params!.code as string,
    },
  };
};
