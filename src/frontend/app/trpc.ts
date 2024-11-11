import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "classchat-backend/src/trpc/routers";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://server:3000/trpc",
    }),
  ],
});

export default client;
export type { AppRouter };
