import styles from "./card.module.scss";
import {
  Button,
  Divider,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";

interface CardProps {
  route: string;
  title: string;
  description: string;
}
export function Card(props: CardProps) {
  const { push } = useRouter();
  return (
    <div className={styles.card}>
      <Text className={styles.title}>{props.title}</Text>
      <Divider
        orientation="horizontal"
        sx={{
          width: "calc( 100% + 3rem )",
        }}
      />
      <Text className={styles.desc}>{props.description}</Text>
      <Button
        className={`${styles.button} customButton`}
        color="dark"
        onClick={() => push(props.route)}
      >
        Visit
      </Button>
    </div>
  );
}
