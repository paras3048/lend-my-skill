import "../styles/globals.scss";
import type { AppProps } from "next/app";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar, RouterTransition } from "components";
import { NotificationsProvider } from "@mantine/notifications";
import Aos from "aos";
import "aos/dist/aos.css";
import { UserProvider } from "context/user";

function MyApp({ Component, pageProps, router }: AppProps) {
  const [colorScheme] = useState<ColorScheme>("light");
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <UserProvider>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={() => {}}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
          }}
        >
          <NotificationsProvider>
            <RouterTransition />
            <Navbar />
            <AnimatePresence mode="wait">
              <motion.div
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                key={router.pathname}
              >
                <Component {...pageProps} />
              </motion.div>
            </AnimatePresence>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </UserProvider>
  );
}

export default MyApp;
