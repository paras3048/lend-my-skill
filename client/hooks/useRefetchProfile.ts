import axios from "axios";
import { URLGenerator } from "helpers";
import { createCookie, readCookie } from "helpers/cookies";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "./useUser";

export function useRefetchProfile() {
  const { setUser, user } = useUser();
  const { replace } = useRouter();
  useEffect(() => {
    if (user.id) return;
    const cookie = readCookie("token");
    if (!cookie) return;
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
      .catch((err) => {
        console.log(err);
        if (process.env.NODE_ENV !== "development") replace("/error/500");
      });
  }, []);
}
