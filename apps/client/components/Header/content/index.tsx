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
import Link from "next/link";
export function NavbarContent() {
  const { user, setUser } = useUser();
  const { push } = useRouter();
  const [opened, setOpened] = useState(false);
  const title = opened ? "Close navigation" : "Open navigation";
  if (!user.username)
    return (
      <nav className="flex flex-grow">
        <ul className="flex flex-grow justify-end flex-wrap items-center">
          <li>
            <Link href="/search">
              <a className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">
                Search A Talent
              </a>
            </Link>
          </li>
          <li>
            <Link href="/auth/login">
              <a className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">
                Sign In
              </a>
            </Link>
          </li>
          <li>
            <Link href="/auth/signup" passHref>
              <a className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3 cursor-pointer p-4">
                <span>Sign up</span>
                <svg
                  className="w-3 h-3 fill-current text-gray-400 flex-shrink-0 ml-2 -mr-1"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                    fillRule="nonzero"
                  />
                </svg>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
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
                  setUser({ type: "Logout", payload: {} });
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
