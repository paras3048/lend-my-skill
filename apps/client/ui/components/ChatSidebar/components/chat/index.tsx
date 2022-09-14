import { Avatar } from "@mantine/core";
import styles from "../../../../scss/ChatSidebar/components/chat/styles.module.scss";
import d from "dayjs";
import r from "dayjs/plugin/relativeTime";

d.extend(r);

interface Props {
  username?: string;
  lastMessageTiming?: string;
  lastMessageContent?: string;
  profileURL?: string;
}

export function Order(props: Props) {
  const { lastMessageContent, username, profileURL } = props;
  return (
    <div className={styles.container}>
      <div className={styles.order}>
        <div className={styles.userInfo}>
          <Avatar
            src={profileURL ? `/api/${profileURL}` : "/brand/logo.png"}
            size={50}
            radius="xl"
          />
          <div className={styles.wrapper}>
            <div className={styles.usernameAndTimeStamp}>
              <span className={styles.username}>{username || "John Doe"}</span>
            </div>
            <p className={styles.content}>
              {lastMessageContent ||
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem maiores repellendus obcaecati esse delectus eum fugit neque magni ut, deserunt vel excepturi reprehenderit quia harum non voluptatem velit soluta. Itaque quae blanditiis est labore, eos iure commodi nulla, cum eius distinctio saepe atque a, adipisci eaque rerum sequi accusamus. Minima!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
