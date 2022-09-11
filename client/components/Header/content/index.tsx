import { useUser } from "hooks/useUser";
import styles from "./content.module.scss";
import { Avatar, Button, Menu, Burger } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  IconTrash,
  IconLayoutDashboard,
  IconUserCircle,
  IconSearch,
} from "@tabler/icons";
import { eraseCookie } from "helpers/cookies";
export function NavbarContent() {
  const { user,setUser } = useUser();
  const { push } = useRouter();
  const [opened, setOpened] = useState(false);
  const title = opened ? "Close navigation" : "Open navigation";
  if (!user.username)
    return (
      <Button
        variant="outline"
        className={styles.button}
        onClick={() => push("/auth/signup")}
        color="dark"
      >
        Sign In
      </Button>
    );
  return (
    <>
      <Menu
        shadow="md"
        position="bottom-end"
        width={200}
        closeOnClickOutside
        closeOnEscape
        closeOnItemClick
        onClose={() => setOpened((o) => !o)}
        opened={opened}
      >
        <Menu.Target>
          <Burger
            title={title}
            opened={opened}
            onClick={() => setOpened((o) => !o)}
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item
            icon={<IconLayoutDashboard size={14} />}
            onClick={() => {
              push(user.username ? "/dashboard" : "/");
            }}
          >
            {user.username ? "Dashboard" : "Home"}
          </Menu.Item>
          {user.username ? (
            <Menu.Item
              icon={<IconUserCircle size={14} />}
              onClick={() => {
                push(`/u/${user.username}`);
              }}
            >
              Profile
            </Menu.Item>
          ) : null}
          <Menu.Item
            icon={<IconSearch size={14} />}
            onClick={() => {
              push("/search?tab=term");
            }}
          >
            Search
          </Menu.Item>
          {user.username ? (
            <>
              <Menu.Divider />
              <Menu.Label>Danger zone</Menu.Label>

              <Menu.Item
                color="red"
                icon={<IconTrash size={14} />}
                onClick={() => {
                  eraseCookie("token");
                  setUser({type:"Logout",payload:{}})
                  push("/");

                }}
              >
                Log Out
              </Menu.Item>
            </>
          ) : null}
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
