import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Cantarell&family=Edu+VIC+WA+NT+Beginner:wght@400;500;600;700&family=Roboto&family=Space+Grotesk&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;0,500;1,300;1,500&family=Mouse+Memoirs&display=swap"
            rel="stylesheet"
          />
          <>
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta
              name="theme-color"
              content={"#" + Math.floor(Math.random() * 16777215).toString(16)}
            />
            <link rel="icon" href="/brand/icon-transparent.png" />
          </>
          {process.env.NODE_ENV === "production" ? (
            <Script
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8135231984104285"
              strategy="lazyOnload"
              crossOrigin="anonymous"
            />
          ) : null}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
