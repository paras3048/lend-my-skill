import styles from "./profileCard.module.scss";
import type { User } from "types/context";
import { Avatar, Badge } from "@mantine/core";

export function ProfileCard(props: User & { hideOtherDetails?: boolean }) {
  const {
    acceptingOrders,
    name,
    profileURL,
    username,
    verified,
    hideOtherDetails,
  } = props;
  return (
    <>
      <div className={styles.container}>
        <div className={styles.avatarContainer}>
          <Avatar
            src={`/api/${profileURL}`}
            className={`${styles.avatar} `}
            alt={`${username}'s Avatar`}
            size={200}
            radius="xl"
          />
        </div>
        <div className={styles.information}>
          <div className={styles.content}>
            <h3>
              {name}
              <span>@ {username}</span>
            </h3>
          </div>
          {hideOtherDetails !== true ? (
            <div className={styles.otherInformation}>
              <Badge
                color={verified === true ? "green" : "red"}
                variant="filled"
                style={{
                  textTransform: "none",
                }}
              >
                {verified === true ? "Verfied" : "UnVerified"}
              </Badge>
              <Badge
                color={acceptingOrders === true ? "green" : "red"}
                variant="filled"
                className="ml-4"
                style={{
                  textTransform: "none",
                }}
              >
                {acceptingOrders === true
                  ? "Accepting Orders"
                  : "Not Accepting Orders"}
              </Badge>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
