import { Header } from "@mantine/core";
import { FC } from "react";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavbarContent } from "./content";
import { useRefetchProfile } from "hooks/useRefetchProfile";

export const Navbar: FC<{}> = () => {
  const router = useRouter();
  useRefetchProfile();
  return (
    <Header height={70}>
      <div className={styles.headerContainer}>
        <div className={styles.brandName}>
          <Link href="/" passHref>
            <h2>Lend My Skill</h2>
          </Link>
        </div>
        <div className={styles.buttonContainer}>
          <NavbarContent />
        </div>
      </div>
    </Header>
  );
};
