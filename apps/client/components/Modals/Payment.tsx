import { Button, Checkbox, Group, Modal } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Script from "next/script";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL, RAZORPAY_KEY } from "constants/index";
import { readCookie } from "helpers/cookies";
import { useUser } from "hooks/useUser";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
interface PaymentProps {
  price: number;
  orderType: string;
  sellerId: string;
  buyerId: string;
  title?: string;
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  sellerName: string;
  packageName: string;
}

export function PaymentModal(p: { props: PaymentProps }) {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const { props } = p;
  const {
    buyerId,
    opened,
    orderType,
    price,
    sellerId,
    setOpened,
    title,
    sellerName,
    packageName,
  } = props;
  const [agreed, setAgreed] = useState(false);
  const { user } = useUser();
  const { query } = useRouter();
  useEffect(() => {
    const cookie = readCookie("token")!;
    setSocket(
      io(BACKEND_URL, {
        auth: {
          token: cookie,
        },
        query: {
          userId: user.id,
        },
      })
    );
    return () => {
      return void socket?.disconnect();
    };
  }, [user.id]);

  useEffect(() => {
    if (socket === undefined) return;
    socket.on("exception", (msg) => {
      return showNotification({
        message: msg.message,
        color: "red",
        autoClose: 4000,
      });
    });
    socket.on("ORDER_CREATE", ({ orderId }: { orderId: string }) => {
      const options = {
        key: RAZORPAY_KEY,
        name: "Lend My Skill",
        currency: "INR",
        amount: price * 100,
        order_id: orderId,
        description: "Thanks For Using Our Platform.",
        image: "/brand/logo.png",
        handler: function () {
          showNotification({
            message: "Payment Successful!",
            color: "green",
          });
          setOpened(false);
        },
      };
      // @ts-ignore Trust Me Bruh
      if (window.Razorpay === undefined) {
        return showNotification({
          message: "Razorpay SDK Failed To Load. Please Try Again Later",
          color: "red",
          autoClose: 10000,
        });
      }
      //@ts-ignore Trust Me Again Bruh
      new window.Razorpay(options).open();
    });
  }, [socket]);

  const startTransaction = () => {
    // @ts-ignore Trust Me Bruh
    if (window.Razorpay === undefined) {
      return showNotification({
        message: "Razorpay SDK Failed To Load. Please Try Again Later",
        color: "red",
        autoClose: 10000,
      });
    }
    socket?.emit("ORDER_CREATE", {
      amount: price * 100,
      buyerId,
      sellerId,
      packageName,
      postingTitle:query.title
    });
  };

  return (
    <Modal
      centered
      title={
        title || (
          <>Pay ₹{price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}*</>
        )
      }
      opened={opened}
      onClose={() => setOpened((o) => !o)}
    >
      You&apos;re Paying ₹
      {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}* to {sellerName}
      <p>
        * &rarr; The Price Shown Above Doesn&apos;t include Gateway Charges and
        other Taxes.
      </p>
      <Checkbox
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        label={
          <>
            I Agree to{" "}
            <a
              href="/terms/payment"
              target="_blank"
              rel="norefferer noopener"
              className="text-blue-600 cursor-pointer"
            >
              {" "}
              Payment Terms
            </a>{" "}
            to Use This Platform
          </>
        }
      />
      <Script
        strategy="lazyOnload"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Group position="center" mt="xl">
        <Button
          color="dark"
          disabled={!agreed}
          className="customButton"
          onClick={startTransaction}
        >
          Pay Securely
        </Button>
      </Group>
    </Modal>
  );
}
