import { Accordion, Button, Center, createStyles } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { URLGenerator } from "helpers";
import { readCookie } from "helpers/cookies";
import { useRouter } from "next/router";
interface NotificationProps {
  name: string;
  description: string;
  messWithNotifications: () => void;
  id: string;
}

export function Notification(props: NotificationProps) {
  const { replace } = useRouter();
  async function markAsRead() {
    const cookie = readCookie("token");
    if (!cookie) return void replace("/error/403");
    axios
      .patch(URLGenerator("FetchAllNotifications", [props.id]), undefined, {
        headers: {
          authorization: cookie!,
        },
      })
      .then(() => props.messWithNotifications())
      .catch((err) => {
        return void replace(`/error/${String(err.response.status)}`);
      });
  }

  return (
    <>
      <Accordion.Item
        value="customization"
        sx={() => ({
          width: "max-content",
        })}
      >
        <Accordion.Control>{props.name}</Accordion.Control>
        <Accordion.Panel>
          <>
            {props.description}
            <Center>
              <Button
                className="hover:bg-black bg-gray-900"
                color="dark"
                radius="md"
                onClick={markAsRead}
              >
                Mark As Read
              </Button>
            </Center>
          </>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}
