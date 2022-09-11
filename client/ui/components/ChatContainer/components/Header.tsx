import { ReactNode } from "react";
import styles from "../../../scss/ChatContainer/components/header.module.scss";

interface Props {
  title?: string;
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
}

export function ChatContainerHeader(props: Props) {
  const { leftChildren, rightChildren, title } = props;
  return (
    <div className={styles.container}>
      {leftChildren ? leftChildren : null}
      <span className={styles.title}>{title || "Order"}</span>
      {rightChildren ? rightChildren : null}
    </div>
  );
}
