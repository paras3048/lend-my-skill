import { BaseError } from "components/Error";

const ErrorPage = () => {
  return (
    <BaseError
      code="500"
      title="500 - Internal Server Error"
      description="Our servers could not handle your request. Don't worry, our development team was already notified."
    />
  );
};

export default ErrorPage;
