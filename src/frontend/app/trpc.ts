import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "classchat-backend";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://server:3000/trpc",
    }),
  ],
});

export default client;
