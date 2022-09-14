import { Avatar, extractSystemStyles, Text, Title } from "@mantine/core";
import { IconAt, IconShoppingCart, IconStar } from "@tabler/icons";
import { FC } from "react";
import styles from "./profile.module.scss";
interface ProfileProps {
  profileURL: string;
  username: string;
  name: string;
  bio: string;
  rating: string | number;
  ratedBy: string | number;
  acceptingOrders: boolean;
}

export const Profile: FC<ProfileProps> = ({
  bio,
  name,
  profileURL,
  username,
  acceptingOrders,
  rating,
}) => {
  return (
    <>
      <div className={styles.profileContainer}>
        <div className={styles.baseDetailsContainer}>
          <Avatar
            src={`/api/${profileURL}`}
            className={styles.avatar}
            alt={`${username}'s Avatar`}
            size={200}
            radius="xl"
          />
          <div className={styles.names}>
            <Title order={2} className={styles.name}>
              {name}
            </Title>
            <div className={styles.username}>
              <div>
                <IconAt size={20} />
                {username}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bio}>{bio}</div>
        <div className={styles.otherInfo}>
          <div className={styles.rating}>
            {rating}
            <IconStar size={20} />
          </div>

          <div className={styles.rating}>
            <IconShoppingCart size={20} />
            {acceptingOrders === true ? "Yes" : "No"}
          </div>
        </div>
      </div>
    </>
  );
};

Profile.displayName = "User-Base-Profile";
