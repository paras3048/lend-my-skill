import { Header } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import styles from "./Header.module.scss";
import Link from "next/link";
import { NavbarContent } from "./content";
import { useRefetchProfile } from "hooks/useRefetchProfile";

export const Navbar: FC<{}> = () => {
  useRefetchProfile();

  return (
    <Header height={70}>
      <div className={styles.headerContainer}>
        <div className={styles.brandName}>
          <Link href="/" passHref>
            <h2 className="transition-all duration-300">
              <img
                src={"/brand/icon-transparent.png"}
                className={styles.logo}
              />
              <span>Lend My Skill</span>
            </h2>
          </Link>
        </div>
        <div className={styles.buttonContainer}>
          <NavbarContent />
        </div>
      </div>
    </Header>
  );
};
