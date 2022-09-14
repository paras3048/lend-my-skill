import { ReactNode } from "react";
import styles from "../../../scss/ChatSidebar/components/header/styles.module.scss";

interface Props {
  title?: string;
  bottomChildren?: ReactNode | ReactNode[];
}

export function ChatSidebarHeader(props: Props) {
  return (
    <div className={styles.container}>
      <span>{props.title || "My Orders"}</span>
      {props.bottomChildren || null}
    </div>
  );
}
