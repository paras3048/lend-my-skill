import { Text } from "@mantine/core";
import { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "../../scss/ChatSidebar/styles.module.scss";
import { Order } from "./components/chat";
import { ChatSidebarHeader } from "./components/header";

interface Props {
  orders: {
    username?: string;
    lastMessageTiming?: string;
    lastMessageContent?: string;
    profileURL?: string;
    id: string;
  }[];
  setChatId: Dispatch<SetStateAction<string>>;
  bottomChildren?: ReactNode | ReactNode[];
}

export function ChatSidebar(props?: Props) {
  return (
    <>
      <ChatSidebarHeader bottomChildren={props?.bottomChildren} />
      <div className={styles.ordersContainer}>
        {props && props.orders.length > 0 ? (
          props.orders.map((msg) => {
            return (
              <div onClick={() => props.setChatId(msg.id)} key={msg.id}>
                <Order {...msg} />
              </div>
            );
          })
        ) : (
          <Text align="center">No Order Found With Selected Type</Text>
        )}
      </div>
    </>
  );
}
