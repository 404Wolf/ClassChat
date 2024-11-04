import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "classchat-backend/src/trpc/routers";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8080/trpc",
    }),
  ],
});

export default client;
export type { AppRouter };
