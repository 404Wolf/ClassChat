import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  wsLink,
  splitLink,
} from "@trpc/client";
import type { AppRouter } from "classchat-backend/src/trpc/routers";

const getUrl = (proto: string, increment: number = 0): string => {
  const baseUrl = typeof window === "undefined" ? "server" : "localhost";
  const basePort = typeof window === "undefined" ? 3000 : 8080;
  return `${proto}://${baseUrl}:${basePort + increment}/trpc`;
};

const wsClient = createWSClient({
  url: getUrl("ws", 1),
});

const client = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: getUrl("http", 0),
      }),
    }),
  ],
});

export default client;
export type { AppRouter };
