export const payload = {
  id: "9114c6d6-374a-4261-982e-6926168d7f8f",
  openedAt: "2022-09-03T07:59:51.341Z",
  messages: [
    {
      createdAt: "2022-09-03T07:59:51.341Z",
      sender: {
        username: "phantomknight287",
        profileURL:
          "images/public/1661603670449-9939106d-ca97-4c23-aa18-a6e31c71cacb-myself.jpg",
      },
      content:
        "This is a Chat Between Gurpal Singh and Gurpal. The Gurpal Singh bought undefined Offer.",
      id: "",
    },
  ],
  sellerId: "a6c9535e-0066-40d3-b6b0-4d93abfb9c7d",
  secondParty: {
    username: "gillsaab",
    profileURL:
      "images/public/1662136749702-b75f75bd-d250-4c98-8790-093cda9d0f5a-logo-transparent.png",
  },
};

export type Chats = typeof payload;

export const MessagesFetchPayload = {
  content:
    "This is a Chat Between Gurpal Singh and Gurpal. The Gurpal Singh bought undefined Offer.",
  createdAt: "2022-09-03T07:59:51.341Z",
  id: "3f944c6a-2978-421d-b0a8-ba0f16ef148e",
  sender: {
    username: "phantomknight287",
    profileURL:
      "images/public/1661603670449-9939106d-ca97-4c23-aa18-a6e31c71cacb-myself.jpg",
  },
  bySystem: true,
  type: "text",
  count: 1,
};

export type Message = typeof MessagesFetchPayload;

export const GatewayMessageCreatePayload = {
  bySystem: false,
  createdAt: "2022-09-04T16:12:09.844Z",
  content: "test message",
  chatId: "9114c6d6-374a-4261-982e-6926168d7f8f",
  type: "text",
  sender: {
    username: "phantomknight287",
    profileURL:
      "images/public/1661603670449-9939106d-ca97-4c23-aa18-a6e31c71cacb-myself.jpg",
  },
  id: "",
};

export type GatewayMessageCreatePayload = typeof GatewayMessageCreatePayload;

export const ReviewPayload = {
  reviews: [
    {
      message:
        "Loved the service offered by Gurpal, he is really professional in his work",
      stars: 5,
      createdAt: "2022-09-05T17:23:04.556Z",
      creatorId: "5441e4bc-9128-4da1-b2a0-f0c513e5c2ec",
      creator: {
        username: "phantomknight287",
        profileURL:
          "images/public/1661603670449-9939106d-ca97-4c23-aa18-a6e31c71cacb-myself.jpg",
      },
      id: "",
    },
  ],
  reviewsCount: 1,
};

export type Reviews = typeof ReviewPayload;
