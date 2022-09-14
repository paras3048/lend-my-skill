import { useContext } from "react";
import { UserContext } from "context/user";

export function useUser() {
  const data = useContext(UserContext);
  if (data === null)
    throw new Error("Application Not Wrapped in `UserProvider`");
  return data;
}
