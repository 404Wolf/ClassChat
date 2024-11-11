import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "classchat-backend/src/trpc/routers";

const url =
  typeof window === "undefined"
    ? "http://server:3000/trpc"
    : "http://localhost:8080/trpc";

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url })],
});

export default client;
export type { AppRouter };
