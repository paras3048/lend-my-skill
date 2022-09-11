import { Container, Tabs, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { DashboardSidebar } from "components/Dashboard/Sidebar";
import { MetaTags } from "components/Meta";
import dayjs from "dayjs";
import r from "dayjs/plugin/relativeTime";
dayjs.extend(r);
import { URLGenerator } from "helpers";
import { readCookie } from "helpers/cookies";
import Link from "next/link";
import { useEffect, useState } from "react";
import dashboardStyles from "styles/scss/dashboard.module.scss";
import styles from "styles/scss/orders.module.scss";

interface Orders {
  id: string;
  createdAt: string;
  status: "incomplete" | "complete";
}

export default function ShowOrders() {
  const [receivedOrders, setReceivedOrders] = useState<Orders[]>([]);
  const [createdOrders, setCreatedOrders] = useState<Orders[]>([]);

  useEffect(() => {
    const cookie = readCookie("token");
    axios
      .get(URLGenerator("FetchCreatedOrders"), {
        headers: {
          authorization: cookie!,
        },
      })
      .then(({ data }) => {
        setCreatedOrders(data);
      })
      .catch(() => {
        showNotification({
          message: "An Error Occured While Fetching Orders",
          color: "red",
        });
      });
    axios
      .get(URLGenerator("FetchReceivedOrders"), {
        headers: {
          authorization: cookie!,
        },
      })
      .then(({ data }) => {
        setReceivedOrders(data);
      })
      .catch(() => {
        showNotification({
          message: "An Error Occured While Fetching Orders",
          color: "red",
        });
      });
  }, []);

  return (
    <>
      <div className={dashboardStyles.container}>
        <MetaTags
          description="View All Orders Related To Your Account"
          title="Orders"
        />
        <DashboardSidebar />
        <Container mt="xl">
          <Tabs defaultValue={"r"}>
            <Tabs.List grow>
              <Tabs.Tab value="r">Orders Received</Tabs.Tab>
              <Tabs.Tab value="c">Orders Created</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="r">
              {receivedOrders && receivedOrders.length > 0 ? (
                <>
                  {receivedOrders.map((order) => (
                    <Order key={order.id} {...order} type="seller" />
                  ))}
                </>
              ) : (
                <>
                  <Text>Nothing to See Here 😜</Text>
                </>
              )}
            </Tabs.Panel>
            <Tabs.Panel value="c">
              {createdOrders && createdOrders.length > 0 ? (
                <>
                  {createdOrders.map((order) => (
                    <Order key={order.id} {...order} type={"buyer"} />
                  ))}
                </>
              ) : (
                <>
                  <Text>Nothing to See Here 😜</Text>
                </>
              )}
            </Tabs.Panel>
          </Tabs>
        </Container>
      </div>
    </>
  );
}

function Order(order: Orders & { type: "buyer" | "seller" }) {
  return (
    <>
      <div className={styles.orderContainer}>
        <Link href={`/order/${order.id}?type=${order.type}`}>
          <a className="text-blue-500">Id: {order.id}</a>
        </Link>
        <p>Created {dayjs(order.createdAt).fromNow()}</p>
      </div>
    </>
  );
}
