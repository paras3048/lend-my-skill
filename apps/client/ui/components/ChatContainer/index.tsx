import { ChatContainerHeader } from "./components/Header";
import { Message } from "./components/Message";
import { ReactNode } from "react";

interface Props {
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
}

export function ChatContainer(props: Props) {
  const { message, title, children, topChildren, leftChildren, rightChildren } =
    props;
  return (
    <div className="flex flex-col h-[100%]">
      <ChatContainerHeader
        title={title}
        leftChildren={leftChildren}
        rightChildren={rightChildren}
      />
      <div>
        {topChildren ? topChildren : null}
        {message && message.length > 0 ? (
          message.map((m) => <Message {...m} key={m.id} />)
        ) : (
          <Skeletons />
        )}
      </div>
      {children ? children : null}
    </div>
  );
}

import { Skeleton } from "@mantine/core";
import styles from "styles/scss/chats/messages/messages.module.scss";

export function Skeletons() {
  return (
    <>
      <div className={styles.skeletonContainer}>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </div>
      <div className={styles.skeletonContainer}>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </div>
      <div className={styles.skeletonContainer}>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </div>
      <div className={styles.skeletonContainer}>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </div>
      <div className={styles.skeletonContainer}>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </div>
      <div className={styles.skeletonContainer}>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </div>
    </>
  );
}
