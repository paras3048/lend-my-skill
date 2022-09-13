import { Routes } from "../types/routes";
import { BACKEND_URL } from "../constants";
import axios from "axios";
import sanitize from "sanitize-html";
import Showdown from "showdown";
import { readCookie } from "./cookies";
export function URLGenerator(
  route: keyof typeof Routes,
  params?: string[],
  queryString?: string[]
) {
  return `${BACKEND_URL}${Routes[route]}/${(params || []).join("/")}?${(
    queryString || []
  ).join("&")}`;
}

export async function UploadImages(images: File[], formDataField = "file") {
  const cookie = readCookie("token");
  const urls = [];
  for (const image of images) {
    const formData = new FormData();
    formData.append(formDataField, image);
    const data = await axios
      .post(URLGenerator("Upload"), formData, {
        headers: {
          authorization: cookie!,
        },
      })
      .catch((_) => null);
    if (data == null) return { error: true };
    urls.push(data.data.path);
  }
  return urls;
}

export function GetFilteredHTML(md: string) {
  return sanitize(
    new Showdown.Converter({
      emoji: true,
      customizedHeaderId: true,
      tables: true,
      strikethrough: true,
      ghCodeBlocks: true,
      underline: true,
      ghCompatibleHeaderId: true,
      openLinksInNewWindow: true,
    }).makeHtml(md),
    {
      allowedTags: [
        "div",
        "span",
        "code",
        "img",
        "a",
        "table",
        "thead",
        "tbody",
        "br",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "li",
        "p",
        "marquee",
        "b",
        "strong",
        "i",
        "u",
        "code",
        "pre",
        "ol",
        "s"
      ],
      disallowedTagsMode: "escape",
    }
  );
}
