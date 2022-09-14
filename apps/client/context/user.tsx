import { createContext, ReactNode, useReducer } from "react";
import { User } from "../types/context";

enum Events {
  SetUser,
  Logout,
}

type Context = {
  user: User;
  setUser: (payload: {
    type: keyof typeof Events;
    payload: Partial<User> | null;
  }) => void;
};

export const UserContext = createContext<Context | null>(null);
UserContext.displayName = "Lend-My-Skill-User-Context-Provider";

const reducer = (
  state: Partial<User>,
  action: {
    type: keyof typeof Events;
    payload: Partial<User> | null;
  }
): Partial<User> => {
  switch (action.type) {
    case "Logout": {
      return { acceptingOrders: false, bannerColor: "" };
    }
    case "SetUser": {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
};

export function UserProvider({
  children,
}: {
  children: ReactNode[] | ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {});
  return (
    <UserContext.Provider
      value={{
        user: state as unknown as User,
        setUser: dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
