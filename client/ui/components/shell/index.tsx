import { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "../../scss/shell/styles.module.scss";
import { ChatContainer } from "../ChatContainer";
import { ChatSidebar } from "../ChatSidebar";

interface Props {
  sidebarProps: {
    orders: {
      username?: string | undefined;
      lastMessageTiming?: string | undefined;
      lastMessageContent?: string | undefined;
      profileURL?: string | undefined;
      id: string;
    }[];
    setChatId: Dispatch<SetStateAction<string>>;
    bottomChilren?: ReactNode | ReactNode[];
  };
  containerProps: {
    title?: string;
    message?: {
      sender: boolean;
      content: string;
      id: string;
      profileURL: string;
      username: string;
      bySystem?: boolean;
    }[];
    children?: ReactNode;
    topChildren?: ReactNode;
    leftChildren?: ReactNode;
    rightChildren?: ReactNode;
  };
}

export function ChatShell(props: Props) {
  const { sidebarProps, containerProps } = props;
  return (
    <div className={styles.container}>
      <section className={styles.sidebar}>
        <ChatSidebar
          orders={sidebarProps.orders || []}
          setChatId={sidebarProps.setChatId}
          bottomChildren={sidebarProps.bottomChilren}
        />
      </section>
      <section className={styles.chatContainer}>
        <ChatContainer {...containerProps} />
      </section>
    </div>
  );
}
