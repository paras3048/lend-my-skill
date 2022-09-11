import { ReactNode } from "react";
import styles from "./card.module.scss";

interface Props {
  props: {
    value: ReactNode;
    desc: ReactNode;
  };
}

export function InfoCard(props: Props) {
  const {
    props: { desc, value },
  } = props;

  return (
    <>
      <div className={styles.container}>
        <span className={styles.span1}>{desc}</span>
        <span className={styles.span2}>{value}</span>
      </div>
    </>
  );
}
