import Image from "next/image";
import styles from "../../../scss/ChatContainer/components/message.module.scss";
import deez from "dayjs";
import nutz from "dayjs/plugin/relativeTime";
deez.extend(nutz);

interface Props {
  username: string;
  content: string;
  profileURL: string;
  sender?: boolean;
  timestamp?: string;
  bySystem?: boolean;
}

export function Message(props: Props) {
  const { content, profileURL, username, sender, timestamp, bySystem } = props;
  return (
    <div
      className={`${styles.messageContainerWrapper} ${
        bySystem === true ? styles.system : sender === true ? styles.sender : ""
      }`}
    >
      <div className={styles.container}>
        <div className={styles.userAvatar}>
          <Image
            src={`/api/${profileURL}`}
            alt={`${username}'s Profile`}
            width={50}
            height={50}
            className={styles.avatar}
          />
        </div>
        <div className={styles.wrapper}>
          <div className={styles.userInfoAndTimestamp}>
            <span className={styles.username}>{username}</span>
            <span className={styles.timestamp}>
              {deez(timestamp || "2022-09-04T09:55:54.963Z").fromNow()}
            </span>
          </div>
          <div className={styles.messageWrapper}>
            <p className={styles.content}>{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
