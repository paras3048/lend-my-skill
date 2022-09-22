import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { BACKEND_URL } from "constants/index";
import { URLGenerator } from "helpers";
import { createCookie, readCookie } from "helpers/cookies";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "./useUser";

export function useRefetchProfile() {
  const { setUser, user } = useUser();
  const { replace, asPath, reload } = useRouter();
  useEffect(() => {
    if (user.id) return;
    const cookie = readCookie("token");
    if (!cookie) return;
    if (
      asPath.includes("/dashboard") ||
      asPath.includes("/orders") ||
      asPath.includes("/chat")
    ) {
      axios
        .post(`${BACKEND_URL}/jwt`, undefined, {
          headers: {
            authorization: cookie,
          },
        })
        .catch((err) => {
          showNotification({
            message: err.response?.data?.message || "An Error Occured",
            color: "red",
            autoClose: 5000,
          });
          if (err.response?.data?.message) {
            return replace({
              pathname: "/error/403",
              query: {
                append: true,
                error: err.response.data.message,
              },
            });
          }
          replace(`/error/403`);
        });
    }
    axios
      .get(URLGenerator("FetchProfile"), {
        headers: {
          authorization: cookie,
        },
      })
      .then((data) => {
        createCookie("token", data.data.token, 10);
        setUser({
          payload: data.data.user,
          type: "SetUser",
        });
      })
      .catch(() => {
        if (process.env.NODE_ENV !== "development") replace("/error/500");
      });
  }, []);
}
