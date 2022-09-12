import { MetaTags } from "components/Meta";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { readCookie } from "helpers/cookies";
import { URLGenerator } from "helpers";
import { ChatShell } from "ui/components/shell";
import { Chats, GatewayMessageCreatePayload, Message } from "types";
import { useUser } from "hooks/useUser";
import { Button, Group, Input, Menu, Modal, Tabs } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { BACKEND_URL } from "constants/index";
import { useForm } from "@mantine/form";
import { io, Socket } from "socket.io-client";
import { IconDotsVertical } from "@tabler/icons";

export default function Chat() {
  const { isReady, query, push } = useRouter();
  const [initialValue, _] = useState(query.type || "buyer");
  const [chatId, setChatId] = useState("");
  const [chats, setChats] = useState<Chats[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useUser();
  const [socket, setIO] = useState<Socket>();
  const [count, setCount] = useState(0);
  const [modalOpened, setModalOpened] = useState(false);
  useEffect(() => {
    const token = readCookie("token")!;
    if (!chatId) return;
    setIO(
      io(BACKEND_URL, {
        auth: {
          token,
        },
        query: {
          chatId,
        },
      })
    );
    return () => {
      socket?.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    socket?.on("MESSAGE_CREATE", (payload: GatewayMessageCreatePayload) => {
      fetchMessage();
    });
  }, [socket]);

  function sendMessage(e: typeof form.values) {
    socket?.emit("MESSAGE_CREATE", {
      userId: user.id,
      chatId,
      content: e.content,
      type: "text",
    });
    form.reset();
    fetchMessage();
  }

  const form = useForm({
    initialValues: {
      content: "",
    },
  });
  useEffect(() => {
    if (!query.type) return;
    const authorization = readCookie("token")!;
    axios
      .post(
        URLGenerator("FetchChats"),
        {
          type: query.type,
        },
        {
          headers: {
            authorization,
          },
        }
      )
      .then(({ data }) => {
        setChats(data);
      })
      .catch((err) => {
        showNotification({
          message: err.response?.data?.message || "An Error Occured",
          color: "red",
          autoClose: 10000,
        });
      });
  }, [query.type]);

  function markOrderAsComplete() {
    const cookie = readCookie("token");
    if (!chatId) return;
    if (!cookie) return;
    axios
      .patch(
        URLGenerator("MarkOrderAsComplete"),
        { chatId },
        {
          headers: {
            authorization: cookie!,
          },
        }
      )
      .then(() =>
        showNotification({
          message: "This Order is Marked As Completed",
          color: "green",
          autoClose: 10000,
        })
      )
      .catch((err) =>
        showNotification({
          message: err.response?.data?.message || "An Error Occured",
          color: "red",
          autoClose: 10000,
        })
      );
  }

  function fetchMessage(take?: number, skip?: number) {
    const cookie = readCookie("token");
    if (!chatId) return;
    axios
      .get(
        `${BACKEND_URL}/messages/${chatId}/${query.type}?take=${
          take || ""
        }&skip=${skip || 0}`,
        {
          headers: {
            authorization: cookie!,
          },
        }
      )
      .then(({ data }) => {
        setMessages(data.messages);
        setCount(data.count);
      })
      .catch((err) => {
        return showNotification({
          message: err.response?.data?.message || "An Error Occured",
          color: "red",
        });
      });
  }

  useEffect(() => {
    fetchMessage();
  }, [chatId]);
  if (isReady === false) return null;

  return (
    <>
      <MetaTags description="" title="Chats" />

      <ChatShell
        sidebarProps={{
          orders: chats.map((chat) => ({
            id: chat.id,
            lastMessageContent: chat.messages[0].content,
            lastMessageTiming: chat.messages[0].createdAt,
            profileURL: chat.secondParty.profileURL,
            username: chat.secondParty.username,
          })),
          setChatId: setChatId,
          bottomChilren: (
            <>
              <Tabs
                defaultValue={initialValue as string}
                onTabChange={(e) =>
                  push({
                    pathname: "/chat",
                    query: {
                      type: e || query.type,
                    },
                  })
                }
              >
                <Tabs.List grow>
                  <Tabs.Tab value="seller">Received</Tabs.Tab>
                  <Tabs.Tab value="buyer">Created</Tabs.Tab>
                </Tabs.List>
              </Tabs>
            </>
          ),
        }}
        containerProps={{
          title: chats.find((c) => c.id === chatId)?.secondParty.username || "",
          message: (messages || []).map((m) => ({
            content: m.content,
            id: m.id,
            profileURL: m.sender.profileURL,
            sender: m.sender.username === user.username,
            username: m.sender.username,
            bySystem: m.bySystem,
          })),
          children: (
            <>
              <form
                onSubmit={form.onSubmit((e) => sendMessage(e))}
                className="mt-auto"
              >
                <Input
                  placeholder={`Send Message to ${
                    chats.find((c) => c.id === chatId)?.secondParty.username
                  }`}
                  {...form.getInputProps("content")}
                />
              </form>
            </>
          ),
          topChildren: (
            <>
              {count > messages?.length ? (
                <Button
                  color="dark"
                  className="customButton"
                  onClick={() => fetchMessage(30, messages?.length)}
                >
                  Load Earlier Messages
                </Button>
              ) : null}
            </>
          ),
          rightChildren: (
            <>
              <IconDotsVertical
                size={20}
                className="cursor-pointer"
                onClick={() => setModalOpened((o) => !o)}
              />
            </>
          ),
        }}
      />
      <Modal
        centered
        padding="md"
        shadow={"xl"}
        opened={modalOpened}
        onClose={() => setModalOpened((o) => !o)}
        title="Options"
      >
        <Group position="center" my="xl" mb="xl">
          <Button
            className="customButton"
            color="dark"
            onClick={markOrderAsComplete}
          >
            Mark Order As Complete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
