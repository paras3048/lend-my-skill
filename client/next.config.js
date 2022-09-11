const { join } = require("path");
const withMdx = require("@next/mdx");

/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});
module.exports = withBundleAnalyzer(
  withMdx({
    extension: /\.mdx?$/,
    options: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  })({
    reactStrictMode: true,
    compiler: {
      styledComponents: true,
    },
    sassOptions: {
      includePaths: [
        join(__dirname, "styles"),
        join(__dirname, "components"),
        join(__dirname, "layout"),
        join(__dirname, "ui"),
      ],
    },
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: "top-right",
    },
    images: {
      domains: ["localhost"],
    },
    async rewrites() {
      return [
        {
          source: "/api/images/public/:config",
          destination: `${process.env.STORAGE_BUCKET_URL}/:config`,
        },
      ];
    },
  })
);
